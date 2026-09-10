import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

const stripHtml = (htmlString = '') => htmlString.replace(/<[^>]+>/g, '');

const getBannerHref = (item) => {
  const cta = String(item.cta || '').trim();
  if (/^(https?:\/\/|\/)/i.test(cta)) return cta;
  return item.tripId ? `/programs/${item.tripId}` : '/programs';
};

const Banner = () => {
  const { t } = useTranslation('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/featured');
        if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.json();
        setFeaturedItems(Array.isArray(data) ? data :[]);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedItems();
  },[]);

  const displayBanners = featuredItems.map((item) => ({
    id: item.id,
    imageUrl: item.image,
    title: stripHtml(item.trip?.title || 'Featured trip'),
    alt: stripHtml(item.trip?.title || 'Featured destination'),
    href: getBannerHref(item),
  }));

  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  };
  
  const handleNext = (e) => {
    if (e) e.preventDefault();
    setCurrentIndex((prev) => (prev + 1) % displayBanners.length);
  };

  useEffect(() => {
    if (displayBanners.length > 1) {
      const interval = setInterval(handleNext, 6000); 
      return () => clearInterval(interval);
    }
  }, [displayBanners.length]);

  if (loading) {
    return (
      <section className="relative mt-[116px] w-full flex aspect-video items-center justify-center bg-bg-warm">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-border-line border-t-brand-orange mb-4" />
          <p className="font-medium text-text-muted uppercase tracking-widest text-xs">
            {t('Home.Loading', 'Chargement...')}
          </p>
        </div>
      </section>
    );
  }

  if (error || displayBanners.length === 0) {
    return (
      <section className="relative mt-[116px] w-full flex aspect-video items-center justify-center bg-bg-warm">
        <p className="font-medium text-text-muted">
          {t('Home.NoFeatured', 'Aucun programme à la une pour le moment.')}
        </p>
      </section>
    );
  }

  return (
    <section className="relative mt-[116px] w-full overflow-hidden bg-brand-navy group">
      
      <div className="relative w-full aspect-video overflow-hidden">
        
        <AnimatePresence initial={false}>
          {displayBanners.map((banner, index) => (
            index === currentIndex && (
              <motion.a
                key={banner.id}
                href={banner.href}
                className="absolute inset-0 block h-full w-full"
                aria-label={`Découvrir ${banner.title}`}
                target={banner.href.startsWith('http') ? '_blank' : undefined}
                rel={banner.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Image
                  src={banner.imageUrl}
                  alt={banner.alt}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover object-center"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </motion.a>
            )
          ))}
        </AnimatePresence>

        {/* Controls */}
        {displayBanners.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 md:left-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-1.5 md:p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-105 text-white hover:text-brand-orange opacity-90 md:opacity-0 md:group-hover:opacity-100 border border-white/20"
              aria-label="Image précédente"
            >
              <Icon icon="lucide:chevron-left" className="h-6 w-6 md:h-8 md:w-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 md:right-6 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/10 p-1.5 md:p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-105 text-white hover:text-brand-orange opacity-90 md:opacity-0 md:group-hover:opacity-100 border border-white/20"
              aria-label="Image suivante"
            >
              <Icon icon="lucide:chevron-right" className="h-6 w-6 md:h-8 md:w-8" />
            </button>
            
            <div className="absolute bottom-4 md:bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2.5 rounded-full bg-black/40 px-3 py-2 md:px-4 md:py-2.5 shadow-xl backdrop-blur-md border border-white/10">
              {displayBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    idx === currentIndex 
                      ? 'w-8 bg-brand-orange shadow-[0_0_10px_rgba(243,112,33,0.5)]' 
                      : 'w-2 bg-white/60 hover:bg-white'
                  }`}
                  aria-label={`Aller à la diapositive ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Banner;
