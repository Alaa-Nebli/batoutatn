// pages/admin/login.js
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    
    const result = await signIn('credentials', {
      username: credentials.username,
      password: credentials.password,
      redirect: false,
      callbackUrl: '/admin/dashboard'
    });

    if (result?.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Login</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          onChange={(e) => setCredentials({...credentials, username: e.target.value})}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}