/* eslint-disable react/no-array-index-key */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { Layout } from 'components/Layout';
import SEO from 'components/SEO/SEO';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* -------------------------------------------------- */
/*  Helpers                                           */
/* -------------------------------------------------- */
const stripHtml = (html = '') =>
  html.replace(/<[^>]+>/g, '').replace(/\n{3,}/g, '\n\n').trim();

const fmtDate = d =>
  new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/* -------------------------------------------------- */
/*  Timeline item (screen)                            */
/* -------------------------------------------------- */
const TimelineItem = ({ day, content, isActive, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -100px 0px' }}
    className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300"
  >
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
        isActive
          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
          : 'bg-white text-gray-800 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-4">
        <span
          className={`text-2xl font-bold ${
            isActive ? 'text-white' : 'text-orange-500'
          }`}
        >
          Jour {day}
        </span>
        <div className="flex flex-col items-start">
          <span className="text-2xl font-bold text-left">{content.title}</span>
          {!isActive && (
            <span className="text-sm text-gray-500 mt-1">
              Cliquer pour voir les détails
            </span>
          )}
        </div>
      </div>
      <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.3 }}>
        <Icon icon="mdi:chevron-down" className="w-6 h-6" />
      </motion.div>
    </button>

    <motion.div
      initial={false}
      animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div
          className="text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.description }}
        />
        {content.image && (
          <div className="relative aspect-video md:aspect-[3/2] rounded-xl overflow-hidden shadow-lg">
            <Image
              src={content.image}
              alt={content.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={isActive}
            />
          </div>
        )}
      </div>
    </motion.div>
  </motion.div>
);


