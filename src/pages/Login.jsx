import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import api from '../api';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/admin/login', formData);
      localStorage.setItem('admin_token', response.data.access_token);
      toast.success('ស្វាគមន៍មកកាន់ផ្ទាំងគ្រប់គ្រង!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'ឈ្មោះអ្នកប្រើប្រាស់ ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3 transform hover:scale-110 transition">🍕</div>
          <h2 className="text-3xl font-bold gradient-text font-khmer">ចូលប្រើប្រាស់ប្រព័ន្ធ</h2>
          <p className="text-gray-500 mt-2 font-khmer">ប្រព័ន្ធគ្រប់គ្រងភោជនីយដ្ឋាន</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold font-khmer">ឈ្មោះអ្នកប្រើប្រាស់</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition font-khmer"
                placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-semibold font-khmer">ពាក្យសម្ងាត់</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition font-khmer"
                placeholder="បញ្ចូលពាក្យសម្ងាត់"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-khmer"
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>កំពុងភ្ជាប់...</span>
              </div>
            ) : (
              'ចូលប្រើប្រាស់'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p className="font-khmer">ព័ត៌មានសាកល្បង:</p>
        </div>
      </div>
    </div>
  );
};

export default Login;