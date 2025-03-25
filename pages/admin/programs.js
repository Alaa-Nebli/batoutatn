import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icon } from '@iconify/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { format, addDays } from 'date-fns';

export default function LocalProgramCreate() {
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
  });
  const [images, setImages] = useState([]);
  const [timelineImages, setTimelineImages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate timeline based on fromDate and days
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
          image: '',
        };
      });

      setFormData((prev) => ({
        ...prev,
        timeline: generatedTimeline,
      }));

      // Reset timeline images
      setTimelineImages({});
    }
  }, [formData.fromDate, formData.days]);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimelineChange = (index, field, value) => {
    const newTimeline = [...formData.timeline];
    newTimeline[index] = {
      ...newTimeline[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      timeline: newTimeline,
    }));
  };

  const handleImageUpload = (e, isTimelineImage = false, timelineIndex) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    if (isTimelineImage && timelineIndex !== undefined) {
      // Timeline image upload
      setTimelineImages((prev) => ({
        ...prev,
        [timelineIndex]: files[0],
      }));

      // Update timeline item image path (for display)
      const newTimeline = [...formData.timeline];
      newTimeline[timelineIndex].image = URL.createObjectURL(files[0]);
      setFormData((prev) => ({
        ...prev,
        timeline: newTimeline,
      }));
    } else {
      // Main program images upload
      setImages((prev) => [...prev, ...files]);
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
      setFormData((prev) => ({
        ...prev,
        timeline: newTimeline,
      }));
    } else {
      // Remove main program image
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!formData.title || !formData.description || !formData.locationFrom || !formData.locationTo) {
      toast.error('Please fill in all required fields.');
      return false;
    }
    if (formData.days <= 0) {
      toast.error('Number of days must be greater than 0.');
      return false;
    }
    if (!formData.fromDate) {
      toast.error('Please select a start date.');
      return false;
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
          date: item.date,
        })),
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
      const response = await fetch('/api/localPrograms.controller', {
        method: 'POST',
        body: formDataMultipart,
      });

      if (response.ok) {
        toast.success('Local program created successfully', {
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
        toast.error(errorData.message || 'Failed to create local program', {
          style: {
            background: '#FF4136',
            color: 'white',
          },
        });
      }
    } catch (error) {
      console.error('Error creating local program:', error);
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

  // Show loading state
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
            Create New Local Program
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Form fields for title, metadata, description, location, days, price, fromDate, etc. */}
          {/* Timeline section for managing daily activities */}
          {/* Image upload section for program and timeline images */}
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
              {isSubmitting ? 'Creating...' : 'Create Local Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}