/* -------------------------------------------------- */
/*  Image carousel (screen)                           */
/* -------------------------------------------------- */
const ImageCarousel = ({ images = [] }) => (
  <div className="relative h-full rounded-xl overflow-hidden shadow-lg screen-only">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop
      className="h-full"
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className="relative h-full w-full">
            <Image
              src={img}
              alt={`Slide ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={idx < 3}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

/* -------------------------------------------------- */
/*  Header (screen)                                   */
/* -------------------------------------------------- */
const ScreenHeader = ({ program }) => {
  const titleIsHTML = /<[a-z][\s\S]*>/i.test(program.title ?? '');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col screen-only"
    >
      <h1
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
        {...(titleIsHTML ? { dangerouslySetInnerHTML: { __html: program.title } } : {})}
      >
        {!titleIsHTML && program.title}
      </h1>

      <div className="space-y-3 mb-6 text-lg">
        <p>
          <Icon icon="mdi:map-marker" className="inline w-5 h-5 text-orange-500 mr-1" />
          {program.location_from} → {program.location_to}
        </p>
        <p>
          <Icon icon="mdi:calendar" className="inline w-5 h-5 text-orange-500 mr-1" />
          {fmtDate(program.from_date)} – {fmtDate(program.to_date)}
        </p>
        <p>
          <Icon icon="mdi:clock-outline" className="inline w-5 h-5 text-orange-500 mr-1" />
          {program.days} jours
        </p>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <span className="text-sm text-gray-500 block">À partir de</span>
        <span className="text-3xl font-bold text-orange-500">
          {program.price?.toLocaleString('fr-FR') ?? '...'} TND
        </span>
        <span className="text-sm text-gray-600"> / pers. (double)</span>
      </div>
    </motion.div>
  );
};

/* -------------------------------------------------- */
/*  Header card (screen)                              */
/* -------------------------------------------------- */
const ProgramHeaderCard = ({ program }) => {
  const formatDate = (date, options = {}) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...options,
    });
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{program.title}</h1>
      <h4 className="text-2xl md:text-2xl font-bold text-gray-800 mb-4">
  Du {formatDate(program.from_date, { year: undefined })} au {formatDate(program.to_date)}
</h4>

      <br />
      <div className="space-y-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon icon="mdi:map-marker" className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-4xl mb-5">Destination</p>
            <p className="text-gray-600 text-lg">
              {program.location_from} → {program.location_to}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Icon icon="mdi:calendar" className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-4xl mb-5">Dates</p>
            <p className="text-gray-600 text-lg">
              {formatDate(program.from_date)} - {formatDate(program.to_date)}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Icon icon="mdi:clock-outline" className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
          <div>
            <p className="font-semibold text-gray-800 text-4xl mb-5">Durée</p>
            <p className="text-gray-600 text-lg">{program.days} Jours</p>
          </div>
        </div>
      </div>

      <div className="mt-auto border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">Prix</p>
        <div className="flex items-end justify-between">
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-orange-500">
              {program.price ? program.price.toLocaleString('de-DE') : '...'}
            </span>
            <span className="text-lg pb-1 text-gray-600">TND</span>
            <span className="text-lg pb-1 text-gray-600">
              {' '}
              / Personne en chambre double
            </span>
          </div>
        </div>
      </div>
      {/* ———————————————————————  Supplément + Call  ——————————————————————— */}
      <div className="mt-auto border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">Supplément single :</p>
        <div className="flex items-end justify-between">
          {/* Price */}
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-orange-500">
              {program.singleAdon ? program.singleAdon.toLocaleString('de-DE') : '...'}
            </span>
            <span className="text-lg pb-1 text-gray-600">TND</span>
            <span className="text-lg pb-1 text-gray-600">/ Personne</span>
          </div>
        </div>

        <div className="mt-auto border-t border-gray-200 pt-4 flex items-end justify-between">
          <Link href={`/programs/detailed/${program.id}`} legacyBehavior>
          
            <span className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 flex items-center">
              Programme Détaillé
            </span>
          </Link>
           {/* Call button */}
           <a
            href="tel:+21671030303"
            aria-label="Appelez votre conseiller"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
          >
            <Icon icon="mdi:phone" className="w-5 h-5 mr-2" />
            Appelez votre conseiller
            <span className="hidden md:inline ml-2">+216 {program.phone}</span>
          </a>
          </div>
      </div>
    </motion.div>
    
  );
};

/* -------------------------------------------------- */
/*  PRINT LAYER                                       */
/* -------------------------------------------------- */
const PrintHeaderCard = ({ program }) => (
  <article className="bg-white rounded-lg p-8 border border-gray-200 mb-10 print-layer">
    <div className="relative mb-6">
      <div className="absolute left-0 top-0 w-16 h-2 bg-orange-600 rounded-full" />
      <h1 className="text-4xl md:text-5xl font-extrabold text-orange-600 pt-6 leading-tight">
        {program.title}
      </h1>
    </div>

    <div className="grid grid-cols-2 gap-8 text-lg">
      <section>
        <h2 className="font-semibold text-gray-800 text-2xl mb-2">Destination</h2>
        <p className="font-medium">
          {program.location_from} <span className="text-orange-500">→</span>{' '}
          {program.location_to}
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-gray-800 text-2xl mb-2">Dates</h2>
        <p className="font-medium">
          {fmtDate(program.from_date)} – {fmtDate(program.to_date)}
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-gray-800 text-2xl mb-2">Durée</h2>
        <p className="font-medium">{program.days} jours</p>
      </section>

      <section>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <p className="uppercase text-sm text-gray-700 mb-1">À partir de</p>
          <span className="text-3xl font-bold text-orange-600">
            {program.price?.toLocaleString('fr-FR') ?? '...'}
          </span>{' '}
          <span className="text-base">TND / pers.</span>

          {program.singleAdon && (
            <div className="mt-3 pt-3 border-t border-orange-200">
              <p className="uppercase text-sm text-gray-700 mb-1">Supplément single</p>
              <span className="text-2xl font-bold text-orange-600">
                {program.singleAdon.toLocaleString('fr-FR')}
              </span>{' '}
              <span className="text-base">TND</span>
            </div>
          )}
        </div>
      </section>
    </div>
  </article>
);

const TimelinePrint = ({ day, title, description }) => (
  <article className="relative pt-12 pl-10 pb-10 border-l-2 border-orange-200 last:border-0 last:pb-0">
    <div className="absolute  left-0 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-600 text-white font-bold flex items-center justify-center">
      {day}
    </div>
    <h3 className="text-xl font-bold text-orange-600 mb-3">{title}</h3>
    <div
      className="prose max-w-none text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  </article>
);

const PrintLayer = ({ program }) => (
  <main className="hidden print:block">
    <PrintHeaderCard program={program} />

    <section className="bg-white ">
      <div className="flex items-center mb-6 pt-12">
        <div className="w-1 h-10 bg-orange-600 rounded-full" />
        <h2 className="text-2xl font-bold">Aperçu du séjour</h2>
      </div>
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: program.description }}
      />
    </section>

    <section className="bg-white p-8 rounded-lg border border-gray-200 mb-10">
      <div className="flex items-center mb-6 pt-12">
        <div className="w-1 h-10 bg-orange-600 rounded-full" />
        <h2 className="text-2xl font-bold">Itinéraire détaillé</h2>
      </div>
      {program.timeline.map((t, i) => (
        <TimelinePrint key={i} day={i + 1} title={t.title} description={t.description} />
      ))}
    </section>

    <section className="bg-white p-8 rounded-lg border border-gray-200 mb-10">
      <div className="flex items-center mb-6 pt-12">
        <div className="w-1 h-10 bg-orange-600 rounded-full" />
        <h2 className="text-2xl font-bold">Ce prix comprend &amp; ne comprend pas</h2>
      </div>
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: program.priceInclude || '' }}
      />
    </section>

    <section className="bg-white p-8 rounded-lg border border-gray-200">
      <div className="flex items-center mb-6 pt-12">
        <div className="w-1 h-10 bg-orange-600 rounded-full" />
        <h2 className="text-2xl font-bold">Conditions générales du voyage</h2>
      </div>
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: program.generalConditions || '' }}
      />
    </section>
  </main>
);

/* -------------------------------------------------- */
/*  Floating buttons (screen)                         */
/* -------------------------------------------------- */
const ActionButtons = ({ onPrint, onShare, onDownloadPDF, onDownloadText }) => (
  <div className="screen-only fixed bottom-5 right-5 z-50 flex flex-col space-y-3">
   
    {/* We still rely on the browser’s “Print → Save as PDF”,   
        but the @page margin has been raised to avoid trimming. */}
    <button
      type="button"
      onClick={onDownloadPDF}
      className="px-5 py-3 bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600 flex items-center"
    >
      <Icon icon="mdi:file-pdf-box" className="w-5 h-5 mr-2" />
      Télécharger <br /> Le Programme
    </button>

    <button
      type="button"
      onClick={onPrint}
      className="px-5 py-3 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 flex items-center"
    >
      <Icon icon="mdi:printer" className="w-5 h-5 mr-2" />
      Imprimer
    </button>

    <button
      type="button"
      onClick={onShare}
      className="px-5 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 flex items-center"
    >
      <Icon icon="mdi:share-variant" className="w-5 h-5 mr-2" />
      Partager
    </button>
  </div>
);

/* -------------------------------------------------- */
/*  Main component                                   */
/* -------------------------------------------------- */
export default function ProgramPage() {
  const { query } = useRouter();
  const { id } = query;

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/programs.controller?id=${id}`);
        if (!res.ok) throw new Error('Programme non trouvé');
        const data = await res.json();
        setProgram(Array.isArray(data) ? data[0] : data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* -------- handlers ----------------------------------------- */
  const handlePrint = () => window.print();

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: program?.title, url: window.location.href });
      } else {
        window.open(
          `mailto:?subject=${encodeURIComponent(program?.title)}&body=${encodeURIComponent(
            window.location.href,
          )}`,
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadText = () => {
    if (!program) return;
    let txt = `${program.title}\n\nDestination : ${program.location_from} → ${
      program.location_to
    }\nDates : ${fmtDate(program.from_date)} – ${fmtDate(program.to_date)}\nDurée : ${
      program.days
    } jours\nPrix : ${program.price?.toLocaleString('fr-FR')} TND\n`;
    if (program.singleAdon)
      txt += `Supplément single : ${program.singleAdon.toLocaleString('fr-FR')} TND\n`;

    txt += `\nAperçu :\n${stripHtml(program.description)}\n\nItinéraire :\n`;
    program.timeline.forEach((t, i) => {
      txt += `Jour ${i + 1} : ${t.title}\n${stripHtml(t.description)}\n`;
    });

    txt += `\nComprend/Ne comprend pas :\n${stripHtml(program.priceInclude)}\n\nConditions générales :\n${stripHtml(
      program.generalConditions,
    )}\n`;

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `programme-${program.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`,
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /* -------- render ------------------------------------------- */
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent"
          />
        </div>
      </Layout>
    );
  }

  if (error || !program) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6 max-w-md px-4">
            <Icon icon="mdi:alert-circle-outline" className="w-16 h-16 mx-auto text-orange-600" />
            <h2 className="text-3xl font-bold">{error ?? 'Programme non trouvé'}</h2>
            <Link href="/programs" legacyBehavior>
              <span className="px-6 py-3 bg-orange-600 text-white rounded-lg">
                Voir tous les programmes
              </span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${program.title} | Voyages`}
        description={stripHtml(program.description).substring(0, 160)}
        image={program.images?.[0]}
      />

      {/* Actions (buttons) */}
      <ActionButtons
        onPrint={handlePrint}
        onShare={handleShare}
        onDownloadPDF={handlePrint}
        onDownloadText={handleDownloadText}
      />

      {/* ---------- ÉCRAN --------------------------------------- */}
      <section className="py-32 screen-only">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <ImageCarousel images={program.images ?? []} />
          <ProgramHeaderCard program={program} />
        </div>
      </section>

      <section className="bg-gray-50 py-12 screen-only">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              Aperçu du séjour
            </h2>
            <div
              className="bg-white p-6 rounded-xl shadow-sm"
              dangerouslySetInnerHTML={{ __html: program.description }}
            />
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 screen-only">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -50px' }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Itinéraire détaillé
          </h2>
          <p className="text-lg text-gray-600">Jour par jour</p>
        </motion.div>

        <div className="space-y-6">
          {program.timeline.map((t, i) => (
            <TimelineItem
              key={i}
              day={i + 1}
              content={t}
              isActive={activeDay === i}
              onClick={() => setActiveDay(activeDay === i ? null : i)}
            />
          ))}
        </div>
      </section>

      <section className="screen-only flex justify-center items-center py-12">
  {/* Call Section */}
  <a
    href={`tel:+216${program.phone}`}
    aria-label="Appelez votre conseiller"
    className="text-center flex flex-col items-center group"
  >
    <h3 className="text-2xl md:text-3xl font-bold text-orange-600 group-hover:underline">
      Appelez votre conseiller
    </h3>
    <p className="text-lg font-bol text-gray-700 mt-2 group-hover:text-orange-700">
      +216 {program.phone}
    </p>
  </a>
</section>


      {/* ---------- PRINT -------------------------------------- */}
      <PrintLayer program={program} />

      {/* ---------- GLOBAL PRINT STYLES ------------------------ */}
      <style jsx global>{`
        .screen-only {
          display: block;
        }
        @media print {
          .screen-only {
            display: none !important;
          }
        }

        @media print {
          @page {
            size: A4;
            margin: 30mm 15mm 15mm 15mm; /* top margin enlarged to 30 mm */
          }

          html,
          body {
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
            background: #fff;
          }

          img,
          svg:not(.print-icon),
          .swiper,
          .swiper-slide {
            display: none !important;
          }

          h1,
          h2,
          h3 {
            page-break-after: avoid;
            color: #000 !important;
          }

          article,
          section {
            page-break-inside: avoid;
          }

          /* ⬇️  Hide the footer in the print layout  */
          footer,        /* if you literally render a <footer> tag   */
          .site-footer,  /* or whatever class your Layout uses       */
          .layout-footer /* add as many selectors as you need        */ {
            display: none !important;
          }

        }
      `}</style>
    </Layout>
  );
}
