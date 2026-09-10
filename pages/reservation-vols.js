'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { Layout } from 'components/Layout';
import SEO from 'components/SEO/SEO';

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

/* ─────────────────────────────────────────────
   AIRPORTS DATA
───────────────────────────────────────────── */
const AIRPORTS = [
  { name: 'Tunis-Carthage', code: 'TUN', country: 'Tunisie' },
  { name: 'Djerba-Zarzis', code: 'DJE', country: 'Tunisie' },
  { name: 'Monastir-Habib Bourguiba', code: 'MIR', country: 'Tunisie' },
  { name: 'Paris-Charles de Gaulle', code: 'CDG', country: 'France' },
  { name: 'Paris-Orly', code: 'ORY', country: 'France' },
  { name: 'Lyon-Saint-Exupéry', code: 'LYS', country: 'France' },
  { name: 'Londres-Heathrow', code: 'LHR', country: 'Royaume-Uni' },
  { name: 'Rome-Fiumicino', code: 'FCO', country: 'Italie' },
  { name: 'Madrid-Barajas', code: 'MAD', country: 'Espagne' },
  { name: 'Francfort', code: 'FRA', country: 'Allemagne' },
  { name: 'Dubaï International', code: 'DXB', country: 'Émirats Arabes Unis' },
  { name: 'Istanbul', code: 'IST', country: 'Turquie' },
  { name: 'Casablanca-Mohammed V', code: 'CMN', country: 'Maroc' },
  { name: 'Montréal-Trudeau', code: 'YUL', country: 'Canada' },
  { name: 'Doha-Hamad', code: 'DOH', country: 'Qatar' },
];

