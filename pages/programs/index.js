"use client";
import React, { useState, useEffect } from 'react';
import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ContactUs } from "components/Contact";

// Helper function to strip HTML tags and get plain text:
function stripHtml(htmlString = '') {
  return htmlString.replace(/<[^>]+>/g, '');
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const ProgramCard = ({ program }) => {
  // Strip out HTML for listing snippet:
  const snippet = stripHtml(program.description || '');

  const formatDate = (date, options = {}) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...options,
    });
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={program.images?.[0] || '/placeholder.jpg'}
          alt={`${program.title} - Circuit au départ de ${program.location_from}`}
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

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors">
          {program.title}
        </h3>
        <h4 className="text-xl md:text-xl font-bold text-gray-800 mb-4">
  Du {formatDate(program.from_date, { year: undefined })} au {formatDate(program.to_date)}
</h4>


        {/* Display plain text snippet with line clamp */}
        <div className="mb-4 max-h-[72px] overflow-hidden relative">
            <p className="text-gray-600 text-sm line-clamp-3">
              {snippet}
            </p>
            {/* Fade effect for truncated text */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent"></div>
          </div>


        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-auto">
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

const FeaturedProgram = ({ program }) => {
  // Also strip HTML for the hero text snippet:
  const snippet = stripHtml(program.description || '');

  return (
    <section className="relative mt-24 h-[90vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={program.images?.[0] || '/placeholder.jpg'}
          fill
          alt={program.title}
          className="object-cover brightness-75"
          priority
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-6xl px-4"
      >
        <motion.span 
          className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full mb-6 text-sm font-medium"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Programme à la Une
        </motion.span>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          {program.title}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto line-clamp-3">
          {snippet}
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link href={`/programs/${program.id}`} passHref>
  <motion.a
    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 font-medium"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span>Découvrir ce programme</span>
    <Icon icon="mdi:arrow-right" className="w-5 h-5" />
  </motion.a>
</Link>

          <a 
            href="#programs" 
            className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center space-x-2 font-medium"
          >
            <span>Voir tous les programmes</span>
            <Icon icon="mdi:arrow-down" className="w-5 h-5" />
          </a>
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {program.images?.slice(1, 5).map((image, index) => (
            <motion.div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Image
                src={image}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [featuredProgram, setFeaturedProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/programs.controller?active=true');
        const data = await response.json();
  
        // Ensure data is an array, fallback to empty array
        const programsArray = Array.isArray(data) ? data : [];
  
        setPrograms(programsArray);
  
        // Pick a featured program with images, fallback to first if any
        const featured = programsArray.find((p) => p.images?.length > 0) || programsArray[0] || null;
        setFeaturedProgram(featured);
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setPrograms([]); // Ensure no .map crash
        setFeaturedProgram(null);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);
  

  const destinations = [
    'all',
    ...new Set(programs.map((p) => p.location_to).filter(Boolean)),
  ];

  const filteredPrograms = selectedDestination === 'all'
    ? programs
    : programs.filter((p) => p.location_to === selectedDestination);

  return (
    <Layout>
      <SEO
          title="Voyages organisés en Tunisie et à l'international | Batouta.tn"
        description="Explorez nos programmes de voyage : circuits, excursions et séjours en Tunisie et à l'étranger, sélectionnés pour des expériences inoubliables."
      />

      {/* Featured Program Hero */}
      {featuredProgram && <FeaturedProgram program={featuredProgram} />}

      {/* All Programs Section */}
      <section id="programs" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Nos Programmes de Voyage
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choisissez parmi notre sélection d’expériences de voyage soigneusement conçues.
            </p>
          </motion.div>

          {/* Destination Filter */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {destinations.map((dest) => (
              <button
                key={dest}
                onClick={() => setSelectedDestination(dest)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedDestination === dest
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                }`}
              >
                {dest === 'all' ? 'Toutes les destinations' : dest}
              </button>
            ))}
          </motion.div>

          {/* Programs Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            </div>
          ) : (
            <motion.div
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {filteredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </motion.div>
          )}

          {!loading && filteredPrograms.length === 0 && (
            <div className="text-center py-30">
              <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mx-auto">
                <Icon icon="mdi:map-marker-off" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Aucun programme trouvé</h3>
                <p className="text-gray-600 mb-4">Aucun programme disponible pour cette destination actuellement.</p>
                <button
                  onClick={() => setSelectedDestination('all')}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Voir tous les programmes
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <ContactUs />
    </Layout>
  );
}
