/**
 * HeroWithSearch — v2
 *
 * POSITIONING FIX (50/50 floating widget):
 * ─────────────────────────────────────────
 * The key mistake was `overflow-hidden` on the inner hero image div,
 * which clipped the absolutely-positioned widget.
 *
 * Correct structure:
 *   <section style="relative, NO overflow-hidden">        ← outer, positions widget
 *     <div style="image + gradients, overflow-hidden">    ← inner, safe to clip
 *       hero content (headline, buttons)
 *     </div>
 *     <div style="absolute bottom-0 translate-y-1/2">     ← widget, half below
 *       search card
 *     </div>
 *   </section>
 *
 * Then in HomePage, TrustBar (or whatever follows) needs:
 *   className="... pt-[half-widget-height]"
 * The search widget is ~140px tall (tabs ~52px + fields row ~80px + padding ~8px).
 * So half = ~70px → use `pt-[72px]` on TrustBar (or wrap in a spacer div).
 *
 * INTERACTIVE FIELDS:
 * ────────────────────
 * - Destination: text search with suggestions popover
 * - Date: month grid picker with year navigation
 * - Voyageurs: adult / child / infant counters
 * All close on outside click.
 */

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── helpers ── */
const MONTHS_FR = [
  'Janvier','Février','Mars','Avril','Mai','Juin',
  'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
];

function useClickOutside(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', fn);
    document.addEventListener('touchstart', fn);
    return () => { document.removeEventListener('mousedown', fn); document.removeEventListener('touchstart', fn); };
  }, [ref, handler]);
}

const Popover = ({ open, children, className = '' }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.15 }}
        className={`absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-slate-100 ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Destination ── */
const DestinationField = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const suggestions = ['Istanbul','Dubaï','Santorin','Marrakech','Rome','Maldives','Paris','Barcelone','Bali','Tokyo'];
  const filtered = value
    ? suggestions.filter(s => s.toLowerCase().includes(value.toLowerCase()))
    : suggestions;

  return (
    <div ref={ref} className="relative h-16">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:border-[#FF5E14]/40 focus-within:border-[#FF5E14]/60 transition-colors h-16 w-full text-left"
      >
        <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
        <div className="min-w-0 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Destination</p>
          <p className={`text-xs md:text-[13px] font-black leading-tight truncate ${value ? 'text-[#0B2D4D]' : 'text-slate-400'}`}>
            {value || 'Où voulez-vous aller ?'}
          </p>
        </div>
      </button>

      <Popover open={open} className="w-72">
        <div className="p-3">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-200 mb-2">
            <Icon icon="mdi:magnify" className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              autoFocus
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder="Rechercher une destination…"
              className="flex-1 bg-transparent text-sm font-semibold text-[#0B2D4D] placeholder:text-slate-400 outline-none"
            />
            {value && (
              <button onClick={() => onChange('')}>
                <Icon icon="mdi:close-circle" className="w-4 h-4 text-slate-300 hover:text-slate-500" />
              </button>
            )}
          </div>
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 mb-1.5">
            {value ? 'Résultats' : 'Destinations populaires'}
          </p>
          <div className="space-y-0.5 max-h-52 overflow-y-auto">
            {filtered.length === 0
              ? <p className="text-xs text-slate-400 px-2 py-2">Aucune destination trouvée</p>
              : filtered.map(s => (
                <button
                  key={s}
                  onClick={() => { onChange(s); setOpen(false); }}
                  className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-slate-50 text-left group"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#FF5E14]/10 flex items-center justify-center shrink-0">
                    <Icon icon="mdi:map-marker" className="w-3.5 h-3.5 text-[#FF5E14]" />
                  </div>
                  <span className="text-sm font-extrabold text-[#0B2D4D] group-hover:text-[#FF5E14] transition-colors">{s}</span>
                </button>
              ))
            }
          </div>
        </div>
      </Popover>
    </div>
  );
};

/* ── Date ── */
const DateField = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const label = value ? `${MONTHS_FR[value.month]} ${value.year}` : 'Choisissez vos dates';

  return (
    <div ref={ref} className="relative h-16">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:border-[#FF5E14]/40 transition-colors h-16 w-full text-left"
      >
        <Icon icon="mdi:calendar-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
        <div className="min-w-0 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Date</p>
          <p className={`text-xs md:text-[13px] font-black leading-tight truncate ${value ? 'text-[#0B2D4D]' : 'text-slate-400'}`}>
            {label}
          </p>
        </div>
      </button>

      <Popover open={open} className="w-72">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setYear(y => y - 1)}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <Icon icon="mdi:chevron-left" className="w-5 h-5 text-slate-600" />
            </button>
            <span className="text-sm font-black text-[#0B2D4D]">{year}</span>
            <button
              onClick={() => setYear(y => y + 1)}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <Icon icon="mdi:chevron-right" className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS_FR.map((m, i) => {
              const selected = value && value.month === i && value.year === year;
              const isPast = year < today.getFullYear() || (year === today.getFullYear() && i < today.getMonth());
              return (
                <button
                  key={m}
                  disabled={isPast}
                  onClick={() => { onChange({ month: i, year }); setOpen(false); }}
                  className={`py-2 rounded-xl text-[11px] font-extrabold transition-all ${
                    selected ? 'bg-[#FF5E14] text-white shadow-sm'
                    : isPast  ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-600 hover:bg-[#FF5E14]/10 hover:text-[#FF5E14]'
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              );
            })}
          </div>
          {value && (
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="mt-3 w-full text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Effacer la date
            </button>
          )}
        </div>
      </Popover>
    </div>
  );
};