/* ─────────────────────────────────────────────
   AIRPORT AUTOCOMPLETE FIELD
───────────────────────────────────────────── */
const AirportField = ({ label, icon, value, onChange, placeholder }) => {
  const [suggestions, setSuggestions] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setSuggestions([]); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInput = e => {
    const v = e.target.value;
    onChange(v);
    if (v.length > 1) {
      setSuggestions(AIRPORTS.filter(a =>
        a.name.toLowerCase().includes(v.toLowerCase()) ||
        a.code.toLowerCase().includes(v.toLowerCase()) ||
        a.country.toLowerCase().includes(v.toLowerCase())
      ).slice(0, 6));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        <Icon icon={icon} className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
        <input
          type="text"
          required
          value={value}
          onChange={handleInput}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-xl pl-10 pr-4 py-3 focus:bg-white focus:border-[#FF5E14] focus:ring-2 focus:ring-[#FF5E14]/15 outline-none transition-all"
        />
      </div>
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 mt-1"
          >
            {suggestions.map((a, i) => (
              <div key={i}
                onClick={() => { onChange(`${a.name} (${a.code})`); setSuggestions([]); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
              >
                <Icon icon="mdi:map-marker-outline" className="w-4 h-4 text-[#FF5E14] shrink-0" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{a.name}</p>
                  <p className="text-xs text-gray-400">{a.country} · {a.code}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
   FLIGHT FORM
───────────────────────────────────────────── */
const FlightForm = () => {
  const [tripType, setTripType] = useState('round-trip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departure, setDeparture] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [classType, setClassType] = useState('economy');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const swapLocations = () => { const tmp = from; setFrom(to); setTo(tmp); };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await fetch('/api/ticketing-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, email, phone,
          departureCity: from, arrivalCity: to,
          departureDate: departure,
          returnDate: tripType === 'round-trip' ? returnDate : null,
          passengers, classType, specialRequests: '',
        }),
      });
      if (!res.ok) throw new Error('Une erreur est survenue. Veuillez réessayer.');
      setSuccess('Votre demande a été envoyée avec succès ! Notre équipe vous contactera sous 24h.');
      setFrom(''); setTo(''); setDeparture(''); setReturnDate('');
      setFirstName(''); setLastName(''); setEmail(''); setPhone('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'round-trip', label: 'Aller-Retour', icon: 'mdi:airplane-takeoff' },
    { id: 'one-way',    label: 'Aller Simple', icon: 'mdi:airplane' },
    { id: 'multi',      label: 'Multi-destinations', icon: 'mdi:directions-fork' },
  ];

  const classes = [
    { id: 'economy',  label: 'Économique',  icon: 'mdi:seat-recline-normal' },
    { id: 'premium',  label: 'Premium Eco', icon: 'mdi:seat-legroom-extra' },
    { id: 'business', label: 'Affaires',    icon: 'mdi:seat-flat' },
    { id: 'first',    label: 'Première',    icon: 'mdi:crown' },
  ];

  const inp = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm font-semibold rounded-xl px-4 py-3 focus:bg-white focus:border-[#FF5E14] focus:ring-2 focus:ring-[#FF5E14]/15 outline-none transition-all";

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.10)] border border-gray-100 overflow-visible">

      {/* Tab bar */}
      <div className="flex border-b border-gray-100">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTripType(tab.id)}
            className={`flex items-center gap-2 px-5 py-4 text-sm font-bold transition-all border-b-2 first:rounded-tl-3xl ${
              tripType === tab.id
                ? 'border-[#FF5E14] text-[#FF5E14] bg-orange-50/40'
                : 'border-transparent text-gray-400 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon icon={tab.icon} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">

        {/* Row 1: From / swap / To / Date aller / Date retour */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <AirportField
              label="Départ"
              icon="mdi:map-marker-outline"
              value={from}
              onChange={setFrom}
              placeholder="Ville ou aéroport de départ"
            />
            {/* Swap button between Départ and Arrivée */}
            <button
              type="button"
              onClick={swapLocations}
              className="absolute right-[-18px] top-[34px] z-10 w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:border-[#FF5E14] hover:text-[#FF5E14] transition-all hidden lg:flex"
            >
              <Icon icon="mdi:swap-horizontal" className="w-4 h-4" />
            </button>
          </div>

          <AirportField
            label="Arrivée"
            icon="mdi:map-marker-check-outline"
            value={to}
            onChange={setTo}
            placeholder="Ville ou aéroport d'arrivée"
          />

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Aller le</label>
            <div className="relative">
              <Icon icon="mdi:calendar-blank-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input type="date" required value={departure} min={today}
                onChange={e => setDeparture(e.target.value)}
                className={`${inp} pl-10 cursor-pointer`} />
            </div>
          </div>

          <div className={tripType !== 'round-trip' ? 'opacity-40 pointer-events-none' : ''}>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Retour le</label>
            <div className="relative">
              <Icon icon="mdi:calendar-blank-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input type="date" value={returnDate} min={departure || today}
                required={tripType === 'round-trip'}
                onChange={e => setReturnDate(e.target.value)}
                className={`${inp} pl-10 cursor-pointer`} />
            </div>
          </div>
        </div>

        {/* Row 2: Passagers + Classe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Passagers</label>
            <div className="relative">
              <Icon icon="mdi:account-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={passengers} onChange={e => setPassengers(Number(e.target.value))}
                className={`${inp} pl-10 pr-9 cursor-pointer appearance-none`}>
                {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n} passager{n>1?'s':''}</option>)}
              </select>
              <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Classe</label>
            <div className="relative">
              <Icon icon="mdi:seat-recline-normal" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <select value={classType} onChange={e => setClassType(e.target.value)}
                className={`${inp} pl-10 pr-9 cursor-pointer appearance-none`}>
                {classes.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Row 3: Contact principal */}
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="mdi:account-circle-outline" className="w-4 h-4 text-[#FF5E14]" />
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Contact principal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Icon icon="mdi:account-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                placeholder="Votre prénom" className={`${inp} pl-10`} />
            </div>
            <div className="relative">
              <Icon icon="mdi:account-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                placeholder="Votre nom de famille" className={`${inp} pl-10`} />
            </div>
            <div className="relative">
              <Icon icon="mdi:email-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com" className={`${inp} pl-10`} />
            </div>
            <div className="relative">
              <Icon icon="mdi:phone-outline" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="+216 XX XXX XXX" className={`${inp} pl-10`} />
            </div>
          </div>
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="bg-red-50 border border-red-100 text-red-600 text-sm font-semibold p-4 rounded-xl flex items-center gap-2">
              <Icon icon="mdi:alert-circle-outline" className="w-5 h-5 shrink-0" />{error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="bg-green-50 border border-green-200 text-green-700 text-sm font-semibold p-4 rounded-xl flex items-center gap-2">
              <Icon icon="mdi:check-circle-outline" className="w-5 h-5 shrink-0" />{success}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <div className="flex flex-col items-center gap-2">
          <button type="submit" disabled={loading}
            className="w-full bg-[#FF5E14] hover:bg-orange-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-md shadow-orange-500/20 disabled:opacity-60 text-base">
            {loading
              ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement...</>
              : <><Icon icon="mdi:airplane-takeoff" className="w-5 h-5" /> Demander mon devis</>}
          </button>
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Icon icon="mdi:lock-outline" className="w-3.5 h-3.5" />
            Vos informations sont protégées et ne seront jamais partagées.
          </p>
        </div>
      </form>
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function VolsPage() {

  const features = [
    {
      icon: 'mdi:tag-outline',
      bg: 'bg-orange-50', color: 'text-[#FF5E14]',
      title: 'Tarifs exclusifs',
      desc: 'Accédez à des tarifs négociés et des offres exclusives sur des centaines de compagnies.',
    },
    {
      icon: 'mdi:account-group-outline',
      bg: 'bg-blue-50', color: 'text-blue-600',
      title: 'Expertise humaine',
      desc: 'Nos conseillers experts vous accompagnent pour trouver le vol qui vous convient.',
    },
    {
      icon: 'mdi:shield-check-outline',
      bg: 'bg-green-50', color: 'text-green-600',
      title: 'Achat sécurisé',
      desc: 'Réservation 100% sécurisée et données personnelles protégées.',
    },
    {
      icon: 'mdi:calendar-check-outline',
      bg: 'bg-purple-50', color: 'text-purple-600',
      title: 'Flexibilité',
      desc: 'Des options flexibles et un service client réactif pour vous assister à tout moment.',
    },
  ];

  const partners = ['Tunisair', 'Air France', 'Lufthansa', 'Turkish Airlines', 'Emirates', 'Qatar Airways', 'Royal Air Maroc', 'Iberia'];

  return (
    <Layout className="bg-white font-sans">
      <SEO
        title="Réservation de Vols | Billetterie Batouta Voyages"
        description="Réservez vos vols simplement et rapidement avec Batouta Voyages. Accédez aux meilleurs tarifs parmi des centaines de compagnies aériennes."
      />

      {/* ═══ HERO ═══ */}
<section className="relative w-full overflow-hidden bg-white text-[#062B4F] pt-28">
  {/* Background image */}
  <div className="absolute inset-0 z-0">
    <Image
      src="/vols_banner.png"
      alt="Réservation de vols"
      fill
      priority
    />

    {/* Left white gradient */}
    {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/92 md:via-white/70 to-white/0" /> */}

    {/* Extra readable white block on left */}
    {/* <div className="absolute inset-y-0 left-0 w-[56%] bg-white/30" /> */}

    {/* Bottom fade */}
    <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent" />
  </div>

  {/* Content */}
  <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="min-h-[420px] flex items-start pt-12 pb-24">
      <div className="max-w-[660px]">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-blue-100 shadow-sm text-[#1687E8] text-[11px] font-black tracking-widest uppercase mb-5">
          <Icon icon="mdi:airplane" className="w-4 h-4 text-[#FF5E14]" />
          RÉSERVATION DE VOLS
        </div>

        {/* Title */}
        <h1 className="text-[38px] md:text-[48px] lg:text-[54px] font-black leading-[1.08] tracking-tight text-[#062B4F] mb-5">
          Réservez vos vols
          <br />
          <span className="text-[#FF5E14] whitespace-nowrap">
            simplement, rapidement
          </span>
          <br />
          et en toute confiance.
        </h1>

        {/* Subtitle */}
        <p className="text-[14px] md:text-[15px] text-[#062B4F]/80 font-semibold leading-[1.75] max-w-[570px] mb-7">
          Accédez aux meilleurs tarifs parmi des centaines de compagnies
          aériennes. Notre équipe vous accompagne à chaque étape.
        </p>

        {/* Benefits */}
        <div className="flex items-start gap-10 max-w-[640px]">
          {[
            {
              icon: "mdi:tag-outline",
              title: "Meilleurs tarifs",
              desc: "garantis",
              color: "text-[#FF5E14]",
            },
            {
              icon: "mdi:lock-check-outline",
              title: "Réservation",
              desc: "sécurisée",
              color: "text-[#1687E8]",
            },
            {
              icon: "mdi:headset",
              title: "Assistance dédiée",
              desc: "24h/7j",
              color: "text-[#00A676]",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 min-w-[150px]">
              <div className="w-11 h-11 rounded-full bg-white shadow-md border border-blue-50 flex items-center justify-center shrink-0">
                <Icon icon={item.icon} className={`w-6 h-6 ${item.color}`} />
              </div>

              <div className="leading-none">
                <h4 className="text-[12px] font-black text-[#062B4F] leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#062B4F]/70 font-semibold leading-snug mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>



      {/* ═══ FORM CARD — overlapping hero ═══ */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-16">
        <FlightForm />
      </section>

      {/* ═══ POURQUOI NOUS CHOISIR ═══ */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-[#FF5E14]" />
            <span className="text-[#FF5E14] text-xs font-black uppercase tracking-widest">Pourquoi nous choisir</span>
            <div className="h-px w-12 bg-[#FF5E14]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#1a2e4a] text-center mb-12">
            Voyagez mieux avec <span className="text-[#FF5E14]">Batouta Voyages</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon icon={f.icon} className={`w-7 h-7 ${f.color}`} />
                </div>
                <h3 className="font-bold text-[#1a2e4a] text-base mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPAGNIES PARTENAIRES ═══ */}
      <section className="py-8 bg-white border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Icon icon="mdi:airplane" className="w-4 h-4 text-[#FF5E14]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Nos compagnies partenaires</span>
          </div>
          <div className="flex flex-wrap items-center gap-0 sm:gap-4 justify-center">
            {partners.map((name, i) => (
              <React.Fragment key={name}>
                <span className="text-sm font-bold text-gray-700 hover:text-[#FF5E14] transition-colors cursor-default px-4 py-1">{name}</span>
                {i < partners.length - 1 && <span className="text-gray-300">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT CTA ═══ */}
      <section className="py-0 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-[#0B2D4D] rounded-3xl overflow-hidden flex flex-col lg:flex-row min-h-[280px]">
            {/* Left image */}
            <div className="relative w-full lg:w-[55%] min-h-[200px] lg:min-h-0 shrink-0">
              <Image
                src="/outgoing.webp"
                alt="Assistance Batouta"
                fill
                className="object-cover object-center"
              />
              {/* <div className="absolute inset-0 bg-[#0B2D4D]/30" /> */}
            </div>

            {/* Right content */}
            <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4">
                <Icon icon="mdi:headset" className="w-5 h-5 text-[#FF5E14]" />
                <span className="text-[#FF5E14] text-xs font-black uppercase tracking-widest">Besoin d&apos;aide pour réserver ?</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                Notre équipe est à votre écoute
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-lg">
                Contactez nos conseillers pour un accompagnement personnalisé et des conseils adaptés à vos besoins de voyage.
              </p>

              {/* Contact row */}
              <div className="flex flex-wrap gap-4 mb-6">
                <a href="tel:+21671802881" className="flex items-center gap-2 text-white font-bold text-sm hover:text-[#FF5E14] transition-colors">
                  <Icon icon="mdi:phone-outline" className="w-4 h-4 text-[#FF5E14] shrink-0" />+216 71 80 28 81
                </a>
                <a href="https://wa.me/21698341193" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white font-bold text-sm hover:text-green-400 transition-colors">
                  <Icon icon="mdi:whatsapp" className="w-4 h-4 text-green-400 shrink-0" />+216 98 34 11 93
                </a>
                <a href="mailto:ticketing@batouta.com" className="flex items-center gap-2 text-white font-bold text-sm hover:text-[#FF5E14] transition-colors">
                  <Icon icon="mdi:email-outline" className="w-4 h-4 text-[#FF5E14] shrink-0" />ticketing@batouta.com
                </a>
              </div>

              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-[#FF5E14] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all self-start shadow-md">
                Contactez-nous maintenant <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
          
      <style jsx global>{`
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
      `}</style>
    </Layout>
  );
}
