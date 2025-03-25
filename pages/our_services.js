import React, { useState, useEffect,useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from 'components/Layout';
import Image from "next/legacy/image";
import { Icon } from "@iconify/react";
import { useTranslation } from 'next-i18next';
import Contact from 'components/Contact/ContactUs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'services'])),
    },
  };
}

const WhyChooseUsSection = () => {
  const { t } = useTranslation('common');

  const reasonsToChoose = [
    {
      title: t('Services.WhyChooseUs.reasons.Personalized_Experiences.title'),
      description: t('Services.WhyChooseUs.reasons.Personalized_Experiences.description'),
      features: t('Services.WhyChooseUs.reasons.Personalized_Experiences.features', {returnObjects: true}),
      icon: "mdi:account-heart",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: t('Services.WhyChooseUs.reasons.Expertise_and_Knowledge.title'),
      description: t('Services.WhyChooseUs.reasons.Expertise_and_Knowledge.description'),
      features: t('Services.WhyChooseUs.reasons.Expertise_and_Knowledge.features', {returnObjects: true}),
      icon: "mdi:lightbulb",
      gradient: "from-orange-500 to-pink-500"
    },
    {
      title: t('Services.WhyChooseUs.reasons.Convenience_and_Efficiency.title'),
      description: t('Services.WhyChooseUs.reasons.Convenience_and_Efficiency.description'),
      features: t('Services.WhyChooseUs.reasons.Convenience_and_Efficiency.features', {returnObjects: true}),
      icon: "mdi:headphones",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: t('Services.WhyChooseUs.reasons.Dedicated_Customer_Support.title'),
      description: t('Services.WhyChooseUs.reasons.Dedicated_Customer_Support.description'),
      features: t('Services.WhyChooseUs.reasons.Dedicated_Customer_Support.features', {returnObjects: true}),
      icon: "mdi:headphones",
      gradient: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600 mb-4">
            {t('Services.WhyChooseUs.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasonsToChoose.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${reason.gradient} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon icon={reason.icon} className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
                <p className="text-gray-600 mb-6">{reason.description}</p>
                <ul className="space-y-3">

                    {
                    reason.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700">
                        <Icon icon="mdi:check-circle" className="text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EsteemSection = ({ t }) => {
  const [hovered, setHovered] = useState(Array(6).fill(false));

  const principles = [
    
    { 
      title: t('Services.wcgi.sections.Stay.title'), 
      description: t('Services.wcgi.sections.Stay.description'), 
      image: "/tunisia/eco-friendly-stay.webp",
      icon: "🏡",
      bgColor: "bg-emerald-400",
      overlayColor: "from-emerald-400/90 to-emerald-500/90"
    },
    { 
      title: t('Services.wcgi.sections.Transport.title'), 
      description: t('Services.wcgi.sections.Transport.description'), 
      image: "/tunisia/transports.jpg",
      icon: "🚲",
      bgColor: "bg-blue-400",
      overlayColor: "from-blue-400/90 to-blue-500/90"
    },
    { 
      title: t('Services.wcgi.sections.Experience.title'), 
      description: t('Services.wcgi.sections.Experience.description'), 
      image: "/tunisia/experience.jpg",
      icon: "✨",
      bgColor: "bg-purple-400",
      overlayColor: "from-purple-400/90 to-purple-500/90"
    },
    { 
      title: t('Services.wcgi.sections.Empower.title'), 
      description: t('Services.wcgi.sections.Empower.description'),
      image: "/tunisia/communities.jpg",
      icon: "💪",
      bgColor: "bg-red-400",
      overlayColor: "from-red-400/90 to-red-500/90"
    },
    { 
      title: t('Services.wcgi.sections.Make.title'), 
      description: t('Services.wcgi.sections.Make.description'),
      image: "/tunisia/Difference.jpg",
      icon: "🌟",
      bgColor: "bg-yellow-400",
      overlayColor: "from-yellow-400/90 to-yellow-500/90"
    }
  ];

  
  
  const handleHoverStart = (index) => {
    const newHovered = [...hovered];
    newHovered[index] = true;
    setHovered(newHovered);
  };

  const handleHoverEnd = (index) => {
    const newHovered = [...hovered];
    newHovered[index] = false;
    setHovered(newHovered);
  };

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-black">
          { t('Services.wcgi.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto mt-4" />
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="perspective-1000"
            >
              <div
                className="relative w-full cursor-pointer"
                onMouseEnter={() => handleHoverStart(index)}
                onMouseLeave={() => handleHoverEnd(index)}
              >
                {/* Title Overlay */}
                <div 
                  className={`absolute inset-0 z-10 rounded-2xl h-48 bg-gradient-to-b  ${principle.overlayColor} 
                    flex items-center justify-center transition-opacity duration-300
                    ${hovered[index] ? 'opacity-0' : 'opacity-100'}`}
                >
                  <h3 className="text-xl font-bold text-white text-center px-4">
                    {principle.title}
                  </h3>
                </div>

                <div 
                  className="relative h-48 transition-transform duration-500 transform-gpu preserve-3d"
                  style={{
                    transform: `rotateY(${hovered[index] ? '180deg' : '0deg'})`,
                  }}
                >
                  {/* Front of card */}
                  <div className={`absolute w-full h-full ${principle.bgColor} rounded-2xl shadow-lg backface-hidden`}>
                    <div className="h-full flex flex-col items-center justify-center p-4">
                      <span className="text-4xl mb-3">{principle.icon}</span>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div 
                    className="absolute w-full h-full bg-white rounded-2xl shadow-lg backface-hidden"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div className="h-full flex items-center justify-center p-6 text-center">
                      <p className="text-gray-700 font-medium">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Image below card */}
                <div className="mt-4 relative h-32 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={principle.image}
                    alt={principle.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-110"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesPage = () => {
  const { t } = useTranslation('common');
  const servicesSectionRef = useRef(null);

  const services = [
    {
      title: t('Home.Our_Services_section.Group_Travel.Title'),
      description: t('Home.Our_Services_section.Group_Travel.Description'),
      image: '/outgoing_travel.jpg',
      imageAlt: 'Group Leisure Travel',
    },
    {
      title: t('Home.Our_Services_section.Events_Organization.Title'),
      description: t('Home.Our_Services_section.Events_Organization.Description'),
      image: '/excursions.jpg',
      imageAlt: 'FIT Travel',
    },
    {
      title: t('Home.Our_Services_section.Transport.Title'),
      description: t('Home.Our_Services_section.Transport.Description'),
      image: '/transport.png',
      imageAlt: 'Shore Excursions',
    },
    {
      title: t('Home.Our_Services_section.Billetterie.Title'),
      description: t('Home.Our_Services_section.Billetterie.Description'),
      image: '/billeterie.webp',
      imageAlt: 'MICE',
    },
  ];

  return (
    <Layout className="bg-gradient-to-b from-white to-orange-50">
      <div className="main-wrapper pt-20 relative z-10">
        <div id="our-services" className="mt-5" />
        {/* Services Section */}
        <section ref={servicesSectionRef} className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4">
                {t('Home.Our_Services_section.Our_Services_title')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('Home.Our_Services_section.Our_Services_Description')}
              </p>
            </motion.div>

            {services.map((service, index) => (
              <motion.div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8 mb-20`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Image Container */}
                <div className="w-full md:w-1/2 relative overflow-hidden rounded-2xl shadow-lg">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={service.image}
                      alt={service.imageAlt}
                      layout="responsive"
                      width={600}
                      height={400}
                      objectFit="cover"
                      className="rounded-2xl"
                    />
                  </motion.div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-1/2">
                  <motion.h3
                    className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                  >
                    {service.title}
                  </motion.h3>
                  <motion.p
                    className="text-gray-600 text-lg"
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  >
                    {service.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <EsteemSection t={t} />
        <WhyChooseUsSection />
        <Contact />
      </div>
    </Layout>
  );
};

export default ServicesPage;