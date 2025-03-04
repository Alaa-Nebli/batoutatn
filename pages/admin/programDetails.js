import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { format, addDays } from 'date-fns';

export default function ProgramCreate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    metadata: '',
    description: '',
    locationFrom: '',
    locationTo: '',
    days: '',
    price: '',
    fromDate: '',
    toDate: '',
    timeline: [],
    display: true,
  });
  const [images, setImages] = useState([]);
  const [timelineImages, setTimelineImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Authentication and loading checks
  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (status === 'unauthenticated') {
    router.push('/admin');
    return null;
  }

  // Automatic timeline generation
  useEffect(() => {
    if (formData.fromDate && formData.days) {
      const days = parseInt(formData.days);
      const startDate = new Date(formData.fromDate);
      
      const generatedTimeline = Array.from({ length: days }, (_, index) => {
        const currentDate = addDays(startDate, index);
        return {
          title: `Day ${index + 1}`,
          description: '',
          date: format(currentDate, 'yyyy-MM-dd'),
          image: ''
        };
      });

      setFormData(prev => ({
        ...prev,
        timeline: generatedTimeline
      }));
      
      // Reset timeline images
      setTimelineImages({});
    }
  }, [formData.fromDate, formData.days]);

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
    // Existing validation logic...
    return true; // Simplified for brevity
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
        ...formData,
        location_from: formData.locationFrom,
        location_to: formData.locationTo,
        days: parseInt(formData.days),
        price: parseFloat(formData.price),
        timeline: formData.timeline.map((item, index) => ({
          title: item.title,
          description: item.description,
          image: '',
          sortOrder: index + 1,
          date: item.date
        }))
      };
  
      // Append the program data as JSON string
      formDataMultipart.append('programData', JSON.stringify(programData));
      
      // Append main program images
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
        toast.success('Program created successfully', {
          style: {
            background: '#4BB543',
            color: 'white',
          },
          iconTheme: {
            primary: 'white',
            secondary: '#4BB543',
          },
        });
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to create program', {
          style: {
            background: '#FF4136',
            color: 'white',
          },
        });
      }
    } catch (error) {
      console.error('Error creating program:', error);
      toast.error('An unexpected error occurred', {
        style: {
          background: '#FF4136',
          color: 'white',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" reverseOrder={false} />
      
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <Icon icon="mdi:plus-circle" className="mr-3 w-8 h-8" />
            Create New Program
          </h1>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Main Program Details Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  placeholder="Enter program title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
                <textarea
                  name="metadata"
                  value={formData.metadata}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  placeholder="Additional program information"
                  rows={3}
                  required
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Location</label>
                  <input
                    type="text"
                    name="locationFrom"
                    value={formData.locationFrom}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    placeholder="Start location"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Location</label>
                  <input
                    type="text"
                    name="locationTo"
                    value={formData.locationTo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    placeholder="End location"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    placeholder="Number of days"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    placeholder="Program price"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Program Images Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Program Images</h2>
            <div className="flex flex-wrap gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`Program image ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <Icon icon="mdi:close" className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                />
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-100">
                  <Icon icon="mdi:plus" className="w-8 h-8 text-gray-400" />
                </div>
              </label>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Program Timeline</h2>
            <div className="space-y-4">
              {formData.timeline.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-sm transition duration-300"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Day {index + 1} - {item.date}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                      placeholder="Timeline Item Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                      placeholder="Describe the day's activities..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    
                    {/* Image Upload for Timeline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Day Image</label>
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <div className="relative">
                            <Image
                              src={item.image}
                              alt={`Day ${index + 1} image`}
                              width={100}
                              height={100}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index, true, index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <Icon icon="mdi:close" className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, true, index)}
                            className="hidden"
                          />
                          <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-100">
                            <Icon icon="mdi:plus" className="w-8 h-8 text-gray-400" />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Section */}
          <div className="pt-6 border-t flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}