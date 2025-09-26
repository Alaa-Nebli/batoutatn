/* eslint-disable react/display-name */
"use client";
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Layout } from 'components/Layout';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { ContactUs } from 'components/Contact';
import Image from 'next/image';
import Link from 'next/link';
import { ReservationForm } from 'components/ReservationForm';
import SEO from "components/SEO/SEO";

// Optimized constants with better structure
const EXCURSIONS = {
  tunis: {
    id: 'tunis',
    title: 'Escapade Tunis-Hammamet-Zaghouan',
    location: 'Tunis',
    duration: '1 Jour',
    price: '120 TND',
    description: 'Découvrez les merveilles de Tunis et Hammamet avec une balade en mer sur un bateau pirate authentique.',
    shortDesc: 'Balade en mer sur bateau pirate avec déjeuner inclus',
    image: '/excursions/tunis-hammamet.jpg',
    highlights: ['Bateau pirate authentique', 'Déjeuner gastronomique', 'Transport premium', 'Guide expert'],
    features: ['Transport aller-retour', 'Déjeuner 3 services', 'Animation à bord', 'Photos souvenirs']
  },
  cap_bon: {
    id: 'cap_bon',
    title: 'Escapade Cap Bon Authentique',
    location: 'Cap Bon',
    duration: '3 Jours',
    price: '350 TND',
    description: 'Immersion totale dans l\'authenticité tunisienne : Hammamet, Nabeul, Haouaria sur 3 jours inoubliables.',
    shortDesc: 'Circuit authentique de 3 jours avec hébergement premium',
    image: '/excursions/cap-bon.jpg',
    highlights: ['Circuit complet 3 jours', 'Hôtels sélectionnés', 'Visites guidées', 'Gastronomie locale'],
    features: ['Hébergement 4*', 'Tous repas inclus', 'Guide francophone', 'Transport climatisé']
  },
  jerba: {
    id: 'jerba',
    title: 'Évasion Jerba Premium',
    location: 'Jerba',
    duration: '4 Jours',
    price: '580 TND',
    description: 'Séjour de luxe à Jerba avec découverte de Matmata et hébergement dans les meilleurs établissements.',
    shortDesc: 'Séjour premium 4 jours avec découverte de Matmata',
    image: '/excursions/jerba.jpg',
    highlights: ['Séjour luxueux 4 jours', 'Découverte Matmata', 'Hôtels premium', 'Expériences uniques'],
    features: ['Hôtel 5*', 'Demi-pension', 'Excursions incluses', 'Transferts VIP']
  }
};

// Optimized service data hook
const useServiceData = (t) => {
  return useMemo(() => ({
    "outbound": {
      title: t('Services.ServiceCards.Group_Travel.Title'),
      description: t('Services.ServiceCards.Group_Travel.Description'),
      shortDesc: "Voyages en groupe personnalisés avec accompagnement expert",
      image: '/voyage.jpg',
      imageAlt: 'Voyages en Groupe Premium',
      features: t('Services.ServiceCards.Group_Travel.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Group_Travel.highlights', { returnObjects: true }),
      benefits: ['Groupes de 8 à 50 personnes', 'Accompagnateur expert', 'Itinéraires sur-mesure', 'Hébergements sélectionnés']
    },
    "excursions": {
      title: t('Services.ServiceCards.Events_Organization.Title'),
      description: t('Services.ServiceCards.Events_Organization.Description'),
      shortDesc: "Excursions et escapades authentiques en Tunisie",
      image: '/excursions.webp',
      imageAlt: 'Excursions Tunisie Authentiques',
      features: t('Services.ServiceCards.Events_Organization.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Events_Organization.highlights', { returnObjects: true }),
      benefits: ['Découverte authentique', 'Guides locaux experts', 'Groupes intimistes', 'Expériences uniques']
    },
    "transport": {
      title: t('Services.ServiceCards.Transport.Title'),
      description: t('Services.ServiceCards.Transport.Description'),
      shortDesc: "Services de transport premium pour tous vos déplacements",
      image: '/transport.jpg',
      imageAlt: 'Transport Premium Tunisie',
      features: t('Services.ServiceCards.Transport.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Transport.highlights', { returnObjects: true }),
      benefits: ['Flotte moderne', 'Chauffeurs expérimentés', 'Ponctualité garantie', 'Confort optimal']
    },
    "ticketing": {
      title: t('Services.ServiceCards.Billetterie.Title'),
      description: t('Services.ServiceCards.Billetterie.Description'),
      shortDesc: "Réservation simple et rapide pour tous vos voyages",
      image: '/billeterie_banniere.png',
      imageAlt: 'Billetterie Services Premium',
      features: t('Services.ServiceCards.Billetterie.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Billetterie.highlights', { returnObjects: true }),
      benefits: ['Réservation instantanée', 'Meilleurs prix garantis', 'Support 24/7', 'Modification gratuite']
    },
  }), [t]);
};

