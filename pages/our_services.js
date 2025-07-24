import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Layout } from 'components/Layout';
import Image from "next/legacy/image";
import { Icon } from "@iconify/react";
import { useTranslation } from 'next-i18next';
import Contact from 'components/Contact/ContactUs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SEO from 'components/SEO/SEO';
import { MotionDiv, MotionH3 } from '../utils/motion_framer';


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
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold ">
          <span className='color-black'>  {t('Services.WhyChooseUs.title')} </span> 
          <span className='bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-pink-600 mb-4'> {t('Services.WhyChooseUs.title2')} </span>

          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {reasonsToChoose.map((reason, index) => (
    <MotionDiv
      key={index}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative group h-full flex flex-col"
    >
      <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${reason.gradient} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
          <Icon icon={reason.icon} className="text-3xl text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
        <p className="text-gray-600 mb-6">{reason.description}</p>
        <ul className="space-y-3 mt-auto">
          {reason.features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-gray-700">
              <Icon icon="mdi:check-circle" className="text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </MotionDiv>
  ))}
</div>

      </div>
    </section>
  );
};

const EsteemSection = () => {
  const [hovered, setHovered] = useState(Array(5).fill(false));

  const principles = [
    { 
      title: "Hébergements Éco-Chic", 
      description: "Dormez dans des lieux uniques qui allient confort premium et pratiques écoresponsables. Chaque nuit chez nous soutient des initiatives locales.", 
      image: "/hebergements-eco-chic.avif",
      icon: "🏨",
      bgColor: "bg-gradient-to-br from-emerald-500 to-teal-600",
      overlayColor: "from-emerald-600/90 to-teal-700/90"
    },
    { 
      title: "Mobilité Douce", 
      description: "Nos transports hybrides et circuits optimisés réduisent votre empreinte carbone sans compromis sur le confort. Voyagez malin !", 
      image: "/transport-douce.jpg",
      icon: "🚙",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      overlayColor: "from-blue-600/90 to-indigo-700/90"
    },
    { 
      title: "Expériences Vibrantes", 
      description: "Rencontrez les artisans, goûtez aux saveurs locales et vivez des moments authentiques.", 
      image: "/artisan.jpg",
      icon: "🎭",
      bgColor: "bg-gradient-to-br from-purple-500 to-fuchsia-600",
      overlayColor: "from-purple-600/90 to-fuchsia-700/90"
    },
    { 
      title: "Impact Local", 
      description: "À travers vos voyages, vous contribuez au bien être d'autres peuples.", 
      image: "/impact-locale.jpg",
      icon: "🤝",
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
      overlayColor: "from-amber-600/90 to-orange-700/90"
    },
    { 
      title: "Nature & Impact Positif", 
      description: "Partez à la découverte de la nature : chaque voyage vous plonge au cœur de paysages préservés tout en soutenant des projets environnementaux.", 
      image: "/tourisme-regenerateur.avif",
      icon: "🌿",
      bgColor: "bg-gradient-to-br from-green-500 to-lime-600",
      overlayColor: "from-green-600/90 to-lime-700/90"
    }
  ];

  const handleHoverStart = (index) => {
    setHovered(prev => {
      const newHovered = [...prev];
      newHovered[index] = true;
      return newHovered;
    });
  };

  const handleHoverEnd = (index) => {
    setHovered(prev => {
      const newHovered = [...prev];
      newHovered[index] = false;
      return newHovered;
    });
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
              L&apos;Art du Voyage Responsable
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-bold">
            Découvrez comment nous réinventons le tourisme en Tunisie avec des expériences qui respectent les hommes et la nature
          </p>
          <MotionDiv 
            initial={{ width: 0 }}
            whileInView={{ width: "6rem" }}
            transition={{ duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mt-6"
          />
        </MotionDiv>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {principles.map((principle, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 40, rotateY: 15 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="perspective-1000"
            >
              <div
                className="relative w-full cursor-pointer h-full"
                onMouseEnter={() => handleHoverStart(index)}
                onMouseLeave={() => handleHoverEnd(index)}
              >
                {/* Title Overlay */}
                <div 
                  className={`absolute inset-0 z-10 rounded-2xl h-48 bg-gradient-to-b ${principle.overlayColor} 
                    flex items-center justify-center transition-all duration-300
                    ${hovered[index] ? 'opacity-0' : 'opacity-100'}`}
                >
                  <div className="text-center px-4">
                    <span className="text-4xl mb-3">{principle.icon}</span>
                    <h3 className="text-xl font-bold text-white">{principle.title}</h3>
                  </div>
                </div>

                <MotionDiv 
                  className="relative h-48 transition-transform duration-500 transform-gpu preserve-3d"
                  style={{
                    transform: `rotateY(${hovered[index] ? '180deg' : '0deg'})`,
                  }}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Front of card */}
                  <div className={`absolute w-full h-full rounded-2xl shadow-xl ${principle.bgColor} backface-hidden`}>
                    <div className="h-full flex flex-col items-center justify-center p-4">
                      <span className="text-4xl mb-3">{principle.icon}</span>
                      <h3 className="text-xl font-bold text-white text-center">{principle.title}</h3>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div 
                    className="absolute w-full h-full bg-white rounded-2xl shadow-xl backface-hidden p-6"
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <div className="h-full flex flex-col justify-center">
                      <p className="text-gray-700 font-medium text-center">
                        {principle.description}
                      </p>
                      <MotionDiv
                        initial={{ scale: 0.8 }}
                        whileInView={{ scale: 1 }}
                        className="mt-4 mx-auto w-8 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                </MotionDiv>

                {/* Image below card */}
                <MotionDiv 
                  className="mt-4 relative h-32 rounded-xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={principle.image}
                    alt={principle.title}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300"
                  />
                </MotionDiv>
              </div>
            </MotionDiv>
          ))}
        </div>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 text-center"
        >
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-bold">
            <span className="font-bold text-2xl text-emerald-600">Notre promesse :<br/> </span> Un voyage où chaque détail compte 
            pour vous, pour les locaux, et pour la planète.
          </p>
        </MotionDiv>
      </div>
    </section>
  );
};

const ServicesPage = () => {
  const { t } = useTranslation('common');
  const servicesSectionRef = useRef(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const services = [
    {
      title: t('Home.Our_Services_section.Group_Travel.Title'),
      description: t('Home.Our_Services_section.Group_Travel.Description'),
      image: '/outgoing_travel.jpg',
      imageAlt: 'outgoing travel',
    },
    {
      title: t('Home.Our_Services_section.Events_Organization.Title'),
      description: t('Home.Our_Services_section.Events_Organization.Description'),
      image: '/excursions.jpg',
      imageAlt: 'excursions',
    },
    {
      title: t('Home.Our_Services_section.Transport.Title'),
      description: t('Home.Our_Services_section.Transport.Description'),
      image: '/transport.png',
      imageAlt: 'transport',
    },
    {
      title: t('Home.Our_Services_section.Billetterie.Title'),
      description: t('Home.Our_Services_section.Billetterie.Description'),
      image: '/billeterie.webp',
      imageAlt: 'billeterie',
    },
  ];

  return (
    <Layout className="bg-gradient-to-b from-white to-orange-50">
      <SEO
        title="Nos Services | Batouta Voyages - Excursions, Billetterie, Transport"
        description="Découvrez tous les services proposés par Batouta Voyages : circuits, excursions, billetterie, organisation d'événements et transport en Tunisie."
        keywords="batouta voyages, services de voyage tunisie, excursions tunisie, billetterie tunisie, transport touristique tunisie, organisation événements tunisie, circuits tunisie, agence de voyage tunis, tourisme responsable tunisie, voyages groupe tunisie"
      />
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Nos Services",
                "item": (process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn") + "/our_services"
              },
            ]
          })
        }}
      />

      <div className="main-wrapper pt-20 relative z-10">
        <h1 className="sr-only">Services de voyage en Tunisie - Batouta Voyages</h1>
        <div id="our-services" className="mt-5" />
        <section ref={servicesSectionRef} className="py-20">
          <div className="max-w-7xl mx-auto px-4">
            <MotionDiv
              className="text-center mb-16"
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4">
                {t('Home.Our_Services_section.Our_Services_title')}
              </h2>
              <div className="w-48 m-4 h-1 bg-gradient-to-r from-orange-500 to-pink-500 mx-auto" />
              <p className="text-gray-600 max-w-4xl mx-auto font-bold">
                {t('Home.Our_Services_section.Our_Services_Description')}
              </p>
            </MotionDiv>

            {services.map((service, index) => {
              const isExpanded = expandedIndex === index;
              const shortDescription = service.description.slice(0, 150);

              return (
                <MotionDiv
                  key={index}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } items-center gap-8 mb-20`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <div className="w-full md:w-1/2 relative overflow-hidden rounded-2xl shadow-lg">
                    <MotionDiv
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
                    </MotionDiv>
                  </div>

                  <div className="w-full md:w-1/2">
                    <MotionH3
                      className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
                    >
                      {service.title}
                    </MotionH3>
                    <motion.p
                      className="text-gray-600 text-xl md:text-xl leading-relaxed"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false, amount: 0.1 }}
                      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    >
                      {isExpanded ? service.description : `${shortDescription}...`}
                    </motion.p>
                    <button
                      className="mt-2 text-orange-500 hover:underline font-semibold"
                      onClick={() =>
                        setExpandedIndex(isExpanded ? null : index)
                      }
                    >
                      {isExpanded ? 'Voir moins' : 'Voir plus'}
                    </button>
                  </div>
                </MotionDiv>
              );
            })}
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