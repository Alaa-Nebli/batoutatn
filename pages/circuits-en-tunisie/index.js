"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from "next/link";
import { Icon } from "@iconify/react";

import { Layout } from "components/Layout";
import SEO from "components/SEO/SEO";
import ContactSection from '../../components/Contact/ContactUs';

export async function getStaticProps({ locale }) {
  return { props: { ...(await serverSideTranslations(locale, ['common'])) } };
}

const ITEMS_PER_PAGE = 9;

const stripHtml = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const getImageUrl = (images, fallback = '/voyage.jpg') => {
  if (!Array.isArray(images) || !images.length) return fallback;
  const f = images[0];
  if (typeof f === 'string') return f;
  if (f?.url) return f.url;
  return fallback;
};

const fmtDate = (from, to, flexible) => {
  if (flexible) return 'Date flexible';
  if (!from) return '';
  const s = new Date(from);
  if (Number.isNaN(s.getTime())) return '';
  const opts = { day: 'numeric', month: 'short' };
  if (!to) return s.toLocaleDateString('fr-FR', opts);
  const e = new Date(to);
  if (Number.isNaN(e.getTime())) return s.toLocaleDateString('fr-FR', opts);
  return `${s.toLocaleDateString('fr-FR', opts)} – ${e.toLocaleDateString('fr-FR', { ...opts, year: 'numeric' })}`;
};

const typeLabels = {
  DAY_TRIP: '1 Jour', EVENING: 'Soirée', WEEKEND: 'Weekend',
  MULTI_DAY_CIRCUIT: 'Multi-jours', EXCURSION: 'Excursion',
  EVENT: 'Événement', CUSTOM: 'Sur mesure',
};
const typeBadgeColor = {
  DAY_TRIP: 'bg-[#FF5E14] text-white',
  MULTI_DAY_CIRCUIT: 'bg-blue-600 text-white',
  WEEKEND: 'bg-purple-600 text-white',
  EVENT: 'bg-amber-500 text-white',
  EXCURSION: 'bg-teal-600 text-white',
  EVENING: 'bg-indigo-600 text-white',
  CUSTOM: 'bg-gray-600 text-white',
};

