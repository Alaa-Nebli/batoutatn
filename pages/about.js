import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Typewriter from 'typewriter-effect';
import SEO from "@components/SEO/SEO";
import { Layout } from "@components/Layout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Contact from '@components/Contact/ContactUs';
//Banner Component
const Banner = () => {
  const { t } = useTranslation('common');
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const getWindowDimensions = () => {
    if (typeof window !== 'undefined') {
      return {
        width: window.innerWidth,
        height: window.innerHeight
      };
    }
    return { width: 0, height: 0 };
  };

  const dimensions = getWindowDimensions();

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-orange-900"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradient 15s ease infinite',
        }}
      >
        {/* Animated particles */}
        <motion.div className="absolute inset-0 opacity-20">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 md:w-3 md:h-3 rounded-full"
              style={{
                background: i % 2 === 0 ? '#fb923c' : '#fff',
                boxShadow: '0 0 10px rgba(255,255,255,0.5)',
              }}
              initial={{ x: Math.random() * dimensions.width, y: -20 }}
              animate={{
                y: dimensions.height + 20,
                x: Math.random() * dimensions.width,
                rotate: 360,
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-6xl mx-auto px-4 md:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ y }}
        >
          <motion.div
            className="mb-8"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Icon 
              icon="game-icons:torii-gate" 
              className="w-16 h-16 md:w-24 md:h-24 text-orange-500 mx-auto"
            />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            <Typewriter
              options={{
                strings: [
                  t('AboutUs.Banner.title_1'),
                  t('AboutUs.Banner.title_2'),
                  t('AboutUs.Banner.title_3'),
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                html: true,
                deleteSpeed: 30,
              }}
            />
          </h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
                  {t('AboutUs.Banner.description')}
            </motion.p>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#2563eb' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-orange-500 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/50"
            >
                  {t('AboutUs.Banner.discover_button')}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: '#1e40af' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold transition-all duration-300 hover:bg-white hover:text-gray-900"
            >
                  {t('AboutUs.Banner.contact_button')}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ 
          y: [0, 10, 0],
          opacity: [1, 0.5, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-white flex flex-col items-center gap-2">
          <p className="text-sm font-light tracking-widest uppercase">{t('AboutUs.Banner.scroll_label')}</p>
          <Icon 
            icon="mdi:arrow-down-circle" 
            className="w-8 h-8 md:w-12 md:h-12"
          />
        </div>
      </motion.div>
    </section>
  );
};

