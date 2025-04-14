import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';
import SEO from 'components/SEO/SEO';
import { Layout } from 'components/Layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Contact from 'components/Contact/ContactUs';



const WhoWeAre = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { t } = useTranslation('common');

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-4 md:px-6 bg-white relative overflow-hidden"
    >
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
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        >
          <Icon icon="mdi:sakura" className="w-20 h-20 text-pink-200" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mx-auto shadow-2xl">
              <video
                autoPlay
                loop
                playsInline
                className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
              >
                <source src="/tripsvideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Stats overlay */}
            <motion.div
              className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-xl hidden md:block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-500">
                  {t('AboutUs.WhoWeAre.stats.years_of_excellence')}
                </p>
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
              {t('AboutUs.WhoWeAre.title_1')}
              <br />
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
                <h3 className="font-bold text-xl mb-2">
                  {t('AboutUs.WhoWeAre.features.feature1.title')}
                </h3>
                <p className="text-gray-600">
                  {t('AboutUs.WhoWeAre.features.feature1.description')}
                </p>
              </motion.div>

              <motion.div
                className="bg-gray-50 p-6 rounded-2xl hover:bg-blue-50 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                <Icon icon="mdi:palm-tree" className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="font-bold text-xl mb-2">
                  {t('AboutUs.WhoWeAre.features.feature2.title')}
                </h3>
                <p className="text-gray-600">
                  {t('AboutUs.WhoWeAre.features.feature2.description')}
                </p>
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
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
          {t('AboutUs.our_History.title', 'Our History')}
          <div className="w-48 m-4 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
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
              <strong>{t('AboutUs.our_History.paragraph_1_strong')} </strong>
              {t('AboutUs.our_History.paragraph_1')}{' '}
              <strong> {t('AboutUs.our_History.paragraph_1_strong_2')} </strong>.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('AboutUs.our_History.paragraph_2')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('AboutUs.our_History.paragraph_3')}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t('AboutUs.our_History.paragraph_4')}
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden aspect-square max-w-md mb-4 mx-auto shadow-2xl">
              <Image
                width={500}
                height={500}
                src="/mr_zouhair_mbarek.jpeg"
                alt="Mr. Zouhair Mbarek and Batouta Voyages"
                className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-700"
                loading="lazy"
              />
            </div>
            <p className="text-center text-sm text-black"> Mr. Zouhair Mbarek</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const OurValues = () => {
  const { t } = useTranslation('common');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const values = [
    {
      icon: 'mdi:heart',
      color: 'text-red-500',
      title: 'Passion pour le voyage',
      description:
        'Nous aimons ce que nous faisons ! Nos équipes à travers l’Asie visent à inspirer nos invités avec une véritable appréciation de ‘Notre Asie’.',
    },
    {
      icon: 'mdi:map',
      color: 'text-blue-500',
      title: 'Connaissance locale',
      description:
        'Nos bureaux en Asie offrent des connaissances approfondies et une expertise sur chaque destination.',
    },
    {
      icon: 'mdi:earth',
      color: 'text-green-500',
      title: 'Représentation mondiale',
      description:
        'Nous avons des représentants à travers le monde offrant des services multilingues dans tous les fuseaux horaires.',
    },
    {
      icon: 'mdi:account',
      color: 'text-yellow-500',
      title: 'Service client',
      description:
        'Nous voulons que nos invités touchent, goûtent et vivent le cœur battant de chaque destination qu’ils visitent.',
    },
    {
      icon: 'mdi:lightbulb',
      color: 'text-purple-500',
      title: 'Innovation',
      description:
        'Nous cherchons continuellement de nouvelles solutions et intégrons les dernières technologies dans notre large gamme de services.',
    },
    {
      icon: 'mdi:leaf',
      color: 'text-green-700',
      title: 'Responsabilité',
      description:
        'Nous mettons l’accent sur des circuits éthiques et durables, incluant des interactions authentiques avec les populations et lieux locaux.',
    },
  ];

  return (
    <section ref={ref} className="px-4 mb-5">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
        >
          {t('AboutUs.OurValues.title', 'Our Values')}
          <div className="w-48 m-4 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />

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
              <h3 className="text-xl font-semibold mb-2 text-gray-700">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
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
  };
}

export default function AboutUs() {
  return (
    <Layout className="bg-white">
      <div className="main-wrapper pt-18 relative z-10">
        <SEO
          title="About Batouta Voyages | Your Bridge Between Tunisia and Japan"
          description="Discover the story of Batouta Voyages, connecting Tunisia and Japan through extraordinary travel experiences since 1995. Learn about our values, journey, and commitment to cultural exchange."
        />
        <WhoWeAre />
        <OurValues />
        <History />
        <Contact />
      </div>
    </Layout>
  );
}