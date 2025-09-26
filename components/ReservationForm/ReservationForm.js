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
      const res = await fetch('/api/ticketing-reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          departureCity: fromLocation,
          arrivalCity: toLocation,
          departureDate,
          returnDate: typeOfTrip === 'round-trip' ? returnDate : null,
          passengers: numberOfPersons,
          classType,
          specialRequests: ''
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Erreur lors de l\'envoi');
      }

      const data = await res.json();
      setSuccessMessage(data.message || 'Demande envoyée avec succès!');

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
      <div className="relative max-w-7xl mx-auto">
        {/* Enhanced Single Form - Always Visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <Icon icon="mdi:airplane" className="w-8 h-8 mr-3" />
                <div className="text-center">
                  <h3 className="text-2xl font-bold mt-7">Trouvez les meilleurs tarifs pour votre vol</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Flight Details Section */}
            <div className="space-y-6">
              <div className="flex items-center mb-4">
                <Icon icon="mdi:airplane-takeoff" className="w-6 h-6 text-blue-500 mr-3" />
                <h4 className="text-lg font-bold text-gray-800">Détails du vol</h4>
              </div>
              
              {/* From and To locations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative" ref={fromRef}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Icon icon="mdi:airplane-takeoff" className="inline w-4 h-4 mr-1" />
                    Ville de départ *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ville ou aéroport de départ"
                    value={fromLocation}
                    onChange={(e) => {
                      setFromLocation(e.target.value);
                      handleLocationSearch(e.target.value, setFromSuggestions);
                    }}
                    required
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
                    Destination *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Ville ou aéroport de destination"
                    value={toLocation}
                    onChange={(e) => {
                      setToLocation(e.target.value);
                      handleLocationSearch(e.target.value, setToSuggestions);
                    }}
                    required
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
              </div>

              {/* Trip Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Icon icon="mdi:swap-horizontal" className="inline w-4 h-4 mr-1" />
                    Type de voyage *
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={typeOfTrip}
                    onChange={(e) => setTypeOfTrip(e.target.value)}
                    required
                  >
                    <option value="one-way">Aller simple</option>
                    <option value="round-trip">Aller/Retour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Icon icon="mdi:calendar" className="inline w-4 h-4 mr-1" />
                    Date de départ *
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {typeOfTrip === 'round-trip' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Icon icon="mdi:calendar" className="inline w-4 h-4 mr-1" />
                      Date de retour *
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
                    <Icon icon="mdi:account-multiple" className="inline w-4 h-4 mr-1" />
                    Nombre de passagers *
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={numberOfPersons}
                    onChange={(e) => setNumberOfPersons(parseInt(e.target.value))}
                    required
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
                  <Icon icon="mdi:seat-flat" className="inline w-4 h-4 mr-1" />
                  Classe de voyage *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { value: 'economy', label: 'Économique', icon: 'mdi:seat-recline-normal', desc: 'Confort standard'},
                    { value: 'premium', label: 'Premium Eco', icon: 'mdi:seat-legroom-extra', desc: 'Plus d\'espace'},
                    { value: 'business', label: 'Business', icon: 'mdi:seat-flat', desc: 'Luxe et confort'},
                    { value: 'first', label: 'Première', icon: 'mdi:crown', desc: 'Excellence absolue'}
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        classType === option.value
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                      onClick={() => setClassType(option.value)}
                    >
                      <div className="flex items-center mb-2">
                        <Icon icon={option.icon} className="w-6 h-6 text-blue-500 mr-2" />
                        <span className="font-semibold text-sm">{option.label}</span>
                      </div>
                      <input
                        type="radio"
                        name="classType"
                        value={option.value}
                        checked={classType === option.value}
                        onChange={() => setClassType(option.value)}
                        className="absolute top-3 right-3"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
              <div className="flex items-center mb-4">
                <Icon icon="mdi:account" className="w-6 h-6 text-blue-500 mr-3" />
                <h4 className="text-lg font-bold text-gray-800">Informations personnelles</h4>
              </div>

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
                    Nom de famille *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Votre nom de famille"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Icon icon="mdi:email" className="inline w-4 h-4 mr-1" />
                    Adresse e-mail *
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
                    <Icon icon="mdi:phone" className="inline w-4 h-4 mr-1" />
                    Numéro de téléphone *
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
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-4 px-12 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none flex items-center text-lg"
              >
                {loading ? (
                  <>
                    <Icon icon="mdi:loading" className="w-6 h-6 mr-3 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Icon icon="mdi:send" className="w-6 h-6 mr-3" />
                    Envoyer ma demande
                  </>
                )}
              </button>
            </div>

            {/* Messages */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl"
              >
                <div className="flex items-center">
                  <Icon icon="mdi:alert-circle" className="w-5 h-5 mr-2" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-xl"
              >
                <div className="flex items-center">
                  <Icon icon="mdi:check-circle" className="w-5 h-5 mr-2" />
                  <span className="font-medium">{successMessage}</span>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationForm;