// Enhanced WhoWeAre Component
const WhoWeAre = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation('common');

  return (
    <section ref={ref} className="py-24 md:py-32 px-4 md:px-6 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64">
          <Icon icon="mdi:pattern" className="w-full h-full text-orange-500" />
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 transform rotate-180">
          <Icon icon="mdi:pattern" className="w-full h-full text-blue-500" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Floating elements */}
        <motion.div
          className="absolute -top-10 -left-10 hidden md:block"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Icon icon="mdi:sakura" className="w-20 h-20 text-pink-200" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto shadow-2xl">
              <img 
                src="/Batouta_Logo.png" 
                alt="Our Team" 
                className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
           
            </div>

            {/* Stats overlay */}
            <motion.div
              className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-500">{t('AboutUs.WhoWeAre.stats.years_of_excellence')}</p>
                <p className="text-gray-600">{t('AboutUs.WhoWeAre.stats.years_label')}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 order-2 lg:order-1"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            {t('AboutUs.WhoWeAre.title_1')}<br/>
              <span className="text-orange-500">{t('AboutUs.WhoWeAre.title_2')}</span>
            </h2>
            
            <p className="text-lg text-gray-600 leading-relaxed">
            {t('AboutUs.WhoWeAre.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div 
                className="bg-gray-50 p-6 rounded-2xl hover:bg-orange-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Icon icon="mdi:palm-tree" className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">{t('AboutUs.WhoWeAre.features.feature1.title')}</h3>
                <p className="text-gray-600">{t('AboutUs.WhoWeAre.features.feature1.description')}</p>
              </motion.div>

              <motion.div 
                className="bg-gray-50 p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Icon icon="mdi:palm-tree" className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">{t('AboutUs.WhoWeAre.features.feature2.title')}</h3>
                <p className="text-gray-600">{t('AboutUs.WhoWeAre.features.feature2.description')}</p>
              </motion.div>
            </div>

            <motion.div
              className="flex gap-4 pt-6"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
              >
                {t('AboutUs.WhoWeAre.buttons.services')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border-2 border-gray-800 text-gray-800 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-colors"
              >
                {t('AboutUs.WhoWeAre.buttons.learn_more')}
                </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const OurValues = () => {
  const { t } = useTranslation('common');

  const values = [
    {
      icon: "mdi:compass",
      color: "bg-blue-500",
      hoverColor: "group-hover:text-blue-500",
      title:  t('AboutUs.OurValues.values.innovation.title'),
      description: t('AboutUs.OurValues.values.innovation.description')
    },
    {
      icon: "mdi:shield",
      color: "bg-green-500",
      hoverColor: "group-hover:text-green-500",
      title: t('AboutUs.OurValues.values.integrity.title'),
      description: t('AboutUs.OurValues.values.integrity.description')
    },
    {
      icon: "mdi:star",
      color: "bg-purple-500",
      hoverColor: "group-hover:text-purple-500",
      title: t('AboutUs.OurValues.values.excellence.title'),
      description: t('AboutUs.OurValues.values.excellence.description')
    }
  ];

  return (
    <section className="py-16 md:py-32 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-center bg-no-repeat bg-cover mix-blend-overlay" />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            {t('AboutUs.OurValues.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-16 md:space-y-24">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 group`}
            >
              <div className="md:w-1/3 flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`w-24 h-24 ${value.color} rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:shadow-2xl`}
                >
                  <Icon icon={value.icon} className="w-12 h-12 text-white" />
                </motion.div>
              </div>
              <div className={`md:w-2/3 text-center ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${value.hoverColor} transition-colors duration-300`}>
                  {value.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tunisia-themed decorative elements */}
        <motion.div
          className="absolute -bottom-8 right-0 opacity-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Icon icon="game-icons:tunisia" className="w-24 h-24 text-purple-500" />
        </motion.div>

        <motion.div
          className="absolute top-0 left-0 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Icon icon="mdi:sun" className="w-16 h-16 text-orange-500" />
        </motion.div>
      </div>
    </section>
  );
};

const TimelineItem = ({ year, title, description, index }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslation('common');

  return (
    <motion.div
      ref={ref}
      className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-24`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
    >
      {/* Animated connection line */}
      <motion.div
        className={`absolute h-24 w-1 bg-gradient-to-b from-orange-500 to-purple-800 
          ${index % 2 === 0 ? 'left-1/2 -translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}
        initial={{ height: 0 }}
        animate={isInView ? { height: 96 } : { height: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 }}
      />

      {/* Timeline node */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 flex items-center justify-center shadow-lg"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ duration: 0.4, delay: index * 0.2 }}
      >
        <div className="w-4 h-4 rounded-full bg-white" />
      </motion.div>

      <div className={`w-5/12 ${index % 2 === 0 ? 'pr-16' : 'pl-16'}`}>
        <motion.div
          className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-orange-100"
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-purple-500 text-transparent bg-clip-text">
              {year}
            </span>
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Icon icon="mdi:arrow-right" className="w-6 h-6 text-purple-500" />
            </motion.div>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-orange-500 transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  const { t } = useTranslation('common');

  const timelineData = [
    {
      year: t('AboutUs.Timeline.events.event_1.year'),
      title:t('AboutUs.Timeline.events.event_1.title'),
      description: t('AboutUs.Timeline.events.event_1.title')
    },
    {
      year: t('AboutUs.Timeline.events.event_2.year'),
      title:t('AboutUs.Timeline.events.event_2.title'),
      description: t('AboutUs.Timeline.events.event_2.title')
    },
    {
      year: t('AboutUs.Timeline.events.event_3.year'),
      title:t('AboutUs.Timeline.events.event_3.title'),
      description: t('AboutUs.Timeline.events.event_3.title')
    },
    {
      year: t('AboutUs.Timeline.events.event_4.year'),
      title:t('AboutUs.Timeline.events.event_4.title'),
      description: t('AboutUs.Timeline.events.event_4.title')
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-gradient-to-b from-orange-50 to-white">
      {/* Top Wave Pattern */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg 
          className="relative block w-full h-32"
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-gray-50"
          />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating circles */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-orange-200 opacity-20"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 rounded-full bg-purple-200 opacity-20"
          animate={{ 
            y: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />

        {/* Decorative icons */}
        <motion.div
          className="absolute bottom-20 left-20 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Icon icon="game-icons:tunisia" className="w-16 h-16 text-orange-500" />
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-purple-600 text-transparent bg-clip-text">
            Our Journey
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-500 mx-auto rounded-full" />
        </motion.div>
        
        <div className="relative">
          {/* Central timeline line */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-200 to-purple-200" />
          
          {/* Timeline items */}
          {timelineData.map((item, index) => (
            <TimelineItem
              key={item.year}
              year={item.year}
              title={item.title}
              description={item.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

export default function AboutUs() {
  return (
    <Layout className="bg-white">
      <SEO
        title="About Batouta Voyages | Your Bridge Between Tunisia and Japan"
        description="Discover the story of Batouta Voyages, connecting Tunisia and Japan through extraordinary travel experiences since 1995. Learn about our values, journey, and commitment to cultural exchange."
      />
        <Banner />
        <WhoWeAre />
        <OurValues />
        <Timeline />
        <Contact />
    </Layout>

  );
}