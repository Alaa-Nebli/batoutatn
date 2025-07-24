import React, { useCallback, useEffect, useState, useRef } from 'react';

import { Layout } from "components//Layout";
import SEO from "components//SEO/SEO";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from 'components//About/AboutSection.module.css'; // Ensure you have the CSS file
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ContactUs } from "components//Contact";
import { useScroll, useTransform } from 'framer-motion';

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    }
}


// Create a singleton video instance outside the component
const Banner = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = React.useRef(null);

  const handleVideoLoad = useCallback(() => {
    setIsVideoLoaded(true);
  }, []);

  const handleVideoError = useCallback(() => {
    setVideoError(true);
  }, []);

  const handleVideoPlay = useCallback(() => {
    setIsVideoPlaying(true);
  }, []);

  // Function to create or reuse a singleton video
  const createVideo = () => {
  const existing = document.getElementById('singleton-video');
  if (existing) return existing;

  const video = document.createElement('video');
  video.id = 'singleton-video';
  video.src = 'https://firebasestorage.googleapis.com/v0/b/taktak-2b9c5.appspot.com/o/tunisia.mp4?alt=media&token=54459283-2886-490b-a180-512fc5eb9087'; 
  video.poster = "/tunisia/Discover_Tunisia_Banner.webp"
  video.loop = true;
  video.muted = true; // ✅ MUST be muted to autoplay
  video.playsInline = true;
  video.autoplay = true; // ✅ Ensure autoplay is set
  video.className = 'w-full h-full object-cover absolute inset-0';
  return video;
};


  useEffect(() => {
    const video = createVideo();
    videoRef.current = video;

    if (!video.hasAttribute('data-initialized')) {
      video.onloadeddata = handleVideoLoad;
      video.onplay = handleVideoPlay;
      video.onerror = handleVideoError;
      video.setAttribute('data-initialized', 'true');
    }

    const container = document.getElementById('video-container');
    if (container && !container.contains(video)) {
      container.appendChild(video);

      if (video.paused) {
  video.load();
  video.play().catch((err) => {
    console.warn("Video autoplay failed:", err);
  });
}
    }

    setIsVideoLoaded(video.readyState >= 2);
    setIsVideoPlaying(!video.paused);
    setVideoError(video.error !== null);

    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
        videoRef.current.remove();
      }
    };
  }, [handleVideoLoad, handleVideoPlay, handleVideoError]);

  return (
    <section className="relative h-screen overflow-hidden">
      <Image
        src="/tunisia/Discover_Tunisia_Banner.webp"
        alt="Video Poster"
        layout="fill"
        objectFit="cover"
        priority
        className={`transition-opacity duration-500 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
      />

      <div
        id="video-container"
        className={`absolute inset-0 overflow-hidden transition-opacity duration-500 ${
          isVideoPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ y }}
        >
          <motion.div
            className="mb-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Icon
              icon="game-icons:torii-gate"
              className="w-16 h-16 md:w-24 md:h-24 text-orange-500"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0], opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-white flex flex-col items-center gap-2">
            <p className="text-sm font-light tracking-widest uppercase">
              Scroll
            </p>
            <Icon icon="mdi:arrow-down-circle" className="w-8 h-8 md:w-12 md:h-12" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};



const UniqueFeatureCard = ({ icon, title,title2, description, delay }) => {  
    return (
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.1 }}
        transition={{ duration: 0.4, delay }}
      >
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <Icon icon={icon} className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">{title} <br /> {title2} </h3>
        
        <p className="text-gray-600 text-center leading-relaxed">{description}</p>
      </motion.div>
    );
};

