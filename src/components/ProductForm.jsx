import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '../api';
import toast from 'react-hot-toast';

const ProductForm = ({ product, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    stock: product?.stock || 0,
    category_id: product?.category_id || '',
    image_url: product?.image_url || '',
    is_available: product?.is_available ?? true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'តម្រូវឱ្យមានឈ្មោះមុខម្ហូប';
    if (!formData.price) newErrors.price = 'តម្រូវឱ្យមានតម្លៃ';
    if (formData.price <= 0) newErrors.price = 'តម្លៃត្រូវតែធំជាង 0';
    if (!formData.category_id) newErrors.category_id = 'តម្រូវឱ្យមានប្រភេទម្ហូប';
    if (formData.stock < 0) newErrors.stock = 'ស្តុកមិនអាចជាចំនួនអវិជ្ជមាន';
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
      if (product) {
        await api.put(`/products/${product.id}`, formData);
        toast.success('បានកែប្រែមុខម្ហូបដោយជោគជ័យ');
      } else {
        await api.post('/products', formData);
        toast.success('បានបង្កើតមុខម្ហូបថ្មីដោយជោគជ័យ');
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.response?.data?.detail || 'មិនអាចរក្សាទុកមុខម្ហូបបានទេ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold gradient-text font-khmer">
            {product ? 'កែប្រែមុខម្ហូប' : 'បន្ថែមមុខម្ហូបថ្មី'}
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
              ឈ្មោះមុខម្ហូប *
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className={`input-field font-khmer ${errors.name ? 'border-red-500' : ''}`}
              placeholder="បញ្ចូលឈ្មោះមុខម្ហូប"
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
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="input-field font-khmer"
              placeholder="បញ្ចូលសេចក្តីពិពណ៌នាមុខម្ហូប"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                តម្លៃ * ($)
              </label>
              <input
                type="number"
                name="price"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={`input-field ${errors.price ? 'border-red-500' : ''}`}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1 font-khmer">{errors.price}</p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                បរិមាណស្តុក
              </label>
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className={`input-field ${errors.stock ? 'border-red-500' : ''}`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-sm mt-1 font-khmer">{errors.stock}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-semibold font-khmer">
              ប្រភេទម្ហូប *
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={`input-field font-khmer ${errors.category_id ? 'border-red-500' : ''}`}
            >
              <option value="">ជ្រើសរើសប្រភេទ</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-500 text-sm mt-1 font-khmer">{errors.category_id}</p>
            )}
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-semibold font-khmer">
              URL រូបភាព
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="input-field font-khmer"
              placeholder="https://example.com/image.jpg"
            />
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="h-20 w-20 object-cover rounded-lg"
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-gray-700 font-khmer">
              មានលក់ (អតិថិជនអាចមើលឃើញ)
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
                product ? 'កែប្រែមុខម្ហូប' : 'បង្កើតមុខម្ហូប'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;