import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from "@iconify/react";
import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import Image from 'next/image';
import Link from "next/link";
import { ContactUs } from "components/Contact";
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


const TimelineItem = ({ day, isActive, onClick, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
  >
    <button
      onClick={onClick}
      className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
        isActive ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-4">
        <span className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-orange-500'}`}>
          Jour {day}
        </span>
        <h3 className="text-lg font-semibold text-left">{content.title}</h3>
      </div>
      <motion.div
        animate={{ rotate: isActive ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <Icon icon="mdi:chevron-down" className="w-6 h-6" />
      </motion.div>
    </button>

    <motion.div
      initial={false}
      animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">{content.description}</p>
          {content.highlights && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 text-lg">Points forts :</h4>
              <ul className="space-y-3">
                {content.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start space-x-3">
                    <Icon icon="mdi:check-circle" className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {content.image && (
          <div className="relative aspect-video md:aspect-[3/2] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={`/uploads/${content.image}`}
              alt={content.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={isActive}
            />
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
);

const ProgramHighlights = ({ highlights }) => (
  <div className="grid md:grid-cols-3 gap-6">
    {highlights.map((highlight, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        transition={{ delay: idx * 0.1, duration: 0.5 }}
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      >
        <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
          <Icon icon={highlight.icon} className="w-7 h-7 text-orange-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{highlight.title}</h3>
        <p className="text-gray-600">{highlight.description}</p>
      </motion.div>
    ))}
  </div>
);

const ImageCarousel = ({ images }) => {
  return (
    <div className="relative h-full rounded-xl overflow-hidden shadow-lg">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-full"
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative h-full w-full">
              <Image
                src={`/uploads/${image}`}
                alt={`Slide ${idx + 1}`}
                fill
                className="object-cover"
                priority={idx < 3}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const ProgramHeaderCard = ({ program }) => {
  
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        {program.title}
      </h1>
      
      <br />
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon icon="mdi:map-marker" className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-4xl mb-5">Destination</p>
            <p className="text-gray-600 text-lg">{program.location_from} → {program.location_to}</p>

          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Icon icon="mdi:calendar" className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-4xl mb-5">Dates</p>
            <p className="text-gray-600 text-lg">
              {formatDate(program.from_date)} - {formatDate(program.to_date)}
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Icon icon="mdi:clock-outline" className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-4xl mb-5"> Durée</p>
            <p className="text-gray-600 text-lg">{program.days} jours</p>
          </div>
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">À partir de</p>
        <div className="flex items-end justify-between">
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-orange-500">{program.price || '...'}</span>
            <span className="text-lg pb-1 text-gray-600">TND</span>
          </div>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const DescriptionSection = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 300;

  if (!description) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Description du voyage</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 leading-relaxed">
              {isExpanded ? description : `${description.substring(0, maxLength)}${description.length > maxLength ? '...' : ''}`}
            </p>
            {description.length > maxLength && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-orange-500 hover:text-orange-600 mt-4 flex items-center text-sm font-medium"
              >
                {isExpanded ? (
                  <>
                    <span>Voir moins</span>
                    <Icon icon="mdi:chevron-up" className="ml-1 w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Voir plus</span>
                    <Icon icon="mdi:chevron-down" className="ml-1 w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function ProgramDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTimelineDay, setActiveTimelineDay] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      if (!id) return;
  
      try {
        const response = await fetch(`/api/programs.controller?id=${id}`);
        if (!response.ok) throw new Error('Programme non trouvé');

        const data = await response.json();
        const programData = Array.isArray(data) ? data[0] : data;
        
        if (!programData) throw new Error('Programme non trouvé');
        
        setProgram(programData);
      } catch (err) {
        setError(err.message || 'Échec du chargement des détails du programme');
      } finally {
        setLoading(false);
      }
    };
  
    fetchProgramDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"
          ></motion.div>
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6 max-w-md px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-orange-500"
            >
              <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 mx-auto" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-800">Programme non trouvé</h2>
            <p className="text-gray-600">Le programme que vous recherchez n &lsquo; existe pas ou a été supprimé.</p>
            <Link href="/programs">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md"
              >
                Voir tous les programmes
              </motion.button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const highlights = [
    {
      icon: "mdi:map-marker-radius",
      title: "Destination",
      description: `${program.location_from} à ${program.location_to}`,
    },
    {
      icon: "mdi:calendar-clock",
      title: "Durée",
      description: `${program.days} jours d'aventure`,
    },
    {
      icon: "mdi:star-outline",
      title: "Expérience",
      description: "Voyage culturel immersif",
    },
  ];

  return (
    <Layout>
      <SEO
        title={`${program.title} | Expérience de Voyage`}
        description={program.description.substring(0, 160)}
        image={`/uploads/${program.images[0]}`}
      />

      {/* Hero Section - Split Layout */}
      <section className="py-32 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-[400px] md:h-[500px]"
            >
              <ImageCarousel images={program.images} />
            </motion.div>
            
            {/* Right Column - Program Header Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ProgramHeaderCard program={program} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full-width Description Section */}
      <DescriptionSection description={program.description} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Highlights Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Pourquoi choisir ce voyage ?</h2>
            <p className="text-lg text-gray-600">Une expérience unique conçue pour vous</p>
          </motion.div>
          <ProgramHighlights highlights={highlights} />
        </section>

        {/* Detailed Timeline */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Itinéraire détaillé</h2>
            <p className="text-lg text-gray-600">Découvrez chaque jour de votre aventure</p>
          </motion.div>
          <div className="space-y-6">
            {program.timeline.map((timelineItem, idx) => (
              <TimelineItem
                key={idx}
                day={idx + 1}
                content={timelineItem}
                isActive={activeTimelineDay === idx}
                onClick={() => setActiveTimelineDay(activeTimelineDay === idx ? null : idx)}
              />
            ))}
          </div>
        </section>

        {/* Gallery Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Galerie photo</h2>
            <p className="text-lg text-gray-600">Un aperçu visuel de votre future expérience</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {program.images.slice(0, 6).map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <Image
                  src={`/uploads/${image}`}
                  alt={`Gallery image ${idx + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <p className="text-gray-600 text-sm">À partir de</p>
            <p className="font-bold text-orange-500 text-xl">
              {Math.round(program.price)} TND
            </p>
          </div>
          <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Réserver
          </button>
        </div>
      </div>

      <ContactUs />
    </Layout>
  );
}