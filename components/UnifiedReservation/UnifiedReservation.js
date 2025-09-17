import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { VoyageForm } from '../ProgramReservation/ProgramReservation';
import { ReservationForm } from '../ReservationForm/ReservationForm';

const UnifiedReservation = () => {
  const [activeTab, setActiveTab] = useState('voyages'); // voyages or ticketing
  const [availableTrips, setAvailableTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form data state for the VoyageForm
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

  // Fetch available trips
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/programs.controller?active=true');
        const data = await response.json();
        setAvailableTrips(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setAvailableTrips([]);
      }
    };
    fetchTrips();
  }, []);

  // Carousel auto-play
  useEffect(() => {
    if (activeTab === 'voyages' && availableTrips.length > 3) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => 
          prev >= availableTrips.length - 3 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, availableTrips.length]);

  const handleTripSelect = (trip, action = 'reserve') => {
    setSelectedTrip(trip);
    if (action === 'reserve') {
      // Update form data with selected trip
      setFormData(prev => ({ ...prev, tripId: trip.id }));
      // Smooth scroll to form
      const formElement = document.getElementById('voyage-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Calculate price based on selected trip and form data
  const calculatePrice = () => {
    if (!selectedTrip) return 0;
    const basePrice = selectedTrip.price || 0;
    const persons = formData.numberOfPersons || 1;
    
    // Room type multipliers
    const roomMultiplier = {
      'single': 1.3,
      'double': 1,
      'triple': 0.8
    };
    
    return Math.round(basePrice * persons * (roomMultiplier[formData.roomType] || 1));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const reservationData = {
        ...formData,
        tripTitle: selectedTrip?.title,
        tripPrice: selectedTrip?.price,
        totalPrice: calculatePrice(),
        type: 'program'
      };

      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        setSuccessMessage('Votre demande a été envoyée avec succès! Nous vous contacterons bientôt.');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          numberOfPersons: 1,
          roomType: 'double',
          specialRequests: '',
          tripId: ''
        });
        setSelectedTrip(null);
      } else {
        throw new Error('Erreur lors de l\'envoi');
      }
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev >= availableTrips.length - 3 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev <= 0 ? Math.max(0, availableTrips.length - 3) : prev - 1
    );
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
  className="text-center mb-16"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  <h2 className="text-3xl md:text-5xl font-light mb-4 text-gray-900">
    Réservez votre{' '}
    <span className="font-medium bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
      prochaine aventure
    </span>
  </h2>
  <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light">
    Que ce soit un <span className="font-medium text-gray-800">voyage organisé clé en main</span> ou une <span className="font-medium text-gray-800">billetterie 100% personnalisée</span>, nous nous occupons de tout pour vous.
  </p>
</motion.div>

