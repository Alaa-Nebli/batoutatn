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
          Day {day}
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
      animate={{ height: isActive ? 'auto' : 0 }}
      className="overflow-hidden"
    >
      <div className="p-6 grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed">{content.description}</p>
          {content.highlights && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Highlights:</h4>
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
        transition={{ delay: idx * 0.1 }}
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
        transition={{ delay: idx * 0.1 }}
        className="relative aspect-square rounded-xl overflow-hidden group"
      >
        <Image
          src={`/uploads/${image}`}
          alt={`Gallery image ${idx + 1}`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
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
        if (!response.ok) throw new Error('Program not found');
        
        const data = await response.json();
        setProgram(data);
      } catch (err) {
        setError(err.message);
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
            <h2 className="text-2xl font-bold text-gray-800">Program Not Found</h2>
            <p className="text-gray-600">The program you're looking for doesn't exist or has been removed.</p>
            <Link href="/programs">
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                View All Programs
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
      description: `${program.location_from} to ${program.location_to}`
    },
    {
      icon: "mdi:calendar-clock",
      title: "Duration",
      description: `${program.days} Days of Adventure`
    },
    {
      icon: "mdi:currency-usd",
      title: "Investment",
      description: `Starting from €${program.price}`
    }
  ];

  return (
    <Layout>
      <SEO
        title={`${program.title} | Travel Experience`}
        description={program.description}
      />

      {/* Hero Section */}
      <section className="relative h-[90vh]">
        <div className="absolute inset-0">
          <Image
            src={`/uploads/${program.images[0]}`}
            alt={program.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </div>

        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">{program.title}</h1>
            <p className="text-xl mb-8 text-gray-200">{program.description}</p>
            <div className="flex flex-wrap gap-6">
              {highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <Icon icon={highlight.icon} className="w-6 h-6" />
                  <span>{highlight.description}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Program Highlights</h2>
            <p className="text-xl text-gray-600">Discover what makes this journey unique</p>
          </motion.div>
          
          <ProgramHighlights highlights={highlights} />
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Journey Preview</h2>
            <p className="text-xl text-gray-600">Glimpses of your upcoming adventure</p>
          </motion.div>

          <ImageGallery images={program.images} />
        </div>
      </section>

      {/* Detailed Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Your Journey Timeline</h2>
            <p className="text-xl text-gray-600">Day by day breakdown of your adventure</p>
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