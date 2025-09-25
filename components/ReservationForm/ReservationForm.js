import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';

export const ReservationForm = () => {
  const [typeOfTrip, setTypeOfTrip] = useState('one-way');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [classType, setClassType] = useState('economy');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Sample airport data - you can replace with API call
  const airports = [
    { name: 'Aéroport Tunis-Carthage', code: 'TUN' },
    { name: 'Aéroport de Paris-Charles de Gaulle', code: 'CDG' },
    { name: 'Aéroport de Londres-Heathrow', code: 'LHR' },
    { name: 'Aéroport de Rome-Fiumicino', code: 'FCO' },
    { name: 'Aéroport de Madrid-Barajas', code: 'MAD' },
    { name: 'Aéroport de Francfort', code: 'FRA' },
    { name: 'Aéroport de Dubai', code: 'DXB' },
    { name: 'Aéroport de Casablanca', code: 'CMN' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setFromSuggestions([]);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setToSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLocationSearch = (value, setSuggestions) => {
    if (value.length > 2) {
      const filtered = airports.filter(airport => 
        airport.name.toLowerCase().includes(value.toLowerCase()) ||
        airport.code.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/ticketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          typeOfTrip,
          fromLocation,
          toLocation,
          departureDate,
          returnDate,
          numberOfPersons,
          name: `${firstName} ${lastName}`,
          firstName,
          lastName,
          email,
          phone,
          classType,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to send reservation request.');
      }

      // Reset form
      setTypeOfTrip('one-way');
      setFromLocation('');
      setToLocation('');
      setDepartureDate('');
      setReturnDate('');
      setNumberOfPersons(1);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setClassType('economy');

      setSuccessMessage('Votre demande de réservation de billet a bien été envoyée! Nous vous contacterons bientôt avec les meilleures options.');
    } catch (error) {
      console.error('Reservation error:', error);
      setErrorMessage(
        error.message || 'Une erreur est survenue lors de votre demande.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8">
      {/* Background with overlay */}
      
      <div className="relative max-w-7xl mx-auto">
        

        {/* Quick Search Bar */}
        {!showForm && (
          <motion.div
            className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="relative" ref={fromRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Icon icon="mdi:airplane-takeoff" className="inline w-4 h-4 mr-1" />
                  De
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ville ou aéroport"
                  value={fromLocation}
                  onChange={(e) => {
                    setFromLocation(e.target.value);
                    handleLocationSearch(e.target.value, setFromSuggestions);
                  }}
                />
                {fromSuggestions.length > 0 && (
                  <div className="absolute bg-white shadow-lg rounded-xl border border-gray-200 mt-1 w-full z-10 max-h-60 overflow-y-auto">
                    {fromSuggestions.map((airport, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setFromLocation(airport.name);
                          setFromSuggestions([]);
                        }}
                      >
                        <div className="font-medium">{airport.name}</div>
                        <div className="text-gray-500 text-xs">{airport.code}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={toRef}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Icon icon="mdi:airplane-landing" className="inline w-4 h-4 mr-1" />
                  À
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ville ou aéroport"
                  value={toLocation}
                  onChange={(e) => {
                    setToLocation(e.target.value);
                    handleLocationSearch(e.target.value, setToSuggestions);
                  }}
                />
                {toSuggestions.length > 0 && (
                  <div className="absolute bg-white shadow-lg rounded-xl border border-gray-200 mt-1 w-full z-10 max-h-60 overflow-y-auto">
                    {toSuggestions.map((airport, index) => (
                      <div
                        key={index}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-0"
                        onClick={() => {
                          setToLocation(airport.name);
                          setToSuggestions([]);
                        }}
                      >
                        <div className="font-medium">{airport.name}</div>
                        <div className="text-gray-500 text-xs">{airport.code}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Icon icon="mdi:calendar" className="inline w-4 h-4 mr-1" />
                  Départ
                </label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <button
                  onClick={() => setShowForm(true)}
                  disabled={!fromLocation || !toLocation || !departureDate}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center justify-center"
                >
                  <Icon icon="mdi:magnify" className="w-5 h-5 mr-2" />
                  Rechercher
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon icon="mdi:airplane" className="w-8 h-8 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold">Détails de votre vol</h3>
                      <p className="text-blue-100">{fromLocation} → {toLocation}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <Icon icon="mdi:close" className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Trip Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type de voyage
                    </label>
                    <select
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={typeOfTrip}
                      onChange={(e) => setTypeOfTrip(e.target.value)}
                    >
                      <option value="one-way">Aller simple</option>
                      <option value="round-trip">Aller/Retour</option>
                    </select>
                  </div>

                  {typeOfTrip === 'round-trip' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date de retour
                      </label>
                      <input
                        type="date"
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        min={departureDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre de passagers
                    </label>
                    <select
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      value={numberOfPersons}
                      onChange={(e) => setNumberOfPersons(e.target.value)}
                    >
                      {[1,2,3,4,5,6,7,8,9].map(num => (
                        <option key={num} value={num}>{num} passager{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Classe de voyage
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { value: 'economy', label: 'Économique', icon: 'mdi:seat-recline-normal', desc: 'Le meilleur rapport qualité-prix' },
                      { value: 'business', label: 'Affaires', icon: 'mdi:seat-flat', desc: 'Confort premium et services exclusifs' },
                      { value: 'first', label: 'Première', icon: 'mdi:crown', desc: 'Luxe et raffinement absolu' }
                    ].map((option) => (
                      <div
                        key={option.value}
                        className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          classType === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => setClassType(option.value)}
                      >
                        <div className="flex items-center mb-2">
                          <Icon icon={option.icon} className="w-6 h-6 text-blue-500 mr-2" />
                          <span className="font-semibold">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-600">{option.desc}</p>
                        <input
                          type="radio"
                          name="classType"
                          value={option.value}
                          checked={classType === option.value}
                          onChange={() => setClassType(option.value)}
                          className="absolute top-4 right-4"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre nom"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+216 99 999 999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center"
                  >
                    {loading ? (
                      <>
                        <Icon icon="mdi:loading" className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Icon icon="mdi:send" className="w-5 h-5 mr-2" />
                        Envoyer la demande
                      </>
                    )}
                  </button>
                </div>

                {/* Messages */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-center">
                    <Icon icon="mdi:alert-circle" className="w-5 h-5 inline mr-2" />
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl text-center">
                    <Icon icon="mdi:check-circle" className="w-5 h-5 inline mr-2" />
                    {successMessage}
                  </div>
                )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ReservationForm;
