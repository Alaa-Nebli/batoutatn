import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('programs');
  const [stats, setStats] = useState({
    programs: [],
    featured: []
  });

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('/api/programs.controller');
      setStats(prev => ({ ...prev, programs: response.data }));
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchFeatured = async () => {
    try {
      const response = await axios.get('/api/featured');
      console.log(response.data);
      setStats(prev => ({ ...prev, featured: response.data }));
    } catch (error) {
      console.error('Error fetching featured items:', error);
    }
  };

  useEffect(() => {
    fetchPrograms();
    fetchFeatured();
  }, []);

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/admin/');
    return null;
  }

  const handleDeleteProgram = async (id) => {
    if (confirm('Are you sure you want to delete this program?')) {
      try {
        const response = await fetch(`/api/programs.controller?id=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchPrograms();
        }
      } catch (error) {
        console.error('Error deleting program:', error);
      }
    }
  };

  const handleDeleteFeatured = async (id) => {
    if (confirm('Are you sure you want to delete this featured item?')) {
      try {
        const response = await fetch(`/api/featured?id=${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchFeatured();
        }
      } catch (error) {
        console.error('Error deleting featured item:', error);
      }
    }
  };

  const renderContent = () => {
    const items = stats[activeTab] || [];
    
    if (activeTab === 'programs') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteProgram(item.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Icon icon="mdi:trash" className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{item.description}</p>
              {item.price && (
                <p className="mt-2 font-semibold">${item.price}</p>
              )}
              {item.duration && (
                <p className="text-sm">{item.duration} days</p>
              )}
              <Link href={`/programs/${item.id}`}>
                View Program
              </Link>
            </div>
          ))}
        </div>
      );
    } else if (activeTab === 'featured') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">{item.trip?.title || 'Featured Item'}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteFeatured(item.id)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <Icon icon="mdi:trash" className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
              {item.image && (
                <div className="relative h-48 mb-4">
                  <Image 
                    src={`/uploads/${item.image}`} 
                    alt={item.trip?.title || 'Featured banner'}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              )}
              <p className="text-sm text-gray-600">{item.cta}</p>
              {item.trip && (
                <Link href={`/programs/${item.trip.id}`}>
                  View Associated Program
                </Link>
              )}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Batouta Voyages Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/admin/programs/new`)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              <Icon icon="mdi:plus-circle" className="w-5 h-5" />
              Add New Program
            </button>
            <button
              onClick={() => router.push(`/admin/featured/new`)}
              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <Icon icon="mdi:plus-circle" className="w-5 h-5" />
              Add New Featured
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-600">Programs</h3>
            <p className="text-3xl font-bold mt-2">{stats.programs?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-600">Featured Items</h3>
            <p className="text-3xl font-bold mt-2">{stats.featured?.length || 0}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'programs' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Programs
          </button>
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-4 py-2 rounded-lg ${activeTab === 'featured' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Featured
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}