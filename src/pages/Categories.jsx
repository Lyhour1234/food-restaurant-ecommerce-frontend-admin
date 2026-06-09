import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import AdminNavbar from '../components/AdminNavbar';
import CategoryForm from '../components/CategoryForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api';
import toast from 'react-hot-toast';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/admin/all');
      setCategories(response.data);
    } catch (error) {
      toast.error('មិនអាចទាញយកប្រភេទម្ហូបបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await api.delete(`/categories/${deleteConfirm.id}`);
      toast.success('បានលុបប្រភេទម្ហូបដោយជោគជ័យ');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'មិនអាចលុបប្រភេទម្ហូបបានទេ');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCategory(null);
    fetchCategories();
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fadeIn">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-khmer">គ្រប់គ្រងប្រភេទម្ហូប</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-khmer">បន្ថែមប្រភេទ</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-khmer">{category.name}</h3>
                  {category.description && (
                    <p className="text-gray-500 text-sm font-khmer">{category.description}</p>
                  )}
                </div>
                <div className="flex space-x-1 ml-4">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ id: category.id, name: category.name })}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold font-khmer ${
                  category.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {category.is_active ? 'សកម្ម' : 'អសកម្ម'}
                </span>
                <span className="text-xs text-gray-400 font-khmer">
                  មុខម្ហូប: {category.products?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {categories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-400 font-khmer">មិនមានប្រភេទម្ហូបទេ</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 btn-primary font-khmer"
            >
              បង្កើតប្រភេទម្ហូបដំបូងរបស់អ្នក
            </button>
          </div>
        )}
        
        {showForm && (
          <CategoryForm
            category={editingCategory}
            onClose={handleFormClose}
            onSuccess={fetchCategories}
          />
        )}
        
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
          title="លុបប្រភេទម្ហូប"
          message={`តើអ្នកប្រាកដជាចង់លុប "${deleteConfirm?.name}"? មុខម្ហូបក្នុងប្រភេទនេះនឹងមិនត្រូវបានលុបទេ ប៉ុន្តែនឹងបាត់បង់ការភ្ជាប់ប្រភេទ។`}
        />
      </div>
    </div>
  );
};

export default Categories;