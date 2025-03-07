import React, { useState, useEffect } from 'react';
import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from "next/link";
import { Icon } from "@iconify/react";
import { ContactUs } from "components/Contact";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const ProgramCard = ({ program }) => (
  <motion.div
    className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -5 }}
  >
    <div className="relative h-72 w-full overflow-hidden">
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
    <div className="p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-500 transition-colors">
        {program.title}
      </h3>
      <p className="text-gray-600 mb-4 line-clamp-2">
        {program.description}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
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
          className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center space-x-2 hover:bg-orange-600 transition-colors group"
        >
          <span>Details</span>
          <Icon icon="mdi:arrow-right" className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </motion.div>
);

const ImageGallery = ({ images }) => (
  <div className="grid grid-cols-4 gap-4 mb-12">
    {images.slice(0, 4).map((image, index) => (
      <motion.div
        key={index}
        className="relative h-24 rounded-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
      >
        <Image
          src={`/uploads/${image}`}
          alt={`Gallery image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className="hover:scale-110 transition-transform duration-500"
        />
      </motion.div>
    ))}
  </div>
);

export default function Programs() {
  const { t } = useTranslation('common');
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [featuredProgram, setFeaturedProgram] = useState(null);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/programs.controller');
        const data = await response.json();
        setPrograms(data);
        setFeaturedProgram(data[0]); // Set the first program as featured
        setLoading(false);
      } catch (error) {
        console.error('Error fetching programs:', error);
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const destinations = ['all', ...new Set(programs.map(p => p.location_to))];

  const filteredPrograms = selectedDestination === 'all' 
    ? programs 
    : programs.filter(p => p.location_to === selectedDestination);

  return (
    <Layout>
      <SEO
        title="Travel Programs | Discover Amazing Destinations"
        description="Explore our curated collection of travel programs and adventures across the globe."
      />
      <div className="main-wrapper mt-20">
        {/* Hero Section with Featured Program */}
        {featuredProgram && (
          <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <Image
                src={`/uploads/${featuredProgram.images[0]}`}
                layout="fill"
                objectFit="cover"
                alt={featuredProgram.title}
                className="brightness-50"
                priority
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center max-w-4xl px-4"
            >
              <span className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full mb-4">
                Programme à la Une
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {featuredProgram.title}
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                {featuredProgram.description}
              </p>
              {featuredProgram.images.length > 1 && (
                <ImageGallery images={featuredProgram.images.slice(1)} />
              )}
              <div className="flex justify-center space-x-4">
                <Link href={`/programs/${featuredProgram.id}`} passHref>
                  <button className="px-8 py-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors flex items-center space-x-2">
                    <span>Découvrez Ce Programme
                  </span>
                    <Icon icon="mdi:arrow-right" className="w-5 h-5" />
                  </button>
                </Link>
                <a href="#programs" className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors flex items-center space-x-2">
                  <span>Voir Tous les Programmes</span>
                  <Icon icon="mdi:arrow-down" className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          </section>
        )}

        {/* Programs Section */}
        <section id="programs" className="py-20 px-4 md:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Programmes Disponible
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez parmi notre sélection d &lsquo; expériences de voyage soigneusement conçues.
              </p>
            </motion.div>

            {/* Destination Filter */}
            <div className="flex justify-center mb-12 space-x-4 overflow-x-auto pb-4">
              {destinations.map((dest) => (
                <button
                  key={dest}
                  onClick={() => setSelectedDestination(dest)}
                  className={`px-6 py-3 rounded-full transition-all ${
                    selectedDestination === dest
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  {dest.charAt(0).toUpperCase() + dest.slice(1)}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </div>
        </section>

        <ContactUs />
      </div>
    </Layout>
  );
}