{/* Tab Navigation */}
<motion.div
  className="flex justify-center mb-16"
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6, delay: 0.1 }}
>
  <nav
    className="bg-white/70 backdrop-blur-xl p-1.5 rounded-2xl shadow-sm border border-gray-200/50"
    role="tablist"
  >
    <div className="flex space-x-1">
      <button
        onClick={() => {
          setActiveTab('voyages');
          setSuccessMessage('');
          setErrorMessage('');
        }}
        role="tab"
        aria-selected={activeTab === 'voyages'}
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
        onClick={() => {
          setActiveTab('ticketing');
          setSuccessMessage('');
          setErrorMessage('');
        }}
        role="tab"
        aria-selected={activeTab === 'ticketing'}
        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center text-sm ${
          activeTab === 'ticketing'
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
            : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50/50'
        }`}
      >
        <Icon icon="heroicons:paper-airplane" className="w-4 h-4 mr-2" />
        Billets
      </button>
    </div>
  </nav>
</motion.div>


        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'voyages' && (
            <motion.div
              key="voyages"
              id="voyages-panel"
              role="tabpanel"
              aria-labelledby="voyages-tab"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Minimalist Trips Showcase */}
              <div className="mb-20">
                
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-light text-gray-900">
                    Nos programmes
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevSlide}
                      aria-label="Programme précédent"
                      className="p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50"
                    >
                      <Icon icon="heroicons:chevron-left" className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                      onClick={nextSlide}
                      aria-label="Programme suivant"
                      className="p-2.5 rounded-full bg-white/80 hover:bg-white shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200/50"
                    >
                      <Icon icon="heroicons:chevron-right" className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Clean Card Layout */}
                <div className="relative">
                  <div className="flex space-x-6 transition-transform duration-700 ease-out">
                    {availableTrips.slice(currentSlide, currentSlide + 3).map((trip, index) => {
                      const isThird = index === 2;
                      return (
                        <motion.article
                          key={trip.id}
                          className={`relative bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden group transition-all duration-500 border border-gray-100/50 ${
                            isThird ? 'w-4/5 opacity-75' : 'w-full'
                          }`}
                          whileHover={{ y: -12, scale: 1.02 }}
                          itemScope
                          itemType="https://schema.org/TouristTrip"
                          style={{
                            boxShadow: '0 10px 20px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                          }}
                        >
                          <div className="relative h-72 overflow-hidden">
                            <Image
                              src={trip.images?.[0] || '/placeholder.jpg'}
                              alt={`${trip.title} - Voyage organisé`}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Enhanced Price Badge */}
                            <div className="absolute top-4 left-4">
                              <div className="bg-gradient-to-r from-white to-gray-50 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
                                <span className="text-sm font-bold text-gray-900">
                                  {trip.price?.toLocaleString('fr-FR')} TND
                                </span>
                              </div>
                            </div>

                            {/* Trip Duration Badge */}
                            <div className="absolute top-4 right-4">
                              <div className="bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                                <span className="text-xs font-semibold text-white">
                                  {trip.days} jours
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Card Content */}
                          <div className="p-6 bg-gradient-to-b from-white to-gray-50/50">
                            <h4 className="font-bold text-xl text-gray-900 mb-3 line-clamp-2 leading-tight">
                              {trip.title}
                            </h4>
                            <div className="flex items-center text-gray-600 mb-4">
                              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 mr-3">
                                <Icon icon="heroicons:map-pin" className="w-4 h-4 mr-1 text-orange-500" />
                                <span className="text-sm font-medium">{trip.location_from} → {trip.location_to}</span>
                              </div>
                            </div>
                            
                            {/* Always Visible Action Buttons */}
                            <div className="bottom-4 justify-self-end flex justify-between items-end">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleTripSelect(trip, 'details')}
                                  className="px-3 py-2 bg-white/95 hover:bg-white rounded-xl shadow-lg backdrop-blur-sm transition-all duration-200 flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                                >
                                  <Icon icon="heroicons:eye" className="w-4 h-4 mr-1" />
                                  Voir détails
                                </button>
                                <button
                                  onClick={() => handleTripSelect(trip, 'reserve')}
                                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-lg transition-all duration-200 flex items-center text-sm font-semibold"
                                >
                                  <Icon icon="heroicons:heart" className="w-4 h-4 mr-1" />
                                  Réserver
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                </div>

                {/* Minimal Indicators */}
                <div className="flex justify-center mt-8 space-x-2">
                  {Array.from({ length: Math.max(0, availableTrips.length - 2) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 bg-gradient-to-r from-orange-500 to-pink-500'
                          : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>

                {/* All Programs Link */}
                <div className="text-center mt-12">
                  <a
                    href="/programs"
                    className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-2xl transition-all duration-300 hover:scale-105"
                  >
                    Tous nos programmes
                    <Icon icon="heroicons:arrow-right" className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              {/* Modern Program Reservation Component */}
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
              id="ticketing-panel"
              role="tabpanel"
              aria-labelledby="ticketing-tab"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Modern Reservation Form Component */}
              <ReservationForm />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success/Error Messages */}
        <AnimatePresence>
          {(successMessage || errorMessage) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed bottom-8 right-8 z-50"
            >
              <div className={`p-6 rounded-2xl shadow-2xl max-w-md ${
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