const SkeletonCard = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl overflow-hidden flex">
        <div className="bg-gray-200 w-[280px] shrink-0" />
        <div className="p-5 flex-1 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="h-3 bg-gray-200 rounded w-2/3" />
          <div className="flex justify-end mt-4">
            <div className="h-10 bg-gray-200 rounded-xl w-32" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default function LocalProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState({ all: true });
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [budgetLimit, setBudgetLimit] = useState(999999);
  const [sortBy, setSortBy] = useState('date-asc');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/locals?active=true');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPrograms(Array.isArray(data) ? data : []);
      } catch { setPrograms([]); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const availableTypes = useMemo(() => [...new Set(programs.map(p => p.type).filter(Boolean))], [programs]);
  const availableRegions = useMemo(() => [...new Set(programs.map(p => p.location_to).filter(Boolean))], [programs]);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => {
      if (type === 'all') return { all: true };
      const next = { ...prev, all: false, [type]: !prev[type] };
      const active = Object.keys(next).filter(k => k !== 'all' && next[k]);
      if (!active.length) return { all: true };
      return next;
    });
  };

  const handleReset = () => {
    setSearchQuery(''); setSelectedMonth(''); setSelectedDuration('all');
    setSelectedTypes({ all: true }); setSelectedRegion('all');
    setBudgetLimit(999999); setSortBy('date-asc'); setCurrentPage(1);
  };

  const toggleFav = (id, e) => { e.preventDefault(); e.stopPropagation(); setFavorites(p => ({ ...p, [id]: !p[id] })); };

  const filtered = useMemo(() => programs.filter(p => {
    const text = searchQuery.toLowerCase();
    const matchSearch = !searchQuery || p.title?.toLowerCase().includes(text) || (p.location_to || '').toLowerCase().includes(text);
    let matchMonth = true;
    if (selectedMonth && p.from_date) {
      const s = typeof p.from_date === 'string' ? p.from_date : new Date(p.from_date).toISOString();
      matchMonth = s.substring(0, 7) === selectedMonth;
    }
    let matchDur = true;
    if (selectedDuration !== 'all') {
      const d = Number(p.days || 1);
      if (selectedDuration === 'short') matchDur = d === 1;
      if (selectedDuration === 'medium') matchDur = d >= 2 && d <= 3;
      if (selectedDuration === 'long') matchDur = d > 3;
    }
    const matchType = selectedTypes.all || selectedTypes[p.type];
    const matchRegion = selectedRegion === 'all' || p.location_to === selectedRegion;
    const matchBudget = budgetLimit >= 999999 || (p.price || 0) <= budgetLimit;
    return matchSearch && matchMonth && matchDur && matchType && matchRegion && matchBudget;
  }), [programs, searchQuery, selectedMonth, selectedDuration, selectedTypes, selectedRegion, budgetLimit]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    return list.sort((a, b) => new Date(a.from_date).getTime() - new Date(b.from_date).getTime());
  }, [filtered, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const filterKey = `${searchQuery}|${selectedMonth}|${selectedDuration}|${JSON.stringify(selectedTypes)}|${selectedRegion}|${budgetLimit}|${sortBy}`;
  useEffect(() => { setCurrentPage(1); }, [filterKey]);

  const goToPage = (p) => { setCurrentPage(Math.min(Math.max(1, p), totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) pages.push(i);
      else if (pages[pages.length - 1] !== '...') pages.push('...');
    }
    return (
      <div className="flex justify-center items-center gap-1.5 mt-10">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center disabled:opacity-40">
          <Icon icon="mdi:chevron-left" className="w-5 h-5" />
        </button>
        {pages.map((p, i) => p === '...'
          ? <span key={`d${i}`} className="text-gray-300 px-1">...</span>
          : <button key={p} onClick={() => goToPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-extrabold ${p === currentPage ? 'bg-[#FF5E14] text-white' : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
              {p}
            </button>
        )}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white text-gray-500 flex items-center justify-center disabled:opacity-40">
          <Icon icon="mdi:chevron-right" className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <Layout className="bg-slate-50 font-sans">
      <SEO
        title="Programmes en Tunisie | Circuits & Excursions Batouta Voyages"
        description="Excursions, événements, circuits et séjours sur mesure à travers toute la Tunisie."
      />

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-white text-[#062B4F] pt-28">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/program_tunisie.png"
            fill
            alt="Programmes en Tunisie"
            className="object-cover object-[70%_center]"
            priority
          />

          {/* Left white gradient */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/80 to-white/10" /> */}

          {/* Bottom fade */}
          {/* <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" /> */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[330px] md:min-h-[360px] flex items-center">
            <div className="max-w-[560px] pt-10 pb-10">
              <h1 className="text-[38px] md:text-[52px] lg:text-[58px] font-black leading-[0.98] tracking-tight text-[#062B4F] mb-5">
                Programmes
                <br />
                <span className="text-[#FF5E14]">en Tunisie</span>
              </h1>

              <p className="text-[14px] md:text-[15px] text-[#062B4F]/90 font-semibold leading-[1.8] max-w-[540px] mb-8">
                Excursions, événements, circuits et séjours sur mesure à travers toute la
                Tunisie. Des expériences authentiques, proches de vous.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[650px]">
                {[
                  {
                    icon: "mdi:calendar-month-outline",
                    title: "Programmes organisés",
                    desc: "Des circuits soigneusement conçus et encadrés.",
                    color: "text-[#FF5E14]",
                  },
                  {
                    icon: "mdi:account-tie-hat-outline",
                    title: "Accompagnement Batouta",
                    desc: "Une équipe dédiée, à vos côtés avant et durant le programme.",
                    color: "text-[#1687E8]",
                  },
                  {
                    icon: "mdi:map-marker-check-outline",
                    title: "Expériences locales",
                    desc: "Des découvertes uniques au cœur de notre culture.",
                    color: "text-[#00A676]",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`shrink-0 mt-1 ${item.color}`}>
                      <Icon icon={item.icon} className="w-8 h-8" />
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-[#062B4F] leading-snug mb-1">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-[#062B4F]/75 font-semibold leading-relaxed">
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

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-[260px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-28 space-y-6">
              <div>
                <h3 className="text-[12px] font-black uppercase tracking-wider text-[#0B2D4D]">Affiner votre recherche</h3>
                <div className="w-8 h-[2px] bg-[#FF5E14] rounded-full mt-2" />
              </div>

              {/* Search */}
              <div className="relative">
                <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Rechercher un programme..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent placeholder:text-slate-400" />
              </div>

              {/* Mois */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Mois de départ</label>
                <div className="relative">
                  <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF5E14]" />
                  <Icon icon="mdi:calendar" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Durée */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Durée</label>
                <div className="relative">
                  <select value={selectedDuration} onChange={e => setSelectedDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF5E14] appearance-none cursor-pointer">
                    <option value="all">Toutes les durées</option>
                    <option value="short">1 jour</option>
                    <option value="medium">2 – 3 jours</option>
                    <option value="long">4 jours et plus</option>
                  </select>
                  <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Type de programme */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Type de programme</label>
                <div className="space-y-2">
                  {[{ key: 'all', label: 'Tous les types' }, ...availableTypes.map(t => ({ key: t, label: typeLabels[t] || t }))].map(t => (
                    <label key={t.key} className="flex items-center gap-2.5 cursor-pointer group">
                      <input type="checkbox" checked={!!selectedTypes[t.key]} onChange={() => handleTypeChange(t.key)} className="sr-only" />
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedTypes[t.key] ? 'border-[#FF5E14] bg-[#FF5E14] text-white' : 'border-slate-300 bg-white group-hover:border-slate-400'}`}>
                        {selectedTypes[t.key] && <Icon icon="mdi:check" className="w-3 h-3" />}
                      </div>
                      <span className={`text-xs font-bold ${selectedTypes[t.key] ? 'text-[#0B2D4D]' : 'text-slate-500 group-hover:text-slate-800'}`}>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Région */}
              {availableRegions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Région / Destination</label>
                  <div className="relative">
                    <select value={selectedRegion} onChange={e => setSelectedRegion(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF5E14] appearance-none cursor-pointer">
                      <option value="all">Toutes les régions</option>
                      {availableRegions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Budget */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Budget par personne</label>
                <input type="range" min="50" max="2000" step="50"
                  value={Math.min(budgetLimit, 2000)}
                  onChange={e => { const v = Number(e.target.value); setBudgetLimit(v >= 2000 ? 999999 : v); }}
                  className="w-full accent-[#FF5E14] h-1.5 rounded-lg cursor-pointer" />
                <div className="flex justify-between text-[11px] font-extrabold text-slate-500">
                  <span>50 TND</span>
                  <span>{budgetLimit >= 999999 ? '2 000 TND+' : `${budgetLimit.toLocaleString('fr-FR')} TND`}</span>
                </div>
              </div>

              <button onClick={handleReset}
                className="w-full border border-slate-200 hover:border-[#FF5E14] text-slate-600 hover:text-[#FF5E14] rounded-xl py-3 text-xs font-extrabold transition-all flex items-center justify-center gap-2 bg-slate-50/50">
                <Icon icon="mdi:refresh" className="w-4 h-4" /> Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* RESULTS */}
          <main className="flex-1 min-w-0">
            {/* Controls */}
            <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm font-extrabold text-[#0B2D4D]">
                <span className="text-[#FF5E14]">{sorted.length}</span> programme{sorted.length !== 1 ? 's' : ''} trouvé{sorted.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Trier par :</span>
                  <div className="relative">
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-[#0B2D4D] outline-none cursor-pointer pr-8 appearance-none">
                      <option value="date-asc">Départ le plus proche</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
                    <Icon icon="mdi:chevron-down" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex gap-1.5 border-l border-slate-200 pl-4">
                  {['grid', 'list'].map(m => (
                    <button key={m} onClick={() => setViewMode(m)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${viewMode === m ? 'border-[#FF5E14] text-[#FF5E14] bg-[#FF5E14]/5' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}>
                      <Icon icon={m === 'grid' ? 'mdi:view-grid' : 'mdi:view-list'} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cards */}
            {loading ? (
              <div className="space-y-4"><SkeletonCard count={4} /></div>
            ) : paginated.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
                {paginated.map(p => {
                  const img = getImageUrl(p.images);
                  const isFav = !!favorites[p.id];
                  const nights = p.nights ?? Math.max((p.days || 1) - 1, 0);
                  const badge = typeLabels[p.type];
                  const badgeColor = typeBadgeColor[p.type] || 'bg-gray-600 text-white';
                  const dateStr = fmtDate(p.from_date, p.to_date, p.isDateFlexible);
                  const href = `/circuits-en-tunisie/${p.slug || p.id}`;
                  const highlights = Array.isArray(p.highlights) ? p.highlights : [];

                  if (viewMode === 'grid') {
                    return (
                      <Link key={p.id} href={href} className="group block">
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                            <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            {badge && <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${badgeColor}`}>{badge}</span>}
                            <button onClick={e => toggleFav(p.id, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors">
                              <Icon icon={isFav ? 'mdi:heart' : 'mdi:heart-outline'} className={`w-4 h-4 ${isFav ? 'text-rose-500' : 'text-white'}`} />
                            </button>
                          </div>
                          <div className="p-5 flex flex-col flex-1">
                            <h3 className="text-base font-extrabold text-[#0B2D4D] group-hover:text-[#FF5E14] transition-colors leading-snug">{p.title}</h3>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <Icon icon="mdi:map-marker" className="w-3.5 h-3.5" />{p.location_to}
                            </p>
                            <div className="flex gap-3 mt-3 text-[11px] font-bold text-slate-500">
                              <span className="flex items-center gap-1"><Icon icon="mdi:clock-outline" className="w-3.5 h-3.5" />{p.durationLabel || `${p.days}j`}</span>
                              {dateStr && <span className="flex items-center gap-1"><Icon icon="mdi:calendar" className="w-3.5 h-3.5" />{dateStr}</span>}
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400">À partir de</p>
                                <p className="text-base font-black text-[#FF5E14]">{Number(p.price || 0).toLocaleString('fr-FR')} <span className="text-[11px]">TND</span></p>
                                <p className="text-[10px] text-slate-400">par personne</p>
                              </div>
                              <span className="bg-[#FF5E14] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-orange-600 transition-colors">Voir le programme</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  // List view
                  return (
                    <Link key={p.id} href={href} className="group block">
                      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row">
                        <div className="relative sm:w-[280px] aspect-[4/3] sm:aspect-auto shrink-0 overflow-hidden bg-slate-100">
                          <Image src={img} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          {badge && <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${badgeColor}`}>{badge}</span>}
                          <button onClick={e => toggleFav(p.id, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors">
                            <Icon icon={isFav ? 'mdi:heart' : 'mdi:heart-outline'} className={`w-4 h-4 ${isFav ? 'text-rose-500' : 'text-white'}`} />
                          </button>
                        </div>
                        <div className="p-5 flex flex-col flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-extrabold text-[#0B2D4D] group-hover:text-[#FF5E14] transition-colors leading-snug">{p.title}</h3>
                              <div className="flex flex-wrap gap-3 mt-2 text-[11px] font-bold text-slate-500">
                                <span className="flex items-center gap-1"><Icon icon="mdi:map-marker" className="w-3.5 h-3.5 text-slate-400" />{p.location_to}</span>
                                <span className="flex items-center gap-1"><Icon icon="mdi:clock-outline" className="w-3.5 h-3.5 text-slate-400" />{p.durationLabel || `${p.days} jour${p.days > 1 ? 's' : ''}${nights > 0 ? ` / ${nights} nuit${nights > 1 ? 's' : ''}` : ''}`}</span>
                                <span className="flex items-center gap-1"><Icon icon="mdi:airplane" className="w-3.5 h-3.5 text-slate-400" />Transport</span>
                                {dateStr && <span className="flex items-center gap-1"><Icon icon="mdi:calendar" className="w-3.5 h-3.5 text-slate-400" />{dateStr}</span>}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] font-bold text-slate-400">À partir de</p>
                              <p className="text-2xl font-black text-[#FF5E14] leading-tight">{Number(p.price || 0).toLocaleString('fr-FR')}</p>
                              <p className="text-xs font-bold text-slate-500">TND <span className="font-normal text-slate-400">par personne</span></p>
                            </div>
                          </div>

                          {p.shortDescription && (
                            <p className="text-xs text-slate-500 mt-3 leading-relaxed line-clamp-2">{stripHtml(p.shortDescription)}</p>
                          )}

                          {highlights.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {highlights.slice(0, 4).map((h, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-lg">
                                  <Icon icon="mdi:check-circle" className="w-3 h-3 text-[#FF5E14]" />{h}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto pt-4 flex justify-end">
                            <span className="bg-[#FF5E14] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-orange-600 transition-colors">
                              Voir le programme
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Icon icon="mdi:map-search" className="w-12 h-12 text-[#FF5E14] mx-auto mb-4" />
                <h3 className="text-lg font-extrabold text-[#0B2D4D]">Aucun programme trouvé</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Ajustez les filtres pour voir plus de résultats.</p>
                <button onClick={handleReset} className="mt-4 text-xs font-bold text-[#FF5E14] hover:underline">Réinitialiser les filtres</button>
              </div>
            )}

            {renderPagination()}
          </main>
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="bg-white border-y border-slate-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: 'mdi:shield-check-outline', color: 'text-[#FF5E14] bg-orange-50', title: 'Expertise locale', desc: 'Une connaissance approfondie de la Tunisie et de ses trésors.' },
            { icon: 'mdi:account-group-outline', color: 'text-blue-600 bg-blue-50', title: 'Encadrement professionnel', desc: 'Guides expérimentés et sélection rigoureuse des partenaires.' },
            { icon: 'mdi:map-marker-path', color: 'text-green-600 bg-green-50', title: 'Itinéraires de qualité', desc: 'Programmes pensés pour votre confort, sécurité et satisfaction.' },
            { icon: 'mdi:headset', color: 'text-purple-600 bg-purple-50', title: 'Assistance 24/7', desc: 'Une équipe disponible avant, pendant et après votre expérience.' },
          ].map((f, i) => (
            <div key={i} className="flex flex-col md:flex-row items-start gap-4">
              <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center ${f.color}`}>
                <Icon icon={f.icon} className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-[#0B2D4D]">{f.title}</h4>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF6F3] rounded-2xl p-6 md:p-10 border border-amber-100 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-xl font-black text-[#0B2D4D] mb-1.5">Un programme sur mesure ?</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Vous avez un projet spécifique, un événement privé ou des besoins particuliers ? Batouta conçoit pour vous des programmes personnalisés adaptés à vos envies et à votre budget.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="/contact" className="flex items-center gap-2 px-5 py-3.5 bg-[#FF5E14] text-white rounded-xl font-extrabold text-xs hover:bg-orange-600 transition-all">
                Demander un devis <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </a>
              <a href="tel:+21671802881" className="flex items-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 hover:border-[#FF5E14] hover:text-[#FF5E14] rounded-xl font-extrabold text-xs transition-all">
                <Icon icon="mdi:phone" className="w-4 h-4" /> Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      <ContactSection />
    </Layout>
  );
}
