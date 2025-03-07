import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

export default function OfferDetails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    tripId: '',
    cta: ''
  });
  const [bannerImage, setBannerImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    // Fetch trips for the dropdown
    const fetchTrips = async () => {
      try {
        const response = await fetch('/api/programs.controller');
        if (response.ok) {
          const data = await response.json();
          setTrips(data);
        }
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    // Fetch featured offer data if editing
    const fetchOfferData = async () => {
      try {
        const response = await fetch(`/api/featured?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            tripId: data.tripId || '',
            cta: data.cta || ''
          });
          // Set preview URL for the existing image
          if (data.image) {
            setPreviewUrl(`/uploads/${data.image}`);
          }
        }
      } catch (error) {
        console.error('Error fetching featured offer:', error);
      }
    };

    fetchTrips();
    if (isEditing) {
      fetchOfferData();
    }
  }, [id, isEditing]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/admin');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBannerImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setBannerImage(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData object for file upload
      const submitFormData = new FormData();
      
      // Add the featured data as JSON
      submitFormData.append('featuredData', JSON.stringify(formData));
      
      // Add the banner image if provided
      if (bannerImage) {
        submitFormData.append('banner_image', bannerImage);
      }

      const url = `/api/featured${id ? `?id=${id}` : ''}`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitFormData,
        // Don't set Content-Type header, it will be set automatically with the boundary for FormData
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error saving featured offer:', error);
      // Here you might want to show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <h1 className="text-lg font-bold mb-4">
          {isEditing ? 'Edit Featured Offer' : 'Create New Featured Offer'}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Select Trip</label>
            <select
              name="tripId"
              value={formData.tripId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a trip</option>
              {trips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Banner Image {!isEditing && '(Required)'}</label>
            <div className="flex gap-4">
              {previewUrl && (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={240}
                    height={135}
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                  >
                    ×
                  </button>
                </div>
              )}
              {!previewUrl && (
                <label className="w-60 h-32 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    name="banner_image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    required={!isEditing}
                  />
                  <span className="text-gray-400">+ Add Banner Image</span>
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Call To Action Text</label>
            <input
              type="text"
              name="cta"
              value={formData.cta}
              onChange={handleInputChange}
              placeholder="e.g., Book Now, Learn More, Explore"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Update' : 'Create'} Featured Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}