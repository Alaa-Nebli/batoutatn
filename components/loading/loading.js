import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Typewriter from 'typewriter-effect';

const LoadingScreen = () => {
  const mountRef = useRef(null);
  const animationFrameId = useRef(null);

  useEffect(() => {
    let camera, scene, renderer, globe, logoBillboard, clock;

    const createLogoBillboard = () => {
      // Create a plane geometry for the logo
      const geometry = new THREE.PlaneGeometry(0.3, 0.3); // Adjust size as needed
      
      // Load the logo texture
      const textureLoader = new THREE.TextureLoader();
      const logoTexture = textureLoader.load('/Batouta_Logo.png');
      logoTexture.colorSpace = THREE.SRGBColorSpace;
      
      // Create material with the logo texture
      const material = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      
      // Create the billboard mesh
      const billboard = new THREE.Mesh(geometry, material);
      
      return billboard;
    };

    const init = () => {
      clock = new THREE.Clock();

      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#ffffff'); // Set scene background to white
      
      camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(4.5, 2, 3);

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountRef.current.appendChild(renderer.domElement);

      // Sun (directional light)
      const sun = new THREE.DirectionalLight('#ffffff', 2);
      sun.position.set(0, 0, 3);
      scene.add(sun);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040, 1);
      scene.add(ambientLight);

      // Textures
      const textureLoader = new THREE.TextureLoader();
      const dayTexture = textureLoader.load('/textures/earth_day_4096.jpg');
      dayTexture.colorSpace = THREE.SRGBColorSpace;
      const nightTexture = textureLoader.load('/textures/earth_night_4096.jpg');
      nightTexture.colorSpace = THREE.SRGBColorSpace;
      const bumpRoughnessTexture = textureLoader.load('/textures/earth_bump_roughness_clouds_4096.jpg');

      // Globe setup
      const globeMaterial = new THREE.MeshStandardMaterial({
        map: dayTexture,
        roughnessMap: bumpRoughnessTexture,
        bumpMap: bumpRoughnessTexture,
        bumpScale: 0.05,
        roughness: 0.5
      });

      const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
      globe = new THREE.Mesh(sphereGeometry, globeMaterial);
      scene.add(globe);

      // Create and add logo billboard
      logoBillboard = createLogoBillboard();
      scene.add(logoBillboard);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.minDistance = 2;
      controls.maxDistance = 10;
      controls.enablePan = false;
      controls.enabled = false; // Disable controls for loading screen

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    };

    const cleanup = init();

    // Animation
    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Rotate Earth
      if (globe) {
        globe.rotation.y += delta * 0.05;
      }

      // Animate logo billboard
      if (logoBillboard) {
        const radius = 1.5;
        logoBillboard.position.x = Math.cos(time) * radius;
        logoBillboard.position.z = Math.sin(time) * radius;
        
        // Make the billboard always face the camera
        logoBillboard.quaternion.copy(camera.quaternion);
        
        // Add a gentle floating motion
        logoBillboard.position.y = Math.sin(time * 2) * 0.1 + 0.2;
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cleanup();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (mountRef.current && renderer) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of geometries and materials
      scene?.traverse(object => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material.dispose) {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <div 
      ref={mountRef}
      className="fixed inset-0 bg-white"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <span className="text-orange text-xl font-medium animate-pulse">
          <Typewriter
                options={{
                  strings: "Building a unique Travel Experience...",
                  autoStart: true,
                  loop: false,
                  delay: 50,
                  html: true,
                  deleteSpeed: 30,

                }}
              />
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;