/* ── Voyageurs ── */
const VoyageursField = ({ adults, kids, infants, setAdults, setKids, setInfants }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  const total = adults + kids + infants;
  const label = `${total} voyageur${total > 1 ? 's' : ''}`;

  const Counter = ({ label: lbl, sub, value, onDec, onInc, min = 0 }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-sm font-extrabold text-[#0B2D4D]">{lbl}</p>
        <p className="text-[11px] text-slate-400 font-medium">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onDec} disabled={value <= min}
          className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#FF5E14] hover:text-[#FF5E14] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="mdi:minus" className="w-4 h-4" />
        </button>
        <span className="w-5 text-center text-sm font-black text-[#0B2D4D]">{value}</span>
        <button
          onClick={onInc} disabled={total >= 12}
          className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:border-[#FF5E14] hover:text-[#FF5E14] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <Icon icon="mdi:plus" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={ref} className="relative h-16">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 hover:border-[#FF5E14]/40 transition-colors h-16 w-full text-left"
      >
        <Icon icon="mdi:account-group-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
        <div className="min-w-0 flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Voyageurs</p>
          <p className="text-xs md:text-[13px] font-black text-[#0B2D4D] leading-tight">{label}</p>
        </div>
      </button>

      <Popover open={open} className="w-72">
        <div className="p-4">
          <Counter label="Adultes"  sub="18 ans et plus"   value={adults}  min={1} onDec={() => setAdults(a  => Math.max(1, a - 1))} onInc={() => setAdults(a  => a + 1)} />
          <Counter label="Enfants"  sub="2 – 17 ans"       value={kids}    min={0} onDec={() => setKids(k    => Math.max(0, k - 1))} onInc={() => setKids(k    => k + 1)} />
          <Counter label="Bébés"    sub="Moins de 2 ans"   value={infants} min={0} onDec={() => setInfants(i => Math.max(0, i - 1))} onInc={() => setInfants(i => i + 1)} />
          <button
            onClick={() => setOpen(false)}
            className="mt-3 w-full py-2.5 bg-[#0B2D4D] text-white rounded-xl text-xs font-extrabold hover:bg-[#071e33] transition-colors"
          >
            Confirmer
          </button>
        </div>
      </Popover>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
const HeroWithSearch = () => {
  const [activeTab, setActiveTab] = useState('organized');
  const [destination, setDestination] = useState('');
  const [date, setDate]               = useState(null);
  const [adults, setAdults]           = useState(2);
  const [kids, setKids]               = useState(0);
  const [infants, setInfants]         = useState(0);

  const tabs = [
    { id: 'organized', label: 'Voyages Organisés',     icon: 'mdi:map-check-outline', href: '/programs'              },
    { id: 'local',     label: 'Programmes en Tunisie', icon: 'mdi:home-city-outline', href: '/programmes-en-tunisie' },
    { id: 'flights',   label: 'Vols',                  icon: 'mdi:airplane',          href: '/reservation-vols'      },
    { id: 'custom',    label: 'Demande sur-mesure',            icon: 'mdi:map-edit-outline',  href: '/#contact'              },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);
  const isCustom = activeTab === 'custom';

  const buildSearchHref = () => {
    const base = activeTabData?.href || '/programs';
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (date) params.set('month', `${date.year}-${String(date.month + 1).padStart(2, '0')}`);
    params.set('adults', adults);
    if (kids > 0) params.set('children', kids);
    if (infants > 0) params.set('infants', infants);
    const qs = params.toString();
    return qs ? `${base}?${qs}` : base;
  };

  return (
    /*
     * CRITICAL: This outer <section> must be `relative` and must NOT have
     * `overflow-hidden` — that's what was clipping the widget before.
     * The overflow-hidden lives only on the inner image div.
     */
    <section className="relative w-full">

      {/* ── Hero banner (image + content) — overflow-hidden is safe here ── */}
      <div className="relative min-h-[540px] md:min-h-[620px] flex flex-col justify-center overflow-hidden pb-16">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/home_banner.png"
            fill
            alt="Découvrez la Tunisie"
            className="object-cover object-center"
            priority
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" /> */}
          {/* <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-white/20" /> */}
        </div>

        {/* Headline + CTA buttons */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-xl text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#FF5E14]/10 text-[#FF5E14] text-[11px] font-black tracking-[0.12em] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5E14]" />
              Agence de voyage en Tunisie
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0B2D4D] leading-[1.1] mb-5">
              Voyagez mieux,
              <br />
              <span className="text-[#FF5E14]">vivez plus.</span>
            </h1>

            <p className="text-sm md:text-base text-slate-600 font-semibold leading-relaxed mb-8 max-w-md">
              Des expériences uniques, des destinations inoubliables et un accompagnement sur mesure. En Tunisie et partout dans le monde.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/programs"
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#FF5E14] hover:bg-[#e04f0f] text-white rounded-xl font-extrabold text-sm transition-all shadow-md shadow-[#FF5E14]/20 group"
              >
                Découvrir nos voyages
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Icon icon="mdi:arrow-right" className="w-3.5 h-3.5 text-white transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-800 rounded-xl font-extrabold text-sm border border-slate-200 hover:border-[#FF5E14] hover:text-[#FF5E14] transition-colors shadow-sm"
              >
                Demander un devis
                <Icon icon="mdi:file-document-outline" className="w-4 h-4 text-slate-500" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/*
       * ── Floating Search Widget ──────────────────────────────────────────
       *
       * Positioned on the OUTER section (which has no overflow-hidden),
       * so it is never clipped.
       *
       * `absolute bottom-0`  → anchors to the bottom of the outer section
       * `translate-y-1/2`    → shifts down by exactly half its own height
       * → Result: top half over the hero image, bottom half over white bg = perfect 50/50
       *
       * The outer section has no explicit height — it wraps the hero div
       * which has min-h-[540px/620px]. bottom-0 resolves to the bottom
       * of that hero div since it's the only child, which is correct.
       */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-30 w-full max-w-5xl px-4">
        <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-slate-100">
          {/* Tabs */}
          <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-xs font-black whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'text-[#FF5E14] border-[#FF5E14] bg-white'
                    : 'text-slate-500 border-transparent hover:text-slate-800'
                }`}
              >
                <Icon icon={tab.icon} className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#FF5E14]' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Fields row */}
          <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-white rounded-b-2xl">
            {!isCustom ? (
              <>
                <DestinationField value={destination} onChange={setDestination} />
                <DateField value={date} onChange={setDate} />
                <VoyageursField
                  adults={adults} kids={kids} infants={infants}
                  setAdults={setAdults} setKids={setKids} setInfants={setInfants}
                />
                <Link
                  href={buildSearchHref()}
                  className="flex items-center justify-center gap-2 bg-[#FF5E14] hover:bg-[#e04f0f] text-white rounded-xl px-5 h-16 font-extrabold text-sm transition-all shadow-sm"
                >
                  <Icon icon="mdi:magnify" className="w-5 h-5" />
                  Rechercher
                </Link>
              </>
            ) : (
              <>
                <div className="md:col-span-3 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100 h-16">
                  <Icon icon="mdi:map-edit-outline" className="w-5 h-5 text-[#FF5E14] shrink-0" />
                  <div className="min-w-0 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider leading-none mb-1">Demande sur-mesure</p>
                    <p className="text-xs md:text-[13px] font-black text-[#0B2D4D] leading-tight truncate">Contactez nos conseillers pour vous orienter...</p>
                  </div>
                </div>
                <Link
                  href="/#contact"
                  className="flex items-center justify-center gap-2 bg-[#0B2D4D] hover:bg-[#071e33] text-white rounded-xl px-5 h-16 font-extrabold text-sm transition-all shadow-sm"
                >
                  <Icon icon="mdi:send" className="w-5 h-5" />
                  Nous contacter
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroWithSearch;
