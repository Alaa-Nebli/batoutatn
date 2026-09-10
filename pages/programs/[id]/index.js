/* eslint-disable react/no-array-index-key */
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

import { Layout } from 'components/Layout';
import SEO from 'components/SEO/SEO';
import { generateProgramPDF } from '../../../utils/pdfGenerator';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const decodeHtml = (text = '') => {
  if (typeof window === 'undefined')
    return text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
};
const stripHtml = (html = '') => decodeHtml(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

const fmtDate = d => new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
const fmtDateRange = (from, to) => {
  const s = new Date(from), e = new Date(to);
  if (Number.isNaN(s.getTime())) return '';
  if (Number.isNaN(e.getTime())) return fmtDate(from);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth())
    return `Du ${s.getDate()} au ${e.getDate()} ${s.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
  return `Du ${fmtDate(from)} au ${fmtDate(to)}`;
};
const fmtDeparture = (from, to) => {
  const s = new Date(from), e = new Date(to);
  if (Number.isNaN(s.getTime())) return '';
  const o = { day: 'numeric', month: 'long', year: 'numeric' };
  return Number.isNaN(e.getTime())
    ? s.toLocaleDateString('fr-FR', o)
    : `${s.toLocaleDateString('fr-FR', o)} – ${e.toLocaleDateString('fr-FR', o)}`;
};

const normalizeImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.map(img => {
    if (typeof img === 'string') return img;
    if (img && typeof img === 'object' && img.url) return img.url;
    return null;
  }).filter(Boolean);
};

const normalizePhone = (phone) => {
  const raw = String(phone || '71802881').trim().replace(/[^\d+]/g, '');
  if (raw.startsWith('+')) return raw;
  if (raw.startsWith('216')) return `+${raw}`;
  return `+216${raw.replace(/^0+/, '')}`;
};
const fmtPhone = (phone) => {
  const raw = String(phone || '71802881').trim();
  const digits = raw.replace(/\D/g, '').replace(/^216/, '');
  if (digits.length === 8) return `+216 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  return raw;
};

