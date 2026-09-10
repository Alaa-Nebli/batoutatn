import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const VoyageForm = ({ 
  trips = [], 
  selectedTrip, 
  formData, 
  setFormData, 
  setSelectedTrip, 
  onSubmit, 
  loading, 
  calculatePrice 
}) => {
  
  // Gestion de la saisie
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // On s'assure que le nombre de personnes est bien un entier pour le calcul du prix
    const val = name === 'numberOfPersons' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  // Gestion du changement de voyage (Uniquement si plusieurs voyages sont disponibles)
  const handleTripSelect = (e) => {
    const tripId = e.target.value;
    const trip = trips.find(t => t.id === tripId);
    setSelectedTrip(trip);
    setFormData(prev => ({ ...prev, tripId }));
  };

  const selectedTripData = selectedTrip || trips.find(trip => trip.id === formData.tripId);
  const nightsCount = Number(selectedTripData?.nights ?? Math.max(Number(selectedTripData?.days || 1) - 1, 0));
  const needsRoomType = Boolean(
    selectedTripData &&
    (nightsCount > 0 || ['WEEKEND', 'MULTI_DAY_CIRCUIT'].includes(selectedTripData.type))
  );
  const estimatedTotal = selectedTripData && typeof calculatePrice === 'function' ? calculatePrice() : 0;
  const currency = selectedTripData?.currency || 'TND';
  const ctaLabel = needsRoomType ? 'Demander disponibilite' : 'Reserver ma place';
  const formatShortDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  };
  
  // Si on passe un seul voyage en paramètre, on masque la sélection pour simplifier
  const isSingleTrip = trips.length === 1;
  const fieldGridClass = "grid grid-cols-1 sm:grid-cols-2 gap-3";
  const labelClass = "block text-sm font-bold text-gray-900 mb-1.5 pl-0.5";
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-gray-900 text-base rounded-xl px-4 py-3 focus:ring-4 focus:ring-orange-600/10 focus:border-orange-600 focus:bg-white outline-none transition-all shadow-sm";
  const selectClass = `${inputClass} cursor-pointer`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full font-sans"
      itemScope
      itemType="https://schema.org/TravelAction"
    >
      <form onSubmit={onSubmit} className="space-y-3.5">
        {selectedTripData && (
          <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-orange-700">
              Programme selectionne
            </p>
            <p className="mt-1 text-base font-extrabold leading-snug text-gray-950">
              {selectedTripData.title}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
              <span className="inline-flex items-center gap-1.5">
                <Icon icon="mdi:account-group-outline" className="h-4 w-4 text-orange-600" />
                {formData.numberOfPersons || 1} personne{Number(formData.numberOfPersons || 1) > 1 ? 's' : ''}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon icon="mdi:calendar-range" className="h-4 w-4 text-orange-600" />
                {selectedTripData.isDateFlexible
                  ? 'Date flexible'
                  : `${formatShortDate(selectedTripData.from_date)}${selectedTripData.to_date ? ` - ${formatShortDate(selectedTripData.to_date)}` : ''}`}
              </span>
            </div>
          </div>
        )}
        
        {/* ── SÉLECTION DU VOYAGE (Caché si un seul voyage) ── */}
        {!isSingleTrip && (
          <div>
            <label className={labelClass}>
              Programme sélectionné
            </label>
            <select
              value={selectedTrip?.id || ''}
              onChange={handleTripSelect}
              className={selectClass}
              required
            >
              <option value="">Choisir un programme</option>
              {trips.map(trip => (
                <option key={trip.id} value={trip.id}>
                  {trip.title} - {trip.price?.toLocaleString('fr-FR')} TND
                </option>
              ))}
            </select>
          </div>
        )}

        {/* ── INFORMATIONS PERSONNELLES ── */}
        <div className={needsRoomType ? fieldGridClass : "grid grid-cols-1 gap-3"}>
          <div>
            <label className={labelClass}>Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Ex: Ali"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Ex: Ben Salah"
              required
            />
          </div>
        </div>

        <div className={fieldGridClass}>
          <div>
            <label className={labelClass}>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Ex: 99 999 999"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="votre@email.com"
              required
            />
          </div>
        </div>

        {/* ── DÉTAILS DU VOYAGE ── */}
        <div className={fieldGridClass}>
          <div>
            <label className={labelClass}>Personnes</label>
            <select
              name="numberOfPersons"
              value={formData.numberOfPersons}
              onChange={handleInputChange}
              className={selectClass}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          {needsRoomType && (
            <div>
              <label className={labelClass}>Type de chambre</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleInputChange}
                className={selectClass}
              >
                <option value="double">Chambre Double</option>
                <option value="single">Chambre Individuelle (Single)</option>
                <option value="triple">Chambre Triple</option>
              </select>
            </div>
          )}
        </div>

        {/* ── DEMANDES SPÉCIALES ── */}
        <div>
          <label className={labelClass}>Demandes spéciales (Optionnel)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            rows="2"
            className={`${inputClass} resize-none`}
            placeholder="Régime alimentaire, préférence de chambre..."
          />
        </div>

        {/* ── RÉSUMÉ DU PRIX ESTIMÉ ── */}
        {selectedTripData && (
          <div className="bg-gray-900 rounded-2xl p-4 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl shadow-gray-900/10">
            <div>
              <p className="text-gray-400 font-semibold mb-1 uppercase tracking-wider text-xs">Total indicatif</p>
              <p className="text-white font-medium text-sm">
                {formData.numberOfPersons} personne{formData.numberOfPersons > 1 ? 's' : ''} <span className="text-gray-500 mx-1">•</span> {
                  needsRoomType
                    ? formData.roomType === 'double' ? 'Chambre Double' : formData.roomType === 'single' ? 'Chambre Single' : 'Chambre Triple'
                    : 'Place programme'
                }
              </p>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-2xl font-extrabold text-orange-500 leading-none" itemProp="priceSpecification">
                {estimatedTotal.toLocaleString('fr-FR')}
                <span className="text-base font-medium text-gray-400 ml-1.5">{currency}</span>
              </p>
            </div>
          </div>
        )}

        {/* ── BOUTON DE VALIDATION ── */}
        <div className="pt-1">
          <button
            type="submit"
            disabled={loading || !selectedTripData}
            className="w-full bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold text-lg py-4 px-5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-orange-600/20"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Validation en cours...</span>
              </>
            ) : (
              <>
                <Icon icon="mdi:paperplane" className="w-5 h-5" />
                <span>{ctaLabel}</span>
              </>
            )}
          </button>
        
        </div>

      </form>
    </motion.div>
  );
};

export default VoyageForm;
