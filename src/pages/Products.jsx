import React, { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import AdminNavbar from '../components/AdminNavbar';
import ProductForm from '../components/ProductForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/admin/all');
      setProducts(response.data);
    } catch (error) {
      toast.error('មិនអាចទាញយកមុខម្ហូបបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/admin/all');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    try {
      await api.delete(`/products/${deleteConfirm.id}`);
      toast.success('បានលុបមុខម្ហូបដោយជោគជ័យ');
      fetchProducts();
    } catch (error) {
      toast.error('មិនអាចលុបមុខម្ហូបបានទេ');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fadeIn">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 font-khmer">គ្រប់គ្រងមុខម្ហូប</h1>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span className="font-khmer">បន្ថែមមុខម្ហូប</span>
          </button>
        </div>
        
        <div className="mb-6 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="ស្វែងរកមុខម្ហូបតាមឈ្មោះ ឬប្រភេទ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 max-w-md font-khmer"
          />
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="font-khmer">រូបភាព</th>
                  <th className="font-khmer">ឈ្មោះ</th>
                  <th className="font-khmer">ប្រភេទ</th>
                  <th className="font-khmer">តម្លៃ</th>
                  <th className="font-khmer">ស្តុក</th>
                  <th className="font-khmer">ស្ថានភាព</th>
                  <th className="font-khmer">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <img 
                        src={product.image_url || 'https://via.placeholder.com/40'} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    </td>
                    <td className="font-medium font-khmer">{product.name}</td>
                    <td className="text-gray-500 font-khmer">{product.category?.name || 'N/A'}</td>
                    <td className="font-semibold text-gray-900">${product.price.toFixed(2)}</td>
                    <td>
                      <span className={product.stock < 10 ? 'text-orange-600 font-semibold' : 'text-gray-600'}>
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold font-khmer ${
                        product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.is_available ? 'មានស្តុក' : 'អស់ស្តុក'}
                      </span>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ id: product.id, name: product.name })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-400 font-khmer">
              {searchTerm ? 'មិនមានមុខម្ហូបដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ' : 'មិនមានមុខម្ហូប'}
            </div>
          )}
        </div>
        
        {showForm && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onClose={handleFormClose}
            onSuccess={fetchProducts}
          />
        )}
        
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDelete}
          title="លុបមុខម្ហូប"
          message={`តើអ្នកប្រាកដជាចង់លុប "${deleteConfirm?.name}"? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`}
        />
      </div>
    </div>
  );
};

export default Products;