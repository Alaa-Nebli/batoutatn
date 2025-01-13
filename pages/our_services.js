import React, { useState, useEffect,useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from "components//Layout";
import SEO from "components//SEO/SEO";
import Image from 'next/image';
import { Icon } from "@iconify/react";
import { useTranslation } from 'next-i18next';
import Banner from 'components//Banner/Banner';
import Contact from 'components//Contact/ContactUs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

const ServiceCard = ({ service, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[660px] mx-auto cursor-pointer"
      onClick={() => onClick(service)}
      role="button"
      tabIndex={0}
    >
      <div className="relative min-h-[600px] rounded-3xl overflow-hidden shadow-xl group transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-2xl">
        {/* Image Section */}
        <div className="relative h-[230px] w-full rounded-t-3xl">
          <Image
            src={service.imageSrc}
            alt={service.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Card Content */}
        <div className="p-6 bg-white rounded-b-3xl">
          {/* Icon and Title */}
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 p-4 rounded-full shadow-xl">
              <Icon icon={service.icon} className="text-orange-500 text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 ml-3">{service.title}</h3>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-base line-clamp-3 mb-4">{service.description}</p>

          {/* Key Features */}
          <div className="mt-4">
            <h4 className="text-lg font-medium text-gray-800 mb-2">Key Features:</h4>
            <ul className="space-y-3">
              {service.features.map((feature, index) => (
                <li key={index} className="text-gray-600 text-sm flex items-center space-x-2">
                  <Icon icon="mdi:check-circle" className="text-green-500 text-lg" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};



// Update the TestimonialsSection component
const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = t('Services.Testimonials.items', { returnObjects: true });

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600 mb-4">
            {t('Services.Testimonials.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
        </motion.div>

        {/* Updated testimonials container with responsive classes */}
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="mb-6 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden relative">
                      <Image
                        src="/testimonials.webp"
                        alt={testimonial.name}
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <div className="flex gap-1 text-orange-500">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Icon key={i} icon="mdi:star" className="text-lg" />
                      ))}
                    </div>
                  </div>
                </div>
                <Icon icon="mdi:format-quote-open" className="text-4xl text-orange-500/20 mb-4" />
                <p className="text-gray-600 italic">{testimonial.quote}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

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
const PromiseSection = () => {
  const { t } = useTranslation('common');
  
  const promises = [
    {
      icon: "mdi:star-shooting",
      title: t('Services.PromiseSection.unique_experience.title'),
      description: t('Services.PromiseSection.unique_experience.description'),
      color: "from-purple-500 to-indigo-500",
      pattern: "radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 0%, rgb(252, 251, 121) 90%)"
    },
    {
      icon: "mdi:party-popper",
      title: t('Services.PromiseSection.fun.title'),
      description: t('Services.PromiseSection.fun.description'),
      color: "from-orange-500 to-red-500",
      pattern: "radial-gradient(circle at 10% 20%, rgb(255, 131, 98) 0%, rgb(255, 211, 165) 90%)"
    },
    {
      icon: "mdi:heart-multiple",
      title: t('Services.PromiseSection.satisfaction.title'),
      description: t('Services.PromiseSection.satisfaction.description'),
      color: "from-pink-500 to-rose-500",
      pattern: "radial-gradient(circle at 10% 20%, rgb(255, 162, 168) 0%, rgb(255, 193, 217) 90%)"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-50" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-30" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-lg font-semibold text-orange-500 mb-4 block">
            {  t('Services.PromiseSection.subTitle') }
          </span>
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600 mb-6">
          {  t('Services.PromiseSection.title') }
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {promises.map((promise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                {/* Decorative background pattern */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  style={{ background: promise.pattern }}
                />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${promise.color} flex items-center justify-center mb-6 mx-auto transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon icon={promise.icon} className="text-4xl text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 transition-all duration-300">
                    {promise.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center leading-relaxed">
                    {promise.description}
                  </p>
                  
                  <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-12 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
                  </div>
                </div>
                
                {/* Decorative corner accent */}
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
              </div>
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


const ServicesPage = () => {
  const { t } = useTranslation('common');
  const containerRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isClient, setIsClient] = useState(false);
  
  const services = [
    {
      id: 1,
      title: t('Services.ServiceCards.Group_Travel.Title'),
      description: t('Services.ServiceCards.Group_Travel.Description'),
      imageSrc: '/group_travel.jpg',
      icon: 'mdi:airplane',
      features: t('Services.ServiceCards.Group_Travel.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Group_Travel.highlights', { returnObjects: true }),
      gradient: 'from-blue-500 to-purple-500'
    },
    {
      id: 2,
      title: t('Services.ServiceCards.Transport.Title'),
      description: t('Services.ServiceCards.Transport.Description'),
      imageSrc: '/transport.png',
      icon: 'mdi:company',
      features: t('Services.ServiceCards.Transport.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Transport.highlights', { returnObjects: true }),
      gradient: 'from-orange-500 to-pink-500'
    },
    {
      id: 3,
      title: t('Services.ServiceCards.Events_Organization.Title'),
      description: t('Services.ServiceCards.Events_Organization.Description'),
      imageSrc: '/events.jpg',
      icon: 'mdi:ship-wheel',
      features: t('Services.ServiceCards.Events_Organization.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Events_Organization.highlights', { returnObjects: true }),
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 4,
      title: t('Services.ServiceCards.Billetterie.Title'),
      description: t('Services.ServiceCards.Billetterie.Description'),
      imageSrc: '/billeterie.webp',
      icon: 'mdi:human-male',
      features: t('Services.ServiceCards.Billetterie.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Billetterie.highlights', { returnObjects: true }),
      gradient: 'from-yellow-500 to-red-500'
    },
  ];
 
  useEffect(() => {
    setIsClient(true);
    if (!selectedService && services.length > 0) {
      setSelectedService(services[0]);
    }
  }, []);

  const handleServiceClick = (service) => {
    if (selectedService?.id !== service.id) {
      setSelectedService(service);
      if (window.innerWidth < 768) {
        const contentElement = document.getElementById('service-content');
        if (contentElement) {
          contentElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  };

  return (
    <Layout className="bg-gradient-to-b from-white to-orange-50">
      <div className="main-wrapper relative z-10">
        <Banner 
          Title={t("Services.Banner.Title")} 
          subtitle="Crafting Unforgettable Journey Experiences" 
          button_text="Start Your Adventure"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="md:-mx-4">
            {/* Update the grid to achieve the desired layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
              {services.map((service, index) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  onClick={handleServiceClick}
                />
              ))}
            </div>
          </div>
        </div>

        <PromiseSection />
        <TestimonialsSection />
        <WhyChooseUsSection />
        <Contact />
      </div>
    </Layout>
  );
};


export default ServicesPage;