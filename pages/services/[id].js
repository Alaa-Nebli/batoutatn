/* eslint-disable react/display-name */
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from 'components/Layout';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { ContactUs } from 'components/Contact';
import Image from 'next/image';
import Link from 'next/link';

// Constants for excursions data
const EXCURSIONS = {
  tunis: {
    id: 'tunis',
    title: 'ESCAPADE TUNIS-HAMMAMET-ZAGHOUAN',
    location: 'Tunis',
    duration: '1 Day',
    description: 'Jour 1 : Tunis - Hammamet 07h45, départ de Tunis vers Hammamet 09h00, Arrivée au Port Yasmine, Hammamet Embarquement à bord du Bateau Pirate, balade en mer & déjeuner 12H30-13H00',
    image: '/excursions/tunis-hammamet.jpg',
    highlights: [
      'Balade en mer sur un bateau pirate',
      'Déjeuner inclus',
      'Départ tôt le matin',
      'Transport inclus'
    ]
  },
  cap_bon: {
    id: 'cap_bon',
    title: 'Escapade au Cap Bon de Tunisie',
    location: 'Cap Bon de Tunisie',
    duration: '3 Days',
    description: 'ESCAPADE DANS LE TEMPS TUNIS-HAMMAMET-NABEUL-HAOUARIA-HAMMAMET- TUNIS 3 JOURS & 2 NUITS Jour 1 : Tunis – Hammamet 09h00, départ de Tunis vers Hammamet 10h30,...',
    image: '/excursions/cap-bon.jpg',
    highlights: [
      '3 jours de découverte',
      'Visite de plusieurs villes',
      'Hébergement inclus',
      'Guide touristique'
    ]
  },
  jerba: {
    id: 'jerba',
    title: 'ESCAPADE À JERBA 4 JOURS/ 3 NUITS',
    location: 'Jerba',
    duration: '4 Days',
    description: 'Escapade à Jerba 4 jours / 3 nuits Jour 1: Tunis- Matmata-Djerba 06h30 : Départ de Tunis vers Matmata. Arrivée & Déjeuner à Diar El B...',
    image: '/excursions/jerba.jpg',
    highlights: [
      '4 jours de vacances',
      'Visite de Matmata',
      'Hébergement de luxe',
      'Transport confortable'
    ]
  }
};

// Helper function to memoize service data
const useServiceData = (t) => {
  return useMemo(() => ({
    "outbound": {
      title: t('Services.ServiceCards.Group_Travel.Title'),
      description: t('Services.ServiceCards.Group_Travel.Description'),
      image: '/outgoing_travel.jpg',
      imageAlt: 'Voyages en Groupe',
      features: t('Services.ServiceCards.Group_Travel.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Group_Travel.highlights', { returnObjects: true }),
    },
    "excursions": {
      title: t('Services.ServiceCards.Events_Organization.Title'),
      description: t('Services.ServiceCards.Events_Organization.Description'),
      image: '/excursions.webp',
      imageAlt: 'Organisation d\'événements',
      features: t('Services.ServiceCards.Events_Organization.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Events_Organization.highlights', { returnObjects: true }),
    },
    "transport": {
      title: t('Services.ServiceCards.Transport.Title'),
      description: t('Services.ServiceCards.Transport.Description'),
      image: '/transport.jpg',
      imageAlt: 'Services de Transport',
      features: t('Services.ServiceCards.Transport.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Transport.highlights', { returnObjects: true }),
    },
    "ticketing": {
      title: t('Services.ServiceCards.Billetterie.Title'),
      description: t('Services.ServiceCards.Billetterie.Description'),
      image: '/billeterie_banniere.png',
      imageAlt: 'Services de Billetterie',
      features: t('Services.ServiceCards.Billetterie.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Billetterie.highlights', { returnObjects: true }),
    },
  }), [t]);
};

// Static paths generation
export const getStaticPaths = async ({ locales }) => {
  const serviceIds = ["transport", "outbound", "excursions", "ticketing"];
  const paths = serviceIds.flatMap(id => 
    locales.map(locale => ({
      params: { id },
      locale,
    }))
  );

  return { paths, fallback: false };
};

export const getStaticProps = async ({ locale, params }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
    serviceId: params.id,
  },
});

