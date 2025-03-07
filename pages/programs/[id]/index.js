import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from "@iconify/react";
import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import Image from 'next/image';
import Link from "next/link";
import { ContactUs } from "components/Contact";
import { useRouter } from 'next/router';

const TimelineItem = ({ day, isActive, onClick, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
  >
    <button
      onClick={onClick}
      className={`w-full px-6 py-4 flex items-center justify-between ${
        isActive ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-4">
        <span className={`text-2xl font-bold ${isActive ? 'text-white' : 'text-orange-500'}`}>
          Jour {day}
        </span>
        <h3 className="text-lg font-semibold">{content.title}</h3>
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
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">{content.description}</p>
          {content.highlights && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Points forts :</h4>
              <ul className="space-y-2">
                {content.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <Icon icon="mdi:check-circle" className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {content.image && (
          <div className="relative h-64 rounded-xl overflow-hidden">
            <Image
              src={`/uploads/${content.image}`}
              alt={content.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
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
        viewport={{ once: true }}
        transition={{ delay: idx * 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      >
        <Icon icon={highlight.icon} className="w-12 h-12 text-orange-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{highlight.title}</h3>
        <p className="text-gray-600">{highlight.description}</p>
      </motion.div>
    ))}
  </div>
);

const ImageGallery = ({ images }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {images.map((image, idx) => (
      <motion.div
        key={idx}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1, duration: 0.5 }}
        className="relative aspect-square rounded-xl overflow-hidden group"
      >
        <Image
          src={`/uploads/${image}`}
          alt={`Image de galerie ${idx + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </motion.div>
    ))}
  </div>
);


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
        console.log(data[0])
        setProgram(data);
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
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Programme non trouvé</h2>
            <p className="text-gray-600">Le programme que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link href="/programs">
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                Voir tous les programmes
              </button>
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
      icon: "mdi:currency-usd",
      title: "Investissement",
      description: `À partir de ${program.price}€`,
    },
  ];

  return (
    <Layout>
      <SEO
        title={`${program.title} | Expérience de Voyage`}
        description={program.description}
      />

      {/* Section Héro */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Image
            src={`/uploads/${program.images[0]}`}
            alt={program.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </motion.div>

        <motion.div
          className="relative h-full max-w-7xl mx-auto px-4 flex items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="max-w-3xl text-white">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {program.title}
            </motion.h1>
            <motion.p
              className="text-xl mb-8 text-gray-200"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              {program.description}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Icon icon={highlight.icon} className="w-6 h-6" />
                  <span>{highlight.description}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Points forts du programme */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Points forts du programme</h2>
            <p className="text-xl text-gray-600">Découvrez ce qui rend ce voyage unique</p>
          </motion.div>
          <ProgramHighlights highlights={highlights} />
        </div>
      </section>

      {/* Galerie d'images */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Aperçu du voyage</h2>
            <p className="text-xl text-gray-600">Découvrez votre prochaine aventure en images</p>
          </motion.div>
          <ImageGallery images={program.images} />
        </div>
      </section>

      {/* Chronologie détaillée */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Itinéraire de votre voyage</h2>
            <p className="text-xl text-gray-600">Déroulement jour par jour de votre aventure</p>
          </motion.div>
          <div className="space-y-4">
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
        </div>
      </section>

      <ContactUs />
    </Layout>
  );
}