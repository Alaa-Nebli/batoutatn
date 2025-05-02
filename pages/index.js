// import { Layout } from "components//Layout";
// import SEO from "components//SEO/SEO";
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
// import { useTranslation } from 'next-i18next';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import styles from 'components//About/AboutSection.module.css'; // Ensure you have the CSS file
// import { useState, useEffect, useRef } from 'react';
// import Link from "next/link";
// import { Icon } from "@iconify/react";
// import { ContactUs } from "components//Contact";

// export async function getStaticProps({ locale }) {
//     return {
//       props: {
//         ...(await serverSideTranslations(locale, ['common'])),
//       },
//     }
// }
// const Banner = () => {
//   const { t } = useTranslation('common');
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [featuredItems, setFeaturedItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Default banners to use as fallback
//   const defaultBanners = [
//     {
//       id: 1,
//       imageUrl: '/tunisia/japan.webp',
//       alt: 'Japan',
//     },
//     {
//       id: 2,
//       imageUrl: '/tunisia/nepal_places.jpg',
//       alt: t('Home.banner.slide2.alt'),
//     },
//     {
//       id: 3,
//       imageUrl: '/tunisia/thailand-chaing-mai.jpg',
//       alt: t('Home.banner.slide3.alt'),
//     },
//     {
//       id: 4,
//       imageUrl: '/tunisia/suisse.jpg',
//       alt: t('Home.banner.slide4.alt'),
//     },
//     {
//       id: 5,
//       imageUrl: '/tunisia/thailand_1.jpg',
//       alt: t('Home.banner.slide5.alt'),
//     },
//     {
//       id: 6,
//       imageUrl: '/tunisia/africa_south.webp',
//       alt: t('Home.banner.slide6.alt'),
//     },
//     {
//       id: 7,
//       imageUrl: '/tunisia/safari.png',
//       alt: t('Home.banner.slide7.alt'),
//     },
//   ];

//   // Fetch featured items from the API
//   useEffect(() => {
//     const fetchFeaturedItems = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/api/featured');

//         if (!response.ok) {
//           throw new Error(
//             `Failed to fetch featured items: ${response.status} ${response.statusText}`
//           );
//         }

//         const data = await response.json();
//         setFeaturedItems(data);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching featured items:', err);
//         setError(err);
//         setLoading(false);
//       }
//     };

//     fetchFeaturedItems();
//   }, []);

//   // Determine which banners to display
//   const displayBanners = featuredItems.length > 0
//     ? featuredItems.map((item) => ({
//         id: item.id,
//         imageUrl: item.image,
//         title: item.trip?.name || '',
//         description: item.trip?.description || '',
//         alt: item.trip?.name || 'Featured destination',
//         cta: item.cta || 'Explore Destination',
//         tripId: item.tripId,
//       }))
//     : defaultBanners;

//   const handlePrev = () => {
//     setCurrentIndex(
//       (prevIndex) => (prevIndex - 1 + displayBanners.length) % displayBanners.length
//     );
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % displayBanners.length);
//   };

//   // Auto-rotate slides every 4 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       handleNext();
//     }, 4000);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [displayBanners.length]);

//   if (loading) {
//     return (
//       <section className="relative h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//           <p className="mt-4 text-gray-600">Loading amazing destinations...</p>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     console.warn('Falling back to default banners due to API error');
//     // We'll silently fall back to default banners if there's an error
//   }

//   return (
//     <section className="relative h-screen overflow-hidden">
//       {/* Subtle global overlay */}

//       {/* Carousel slides */}
//       <section
//   className="relative overflow-hidden"
//   // Shift down by header height, and shrink height so it's still "full screen" minus the nav
//   style={{ marginTop: '80px', height: 'calc(100vh - 80px)' }}
// >
//   <div className="absolute inset-0 flex">
//     {displayBanners.map((banner, index) => (
//       <div
//         key={banner.id}
//         className={`w-full h-full flex-shrink-0 transition-opacity duration-500 ${
//           index === currentIndex ? 'opacity-100' : 'opacity-0'
//         }`}
//       >
//         <Image
//           src={banner.imageUrl}
//           alt={banner.alt}
//           layout="fill"
//           objectFit="cover"
//           objectPosition="center"
//           priority
//           className="w-full h-full"
//         />
//       </div>
//     ))}
//   </div>
// </section>


