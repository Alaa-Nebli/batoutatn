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
    title: '',
    alt_text: '',
    program_id: '',
    custom_route: '',
    sort_order: 0,
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    // Fetch programs for the dropdown
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/programs?admin=true');
        if (response.ok) {
          const data = await response.json();
          setPrograms(data);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
      }
    };

    // Fetch offer data if editing
    const fetchOfferData = async () => {
      try {
        const response = await fetch(`/api/featured-offers?admin=true&id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setFormData({
            title: data.title,
            alt_text: data.alt_text,
            program_id: data.program_id || '',
            custom_route: data.custom_route || '',
            sort_order: data.sort_order,
            active: data.active
          });
          setPreviewUrl(`/uploads/banners/${data.image}`);
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
      }
    };

    fetchPrograms();
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value);
      });

      if (imageFile) {
        submitFormData.append('image', imageFile);
      }

      const url = `/api/featured-offers${id ? `?id=${id}` : ''}`;
      const method = id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitFormData,
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error saving offer:', error);
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

          <div>
            <label className="block text-sm font-medium mb-2">Banner Image</label>
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
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-gray-400">+ Add Banner Image</span>
                </label>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image Alt Text</label>
            <input
              type="text"
              name="alt_text"
              value={formData.alt_text}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Link to Program (Optional)</label>
            <select
              name="program_id"
              value={formData.program_id}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Custom Route (Optional)</label>
            <input
              type="text"
              name="custom_route"
              value={formData.custom_route}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="/custom-page"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sort Order</label>
            <input
              type="number"
              name="sort_order"
              value={formData.sort_order}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Active</label>
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
              {isEditing ? 'Update' : 'Create'} Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};