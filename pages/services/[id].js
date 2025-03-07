import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Layout } from "components/Layout";
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ContactUs } from 'components/Contact';

// Helper function to get service data from translations
const getServiceData = (t) => {
  const services = {
    "1" : {
      title: t('Home.Our_Services_section.Group_Travel.Title'),
      description: t('Home.Our_Services_section.Group_Travel.Description'),
      image: '/group_travel.png',
      imageAlt: 'Group Leisure Travel'
    },
    "2" :{
      title: t('Home.Our_Services_section.Events_Organization.Title'),
      description: t('Home.Our_Services_section.Events_Organization.Description'),
      image: '/events.png',
      imageAlt: 'FIT Travel'
    },
    "3":{
      title: t('Home.Our_Services_section.Transport.Title'),
      description: t('Home.Our_Services_section.Transport.Description'),
      image: '/transport.png',
      imageAlt: 'Shore Excursions'
    },
    "4":{
      title: t('Home.Our_Services_section.Billetterie.Title'),
      description: t('Home.Our_Services_section.Billetterie.Description'),
      image: '/billeterie.png',
      imageAlt: 'MICE'
    }
  };
  return services;
};



const AutoCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [images]);

  return (
    <div className="relative h-64 overflow-hidden rounded-t-xl">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`City view ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const CityCard = ({ city }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <AutoCarousel images={city.images} />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <svg className="w-6 h-6 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <h3 className="text-2xl font-bold">{city.name}</h3>
        </div>
        <p className="text-gray-600 leading-relaxed">{city.description}</p>
      </div>
    </motion.div>
  );
};

export const getStaticPaths = async ({ locales }) => {
  // Use temporary service IDs for generating paths
  const serviceIds = ["1", "2", "3"];
  const paths = [];
  
  serviceIds.forEach(id => {
    locales.forEach(locale => {
      paths.push({
        params: { id },
        locale,
      });
    });
  });

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps = async ({ locale, params }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      serviceId: params.id,
    },
  };
};

const CitiesShowcase = ({ serviceId }) => {
  const { t } = useTranslation('common');


  // Get service data using translations
  const services = getServiceData(t);
  const serviceData = services[serviceId];

  if (!serviceData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout className="bg-white">
      <Head>
        <title>{serviceData.title} - Batouta Voyages</title>
        <meta name="description" content={serviceData.description} />
      </Head>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        id='service-details-intro'
        className="container mx-auto px-4 py-24"
      >
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl font-bold text-center mb-8"
        >
          {serviceData.title}
          <div className="w-32 h-1 bg-orange-500 mx-auto mt-6" />
        </motion.h1>

        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto space-y-8 mb-24"
        >
          <p className="text-xl text-gray-700 leading-relaxed text-center">
            {serviceData.description}
          </p>
        </motion.div>

      </motion.div>
      <ContactUs />
    </Layout>
  );
};

export default CitiesShowcase;