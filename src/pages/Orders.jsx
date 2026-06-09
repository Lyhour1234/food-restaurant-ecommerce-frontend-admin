import React, { useState, useEffect } from 'react';
import { EyeIcon, FunnelIcon, MagnifyingGlassIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import AdminNavbar from '../components/AdminNavbar';
import OrderDetails from '../components/OrderDetails';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [paymentConfirm, setPaymentConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingPayment, setUpdatingPayment] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [statusFilter, searchTerm, orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (error) {
      toast.error('មិនអាចទាញយកការបញ្ជាទិញបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  };

  const handleDeleteOrder = async () => {
    if (!deleteConfirm) return;
    
    try {
      await api.delete(`/orders/${deleteConfirm.id}`);
      toast.success('បានលុបការបញ្ជាទិញដោយជោគជ័យ');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'មិនអាចលុបការបញ្ជាទិញបានទេ');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!paymentConfirm) return;
    
    setUpdatingPayment(true);
    
    try {
      // Update order status to paid
      await api.put(`/orders/${paymentConfirm.id}`, {
        status: 'paid',
        payment_status: 'success'
      });
      toast.success('បានកំណត់ការបញ្ជាទិញថាបានបង់ប្រាក់ដោយជោគជ័យ');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'មិនអាចកំណត់ស្ថានភាពការបញ្ជាទិញបានទេ');
    } finally {
      setUpdatingPayment(false);
      setPaymentConfirm(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentColor = (status) => {
    return status === 'success' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';
  };

  const statusOptions = [
    { value: 'all', label: 'ការបញ្ជាទិញទាំងអស់', labelEn: 'All Orders' },
    { value: 'pending', label: 'កំពុងរង់ចាំ', labelEn: 'Pending' },
    { value: 'paid', label: 'បានបង់ប្រាក់', labelEn: 'Paid' },
    { value: 'completed', label: 'បានបញ្ចប់', labelEn: 'Completed' },
    { value: 'cancelled', label: 'បានបោះបង់', labelEn: 'Cancelled' }
  ];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fadeIn">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-khmer">គ្រប់គ្រងការបញ្ជាទិញ</h1>
          <p className="text-gray-500 mt-1 font-khmer">មើលនិងគ្រប់គ្រងការបញ្ជាទិញរបស់អតិថិជន</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="ស្វែងរកតាមលេខសម្គាល់ការបញ្ជាទិញ ឈ្មោះអតិថិជន ឬអ៊ីមែល..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10 font-khmer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field w-44 font-khmer"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th className="font-khmer px-4 py-3">លេខសម្គាល់ការបញ្ជាទិញ</th>
                  <th className="font-khmer px-4 py-3">អតិថិជន</th>
                  <th className="font-khmer px-4 py-3">ចំនួនទឹកប្រាក់</th>
                  <th className="font-khmer px-4 py-3">ស្ថានភាព</th>
                  <th className="font-khmer px-4 py-3">ការទូទាត់</th>
                  <th className="font-khmer px-4 py-3">កាលបរិច្ឆេទ</th>
                  <th className="font-khmer px-4 py-3">សកម្មភាព</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm font-semibold">{order.transaction_id}</td>
                    <td>
                      <div className="font-medium text-gray-900">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${order.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} font-khmer`}>
                        {order.status === 'pending' ? 'កំពុងរង់ចាំ' : 
                         order.status === 'paid' ? 'បានបង់ប្រាក់' :
                         order.status === 'completed' ? 'បានបញ្ចប់' : 'បានបោះបង់'}
                      </span>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.payment_status)} font-khmer`}>
                        {order.payment_status === 'success' ? 'ជោគជ័យ' : 'កំពុងរង់ចាំ'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{format(new Date(order.created_at), 'MMM dd, yyyy')}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="មើលព័ត៌មានលម្អិត"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        {order.payment_status !== 'success' && (
                          <button
                            onClick={() => setPaymentConfirm({ id: order.id, name: order.transaction_id })}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="កំណត់ថាបានបង់ប្រាក់"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteConfirm({ id: order.id, name: order.transaction_id })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="លុបការបញ្ជាទិញ"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-gray-400 font-khmer">
              {searchTerm || statusFilter !== 'all' ? 'មិនមានការបញ្ជាទិញដែលត្រូវនឹងតម្រងរបស់អ្នកទេ' : 'មិនមានការបញ្ជាទិញ'}
            </div>
          )}
        </div>
        
        {selectedOrder && (
          <OrderDetails
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
        
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={handleDeleteOrder}
          title="លុបការបញ្ជាទិញ"
          message={`តើអ្នកប្រាកដជាចង់លុបការបញ្ជាទិញ "${deleteConfirm?.name}"? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។`}
          confirmText="លុប"
          cancelText="បោះបង់"
        />
        
        <ConfirmDialog
          isOpen={!!paymentConfirm}
          onClose={() => setPaymentConfirm(null)}
          onConfirm={handleMarkAsPaid}
          title="កំណត់ថាបានបង់ប្រាក់"
          message={`តើអ្នកប្រាកដជាចង់កំណត់ការបញ្ជាទិញ "${paymentConfirm?.name}" ថាបានបង់ប្រាក់ហើយ?`}
          confirmText="បាទ/ចាស"
          cancelText="បោះបង់"
        />
      </div>
    </div>
  );
};

export default Orders;