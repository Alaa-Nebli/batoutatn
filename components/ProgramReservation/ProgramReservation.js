import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

export const VoyageForm = ({ trips, selectedTrip, formData, setFormData, setSelectedTrip, onSubmit, loading, calculatePrice }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTripSelect = (e) => {
    const tripId = e.target.value;
    const trip = trips.find(t => t.id === tripId);
    setSelectedTrip(trip);
  };

  const selectedTripData = selectedTrip || trips.find(trip => trip.id === formData.tripId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      itemScope
      itemType="https://schema.org/TravelAction"
    >
      {/* Minimal Header */}
      <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-orange-500 to-orange-400">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
            <Icon icon="heroicons:globe-europe-africa" className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg mt-5 font-semibold text-white">Réservez votre prochaine aventure</h2>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="p-8 space-y-6">
        {/* Trip Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Programme sélectionné
          </label>
          <select
            value={selectedTrip?.id || ''}
            onChange={handleTripSelect}
            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
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

        {/* Selected Trip Info - Minimalist */}
        {selectedTripData && (
          <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100/50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedTripData.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Icon icon="heroicons:calendar-days" className="w-4 h-4 mr-1" />
                    {selectedTripData.days} jours
                  </span>
                  <span className="flex items-center">
                    <Icon icon="heroicons:map-pin" className="w-4 h-4 mr-1" />
                    {selectedTripData.location_to}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">
                  {selectedTripData.price?.toLocaleString('fr-FR')}
                  <span className="text-sm text-gray-500 ml-1">TND</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Clean Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Prénom</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
              placeholder="Votre prénom"
              required
              itemProp="agent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Nom</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
              placeholder="Votre nom"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
              placeholder="votre@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
              placeholder="+216 99 999 999"
              required
            />
          </div>
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Nombre de personnes</label>
            <select
              name="numberOfPersons"
              value={formData.numberOfPersons}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
            >
              {[1,2,3,4,5,6,7,8].map(num => (
                <option key={num} value={num}>{num} personne{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Type de chambre</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50"
            >
              <option value="double">Chambre double</option>
              <option value="single">Chambre single</option>
              <option value="triple">Chambre triple</option>
            </select>
          </div>
        </div>

        {/* Special Requests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Demandes spéciales (optionnel)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleInputChange}
            rows="3"
            className="w-full rounded-2xl border border-gray-200 px-4 py-3.5 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-gray-50/50 resize-none"
            placeholder="Régimes alimentaires, préférences particulières..."
          />
        </div>

        {/* Clean Price Summary */}
        {selectedTripData && (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Prix total estimé</p>
                <p className="text-xs text-gray-500">
                  {formData.numberOfPersons} personne{formData.numberOfPersons > 1 ? 's' : ''} • {
                    formData.roomType === 'double' ? 'Chambre double' : 
                    formData.roomType === 'single' ? 'Chambre single' : 'Chambre triple'
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900" itemProp="priceSpecification">
                  {calculatePrice().toLocaleString('fr-FR')}
                  <span className="text-sm text-gray-500 ml-1">TND</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Minimalist Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !selectedTripData}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Icon icon="heroicons:paper-airplane" className="w-4 h-4" />
                <span>Envoyer la demande</span>
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default VoyageForm;
