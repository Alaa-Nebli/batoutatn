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
import toast, { Toaster } from 'react-hot-toast';

import { Layout } from 'components/Layout';
import SEO from 'components/SEO/SEO';
import { VoyageForm } from 'components/ProgramReservation/ProgramReservation';

import 'swiper/css';
import 'swiper/css/navigation';
import { generateProgramPDF } from '../../../utils/pdfGenerator';

/* -------------------------------------------------- */
/*  Helpers                                           */
/* -------------------------------------------------- */
const decodeHtmlEntities = (text = '') => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

const stripHtml = (html = '') => {
  // First remove HTML tags, then decode entities, then clean up whitespace
  const withoutTags = html.replace(/<[^>]+>/g, '');
  const decodedEntities = decodeHtmlEntities(withoutTags);
  return decodedEntities
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
    .trim();
};

const fmtDate = d =>
  new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

/* -------------------------------------------------- */
/*  Timeline item (screen) - Modern Clean Design       */
/* -------------------------------------------------- */
const TimelineItem = ({ day, content }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="group"
  >
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-500 overflow-hidden">
      {/* Clean Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6 border-b border-gray-50">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">{day}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
              {content.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Icon icon="mdi:clock-outline" className="w-4 h-4 mr-1" />
                Jour {day}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Always visible */}
      <div className="p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Description takes most space */}
          <div className="lg:col-span-2">
            <div 
              className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
          
          {/* Compact image */}
          {content.image && (
            <div className="lg:col-span-1">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={content.image}
                  alt={`Jour ${day} - ${content.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

/* -------------------------------------------------- */
/*  Summary Timeline Item - Compact Version           */
/* -------------------------------------------------- */
const TimelineSummaryItem = ({ day, content }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: day * 0.1 }}
    className="group"
  >
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300 p-6">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">{day}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
            {content.title}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {content.description.replace(/<[^>]+>/g, '').substring(0, 150)}...
          </p>
        </div>
        {content.image && (
          <div className="flex-shrink-0 hidden sm:block">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
              <Image
                src={content.image}
                alt={`Jour ${day}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="64px"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);


/* -------------------------------------------------- */
/*  Modern Image carousel (screen)                    */
/* -------------------------------------------------- */
const ImageCarousel = ({ images = [] }) => (
  <div className="relative h-80 lg:h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl screen-only">
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation={{
        nextEl: '.custom-next',
        prevEl: '.custom-prev',
      }}
      pagination={{ 
        clickable: true,
        bulletClass: 'swiper-pagination-bullet !bg-white/70 !w-3 !h-3',
        bulletActiveClass: 'swiper-pagination-bullet-active !bg-white !scale-125'
      }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      loop={images.length > 1}
      className="h-full group"
    >
      {images.map((img, idx) => (
        <SwiperSlide key={idx}>
          <div className="relative h-full w-full">
            <Image
              src={img}
              alt={`${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
              priority={idx < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        </SwiperSlide>
      ))}
      
      {/* Custom Navigation */}
      {images.length > 1 && (
        <>
          <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
            <Icon icon="mdi:chevron-left" className="w-6 h-6 text-gray-800" />
          </button>
          <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
            <Icon icon="mdi:chevron-right" className="w-6 h-6 text-gray-800" />
          </button>
        </>
      )}
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
      <h2 className="text-2xl md:text-2xl font-bold text-gray-800 mb-4">
  Du {formatDate(program.from_date, { year: undefined })} au {formatDate(program.to_date)}
</h2>

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

        <div className="mt-auto border-t border-gray-200 pt-4">
          {/* Desktop Layout - Horizontal */}
          <div className="hidden md:flex items-center justify-between">
            <Link 
              href={`/programs/detailed/${program.id}`}
              className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 flex items-center cursor-pointer transition-colors"
            >
              Réserver
            </Link>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(`+216${program.phone || '71030303'}`);
                toast.success('Numéro copié dans le presse-papiers');
              }}
              aria-label="Copier le numéro de téléphone"
              className="w-full ml-10 inline-flex items-center px-6 py-3 bg-orange-600 text-white text-center rounded-lg font-medium shadow-md hover:bg-orange-700 hover:scale-[1.02] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600"
            >
              <Icon icon="mdi:phone" className="w-4 h-4 mr-2" />
              +216 {program.phone || '71030303'}
            </button>
          </div>
          
          {/* Mobile Layout - Vertical Stack */}
          <div className="md:hidden space-y-3">
            <Link 
              href={`/programs/detailed/${program.id}`}
              className="w-full px-6 py-3 bg-orange-600 text-white rounded-lg shadow-lg hover:bg-orange-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              Réserver
            </Link>
            
            <div className="space-y-2">
               {/* Call button */}
           <a
            href={`tel:${program.phone}`}
            aria-label="Appelez votre conseiller"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 md:hidden"
          >
            <Icon icon="mdi:phone" className="w-5 h-5 mr-2" />
            Appelez votre conseiller
            <span className="hidden md:inline ml-2">+216 {program.phone}</span>
          </a>
          {/* Mobile-only WhatsApp button */}
          <a
            href={`https://wa.me/${program.whatsappNumber || program.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactez-nous via WhatsApp"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-[1.03] transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 md:hidden"
          >
            <Icon icon="mdi:whatsapp" className="w-5 h-5 mr-2" />
            WhatsApp
          </a>
            </div>
          </div>
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

    {/* <button
      type="button"
      onClick={onPrint}
      className="px-5 py-3 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700 flex items-center"
    >
      <Icon icon="mdi:printer" className="w-5 h-5 mr-2" />
      Imprimer
    </button> */}

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
  
  // Reservation state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numberOfPersons: 2,
    roomType: 'double',
    specialRequests: '',
    tripId: ''
  });
  const [reservationLoading, setReservationLoading] = useState(false);
  const [timelineView, setTimelineView] = useState('detailed'); // 'detailed' or 'summary'

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/programs.controller?id=${id}`);
        if (!res.ok) throw new Error('Programme non trouvé');
        const data = await res.json();
        setProgram(Array.isArray(data) ? data[0] : data);
        // Set the program ID in form data
        setFormData(prev => ({ ...prev, tripId: Array.isArray(data) ? data[0]?.id : data?.id }));
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* -------- handlers ----------------------------------------- */
  const handlePrint = () => window.print();

  const handleDownloadPDF = async () => {
    try {
      // Detect if we're in Facebook's in-app browser or other restricted environments
      const isInAppBrowser = /FBAN|FBAV|Instagram|Twitter|Line|WhatsApp|LinkedIn/i.test(navigator.userAgent);
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isInAppBrowser) {
        // Show toast with instructions for in-app browsers
        toast.error(
          'Pour télécharger le PDF, cliquez sur les trois points ⋮ et sélectionnez "Ouvrir dans le navigateur"',
          { duration: 6000 }
        );
        
        // Try to force redirect to external browser
        try {
          // First try to open in external browser directly
          window.open(window.location.href, '_blank');
        } catch (error) {
          console.log('Failed to open in external browser, trying share API');
        }
        
        // Also try Web Share API as backup
        if (navigator.share) {
          setTimeout(async () => {
            try {
              await navigator.share({
                title: `${program.title} - Programme PDF`,
                text: 'Ouvrir dans le navigateur pour télécharger le PDF',
                url: window.location.href
              });
            } catch (shareError) {
              console.log('Share API failed:', shareError);
            }
          }, 1000);
        }
        return;
      }
      
      // For mobile browsers, try PDF generation with better error handling
      if (isMobile) {
        try {
          await generateProgramPDF(program);
        } catch (error) {
          console.error('Mobile PDF generation failed:', error);
          // Fallback: try to open a new window with printable content
          const printWindow = window.open('', '_blank');
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>${program.title} - Programme</title>
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #ea580c; }
                    h2 { color: #9a3412; margin-top: 30px; }
                    .section { margin-bottom: 30px; }
                    .day-title { font-weight: bold; color: #ea580c; }
                    @media print { 
                      body { margin: 0; }
                      .no-print { display: none; }
                    }
                  </style>
                </head>
                <body>
                  <div class="no-print">
                    <button onclick="window.print()" style="background: #ea580c; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-bottom: 20px;">Imprimer / Enregistrer en PDF</button>
                  </div>
                  <h1>${program.title}</h1>
                  <div class="section">
                    <strong>Destination:</strong> ${program.location_from} → ${program.location_to}<br>
                    <strong>Dates:</strong> ${fmtDate(program.from_date)} – ${fmtDate(program.to_date)}<br>
                    <strong>Durée:</strong> ${program.days} jours<br>
                    <strong>Prix:</strong> ${program.price?.toLocaleString('fr-FR')} TND
                    ${program.singleAdon ? `<br><strong>Supplément single:</strong> ${program.singleAdon.toLocaleString('fr-FR')} TND` : ''}
                  </div>
                  <h2>Aperçu du séjour</h2>
                  <div class="section">${stripHtml(program.description)}</div>
                  <h2>Itinéraire détaillé</h2>
                  ${program.timeline.map((t, i) => `
                    <div class="section">
                      <div class="day-title">Jour ${i + 1}: ${stripHtml(t.title)}</div>
                      <div>${stripHtml(t.description)}</div>
                    </div>
                  `).join('')}
                  ${program.priceInclude ? `
                    <h2>Ce que comprend le prix</h2>
                    <div class="section">${stripHtml(program.priceInclude)}</div>
                  ` : ''}
                  ${program.generalConditions ? `
                    <h2>Conditions générales</h2>
                    <div class="section">${stripHtml(program.generalConditions)}</div>
                  ` : ''}
                  <div class="section">
                    <strong>BATOUTA VOYAGES</strong><br>
                    Tél: +216 71 802 881<br>
                    Email: outgoing.batouta@gmail.com
                  </div>
                </body>
              </html>
            `);
            printWindow.document.close();
            toast.success('Fenêtre ouverte! Cliquez sur "Imprimer" puis "Enregistrer en PDF"');
          } else {
            // If popup is blocked, fall back to print current page
            window.print();
          }
        }
      } else {
        // Desktop browsers - standard PDF generation
        await generateProgramPDF(program);
      }
      
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Impossible de générer le PDF. Essayez d\'imprimer la page.');
      // Final fallback to print method
      window.print();
    }
  };

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

  // Reservation handlers
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setReservationLoading(true);
    
    try {
      const reservationData = {
        tripId: program.id,
        tripTitle: program.title,
        tripLocation: `${program.location_from} → ${program.location_to}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        numberOfPersons: formData.numberOfPersons,
        roomType: formData.roomType,
        specialRequests: formData.specialRequests,
        preferredDate: `${fmtDate(program.from_date)} - ${fmtDate(program.to_date)}`,
        totalPrice: calculatePrice()
      };

      const res = await fetch('/api/program-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi de la demande');
      }

      const data = await res.json();
      
      toast.success('Demande de réservation envoyée avec succès! Nous vous contacterons bientôt.');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        numberOfPersons: 2,
        roomType: 'double',
        specialRequests: '',
        tripId: program.id
      });
      
    } catch (error) {
      console.error('Reservation error:', error);
      toast.error(error.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setReservationLoading(false);
    }
  };

  const calculatePrice = () => {
    if (!program) return 0;
    
    let total = program.price * formData.numberOfPersons;
    
    if (formData.roomType === 'single' && program.singleAdon) {
      total += program.singleAdon * formData.numberOfPersons;
    }
    
    return total;
  };

  const handleDownloadText = () => {
    if (!program) return;
    
    let txt = `${program.title}\n`;
    txt += `${'='.repeat(program.title.length)}\n\n`;
    
    txt += `DESTINATION: ${program.location_from} → ${program.location_to}\n`;
    txt += `DATES: ${fmtDate(program.from_date)} – ${fmtDate(program.to_date)}\n`;
    txt += `DURÉE: ${program.days} jours\n`;
    txt += `PRIX: ${program.price?.toLocaleString('fr-FR')} TND par personne\n`;
    
    if (program.singleAdon) {
      txt += `SUPPLÉMENT SINGLE: ${program.singleAdon.toLocaleString('fr-FR')} TND\n`;
    }
    
    txt += '\n' + '='.repeat(50) + '\n';
    txt += 'APERÇU DU SÉJOUR\n';
    txt += '='.repeat(50) + '\n\n';
    txt += `${stripHtml(program.description)}\n\n`;
    
    txt += '='.repeat(50) + '\n';
    txt += 'ITINÉRAIRE DÉTAILLÉ\n';
    txt += '='.repeat(50) + '\n\n';
    
    program.timeline.forEach((t, i) => {
      const dayTitle = stripHtml(t.title);
      txt += `JOUR ${i + 1}: ${dayTitle}\n`;
      txt += `${'-'.repeat(dayTitle.length + 10)}\n`;
      txt += `${stripHtml(t.description)}\n\n`;
    });

    if (program.priceInclude) {
      txt += '='.repeat(50) + '\n';
      txt += 'CE QUE COMPREND LE PRIX\n';
      txt += '='.repeat(50) + '\n\n';
      txt += `${stripHtml(program.priceInclude)}\n\n`;
    }

    if (program.generalConditions) {
      txt += '='.repeat(50) + '\n';
      txt += 'CONDITIONS GÉNÉRALES\n';
      txt += '='.repeat(50) + '\n\n';
      txt += `${stripHtml(program.generalConditions)}\n\n`;
    }

    txt += '='.repeat(50) + '\n';
    txt += 'CONTACT\n';
    txt += '='.repeat(50) + '\n';
    txt += 'BATOUTA VOYAGES\n';
    txt += 'Tél: +216 71 802 881\n';
    txt += 'Email: outgoing.batouta@gmail.com\n';

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
            <Link 
              href="/programs"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg cursor-pointer transition-colors hover:bg-orange-700"
            >
              Voir tous les programmes
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Dynamic keywords for SEO
  const keywords = [
    program.title,
    program.location_from,
    program.location_to,
    'voyage organisé',
    'circuit',
    'excursion',
    'séjour',
    'Tunisie',
    'Batouta',
    'programme de voyage',
    'agence de voyage Tunisie',
    'voyage groupe',
    'tourisme',
  ]
    .filter(Boolean)
    .join(', ');

  // BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
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
        "name": "Programmes",
        "item": (process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn") + "/programs"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": program.title,
        "item": (process.env.NEXT_PUBLIC_SITE_URL || "https://batouta.tn") + `/programs/${program.id}`
      }
    ]
  };

  return (
    <Layout>
      <SEO
        title={`${program.title} | Voyages`}
        description={stripHtml(program.description).substring(0, 160)}
        image={program.images?.[0]}
        keywords={keywords}
      />
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Actions (buttons) */}
      

      {/* ---------- MODERN SCREEN LAYOUT ----------------------- */}
      <section className="py-20 md:py-24 screen-only bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile: Header first, then carousel */}
          <div className="lg:hidden space-y-8">
            <ProgramHeaderCard program={program} />
            <ImageCarousel images={program.images ?? []} />
          </div>
          
          {/* Desktop: Side by side with equal heights */}
          <div className="hidden lg:grid lg:grid-cols-2 gap-12">
            <div className="h-full">
              <ImageCarousel images={program.images ?? []} />
            </div>
            <div className="h-full">
              <ProgramHeaderCard program={program} />
            </div>
          </div>
        </div>
      </section>

      {/* Modern Overview Section */}
      <section className="py-16 screen-only bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Aperçu du séjour
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les détails de cette expérience unique
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12"
          >
            <div 
              className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: program.description }}
            />
          </motion.div>
        </div>
      </section>

      {/* Modern Timeline Section */}
      <section className="py-20 screen-only bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Itinéraire détaillé
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jour par jour, découvrez votre aventure dans ses moindres détails
            </p>
          </motion.div>

          {/* Timeline Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-xl shadow-lg p-1 flex border border-gray-200">
              <button
                onClick={() => setTimelineView('detailed')}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  timelineView === 'detailed'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                Programme détaillé
              </button>
              <button
                onClick={() => setTimelineView('summary')}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                  timelineView === 'summary'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                Programme abrégé
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {timelineView === 'detailed' ? (
              program.timeline.map((t, i) => (
                <TimelineItem
                  key={i}
                  day={i + 1}
                  content={t}
                />
              ))
            ) : (
              program.timeline.map((t, i) => (
                <TimelineSummaryItem
                  key={i}
                  day={i + 1}
                  content={t}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modern Reservation Section */}
      <section id="reservation-section" className="py-20 screen-only bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Réservez votre voyage
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Prêt à vivre cette aventure exceptionnelle ? Complétez votre réservation en quelques clics
            </p>
          </motion.div>

          <VoyageForm
            trips={[program]}
            selectedTrip={program}
            formData={formData}
            setFormData={setFormData}
            setSelectedTrip={() => {}}
            onSubmit={handleReservationSubmit}
            loading={reservationLoading}
            calculatePrice={calculatePrice}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section className="screen-only py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Une question ? Contactez-nous
            </h3>
            
            {/* Special "Open in Browser" button for Facebook users */}
            {/FBAN|FBAV/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '') && (
              <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center justify-center mb-3">
                  <Icon icon="mdi:information" className="w-5 h-5 text-orange-600 mr-2" />
                  <span className="text-orange-800 font-medium">Pour télécharger le PDF</span>
                </div>
                <p className="text-sm text-orange-700 mb-4">
                  👉 Cliquez sur les trois points <strong>⋮</strong> et sélectionnez <strong>"Ouvrir dans le navigateur"</strong>
                </p>
                <button
                  onClick={() => window.open(window.location.href, '_blank')}
                  className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Icon icon="mdi:open-in-new" className="w-5 h-5" />
                  <span>Ouvrir dans le navigateur</span>
                </button>
              </div>
            )}
            
            {/* Desktop-only Copy Phone button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(`+216${program.phone || '71030303'}`);
                toast.success('Numéro copié dans le presse-papiers');
              }}
              aria-label="Copier le numéro de téléphone"
              className="hidden md:inline-flex items-center space-x-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Icon icon="mdi:content-copy" className="w-6 h-6" />
              <span className="text-lg">+216 {program.phone || '71030303'}</span>
            </button>
            
            {/* Mobile-only buttons - Optimized vertical layout */}
            <div className="flex flex-col gap-3 justify-center md:hidden max-w-sm mx-auto">
              <a
                href={`tel:+216${program.phone || '71030303'}`}
                className="inline-flex items-center justify-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Icon icon="mdi:phone" className="w-6 h-6" />
                <span className="text-lg">Appeler +216 {program.phone || '71030303'}</span>
              </a>
              <a
                href={`https://wa.me/216${program.whatsappNumber || program.phone || '71030303'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Icon icon="mdi:whatsapp" className="w-6 h-6" />
                <span className="text-lg">WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ---------- PRINT -------------------------------------- */}
      <PrintLayer program={program} />

      {/* Optimized Floating Action Buttons */}
      <div className="screen-only fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
        {/* Desktop: Vertical layout */}
        <div className="hidden md:flex flex-col space-y-3">
          <motion.button
            onClick={() => {
              const element = document.getElementById('reservation-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300"
            title="Réserver ce voyage"
          >
            <Icon icon="mdi:calendar-check" className="w-5 h-5 mr-5" /> Réserver
          </motion.button>
          
          <motion.button
            onClick={handleDownloadPDF}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex group bg-blue-600 text-center hover:bg-blue-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            title="Télécharger PDF"
          >
            <Icon icon="mdi:file-pdf-box" className="w-5 h-5 mr-5" /> Télécharger PDF
          </motion.button>
          
          
          
          {/* <motion.button
            onClick={handlePrint}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex group bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            title="Imprimer"
          >
            <Icon icon="mdi:printer" className="w-5 h-5 mr-5" /> Imprimer
          </motion.button> */}
          
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex group bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
            title="Partager"
          >
            <Icon icon="mdi:share-variant" className="w-5 h-5 mr-5" /> Partager
          </motion.button>
        </div>

        {/* Mobile: Always visible vertical stack */}
        <div className="md:hidden flex flex-col space-y-3">
          <motion.button
            onClick={() => {
              const element = document.getElementById('reservation-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            whileTap={{ scale: 0.95 }}
            className="flex bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-full shadow-2xl transition-all duration-300"
            title="Réserver ce voyage"
          >
            <Icon icon="mdi:calendar-check" className="w-6 h-6" /> Réserver
          </motion.button>
          
          <motion.button
            onClick={handleDownloadPDF}
            whileTap={{ scale: 0.95 }}
            className="flex bg-blue-600 text-white p-3 rounded-full shadow-xl transition-all duration-300"
            title="Télécharger PDF"
          >
            <Icon icon="mdi:file-pdf-box" className="w-5 h-5" /> Télécharger
          </motion.button>
          
         
        
          
          {/* <motion.button
            onClick={handlePrint}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-600 text-white p-3 rounded-full shadow-xl transition-all duration-300"
            title="Imprimer"
          >
            <Icon icon="mdi:printer" className="w-5 h-5" />
          </motion.button> */}
          
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.95 }}
            className="flex bg-green-600 text-white p-3 rounded-full shadow-xl transition-all duration-300"
            title="Partager"
          >
            <Icon icon="mdi:share-variant" className="w-5 h-5" /> Partager
          </motion.button>
        </div>
      </div>

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
      <Toaster position="top-right" />
    </Layout>
  );
}
