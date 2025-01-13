import { Layout } from "components//Layout";
import SEO from "components//SEO/SEO";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion} from 'framer-motion';
import aboutImage from 'public//batouta_team.png'; // Use your uploaded image here
import styles from 'components//About/AboutSection.module.css'; // Ensure you have the CSS file
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ContactUs } from "components//Contact";

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

  const banners = [
    {
      id: 1,
      imageUrl: '/tunisia/japan.webp',
      title: "Discover Japan",
      description: t('Home.banner.slide1.description'),
      alt: "Japan"
    },
    {
      id: 2,
      imageUrl: '/tunisia/nepal_places.jpg',
      title: t('Home.banner.slide2.title'),
      description: t('Home.banner.slide2.description'),
      alt: t('Home.banner.slide2.alt')
    },
    {
      id: 3,
      imageUrl: '/tunisia/thailand-chaing-mai.jpg',
      title: t('Home.banner.slide3.title'),
      description: t('Home.banner.slide3.description'),
      alt: t('Home.banner.slide3.alt')
    },
    {
      id: 4,
      imageUrl: '/tunisia/suisse.jpg',
      title: t('Home.banner.slide4.title'),
      description: t('Home.banner.slide4.description'),
      alt: t('Home.banner.slide4.alt')
    },
    {
      id: 5,
      imageUrl: '/tunisia/thailand_1.jpg',
      title: t('Home.banner.slide5.title'),
      description: t('Home.banner.slide5.description'),
      alt: t('Home.banner.slide5.alt')
    },
    {
      id: 6,
      imageUrl: '/tunisia/africa_south.webp',
      title: t('Home.banner.slide6.title'),
      description: t('Home.banner.slide6.description'),
      alt: t('Home.banner.slide6.alt')
    },
    {
      id: 7,
      imageUrl: '/tunisia/safari.png',
      title: t('Home.banner.slide7.title'),
      description: t('Home.banner.slide7.description'),
      alt: t('Home.banner.slide7.alt')
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Subtle global overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Text content with improved container
      <div className="absolute bottom-5 left-8 md:left-5 z-10 max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-sm bg-black/40 p-6 md:p-8 rounded-lg shadow-xl max-w-3xl"
        >
          <h3 className="text-4xl md:text-4xl font-bold text-white mb-6 text-shadow">
            {banners[currentIndex].title}
          </h3>
         
        </motion.div>
      </div> */}

      {/* Carousel slides */}
      <div className="absolute inset-0 flex">
        {banners.map((banner, index) => (
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
              objectPosition="center 10%" // This pushes the image down slightly
              priority
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Improved carousel controls */}
      <div className="absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4 md:px-6">
        <button
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-300"
          onClick={handlePrev}
        >
          <Icon icon="lucide:chevron-left" className="w-6 h-6 text-gray-800" />
        </button>
        <button
          className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors duration-300"
          onClick={handleNext}
        >
          <Icon icon="lucide:chevron-right" className="w-6 h-6 text-gray-800" />
        </button>
      </div>

      {/* Improved scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
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
      title: t('Home.Our_Services_section.Group_Travel.Title'),
      description: t('Home.Our_Services_section.Group_Travel.Description'),
      image: '/group_travel.jpg',
      imageAlt: 'Group Leisure Travel'
    },
    {
      title: t('Home.Our_Services_section.Events_Organization.Title'),
      description: t('Home.Our_Services_section.Events_Organization.Description'),
      image: '/events.jpg',
      imageAlt: 'FIT Travel'
    },
    {
      title: t('Home.Our_Services_section.Transport.Title'),
      description: t('Home.Our_Services_section.Transport.Description'),
      image: '/transport.png',
      imageAlt: 'Shore Excursions'
    },
    {
      title: t('Home.Our_Services_section.Billetterie.Title'),
      description: t('Home.Our_Services_section.Billetterie.Description'),
      image: '/billeterie.webp',
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

                    <div className="grid gap-8 md:grid-cols-2">
                      {services.map((service, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center gap-8 p-6 bg-gray-50 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transition-all duration-300 hover:shadow-orange-200"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: false, amount: 0.1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          {index % 2 === 0 ? (
                            <>
                              <div className="flex-1 pr-4">
                                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                              </div>
                              <div className="w-48 h-48 relative flex-shrink-0 overflow-hidden rounded-lg ">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.3 }}
                                  className="w-full h-full "
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
                            </>
                          ) : (
                            <>
                              <div className="w-48 h-48 relative flex-shrink-0 overflow-hidden rounded-lg ">
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
                              <div className="flex-1 pl-4">
                                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                                <p className="text-gray-600">{service.description}</p>
                              </div>
                            </>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    
                    {/* Centered Orange Button with Light Orange Shadow */}
                    <div className="flex justify-center mt-8">
                      <Link href={"/our_services"} >
                      <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold group hover:shadow-lg transition-all duration-300 hover:shadow-orange-200">
                        <span className="flex items-center justify-center">
                        {t('Home.Button.Explore_Service')}
                          <Icon icon="mdi:arrow-right" className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>
                      </Link>
                    </div>
                  </div>
                </section>

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
