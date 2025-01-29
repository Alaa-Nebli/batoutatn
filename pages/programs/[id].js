import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from "@iconify/react";
import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import Image from 'next/image';
import Link from "next/link";
import { ContactUs } from "components/Contact";

const CustomAccordion = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <motion.div 
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => toggleAccordion(index)}
            className={`w-full text-left px-6 py-4 flex justify-between items-center transition-all ${
              activeIndex === index 
                ? 'bg-orange-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span className="text-xl font-semibold">{item.title}</span>
            <motion.div
              animate={{ rotate: activeIndex === index ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon icon="mdi:chevron-down" className="w-6 h-6" />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {activeIndex === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transition: { 
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: { 
                    duration: 0.2,
                    ease: "easeInOut"
                  }
                }}
                className="overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-6 p-6">
                  <div>
                    <p className="text-lg text-gray-700 mb-6">{item.description}</p>
                    <div>
                      <h4 className="text-2xl font-semibold text-orange-600 mb-4">Activities</h4>
                      <ul className="space-y-3">
                        {item.activities?.map((activity, actIndex) => (
                          <li key={actIndex} className="flex items-center space-x-3">
                            <Icon icon="mdi:check-circle" className="text-emerald-500 w-6 h-6" />
                            <span className="text-lg text-gray-700">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="relative h-[300px] rounded-xl overflow-hidden">
                    {item.image && (
                      <Image 
                        src={item.image} 
                        alt={item.title}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

const ProgramDetails = ({ programDetails }) => {
  if (!programDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-800">Program not found</h2>
          <p className="text-gray-600">The program you&#39;re looking for doesn&#39;t exist or has been removed.</p>
        </motion.div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <SEO 
        title={`${programDetails.title} | Detailed Itinerary`}
        description={programDetails.description}
      />

      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={programDetails.images[0]} 
            layout="fill" 
            objectFit="cover" 
            alt={programDetails.title}
            className="opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 max-w-7xl mx-auto px-4"
        >
          <h1 className="text-6xl font-bold text-white mb-6">
            {programDetails.title}
          </h1>
          <div className="flex space-x-6 text-white text-xl">
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:calendar" className="w-6 h-6 text-orange-400" />
              <span>{programDetails.days} Days</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:map-marker" className="w-6 h-6 text-emerald-400" />
              <span>{programDetails.location_from}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon icon="mdi:wallet-travel" className="w-6 h-6 text-blue-400" />
              <span>${parseFloat(programDetails.price).toLocaleString()}</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Program Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold text-gray-800">Journey Overview</h2>
              <p className="text-xl text-gray-600">{programDetails.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-2xl font-semibold text-orange-600 mb-4">Trip Details</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Icon icon="mdi:calendar" className="text-emerald-500" />
                      <span>From: {formatDate(programDetails.from_date)}</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Icon icon="mdi:calendar" className="text-emerald-500" />
                      <span>To: {formatDate(programDetails.to_date)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image 
                src={programDetails.images[1]} 
                layout="fill" 
                objectFit="cover" 
                alt="Program Overview" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Itinerary */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Day-by-Day Itinerary
          </h2>
          
          <CustomAccordion items={programDetails.timeline} />
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-20 bg-gradient-to-r from-orange-100 to-amber-100">
        <div className="max-w-7xl mx-auto text-center px-4">
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
            Book this extraordinary journey or customize it to your preferences. Our travel experts are ready to craft your perfect adventure.
          </p>
          <div className="flex justify-center space-x-6">
            <Link href="/booking">
              <p className="px-10 py-5 bg-orange-500 text-white text-xl rounded-xl hover:bg-orange-600 transition-colors inline-flex items-center">
                Book This Program
                <Icon icon="mdi:arrow-right" className="ml-3 text-2xl" />
              </p>
            </Link>
            <Link href="/contact">
              <p className="px-10 py-5 border-2 border-gray-800 text-gray-800 text-xl rounded-xl hover:bg-gray-800 hover:text-white transition-colors">
                Custom Trip Inquiry
              </p>
            </Link>
          </div>
        </div>
      </section>

      <ContactUs />
    </Layout>
  );
};

export default ProgramDetails;