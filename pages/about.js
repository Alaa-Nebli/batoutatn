/* eslint-disable react/jsx-no-undef */
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Layout } from 'components/Layout';
import SEO from 'components/SEO/SEO';
import { ContactUs } from 'components/Contact';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

/* ─────────────────────────────────────────────
   COMPOSANT : QUI SOMMES-NOUS (Hero)
───────────────────────────────────────────── */
const WhoWeAre = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const { t } = useTranslation('common');

  return (
    <section ref={ref} className="pt-32 pb-20 md:pt-40 md:pb-24 px-4 md:px-6 bg-[#fcfaf8] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[50%] rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute bottom-[10%] -left-[10%] w-[40%] h-[50%] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 order-2 lg:order-1"
          >
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 font-extrabold text-xs tracking-widest uppercase mb-4">
                Notre Identité
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                {t('AboutUs.WhoWeAre.title_1')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  {t('AboutUs.WhoWeAre.title_2')}
                </span>
              </h1>
            </div>

            <p className="text-lg text-gray-600 font-medium leading-relaxed max-w-xl">
              {t('AboutUs.WhoWeAre.description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
              <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                  <Icon icon="noto:shinto-shrine" className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">
                  {t('AboutUs.WhoWeAre.features.feature1.title')}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {t('AboutUs.WhoWeAre.features.feature1.description')}
                </p>
              </div>

              <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                  <Icon icon="noto:palm-tree" className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg mb-2">
                  {t('AboutUs.WhoWeAre.features.feature2.title')}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {t('AboutUs.WhoWeAre.features.feature2.description')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <Link href="/our_services" className="px-8 py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-orange-600 transition-colors duration-300 shadow-lg flex items-center gap-2">
                {t('AboutUs.WhoWeAre.buttons.services')} <Icon icon="mdi:arrow-right" className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative order-1 lg:order-2"
          >
            <div className="relative rounded-[3rem] overflow-hidden aspect-[4/5] md:aspect-square w-full max-w-lg mx-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white">
              <video autoPlay loop muted playsInline className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-1000">
                <source src="https://bnlpzibmwmoragheykpt.supabase.co/storage/v1/object/public/programs//cdfa0de5-b243-4103-a163-9a0943873794.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none" />
            </div>

            <motion.div
              className="absolute bottom-10 -left-6 md:-left-12 bg-white/95 backdrop-blur-md px-8 py-6 rounded-[2rem] shadow-xl border border-gray-100 hidden sm:block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:medal-outline" className="w-8 h-8 text-orange-500" />
                </div>
                <div>
                  <p className="text-3xl font-black text-gray-900 leading-none">
                    {t('AboutUs.WhoWeAre.stats.years_of_excellence')}
                  </p>
                  <p className="text-sm font-bold text-gray-500 mt-1 uppercase tracking-wider">
                    {t('AboutUs.WhoWeAre.stats.years_label')}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   COMPOSANT : NOTRE HISTOIRE
───────────────────────────────────────────── */
const History = () => {
  const { t } = useTranslation('common');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} id="history" className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto relative">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Texte de l'histoire (À gauche, 60%) */}
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {t('AboutUs.our_History.title', 'Notre Histoire')}
              </h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
            </div>

            <div className="prose prose-lg text-gray-600 font-medium leading-relaxed">
              <p>
                <strong className="text-gray-900 font-extrabold">{t('AboutUs.our_History.paragraph_1_strong')} </strong>
                {t('AboutUs.our_History.paragraph_1')}{' '}
                <strong className="text-gray-900 font-extrabold"> {t('AboutUs.our_History.paragraph_1_strong_2')} </strong>.
              </p>
              <p>{t('AboutUs.our_History.paragraph_2')}</p>
              <p>{t('AboutUs.our_History.paragraph_3')}</p>
              <p>{t('AboutUs.our_History.paragraph_4')}</p>
            </div>
          </motion.div>

          {/* Image du Fondateur (À droite, 40%) */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-gray-50 group">
              <Image
                src="/mr_zouhair_mbarek.jpeg"
                alt="Mr. Zouhair Mbarek, Fondateur de Batouta Voyages"
                fill
                className="object-cover object-top transform group-hover:scale-105 transition-transform duration-1000"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Dégradé bas pour lisibilité du texte si besoin */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            
            {/* Légende élégante */}
            <div className="absolute -bottom-6 right-6 lg:-right-6 bg-white px-8 py-4 rounded-2xl shadow-xl border border-gray-100">
              <p className="text-gray-900 font-extrabold text-lg">Mr. Zouhair Mbarek</p>
              <p className="text-orange-600 font-bold text-xs uppercase tracking-widest mt-1">Fondateur</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};


/* ─────────────────────────────────────────────
   COMPOSANT : NOTRE EXPERTISE
───────────────────────────────────────────── */
const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const stats =[
    { year: "1995", title: "Année de Création", desc: "Plus de 25 ans d'excellence et d'innovation dans la conception de voyages." },
    { icon: "noto:tokyo-tower", title: "Le Standard Japonais", desc: "Une rigueur et un souci du détail hérités de nos partenaires asiatiques historiques." },
    { icon: "mdi:earth", title: "Rayonnement Global", desc: "Un réseau mondial de partenaires pour vous emmener au bout du monde, en toute sécurité." },
    { icon: "mdi:briefcase-check", title: "Expertise Complète", desc: "Du MICE à la billetterie, en passant par le voyage organisé et le sur-mesure." }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-gray-900 text-white rounded-[3rem] mx-4 sm:mx-6 lg:mx-8 mb-24 overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('/pattern-dark.svg')] opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            Notre Expertise
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-400 font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Une maîtrise parfaite de la chaîne du voyage, bâtie sur l'expérience et la satisfaction de milliers de voyageurs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2rem] hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {stat.year ? (
                <div className="text-5xl font-black text-orange-500 mb-6">{stat.year}</div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6">
                  <Icon icon={stat.icon} className="w-8 h-8 text-orange-400" />
                </div>
              )}
              <h3 className="text-xl font-extrabold text-white mb-3">{stat.title}</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   COMPOSANT : NOS ENGAGEMENTS
───────────────────────────────────────────── */
const Engagements = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const commitments =[
    { id: "01", title: "Exigence & Qualité", desc: "Des hébergements, des guides et des itinéraires rigoureusement sélectionnés et testés par nos équipes pour garantir votre confort absolu." },
    { id: "02", title: "Tourisme Durable", desc: "Nous privilégions les rencontres authentiques et les pratiques respectueuses de l'environnement et des communautés locales." },
    { id: "03", title: "Assistance 24/7", desc: "Votre tranquillité d'esprit est primordiale. Notre équipe dédiée reste joignable à tout moment avant, pendant et après votre voyage." },
    { id: "04", title: "Transparence Totale", desc: "Des prix clairs, aucun frais caché, et un conseil toujours honnête et objectif pour concevoir le voyage qui vous ressemble." }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                Nos <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Engagements</span>
              </h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed">
                Le voyage est une promesse. Voici les piliers sur lesquels nous nous engageons pour honorer votre confiance.
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-6">
            {commitments.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:bg-white transition-all duration-500 group"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-4xl font-black text-gray-200 group-hover:text-orange-200 transition-colors mb-4">
                  {item.id}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   COMPOSANT : NOS VALEURS
───────────────────────────────────────────── */
const OurValues = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const values =[
    { icon: 'mdi:heart-pulse', colorClass: 'text-red-500', bgClass: 'bg-red-50', title: 'Passion', description: 'Nous aimons profondément ce que nous faisons. Inspirer nos voyageurs est notre plus grande récompense.' },
    { icon: 'mdi:map-search', colorClass: 'text-blue-500', bgClass: 'bg-blue-50', title: 'Expertise Locale', description: 'Nos bureaux et partenaires offrent des connaissances approfondies et une expertise millimétrée sur chaque destination.' },
    { icon: 'mdi:account-star', colorClass: 'text-amber-500', bgClass: 'bg-amber-50', title: 'Excellence Client', description: 'Le seul mot d\'ordre chez Batouta : votre satisfaction absolue, du premier contact au retour chez vous.' },
    { icon: 'mdi:lightbulb-on', colorClass: 'text-purple-500', bgClass: 'bg-purple-50', title: 'Innovation', description: 'Nous intégrons les dernières technologies et tendances pour faciliter et sublimer votre expérience de voyage.' }
  ];

  return (
    <section ref={ref} className="py-24 px-4 bg-[#fcfaf8]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            Nos Valeurs
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-lg transition-all duration-500"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${value.bgClass} ${value.colorClass}`}>
                <Icon icon={value.icon} className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PAGE PRINCIPALE
───────────────────────────────────────────── */
export default function AboutUs() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement":[
      { "@type": "ListItem", "position": 1, "name": "Accueil", "item": process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn" },
      { "@type": "ListItem", "position": 2, "name": "À propos", "item": (process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn") + "/about" }
    ]
  };

  return (
    <Layout className="bg-white font-sans">
      <SEO
        title="Notre Histoire & Engagements | Batouta Voyages"
        description="Découvrez l'histoire de Batouta Voyages, agence tunisienne d'excellence depuis 1995. Nos engagements, notre expertise DMC et notre rigueur japonaise."
        keywords="batouta voyages, agence de voyage tunisie, histoire batouta, engagements agence voyage, dmc tunisie, tourisme durable tunisie"
      />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="main-wrapper relative z-10">
        <h1 className="sr-only">À propos de Batouta Voyages</h1>

        <WhoWeAre />
        <History />
        <Experience />
        <Engagements />
        <OurValues />
        <ContactUs />
        
      </div>
    </Layout>
  );
}