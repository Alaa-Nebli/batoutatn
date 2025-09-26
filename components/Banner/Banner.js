import React, { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Icon } from '@iconify/react';

// Helper function to strip HTML tags and get plain text:
function stripHtml(htmlString = '') {
  return htmlString.replace(/<[^>]+>/g, '');
}

const Banner = () => {
  const { t } = useTranslation('common');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured items from API
  useEffect(() => {
    const fetchFeaturedItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/featured');
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        // Filter for active programs only
        const activeFeatured = data
        setFeaturedItems(activeFeatured);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedItems();
  }, []);

  const displayBanners = featuredItems.map((item) => ({
    id: item.id,
    imageUrl: item.image,
    title: stripHtml(item.trip?.title || 'Featured Trip'),
    description: stripHtml(item.trip?.description || 'Discover amazing destinations.').slice(0, 150) + '...',
    price: item.trip?.price || 0,
    fromDate: item.trip?.from_date ? new Date(item.trip.from_date).toLocaleDateString('fr-FR') : '',
    toDate: item.trip?.to_date ? new Date(item.trip.to_date).toLocaleDateString('fr-FR') : '',
    alt: stripHtml(item.trip?.title || 'Featured destination'),
    cta: item.cta || 'Explore Destination',
    tripId: item.tripId,
  }));

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + displayBanners.length) % displayBanners.length);
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % displayBanners.length);

  useEffect(() => {
    if (displayBanners.length > 0) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [displayBanners.length]);

  if (loading) {
    return (
      <section className="relative h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 mt-[80px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">{t('Home.Loading', 'Loading exclusive deals...')}</p>
        </div>
      </section>
    );
  }

  if (error || displayBanners.length === 0) {
    return (
      <section className="relative h-[calc(100vh-80px)] flex items-center justify-center bg-gray-100 mt-[80px]">
        <p className="text-gray-600 font-medium">{t('Home.NoFeatured', 'No featured programs available at the moment.')}</p>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden h-[calc(100vh-80px)] mt-[80px]">
      <div className="absolute inset-0 flex">
        {displayBanners.map((banner, index) => (
          <motion.div
            key={banner.id}
            className={`w-full h-full flex-shrink-0 absolute transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentIndex ? 1 : 0 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src={banner.imageUrl}
              alt={banner.alt}
              fill
              sizes="100vw"
              priority={index === 0}
              loading={index === 0 ? 'eager' : 'lazy'}
              className="object-cover brightness-75 group-hover:brightness-100 transition-brightness duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center">
              <motion.div
                className="text-center max-w-4xl px-4"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.span 
                  className="inline-block px-4 py-2 bg-orange-500 text-white rounded-full mb-6 text-sm font-medium"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  Programme à la Une
                </motion.span>
                
                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {banner.title}
                </motion.h2>
                
                <motion.p
                  className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {banner.description}
                </motion.p>
                
                <motion.div
                  className="flex flex-wrap items-center justify-center gap-4 mb-8"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                <span className="text-sm md:text-base text-gray-200">Du {banner.fromDate} au {banner.toDate}</span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">Places limitées !</span>
                </motion.div>
                
                <motion.div
                  className="flex flex-col sm:flex-row justify-center gap-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link href={`/programs/${banner.tripId}`}>
                    <motion.button 
                      className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{t('Home.ViewDetails', 'Voir les détails')}</span>
                      <Icon icon="mdi:arrow-right" className="w-5 h-5" />
                    </motion.button>
                  </Link>
                  <Link href={`/programs/${banner.tripId}#reservation-section`}>
                    <motion.button 
                      className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>{t('Home.ReserveNow', 'Réserver maintenant')}</span>
                      <Icon icon="mdi:calendar-check" className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <button onClick={handlePrev} className="p-2 bg-white/30 rounded-full hover:bg-white/50 transition" aria-label="Previous">
          <Icon icon="lucide:chevron-left" className="w-8 h-8 text-white" />
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <button onClick={handleNext} className="p-2 bg-white/30 rounded-full hover:bg-white/50 transition" aria-label="Next">
          <Icon icon="lucide:chevron-right" className="w-8 h-8 text-white" />
        </button>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {displayBanners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-3 h-3 rounded-full ${idx === currentIndex ? 'bg-orange-500' : 'bg-white/50'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;