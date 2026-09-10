import React, { useEffect, useRef, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

import { Layout } from 'components/Layout';
import SEO from 'components/SEO/SEO';
import ContactSection from 'components/Contact/ContactUs';
import { SkeletonCard, StickyMobileCTA } from 'components/ui';
import HeroWithSearch from '../components/heroWithSearch';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

/* ─── Utility ─── */
const formatPrice = (value) => {
  const amount = Number(value || 0);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return amount.toLocaleString('fr-FR');
};

// const HeroWithSearch = () => {
//   const [activeTab, setActiveTab] = useState('organized');

//   const tabs = [
//     { id: 'organized', label: 'Voyages Organisés',     icon: 'mdi:map-check-outline',  href: '/programs'              },
//     { id: 'local',     label: 'Programmes en Tunisie', icon: 'mdi:home-city-outline',  href: '/programmes-en-tunisie' },
//     { id: 'flights',   label: 'Vols',                  icon: 'mdi:airplane',           href: '/reservation-vols'      },
//     { id: 'custom',    label: 'Sur-mesure',            icon: 'mdi:map-edit-outline',   href: '/#contact'              },
//   ];

//   const activeTabData = tabs.find((t) => t.id === activeTab);
//   const isCustom = activeTab === 'custom';

//   return (
//     <section className="relative w-full">
//       {/* ── Hero banner ── */}
//       <div className="relative min-h-[540px] md:min-h-[620px] flex flex-col justify-center overflow-hidden pb-24">
//         <div className="absolute inset-0 z-0">
//           <Image
//             src="/home_banner.png"
//             fill
//             alt="Découvrez la Tunisie"
//             className="object-cover object-center"
//             priority
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
//           <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/20" />
//         </div>

//         <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
//           <motion.div
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, ease: 'easeOut' }}
//             className="max-w-xl text-left"
//           >
//             <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FF5E14]/10 text-[#FF5E14] text-[11px] font-black tracking-[0.12em] uppercase mb-5">
//               <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E14]" />
//               Agence de voyage en Tunisie
//             </div>

//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0B2D4D] leading-[1.1] mb-5">
//               Voyagez mieux,
//               <br />
//               <span className="text-[#FF5E14]">vivez plus.</span>
//             </h1>

//             <p className="text-sm md:text-base text-slate-600 font-semibold leading-relaxed mb-8 max-w-md">
//               Des expériences uniques, des destinations inoubliables et un accompagnement sur mesure. En Tunisie et partout dans le monde.
//             </p>

//             <div className="flex flex-wrap items-center gap-4">
//               <Link
//                 href="/programs"
//                 className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#FF5E14] hover:bg-[#e04f0f] text-white rounded-xl font-extrabold text-sm transition-all shadow-md shadow-[#FF5E14]/20 group"
//               >
//                 Découvrir nos voyages
//                 <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
//                   <Icon icon="mdi:arrow-right" className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5" />
//                 </div>
//               </Link>
//               <a
//                 href="#contact"
//                 className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-800 rounded-xl font-extrabold text-sm border border-slate-200 hover:border-[#FF5E14] hover:text-[#FF5E14] transition-colors shadow-sm"
//               >
//                 Demander un devis
//                 <Icon icon="mdi:file-document-outline" className="w-4 h-4 text-slate-500" />
//               </a>
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* ── Floating Search Widget ── */}
//       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-5xl px-4">
//         <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden">
//           {/* Tabs */}
//           <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center gap-2 px-6 py-4.5 text-xs font-black whitespace-nowrap transition-colors border-b-2 ${
//                   activeTab === tab.id
//                     ? 'text-[#FF5E14] border-[#FF5E14] bg-white'
//                     : 'text-slate-500 border-transparent hover:text-slate-800'
//                 }`}
//               >
//                 <Icon icon={tab.icon} className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#FF5E14]' : 'text-slate-400'}`} />
//                 {tab.label}
//               </button>
//             ))}
//           </div>