//       {/* Beautiful CTA button (shown only if there is a tripId) */}
//       {displayBanners[currentIndex]?.tripId && (
//         <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-30">
//           <Link
//             href={`/programs/${displayBanners[currentIndex].tripId}`}
//             passHref
//             legacyBehavior
//           >
//             <a className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-lg rounded-full shadow-xl transition-transform transform hover:-translate-y-1 active:translate-y-0">
//               {displayBanners[currentIndex].cta}
//             </a>
//           </Link>
//         </div>
//       )}

//       {/* Carousel indicator dots */}
//       <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
//         {displayBanners.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={`w-3 h-3 rounded-full transition-all duration-300 ${
//               index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>

//       {/* Improved carousel controls */}
//       <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 md:px-6 z-30">
//         <button
//           className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-300"
//           onClick={handlePrev}
//           aria-label="Previous slide"
//         >
//           <Icon icon="lucide:chevron-left" className="w-6 h-6 text-gray-800" />
//         </button>
//         <button
//           className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-300"
//           onClick={handleNext}
//           aria-label="Next slide"
//         >
//           <Icon icon="lucide:chevron-right" className="w-6 h-6 text-gray-800" />
//         </button>
//       </div>

//       {/* Improved scroll indicator */}
//       {/* <motion.div
//         className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
//         animate={{ y: [0, 10, 0] }}
//         transition={{ duration: 1.5, repeat: Infinity }}
//       >
//         <div className="backdrop-blur-sm bg-white/20 p-2 rounded-full">
//           <Icon icon="mdi:arrow-down-circle" className="w-8 h-8 md:w-12 md:h-12 text-white" />
//         </div>
//       </motion.div> */}
//     </section>
//   );
// };

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
import Typewriter from 'typewriter-effect';

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    }
}


// Create a singleton video instance outside the component
let globalVideo = null;


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
    video.src = 'https://bnlpzibmwmoragheykpt.supabase.co/storage/v1/object/public/programs//cdfa0de5-b243-4103-a163-9a0943873794.mp4'; // Replace with your actual video path
    video.loop = true;
    video.muted = false;
    video.playsInline = true;
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
        video.play().catch(console.error);
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
  console.log(title, title2);
  
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

// Program Card component from programs page
const ProgramCard = ({ program }) => (
  <motion.div
    className="bg-white rounded-xl m-5 m-h-100 shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -5 }}
  >
    <div className="relative h-56 w-full overflow-hidden">
      <Image
        src={program.images && program.images.length > 0 ? `/uploads/${program.images[0]}` : '/placeholder.jpg'}
        alt={program.title}
        layout="fill"
        objectFit="cover"
        className="transform transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-2 text-white mb-2">
            <Icon icon="mdi:map-marker" className="w-5 h-5" />
            <span className="text-sm">{program.location_from} → {program.location_to}</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Icon icon="mdi:calendar" className="w-5 h-5" />
            <span className="text-sm">
              {new Date(program.from_date).toLocaleDateString()} - {new Date(program.to_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors">
        {program.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {program.description}
      </p>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex space-x-4">
          <div className="flex items-center text-gray-600">
            <Icon icon="mdi:clock-outline" className="w-5 h-5 mr-1" />
            <span>{program.days} Jours </span>
          </div>
          <div className="flex items-center text-orange-500 font-semibold">
            <Icon icon="mdi:currency-usd" className="w-5 h-5 mr-1" />
            <span>{program.price} TND</span>
          </div>
        </div>
        <Link href={`/programs/${program.id}`} passHref>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors group">
            <span>Voir Plus</span>
            <Icon icon="mdi:arrow-right" className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </div>
  </motion.div>
);

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
            />
            <div className="main-wrapper bg-white relative z-10 ">
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
                        layout="fill"
                        objectFit="cover"
                        className={styles.puzzleImage}
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
                            layout="fill"
                            objectFit="fill"
                            className="transition-transform duration-500 group-hover:scale-110"
                          />
                          {/* Gradient Overlay */}
                        </div>

                        {/* Text Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                          <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                          <Link href={`/services/${service.id}`}>
                            <button className="px-6 py-2 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors duration-300">
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