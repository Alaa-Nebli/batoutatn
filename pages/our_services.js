import React, { useState, useEffect,useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from "@components/Layout";
import SEO from "@components/SEO/SEO";
import Image from 'next/image';
import { Icon } from "@iconify/react";
import { useTranslation } from 'next-i18next';
import Banner from '@components/Banner/Banner';
import Contact from '@components/Contact/ContactUs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}

// ServiceCard Component with horizontal scroll on mobile
const ServiceCard = ({ service, index, isSelected, onClick }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(service);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="relative group min-w-[280px] w-full"
      onClick={() => onClick(service)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyPress}
    >
      <div 
        className={`relative h-[220px] rounded-3xl overflow-hidden transform transition-all duration-500 ${
          isSelected ? 'ring-4 ring-orange-500 scale-105 shadow-2xl' : 'hover:scale-102 hover:shadow-xl'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
        <Image
          src={service.imageSrc}
          alt={service.title}
          layout="fill"
          objectFit="cover"
          priority={index < 2}
          className="transition-transform duration-700 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between">
          <div className={`bg-white/90 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center transform transition-transform duration-300 ${
            isSelected ? 'scale-110' : 'group-hover:scale-110'
          }`}>
            <Icon icon={service.icon} className="text-2xl text-orange-500" />
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-white/90 text-sm line-clamp-2">{service.description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced ServiceContent Component
const ServiceContent = ({ service }) => {
  if (!service) return null;

  return (
    <motion.div
      key={service.id}
      className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden mt-8 shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="relative h-[400px] lg:h-full">
          <Image
            src={service.imageSrc}
            alt={service.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-12">
            <div className="text-white max-w-md">
              <div className="bg-orange-500/90 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Icon icon={service.icon} className="text-3xl" />
              </div>
              <h3 className="text-4xl font-bold mb-4">{service.title}</h3>
              <p className="text-lg text-white/90">{service.description}</p>
            </div>
          </div>
        </div>

        <div className="p-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="space-y-8">
            <div>
              <h4 className="text-2xl font-bold mb-6">Key Features</h4>
              <div className="grid grid-cols-2 gap-4">
                {service.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="bg-orange-100 p-2 rounded-full">
                      <Icon icon="mdi:check" className="text-orange-500 text-xl" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-2xl font-bold mb-6">Experience Highlights</h4>
              <div className="space-y-4">
                {service.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <h5 className="font-bold text-lg mb-2 text-gray-800">{highlight.title}</h5>
                    <p className="text-gray-600">{highlight.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <Link href={"#contact"}   >
            <button className="w-full py-4 px-8 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-102 transition-all duration-300">
              <span className="flex items-center justify-center space-x-2">
                <span>Learn More</span>
                <Icon icon="mdi:arrow-right" className="text-xl" />
              </span>
            </button>
            </Link>  
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

// Enhanced WhyChooseUsSection
const WhyChooseUsSection = () => {
  const { t } = useTranslation('common');

  const reasonsToChoose = [
    {
      title: "Personalized Experiences",
      description: "Tailored travel plans that match your unique preferences and dreams",
      features: ["Custom Itineraries", "Personal Guide", "Flexible Planning"],
      icon: "mdi:account-heart",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Expert Knowledge",
      description: "Years of experience and deep local insights at your service",
      features: ["Local Expertise", "Hidden Gems", "Cultural Insights"],
      icon: "mdi:lightbulb",
      gradient: "from-orange-500 to-pink-500"
    },
    {
      title: "Premium Support",
      description: "24/7 dedicated assistance throughout your journey",
      features: ["Always Available", "Quick Response", "Emergency Help"],
      icon: "mdi:headphones",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Best Value",
      description: "Competitive prices without compromising on quality",
      features: ["Price Match", "Special Deals", "Group Discounts"],
      icon: "mdi:currency-usd",
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
                  {reason.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <Icon icon="mdi:check-circle" className="text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
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
      title: "Unique Experience",
      description: "An adventure that you've never experienced before, creating moments that will last a lifetime",
      color: "from-purple-500 to-indigo-500",
      pattern: "radial-gradient(circle at 10% 20%, rgb(255, 200, 124) 0%, rgb(252, 251, 121) 90%)"
    },
    {
      icon: "mdi:party-popper",
      title: "Fun and Joy",
      description: "Unforgettable moments filled with laughter and excitement alongside our passionate team and expert guides",
      color: "from-orange-500 to-red-500",
      pattern: "radial-gradient(circle at 10% 20%, rgb(255, 131, 98) 0%, rgb(255, 211, 165) 90%)"
    },
    {
      icon: "mdi:heart-multiple",
      title: "Complete Satisfaction",
      description: "We go above and beyond to ensure every aspect of your journey exceeds your expectations",
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
            What Sets Us Apart
          </span>
          <h2 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600 mb-6">
            Our Promise To You
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
      title: t('Services.ServiceCards.MICE.Title'),
      description: t('Services.ServiceCards.MICE.Description'),
      imageSrc: '/fit.jpg',
      icon: 'mdi:company',
      features: t('Services.ServiceCards.MICE.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.MICE.highlights', { returnObjects: true }),
      gradient: 'from-orange-500 to-pink-500'
    },
    {
      id: 3,
      title: t('Services.ServiceCards.Shore_Excursions.Title'),
      description: t('Services.ServiceCards.Shore_Excursions.Description'),
      imageSrc: '/group_leisure_travel.webp',
      icon: 'mdi:ship-wheel',
      features: t('Services.ServiceCards.Shore_Excursions.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.Shore_Excursions.highlights', { returnObjects: true }),
      gradient: 'from-green-500 to-teal-500'
    },
    {
      id: 4,
      title: t('Services.ServiceCards.FIT.Title'),
      description: t('Services.ServiceCards.FIT.Description'),
      imageSrc: '/fit.jpg',
      icon: 'mdi:human-male',
      features: t('Services.ServiceCards.FIT.features', { returnObjects: true }),
      highlights: t('Services.ServiceCards.FIT.highlights', { returnObjects: true }),
      gradient: 'from-yellow-500 to-red-500'
    }
  ];
 
  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
    if (!selectedService && services.length > 0) {
      setSelectedService(services[0]);
    }
  }, []);

  const handleServiceClick = (service) => {
    console.log(service)
    if (selectedService?.id !== service.id) {
      setSelectedService(service);
      // Scroll to content if on mobile
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
          Title={[
            'Experience <span class="text-orange-500">Adventure</span>',
            'Create <span class="text-orange-500">Memories</span>',
            'Explore <span class="text-orange-500">Dreams</span>'
          ]} 
          subtitle="Crafting Unforgettable Journey Experiences" 
          button_text="Start Your Adventure"
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Updated carousel container */}
          <div className="md:-mx-4">
            <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none pb-6 md:pb-0">
              {services.map((service, index) => (
                <ServiceCard 
                  key={service.id} 
                  service={service} 
                  index={index}
                  isSelected={selectedService?.id === service.id}
                  onClick={handleServiceClick}
                />
              ))}
            </div>
          </div>

          <div id="service-content" className="mt-12">
            <AnimatePresence mode="wait">
              {selectedService && (
                <ServiceContent 
                  key={selectedService.id} 
                  service={selectedService} 
                />
              )}
            </AnimatePresence>
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