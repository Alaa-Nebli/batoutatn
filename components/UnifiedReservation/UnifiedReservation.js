import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { VoyageForm } from '../ProgramReservation/ProgramReservation';
import { ReservationForm } from '../ReservationForm/ReservationForm';

const TripCard = ({ trip, onSelect, onViewDetails, isMobile = false }) => (
  <motion.article
    className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden group transition-all duration-500 border border-gray-100/50 h-full"
    whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
  >
    <div className="relative h-64 md:h-72 overflow-hidden">
      <Image
        src={trip.images?.[0] || '/placeholder.jpg'}
        alt={`${trip.title} - Voyage organisé`}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Price Badge */}
      <div className="absolute top-4 left-4">
        <div className="bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
          <span className="text-sm font-bold text-gray-900">
            {trip.price?.toLocaleString('fr-FR')} TND
          </span>
        </div>
      </div>

      {/* Duration Badge */}
      <div className="absolute top-4 right-4">
        <div className="bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
          <span className="text-xs font-semibold text-white">
            {trip.days} jours
          </span>
        </div>
      </div>
    </div>
    
    {/* Card Content */}
    <div className="p-6 bg-gradient-to-b from-white to-gray-50/50 flex flex-col justify-between min-h-[200px]">
      <div>
        <h4 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-tight">
          {trip.title}
        </h4>
        <div className="flex items-center text-gray-600 mb-4">
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
            <Icon icon="heroicons:map-pin" className="w-4 h-4 mr-1 text-orange-500" />
            <span className="text-sm font-medium">{trip.location_from} → {trip.location_to}</span>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
        <button
          onClick={() => onViewDetails(trip.id)}
          className="flex-1 px-4 py-2 bg-white/95 hover:bg-white rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Icon icon="heroicons:eye" className="w-4 h-4 mr-2" />
          Voir détails
        </button>
        <button
          onClick={() => onSelect(trip, 'reserve')}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center text-sm font-semibold"
        >
          <Icon icon="heroicons:calendar" className="w-4 h-4 mr-2" />
          Réserver
        </button>
      </div>
    </div>
  </motion.article>
);

