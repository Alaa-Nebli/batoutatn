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
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

const ITEMS_PER_PAGE = 9;

const stripHtml = (htmlString = '') => htmlString.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const normalizeImages = (images) => {
  if (!Array.isArray(images)) return [];
  return images.map(img => {
    if (typeof img === 'string') return img;
    if (img && typeof img === 'object' && img.url) return img.url;
    return null;
  }).filter(Boolean);
};

const SkeletonCard = ({ count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-2xl overflow-hidden">
        <div className="bg-slate-200 aspect-[4/3] w-full" />
        <div className="p-5 space-y-3">
          <div className="h-4 bg-slate-200 rounded w-2/3" />
          <div className="h-3 bg-slate-200 rounded w-1/3" />
          <div className="h-px bg-slate-100 w-full" />
          <div className="flex justify-between items-center pt-1">
            <div className="h-3 bg-slate-200 rounded w-1/4" />
            <div className="h-5 bg-slate-200 rounded w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [budgetLimit, setBudgetLimit] = useState(999999);
  const [sortBy, setSortBy] = useState('date-asc');
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/programs.controller?active=true');
        if (!response.ok) throw new Error('fetch failed');
        const data = await response.json();
        setPrograms(Array.isArray(data) ? data : []);
      } catch {
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMonth('');
    setSelectedDuration('all');
    setBudgetLimit(999999);
    setSortBy('date-asc');
    setCurrentPage(1);
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const text = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        p.title?.toLowerCase().includes(text) ||
        p.location_to?.toLowerCase().includes(text) ||
        p.location_from?.toLowerCase().includes(text);

      let matchMonth = true;
      if (selectedMonth && p.from_date) {
        const fromStr = typeof p.from_date === 'string' ? p.from_date : new Date(p.from_date).toISOString();
        matchMonth = fromStr.substring(0, 7) === selectedMonth;
      }

      let matchDuration = true;
      if (selectedDuration !== 'all') {
        if (selectedDuration === 'short') matchDuration = p.days <= 5;
        if (selectedDuration === 'medium') matchDuration = p.days > 5 && p.days <= 8;
        if (selectedDuration === 'long') matchDuration = p.days > 8;
      }

      const matchBudget = budgetLimit >= 999999 || (p.price || 0) <= budgetLimit;

      return matchSearch && matchMonth && matchDuration && matchBudget;
    });
  }, [programs, searchQuery, selectedMonth, selectedDuration, budgetLimit]);

  const sortedPrograms = useMemo(() => {
    const list = [...filteredPrograms];
    if (sortBy === 'price-asc') return list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') return list.sort((a, b) => b.price - a.price);
    if (sortBy === 'date-asc') return list.sort((a, b) => new Date(a.from_date).getTime() - new Date(b.from_date).getTime());
    return list;
  }, [filteredPrograms, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedPrograms.length / ITEMS_PER_PAGE));
  const paginatedPrograms = sortedPrograms.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 whenever filters change
  const prevFilterKey = useMemo(() => `${searchQuery}|${selectedMonth}|${selectedDuration}|${budgetLimit}|${sortBy}`, [searchQuery, selectedMonth, selectedDuration, budgetLimit, sortBy]);
  useEffect(() => { setCurrentPage(1); }, [prevFilterKey]);

  const formatRangeDate = (from, to) => {
    if (!from || !to) return '';
    const dFrom = new Date(from);
    const dTo = new Date(to);
    if (Number.isNaN(dFrom.getTime())) return '';
    const opts = { day: 'numeric', month: 'short' };
    return `${dFrom.toLocaleDateString('fr-FR', opts)} – ${dTo.toLocaleDateString('fr-FR', { ...opts, year: 'numeric' })}`;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return (
      <div className="flex justify-center items-center gap-1.5 mt-10">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <Icon icon="mdi:chevron-left" className="w-5 h-5" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="text-slate-300 font-bold px-1 select-none">...</span>
          ) : (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs transition-colors ${
                p === currentPage
                  ? 'bg-[#FF5E14] text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors disabled:opacity-40"
        >
          <Icon icon="mdi:chevron-right" className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <Layout className="bg-slate-50 font-sans">
      <SEO
        title="Voyages Organisés à l'étranger | Batouta Voyages"
        description="Partez à la découverte du monde avec Batouta. Des programmes soigneusement sélectionnés, des expériences inoubliables et un accompagnement complet."
      />

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-white text-[#062B4F] pt-28">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/outbound_trips.png"
            fill
            alt="Voyages à l'étranger"
            className="object-cover object-[72%_center]"
            priority
          />

          {/* Left white gradient like the design */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 md:via-white/78 to-white/5" /> */}

          {/* Bottom soft fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="min-h-[330px] md:min-h-[360px] flex items-center">
            <div className="max-w-[650px] pt-10 pb-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 text-[#062B4F] text-[11px] font-black tracking-widest uppercase mb-5 border border-blue-100 shadow-sm">
                <Icon icon="mdi:earth" className="w-4 h-4 text-[#1687E8]" />
                Voyages Organisés
              </div>

              <h1 className="text-[38px] md:text-[52px] lg:text-[58px] font-black leading-[0.98] tracking-tight text-[#062B4F] mb-5">
                Voyages{" "}
                <span className="text-[#FF5E14]">à l&apos;étranger</span>
              </h1>

              <p className="text-[14px] md:text-[15px] text-[#062B4F]/90 font-semibold leading-[1.8] max-w-[570px] mb-8">
                Partez à la découverte du monde avec Batouta. Des programmes soigneusement
                sélectionnés, des expériences inoubliables et un accompagnement complet
                à chaque étape.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[690px]">
                {[
                  {
                    icon: "mdi:calendar-month-outline",
                    title: "Départs organisés",
                    desc: "Voyagez avec un programme détaillé et encadré.",
                    color: "text-[#FF5E14]",
                  },
                  {
                    icon: "mdi:account-tie-hat-outline",
                    title: "Accompagnement Batouta",
                    desc: "Une équipe disponible à chaque instant.",
                    color: "text-[#1687E8]",
                  },
                  {
                    icon: "mdi:camera-outline",
                    title: "Des émotions inédites",
                    desc: "Des destinations choisies pour leur qualité.",
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

      {/* MAIN SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR FILTERS */}
          <aside className="w-full lg:w-[280px] shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm sticky top-28 space-y-6">
              <div>
                <h3 className="text-[12px] font-black uppercase tracking-wider text-[#0B2D4D]">Affiner votre recherche</h3>
                <div className="w-8 h-[2px] bg-[#FF5E14] rounded-full mt-2" />
              </div>

              <div>
                <div className="relative">
                  <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF5E14] focus:border-transparent transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Mois de départ</label>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF5E14] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Durée du séjour</label>
                <div className="relative">
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-[#FF5E14] appearance-none cursor-pointer"
                  >
                    <option value="all">Toutes les durées</option>
                    <option value="short">Courts séjours (≤ 5 jours)</option>
                    <option value="medium">Moyens séjours (6–8 jours)</option>
                    <option value="long">Longs séjours (&gt; 8 jours)</option>
                  </select>
                  <Icon icon="mdi:chevron-down" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Budget par personne</label>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={Math.min(budgetLimit, 20000)}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setBudgetLimit(v >= 20000 ? 999999 : v);
                  }}
                  className="w-full accent-[#FF5E14] h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500">
                  <span>500 TND</span>
                  <span>{budgetLimit >= 999999 ? 'Tous les budgets' : `${budgetLimit.toLocaleString('fr-FR')} TND`}</span>
                </div>
              </div>

              <button
                onClick={handleResetFilters}
                className="w-full border border-slate-200 hover:border-[#FF5E14] text-slate-600 hover:text-[#FF5E14] rounded-xl py-3 text-xs font-extrabold transition-all flex items-center justify-center gap-2 bg-slate-50/50"
              >
                <Icon icon="mdi:refresh" className="w-4 h-4" />
                Réinitialiser les filtres
              </button>
            </div>
          </aside>

          {/* RESULTS */}
          <main className="flex-1 min-w-0">
            {/* Controls bar */}
            <div className="bg-white rounded-2xl border border-slate-100 px-5 py-4 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-sm font-extrabold text-[#0B2D4D]">
                <span className="text-[#FF5E14]">{sortedPrograms.length}</span> voyage{sortedPrograms.length !== 1 ? 's' : ''} trouvé{sortedPrograms.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Trier par :</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-[#0B2D4D] outline-none cursor-pointer pr-8 appearance-none"
                    >
                      <option value="date-asc">Départ le plus proche</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
                    <Icon icon="mdi:chevron-down" className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 border-l border-slate-200 pl-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${viewMode === 'grid' ? 'border-[#FF5E14] text-[#FF5E14] bg-[#FF5E14]/5' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}
                  >
                    <Icon icon="mdi:view-grid" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${viewMode === 'list' ? 'border-[#FF5E14] text-[#FF5E14] bg-[#FF5E14]/5' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}
                  >
                    <Icon icon="mdi:view-list" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cards */}
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <SkeletonCard count={6} />
              </div>
            ) : paginatedPrograms.length > 0 ? (
              <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'}>
                {paginatedPrograms.map((p) => {
                  const isFav = !!favorites[p.id];
                  const imgs = normalizeImages(p.images);
                  const thumb = imgs[0] || '/voyage.jpg';
                  const nights = p.nights ?? Math.max((p.days || 1) - 1, 0);

                  if (viewMode === 'list') {
                    return (
                      <Link key={p.id} href={`/programs/${p.id}`} className="group block">
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row">
                          <div className="relative sm:w-56 shrink-0 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-100">
                            <Image src={thumb} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            {p.badge && (
                              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white ${p.badge === 'Best seller' ? 'bg-[#FF5E14]' : p.badge === 'Nouveau' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <div className="p-5 flex flex-col justify-between flex-1">
                            <div>
                              <h3 className="text-base font-extrabold text-[#0B2D4D] group-hover:text-[#FF5E14] transition-colors leading-snug">{p.title}</h3>
                              <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                                <Icon icon="mdi:map-marker" className="w-3.5 h-3.5" /> {p.location_to}
                              </p>
                              {p.description && (
                                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{stripHtml(p.description)}</p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500">
                                <span className="flex items-center gap-1"><Icon icon="mdi:calendar-blank-outline" className="w-4 h-4" />{p.days} j / {nights} n</span>
                                <span className="text-slate-300">•</span>
                                <span>{formatRangeDate(p.from_date, p.to_date)}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-slate-400">À partir de</p>
                                <p className="text-base font-black text-[#FF5E14]">{p.price?.toLocaleString('fr-FR')} <span className="text-[11px]">TND</span></p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  }

                  return (
                    <Link key={p.id} href={`/programs/${p.id}`} className="group block">
                      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                          <Image src={thumb} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          {p.badge && (
                            <span className={`absolute top-3.5 left-3.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-white shadow-sm ${p.badge === 'Best seller' ? 'bg-[#FF5E14]' : p.badge === 'Nouveau' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                              {p.badge}
                            </span>
                          )}
                          <button
                            onClick={(e) => toggleFavorite(p.id, e)}
                            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/50 hover:bg-white backdrop-blur-md flex items-center justify-center transition-colors shadow-sm"
                          >
                            <Icon icon={isFav ? 'mdi:heart' : 'mdi:heart-outline'} className={`w-4.5 h-4.5 ${isFav ? 'text-rose-500' : 'text-white'}`} />
                          </button>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-base font-extrabold text-[#0B2D4D] leading-snug group-hover:text-[#FF5E14] transition-colors">
                            {p.title}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                            <Icon icon="mdi:map-marker" className="w-3.5 h-3.5 text-slate-300" />
                            {p.location_to}
                          </p>

                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-50 text-[11px] font-extrabold text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <Icon icon="mdi:calendar-blank-outline" className="w-4 h-4 text-slate-400" />
                              {p.days} j / {nights} n
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Icon icon="mdi:airplane" className="w-4 h-4 text-slate-400" />
                              Avion
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2 font-semibold">
                            <Icon icon="mdi:calendar-range" className="w-4 h-4 text-slate-300" />
                            {formatRangeDate(p.from_date, p.to_date)}
                          </div>

                          <div className="flex items-center justify-between mt-auto pt-3.5 border-t border-slate-100">
                            <div className="text-right ml-auto">
                              <p className="text-[10px] font-bold text-slate-400 leading-none">À partir de</p>
                              <p className="text-base font-black text-[#FF5E14] mt-0.5">
                                {p.price?.toLocaleString('fr-FR')} <span className="text-[11px] font-extrabold">TND</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <Icon icon="mdi:map-marker-off-outline" className="w-12 h-12 text-[#FF5E14] mx-auto mb-4" />
                <h3 className="text-lg font-extrabold text-[#0B2D4D]">Aucun programme trouvé</h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">Essayez d&apos;ajuster les filtres de recherche.</p>
                <button onClick={handleResetFilters} className="mt-4 text-xs font-bold text-[#FF5E14] hover:underline">Réinitialiser les filtres</button>
              </div>
            )}

            {renderPagination()}
          </main>
        </div>
      </section>

      {/* TRUST ROW */}
      <section className="bg-white border-y border-slate-100 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'mdi:star-shooting-outline', iconColor: 'text-amber-500', iconBg: 'bg-amber-50', title: 'Expériences sélectionnées', desc: 'Des programmes choisis avec soin pour voyager sereinement.' },
              { icon: 'mdi:shield-check-outline', iconColor: 'text-blue-500', iconBg: 'bg-blue-50', title: 'Accompagnement complet', desc: 'Avant, pendant et après votre voyage.' },
              { icon: 'mdi:headset', iconColor: 'text-emerald-500', iconBg: 'bg-emerald-50', title: 'Conseillers experts', desc: 'Une équipe disponible pour vous orienter.' },
              { icon: 'mdi:folder-account-outline', iconColor: 'text-purple-500', iconBg: 'bg-purple-50', title: 'Programmes adaptés', desc: 'Voyages en groupe, familles, couples ou sur mesure.' },
            ].map((f, i) => (
              <div key={i} className="flex flex-col md:flex-row items-start gap-4">
                <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center ${f.iconBg} ${f.iconColor}`}>
                  <Icon icon={f.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0B2D4D]">{f.title}</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HELP CTA */}
      <section className="bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#FAF6F3] rounded-2xl p-6 md:p-8 border border-amber-100 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-xl">
              <h3 className="text-lg md:text-xl font-black text-[#0B2D4D] mb-1.5">Besoin d&apos;aide pour choisir votre voyage ?</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Nos conseillers vous accompagnent gratuitement pour trouver le programme le plus adapté à vos envies, vos dates et votre budget.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a href="tel:+21671802881" className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#FF5E14] text-white rounded-xl font-extrabold text-xs hover:bg-[#e04f0f] transition-all">
                <Icon icon="mdi:phone" className="w-4 h-4" /> Appeler un conseiller<br/>+216 71 802 881
              </a>
              <a href="https://wa.me/21694849694" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-5 py-3.5 bg-[#07B574] text-white rounded-xl font-extrabold text-xs hover:bg-emerald-600 transition-all">
                <Icon icon="mdi:whatsapp" className="w-4 h-4" /> WhatsApp<br/>+216 94 849 694
              </a>
              <Link href="/#contact" className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 text-slate-700 hover:border-[#FF5E14] hover:text-[#FF5E14] rounded-xl font-extrabold text-xs transition-all">
                Demander un devis <Icon icon="mdi:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER BRAND BAR */}
      <section className="bg-[#0B2D4D] text-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {[
              { icon: 'mdi:compass-outline', title: 'Voyages organisés avec soin', desc: 'Des itinéraires pensés dans les moindres détails.' },
              { icon: 'mdi:security', title: 'Départs encadrés', desc: 'Voyagez en toute sécurité avec nos équipes.' },
              { icon: 'mdi:lifebuoy', title: 'Assistance dédiée', desc: 'Une assistance disponible avant, pendant et après.' },
              { icon: 'mdi:tag-multiple-outline', title: 'Programmes adaptés', desc: 'À tous les budgets et toutes les envies.' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-[#FF5E14]">
                  <Icon icon={item.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white leading-tight">{item.title}</h4>
                  <p className="text-[10px] text-white/50 leading-relaxed mt-0.5 font-semibold">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactSection />
    </Layout>
  );
}
