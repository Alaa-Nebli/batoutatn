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
const decodeHtml = (t = '') => {
  if (typeof window === 'undefined')
    return t.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
  const el = document.createElement('textarea');
  el.innerHTML = t;
  return el.value;
};
const stripHtml = (h = '') => decodeHtml(h.replace(/<[^>]+>/g,'')).replace(/\s+/g,' ').trim();

const fmtDate = d => new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',year:'numeric'});
const fmtDateRange = (from, to, flex) => {
  if (flex) return 'Date flexible';
  const s = new Date(from), e = new Date(to);
  if (Number.isNaN(s.getTime())) return '';
  if (!Number.isNaN(e.getTime()) && s.getFullYear()===e.getFullYear() && s.getMonth()===e.getMonth())
    return `Du ${s.getDate()} au ${e.getDate()} ${s.toLocaleDateString('fr-FR',{month:'long',year:'numeric'})}`;
  return `Du ${fmtDate(from)} au ${fmtDate(to)}`;
};

const toImg = i => { if (typeof i==='string') return i; if (i?.url) return i.url; return null; };
const getImages = p => (Array.isArray(p?.images) ? p.images : []).map(toImg).filter(Boolean);

const normalizePhone = ph => {
  const r = String(ph||'71802881').trim().replace(/[^\d+]/g,'');
  if (r.startsWith('+')) return r;
  if (r.startsWith('216')) return `+${r}`;
  return `+216${r.replace(/^0+/,'')}`;
};
const fmtPhone = ph => {
  const d = String(ph||'').replace(/\D/g,'').replace(/^216/,'');
  if (d.length===8) return `+216 ${d.slice(0,2)} ${d.slice(2,5)} ${d.slice(5)}`;
  return String(ph||'');
};

const normalizeMapUrl = (url='') => {
  let u = url.trim();
  if (!u || u.includes('/embed')) return u;
  if (u.includes('google.com/maps/d/'))
    return u.replace(/\/maps\/d\/(viewer|edit|view)(\?|$)/,'/maps/d/embed$2');
  return u.replace(/\/view(\?|$)/,'/embed$1').replace(/\/edit(\?|$)/,'/embed$1');
};

const getVideoEmbed = (url='') => {
  const u = url.trim();
  const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  if (yt?.[1]) return `https://www.youtube.com/embed/${yt[1]}`;
  const vim = u.match(/vimeo\.com\/(\d+)/);
  if (vim?.[1]) return `https://player.vimeo.com/video/${vim[1]}`;
  return u;
};

/* Map activity type/title → icon + color */
const getActivityIcon = (type='', title='') => {
  const t = (type+' '+title).toLowerCase();
  if (t.includes('transport')||t.includes('bus')||t.includes('voiture')||t.includes('départ')||t.includes('retour'))
    return { icon:'mdi:bus-side', bg:'bg-orange-100', color:'text-orange-600' };
  if (t.includes('visite')||t.includes('historique')||t.includes('monument')||t.includes('musée')||t.includes('site'))
    return { icon:'mdi:bank-outline', bg:'bg-blue-100', color:'text-blue-600' };
  if (t.includes('repas')||t.includes('déjeuner')||t.includes('dîner')||t.includes('diner')||t.includes('café')||t.includes('restaurant'))
    return { icon:'mdi:silverware-fork-knife', bg:'bg-green-100', color:'text-green-600' };
  if (t.includes('balade')||t.includes('promenade')||t.includes('libre'))
    return { icon:'mdi:walk', bg:'bg-purple-100', color:'text-purple-600' };
  if (t.includes('photo'))
    return { icon:'mdi:camera-outline', bg:'bg-pink-100', color:'text-pink-600' };
  if (t.includes('plage')||t.includes('mer')||t.includes('beach'))
    return { icon:'mdi:beach', bg:'bg-cyan-100', color:'text-cyan-600' };
  return { icon:'mdi:map-marker-outline', bg:'bg-orange-50', color:'text-orange-500' };
};

const typeLabels = {
  DAY_TRIP:'Sortie 1 journée', EVENING:'Soirée', WEEKEND:'Weekend',
  MULTI_DAY_CIRCUIT:'Circuit plusieurs jours', EXCURSION:'Excursion',
  EVENT:'Événement', CUSTOM:'Sur mesure',
};

