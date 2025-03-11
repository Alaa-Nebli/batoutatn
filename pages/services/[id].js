import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { Layout } from 'components/Layout';
import Head from 'next/head';
import { ContactUs } from 'components/Contact';
import Image from 'next/image';

// Helper function to get service data from translations
const getServiceData = (t) => {
  return {
    "1": {
      title: t('Services.ServiceCards.Group_Travel.Title'),
      description: t('Services.ServiceCards.Group_Travel.Description'),
      image: '/group_travel.jpg', // High-quality image for the service
      imageAlt: 'Voyages en Groupe',
      features: t('Services.ServiceCards.Group_Travel.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Group_Travel.highlights', { returnObjects: true }),
    },
    "2": {
      title: t('Services.ServiceCards.Events_Organization.Title'),
      description: t('Services.ServiceCards.Events_Organization.Description'),
      image: '/events_organization.jpg', // High-quality image for the service
      imageAlt: 'Organisation d\'événements',
      features: t('Services.ServiceCards.Events_Organization.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Events_Organization.highlights', { returnObjects: true }),
    },
    "3": {
      title: t('Services.ServiceCards.Transport.Title'),
      description: t('Services.ServiceCards.Transport.Description'),
      image: '/transport_service.jpg', // High-quality image for the service
      imageAlt: 'Services de Transport',
      features: t('Services.ServiceCards.Transport.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Transport.highlights', { returnObjects: true }),
    },
    "4": {
      title: t('Services.ServiceCards.Billetterie.Title'),
      description: t('Services.ServiceCards.Billetterie.Description'),
      image: '/billetterie_service.jpg', // High-quality image for the service
      imageAlt: 'Services de Billetterie',
      features: t('Services.ServiceCards.Billetterie.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Billetterie.highlights', { returnObjects: true }),
    },
  };
};

export const getStaticPaths = async ({ locales }) => {
  const serviceIds = ["1", "2", "3", "4"];
  const paths = [];

  serviceIds.forEach((id) => {
    locales.forEach((locale) => {
      paths.push({
        params: { id },
        locale,
      });
    });
  });

  return {
    paths,
    fallback: false,
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
const ServiceDetails = ({ serviceId }) => {
  const { t } = useTranslation('common');
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

      {/* Hero Section with Service Image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[500px] flex items-center justify-center overflow-hidden"
      >
        <Image
          src={serviceData.image}
          alt={serviceData.imageAlt}
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />
        <div className="absolute inset-0 bg-black/50 z-10" />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center z-20"
        >
          <h1 className="text-5xl font-bold text-white mb-4">{serviceData.title}</h1>
          <p className="text-xl text-white max-w-2xl mx-auto">{serviceData.description}</p>
        </motion.div>
      </motion.div>

      {/* Updated "Ce que nous offrons" Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-20"
      >
        <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
          Ce que nous offrons
        </h2>

        {serviceData.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`flex flex-col ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            } items-center gap-12 mb-20`}
          >
            {/* Image Container */}
            <div className="w-full md:w-1/2 relative overflow-hidden rounded-2xl shadow-lg">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={`/feature_${index + 1}.jpg`} // Replace with your image paths
                  alt={feature}
                  width={600}
                  height={400}
                  className="rounded-2xl"
                />
              </motion.div>
            </div>

            {/* Text Content */}
            <div className="w-full md:w-1/2">
              <motion.h3
                className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
              >
                {feature}
              </motion.h3>
              <motion.p
                className="text-gray-600 text-lg leading-relaxed"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              >
                Découvrez comment nous rendons votre expérience unique avec {feature.toLowerCase()}. Nous nous engageons à vous offrir des services de qualité supérieure pour répondre à tous vos besoins.
              </motion.p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* Highlights Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 py-20"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Pourquoi choisir ce service ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {serviceData.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500 mb-4">
                  {highlight.title}
                </h3>
                <p className="text-gray-600">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Prêt à commencer votre voyage ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contactez-nous dès aujourd &lsquo; hui pour planifier votre aventure inoubliable.
          </p>
          <button className="bg-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-colors duration-300">
            Contactez-nous
          </button>
        </div>
      </motion.section>

      <ContactUs />
    </Layout>
  );
};

export default ServiceDetails;