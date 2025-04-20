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
import {ReservationForm} from 'components/ReservationForm';

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
      // title: t('Services.ServiceCards.Group_Travel.Title'),
      title: '',
      description: t('Services.ServiceCards.Group_Travel.Description'),
      image: '/voyage.jpg',
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

function stripHtml(htmlString = '') {
  return htmlString.replace(/<[^>]+>/g, '');
}

const ProgramCard = ({ program }) => {
  // Strip out HTML for listing snippet:
  const snippet = stripHtml(program.description || '');

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={program.images?.[0] || '/placeholder.jpg'}
          alt={program.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={program.featured}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center space-x-2 text-white mb-2">
              <Icon icon="mdi:map-marker" className="w-5 h-5 text-orange-300" />
              <span className="text-sm font-medium">
                {program.location_from} → {program.location_to}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-white">
              <Icon icon="mdi:calendar" className="w-5 h-5 text-orange-300" />
              <span className="text-sm font-medium">
                {new Date(program.from_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                {' - '}
                {new Date(program.to_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors">
          {program.title}
        </h3>

        {/* Display plain text snippet with line clamp */}
        <p className="text-gray-600 mb-4 line-clamp-3 text-sm">
          {snippet}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-gray-600 text-sm">
              <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-1.5" />
              <span>{program.days} Jours</span>
            </div>
            <div className="flex items-center text-orange-500 font-semibold">
              <span>{program.price} TND</span>
            </div>
          </div>
          <Link 
            href={`/programs/${program.id}`} 
            className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors text-sm group"
          >
            <span>Détails</span>
            <Icon icon="mdi:arrow-right" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ExcursionCard = React.memo(({ excursion }) => (
  <motion.div
    className="bg-white rounded-2xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-gray-100 transform hover:-translate-y-2 will-change-transform"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    transition={{ duration: 0.4, type: "spring", damping: 10 }}
    whileHover={{ scale: 1.02 }}
  >
    <div className="relative h-72 w-full overflow-hidden rounded-t-2xl">
      <Image
        src={excursion.image}
        alt={excursion.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
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
        <ul className="space-y-2">
          {excursion.highlights.map((highlight, i) => (
            <motion.li 
              key={i} 
              className="flex items-start"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Icon icon="mdi:check-circle" className="text-green-500 mt-1 mr-2 flex-shrink-0" />
              <span className="text-gray-600">{highlight}</span>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-auto">
        <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-lg flex items-center space-x-2 transition-all group w-full sm:w-auto justify-center shadow-md hover:shadow-lg">
          <span>Contactez Nous</span>
          <Icon icon="mdi:arrow-right" className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  </motion.div>
));

const FeatureCard = ({ feature, index, serviceId }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 mb-16`}
  >
    <div className="w-full md:w-1/2 relative overflow-hidden rounded-3xl shadow-2xl aspect-video">
      <Image
        src={`/feature_${serviceId}_${index + 1}.png`}
        alt={feature}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>

    <div className="w-full md:w-1/2">
      <div className="flex items-center mb-4">
        <motion.div 
          className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white mr-4"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
          viewport={{ once: true }}
        >
          <span className="text-xl font-bold">{index + 1}</span>
        </motion.div>
        <motion.h3 
          className="text-2xl md:text-3xl font-bold text-gray-800"
          initial={{ opacity: 0, x: index % 2 === 0 ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          viewport={{ once: true }}
        >
          {feature}
        </motion.h3>
      </div>
      <motion.p 
        className="text-gray-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: index * 0.1 + 0.4 }}
        viewport={{ once: true }}
      >
        Découvrez comment nous rendons votre expérience unique avec {feature.toLowerCase()}. Nous nous engageons à vous fournir des services de haute qualité pour répondre à tous vos besoins.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 + 0.5 }}
        viewport={{ once: true }}
        className="mt-6"
      >
        <Link href={"#contact"} className="px-6 py-2 w-[200px] border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-full transition-colors duration-300 flex items-center space-x-2">
          <span>En savoir plus</span>
          <Icon icon="mdi:arrow-right" className="w-5 h-5" />
        </Link>
      </motion.div>
    </div>
  </motion.div>
);

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
      <section className="relative mt-20 h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-black/30 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <Image
          src={serviceData.image}
          alt={serviceData.imageAlt}
          fill
          priority
          className="object-fill z-0"
          sizes="120vw"
        />



      </section>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* Service Description Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 max-w-5xl mx-auto"
        >
          <motion.div 
            className="bg-gradient-to-r from-orange-500 to-pink-500 p-1 rounded-full mb-12 mx-auto w-64"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

<motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            className="mb-20"
          >
            <div className="prose prose-lg max-w-4xl mx-auto text-gray-700">              
              <p className='text-xl' >{serviceData.description}</p>
            </div>
          </motion.section>
          
         
        </motion.section>

        {/* Programs/Excursions Section */}
        <AnimatePresence>
          {serviceId === 'outbound' && (
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-20"
              key="programs-section"
            >
              <div className="max-w-4xl mx-auto text-center mb-12">
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Nos Voyages à l&apos;étranger
                </motion.h2>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Découvrez nos destinations exclusives soigneusement sélectionnées pour vous offrir des expériences uniques.
                </motion.p>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <motion.div 
                    className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <motion.div 
                    className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon icon="mdi:alert-circle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-700 mb-2">Une erreur est survenue!</h3>
                    <p className="text-red-600">{error}</p>
                    <motion.button 
                      onClick={() => window.location.reload()}
                      className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Réessayer
                    </motion.button>
                  </motion.div>
                </div>
              ) : programs.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {programs.map((program) => (
                    <ProgramCard key={program.id} program={program} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <motion.div 
                    className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Icon icon="mdi:information" className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-blue-700 mb-2">Pas de programme disponible en ce moment</h3>
                    <p className="text-blue-600">
                      {t('Check back soon for our new travel programs!')}
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>

        {serviceId === 'ticketing' && (
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">
            Réservez Votre Voyage
          </h2>
          <p className="max-w-2xl mx-auto text-center text-gray-700 mb-6">
            Remplissez les détails ci-dessous pour nous envoyer votre demande de réservation.
          </p>
          <ReservationForm />
        </section>
      )}


        {serviceId === 'excursions' && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="max-w-4xl mx-auto text-center mb-12">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Nos Excursions en Tunisie
              </motion.h2>
              <motion.p 
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Découvrez les merveilles de la Tunisie avec nos excursions soigneusement planifiées.
              </motion.p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Object.values(EXCURSIONS).map((excursion) => (
                <ExcursionCard key={excursion.id} excursion={excursion} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Features Section - Modernized "Nos Promesses" */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Engagements</span>
            </motion.h2>
            <motion.p 
              className="text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Nous nous engageons à vous offrir une expérience exceptionnelle à chaque étape de votre voyage.
            </motion.p>
          </div>

          <div className="max-w-6xl mx-auto">
            {serviceData.features.map((feature, index) => (
              <FeatureCard 
                key={index} 
                feature={feature} 
                index={index} 
                serviceId={serviceId} 
              />
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 py-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl text-center"
        >
          <div className="max-w-4xl mx-auto px-4">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Prêt à vivre une expérience inoubliable?
            </motion.h2>
            <motion.p 
              className="text-xl text-white mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Contactez-nous dès aujourd&apos;hui pour planifier votre prochaine aventure.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href={"#contact"} className="px-8 py-3 w-56 bg-white text-orange-500 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center mx-auto hover:bg-gray-100">
                <span>Contactez-nous</span>
                <Icon icon="mdi:arrow-right" className="w-6 h-6 ml-2" />
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </main>

      <ContactUs />
    </Layout>
  );
};

export default ServiceDetails;