/* ─────────────────────────────────────────────
   GALLERY — main image + thumbnail strip
───────────────────────────────────────────── */
const Gallery = ({ images }) => {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
        <motion.div key={active} initial={{opacity:0.8}} animate={{opacity:1}} transition={{duration:0.25}} className="absolute inset-0">
          <Image src={images[active]} alt="Vue" fill className="object-cover" priority />
        </motion.div>
        {images.length > 1 && (
          <>
            <button onClick={()=>setActive(i=>(i-1+images.length)%images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow z-10 transition-all">
              <Icon icon="mdi:chevron-left" className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={()=>setActive(i=>(i+1)%images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow z-10 transition-all">
              <Icon icon="mdi:chevron-right" className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}
      </div>
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {images.map((img, idx) => (
            <div key={idx} onClick={()=>setActive(idx)}
              className={`relative w-[90px] h-[60px] shrink-0 rounded-xl overflow-hidden cursor-pointer transition-all border-2 ${active===idx ? 'border-[#FF5E14] opacity-100' : 'border-transparent opacity-55 hover:opacity-80'}`}>
              <Image src={img} alt={`vue ${idx+1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   POINTS FORTS — horizontal pill row
───────────────────────────────────────────── */
const PointsForts = ({ highlights }) => {
  if (!Array.isArray(highlights) || !highlights.length) return null;
  return (
    <section>
      <h2 className="text-lg font-bold text-[#1a2e4a] mb-1">Points forts</h2>
      <div className="w-10 h-[3px] bg-[#FF5E14] rounded-full mb-4" />
      <div className="flex flex-wrap gap-2">
        {highlights.map((h, i) => (
          <div key={i} className="flex items-center gap-2.5 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-sm">
            <Icon icon="mdi:star-four-points" className="w-4 h-4 text-[#FF5E14] shrink-0" />
            <span className="text-sm font-semibold text-[#1a2e4a]">{h}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   PROGRAMME DE LA JOURNÉE — activities timeline
───────────────────────────────────────────── */
const ProgrammeTimeline = ({ daysDetails }) => {
  if (!Array.isArray(daysDetails) || !daysDetails.length) return null;

  return (
    <section>
      <h2 className="text-lg font-bold text-[#1a2e4a] mb-1">Programme de la journée</h2>
      <div className="w-10 h-[3px] bg-[#FF5E14] rounded-full mb-5" />

      {daysDetails.map((day, di) => {
        const activities = Array.isArray(day.activities) ? day.activities : [];
        return (
          <div key={day.id||di} className="mb-8">
            {/* Multi-day label */}
            {daysDetails.length > 1 && (
              <p className="text-sm font-bold text-[#FF5E14] uppercase tracking-wide mb-3">
                Jour {day.dayNumber||di+1}{day.title ? ` — ${day.title}` : ''}
              </p>
            )}
            {day.route && (
              <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-3">
                <Icon icon="mdi:map-marker-path" className="text-[#FF5E14] shrink-0 w-4 h-4" />{day.route}
              </p>
            )}
            {day.summary && !activities.length && (
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{day.summary}</p>
            )}

            {activities.length > 0 && (
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-[18px] top-5 bottom-5 w-[2px] bg-gray-200 z-0" />
                <div className="space-y-0">
                  {activities.map((act, ai) => {
                    const { icon, bg, color } = getActivityIcon(act.type||'', act.title||'');
                    return (
                      <div key={act.id||ai} className="relative flex items-start gap-4 pb-5 last:pb-0">
                        {/* Colored icon circle */}
                        <div className={`relative z-10 w-9 h-9 rounded-full ${bg} border-2 border-white flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon icon={icon} className={`w-4.5 h-4.5 ${color}`} />
                        </div>
                        {/* Text */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            {act.time && (
                              <span className="text-sm font-black text-[#1a2e4a] shrink-0">{act.time}</span>
                            )}
                            <span className="text-sm font-bold text-[#1a2e4a]">{act.title}</span>
                          </div>
                          {act.description && (
                            <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{act.description}</p>
                          )}
                          {act.location && (
                            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <Icon icon="mdi:map-marker-outline" className="w-3 h-3" />{act.location}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Meals/hotel info chips */}
            {(day.hotel || (Array.isArray(day.meals) && day.meals.length > 0)) && (
              <div className="flex flex-wrap gap-2 mt-3 pl-12">
                {day.hotel && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                    <Icon icon="mdi:bed-outline" className="w-3.5 h-3.5" />Hébergement : {day.hotel}
                  </span>
                )}
                {Array.isArray(day.meals) && day.meals.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-lg">
                    <Icon icon="mdi:food-outline" className="w-3.5 h-3.5" />Repas : {day.meals.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
};

/* ─────────────────────────────────────────────
   GALERIE PHOTOS section
───────────────────────────────────────────── */
const GalerieSection = ({ images }) => {
  if (!images || images.length < 2) return null;
  const display = images.slice(0, 5);
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-[#1a2e4a]">Galerie photos</h2>
        <span className="text-sm font-semibold text-[#FF5E14] flex items-center gap-1 cursor-pointer hover:underline">
          Voir toutes les photos <Icon icon="mdi:arrow-expand-all" className="w-4 h-4" />
        </span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {display.map((img, i) => (
          <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
            <Image src={img} alt={`photo ${i+1}`} fill className="object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" />
          </div>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   POINT DE RENCONTRE + MAP row
───────────────────────────────────────────── */
const MeetingPointAndMap = ({ meetingPoint, mapSrc }) => {
  if (!meetingPoint && !mapSrc) return null;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`grid ${meetingPoint && mapSrc ? 'md:grid-cols-[1fr_1.6fr]' : 'grid-cols-1'}`}>
        {meetingPoint && (
          <div className="p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-[#FF5E14]" />
              <h3 className="font-bold text-[#1a2e4a] text-base">Point de rencontre</h3>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Le point de rencontre vous sera communiqué lors de la confirmation de votre réservation.
            </p>
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl p-3">
              <Icon icon="mdi:office-building-outline" className="w-4 h-4 text-[#FF5E14] shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-[#1a2e4a]">{meetingPoint}</p>
            </div>
            {mapSrc && (
              <button onClick={() => document.getElementById('map-embed')?.scrollIntoView({behavior:'smooth'})}
                className="flex items-center gap-2 border border-[#FF5E14] text-[#FF5E14] text-xs font-bold px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors self-start mt-1">
                <Icon icon="mdi:map-outline" className="w-4 h-4" />Afficher sur la carte
              </button>
            )}
          </div>
        )}
        {mapSrc && (
          <div id="map-embed" className="relative h-[220px] md:h-full min-h-[200px] overflow-hidden">
            <iframe src={mapSrc} width="100%"
              style={{border:0, position:'absolute', left:0, top:'-56px', width:'100%', height:'calc(100% + 56px)'}}
              allowFullScreen loading="lazy" title="Carte point de rencontre" />
          </div>
        )}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   VIDEO section (standalone)
───────────────────────────────────────────── */
const VideoSection = ({ videoUrl }) => {
  if (!videoUrl) return null;
  const src = getVideoEmbed(videoUrl);
  if (!src) return null;
  return (
    <section>
      <h2 className="text-lg font-bold text-[#1a2e4a] mb-3">Vidéo de présentation</h2>
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-900 shadow-sm">
        <iframe src={src} className="w-full h-full border-0" allowFullScreen loading="lazy" title="Présentation" />
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   HOTELS
───────────────────────────────────────────── */
const StarRating = ({ stars }) => {
  const n = Math.min(5, Math.max(0, Math.round(Number(stars)||0)));
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => <Icon key={i} icon="mdi:star" className={`w-4 h-4 ${i<=n?'text-amber-400':'text-gray-200'}`} />)}
    </span>
  );
};

const HotelsSection = ({ hotels }) => {
  if (!hotels?.length) return null;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Icon icon="mdi:bed-double-outline" className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">Hôtels &amp; Hébergements</h2>
          <p className="text-xs text-gray-500 mt-0.5">Les établissements prévus pour votre séjour.</p>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {hotels.map((hotel, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Icon icon="mdi:office-building-outline" className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{hotel.name}</p>
            </div>
            {hotel.stars > 0 && (
              <div className="flex items-center gap-1.5 shrink-0">
                <StarRating stars={hotel.stars} />
                <span className="text-xs text-gray-500">{hotel.stars} étoile{hotel.stars>1?'s':''}</span>
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
const GeneralConditions = ({ conditions }) => {
  const items = Array.isArray(conditions) ? conditions : [];
  if (!items.length) return null;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <Icon icon="mdi:file-document-outline" className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-base font-bold text-gray-900">Conditions générales</h2>
      </div>
      <div className="p-5 space-y-2.5">
        {items.map((item, i) => <p key={i} className="text-sm text-gray-600 leading-relaxed">{item}</p>)}
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   RELATED MINI CARDS
───────────────────────────────────────────── */
const MiniCard = ({ program }) => {
  const imgs = getImages(program);
  const typeLabel = typeLabels[program.type] || 'Programme';
  return (
    <Link href={`/circuits-en-tunisie/${program.slug||program.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <Image src={imgs[0]||'/voyage.jpg'} alt={program.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-3">
          <h4 className="font-bold text-gray-900 line-clamp-2 text-sm group-hover:text-[#FF5E14] transition-colors">{program.title}</h4>
          <p className="text-xs text-gray-400 mt-0.5">{typeLabel}</p>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-[10px] text-gray-400">À partir de</p>
              <p className="font-black text-[#FF5E14] text-base leading-tight">{Number(program.price||0).toLocaleString('fr-FR')} <span className="text-xs font-semibold">TND</span></p>
            </div>
            <p className="text-xs text-gray-400">{program.durationLabel||`${program.days} j`}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ─────────────────────────────────────────────
   SIDEBAR — price card + buttons + lists
───────────────────────────────────────────── */
const SidebarPriceCard = ({ program, formData, setFormData, onSubmit, loading, calculatePrice }) => {
  const [showForm, setShowForm] = useState(false);
  const total = typeof calculatePrice==='function' ? calculatePrice() : 0;
  const currency = program?.currency||'TND';
  const nights = Number(program?.nights ?? Math.max(Number(program?.days||1)-1, 0));
  const needsRoom = nights > 0 || ['WEEKEND','MULTI_DAY_CIRCUIT'].includes(program?.type);
  const typeLabel = typeLabels[program?.type] || 'Programme';
  const whatsappNum = normalizePhone(program?.whatsappNumber||program?.phone||'94849694').replace('+','');
  const waMsg = encodeURIComponent(`Bonjour, je souhaite réserver : ${program?.title}`);

  const onChange = e => {
    const {name,value} = e.target;
    setFormData(prev => ({...prev, [name]: name==='numberOfPersons' ? parseInt(value,10) : value}));
  };

  const inp = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-[#FF5E14]/20 focus:border-[#FF5E14] focus:bg-white outline-none transition-all";
  const lbl = "block text-[11px] font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Price + quick info */}
      <div className="px-5 pt-5 pb-4">
        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-[2.6rem] font-black text-[#FF5E14] leading-none tracking-tight">
            {Number(program?.price||0).toLocaleString('fr-FR')}
          </span>
          <span className="text-sm font-bold text-gray-500">{currency} / personne</span>
        </div>

        {/* Quick info rows */}
        <div className="space-y-2 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Icon icon="mdi:tag-outline" className="w-4 h-4 text-gray-400 shrink-0" />{typeLabel}
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Icon icon="mdi:account-outline" className="w-4 h-4 text-gray-400 shrink-0" />
            À partir de 1 personne
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Icon icon="mdi:check-circle-outline" className="w-4 h-4 text-gray-400 shrink-0" />
            Confirmation rapide
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        {/* CTA — toggle form */}
        <button
          type="button"
          onClick={() => setShowForm(v => !v)}
          className="w-full bg-[#FF5E14] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
        >
          Demander un devis <Icon icon="mdi:arrow-right" className="w-4 h-4" />
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${whatsappNum}?text=${waMsg}`}
          target="_blank" rel="noreferrer"
          className="w-full bg-[#25D366] hover:bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
        >
          <Icon icon="mdi:whatsapp" className="w-5 h-5" /> Réserver sur WhatsApp
        </a>

        {/* Phone */}
        <div className="flex items-center gap-3 pt-1">
          <div className="w-9 h-9 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Icon icon="mdi:phone-outline" className="w-4 h-4 text-[#FF5E14]" />
          </div>
          <div>
            <p className="text-[11px] text-gray-400">Besoin d&apos;aide ? Appelez-nous</p>
            <a href={`tel:${normalizePhone(program?.phone||'71802881')}`}
              className="text-sm font-bold text-[#1a2e4a] hover:text-[#FF5E14] transition-colors">
              {fmtPhone(program?.phone||'71802881')}
            </a>
          </div>
        </div>

        {/* Expandable reservation form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{height:0, opacity:0}}
              animate={{height:'auto', opacity:1}}
              exit={{height:0, opacity:0}}
              transition={{duration:0.3}}
              className="overflow-hidden"
            >
              <form onSubmit={onSubmit} className="space-y-3 pt-3 border-t border-gray-100">
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
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className={lbl}>Téléphone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={onChange} className={inp} placeholder="99 999 999" required />
                  </div>
                  <div>
                    <label className={lbl}>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={onChange} className={inp} placeholder="exemple@mail.com" />
                  </div>
                </div>
                <div>
                  <label className={lbl}>Nombre de personnes</label>
                  <select name="numberOfPersons" value={formData.numberOfPersons} onChange={onChange} className={`${inp} cursor-pointer`}>
                    {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} personne{n>1?'s':''}</option>)}
                  </select>
                </div>
                {needsRoom && (
                  <div>
                    <label className={lbl}>Type de chambre</label>
                    <select name="roomType" value={formData.roomType} onChange={onChange} className={`${inp} cursor-pointer`}>
                      <option value="double">Chambre double</option>
                      <option value="single">Chambre individuelle</option>
                      <option value="triple">Chambre triple</option>
                    </select>
                  </div>
                )}
                <div>
                  <label className={lbl}>Demandes spéciales (optionnel)</label>
                  <textarea name="specialRequests" value={formData.specialRequests} onChange={onChange}
                    rows={2} className={`${inp} resize-none`} placeholder="Allergies, préférences..." maxLength={200} />
                </div>
                {total > 0 && (
                  <div className="flex items-baseline justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <span className="text-xs text-gray-500">Total estimé</span>
                    <span className="font-black text-[#FF5E14] text-lg">{total.toLocaleString('fr-FR')} <span className="text-xs text-gray-400">{currency}</span></span>
                  </div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full bg-[#FF5E14] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>Envoi...</>
                    : <>Envoyer la demande <Icon icon="mdi:send" className="w-4 h-4"/></>}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   SIDEBAR INFO BLOCKS
───────────────────────────────────────────── */

/* Strip leading "- " and filter out section-header lines */
const cleanLines = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map(l => { const s = String(l||'').trim(); return s.startsWith('-') ? s.slice(1).trim() : s; })
    .filter(l => {
      if (!l) return false;
      const lc = l.toLowerCase();
      // Filter out lines that are just section headers typed by admin (e.g. "Inclus:", "Exclusions:")
      return !lc.match(/^(inclus|exclusion|non inclus|conditions?)s?\s*:?\s*$/);
    });

const SidebarInfoBlocks = ({ program }) => {
  const incClean  = cleanLines(program.includes);
  const excClean  = cleanLines(program.excludes);
  const payClean  = cleanLines(program.paymentConditions);
  const canClean  = cleanLines(program.cancellationTerms);

  const typeLabel = typeLabels[program.type] || 'Programme';
  const nights    = Number(program?.nights ?? Math.max(Number(program?.days||1)-1, 0));
  const duration  = program.durationLabel || (nights > 0
    ? `${program.days} jours / ${nights} nuits`
    : `${program.days} jour${program.days > 1 ? 's' : ''}`);

  // Only include info rows that have real data from the DB — nothing hardcoded
  const infoItems = [
    program.meetingPoint && { icon:'mdi:map-marker-outline',       label:'Point de départ',  value: program.meetingPoint },
    program.meetingPoint && { icon:'mdi:map-marker-check-outline',  label:'Lieu de retour',   value: program.meetingPoint },
    duration             && { icon:'mdi:clock-time-four-outline',   label:'Durée',            value: duration },
    typeLabel            && { icon:'mdi:tag-outline',               label:'Type',             value: typeLabel },
    program.location_from && !program.meetingPoint && { icon:'mdi:map-marker-outline', label:'Point de départ', value: program.location_from },
  ].filter(Boolean);

  return (
    <>
      {incClean.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-[#1a2e4a] text-sm">Inclus</h3>
          </div>
          <ul className="p-4 space-y-2">
            {incClean.map((line,i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Icon icon="mdi:check-circle" className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {excClean.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-red-500 text-sm">Non inclus</h3>
          </div>
          <ul className="p-4 space-y-2">
            {excClean.map((line,i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Icon icon="mdi:close-circle" className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {payClean.length > 0 && (
        <div className="bg-white rounded-2xl border border-blue-50 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-blue-50">
            <h3 className="font-bold text-blue-700 text-sm flex items-center gap-1.5">
              <Icon icon="mdi:credit-card-outline" className="w-4 h-4" /> Conditions de paiement
            </h3>
          </div>
          <ul className="p-4 space-y-2">
            {payClean.map((line,i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Icon icon="mdi:circle-small" className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {canClean.length > 0 && (
        <div className="bg-white rounded-2xl border border-orange-50 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-orange-50">
            <h3 className="font-bold text-orange-600 text-sm flex items-center gap-1.5">
              <Icon icon="mdi:alert-circle-outline" className="w-4 h-4" /> Conditions d&apos;annulation
            </h3>
          </div>
          <ul className="p-4 space-y-2">
            {canClean.map((line,i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                <Icon icon="mdi:circle-small" className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />{line}
              </li>
            ))}
          </ul>
        </div>
      )}

      {infoItems.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-[#1a2e4a] text-sm">Informations pratiques</h3>
          </div>
          <ul className="p-4 space-y-2.5">
            {infoItems.map((info,i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs">
                <Icon icon={info.icon} className="w-4 h-4 text-[#FF5E14] shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold text-gray-700">{info.label} : </span>
                  <span className="text-gray-500">{info.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function LocalCircuitDetailsPage() {
  const router = useRouter();
  const { id } = router.query;

  const [program, setProgram] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationLoading, setReservationLoading] = useState(false);
  const [showMobileSticky, setShowMobileSticky] = useState(true);
  const [formData, setFormData] = useState({
    firstName:'', lastName:'', email:'', phone:'',
    numberOfPersons:1, roomType:'double', specialRequests:'', tripId:'',
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const [progRes, allRes] = await Promise.all([
          fetch(`/api/locals?id=${id}`),
          fetch(`/api/locals?active=true`),
        ]);
        if (!progRes.ok) throw new Error('Programme introuvable');
        const data = await progRes.json();
        const allData = await allRes.json();
        setProgram({
          ...data,
          images: Array.isArray(data.images) ? data.images : [],
          daysDetails: Array.isArray(data.daysDetails) ? data.daysDetails : [],
          hotels: Array.isArray(data.hotels) ? data.hotels : [],
        });
        setFormData(prev => ({...prev, tripId: data.id}));
        if (Array.isArray(allData)) setRelated(allData.filter(item => item.id !== data.id).slice(0, 4));
      } catch(err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [id]);

  useEffect(() => {
    const handle = () => {
      const el = document.getElementById('form-mobile');
      if (el) setShowMobileSticky(el.getBoundingClientRect().top > window.innerHeight);
    };
    window.addEventListener('scroll', handle, {passive:true});
    return () => window.removeEventListener('scroll', handle);
  }, []);

  const calculatePrice = useCallback(() => {
    if (!program) return 0;
    const persons = Number(formData.numberOfPersons||1);
    let total = Number(program.price||0) * persons;
    if (formData.roomType==='single' && Number(program.singleAddonPrice||0)>0)
      total += Number(program.singleAddonPrice) * persons;
    return total;
  }, [program, formData]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!program) return;
    try {
      setReservationLoading(true);
      const res = await fetch('/api/program-reservation', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          tripId: program.id, tripTitle: program.title,
          tripLocation: `${program.location_from} → ${program.location_to}`,
          ...formData,
          preferredDate: fmtDateRange(program.from_date, program.to_date, program.isDateFlexible),
          totalPrice: calculatePrice(),
        }),
      });
      if (!res.ok) throw new Error();
      toast.success('Demande envoyée avec succès !');
      setFormData({firstName:'',lastName:'',email:'',phone:'',numberOfPersons:1,roomType:'double',specialRequests:'',tripId:program.id});
    } catch { toast.error("Erreur lors de l'envoi. Réessayez."); }
    finally { setReservationLoading(false); }
  };

  const handlePDF = async () => { try { await generateProgramPDF(program); } catch { window.print(); } };
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({title:program?.title, url:window.location.href});
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce programme est indisponible</h2>
          <Link href="/circuits-en-tunisie" className="text-[#FF5E14] font-medium hover:underline">
            Voir tous les programmes locaux
          </Link>
        </div>
      </div>
    </Layout>
  );

  const images     = getImages(program);
  const hotels     = Array.isArray(program.hotels) ? program.hotels : [];
  const timeline   = Array.isArray(program.daysDetails) ? program.daysDetails : [];
  const mapSrc     = normalizeMapUrl(program.mapEmbedUrl||'');
  const dateRange  = fmtDateRange(program.from_date, program.to_date, program.isDateFlexible);
  const typeLabel  = typeLabels[program.type] || 'Programme';
  const phone      = program.phone || '71802881';
  const whatsapp   = program.whatsappNumber || phone;
  const highlights = Array.isArray(program.highlights) ? program.highlights : [];
  const nights     = Number(program?.nights ?? Math.max(Number(program?.days||1)-1, 0));

  return (
    <Layout className="bg-gray-50 font-sans text-gray-900">
      <SEO
        title={`${program.title} | Circuits en Tunisie`}
        description={stripHtml(program.description).slice(0, 160)}
        image={images[0]}
      />

      <div className="min-h-screen pt-24 pb-20">
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-5 mt-4 flex-wrap">
            <Link href="/" className="hover:text-[#FF5E14] transition-colors">Accueil</Link>
            <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
            <Link href="/circuits-en-tunisie" className="hover:text-[#FF5E14] transition-colors">Programmes en Tunisie</Link>
            <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
            <span className="text-[#FF5E14] font-semibold">{typeLabel}s</span>
            <Icon icon="mdi:chevron-right" className="w-4 h-4 shrink-0" />
            <span className="text-gray-800 font-semibold truncate max-w-[200px]">{program.title}</span>
          </nav>

          {/* ═══ TOP SECTION: Title left, Sidebar right ═══ */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">

            {/* LEFT: Gallery + all main content */}
            <div className="w-full lg:w-[63%] xl:w-[65%] space-y-8">

              {/* Title + badges */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-[#1a2e4a] leading-tight mb-4">
                  {program.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm">
                    <Icon icon="mdi:calendar-blank" className="w-4 h-4 text-[#FF5E14]" />
                    {program.durationLabel || (nights > 0 ? `${program.days} jours / ${nights} nuits` : `${program.days} jour${program.days > 1 ? 's' : ''}`)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm">
                    <Icon icon="mdi:map-marker-outline" className="w-4 h-4 text-[#FF5E14]" />
                    {[program.location_from, program.location_to].filter(Boolean).join(', ')}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm">
                    <Icon icon="mdi:account-outline" className="w-4 h-4 text-[#FF5E14]" />
                    À partir de 1 personne
                  </span>
                  <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 shadow-sm">
                    <Icon icon="mdi:translate" className="w-4 h-4 text-[#FF5E14]" />
                    Guide francophone
                  </span>
                </div>
              </div>

              <Gallery images={images} />

              <PointsForts highlights={highlights} />

              {/* About */}
              {program.description && (
                <section>
                  <h2 className="text-lg font-bold text-[#1a2e4a] mb-1">À propos de cette sortie</h2>
                  <div className="w-10 h-[3px] bg-[#FF5E14] rounded-full mb-4" />
                  <div className="text-gray-600 leading-relaxed text-[15px] trip-rich-text"
                    dangerouslySetInnerHTML={{__html: program.description}} />
                </section>
              )}

              <ProgrammeTimeline daysDetails={timeline} />

              {images.length > 1 && <GalerieSection images={images} />}

              <MeetingPointAndMap meetingPoint={program.meetingPoint} mapSrc={mapSrc} />

              {program.videoUrl && <VideoSection videoUrl={program.videoUrl} />}

              <HotelsSection hotels={hotels} />
              <GeneralConditions conditions={program.generalConditions} />

              {/* Bottom CTA banner */}
              <section className="bg-[#1a2e4a] rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">
                      Besoin d&apos;aide pour organiser votre sortie ?
                    </h3>
                    <p className="text-white/60 text-sm mb-3">
                      Notre équipe est à votre écoute pour vous accompagner au mieux.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      {[
                        {icon:'mdi:lightning-bolt', label:'Réponse rapide'},
                        {icon:'mdi:receipt-outline', label:'Devis gratuit'},
                        {icon:'mdi:diamond-outline', label:'Conseils personnalisés'},
                      ].map((item, i) => (
                        <span key={i} className="flex items-center gap-1.5 text-white/70 text-xs font-semibold">
                          <Icon icon={item.icon} className="w-4 h-4 text-[#FF5E14]" />{item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5 shrink-0">
                    <div className="bg-white rounded-xl p-4 flex flex-col gap-2 min-w-[190px]">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contactez-nous</p>
                      <a href={`tel:${normalizePhone(phone)}`}
                        className="flex items-center gap-2 text-sm font-bold text-[#1a2e4a] hover:text-[#FF5E14] transition-colors">
                        <Icon icon="mdi:phone-outline" className="w-4 h-4 text-[#FF5E14]" />{fmtPhone(phone)}
                      </a>
                      {whatsapp && whatsapp !== phone && (
                        <a href={`https://wa.me/${normalizePhone(whatsapp).replace('+','')}`}
                          target="_blank" rel="noreferrer"
                          className="flex items-center gap-2 text-sm font-bold text-[#1a2e4a] hover:text-green-600 transition-colors">
                          <Icon icon="mdi:whatsapp" className="w-4 h-4 text-green-500" />{fmtPhone(whatsapp)}
                        </a>
                      )}
                    </div>
                    <a href="/contact"
                      className="bg-[#FF5E14] hover:bg-orange-600 text-white font-bold px-5 py-3 rounded-xl text-sm text-center transition-all">
                      Nous contacter
                    </a>
                  </div>
                </div>
              </section>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-5">
                    Autres sorties {program.days === 1 ? 'à la journée' : 'similaires'}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {related.map(rp => <MiniCard key={rp.id} program={rp} />)}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Sticky sidebar */}
            <aside className="w-full lg:w-[37%] xl:w-[35%]">
              <div className="sticky top-24 space-y-4">
                <SidebarPriceCard
                  program={program}
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                  loading={reservationLoading}
                  calculatePrice={calculatePrice}
                />

                <SidebarInfoBlocks program={program} />

                <div className="grid grid-cols-2 gap-2">
                  <button onClick={handlePDF}
                    className="bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 transition-colors">
                    <Icon icon="mdi:file-pdf-box" className="w-4 h-4" /> PDF
                  </button>
                  <button onClick={handleShare}
                    className="bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 transition-colors">
                    <Icon icon="mdi:share-variant" className="w-4 h-4" /> Partager
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </main>

        {/* Mobile form */}
        <div className="lg:hidden px-4 mt-12" id="form-mobile">
          <SidebarPriceCard
            program={program} formData={formData} setFormData={setFormData}
            onSubmit={handleSubmit} loading={reservationLoading} calculatePrice={calculatePrice}
          />
          <div className="mt-4 space-y-4">
            <SidebarInfoBlocks program={program} />
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <AnimatePresence>
        {showMobileSticky && (
          <motion.div initial={{y:100}} animate={{y:0}} exit={{y:100}}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 px-5 py-3 shadow-lg pb-safe">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Par personne</p>
                <p className="text-xl font-black text-[#FF5E14] leading-none">
                  {Number(program.price||0).toLocaleString('fr-FR')} <span className="text-xs font-bold text-gray-400">{program.currency||'TND'}</span>
                </p>
              </div>
              <button onClick={()=>document.getElementById('form-mobile')?.scrollIntoView({behavior:'smooth'})}
                className="bg-[#FF5E14] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-orange-600 transition-colors">
                Réserver
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden print:block font-sans text-black bg-white p-8">
        <h1 className="text-3xl font-bold mb-4">{program.title}</h1>
        <p className="text-lg mb-6">{dateRange}</p>
        <div dangerouslySetInnerHTML={{__html:program.description}} className="mb-8" />
      </div>

      <Toaster position="top-center" toastOptions={{style:{borderRadius:'1rem',background:'#1f2937',color:'#fff',fontSize:'14px'}}} />

      <style jsx global>{`
        .pb-safe { padding-bottom: max(0.75rem, env(safe-area-inset-bottom)); }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .trip-rich-text :where(p,ul,ol) { margin-top:0.6rem; margin-bottom:0.6rem; }
        .trip-rich-text :where(ul,ol) { padding-left:1.25rem; }
        .trip-rich-text :where(li) { margin-bottom:0.25rem; list-style-type:disc; }
        .trip-rich-text :where(h1,h2,h3,h4) { color:#1a2e4a; font-weight:700; margin-top:1.2rem; margin-bottom:0.5rem; }
        .trip-rich-text :where(a) { color:#FF5E14; font-weight:500; text-decoration:underline; }
      `}</style>
    </Layout>
  );
}
