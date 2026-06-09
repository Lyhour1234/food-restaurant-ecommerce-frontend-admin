import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../api';
import toast from 'react-hot-toast';

const CategoryForm = ({ category, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    is_active: category?.is_active ?? true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'តម្រូវឱ្យមានឈ្មោះប្រភេទម្ហូប';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('សូមកែតម្រូវកំហុសក្នុងទម្រង់');
      return;
    }
    
    setLoading(true);
    
    try {
      if (category) {
        await api.put(`/categories/${category.id}`, formData);
        toast.success('បានកែប្រែប្រភេទម្ហូបដោយជោគជ័យ');
      } else {
        await api.post('/categories', formData);
        toast.success('បានបង្កើតប្រភេទម្ហូបថ្មីដោយជោគជ័យ');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.response?.data?.detail || 'មិនអាចរក្សាទុកប្រភេទម្ហូបបានទេ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-fadeIn">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold gradient-text font-khmer">
            {category ? 'កែប្រែប្រភេទម្ហូប' : 'បន្ថែមប្រភេទម្ហូបថ្មី'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition p-2 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-semibold font-khmer">
              ឈ្មោះប្រភេទម្ហូប *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`input-field font-khmer ${errors.name ? 'border-red-500' : ''}`}
              placeholder="បញ្ចូលឈ្មោះប្រភេទម្ហូប"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1 font-khmer">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-semibold font-khmer">
              សេចក្តីពិពណ៌នា
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="input-field font-khmer"
              placeholder="បញ្ចូលសេចក្តីពិពណ៌នាប្រភេទម្ហូប"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-700 font-khmer">
              សកម្ម (អតិថិជនអាចមើលឃើញ)
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary font-khmer"
            >
              បោះបង់
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed font-khmer"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>កំពុងរក្សាទុក...</span>
                </div>
              ) : (
                category ? 'កែប្រែប្រភេទ' : 'បង្កើតប្រភេទ'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;