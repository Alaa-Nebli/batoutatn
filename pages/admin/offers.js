import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function OfferDetails() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    price: '',
  });
  const [imageUrl, setImageUrl] = useState('');

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      setImageUrl(data.url);
      setFormData((prev) => ({
        ...prev,
        image: data.url,
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const removeImage = () => {
    setImageUrl('');
    setFormData((prev) => ({
      ...prev,
      image: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/dashboard');
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border rounded-lg shadow-md p-6 bg-white">
        <h1 className="text-lg font-bold mb-4">Create New Offer</h1>
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

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="flex gap-4">
              {imageUrl && (
                <div className="relative">
                  <Image
                    src={imageUrl}
                    alt="Offer image"
                    className="w-24 h-24 object-cover rounded-lg"
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
              {!imageUrl && (
                <label className="w-24 h-24 flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-gray-400">+</span>
                </label>
              )}
            </div>
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