export default function Home() {
    const { t } = useTranslation('common');

    const [isInView, setIsInView] = useState(false);
    const aboutSectionRef = useRef(null);
    const differentSectionRef = useRef(null); // Ref for the different section
    const statsSectionRef = useRef(null); // Ref for the stats section
    const servicesSectionRef = useRef(null); // Ref for the services section
    const [showLoading, setShowLoading] = useState(true);
    const [puzzleImages, setPuzzleImages] = useState([
    '/tunisia/thailand-chaing-mai.jpg',
    '/tunisia/nepal-culture.jpg',
    '/tunisia/africa_south.webp',
    '/tunisia/nepal.webp',
    '/tunisia/safari.jpg',
    '/tunisia/thailand.png',
    '/tunisia/suisse.jpg',
    '/tunisia/japan_city.jpg',
    '/tunisia/Japan.webp',
    '/tunisia/japan_1.jpg',
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Shuffle the puzzle images array
      setPuzzleImages((prevImages) => {
        return [...prevImages].sort(() => Math.random() - 0.5);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
          setShowLoading(false);
      }, 5000); // 30 seconds

      return () => clearTimeout(timer); // Cleanup timer on component unmount
  }, []);

  const services = [
    {
      id:"outbound", 
      title: t('Home.Our_Services_section.Group_Travel.Title'),
      description: t('Home.Our_Services_section.Group_Travel.Description'),
      image: '/travel3.jpg',
      imageAlt: 'Group Leisure Travel'
    },
    {
      id : "excursions",
      title: t('Home.Our_Services_section.Events_Organization.Title'),
      description: t('Home.Our_Services_section.Events_Organization.Description'),
      image: '/excursions.jpg',
      imageAlt: 'FIT Travel'
    },
    {
      id : "transport", 
      title: t('Home.Our_Services_section.Transport.Title'),
      description: t('Home.Our_Services_section.Transport.Description'),
      image: '/transport1.jpg',
      imageAlt: 'Shore Excursions'
    },
    {
      id : "ticketing",
      title: t('Home.Our_Services_section.Billetterie.Title'),
      description: t('Home.Our_Services_section.Billetterie.Description'),
      image: '/billeterie.png',
      imageAlt: 'MICE'
    }
  ];

  const uniqueFeatures = [
    {
      icon: "ri:team-fill",
      title:"Authenticité",
      title2: t('Home.What_Makes_Us_Different_Section.Card1_Title2'),
      description: t('Home.What_Makes_Us_Different_Section.Card1_Text')
    },
    {
      icon: "mdi:customer-service",
      title: t('Home.What_Makes_Us_Different_Section.Card2_Title'),
      title2 : t('Home.What_Makes_Us_Different_Section.Card2_Title2'),
      description: t('Home.What_Makes_Us_Different_Section.Card2_Text')
    },
    {
      icon: "mdi:globe",
      title: t('Home.What_Makes_Us_Different_Section.Card3_Title'),
      title2 : t('Home.What_Makes_Us_Different_Section.Card3_Title2'),
      description: t('Home.What_Makes_Us_Different_Section.Card3_Text')
    }
  ];

    return (
      
        <Layout className="bg-white">
            <SEO
                title={t('Home.SEO.title')}
                description={t('Home.SEO.description')}
                keywords="batouta voyages, agence de voyage tunisie, voyage tunisie, excursions tunisie, tourisme tunisie, billetterie tunisie, transport touristique tunisie, circuits tunisie, agence de voyage tunis, tourisme responsable tunisie"
            />
            {/* BreadcrumbList JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Accueil",
                                "item": process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn"
                            }
                        ]
                    })
                }}
            />
            <div className="main-wrapper bg-white relative z-10 ">
              <h1 className="sr-only">Agence de Voyage en Tunisie - Batouta.tn</h1>

                {/* Page Banner */}
                <Banner />
                {/* About Section */}
                <section className={styles.aboutSection} ref={aboutSectionRef}>
                             
                    <motion.div
                        className={styles.textContainer}
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h2
                            className={styles.heading}
                            initial={{ opacity: 0, y: -50 }}
                            whileInView={{ opacity: 1, y: 0 } }
                            viewport={{ once: false, amount: 0.2 }}
                            transition={{ duration: 0.5 }}
                        >


                            {t('Home.Aboutus_section.aboutus_title_1')} <span className={styles.highlight}>{t('Home.Aboutus_section.aboutus_title_Highlighted')}</span> {t('Home.Aboutus_section.aboutus_title_2')}
                        </motion.h2>
                        <p className={styles.text}>
                        {t('Home.Aboutus_section.about_us_content')}
                        </p>
                    </motion.div>
                    <motion.div
                         className={styles.imageContainer}
                         initial={{ opacity: 0, x: 100 }}
                         whileInView={{ opacity: 1, x: 0 }} 
                         viewport={{ once: false, amount: 0.2 }}
                         transition={{ duration: 0.8 }} 
                                          >
                      <Image
                        src="/Batouta_team.png"
                        width={800} // was 500
                        height={800} // was 500
                        alt="Batouta Team"
                        layout="responsive"
                      />
                    </motion.div>
                </section>

                
                <section className={styles.puzzleSection}>
                <div className={styles.puzzleWrapper}>
                  {puzzleImages.map((imageUrl, index) => (
                    <div key={index} className={styles.puzzlePiece}>
                      <Image
                        src={imageUrl}
                        alt={`Puzzle piece ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="transition-transform duration-500 group-hover:scale-110"
                      />

                    </div>
                  ))}
                </div>
              </section>
                

                {/* Services Section */}
                <section className="py-20 px-4 bg-gradient-to-b from-white to-orange-50" ref={servicesSectionRef}>
                <div className="max-w-7xl mx-auto">
                  {/* Section Title */}
                  <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                      {t('Home.Our_Services_section.Our_Services_title')}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                      {t('Home.Our_Services_section.Our_Services_Description')}
                    </p>
                  </motion.div>

                  {/* Service Cards Grid */}
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                    {services.map((service, index) => (
                      <motion.div
                        key={index}
                        className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        {/* Image Container */}
                        <div className="relative h-80 overflow-hidden">
                          <Image
                            src={service.image}
                            alt={service.imageAlt}
                            fill
                            className="transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Gradient Overlay */}
                        </div>

                        {/* Text Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                          <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                          <Link href={`/services/${service.id}`}>
                            <button aria-label={`Voir plus sur ${service.title}`}>
                              Voir Plus
                            </button>
                          </Link>

                        </div>

                        {/* Hover Effect */}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
                            
                {/* What Makes Us Different Section */}
                <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-orange-50">
                  <div className="max-w-7xl mx-auto">
                    {/* Section Title */}
                    <motion.div
                      className="text-center mb-16"
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.1 }}
                    >
                      <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
                        {t('Home.What_Makes_Us_Different_Section.What_Makes_Us_Different_Title')}
                      </h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('Home.What_Makes_Us_Different_Section.What_Makes_Us_Different_Description')}
                      </p>
                    </motion.div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                      {uniqueFeatures.map((feature, index) => (
                        <UniqueFeatureCard
                          key={index}
                          icon={feature.icon}
                          title={feature.title}
                          title2={feature.title2}
                          description={feature.description}
                          delay={index * 0.1}
                        />
                      ))}
                    </div>
                  </div>
                </section>

                <ContactUs />
                                
            </div>
        </Layout>
    );
}