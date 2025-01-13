import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Typewriter from 'typewriter-effect';
import SEO from "components/SEO/SEO";
import { Layout } from "components/Layout";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Contact from 'components/Contact/ContactUs';
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
              <Image
                width={300}
                height={300}
                src="/3d-globe.avif" 
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
                <Icon icon="noto:shinto-shrine" className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">{t('AboutUs.WhoWeAre.features.feature1.title')}</h3>
                <p className="text-gray-600">{t('AboutUs.WhoWeAre.features.feature1.description')}</p>
              </motion.div>

              <motion.div 
                className="bg-gray-50 p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Icon icon="mdi:palm-tree" className="w-12 h-12 text-orange-500 mb-4" />
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

const History = () => {
  const { t } = useTranslation('common');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="history" className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto relative">
        {/* Section Title */}
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {t('AboutUs.History.title', 'Our History')}
        </motion.h2>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>Mr. Zouhair Mbarek</strong> is the current owner of Batouta Voyages. He has a master’s degree in
              Production engineering from a Japanese university. He spent many years working in Japan for Hitachi Corp &
              other institutions. Having travelled through Europe and the US, he returned to Tunisia and started a Travel
              Agency with his business partner <strong>Mr. Mourad Fourati</strong> (he too has a Master’s degree from Shizuoka University).
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              In 1995, Batouta Voyages was born. Fluent in four languages—Japanese, English, French, and Arabic—and
              fashioned from the service standards of the Japanese quality system, who better to deliver custom packages
              and travel services to Tunisia?
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Little by little, Batouta Voyages has grown, catering to customers from all over the world, for both personal
              and corporate travel.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              To the question “Why create a travel agency in Tunisia?” Zouhair answers: “I just want people to discover
              the true beauty and history of Tunisia. We design travel around the customer’s needs and desires; we custom
              make Tunisia travel.”
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto shadow-2xl">
              <Image
                width={500}
                height={500}
                src="/Batouta_team.png"
                alt="Mr. Zouhair Mbarek and Batouta Voyages"
                className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const OurValues = () => {
  const { t } = useTranslation('common');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: "mdi:heart",
      color: "text-red-500",
      title: "Passion for travel",
      description: "We love what we do! Our teams across Asia aim to inspire guests with a true appreciation for ‘Our Asia’."
    },
    {
      icon: "mdi:map",
      color: "text-blue-500",
      title: "Local knowledge",
      description: "Our offices across Asia offer expert insights and on the ground knowledge about each destination."
    },
    {
      icon: "mdi:earth",
      color: "text-green-500",
      title: "Global representation",
      description: "We have representatives around the globe offering multilingual services in every time zone."
    },
    {
      icon: "mdi:account",
      color: "text-yellow-500",
      title: "Customer service",
      description: "We want our guests to touch, taste and experience the beating heart of every destination they visit."
    },
    {
      icon: "mdi:lightbulb",
      color: "text-purple-500",
      title: "Innovation",
      description: "We continue to seek new solutions and integrate new technologies into our wide range of services."
    },
    {
      icon: "mdi:leaf",
      color: "text-green-700",
      title: "Responsibility",
      description: "We focus on ethical and sustainable tours, including authentic interactions with local people and places."
    }
  ];

  return (
    <section ref={ref} className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {t('AboutUs.OurValues.title', 'Our Values')}
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className={`w-16 h-16 flex items-center justify-center mb-4 ${value.color}`}>
                <Icon icon={value.icon} className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-700">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </motion.div>
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
        <History />
        <Contact />
    </Layout>

  );
}