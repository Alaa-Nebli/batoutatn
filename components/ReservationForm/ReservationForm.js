import React, { useState, useEffect, useRef } from 'react';

export const ReservationForm = () => {
  const [typeOfTrip, setTypeOfTrip] = useState('one-way');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numberOfPersons, setNumberOfPersons] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const fromRef = useRef(null);
  const toRef = useRef(null);

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
          name,
          email,
          phone,
        }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || 'Failed to send reservation request.');
      }

      setTypeOfTrip('one-way');
      setFromLocation('');
      setToLocation('');
      setDepartureDate('');
      setReturnDate('');
      setNumberOfPersons(1);
      setName('');
      setEmail('');
      setPhone('');

      setSuccessMessage('Votre demande de réservation a bien été envoyée!');
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
    <div className="w-full px-4 py-4">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type de voyage
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 p-2"
                value={typeOfTrip}
                onChange={(e) => setTypeOfTrip(e.target.value)}
              >
                <option value="one-way">Aller simple</option>
                <option value="round-trip">Aller/Retour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Date de départ
              </label>
              <input
                type="date"
                className="w-full rounded-lg border border-gray-300 p-2"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </div>

            {typeOfTrip === 'round-trip' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date de retour
                </label>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 p-2"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative" ref={fromRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                De
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Aéroport de départ"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                required
              />
              {fromSuggestions.length > 0 && (
                <div className="absolute bg-white shadow-md rounded-b-md border border-gray-200 mt-0 w-full z-10">
                  {fromSuggestions.map((airport, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setFromLocation(airport.name);
                        setFromSuggestions([]);
                      }}
                    >
                      {airport.name}{' '}
                      <span className="text-gray-500">({airport.code})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={toRef}>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                À
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Aéroport de destination"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                required
              />
              {toSuggestions.length > 0 && (
                <div className="absolute bg-white shadow-md rounded-b-md border border-gray-200 mt-0 w-full z-10">
                  {toSuggestions.map((airport, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => {
                        setToLocation(airport.name);
                        setToSuggestions([]);
                      }}
                    >
                      {airport.name}{' '}
                      <span className="text-gray-500">({airport.code})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="sm:w-1/3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre de personnes
            </label>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-gray-300 p-2"
              value={numberOfPersons}
              onChange={(e) => setNumberOfPersons(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Nom/Prénom
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Votre nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="+216 99 999 999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all shadow-lg"
            >
              {loading ? 'Envoi...' : 'Réserver'}
            </button>
          </div>

          {/* Messages */}
          {errorMessage && (
            <p className="mt-4 text-red-600 font-medium text-center">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="mt-4 text-green-600 font-medium text-center">{successMessage}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ReservationForm;
