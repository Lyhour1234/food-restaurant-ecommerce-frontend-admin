import React from 'react';
import { XMarkIcon, TruckIcon, ClockIcon, CurrencyDollarIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const OrderDetails = ({ order, onClose }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentColor = (status) => {
    return status === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: 'កំពុងរង់ចាំ',
      paid: 'បានបង់ប្រាក់',
      completed: 'បានបញ្ចប់',
      cancelled: 'បានបោះបង់'
    };
    return statusMap[status] || status.toUpperCase();
  };

  const getPaymentText = (status) => {
    return status === 'success' ? 'ជោគជ័យ' : 'កំពុងរង់ចាំ';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="sticky top-0 bg-white flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold gradient-text font-khmer">ព័ត៌មានលម្អិតការបញ្ជាទិញ</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition p-2 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-orange-500" />
                <span className="font-khmer">ព័ត៌មានការបញ្ជាទិញ</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 font-khmer">លេខសម្គាល់ការបញ្ជាទិញ:</span>
                  <span className="font-mono font-semibold text-gray-800">{order.transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-khmer">កាលបរិច្ឆេទ:</span>
                  <span className="text-gray-700">{format(new Date(order.created_at), 'PPP pp')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-khmer">ស្ថានភាព:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)} font-khmer`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 font-khmer">ការទូទាត់:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.payment_status)} font-khmer`}>
                    {getPaymentText(order.payment_status)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <TruckIcon className="h-5 w-5 text-orange-500" />
                <span className="font-khmer">ព័ត៌មានអតិថិជន</span>
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-500 font-khmer">ឈ្មោះ:</span>
                  <p className="font-semibold text-gray-800 font-khmer">{order.customer_name}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-khmer">អ៊ីមែល:</span>
                  <p className="text-gray-700">{order.customer_email}</p>
                </div>
                <div>
                  <span className="text-gray-500 font-khmer">ទូរស័ព្ទ:</span>
                  <p className="text-gray-700">{order.customer_phone}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Items with Customizations */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <CurrencyDollarIcon className="h-5 w-5 text-orange-500" />
              <span className="font-khmer">មុខម្ហូបដែលបានបញ្ជាទិញ</span>
            </h3>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800 text-lg font-khmer">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-bold text-gray-900 text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  
                  {/* Customizations Section */}
                  {(item.selected_size || item.selected_crust) && (
                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200">
                      <div className="flex items-center space-x-1 mb-1">
                        <AdjustmentsHorizontalIcon className="h-3 w-3 text-orange-500" />
                        <span className="text-xs font-semibold text-gray-600 font-khmer">ការកំណត់បន្ថែម:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {item.selected_size && (
                          <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-khmer">
                            ទំហំ: {item.selected_size}
                          </span>
                        )}
                        {item.selected_crust && (
                          <span className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full font-khmer">
                            នំប៉័ង: {item.selected_crust}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-2">
                <p className="font-bold text-xl text-gray-800 font-khmer">ចំនួនសរុប</p>
                <p className="font-bold text-2xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  ${order.total_amount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          {order.payment_transaction_id && (
            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3 font-khmer">ព័ត៌មានការទូទាត់</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700 font-khmer">លេខសម្គាល់ប្រតិបត្តិការ:</span>
                  <span className="font-mono text-green-800">{order.payment_transaction_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-khmer">វិធីសាស្ត្រទូទាត់:</span>
                  <span className="text-green-800 font-khmer">KHQR Payment Gateway</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;