//           {/* Fields */}
//           <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-white rounded-b-2xl">
//             {!isCustom ? (
//               <>
//                 <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:border-slate-200 transition-colors h-16 cursor-pointer">
//                   <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
//                   <div className="min-w-0 flex flex-col justify-center">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Destination</p>
//                     <p className="text-xs md:text-[13px] font-black text-[#0B2D4D] leading-tight truncate">Où voulez-vous aller ?</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:border-slate-200 transition-colors h-16 cursor-pointer">
//                   <Icon icon="mdi:calendar-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
//                   <div className="min-w-0 flex flex-col justify-center">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Date</p>
//                     <p className="text-xs md:text-[13px] font-black text-[#0B2D4D] leading-tight truncate">Choisissez vos dates</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:border-slate-200 transition-colors h-16 cursor-pointer">
//                   <Icon icon="mdi:account-group-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
//                   <div className="min-w-0 flex flex-col justify-center">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Voyageurs</p>
//                     <p className="text-xs md:text-[13px] font-black text-[#0B2D4D] leading-tight truncate">2 voyageurs</p>
//                   </div>
//                 </div>
//                 <Link
//                   href={activeTabData?.href || '/programs'}
//                   className="flex items-center justify-center gap-2 bg-[#FF5E14] hover:bg-[#e04f0f] text-white rounded-xl px-5 h-16 font-extrabold text-sm transition-all shadow-sm"
//                 >
//                   <Icon icon="mdi:magnify" className="w-5 h-5" />
//                   Rechercher
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <div className="md:col-span-3 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 h-16">
//                   <Icon icon="mdi:map-edit-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
//                   <div className="min-w-0 flex flex-col justify-center">
//                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Sur-mesure</p>
//                     <p className="text-xs md:text-[13px] font-black text-[#0B2D4D] leading-tight truncate">Décrivez votre voyage de rêve...</p>
//                   </div>
//                 </div>
//                 <Link
//                   href="/#contact"
//                   className="flex items-center justify-center gap-2 bg-[#0B2D4D] hover:bg-[#071e33] text-white rounded-xl px-5 h-16 font-extrabold text-sm transition-all shadow-sm"
//                 >
//                   <Icon icon="mdi:send" className="w-5 h-5" />
//                   Nous contacter
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