// Card Components
const ProgramCard = React.memo(({ program }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -5 }}
  >
    <div className="relative h-72 w-full overflow-hidden">
      <Image
        src={program.images?.[0] ? `/uploads/${program.images[0]}` : '/placeholder.jpg'}
        alt={program.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority={false}
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
      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
        {program.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
        {program.description}
      </p>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-gray-600">
            <Icon icon="mdi:clock-outline" className="w-5 h-5 mr-1" />
            <span>{program.days} Jours</span>
          </div>
          <div className="flex items-center text-orange-500 font-semibold">
            <Icon icon="mdi:currency-usd" className="w-5 h-5 mr-1" />
            <span>{program.price} TND</span>
          </div>
        </div>
        <Link 
          href={`/programs/${program.id}`} 
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center space-x-2 transition-colors group w-full sm:w-auto justify-center"
          passHref
        >
          <span>Details</span>
          <Icon icon="mdi:arrow-right" className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  </motion.div>
));

const ExcursionCard = React.memo(({ excursion }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -5 }}
  >
    <div className="relative h-72 w-full overflow-hidden">
      <Image
        src={excursion.image}
        alt={excursion.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center space-x-2 text-white mb-2">
            <Icon icon="mdi:map-marker" className="w-5 h-5" />
            <span className="text-sm">{excursion.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-white">
            <Icon icon="mdi:clock-outline" className="w-5 h-5" />
            <span className="text-sm">{excursion.duration}</span>
          </div>
        </div>
      </div>
    </div>
    <div className="p-6 flex-grow flex flex-col">
      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
        {excursion.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-3">
        {excursion.description}
      </p>
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Highlights:</h4>
        <ul className="space-y-1">
          {excursion.highlights.map((highlight, i) => (
            <li key={i} className="flex items-start">
              <Icon icon="mdi:check-circle" className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto">
        <div className="flex items-center text-orange-500 font-semibold">

        </div>
        <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center space-x-2 transition-colors group w-full sm:w-auto justify-center">
          <span>Contactez Nous</span>
          <Icon icon="mdi:arrow-right" className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </motion.div>
));

const ServiceDetails = ({ serviceId }) => {
  const { t } = useTranslation('common');
  const services = useServiceData(t);
  const serviceData = services[serviceId];
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (serviceId === 'outbound') {
      const fetchPrograms = async () => {
        try {
          setLoading(true);
          const response = await fetch('/api/programs.controller');
          if (!response.ok) throw new Error('Failed to fetch');
          const data = await response.json();
          setPrograms(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching programs:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchPrograms();
    } else {
      setLoading(false);
    }
  }, [serviceId]);

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
        <title>{`${serviceData.title} - Batouta Voyages`}</title>
        <meta name="description" content={serviceData.description} />
        <meta property="og:title" content={`${serviceData.title} - Batouta Voyages`} />
        <meta property="og:description" content={serviceData.description} />
        <meta property="og:image" content={serviceData.image} />
      </Head>

      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <Image
          src={serviceData.image}
          alt={serviceData.imageAlt}
          fill
          priority
          className="object-cover z-0"
          sizes="120vw"
        />

      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Service Description Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="mb-20"
          >
            <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                {serviceData.title}
              </h1>
              
              <p >{serviceData.description}</p>
            </div>
          </motion.section>

        {/* Programs/Excursions Section */}
        <AnimatePresence>
          {serviceId === 'outbound' && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="mb-20"
              key="programs-section"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                Nos Voyages A l&apos;étranger
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                    <Icon icon="mdi:alert-circle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 mb-2"> Une erreur est survenue!</h3>
                    <p className="text-red-600">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                    >
                      Réessayer
                    </button>
                  </div>
                </div>
              ) : programs.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                    <Icon icon="mdi:information" className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-blue-700 mb-2"> Pas de programme disponible en ce moment </h3>
                    <p className="text-blue-600">
                      {t('Check back soon for our new travel programs!')}
                    </p>
                  </div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {serviceId === 'excursions' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Nos Excursions en Tunisie
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Object.values(EXCURSIONS).map((excursion) => (
                <ExcursionCard key={excursion.id} excursion={excursion} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            Ce que nous offrons
          </h2>

          <div className="grid gap-12">
            {serviceData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}
              >
                <div className="w-full md:w-1/2 relative overflow-hidden rounded-2xl shadow-lg aspect-video">
                  <Image
                    src={`/feature_${serviceId}_${index + 1}.png`}
                    alt={feature}
                    fill
                    className="object-cover rounded-xl"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">
                    {feature}
                  </h3>
                  <p className="text-gray-600">
                    Découvrez comment nous rendons votre expérience unique avec {feature.toLowerCase()}. Nous nous engageons à vous fournir des services de haute qualité pour répondre à tous vos besoins.
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Highlights Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('Why Choose This Service?')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceData.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-orange-100 p-2 rounded-full mr-4">
                    <Icon 
                      icon="mdi:check-circle" 
                      className="w-6 h-6 text-orange-500" 
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {highlight.title}
                  </h3>
                </div>
                <p className="text-gray-600 pl-12">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>

      <ContactUs />
    </Layout>
  );
};

export default ServiceDetails;