import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export default function ProgramCreate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    metadata : '',
    description: '',
    locationFrom: '',
    locationTo: '',
    days: '',
    price: '',
    fromDate: '',
    toDate: '',
    timeline: [{ title: '', description: '', image: '' }],
    display: true, // Default to true for displaying the program
  });
  const [images, setImages] = useState([]);
  const [timelineImages, setTimelineImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  let imageUrls = [];
  // Authentication and loading checks
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/admin');
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index] = {
      ...newTimeline[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      timeline: newTimeline
    }));
  };

  const addTimelineItem = () => {
    setFormData(prev => ({
      ...prev,
      timeline: [...prev.timeline, { title: '', description: '', image: '' }]
    }));
  };

  const removeTimelineItem = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      timeline: prev.timeline.filter((_, index) => index !== indexToRemove)
    }));
    
    // Remove corresponding timeline image if exists
    const newTimelineImages = { ...timelineImages };
    delete newTimelineImages[indexToRemove];
    setTimelineImages(newTimelineImages);
  };

  const handleImageUpload = (e, isTimelineImage = false, timelineIndex) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    
    if (isTimelineImage && timelineIndex !== undefined) {
      // Timeline image upload
      setTimelineImages(prev => ({
        ...prev,
        [timelineIndex]: files[0]
      }));
      
      // Update timeline item image path (for display)
      const newTimeline = [...formData.timeline];
      newTimeline[timelineIndex].image = URL.createObjectURL(files[0]);
      setFormData(prev => ({
        ...prev,
        timeline: newTimeline
      }));
    } else {
      // Main program images upload
      setImages(prev => [...prev, ...files]);
    }
  };

  const removeImage = (index, isTimelineImage = false, timelineIndex) => {
    if (isTimelineImage && timelineIndex !== undefined) {
      // Remove timeline image
      const newTimelineImages = { ...timelineImages };
      delete newTimelineImages[timelineIndex];
      setTimelineImages(newTimelineImages);
      
      // Clear image in timeline
      const newTimeline = [...formData.timeline];
      newTimeline[timelineIndex].image = '';
      setFormData(prev => ({
        ...prev,
        timeline: newTimeline
      }));
    } else {
      // Remove main program image
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    // Validate all form fields 
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return false;
    }

    if (!formData.metadata.trim()) {
      toast.error('metadata is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }

    if (!formData.locationFrom.trim()) {
      toast.error('Location From is required');
      return false;
    }

    if (!formData.locationTo.trim()) {
      toast.error('Location To is required');
      return false;
    }

    if (!formData.fromDate) {
      toast.error('From Date is required');
      return false;
    }

    if (!formData.toDate) {
      toast.error('To Date is required');
      return false;
    }

    if (new Date(formData.fromDate) > new Date(formData.toDate)) {
      toast.error('From Date must be before To Date');
      return false;
    }

    const days = Number(formData.days);
    const price = Number(formData.price);
    
    if (isNaN(days) || days <= 0) {
      toast.error('Days must be a positive number');
      return false;
    }

    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a positive number');
      return false;
    }

    if (formData.timeline.length === 0) {
      toast.error('At least one timeline item is required');
      return false;
    }

    for (const item of formData.timeline) {
      if (!item.title.trim()) {
        toast.error('Timeline item title is required');
        return false;
      }
      if (!item.description.trim()) {
        toast.error('Timeline item description is required');
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
      
      // Create the program data object
      const programData = {
        title: formData.title,
        metadata: formData.metadata,
        description: formData.description,
        location_from: formData.locationFrom,
        location_to: formData.locationTo,
        days: parseInt(formData.days),
        price: parseFloat(formData.price),
        from_date: formData.fromDate,
        to_date: formData.toDate,
        display: formData.display,
        timeline: formData.timeline.map((item, index) => ({
          title: item.title,
          description: item.description,
          image: '',  // We'll handle images separately
          sort_order: index + 1
        }))
      };
  
      // Append the program data as JSON string
      formDataMultipart.append('programData', JSON.stringify(programData));
      
      // Append main program images with the correct field name
      images.forEach((file) => {
        formDataMultipart.append('program_images', file);
      });
      
      // Append timeline images
      Object.entries(timelineImages).forEach(([index, file]) => {
        formDataMultipart.append('timeline_images', file);
      });
  
      // Submit to API
      const response = await fetch('/api/programs.controller', {
        method: 'POST',
        body: formDataMultipart,
      });
      
      if (response.ok) {
        toast.success('Program created successfully');
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create program');
      }
    } catch (error) {
      console.error('Error creating program:', error);
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
          <h1 className="text-xl font-bold">Create New Program</h1>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium mb-2">Metadata </label>
              <textarea
                name="metadata"
                value={formData.metadata}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Images Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="flex flex-wrap gap-4">
                {imageUrls?.map((url, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={url}
                      alt={`Program image ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
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
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Icon icon="mdi:plus" className="w-6 h-6 text-gray-400" />
                </label>
              </div>
            </div>

            {/* Location Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location From</label>
                <input
                  type="text"
                  name="locationFrom"
                  value={formData.locationFrom}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Location To</label>
                <input
                  type="text"
                  name="locationTo"
                  value={formData.locationTo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Program Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Days</label>
                <input
                  type="number"
                  name="days"
                  value={formData.days}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* To Date Input */}
            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium">Program Timeline</label>
                <button
                  type="button"
                  onClick={addTimelineItem}
                  className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  <Icon icon="mdi:plus" className="w-5 h-5" />
                  Add Timeline Item
                </button>
              </div>
              <div className="space-y-4">
                {formData.timeline.map((item, index) => (
                  <div 
                    key={index} 
                    className="relative border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Timeline Item {index + 1}
                      </label>
                      {formData.timeline.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimelineItem(index)}
                          className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-full"
                        >
                          <Icon icon="mdi:trash" className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                        placeholder="Timeline Item Title"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                      <textarea
                        value={item.description}
                        onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                        placeholder="Describe the timeline item..."
                        rows={3}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium mb-2">Timeline Item Image</label>
                        <div className="flex flex-wrap gap-4">
                          {item.image && (
                            <div className="relative">
                              <Image
                                src={item.image}
                                alt={`Timeline item ${index + 1} image`}
                                className="w-24 h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index, true)}
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
                              onChange={(e) => handleImageUpload(e, true)}
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
                {isSubmitting ? 'Creating...' : 'Create Program'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}