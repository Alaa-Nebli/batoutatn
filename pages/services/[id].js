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
const getServiceData = (t) => ({
  "1": {
    title: t("Home.Our_Services_section.group_travel.Title"),
    description: t("Home.Our_Services_section.group_travel.Description"),
  },
  "2":{
    title: t("Home.Our_Services_section.FIT.Title"),
    description: t("Home.Our_Services_section.FIT.Description"),
  },
  "3": {
    title: t("Home.Our_Services_section.Shore_Excursions.Title"),
    description: t("Home.Our_Services_section.Shore_Excursions.Description"),
  }
});



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
  const router = useRouter();
  const cities = [
    {
      name: t("Services.cities.tunis.name"),
      description: t("Services.cities.tunis.description"),
      images: ["/tunisia/Tunis_medina_0.jpg", "/tunisia/Tunis_medina_2.png", "/tunisia/medina_tunis.jpg"]
    },
    {
      name: t("Services.cities.Bardo.name"),
      description: t("Services.cities.Bardo.description"),
      images: ["/tunisia/bardo-meuseum-3.jpg", "/tunisia/bardo-museum-2.jpg", "/tunisia/4-Bardo_Museum.jpg"]
    },
    {
      name: t("Services.cities.Sidi_Bou_Said.name"),
      description: t("Services.cities.Sidi_Bou_Said.description"),
      images: ["/tunisia/sidi-bou-said-3.jpg", "/tunisia/Sidi_bou_saiid.jpg", "/tunisia/sidi-bou-said-2.jpg"]
    },
    {
      name: t("Services.cities.Zagouan.name"),
      description: t("Services.cities.Zagouan.description"),
      images: ["/tunisia/zaghouan-0.jpg", "/tunisia/zaghouan-1.jpg", "/tunisia/zaghouan-3.webp"]
    },
    {
      name: t("Services.cities.Carthage.name"),
      description: t("Services.cities.Carthage.description"),
      images: ["/tunisia/carthage-3.jpg", "/tunisia/carthage-1.webp", "/tunisia/carthage-2.jpg"]
    },
    {
      name: t("Services.cities.Oudhna.name"),
      description: t("Services.cities.Oudhna.description"),
      images: ["/tunisia/oudhna-0.jpg", "/tunisia/oudhna-2.jpg", "/tunisia/oudhna-1.jpg"]
    },
    {
      name: t("Services.cities.Dougga.name"),
      description: t("Services.cities.Dougga.description"),
      images: ["/tunisia/dougga-1.jpeg", "/tunisia/dougga-3.jpg", "/tunisia/dougga-2.jpg"]
    },
    {
      name: t("Services.cities.Jem.name"),
      description: t("Services.cities.Jem.description"),
      images: ["/tunisia/jam_amphi.webp", "/tunisia/el-jem-3.jpg", "/tunisia/eljem.jpg"]
    },
    {
      name: t("Services.cities.Kairouan.name"),
      description: t("Services.cities.Kairouan.description"),
      images: ["/tunisia/kairouan-1.jpg", "/tunisia/kairouan-3.jpg", "/tunisia/kairouan-2.jpg"]
    },
    {
      name: t("Services.cities.Sousse.name"),
      description: t("Services.cities.Sousse.description"),
      images: ["/tunisia/sousse-1.jpg", "/tunisia/sousse-2.jpg", "/tunisia/sousse-3.webp"]
    }
  ];

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

        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-center mb-4"
            >
              {t('cities.explore_title', 'Explore Tunisia\'s Historic Cities')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto"
            >
              {t('cities.explore_description', 'Discover the rich cultural heritage and stunning landscapes of Tunisia\'s most remarkable destinations')}
            </motion.p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cities.map((city, index) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CityCard city={city} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      <ContactUs />
    </Layout>
  );
};

export default CitiesShowcase;