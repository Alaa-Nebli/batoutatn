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
        <span className="text-2xl font-bold text-left">{content.title}</span>
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
        {/* Notice we use dangerouslySetInnerHTML for the description */}
        <div className="space-y-4">
          <div
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.description }}
          />
        </div>
        {content.image && (
          <div className="relative aspect-video md:aspect-[3/2] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={content.image}
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

const DropdownSection = ({ title, content }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-8 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between bg-white text-gray-800 hover:bg-gray-50 font-semibold text-lg"
      >
        <span>{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <Icon icon="mdi:chevron-down" className="w-6 h-6" />
        </motion.div>
      </button>
      {open && (
        <div className="px-6 py-4 text-gray-600 leading-relaxed whitespace-pre-line">
          {/* Render HTML */}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  );
};

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
                src={image}
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
            <p className="font-semibold text-gray-800 text-4xl mb-5">Durée</p>
            <p className="text-gray-600 text-lg">{program.days} jours</p>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">À</p>
        <div className="flex items-end justify-between">
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-orange-500">
              {program.price ? program.price.toLocaleString('de-DE') : '...'}
            </span>
            <span className="text-lg pb-1 text-gray-600">TND</span>
            <span className="text-lg pb-1 text-gray-600"> / Personne en chambre double</span>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">Supplément single :  </p>
        <div className="flex items-end justify-between">
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-orange-500">
              {program.singleAdon ? program.singleAdon.toLocaleString('de-DE') : '...'}
            </span>
            <span className="text-lg pb-1 text-gray-600">TND</span>
            <span className="text-lg pb-1 text-gray-600"> / Personne</span>
          </div>
          
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors">
            Réserver
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function ProgramDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTimelineDay, setActiveTimelineDay] = useState(null);
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
            <p className="text-gray-600">Le programme que vous recherchez n’existe pas ou a été supprimé.</p>
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

  return (
    <Layout>
      <SEO
        title={`${program.title} | Expérience de Voyage`}
        description={
          program.description 
            ? program.description.replace(/<[^>]+>/g, '').substring(0, 160) 
            : "Programme"
        }
        image={program.images && program.images[0]}
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
              <ImageCarousel images={program.images || []} />
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
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Aperçu du séjour</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {/* Render the description as HTML */}
              <div 
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: program.description }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
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
        
        {/* Price Includes & General Conditions */}
        <section className="mb-20">
          <DropdownSection 
            title="Ce prix comprend & ne comprend pas" 
            content={program.priceInclude || ''} 
          />
          <DropdownSection 
            title="Conditions générales du voyage" 
            content={program.generalConditions || ''} 
          />
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
            {(program.images || []).slice(0, 6).map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative aspect-square rounded-xl overflow-hidden group"
              >
                <Image
                  src={image}
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
            <p className="text-gray-600 text-sm">À</p>
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
