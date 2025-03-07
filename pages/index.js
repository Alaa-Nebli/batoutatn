import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import aboutImage from 'public/batouta_team.png';
import styles from 'components/About/AboutSection.module.css'; 
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ContactUs } from "components/Contact";

export async function getStaticProps({ locale }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
    }
}


const Banner = () => {
  const { t } = useTranslation('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default banners to use as fallback
  const defaultBanners = [
    {
      id: 1,
      imageUrl: '/tunisia/japan.webp',
      title: "Discover Japan",
      description: t('Home.banner.slide1.description'),
      alt: "Japan",
      cta: "Explore Japan",
      tripId: "japan-tour"
    },
    {
      id: 2,
      imageUrl: '/tunisia/nepal_places.jpg',
      title: t('Home.banner.slide2.title'),
      description: t('Home.banner.slide2.description'),
      alt: t('Home.banner.slide2.alt'),
      cta: "Visit Nepal",
      tripId: "nepal-tour"
    },
    {
      id: 3,
      imageUrl: '/tunisia/thailand-chaing-mai.jpg',
      title: t('Home.banner.slide3.title'),
      description: t('Home.banner.slide3.description'),
      alt: t('Home.banner.slide3.alt'),
      cta: "Discover Thailand",
      tripId: "thailand-tour"
    },
    {
      id: 4,
      imageUrl: '/tunisia/suisse.jpg',
      title: t('Home.banner.slide4.title'),
      description: t('Home.banner.slide4.description'),
      alt: t('Home.banner.slide4.alt'),
      cta: "Explore Switzerland",
      tripId: "switzerland-tour"
    },
    {
      id: 5,
      imageUrl: '/tunisia/thailand_1.jpg',
      title: t('Home.banner.slide5.title'),
      description: t('Home.banner.slide5.description'),
      alt: t('Home.banner.slide5.alt'),
      cta: "Visit Thailand",
      tripId: "thailand-experience"
    },
    {
      id: 6,
      imageUrl: '/tunisia/africa_south.webp',
      title: t('Home.banner.slide6.title'),
      description: t('Home.banner.slide6.description'),
      alt: t('Home.banner.slide6.alt'),
      cta: "Discover South Africa",
      tripId: "south-africa-tour"
    },
    {
      id: 7,
      imageUrl: '/tunisia/safari.png',
      title: t('Home.banner.slide7.title'),
      description: t('Home.banner.slide7.description'),
      alt: t('Home.banner.slide7.alt'),
      cta: "Safari Adventure",
      tripId: "safari-tour"
    }
  ];

  // Fetch featured items from the API
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/featured');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch featured items: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setFeaturedItems(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching featured items:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  }, []);

  // Determine which banners to display
  const displayBanners = featuredItems.length > 0 
    ? featuredItems.map(item => ({
        id: item.id,
        imageUrl: `/uploads/${item.image}`,
        title: item.trip?.name || "",
        description: item.trip?.description || "",
        alt: item.trip?.name || "Featured destination",
        cta: item.cta || "Explore Destination",
        tripId: item.tripId
      }))
    : defaultBanners;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + displayBanners.length) % displayBanners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % displayBanners.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [displayBanners.length]);

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading amazing destinations...</p>
        </div>
      </section>
    );
  }

  if (error) {
    console.warn('Falling back to default banners due to API error');
    // We'll silently fall back to default banners if there's an error
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Subtle global overlay */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Carousel slides */}
      <div className="absolute inset-0 flex">
        {displayBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`w-full h-full flex-shrink-0 transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.alt}
              layout="fill"
              objectFit="cover"
              objectPosition="center 10%" 
              priority
              className="w-full h-full object-cover"
            />
            
            {/* Content overlay for featured items */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <div className="max-w-4xl mx-auto  backdrop-blur-sm p-6 rounded-lg">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{banner.title}</h2>
                <p className="text-lg md:text-xl text-white mb-6 max-w-2xl mx-auto">{banner.description}</p>
                
                {banner.tripId && (
                  <Link href={`/programs/${banner.tripId}`} passHref legacyBehavior>
                    <a className="inline-block px-6 py-3 bg-white text-black font-medium text-lg rounded-full hover:bg-gray-100 transition-colors duration-300 shadow-lg transform hover:scale-105 active:scale-100">
                      {banner.cta}
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Carousel indicator dots */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {displayBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Improved carousel controls */}
      <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 md:px-6 z-30">
        <button
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-300"
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <Icon icon="lucide:chevron-left" className="w-6 h-6 text-gray-800" />
        </button>
        <button
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-300"
          onClick={handleNext}
          aria-label="Next slide"
        >
          <Icon icon="lucide:chevron-right" className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Improved scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="backdrop-blur-sm bg-white/20 p-2 rounded-full">
          <Icon icon="mdi:arrow-down-circle" className="w-8 h-8 md:w-12 md:h-12 text-white" />
        </div>
      </motion.div>
    </section>
  );
};


const UniqueFeatureCard = ({ icon, title, description, delay }) => {
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
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800">{title}</h3>
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

// Programs Carousel component for Homepage
const TripsCarousel = () => {
  const { t } = useTranslation('common');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3; // Number of items to show at once

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/programs.controller');
        const data = await response.json();
        setPrograms(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(programs.length - itemsPerView, prevIndex + 1));
  };

  return (
    <>
      {
        programs.length > 0 ? (
          <section className="py-20 px-4 md:px-8 bg-gray-50">

          <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Nos voyages à l &lsquo; étranger
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos voyages
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Carousel navigation */}
            <div className="absolute top-1/2 -left-5 transform -translate-y-1/2 z-10">
              <button
                className="p-3 bg-white shadow-lg rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                <Icon icon="mdi:chevron-left" className="w-6 h-6 text-gray-800" />
              </button>
            </div>
            
            {/* Carousel content */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                { programs.map((program) => (
                  <div key={program.id} className="w-full md:w-1/3 flex-shrink-0 px-4">
                    <ProgramCard program={program} />
                  </div>
                )) }
              </div>
            </div>
            
            <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 z-10">
              <button
                className="p-3 bg-white shadow-lg rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                onClick={handleNext}
                disabled={currentIndex >= programs.length - itemsPerView}
              >
                <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-800" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/programs" passHref>
            <button className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center space-x-2 mx-auto">
              <span>Voir nos voyage </span>
              <Icon icon="mdi:arrow-right" className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
      </section>
    ) : null
      }
      </>
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
    '/tunisia/japan.webp',
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
      id:"1", 
      title: t('Home.Our_Services_section.Group_Travel.Title'),
      description: t('Home.Our_Services_section.Group_Travel.Description'),
      image: '/group_travel.png',
      imageAlt: 'Group Leisure Travel'
    },
    {
      id : "2",
      title: t('Home.Our_Services_section.Events_Organization.Title'),
      description: t('Home.Our_Services_section.Events_Organization.Description'),
      image: '/events.png',
      imageAlt: 'FIT Travel'
    },
    {
      id : "3", 
      title: t('Home.Our_Services_section.Transport.Title'),
      description: t('Home.Our_Services_section.Transport.Description'),
      image: '/transport.png',
      imageAlt: 'Shore Excursions'
    },
    {
      id : "4",
      title: t('Home.Our_Services_section.Billetterie.Title'),
      description: t('Home.Our_Services_section.Billetterie.Description'),
      image: '/billeterie.png',
      imageAlt: 'MICE'
    }
  ];

  
  const uniqueFeatures = [
    {
      icon: "ri:team-fill",
      title: t('Home.What_Makes_Us_Different_Section.Card1_Title'),
      description: t('Home.What_Makes_Us_Different_Section.Card1_Text')
    },
    {
      icon: "mdi:customer-service",
      title: t('Home.What_Makes_Us_Different_Section.Card2_Title'),
      description: t('Home.What_Makes_Us_Different_Section.Card2_Text')
    },
    {
      icon: "mdi:globe",
      title: t('Home.What_Makes_Us_Different_Section.Card3_Title'),
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
                    <Image
                        src="/japanise_shape1.svg"
                        width={100}
                        height={50}
                        alt="Japanese Shape"
                        className={styles.japaneseShape} 
                    />                
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
                        <Image src={aboutImage} alt="Batouta Team" layout="responsive" />
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
                <section className={styles.servicesSection} ref={servicesSectionRef}>
                  <div className="max-w-7xl mx-auto px-4">
                    <motion.div
                      className="text-center mb-16"
                      initial={{ opacity: 0, y: -50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.1 }}
                      transition={{ duration: 0.8 }}
                    >
                      <h2 className="text-4xl font-bold mb-4">
                        {t('Home.Our_Services_section.Our_Services_title')}
                      </h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('Home.Our_Services_section.Our_Services_Description')}
                      </p>
                    </motion.div>


                  <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {services.map((service, index) => (
                      <motion.div
                        key={index}
                        className="flex flex-col h-full items-center text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:shadow-orange-200 border border-gray-100"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: false, amount: 0.1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {/* Image container with fixed height */}
                        <div className="w-full h-48 relative overflow-hidden rounded-lg mb-6">
                          <motion.div 
                            whileHover={{ scale: 1.1 }} 
                            transition={{ duration: 0.3 }} 
                            className="w-full h-full"
                          >
                            <Image
                              src={service.image}
                              alt={service.imageAlt}
                              layout="fill"
                              objectFit="cover"
                              className="transition-transform duration-300"
                            />
                          </motion.div>
                        </div>

                        {/* Text Content - with flex-grow to push button to bottom */}
                        <div className="flex-grow flex flex-col">
                          <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                          <p className="text-gray-600 mb-6">{service.description}</p>
                        </div>

                        {/* "Explore More" Button - now all buttons will align */}
                        <Link   
                          href={`/services/${service.id}`}
                        >
                          <button className="mt-auto px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold transition-all duration-300 hover:bg-orange-600 hover:scale-105">
                            Voir Plus
                          </button>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  </div>
                </section>

                {/* NEW: Programs Carousel Section */}
                <TripsCarousel />

                {/* What Makes Us Different Section */}
                <section className="py-20 px-4 md:px-8 bg-white">
                  <div className="max-w-7xl mx-auto">
                    <motion.div
                      className="text-center mb-16"
                      initial={{ opacity: 0, y: -20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.1 }}
                    >
                      <h2 className="text-4xl font-bold mb-6 text-gray-800">
                        {t('Home.What_Makes_Us_Different_Section.What_Makes_Us_Different_Title')}
                      </h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        {t('Home.What_Makes_Us_Different_Section.What_Makes_Us_Different_Description')}
                      </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                      {uniqueFeatures.map((feature, index) => (
                        <UniqueFeatureCard
                          key={index}
                          icon={feature.icon}
                          title={feature.title}
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