/* ═══════════════════════════════════════════════════════════════
   TRUST BAR
   4 items: small orange rounded icon bg, navy title, slate desc.
   White bg, compact py, border-bottom separator.
═══════════════════════════════════════════════════════════════ */
const TrustBar = () => {
  const items = [
    { icon: 'mdi:shield-check-outline', title: 'Voyages garantis', desc: 'Départs assurés'      },
    { icon: 'mdi:tag-outline',           title: 'Meilleur prix',    desc: 'Sans intermédiaire'   },
    { icon: 'mdi:headset',               title: 'Support 24/7',     desc: 'Assistance complète'  },
    { icon: 'mdi:star-outline',          title: '25+ ans',          desc: "D'expérience"         },
  ];

  return (
    <section className="bg-white mt-24 py-5 border-b border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 justify-items-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FF5E14]/10 flex items-center justify-center shrink-0">
                <Icon icon={item.icon} className="h-5 w-5 text-[#FF5E14]" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#0B2D4D] leading-tight">{item.title}</p>
                <p className="text-[11px] font-semibold text-slate-400 leading-tight mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TRIP CARD
   White card, 4:3 image top, badge top-left (orange/green),
   title navy (hover orange), location pin, duration/transport row,
   separator, rating left + "À partir de" + price right (orange).
═══════════════════════════════════════════════════════════════ */
const CompactTripCard = ({ badge, title, country, duration, transport, rating, reviewCount, price, image, href }) => {
  const inner = (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${
            badge === 'Nouveau' ? 'bg-emerald-500' : 'bg-[#FF5E14]'
          }`}>
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-[15px] font-extrabold text-[#0B2D4D] leading-snug group-hover:text-[#FF5E14] transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
          <Icon icon="mdi:map-marker" className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          {country}
        </p>

        {/* Duration + transport */}
        <div className="flex items-center gap-4 mt-4 pt-3.5 border-t border-slate-100 text-[11px] font-extrabold text-slate-500">
          <span className="flex items-center gap-1.5">
            <Icon icon="mdi:calendar-blank-outline" className="w-4 h-4 text-slate-400" />
            {duration}
          </span>
          {transport && (
            <span className="flex items-center gap-1.5">
              <Icon icon="mdi:airplane" className="w-4 h-4 text-slate-400" />
              {transport}
            </span>
          )}
        </div>

        {/* Rating + Price */}
        <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100">
          {rating ? (
            <div className="flex items-center gap-1 text-[11px] font-black text-[#0B2D4D]">
              <Icon icon="mdi:star" className="w-3.5 h-3.5 text-amber-400" />
              <span>{rating}/5</span>
              <span className="text-slate-400 font-medium ml-0.5">({reviewCount} avis)</span>
            </div>
          ) : <div />}
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 leading-none">À partir de</p>
            <p className="text-base font-black text-[#FF5E14] mt-0.5 leading-none">
              {price} <span className="text-[11px] font-extrabold">TND</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href} className="block h-full">{inner}</Link> : inner;
};

/* ═══════════════════════════════════════════════════════════════
   TRIP CAROUSEL
   White bg section. Eyebrow (orange small caps) + large bold title
   + 3px orange underline bar. "Voir tous…" border-button top-right.
   Horizontal scroll with hidden prev/next arrow buttons.
   Dot pagination: active = orange pill, inactive = grey circle.
═══════════════════════════════════════════════════════════════ */
const TripCarousel = ({ eyebrow, title, actionHref, actionText, items, loading }) => {
  const scrollerRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  const dotCount = useMemo(() => Math.max(1, Math.ceil(items.length / 3)), [items.length]);

  const scroll = (dir) => scrollerRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });

  const handleScroll = () => {
    const node = scrollerRef.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    if (max <= 0) return;
    setActiveDot(Math.max(0, Math.min(Math.round((node.scrollLeft / max) * (dotCount - 1)), dotCount - 1)));
  };

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8 lg:py-16 border-b border-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5E14] mb-2">{eyebrow}</p>
            <h2 className="text-3xl font-black text-[#0B2D4D] leading-tight">{title}</h2>
            <div className="mt-3 w-12 h-[3px] bg-[#FF5E14] rounded-full" />
          </div>
          {actionHref && (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700 hover:border-[#FF5E14] hover:text-[#FF5E14] transition-all shadow-sm whitespace-nowrap"
            >
              {actionText}
              <Icon icon="mdi:arrow-right" className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Carousel */}
        <div className="relative group/carousel">
          {/* Arrow buttons */}
          {items.length > 0 && (
            <>
              <button
                onClick={() => scroll(-1)}
                className="absolute -left-4 top-[42%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0B2D4D] opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
                aria-label="Précédent"
              >
                <Icon icon="mdi:chevron-left" className="w-6 h-6" />
              </button>
              <button
                onClick={() => scroll(1)}
                className="absolute -right-4 top-[42%] -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 hover:text-[#0B2D4D] opacity-0 group-hover/carousel:opacity-100 transition-all duration-200"
                aria-label="Suivant"
              >
                <Icon icon="mdi:chevron-right" className="w-6 h-6" />
              </button>
            </>
          )}

          {loading ? (
            <div className="grid gap-5 md:grid-cols-3">
              <SkeletonCard variant="vertical" count={3} />
            </div>
          ) : items.length > 0 ? (
            <>
              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                className="flex gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mx-4 px-4"
              >
                {items.map((item) => (
                  <div key={item.id} className="min-w-[280px] md:min-w-[320px] max-w-[340px] snap-start flex-shrink-0">
                    <CompactTripCard {...item} />
                  </div>
                ))}
              </div>
              {dotCount > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                  {Array.from({ length: dotCount }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        const node = scrollerRef.current;
                        if (!node) return;
                        const max = node.scrollWidth - node.clientWidth;
                        node.scrollTo({ left: (max / (dotCount - 1)) * i, behavior: 'smooth' });
                      }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeDot ? 'w-6 bg-[#FF5E14]' : 'w-2 bg-slate-200 hover:bg-slate-300'
                      }`}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-10 text-center max-w-md mx-auto">
              <p className="text-xs font-bold uppercase tracking-wider text-[#FF5E14] mb-2">Bientôt disponible</p>
              <h3 className="text-lg font-extrabold text-[#0B2D4D]">La sélection sera affichée ici.</h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   TUNISIA CATEGORIES
   White bg. Left col: orange eyebrow, black title, grey body,
   navy CTA button with orange arrow icon.
   Right: 4 portrait (3:4) image cards. Each has full-bleed image,
   dark-to-transparent gradient from bottom, a solid COLORED CIRCLE
   icon badge at bottom-left (NOT backdrop-blur square), title +
   subtitle text overlaid.
═══════════════════════════════════════════════════════════════ */
const TunisiaCategories = () => {
  const categories = [
    { title: 'Sahara & Sud',      subtitle: 'Aventure & désert',     image: '/desert.jpg',          icon: 'mdi:weather-sunny', iconBg: 'bg-[#FF5E14]',  href: '/programmes-en-tunisie' },
    { title: 'Culture & Histoire', subtitle: 'Patrimoine millénaire', image: '/tunisie-culture.jpg',    icon: 'mdi:bank-outline',  iconBg: 'bg-[#1D91CC]',  href: '/programmes-en-tunisie' },
    { title: 'Balnéaire',          subtitle: 'Détente & plages',      image: '/sidibousaid.webp',         icon: 'mdi:beach',         iconBg: 'bg-[#07B574]',  href: '/programmes-en-tunisie' },
    { title: 'Nature & Montagne',  subtitle: 'Paysages exceptionnels',image: '/nature.jpg',           icon: 'mdi:terrain',       iconBg: 'bg-[#6366f1]',  href: '/programmes-en-tunisie' },
  ];

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20 border-b border-slate-100">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          {/* Left text */}
          <div className="lg:w-72 shrink-0">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5E14] mb-2">Découvrez la Tunisie</p>
            <h2 className="text-3xl font-black text-[#0B2D4D] leading-tight mb-4">Programmes en Tunisie</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
              Partez à la découverte des trésors de notre pays. Culture, nature, Sahara et traditions tunisiennes vous attendent.
            </p>
            <Link
              href="/programmes-en-tunisie"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#0B2D4D] hover:bg-[#071e33] text-white rounded-xl text-sm font-extrabold transition-colors shadow-sm"
            >
              Voir tous les programmes
              <Icon icon="mdi:arrow-right" className="w-4 h-4 text-[#FF5E14]" />
            </Link>
          </div>

          {/* Right: 4 portrait cards */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <motion.a
                key={cat.title}
                href={cat.href}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] block shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Dark gradient from bottom */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D4D]/90 via-[#0B2D4D]/20 to-transparent" /> */}
                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className={`w-9 h-9 rounded-full ${cat.iconBg} flex items-center justify-center text-white mb-2.5 shadow-md`}>
                    <Icon icon={cat.icon} className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-[13px] font-extrabold text-white leading-tight">{cat.title}</h3>
                  <p className="text-[11px] font-medium text-white/70 mt-0.5">{cat.subtitle}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   CTA SECTION
   Full-bleed background image, dark navy overlay (~80%).
   Left: headline "Un projet de voyage ?", short subtitle,
   3 icon+text feature rows in a flex wrap.
   Right: standalone white rounded card "Parlez à un conseiller"
   with orange phone button + green WhatsApp button stacked.
═══════════════════════════════════════════════════════════════ */
const CTASection = () => (
  <section className="relative py-16 md:py-20 overflow-hidden">
    <div className="absolute inset-0">
      <Image src="/experience-vibrante.jpg" fill alt="Voyage" className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-[#0B2D4D]/80" />
    </div>

    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
        {/* Left */}
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
            Un projet de voyage ?
          </h2>
          <p className="text-white/75 text-sm font-medium mb-9 max-w-sm">
            Nos conseillers sont là pour vous accompagner.
          </p>
          <div className="flex flex-wrap gap-5">
            {[
              { icon: 'mdi:star-outline',                  title: 'Conseils',       desc: 'personnalisés' },
              { icon: 'mdi:file-document-check-outline',   title: 'Devis rapide',   desc: 'et gratuit'    },
              { icon: 'mdi:handshake-outline',             title: 'Accompagnement', desc: 'complet'       },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#FF5E14]">
                  <Icon icon={f.icon} className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white leading-tight">{f.title}</p>
                  <p className="text-[10px] font-semibold text-white/55 leading-tight mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: white card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl max-w-sm w-full shrink-0">
          <h3 className="text-base font-extrabold text-[#0B2D4D]">Parlez à un conseiller</h3>
          <p className="text-xs text-slate-500 font-semibold mt-1 mb-5">Appelez-nous ou écrivez-nous directement</p>
          <div className="space-y-3">
            <a
              href="tel:+21671802881"
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-[#FF5E14] text-white rounded-xl font-extrabold text-sm hover:bg-[#e04f0f] transition-all"
            >
              <Icon icon="mdi:phone" className="w-4.5 h-4.5" />
              Appelez-nous
            </a>
            <a
              href="https://wa.me/21694849694"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-5 py-3.5 bg-[#07B574] text-white rounded-xl font-extrabold text-sm hover:bg-emerald-600 transition-all"
            >
              <Icon icon="mdi:whatsapp" className="w-4.5 h-4.5" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ═══════════════════════════════════════════════════════════════
   FAQ SECTION
   White bg. Header: orange eyebrow + "Questions fréquentes" title
   + orange underline bar. "Contactez-nous" border button top-right.
   2-column grid of accordion items.
   Open: orange filled circle with minus icon, light #F8FAFB bg,
         orange-tinted border.
   Closed: white circle with slate border + plus icon, white bg.
═══════════════════════════════════════════════════════════════ */
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { question: 'Comment réserver un voyage avec Batouta Voyages ?', answer: "Réserver votre voyage est simple : choisissez votre destination, sélectionnez vos dates et envoyez-nous une demande de devis. Nos conseillers vous recontactent rapidement pour confirmer les détails et finaliser votre réservation." },
    { question: 'Proposez-vous des voyages sur mesure ?',             answer: "Oui, nous créons des itinéraires entièrement personnalisés selon vos envies, votre budget et vos dates. Contactez-nous pour discuter de votre projet." },
    { question: 'Puis-je modifier ou annuler ma réservation ?',       answer: "Les modifications et annulations sont possibles selon les conditions de chaque programme. Nos équipes vous accompagnent dans ces démarches." },
    { question: 'Les départs sont-ils garantis ?',                    answer: "Oui, nos voyages organisés bénéficient de départs garantis dès le minimum de participants atteint. Vous êtes informés de la confirmation dès votre réservation." },
    { question: 'Quels sont les moyens de paiement acceptés ?',       answer: "Nous acceptons les virements bancaires, les paiements en espèces à l'agence et les paiements électroniques. Un acompte est généralement requis pour confirmer." },
    { question: 'Avez-vous une assistance pendant le voyage ?',       answer: "Absolument. Notre équipe reste disponible 24/7 pendant votre voyage pour toute question ou situation imprévue." },
  ];

  const left  = faqs.filter((_, i) => i % 2 === 0);
  const right = faqs.filter((_, i) => i % 2 === 1);

  const FAQItem = ({ faq, index }) => {
    const open = openIndex === index;
    return (
      <div className={`rounded-xl border overflow-hidden transition-all duration-200 ${open ? 'border-[#FF5E14]/20 bg-[#F8FAFB]' : 'border-slate-200 bg-white'}`}>
        <button
          onClick={() => setOpenIndex(open ? -1 : index)}
          className="flex w-full items-center gap-3.5 p-4 text-left"
        >
          <span className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            open ? 'border-[#FF5E14] bg-[#FF5E14] text-white' : 'border-slate-300 bg-white text-slate-400'
          }`}>
            <Icon icon={open ? 'mdi:minus' : 'mdi:plus'} className="w-3.5 h-3.5" />
          </span>
          <span className={`text-sm font-extrabold leading-snug ${open ? 'text-[#0B2D4D]' : 'text-slate-700'}`}>
            {faq.question}
          </span>
        </button>
        {open && (
          <div className="px-4 pb-4 pl-[50px]">
            <p className="text-[13px] leading-relaxed text-slate-500 font-medium">{faq.answer}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-20 border-b border-slate-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#FF5E14] mb-2">Foire aux questions</p>
            <h2 className="text-3xl font-black text-[#0B2D4D] leading-tight">Questions fréquentes</h2>
            <div className="mt-3 w-12 h-[3px] bg-[#FF5E14] rounded-full" />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-xs text-slate-400 font-bold hidden sm:inline">Vous ne trouvez pas votre réponse ?</span>
            <a
              href="#contact"
              className="inline-flex items-center px-5 py-2.5 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700 hover:border-[#FF5E14] hover:text-[#FF5E14] transition-all bg-white shadow-sm"
            >
              Contactez-nous
            </a>
          </div>
        </div>

        {/* 2-column FAQ grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3">
            {left.map((faq, i)  => <FAQItem key={i * 2}     faq={faq} index={i * 2}     />)}
          </div>
          <div className="space-y-3">
            {right.map((faq, i) => <FAQItem key={i * 2 + 1} faq={faq} index={i * 2 + 1} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HOMEPAGE — main export
   Keeps all DB/API calls from the original implementation.
   Falls back to mock data if API is unavailable.
═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const { t } = useTranslation('common');

  const [organizedItems, setOrganizedItems] = useState([]);
  const [localItems,     setLocalItems]     = useState([]);
  const [loading, setLoading] = useState({ organized: true, local: true });

  /* ── mock fallbacks (match real card shape exactly) ── */
  const mockOrganized = useMemo(() => [
    { id: '1', title: 'Istanbul',   country: 'Turquie',            image: '/istanbul.jpg',  href: '/programs/istanbul-2025', price: '1 490', duration: '5 jours / 4 nuits', transport: 'Avion', rating: 4.8, reviewCount: 120, badge: 'Best seller' },
    { id: '2', title: 'Dubaï',      country: 'Émirats Arabes Unis', image: '/dubai.jpg',     href: '/programs/dubai-2025',    price: '2 590', duration: '6 jours / 5 nuits', transport: 'Avion', rating: 4.9, reviewCount: 86,  badge: 'Nouveau'    },
    { id: '3', title: 'Santorin',   country: 'Grèce',              image: '/santorin.jpg',  href: '/programs/santorin-2025', price: '2 190', duration: '5 jours / 4 nuits', transport: 'Avion', rating: 4.7, reviewCount: 68,  badge: null         },
    { id: '4', title: 'Marrakech',  country: 'Maroc',              image: '/marrakech.jpg', href: '/programs/marrakech-2025',price: '1 290', duration: '5 jours / 4 nuits', transport: 'Avion', rating: 4.6, reviewCount: 95,  badge: null         },
    { id: '5', title: 'Rome',       country: 'Italie',             image: '/rome.jpg',      href: '/programs/rome-2025',     price: '1 690', duration: '5 jours / 4 nuits', transport: 'Avion', rating: 4.7, reviewCount: 74,  badge: null         },
    { id: '6', title: 'Maldives',   country: 'Maldives',           image: '/maldives.jpg',  href: '/programs/maldives-2025', price: '3 990', duration: '7 jours / 6 nuits', transport: 'Avion', rating: 4.9, reviewCount: 103, badge: 'Promo'      },
  ], []);

  const mockLocal = useMemo(() => [
    { id: '101', title: 'Tozeur & Désert', country: 'Tunisie', image: '/tunisia/safari.webp',   href: '/programmes-en-tunisie/tozeur', price: '450', duration: '3 jours / 2 nuits', transport: 'Bus Touristique', rating: 4.9, reviewCount: 42, badge: 'Tunisie' },
    { id: '102', title: 'Djerba Douceur',  country: 'Tunisie', image: '/tunisia/thailand.png',  href: '/programmes-en-tunisie/djerba', price: '590', duration: '4 jours / 3 nuits', transport: 'Avion / Route',   rating: 4.8, reviewCount: 61, badge: 'Tunisie' },
  ], []);

  useEffect(() => {
    const RATINGS      = [4.8, 4.9, 4.7, 4.5, 4.6, 4.8, 4.9, 4.7];
    const REVIEW_COUNTS = [120, 86, 95, 64, 112, 78, 134, 91];

    const fetchData = async () => {
      try {
        const [organizedRes, localRes] = await Promise.all([
          fetch('/api/programs.controller?active=true'),
          fetch('/api/locals?active=true'),
        ]);

        const organized = await organizedRes.json();
        const local     = await localRes.json();

        if (Array.isArray(organized) && organized.length > 0) {
          setOrganizedItems(
            organized.slice(0, 8).map((p, idx) => ({
              id:          p.id,
              title:       p.title,
              country:     p.location_to,
              image:       p.images?.[0] || '/travel3.jpg',
              href:        `/programs/${p.id}`,
              price:       formatPrice(p.price) || 'N/A',
              duration:    p.days ? `${p.days} jours / ${p.days - 1} nuits` : '',
              transport:   'Avion',
              rating:      RATINGS[idx % 8],
              reviewCount: REVIEW_COUNTS[idx % 8],
              badge:       idx === 0 ? 'Best seller' : idx === 1 ? 'Nouveau' : null,
            }))
          );
        } else {
          setOrganizedItems(mockOrganized);
        }

        if (Array.isArray(local) && local.length > 0) {
          setLocalItems(
            local.slice(0, 4).map((p) => ({
              id:        p.id,
              title:     p.title,
              country:   p.location_to || 'Tunisie',
              image:     p.images?.[0]?.url || '/tunisia/Discover_Tunisia_Banner.webp',
              href:      `/programmes-en-tunisie/${p.slug || p.id}`,
              price:     formatPrice(p.price) || 'N/A',
              duration:  p.durationLabel || (p.days ? `${p.days} jours` : 'Programme'),
              transport: null,
              rating:    null,
              badge:     'Tunisie',
            }))
          );
        } else {
          setLocalItems(mockLocal);
        }
      } catch (err) {
        console.error('Homepage fetch error — using fallback data:', err);
        setOrganizedItems(mockOrganized);
        setLocalItems(mockLocal);
      } finally {
        setLoading({ organized: false, local: false });
      }
    };

    fetchData();
  }, [mockOrganized, mockLocal]);

  return (
    <Layout className="bg-white">
      <SEO
        title={t('Home.SEO.title', 'Batouta Voyages | Voyages Organisés, Circuits & Séjours')}
        description={t('Home.SEO.description', 'Découvrez les meilleurs voyages organisés, circuits et séjours avec Batouta Voyages. De la Tunisie vers le monde entier.')}
      />

      <HeroWithSearch />
      <TrustBar />

      <TripCarousel
        eyebrow="Nos voyages organisés"
        title="Nos séjours coups de cœur"
        actionHref="/programs"
        actionText="Voir tous nos voyages"
        items={organizedItems}
        loading={loading.organized}
      />

      <TunisiaCategories />

      <TripCarousel
        eyebrow="Programmes locaux"
        title="Explorez la Tunisie avec nous"
        actionHref="/programmes-en-tunisie"
        actionText="Voir tous les programmes"
        items={localItems}
        loading={loading.local}
      />

      <CTASection />
      <FAQSection />
      <ContactSection />
      <StickyMobileCTA />
    </Layout>
  );
}