const UnifiedReservation = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('voyages');
  const [availableTrips, setAvailableTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef(null);
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numberOfPersons: 1,
    roomType: 'double',
    specialRequests: '',
    tripId: ''
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch available trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/programs.controller?active=true');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setAvailableTrips(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setAvailableTrips([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (activeTab === 'voyages' && availableTrips.length > 1 && mounted) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % availableTrips.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, availableTrips.length, mounted]);

  const handleTripSelect = useCallback((trip, action = 'reserve') => {
    setSelectedTrip(trip);
    if (action === 'reserve') {
      setFormData(prev => ({ ...prev, tripId: trip.id }));
      setTimeout(() => {
        const formElement = document.getElementById('voyage-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const handleViewDetails = useCallback((tripId) => {
    router.push(`/programs/${tripId}`);
  }, [router]);

  const calculatePrice = useCallback(() => {
    if (!selectedTrip) return 0;
    const basePrice = selectedTrip.price || 0;
    const persons = formData.numberOfPersons || 1;
    const roomMultiplier = { 'single': 1.3, 'double': 1, 'triple': 0.8 };
    return Math.round(basePrice * persons * (roomMultiplier[formData.roomType] || 1));
  }, [selectedTrip, formData.numberOfPersons, formData.roomType]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const reservationData = {
        tripId: selectedTrip?.id,
        tripTitle: selectedTrip?.title,
        tripLocation: `${selectedTrip?.location_from} → ${selectedTrip?.location_to}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        numberOfPersons: formData.numberOfPersons,
        roomType: formData.roomType,
        specialRequests: formData.specialRequests,
        preferredDate: selectedTrip ? `${new Date(selectedTrip.from_date).toLocaleDateString('fr-FR')} - ${new Date(selectedTrip.to_date).toLocaleDateString('fr-FR')}` : '',
        totalPrice: calculatePrice()
      };

      const response = await fetch('/api/program-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        setSuccessMessage('Votre demande a été envoyée avec succès! Nous vous contacterons bientôt.');
        setFormData({
          firstName: '', lastName: '', email: '', phone: '',
          numberOfPersons: 1, roomType: 'double', specialRequests: '', tripId: ''
        });
        setSelectedTrip(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi');
      }
    } catch (error) {
      setErrorMessage(error.message || 'Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % availableTrips.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + availableTrips.length) % availableTrips.length);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSuccessMessage('');
    setErrorMessage('');
  };

  if (!mounted) {
    return (
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mx-auto mb-4 w-96"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto mb-8 w-64"></div>
            <div className="h-12 bg-gray-200 rounded mx-auto mb-8 w-80"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-light mb-4 text-gray-900">
            Réservez votre{' '}
            <span className="font-medium bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              prochain voyage
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
            Que ce soit un <span className="font-medium text-gray-800">voyage à l'étranger clé en main</span> ou une <span className="font-medium text-gray-800">billetterie 100% personnalisée</span>, nous nous occupons de tout pour vous.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex justify-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <nav className="bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-gray-200/50">
            <div className="flex space-x-1">
              <button
                onClick={() => handleTabChange('voyages')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center text-sm ${
                  activeTab === 'voyages'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50/50'
                }`}
              >
                <Icon icon="heroicons:map" className="w-4 h-4 mr-2" />
                Voyages
              </button>
              <button
                onClick={() => handleTabChange('ticketing')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center text-sm ${
                  activeTab === 'ticketing'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50/50'
                }`}
              >
                <Icon icon="heroicons:paper-airplane" className="w-4 h-4 mr-2" />
                Réserver vol
              </button>
            </div>
          </nav>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'voyages' && (
            <motion.div
              key="voyages"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Programs Section */}
              <div className="mb-16 md:mb-20">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-light text-gray-900">Nos programmes</h3>
                  {availableTrips.length > 1 && (
                    <div className="flex space-x-2">
                      <button
                        onClick={prevSlide}
                        className="p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50"
                        aria-label="Programme précédent"
                      >
                        <Icon icon="heroicons:chevron-left" className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={nextSlide}
                        className="p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50"
                        aria-label="Programme suivant"
                      >
                        <Icon icon="heroicons:chevron-right" className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
                        <div className="h-72 bg-gray-200"></div>
                        <div className="p-6 space-y-4">
                          <div className="h-6 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Desktop: 3 cards, Tablet: 2 cards, Mobile: 1 card with scroll hint */}
                    <div className="relative">
                      {/* Mobile Carousel */}
                      <div className="md:hidden">
                        <div className="relative overflow-hidden">
                          <div 
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentSlide * 85}%)` }}
                          >
                            {availableTrips.map((trip, index) => (
                              <div
                                key={trip.id}
                                className="flex-shrink-0 w-4/5 mr-4"
                                style={{ minWidth: '80%' }}
                              >
                                <TripCard 
                                  trip={trip} 
                                  onSelect={handleTripSelect} 
                                  onViewDetails={handleViewDetails}
                                  isMobile={true}
                                />
                              </div>
                            ))}
                          </div>
                          {/* Scroll hint for mobile */}
                          {availableTrips.length > 1 && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 bg-gradient-to-l from-white via-white/80 to-transparent h-full flex items-center justify-end pr-2">
                              <div className="w-8 h-1 bg-gray-300 rounded-full opacity-60"></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Tablet & Desktop Grid */}
                      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {availableTrips.slice(0, 6).map((trip) => (
                          <TripCard 
                            key={trip.id} 
                            trip={trip} 
                            onSelect={handleTripSelect}
                            onViewDetails={handleViewDetails}
                            isMobile={false}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Mobile Indicators */}
                    {availableTrips.length > 1 && (
                      <div className="flex justify-center mt-6 space-x-2 md:hidden">
                        {availableTrips.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              index === currentSlide
                                ? 'w-8 bg-gradient-to-r from-orange-500 to-pink-500'
                                : 'w-2 bg-gray-300'
                            }`}
                            aria-label={`Aller au programme ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Voyage Form */}
              <div id="voyage-form">
                <VoyageForm
                  trips={availableTrips}
                  selectedTrip={selectedTrip}
                  formData={formData}
                  setFormData={setFormData}
                  setSelectedTrip={setSelectedTrip}
                  onSubmit={handleFormSubmit}
                  loading={loading}
                  calculatePrice={calculatePrice}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'ticketing' && (
            <motion.div
              key="ticketing"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <Icon icon="mdi:airplane-takeoff" className="w-8 h-8 text-blue-500 mr-3" />
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                    Réservation de Vols
                  </h2>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Avec notre service de billetterie expert, nous sélectionnons et réservons pour vous les meilleures options de vols.
                </p>
              </motion.div>
              <ReservationForm />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {(successMessage || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed bottom-8 right-8 z-50 max-w-sm"
            >
              <div className={`p-6 rounded-2xl shadow-2xl ${
                successMessage ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  <Icon 
                    icon={successMessage ? "mdi:check-circle" : "mdi:alert-circle"} 
                    className={`w-6 h-6 mr-3 ${successMessage ? 'text-green-500' : 'text-red-500'}`} 
                  />
                  <div>
                    <p className={`font-semibold ${successMessage ? 'text-green-800' : 'text-red-800'}`}>
                      {successMessage ? 'Succès !' : 'Erreur'}
                    </p>
                    <p className={`text-sm ${successMessage ? 'text-green-600' : 'text-red-600'}`}>
                      {successMessage || errorMessage}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSuccessMessage('');
                      setErrorMessage('');
                    }}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                  >
                    <Icon icon="mdi:close" className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default UnifiedReservation;