// Static paths generation (optimized)
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

// Utility functions
const stripHtml = (htmlString = '') => htmlString.replace(/<[^>]+>/g, '');

// Hero Section Component
const HeroSection = ({ serviceData, serviceId }) => (
  <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <Image
        src={serviceData.image}
        alt={serviceData.imageAlt}
        fill
        className="object-cover"
        priority
        quality={85}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
    </div>
    
    <div className="relative z-10 container mx-auto px-4 text-center text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {serviceData.title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
          {serviceData.shortDesc}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="#contact" 
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Contacter nous
          </Link>
          <Link 
            href="#contact" 
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full text-lg font-semibold border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
          >
            Demander un devis
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

// Optimized Program Card
const ProgramCard = ({ program }) => {
  const snippet = stripHtml(program.description || '');
  
  return (
    <motion.article
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={program.images?.[0] || '/placeholder.jpg'}
          alt={program.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Icon icon="mdi:map-marker" className="w-4 h-4" />
                <span className="text-sm">{program.location_from} → {program.location_to}</span>
              </div>
              <span className="bg-orange-500 px-2 py-1 rounded-full text-xs font-semibold">
                {program.days} Jours
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
          {program.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
          {snippet}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-orange-500">
            {program.price} TND
          </div>
          <Link 
            href={`/programs/${program.id}`} 
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2 text-sm font-medium"
          >
            <span>Voir détails</span>
            <Icon icon="mdi:arrow-right" className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

// Optimized Excursion Card
const ExcursionCard = React.memo(({ excursion }) => (
  <motion.article
    className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6 }}
  >
    <div className="relative h-64 overflow-hidden">
      <Image
        src={excursion.image}
        alt={excursion.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
        <div className="absolute top-4 right-4">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {excursion.duration}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Icon icon="mdi:map-marker" className="w-4 h-4" />
            <span className="text-sm font-medium">{excursion.location}</span>
          </div>
          <div className="text-2xl font-bold">{excursion.price}</div>
        </div>
      </div>
    </div>
    
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition-colors line-clamp-2">
        {excursion.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {excursion.shortDesc}
      </p>
      
      <div className="space-y-2 mb-6">
        {excursion.highlights.slice(0, 3).map((highlight, i) => (
          <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
            <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>{highlight}</span>
          </div>
        ))}
      </div>
      
      <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2">
        <span>Réserver maintenant</span>
        <Icon icon="mdi:arrow-right" className="w-4 h-4" />
      </button>
    </div>
  </motion.article>
));

// Minimalist Engagement Card Component
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

// Benefits Section Component
const BenefitsSection = ({ serviceData }) => (
  <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Pourquoi nous choisir?
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto rounded-full" />
      </motion.div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {serviceData.benefits?.map((benefit, index) => (
          <motion.div
            key={index}
            className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon icon="mdi:check-bold" className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Nos Engagements Section
const EngagementsSection = ({ serviceData, serviceId }) => (
    <section className="py-20 bg-white relative overflow-hidden">
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


      {/* Bottom CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link 
          href="#contact"
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <span>Contactez-nous</span>
          <Icon icon="mdi:arrow-right" className="w-5 h-5 ml-2" />
        </Link>
      </motion.div>
  </section>
);

// CTA Section Component
const CTASection = () => (
  <section className="py-20 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 relative overflow-hidden">
    <div className="absolute inset-0 bg-black/20" />
    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        className="text-center text-white max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Prêt pour votre prochaine aventure?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Laissez-nous créer des souvenirs inoubliables pour vous
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#contact"
            className="px-8 py-4 bg-white text-orange-500 rounded-full text-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Contactez-nous
          </Link>
          <Link
            href="/devis"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full text-lg font-bold hover:bg-white hover:text-orange-500 transition-all duration-300"
          >
            Devis gratuit
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

// Main Component
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500" />
        </div>
      </Layout>
    );
  }

  // SEO optimization
  const keywordsMap = {
    outbound: 'voyages groupe tunisie, circuits organisés, voyage sur mesure tunisie, agence voyage tunisie, batouta voyages',
    excursions: 'excursions tunisie, escapades tunisie, voyage découverte, excursion jerba, cap bon tunisie, batouta voyages',
    transport: 'transport touristique tunisie, location bus tunisie, transfert aéroport tunisie, transport groupe',
    ticketing: 'billetterie voyage tunisie, réservation billet avion, agence billetterie tunis, booking tunisie'
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Accueil",
        "item": process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": serviceData.title,
        "item": `${process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn"}/services/${serviceId}`
      }
    ]
  };

  return (
    <Layout className="bg-white">
      <SEO
        title={`${serviceData.title} | Batouta Voyages - Expert en Tourisme Tunisie`}
        description={`${serviceData.shortDesc}. Découvrez nos services premium avec Batouta Voyages, votre expert en tourisme en Tunisie.`}
        keywords={keywordsMap[serviceId]}
      />
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main>
        {/* Hero Section */}
        {/* <HeroSection serviceData={serviceData} serviceId={serviceId} /> */}

        {/* Services Content */}
        <section id="services" className="py-20 mt-20">
          <div className="container mx-auto px-4">
            {/* Service-specific content */}
            <AnimatePresence mode="wait">
              {serviceId === 'ticketing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-6xl mx-auto"
                >
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Réservation Simplifiée
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      {serviceData.description}
                    </p>
                  </div>
                  <Suspense fallback={<div className="animate-pulse bg-gray-200 h-96 rounded-2xl" />}>
                    <ReservationForm />
                  </Suspense>
                </motion.div>
              )}

              {serviceId === 'excursions' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Nos Excursions en Tunisie
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      Découvrez la Tunisie authentique avec nos excursions soigneusement sélectionnées
                    </p>
                  </div>
                  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                    {Object.values(EXCURSIONS).map((excursion) => (
                      <ExcursionCard key={excursion.id} excursion={excursion} />
                    ))}
                  </div>
                </motion.div>
              )}

              {serviceId === 'outbound' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                      Nos Programmes de Voyages
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      Des voyages en groupe personnalisés pour des expériences inoubliables
                    </p>
                  </div>
                  
                  {loading ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="bg-gray-300 aspect-[4/3] rounded-2xl mb-4" />
                          <div className="bg-gray-300 h-4 rounded mb-2" />
                          <div className="bg-gray-300 h-4 rounded w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">Erreur lors du chargement des programmes</p>
                    </div>
                  ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                      {programs.slice(0, 6).map((program) => (
                        <ProgramCard key={program.id} program={program} />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {serviceId === 'transport' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center max-w-4xl mx-auto"
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    Transport Premium
                  </h2>
                  <p className="text-xl text-gray-600 mb-12">
                    {serviceData.description}
                  </p>
                  <Link
                    href="#contact"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <span>Demander un devis</span>
                    <Icon icon="mdi:arrow-right" className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        <EngagementsSection serviceData={serviceData} serviceId={serviceId} />
        {/* Benefits Section */}
        <BenefitsSection serviceData={serviceData} />

        {/* CTA Section */}
        <CTASection />
      </main>

      <ContactUs />
    </Layout>
  );
};

export default ServiceDetails;