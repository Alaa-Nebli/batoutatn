import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export default function TravelOnCardCreate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    metadata: '',
    description: '',
    country: '',
    city: '',
    duration: '',
    price_from: '',
    highlights: '',
    includes: '',
    excludes: '',
    attractions: [{ title: '', description: '', price: '', duration: '', sort_order: 1 }],
    display: true, // Default to true for displaying
  });
  
  const [voyageImages, setVoyageImages] = useState([]);
  const [attractionImages, setAttractionImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [previewAttractionImages, setPreviewAttractionImages] = useState({});

  // Authentication and loading checks
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/admin');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAttractionChange = (index, field, value) => {
    const newAttractions = [...formData.attractions];
    newAttractions[index] = {
      ...newAttractions[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      attractions: newAttractions
    }));
  };

  const addAttractionItem = () => {
    setFormData(prev => ({
      ...prev,
      attractions: [
        ...prev.attractions, 
        { 
          title: '', 
          description: '', 
          price: '', 
          duration: '', 
          sort_order: prev.attractions.length + 1 
        }
      ]
    }));
  };

  const removeAttractionItem = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      attractions: prev.attractions.filter((_, index) => index !== indexToRemove)
    }));
    
    // Remove corresponding attraction image if exists
    const newAttractionImages = { ...attractionImages };
    delete newAttractionImages[indexToRemove];
    setAttractionImages(newAttractionImages);
    
    // Remove preview image
    const newPreviewAttractionImages = { ...previewAttractionImages };
    delete newPreviewAttractionImages[indexToRemove];
    setPreviewAttractionImages(newPreviewAttractionImages);
  };

  const handleVoyageImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      // Add files to state
      setVoyageImages(prev => [...prev, ...files]);
      
      // Create preview URLs
      const newPreviewUrls = files.map(file => URL.createObjectURL(file as Blob));
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
    }
  };

  const handleAttractionImageUpload = (e: React.ChangeEvent<HTMLInputElement>, attractionIndex: number) => {
      const files = Array.from(e.target.files || []) as Blob[];
      if (files.length > 0) {
        // Store file for upload
        setAttractionImages(prev => ({
          ...prev,
          [attractionIndex]: files[0]
        }));
        
        // Create preview URL
        setPreviewAttractionImages(prev => ({
          ...prev,
          [attractionIndex]: URL.createObjectURL(files[0])
        }));
      }
    };

  const removeVoyageImage = (index) => {
    // Remove file
    setVoyageImages(prev => prev.filter((_, i) => i !== index));
    
    // Remove preview and revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeAttractionImage = (attractionIndex) => {
    // Remove file
    const newAttractionImages = { ...attractionImages };
    delete newAttractionImages[attractionIndex];
    setAttractionImages(newAttractionImages);
    
    // Remove preview and revoke object URL
    if (previewAttractionImages[attractionIndex]) {
      URL.revokeObjectURL(previewAttractionImages[attractionIndex]);
      const newPreviewImages = { ...previewAttractionImages };
      delete newPreviewImages[attractionIndex];
      setPreviewAttractionImages(newPreviewImages);
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    
    if (!formData.country.trim()) {
      toast.error('Country is required');
      return false;
    }
    
    if (!formData.city.trim()) {
      toast.error('City is required');
      return false;
    }
    
    const price = Number(formData.price_from);
    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }
    
    if (voyageImages.length === 0) {
      toast.error('At least one voyage image is required');
      return false;
    }
    
    if (formData.attractions.length === 0) {
      toast.error('At least one attraction is required');
      return false;
    }
    
    // ignore eslint warning
    // eslint-disable-next-line no-unused-vars
    for (const [index, item] of formData.attractions.entries()) {
      if (!item.title.trim()) {
        toast.error(`Attraction ${index + 1} title is required`);
        return false;
      }
      if (!item.description.trim()) {
        toast.error(`Attraction ${index + 1} description is required`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const formDataMultipart = new FormData();
      
      // Create the voyage data object
      const voyageData = {
        title: formData.title,
        subtitle: formData.subtitle,
        metadata: formData.metadata,
        description: formData.description,
        country: formData.country,
        city: formData.city,
        duration: formData.duration,
        price_from: parseFloat(formData.price_from),
        highlights: formData.highlights,
        includes: formData.includes,
        excludes: formData.excludes,
        display: formData.display,
        attractions: formData.attractions.map((item, index) => ({
          title: item.title,
          description: item.description,
          price: item.price ? parseFloat(item.price) : null,
          duration: item.duration,
          sort_order: index + 1
        }))
      };
  
      // Append the voyage data as JSON string
      formDataMultipart.append('voyageData', JSON.stringify(voyageData));
      
      // Append voyage images
      voyageImages.forEach((file) => {
        formDataMultipart.append('voyage_images', file);
      });
      
      // Append attraction images
      Object.entries(attractionImages).forEach(([index, file]) => {
        formDataMultipart.append('attraction_images', file as Blob);
      });
  
      // Submit to API
      const response = await fetch('/api/voyages.controller', {
        method: 'POST',
        body: formDataMultipart,
      });
      
      if (response.ok) {
        toast.success('Voyage created successfully');
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create voyage');
      }
    } catch (error) {
      console.error('Error creating voyage:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b p-6">
          <h1 className="text-xl font-bold">Create New Voyage à la Carte</h1>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Metadata */}
            <div>
              <label className="block text-sm font-medium mb-2">Metadata (SEO)</label>
              <textarea
                name="metadata"
                value={formData.metadata}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Trip Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  placeholder="e.g. 5 days / 4 nights"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price From (€) *</label>
                <input
                  type="number"
                  name="price_from"
                  value={formData.price_from}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Highlights, Includes, Excludes */}
            <div>
              <label className="block text-sm font-medium mb-2">Highlights</label>
              <textarea
                name="highlights"
                value={formData.highlights}
                onChange={handleInputChange}
                rows={3}
                placeholder="Enter each highlight on a new line"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Includes</label>
                <textarea
                  name="includes"
                  value={formData.includes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter each included item on a new line"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Excludes</label>
                <textarea
                  name="excludes"
                  value={formData.excludes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Enter each excluded item on a new line"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Voyage Images *</label>
              <div className="flex flex-wrap gap-4">
                {previewImages.map((url, index) => (
                  <div key={index} className="relative">
                    <div className="w-24 h-24 overflow-hidden rounded-lg border">
                      <img
                        src={url}
                        alt={`Voyage image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVoyageImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                    >
                      <Icon icon="mdi:close" className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleVoyageImageUpload}
                    className="hidden"
                  />
                  <Icon icon="mdi:plus" className="w-6 h-6 text-gray-400" />
                </label>
              </div>
            </div>

            {/* Display Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="display"
                name="display"
                checked={formData.display}
                onChange={handleInputChange}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="display" className="text-sm font-medium">
                Display this voyage on the website
              </label>
            </div>

            {/* Attractions Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Attractions *</label>
                <button
                  type="button"
                  onClick={addAttractionItem}
                  className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <Icon icon="mdi:plus" className="w-5 h-5" />
                  Add Attraction
                </button>
              </div>
              <div className="space-y-6">
                {formData.attractions.map((item, index) => (
                  <div 
                    key={index} 
                    className="relative border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        Attraction {index + 1}
                      </h3>
                      {formData.attractions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAttractionItem(index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full"
                        >
                          <Icon icon="mdi:trash" className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleAttractionChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleAttractionChange(index, 'description', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Price (€)</label>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handleAttractionChange(index, 'price', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Duration</label>
                          <input
                            type="text"
                            value={item.duration}
                            onChange={(e) => handleAttractionChange(index, 'duration', e.target.value)}
                            placeholder="e.g. 2 hours"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Attraction Image</label>
                        <div className="flex items-center gap-4">
                          {previewAttractionImages[index] && (
                            <div className="relative">
                              <div className="w-24 h-24 overflow-hidden rounded-lg border">
                                <img
                                  src={previewAttractionImages[index]}
                                  alt={`Attraction ${index + 1} image`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttractionImage(index)}
                                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
                              >
                                <Icon icon="mdi:close" className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleAttractionImageUpload(e, index)}
                              className="hidden"
                            />
                            <Icon icon="mdi:plus" className="w-6 h-6 text-gray-400" />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded-lg ${
                  isSubmitting 
                    ? 'bg-blue-300 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600'
                }`}
              >
                {isSubmitting ? 'Creating...' : 'Create Voyage'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}