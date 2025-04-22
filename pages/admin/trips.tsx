"use client";
import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { format, addDays } from 'date-fns';

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
  singleAdon: string; 
  fromDate: string;
  toDate: string;
  timeline: TimelineItem[];
  display: boolean;
  priceInclude: string;
  generalConditions: string;
  phone: string;
}

// Dynamically load ReactQuill (for Next.js):
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
// Import the Quill stylesheet:
import 'react-quill/dist/quill.snow.css';

export default function ProgramCreate() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    metadata: '',
    description: '',
    locationFrom: '',
    locationTo: '',
    days: '',
    price: '',
    singleAdon: '',
    fromDate: '',
    toDate: '',
    timeline: [],
    display: true,
    priceInclude: '',
    generalConditions: '',
    phone: ''
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [timelineImages, setTimelineImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (formData.fromDate && formData.days) {
      const days = parseInt(formData.days);
      if (!isNaN(days) && days > 0) {
        const startDate = new Date(formData.fromDate);
        const endDate = addDays(startDate, days - 1);
        
        const generatedTimeline = Array.from({ length: days }, (_, index) => {
          const currentDate = addDays(startDate, index);
          return {
            title: `Day ${index + 1}`,
            description: '', // now HTML from ReactQuill
            date: format(currentDate, 'yyyy-MM-dd'),
            image: ''
          };
        });

        setFormData(prev => ({
          ...prev,
          timeline: generatedTimeline,
          toDate: format(endDate, 'yyyy-MM-dd')
        }));
        
        setTimelineImages([]);
      }
    }
  }, [formData.fromDate, formData.days]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  const handleSimpleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'toDate') {
      toast.error('End date is automatically calculated from start date and duration');
      return;
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle ReactQuill for these big text fields
  const handleDescriptionChange = (value: string) => {
    // value is HTML
    setFormData(prev => ({ ...prev, description: value }));
  };

  const handlePriceIncludeChange = (value: string) => {
    setFormData(prev => ({ ...prev, priceInclude: value }));
  };

  const handleGeneralConditionsChange = (value: string) => {
    setFormData(prev => ({ ...prev, generalConditions: value }));
  };

  // For timeline day description changes
  const handleTimelineDescriptionChange = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = {
        ...newTimeline[index],
        description: value
      };
      return {
        ...prev,
        timeline: newTimeline
      };
    });
  }, []);

  const handleTimelineTitleChange = useCallback((index: number, value: string) => {
    setFormData(prev => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = {
        ...newTimeline[index],
        title: value
      };
      return {
        ...prev,
        timeline: newTimeline
      };
    });
  }, []);

  const handleImageUpload = useCallback((
    e: React.ChangeEvent<HTMLInputElement>, 
    isTimelineImage = false, 
    timelineIndex?: number
  ) => {
    try {
      const files = e.target.files ? Array.from(e.target.files) : [];
      
      if (files.length === 0) {
        toast.error('No files selected');
        return;
      }

      const validFiles = files.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} is not an image`);
          return false;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} is too large (max 5MB)`);
          return false;
        }
        
        return true;
      });

      if (validFiles.length === 0) return;

      if (isTimelineImage && timelineIndex !== undefined) {
        if (validFiles.length > 1) {
          toast.error('Only one image allowed per timeline day');
          return;
        }

        const file = validFiles[0];
        const objectUrl = URL.createObjectURL(file);

        // Update timeline images array
        setTimelineImages(prev => {
          const newTimelineImages = [...prev];
          newTimelineImages[timelineIndex] = file;
          return newTimelineImages;
        });
        
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
        setImages(prev => {
          const newFiles = validFiles.filter(
            file => !prev.some(existing => existing.name === file.name)
          );
          
          if (newFiles.length !== validFiles.length) {
            toast.error('Some duplicate files were skipped');
          }
          
          return [...prev, ...newFiles];
        });
      }

      e.target.value = '';
    } catch (error) {
      console.error('Error handling image upload:', error);
      toast.error('Failed to process image upload');
    }
  }, []);

  const removeImage = useCallback((
    index: number, 
    isTimelineImage = false, 
    timelineIndex?: number
  ) => {
    if (isTimelineImage && timelineIndex !== undefined) {
      setTimelineImages(prev => {
        const newTimelineImages = [...prev];
        newTimelineImages[timelineIndex] = undefined as unknown as File;
        return newTimelineImages;
      });
      
      setFormData(prev => {
        const newTimeline = [...prev.timeline];
        if (newTimeline[timelineIndex]) {
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
      const imageToRemove = images[index];
      if (imageToRemove) {
        const objectUrl = URL.createObjectURL(imageToRemove);
        URL.revokeObjectURL(objectUrl);
      }
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  }, [images]);

  const validateForm = useCallback(() => {
    if (!formData.title || !formData.description || !formData.locationFrom || !formData.locationTo) {
      toast.error('Please fill in all required fields.');
      return false;
    }
    if (parseInt(formData.days) <= 0) {
      toast.error('Number of days must be greater than 0.');
      return false;
    }
    if (!formData.fromDate) {
      toast.error('Please select a start date.');
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataMultipart = new FormData();
      
      const programData = {
        ...formData,
        location_from: formData.locationFrom,
        location_to: formData.locationTo,
        days: parseInt(formData.days),
        price: parseFloat(formData.price),
        singleAdon: parseInt(formData.singleAdon) || 0,
        priceInclude: formData.priceInclude,
        generalConditions: formData.generalConditions,
        timeline: formData.timeline.map((item, index) => ({
          title: item.title,
          description: item.description, // HTML from ReactQuill
          image: '',
          sortOrder: index + 1,
          date: item.date
        }))
      };

      formDataMultipart.append('programData', JSON.stringify(programData));
      
      images.forEach((file) => {
        formDataMultipart.append('program_images', file);
      });
      
      timelineImages.forEach((file) => {
        if (file) {
          formDataMultipart.append('timeline_images', file);
        }
      });

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

  useEffect(() => {
    return () => {
      images.forEach(file => {
        const objectUrl = URL.createObjectURL(file);
        URL.revokeObjectURL(objectUrl);
      });

      formData.timeline.forEach(item => {
        if (item.image) {
          URL.revokeObjectURL(item.image);
        }
      });
    };
  }, [images, formData.timeline]);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
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
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleSimpleInputChange(e as unknown as React.ChangeEvent<HTMLTextAreaElement>)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                {/*
                  Replace <textarea> with <ReactQuill>:
                */}
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  className="bg-white"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Location*</label>
                  <input
                    type="text"
                    name="locationFrom"
                    value={formData.locationFrom}
                    onChange={handleSimpleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Location*</label>
                  <input
                    type="text"
                    name="locationTo"
                    value={formData.locationTo}
                    onChange={handleSimpleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days*</label>
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleSimpleInputChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price*</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleSimpleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Single Add-on (€)</label>
                  <input
                    type="number"
                    name="singleAdon"
                    value={formData.singleAdon}
                    onChange={handleSimpleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date*</label>
                  <input
                    type="date"
                    name="fromDate"
                    value={formData.fromDate}
                    onChange={handleSimpleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <textarea
              name="phone"
              value={formData.phone}
              onChange={handleSimpleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
            <textarea
              name="metadata"
              value={formData.metadata}
              onChange={handleSimpleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />
          </div>
          
          {/* Program Images */}
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
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                  multiple
                />
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-100">
                  <Icon icon="mdi:plus" className="w-8 h-8 text-gray-400" />
                </div>
              </label>
            </div>
          </div>

          {/* Program Timeline */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Program Timeline</h2>
            <div className="space-y-4">
              {formData.timeline.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Day {index + 1} - {item.date}</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTimelineTitleChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                    {/* Use ReactQuill for day description */}
                    <ReactQuill
                      theme="snow"
                      value={item.description}
                      onChange={(value) => handleTimelineDescriptionChange(index, value)}
                      className="bg-white"
                    />

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

          {/* Price Includes (HTML) */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">What’s included in the price</label>
            <ReactQuill
              theme="snow"
              value={formData.priceInclude}
              onChange={handlePriceIncludeChange}
              className="bg-white"
            />
          </div>

          {/* General Conditions (HTML) */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">General Conditions</label>
            <ReactQuill
              theme="snow"
              value={formData.generalConditions}
              onChange={handleGeneralConditionsChange}
              className="bg-white"
            />
          </div>

          {/* Display Switch */}
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.display}
                onChange={(e) => setFormData(prev => ({ ...prev, display: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">Display on website</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-6 border-t flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg focus:outline-none hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Icon icon="mdi:loading" className="animate-spin mr-2" />
                  Creating...
                </span>
              ) : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
