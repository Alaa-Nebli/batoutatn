"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { format, addDays } from 'date-fns';

// Define types for better type safety
interface TimelineItem {
  title: string;
  description: string;
  date: string;
  image: string;
}

interface FormData {
  title: string;
  metadata: string;
  description: string;
  locationFrom: string;
  locationTo: string;
  days: string;
  price: string;
  fromDate: string;
  toDate: string;
  timeline: TimelineItem[];
  display: boolean;
}

export default function ProgramCreate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Initial state with type annotation
  const [formData, setFormData] = useState<FormData>({
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

  // Use more specific type for images
  const [images, setImages] = useState<File[]>([]);
  const [timelineImages, setTimelineImages] = useState<{[key: number]: File}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate timeline when days and fromDate change
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

  // Authentication check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  // Handle input changes with type safety
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Handle timeline changes with type safety
  const handleTimelineChange = useCallback((index: number, field: keyof TimelineItem, value: string) => {
    setFormData(prev => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = {
        ...newTimeline[index],
        [field]: value
      };
      return {
        ...prev,
        timeline: newTimeline
      };
    });
  }, []);

  // Improved image upload handler
  const handleImageUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>, 
    isTimelineImage = false, 
    timelineIndex?: number
  ) => {
    try {
      // Null check for files
      const files = e.target.files ? Array.from(e.target.files) : [];
      
      if (files.length === 0) {
        toast.error('No files selected');
        return;
      }

      // Validate files
      const validFiles = files.filter(file => {
        // Check image type
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image`);
          return false;
        }
        
        // Check file size
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 5MB)`);
          return false;
        }
        
        return true;
      });

      if (validFiles.length === 0) return;

      if (isTimelineImage && timelineIndex !== undefined) {
        // Timeline image upload
        if (validFiles.length > 1) {
          toast.error('Only one image allowed per timeline day');
          return;
        }

        const file = validFiles[0];
        const objectUrl = URL.createObjectURL(file);

        setTimelineImages(prev => ({
          ...prev,
          [timelineIndex]: file
        }));
        
        setFormData(prev => {
          const newTimeline = [...prev.timeline];
          newTimeline[timelineIndex] = {
            ...newTimeline[timelineIndex],
            image: objectUrl
          };
          return {
            ...prev,
            timeline: newTimeline
          };
        });
      } else {
        // Main program images upload
        setImages(prev => {
          // Filter out duplicates
          const newFiles = validFiles.filter(
            file => !prev.some(existing => existing.name === file.name)
          );
          
          if (newFiles.length !== validFiles.length) {
            toast.error('Some duplicate files were skipped');
          }
          
          return [...prev, ...newFiles];
        });
      }

      // Reset file input
      e.target.value = '';
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast.error('Failed to process image upload');
    }
  }, []);

  // Remove image handler
  const removeImage = useCallback((
    index: number, 
    isTimelineImage = false, 
    timelineIndex?: number
  ) => {
    if (isTimelineImage && timelineIndex !== undefined) {
      // Remove timeline image
      setTimelineImages(prev => {
        const newTimelineImages = { ...prev };
        delete newTimelineImages[timelineIndex];
        return newTimelineImages;
      });
      
      // Clear image in timeline
      setFormData(prev => {
        const newTimeline = [...prev.timeline];
        if (newTimeline[timelineIndex]) {
          // Revoke previous object URL if exists
          if (newTimeline[timelineIndex].image) {
            URL.revokeObjectURL(newTimeline[timelineIndex].image);
          }
          
          newTimeline[timelineIndex] = {
            ...newTimeline[timelineIndex],
            image: ''
          };
        }
        return {
          ...prev,
          timeline: newTimeline
        };
      });
    } else {
      // Remove main program image
      // Revoke object URL if it exists
      const imageToRemove = images[index];
      if (imageToRemove) {
        const objectUrl = URL.createObjectURL(imageToRemove);
        URL.revokeObjectURL(objectUrl);
      }
      
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  }, [images]);

  // Validate form (placeholder implementation)
  const validateForm = useCallback(() => {
    // Add your validation logic here
    return true;
  }, []);

  // Submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataMultipart = new FormData();
      
      // Prepare program data
      const programData = {
        ...formData,
        location_from: formData.locationFrom,
        location_to: formData.locationTo,
        days: parseInt(formData.days),
        price: parseFloat(formData.price),
        timeline: formData.timeline.map((item, index) => ({
          title: item.title,
          description: item.description,
          image: '', // Remove local object URLs
          sortOrder: index + 1,
          date: item.date
        }))
      };

      // Append data to FormData
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
  }, [formData, images, timelineImages, router, validateForm]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      // Clean up main program images
      images.forEach(file => {
        const objectUrl = URL.createObjectURL(file);
        URL.revokeObjectURL(objectUrl);
      });

      // Clean up timeline images
      formData.timeline.forEach(item => {
        if (item.image) {
          URL.revokeObjectURL(item.image);
        }
      });
    };
  }, [images, formData.timeline]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // Render the form (rest of the component remains the same as in your original code)
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
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
                  placeholder="Additional program information"
                  rows={3}
                  required
                />
              </div>
          {/* Main Program Images Section */}
          <div className="mt-8">
                      <h2 className="text-xl font-semibold text-gray-800 mb-4">Program Images</h2>
                      <div className="flex flex-wrap gap-4">
                        {images.map((image, index) => (
                          <div key={image.name} className="relative">
                            <Image
                              src={URL.createObjectURL(image)}
                              alt={`Program image ${index + 1}`}
                              width={100}
                              height={100}
                              className="w-24 h-24 object-cover rounded-lg"
                              // Add onLoadingComplete to release object URL
                              onLoadingComplete={(img) => {
                                // Trigger URL revocation after image is loaded
                                URL.revokeObjectURL(img.src);
                              }}
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