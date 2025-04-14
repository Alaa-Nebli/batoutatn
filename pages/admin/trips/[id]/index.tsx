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
  existingImages: string[]; // Added property
}

// Dynamically load ReactQuill (for Next.js):
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditProgram() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query; // program ID from URL

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
    existingImages: [],
  });

  // NEW arrays for newly uploaded images
  const [newImages, setNewImages] = useState<File[]>([]);
  const [timelineImages, setTimelineImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============= Fetch existing program data =============
  useEffect(() => {
    if (!id) return;
    const fetchProgram = async () => {
      try {
        const response = await fetch(`/api/programs.controller?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch existing program data');
        }
        const data = await response.json();

        // Fill the form with existing data
        setFormData(prev => ({
          ...prev,
          title: data.title || '',
          metadata: data.metadata || '',
          description: data.description || '',
          locationFrom: data.location_from || '',
          locationTo: data.location_to || '',
          days: data.days?.toString() || '',
          price: data.price?.toString() || '',
          singleAdon: data.singleAdon?.toString() || '',
          fromDate: data.from_date?.split('T')[0] || '', // "YYYY-MM-DD"
          toDate: data.to_date?.split('T')[0] || '',
          timeline: (data.timeline || []).map((item: any) => ({
            title: item.title,
            description: item.description,
            date: item.date?.split('T')[0],
            image: item.image || '',
          })),
          display: !!data.display,
          priceInclude: data.priceInclude || '',
          generalConditions: data.generalConditions || '',
          existingImages: data.images || [],
        }));
      } catch (error) {
        console.error(error);
        toast.error('Error loading existing program');
      }
    };
    fetchProgram();
  }, [id]);

  // If user not authenticated, redirect
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  // If fromDate or days change, recalc toDate
  useEffect(() => {
    const daysNumber = parseInt(formData.days);
    if (formData.fromDate && !isNaN(daysNumber) && daysNumber > 0) {
      const startDate = new Date(formData.fromDate);
      const endDate = addDays(startDate, daysNumber - 1);
      setFormData(prev => ({
        ...prev,
        toDate: format(endDate, 'yyyy-MM-dd'),
      }));
    }
  }, [formData.fromDate, formData.days]);

  const handleSimpleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'toDate') {
      toast.error('End date is auto-calculated. Modify "From date" or "Days" instead.');
      return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // WYSIWYG fields
  const handleDescriptionChange = (val: string) => {
    setFormData(prev => ({ ...prev, description: val }));
  };
  const handlePriceIncludeChange = (val: string) => {
    setFormData(prev => ({ ...prev, priceInclude: val }));
  };
  const handleGeneralConditionsChange = (val: string) => {
    setFormData(prev => ({ ...prev, generalConditions: val }));
  };

  // Timeline fields
  const handleTimelineTitleChange = useCallback((index: number, val: string) => {
    setFormData(prev => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = { ...newTimeline[index], title: val };
      return { ...prev, timeline: newTimeline };
    });
  }, []);

  const handleTimelineDescriptionChange = useCallback((index: number, val: string) => {
    setFormData(prev => {
      const newTimeline = [...prev.timeline];
      newTimeline[index] = { ...newTimeline[index], description: val };
      return { ...prev, timeline: newTimeline };
    });
  }, []);

  // Upload images
  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, isTimelineImage = false, timelineIndex?: number) => {
      try {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (!files.length) {
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

        if (!validFiles.length) return;

        if (isTimelineImage && timelineIndex !== undefined) {
          if (validFiles.length > 1) {
            toast.error('Only one image allowed per timeline day');
            return;
          }
          const file = validFiles[0];
          const objectUrl = URL.createObjectURL(file);

          setTimelineImages(prev => {
            const newArr = [...prev];
            newArr[timelineIndex] = file;
            return newArr;
          });

          setFormData(prev => {
            const newTimeline = [...prev.timeline];
            newTimeline[timelineIndex].image = objectUrl; // for preview
            return { ...prev, timeline: newTimeline };
          });
        } else {
          // Program-level images
          setNewImages(prev => [...prev, ...validFiles]);
        }
        e.target.value = '';
      } catch (error) {
        console.error(error);
        toast.error('Failed to upload images');
      }
    },
    []
  );

  // Remove images (preview only).
  // For actual images in DB, we rely on the update approach (some do a separate endpoint to remove).
  const removeImage = useCallback(
    (index: number, isTimelineImage = false, timelineIndex?: number) => {
      if (isTimelineImage && typeof timelineIndex === 'number') {
        setTimelineImages(prev => {
          const newArr = [...prev];
          newArr[timelineIndex] = undefined as unknown as File;
          return newArr;
        });
        setFormData(prev => {
          const newTimeline = [...prev.timeline];
          if (newTimeline[timelineIndex].image) {
            URL.revokeObjectURL(newTimeline[timelineIndex].image);
          }
          newTimeline[timelineIndex].image = '';
          return { ...prev, timeline: newTimeline };
        });
      } else {
        // remove from newly added images
        setNewImages(prev => prev.filter((_, i) => i !== index));
      }
    },
    []
  );

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.locationFrom || !formData.locationTo) {
      toast.error('Please fill in all required fields (title, description, from/to locations).');
      return false;
    }
    if (parseInt(formData.days) <= 0) {
      toast.error('Number of days must be > 0.');
      return false;
    }
    if (!formData.fromDate) {
      toast.error('Please select a start date.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!id) {
      toast.error('No program ID found in URL');
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataMultipart = new FormData();

      // Prepare data to send
      const programData = {
        ...formData,
        location_from: formData.locationFrom,
        location_to: formData.locationTo,
        days: parseInt(formData.days),
        price: parseFloat(formData.price),
        singleAdon: parseInt(formData.singleAdon) || 0,
        timeline: formData.timeline.map((item, index) => ({
          title: item.title,
          description: item.description, // HTML
          image: item.image,            // We'll replace if new image is uploaded
          sortOrder: index + 1,
          date: item.date
        })),
      };

      formDataMultipart.append('programData', JSON.stringify(programData));

      // newly added images
      newImages.forEach(file => {
        formDataMultipart.append('program_images', file);
      });

      // newly added timeline images
      timelineImages.forEach(file => {
        if (file) {
          formDataMultipart.append('timeline_images', file);
        }
      });

      const response = await fetch(`/api/programs.controller?id=${id}`, {
        method: 'PUT',
        body: formDataMultipart,
      });

      if (response.ok) {
        toast.success('Program updated successfully!', {
          style: { background: '#4BB543', color: 'white' },
          iconTheme: { primary: 'white', secondary: '#4BB543' },
        });
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update program', {
          style: { background: '#FF4136', color: 'white' },
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('An unexpected error occurred while updating program', {
        style: { background: '#FF4136', color: 'white' },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      newImages.forEach(file => {
        const url = URL.createObjectURL(file);
        URL.revokeObjectURL(url);
      });
      timelineImages.forEach(file => {
        if (file) {
          const url = URL.createObjectURL(file);
          URL.revokeObjectURL(url);
        }
      });
      formData.timeline.forEach(item => {
        if (item.image && item.image.startsWith('blob:')) {
          URL.revokeObjectURL(item.image);
        }
      });
    };
  }, [newImages, timelineImages, formData.timeline]);

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
            <Icon icon="mdi:pencil" className="mr-3 w-8 h-8" />
            Edit Program
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Program Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleSimpleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Description (HTML) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                <ReactQuill
                  theme="snow"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              {/* From / To */}
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

              {/* Days / Price / SingleAdon / FromDate */}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Single Add-on</label>
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

              {/* toDate (readOnly) */}
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

          {/* Metadata */}
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

          {/* Existing Program Images (read-only previews) */}
          {formData.existingImages?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Existing Images</h2>
              <p className="text-sm text-gray-500 mb-4">These images are already saved in the system.</p>
              <div className="flex flex-wrap gap-4">
                {formData.existingImages.map((url, idx) => (
                  <div key={idx} className="relative">
                    <Image
                      src={url}
                      alt="Existing image"
                      width={100}
                      height={100}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Program Images */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Add/Replace Program Images</h2>
            <div className="flex flex-wrap gap-4">
              {newImages.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt={`New Program image ${index + 1}`}
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
                  multiple
                  onChange={(e) => handleImageUpload(e, false)}
                  className="hidden"
                />
                <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center hover:bg-gray-100">
                  <Icon icon="mdi:plus" className="w-8 h-8 text-gray-400" />
                </div>
              </label>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Program Timeline</h2>
            <div className="space-y-4">
              {formData.timeline.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">
                      Day {index + 1} - {item.date}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleTimelineTitleChange(index, e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      required
                    />

                    <ReactQuill
                      theme="snow"
                      value={item.description}
                      onChange={(val) => handleTimelineDescriptionChange(index, val)}
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

          {/* Price Includes & General Conditions */}
          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What’s included in the price
            </label>
            <ReactQuill
              theme="snow"
              value={formData.priceInclude}
              onChange={handlePriceIncludeChange}
              className="bg-white"
            />
          </div>

          <div className="col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              General Conditions
            </label>
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
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full
                rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white
                after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                after:bg-white after:border-gray-300 after:border after:rounded-full
                after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
              ></div>
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
                  Updating...
                </span>
              ) : (
                'Update Program'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