/* ─────────────────────────────────────────────
   GALLERY
───────────────────────────────────────────── */
const Gallery = ({ images }) => {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return (
    <div className="flex flex-col gap-3 mb-8">
      <div className="relative w-full aspect-[16/7] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
        <motion.div key={active} initial={{ opacity: 0.75 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="absolute inset-0">
          <Image src={images[active]} alt="Vue du voyage" fill className="object-cover" priority />
        </motion.div>
        {images.length > 1 && (
          <>
            <button onClick={() => setActive(i => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow z-10 transition-all">
              <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={() => setActive(i => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow z-10 transition-all">
              <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {images.map((img, idx) => (
            <div key={idx} onClick={() => setActive(idx)}
              className={`relative w-24 h-16 shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all ${active === idx ? 'ring-2 ring-[#FF5E14] ring-offset-1 opacity-100' : 'opacity-50 hover:opacity-80'}`}>
              <Image src={img} alt={`Vue ${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   TIMELINE (day-by-day, always expanded)
───────────────────────────────────────────── */
const TimelineDay = ({ day, index }) => {
  const [open, setOpen] = useState(true);
  const num = index + 1;
  return (
    <div className="flex gap-0 ">
      {/* Left: number column */}
      <div className="flex flex-col items-center w-16 shrink-0">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold text-[#1a2e4a] uppercase tracking-widest">Jour</span>
          <span className="text-3xl font-black text-[#1a2e4a] leading-none">{num}</span>
        </div>
        <div className="flex-1 w-px bg-gray-200 " />
      </div>

      {/* Right: content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between cursor-pointer group select-none  pl-2"
          onClick={() => setOpen(o => !o)}>
          <h3 className="text-base font-bold text-[#1a2e4a] group-hover:text-blue-700 transition-colors pr-4 leading-snug">
            {day.title}
          </h3>
          <Icon icon={open ? 'mdi:minus-circle-outline' : 'mdi:plus-circle-outline'}
            className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="pl-2 pt-3 space-y-4">
                {/* Description + optional image side by side */}
                <div className={`flex gap-5 ${day.image ? 'flex-col md:flex-row' : ''} items-start`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 leading-relaxed">{stripHtml(day.description)}</p>
                  </div>
                  {day.image && (
                    <div className="w-full md:w-48 shrink-0 relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm border border-gray-100">
                      <Image src={day.image} alt={day.title} fill className="object-cover" />
                    </div>
                  )}
                </div>

                {/* Repas / Transport / Hébergement tags */}
                {(day.meals || day.transport || day.accommodation) && (
                  <div className="flex flex-wrap gap-2">
                    {day.meals && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                        <Icon icon="mdi:food-outline" className="w-3.5 h-3.5 text-orange-400" />
                        <strong>Repas :</strong>&nbsp;{Array.isArray(day.meals) ? day.meals.join(', ') : day.meals}
                      </span>
                    )}
                    {day.transport && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                        <Icon icon="mdi:bus-outline" className="w-3.5 h-3.5 text-blue-400" />
                        <strong>Transport :</strong>&nbsp;{day.transport}
                      </span>
                    )}
                    {day.accommodation && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-lg">
                        <Icon icon="mdi:bed-outline" className="w-3.5 h-3.5 text-purple-400" />
                        <strong>Hébergement :</strong>&nbsp;{day.accommodation}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SUMMARY STRIP ("Ce voyage en bref")
───────────────────────────────────────────── */
const SummaryStrip = ({ program }) => {
  const nights = Math.max(program.days - 1, 0);
  const items = [
    { icon: 'mdi:calendar-range', label: `${program.days} jours / ${nights} nuits`, sub: 'Durée du séjour' },
    { icon: 'mdi:office-building-outline', label: 'Hôtel 4★', sub: 'Confort & qualité' },
    { icon: 'mdi:account-group-outline', label: 'Groupe accompagné', sub: 'Ambiance conviviale' },
    { icon: 'mdi:translate', label: 'Guide francophone', sub: 'Accompagnement' },
    { icon: 'mdi:tag-check-outline', label: 'Nos prix sont définitifs', sub: 'Ce n\'est pas à partir de' },
  ];
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Icon icon={item.icon} className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-xs leading-tight">{item.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   INCLUDES / EXCLUDES / PRACTICAL INFO
───────────────────────────────────────────── */

const parseListLines = (html = '') => {
  if (!html) return [];
  return html
    .replace(/<li[^>]*>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .split('\n')
    .map(l => decodeHtml(l.trim()))
    .filter(Boolean);
};

const SidebarIncludesExcludes = ({ program }) => {
  const incLines = parseListLines(program.priceInclude);
  const excLines = parseListLines(program.priceExclude);
  if (!incLines.length && !excLines.length) return null;
  return (
    <>
      {incLines.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-[#1a2e4a] text-sm flex items-center gap-2">
              <Icon icon="mdi:check-circle-outline" className="w-4 h-4 text-green-500 shrink-0" />
              Services inclus dans notre forfait
            </h3>
          </div>
          <ul className="p-4 space-y-1.5">
            {incLines.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Icon icon="mdi:check" className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
      {excLines.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-red-500 text-sm flex items-center gap-2">
              <Icon icon="mdi:close-circle-outline" className="w-4 h-4 shrink-0" />
              Ce qui n&apos;est pas inclus
            </h3>
          </div>
          <ul className="p-4 space-y-1.5">
            {excLines.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Icon icon="mdi:close" className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
      
    </>
  );
};

/* ─────────────────────────────────────────────
   HOTELS
───────────────────────────────────────────── */
const StarRating = ({ stars }) => {
  const n = Math.min(5, Math.max(0, Math.round(Number(stars) || 0)));
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Icon key={i} icon="mdi:star" className={`w-4 h-4 ${i <= n ? 'text-amber-400' : 'text-gray-200'}`} />
      ))}
    </span>
  );
};

const HotelsSection = ({ hotels }) => {
  if (!hotels || !hotels.length) return null;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Icon icon="mdi:bed-double-outline" className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Hôtels &amp; Hébergements</h2>
          <p className="text-sm text-gray-500 mt-0.5">Les établissements prévus pour votre séjour.</p>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {hotels.map((hotel, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Icon icon="mdi:office-building-outline" className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">{hotel.name}</p>
            </div>
            {hotel.stars > 0 && (
              <div className="flex items-center gap-2 shrink-0">
                <StarRating stars={hotel.stars} />
                <span className="text-sm text-gray-500 whitespace-nowrap">{hotel.stars} étoile{hotel.stars > 1 ? 's' : ''}</span>
              </div>
            )}
            {hotel.website && (
              <a href={hotel.website} target="_blank" rel="noopener noreferrer"
                className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1 shrink-0 ml-2 whitespace-nowrap">
                Voir l&apos;hôtel <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   GENERAL CONDITIONS
───────────────────────────────────────────── */
const GeneralConditions = ({ content }) => {
  if (!content || !stripHtml(content)) return null;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Icon icon="mdi:file-document-outline" className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Conditions générales</h2>
          <p className="text-sm text-gray-500 mt-0.5">Informations importantes avant votre départ.</p>
        </div>
      </div>
      <div className="p-6 text-sm text-gray-600 trip-rich-text leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
    </section>
  );
};

/* ─────────────────────────────────────────────
   CONTACT BANNER
───────────────────────────────────────────── */
const ContactBanner = ({ phone, whatsapp }) => (
  <section className="bg-[#1a2e4a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <Icon icon="mdi:headset" className="w-7 h-7 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-white text-base">Une question ? Besoin d&apos;aide pour personnaliser votre voyage ?</h3>
        <p className="text-sm text-white/60 mt-0.5">Notre équipe d&apos;experts est là pour vous accompagner à chaque étape.</p>
      </div>
    </div>
    <a href={`/contact`}
      className="shrink-0 bg-[#FF5E14] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all text-sm whitespace-nowrap">
      Contactez-nous <Icon icon="mdi:arrow-right" className="w-4 h-4" />
    </a>
  </section>
);

/* ─────────────────────────────────────────────
   MINI RELATED CARD
───────────────────────────────────────────── */
const MiniCard = ({ program }) => {
  const imgs = normalizeImages(program.images);
  return (
    <Link href={`/programs/${program.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image src={imgs[0] || '/voyage.jpg'} alt={program.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2.5 right-2.5 bg-white/95 px-2 py-0.5 rounded-md text-xs font-bold text-gray-800">{program.days}j</div>
        </div>
        <div className="p-4">
          <h4 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-[#FF5E14] transition-colors">{program.title}</h4>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">{program.location_to}</span>
            <span className="font-bold text-[#FF5E14] text-sm">{program.price?.toLocaleString('fr-FR')} TND</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────
   SIDEBAR BOOKING FORM
───────────────────────────────────────────── */
const BookingForm = ({ program, formData, setFormData, onSubmit, loading, calculatePrice }) => {
  const nights = Math.max(Number(program?.days || 1) - 1, 0);
  const needsRoom = nights > 0;
  const total = typeof calculatePrice === 'function' ? calculatePrice() : 0;
  const departure = fmtDeparture(program?.from_date, program?.to_date);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'numberOfPersons' ? parseInt(value, 10) : value }));
  };

  const inp = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all";
  const sel = `${inp} cursor-pointer`;
  const lbl = "block text-[11px] font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Price header */}
      <div className="bg-[#1a2e4a] px-5 pt-5 pb-4">
        <p className="text-gray-400 text-xs mb-1">À partir de</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[2.5rem] font-black text-[#FF5E14] leading-none tracking-tight">
            {Number(program?.price || 0).toLocaleString('fr-FR')}
          </span>
          <span className="text-base font-bold text-white">TND</span>
        </div>
        <p className="text-gray-400 text-xs mt-0.5">/ par personne</p>
      </div>

      <form onSubmit={onSubmit} className="p-4 space-y-3.5">
        {/* Programme sélectionné */}
        <div>
          <label className={lbl}>Programme sélectionné</label>
          <div className={`${inp} font-semibold text-gray-700 truncate`}>{program?.title}</div>
        </div>

        {/* Prochain départ */}
        {departure && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Icon icon="mdi:calendar-clock" className="w-4 h-4 text-blue-600 shrink-0" />
              <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">Prochain départ</p>
            </div>
            <p className="text-sm font-semibold text-gray-900 ml-5.5">{departure}</p>
          </div>
        )}

        {/* Prénom + Nom */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={lbl}>Prénom</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={onChange} className={inp} placeholder="Ex: Ali" required />
          </div>
          <div>
            <label className={lbl}>Nom</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={onChange} className={inp} placeholder="Ex: Ben Salah" required />
          </div>
        </div>

        {/* Téléphone + Email */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className={lbl}>Téléphone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={onChange} className={inp} placeholder="Ex: 99 999 999" required />
          </div>
          <div>
            <label className={lbl}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} className={inp} placeholder="exemple@mail.com" required />
          </div>
        </div>

        {/* Nombre de personnes */}
        <div>
          <label className={lbl}>Nombre de personnes</label>
          <select name="numberOfPersons" value={formData.numberOfPersons} onChange={onChange} className={sel}>
            {[1,2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Type de chambre */}
        {needsRoom && (
          <div>
            <label className={lbl}>Type de chambre <span className="normal-case font-normal text-gray-400">Pour {program.days} jours / {nights} nuits</span></label>
            <select name="roomType" value={formData.roomType} onChange={onChange} className={sel}>
              <option value="double">Chambre double</option>
              <option value="single">Chambre individuelle</option>
              <option value="triple">Chambre triple</option>
            </select>
          </div>
        )}

        {/* Demandes spéciales */}
        <div>
          <label className={lbl}>Demandes spéciales (facultatif)</label>
          <textarea name="specialRequests" value={formData.specialRequests} onChange={onChange}
            rows={2} className={`${inp} resize-none`} placeholder="Allergies, préférences, demandes..." maxLength={200} />
          <p className="text-right text-[11px] text-gray-400 mt-1">{(formData.specialRequests || '').length}/200</p>
        </div>

        {/* Total */}
        <div className="border-t border-gray-100 pt-3">
          <p className="text-xs font-semibold text-gray-400 mb-1">Estimation du prix</p>
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-2xl font-black text-[#FF5E14]">
              {total.toLocaleString('fr-FR')} <span className="text-sm font-bold text-gray-400">TND</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <button type="submit" disabled={loading}
          className="w-full bg-[#FF5E14] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-orange-500/20 disabled:opacity-60">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi...</>
            : <>Demander disponibilité <Icon icon="mdi:arrow-right" className="w-4 h-4" /></>}
        </button>

        {/* Trust signals */}
        <div className="space-y-1.5 pt-0.5">
          {[
            { icon: 'mdi:lightning-bolt', text: 'Réponse rapide sous 24h' },
            { icon: 'mdi:account-supervisor-outline', text: 'Accompagnement avant, pendant et après' },
            { icon: 'mdi:cash-multiple', text: 'Paiement en plusieurs fois possible' },
            { icon: 'mdi:headset', text: 'Assistance dédiée 24/7' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
              <Icon icon={item.icon} className="w-3.5 h-3.5 text-blue-500 shrink-0" />{item.text}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ProgramDetailsPage() {
  const { query } = useRouter();
  const { id } = query;

  const [program, setProgram] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservationLoading, setReservationLoading] = useState(false);
  const [showMobileSticky, setShowMobileSticky] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    numberOfPersons: 1, roomType: 'double', specialRequests: '', tripId: '',
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [progRes, allRes] = await Promise.all([
          fetch(`/api/programs.controller?id=${id}`),
          fetch(`/api/programs.controller?active=true`),
        ]);
        if (!progRes.ok) throw new Error('Programme non trouvé');
        const progData = await progRes.json();
        const allData = await allRes.json();
        const p = Array.isArray(progData) ? progData[0] : progData;
        setProgram(p);
        setFormData(prev => ({ ...prev, tripId: p?.id }));
        if (Array.isArray(allData)) setRelated(allData.filter(item => item.id !== p.id).slice(0, 3));
      } catch (e) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    const handle = () => {
      const el = document.getElementById('form-mobile');
      if (el) setShowMobileSticky(el.getBoundingClientRect().top > window.innerHeight);
    };
    window.addEventListener('scroll', handle, { passive: true });
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const calculatePrice = useCallback(() => {
    if (!program) return 0;
    let total = program.price * formData.numberOfPersons;
    if (formData.roomType === 'single' && program.singleAdon)
      total += program.singleAdon * formData.numberOfPersons;
    return total;
  }, [program, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setReservationLoading(true);
    try {
      const res = await fetch('/api/program-reservation', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: program.id, tripTitle: program.title,
          tripLocation: `${program.location_from} → ${program.location_to}`,
          ...formData,
          preferredDate: fmtDateRange(program.from_date, program.to_date),
          totalPrice: calculatePrice(),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Votre demande a été envoyée. Nous vous contactons bientôt !');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', numberOfPersons: 1, roomType: 'double', specialRequests: '', tripId: program.id });
    } catch {
      toast.error("Erreur lors de l'envoi. Veuillez réessayer.");
    } finally { setReservationLoading(false); }
  };

  const handlePDF = async () => { try { await generateProgramPDF(program); } catch { window.print(); } };
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: program?.title, url: window.location.href });
      else await navigator.clipboard?.writeText(window.location.href);
    } catch {}
  };

  if (loading) return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#FF5E14] rounded-full animate-spin" />
      </div>
    </Layout>
  );

  if (error || !program) return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce voyage n&apos;est plus disponible</h2>
          <Link href="/programs" className="text-[#FF5E14] font-medium hover:underline">Voir tous les voyages</Link>
        </div>
      </div>
    </Layout>
  );

  const images = normalizeImages(program.images);
  const hotels = Array.isArray(program.hotels) ? program.hotels : [];
  const timeline = Array.isArray(program.timeline) ? program.timeline : [];
  const hasMap = !!program.mapEmbedUrl;
  const mapSrc = (() => {
    if (!program.mapEmbedUrl) return '';
    let url = program.mapEmbedUrl.trim();
    // Already an embed URL — leave it
    if (url.includes('/embed')) return url;
    // Google My Maps: /maps/d/viewer?mid=... → /maps/d/embed?mid=...
    if (url.includes('google.com/maps/d/')) {
      return url.replace(/\/maps\/d\/(viewer|edit|view)(\?|$)/, '/maps/d/embed$2');
    }
    // Regular Google Maps share URL
    url = url.replace(/\/view(\?|$)/, '/embed$1').replace(/\/edit(\?|$)/, '/embed$1');
    return url;
  })();
  const nights = Math.max(program.days - 1, 0);
  const dateRange = fmtDateRange(program.from_date, program.to_date);
  const phone = program.phone || '71802881';
  const whatsapp = program.whatsappNumber || phone;

  return (
    <Layout className="bg-gray-50 font-sans text-gray-900">
      <SEO
        title={`${program.title} | Batouta Voyages`}
        description={stripHtml(program.description).substring(0, 160)}
        image={images[0]}
      />

      <div className="min-h-screen pt-24 pb-20">
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 mt-4 flex-wrap">
            <Link href="/" className="hover:text-[#FF5E14] transition-colors">Accueil</Link>
            <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
            <Link href="/programs" className="hover:text-[#FF5E14] transition-colors text-[#FF5E14] font-semibold">Voyages Organisés</Link>
            <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
            <span className="text-gray-500 truncate max-w-[180px]">{program.location_to}</span>
            <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
            <span className="text-gray-800 font-semibold truncate max-w-[220px]">{program.title}</span>
          </nav>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-[2.6rem] font-black text-[#1a2e4a] leading-tight mb-4">
            {program.title}
          </h1>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold mb-6">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm">
              <Icon icon="mdi:calendar-range" className="w-4 h-4 text-[#FF5E14]" />
              {program.days} jours / {nights} nuits
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm">
              <Icon icon="mdi:map-marker-outline" className="w-4 h-4 text-[#FF5E14]" />
              {program.location_to}
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm">
              <Icon icon="mdi:account-group-outline" className="w-4 h-4 text-[#FF5E14]" />
              Groupe accompagné
            </span>
          </div>

          {/* 2-column layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

            {/* ── MAIN CONTENT (scrolling) ── */}
            <div className="w-full lg:w-[63%] xl:w-[65%] space-y-8">

              <Gallery images={images} />
               {/* Ce voyage en bref */}
              <div>
                <h2 className="text-xl font-bold text-[#1a2e4a] mb-4">Votre Déstination en bref</h2>
                <SummaryStrip program={program} />
              </div>
              {/* About */}
              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
                <div className="trip-rich-text text-gray-600 leading-relaxed text-[15px]"
                  dangerouslySetInnerHTML={{ __html: program.description }} />
              </section>
             
              {/* Hotels */}
              <HotelsSection hotels={hotels} />

              {/* Programme jour par jour */}
              {timeline.length > 0 && (
                <section>
                  <h2 className="text-2xl font-bold text-[#1a2e4a] mb-6">Programme jour par jour</h2>
                  <div>
                    {timeline.map((day, idx) => (
                      <TimelineDay key={day.id || idx} day={day} index={idx} />
                    ))}
                  </div>
                </section>
              )}


              {/* Map — full width */}
              {hasMap && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-[#1a2e4a]">Carte de l&apos;itinéraire</h2>
                  </div>
                  <div className="relative w-full h-[380px] overflow-hidden">
                    <iframe src={mapSrc} width="100%"
                      style={{ border: 0, position: 'absolute', left: 0, top: '-56px', width: '100%', height: 'calc(100% + 56px)' }}
                      allowFullScreen loading="lazy" title="Carte de l'itinéraire" />
                  </div>
                </section>
              )}

              {/* General conditions */}
              <GeneralConditions content={program.generalConditions} />

              {/* Contact banner */}
              <ContactBanner phone={phone} whatsapp={whatsapp} />

              {/* Related */}
              {related.length > 0 && (
                <div className="pt-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-5">Vous aimerez aussi</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {related.map(rp => <MiniCard key={rp.id} program={rp} />)}
                  </div>
                </div>
              )}
            </div>

            {/* ── SIDEBAR ── */}
            <aside className="w-full lg:w-[37%] xl:w-[35%] mt-0 lg:mt-0">
              <div className="sticky top-24 space-y-4">
                <BookingForm
                  program={program}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  loading={reservationLoading}
                  calculatePrice={calculatePrice}
                />

                <SidebarIncludesExcludes program={program} />

                {/* Help box */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-bold text-[#1a2e4a] text-sm mb-3">Besoin d&apos;aide ?</h3>
                  <p className="text-xs text-gray-500 mb-4">Notre équipe est à votre écoute</p>
                  <div className="space-y-2.5">
                    <a href={`tel:${normalizePhone(phone)}`}
                      className="flex items-center gap-2.5 text-sm font-semibold text-gray-800 hover:text-[#FF5E14] transition-colors">
                      <Icon icon="mdi:phone-outline" className="w-4 h-4 text-blue-600 shrink-0" />{fmtPhone(phone)}
                    </a>
                    <a href={`https://wa.me/${normalizePhone(whatsapp).replace('+', '')}`}
                      target="_blank" rel="noreferrer"
                      className="flex items-center gap-2.5 text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors">
                      <Icon icon="mdi:whatsapp" className="w-4 h-4 text-green-500 shrink-0" />{fmtPhone(whatsapp)}
                    </a>
                    <a href="mailto:outgoing@batouta.com"
                      className="flex items-center gap-2.5 text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      <Icon icon="mdi:email-outline" className="w-4 h-4 text-blue-600 shrink-0" />outgoing@batouta.com
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={handlePDF}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 transition-colors">
                      <Icon icon="mdi:file-pdf-box" className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={handleShare}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 transition-colors">
                      <Icon icon="mdi:share-variant" className="w-4 h-4" /> Partager
                    </button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Mobile form */}
        <div className="lg:hidden px-4 mt-12" id="form-mobile">
          <BookingForm
            program={program}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            loading={reservationLoading}
            calculatePrice={calculatePrice}
          />
        </div>
      </div>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {showMobileSticky && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-5 py-3 shadow-lg pb-safe">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Par personne</p>
                <p className="text-xl font-black text-[#FF5E14] leading-none">
                  {program.price?.toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-400">TND</span>
                </p>
              </div>
              <button
                onClick={() => document.getElementById('form-mobile')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-[#1a2e4a] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-[#243f62] transition-colors">
                Demander un devis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Print */}
      <div className="hidden print:block font-sans text-black bg-white p-8">
        <h1 className="text-3xl font-bold mb-4">{program.title}</h1>
        <p className="text-lg mb-6">{dateRange} — {program.days} jours</p>
        <div dangerouslySetInnerHTML={{ __html: program.description }} className="mb-8" />
        {timeline.map((t, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-bold">Jour {i + 1} : {t.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: t.description }} />
          </div>
        ))}
      </div>

      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '1rem', background: '#1f2937', color: '#fff', fontSize: '14px' } }} />

      <style jsx global>{`
        .pb-safe { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .trip-rich-text :where(p,ul,ol) { margin-top: 0.6rem; margin-bottom: 0.6rem; }
        .trip-rich-text :where(ul,ol) { padding-left: 1.25rem; }
        .trip-rich-text :where(li) { margin-bottom: 0.25rem; list-style-type: disc; }
        .trip-rich-text :where(h1,h2,h3,h4) { color: #1a2e4a; font-weight: 700; margin-top: 1.2rem; margin-bottom: 0.5rem; }
        .trip-rich-text :where(a) { color: #FF5E14; font-weight: 500; text-decoration: underline; }
        .rich-list :where(ul) { padding-left: 0; list-style: none; margin: 0; }
        .rich-list :where(li) { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.2rem 0; font-size: 0.875rem; }
        .rich-list :where(li)::before { content: "✓"; color: #22c55e; font-weight: 800; flex-shrink: 0; }
        .rich-list :where(p) { margin: 0.25rem 0; font-size: 0.875rem; }
        .rich-list-x :where(ul) { padding-left: 0; list-style: none; margin: 0; }
        .rich-list-x :where(li) { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.2rem 0; font-size: 0.875rem; }
        .rich-list-x :where(li)::before { content: "✗"; color: #ef4444; font-weight: 800; flex-shrink: 0; }
        .rich-list-x :where(p) { margin: 0.25rem 0; font-size: 0.875rem; }
      `}</style>
    </Layout>
  );
}
