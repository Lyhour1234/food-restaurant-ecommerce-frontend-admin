import React, { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon, 
  TagIcon, 
  CurrencyDollarIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminNavbar from '../components/AdminNavbar';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [products, categories, orders] = await Promise.all([
        api.get('/products/admin/all'),
        api.get('/categories/admin/all'),
        api.get('/orders')
      ]);
      
      const products_data = products.data;
      const categories_data = categories.data;
      const orders_data = orders.data;
      
      const totalRevenue = orders_data.reduce((sum, order) => 
        order.payment_status === 'success' ? sum + order.total_amount : sum, 0
      );
      
      const pendingOrders = orders_data.filter(o => o.status === 'pending').length;
      const completedOrders = orders_data.filter(o => o.status === 'paid' || o.status === 'completed').length;
      
      setStats({
        totalProducts: products_data.length,
        totalCategories: categories_data.length,
        totalOrders: orders_data.length,
        totalRevenue: totalRevenue,
        pendingOrders: pendingOrders,
        completedOrders: completedOrders
      });
      
      setRecentOrders(orders_data.slice(0, 5));
      
      const last7Days = [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      const sales = last7Days.map(date => {
        const dayOrders = orders_data.filter(order => 
          order.created_at.split('T')[0] === date && order.payment_status === 'success'
        );
        return {
          date: date.slice(5),
          sales: dayOrders.reduce((sum, o) => sum + o.total_amount, 0),
          orders: dayOrders.length
        };
      });
      setSalesData(sales);
      
      const categorySales = {};
      orders_data.forEach(order => {
        if (order.payment_status === 'success') {
          order.order_items?.forEach(item => {
            const categoryName = item.product?.category?.name || 'គ្មានប្រភេទ';
            categorySales[categoryName] = (categorySales[categoryName] || 0) + (item.price * item.quantity);
          });
        }
      });
      
      const pieData = Object.entries(categorySales).map(([name, value]) => ({
        name,
        value
      }));
      setCategoryData(pieData);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#f97316', '#dc2626', '#eab308', '#10b981', '#3b82f6', '#8b5cf6'];

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="animate-fadeIn">
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 font-khmer">ផ្ទាំងគ្រប់គ្រង</h1>
          <p className="text-gray-500 mt-1 font-khmer">សូមស្វាគមន៍មកកាន់ផ្ទាំងគ្រប់គ្រងរបស់អ្នក!</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="មុខម្ហូបសរុប"
            value={stats.totalProducts}
            icon={ShoppingBagIcon}
            color="primary"
          />
          <StatsCard
            title="ប្រភេទម្ហូប"
            value={stats.totalCategories}
            icon={TagIcon}
            color="blue"
          />
          <StatsCard
            title="ការបញ្ជាទិញសរុប"
            value={stats.totalOrders}
            icon={ClipboardDocumentListIcon}
            color="purple"
          />
          <StatsCard
            title="ចំណូលសរុប"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={CurrencyDollarIcon}
            color="green"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-khmer">ទិដ្ឋភាពទូទៅនៃការលក់</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#f97316" strokeWidth={2} name="ចំណូល ($)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#dc2626" strokeWidth={2} name="ការបញ្ជាទិញ" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 font-khmer">ការលក់តាមប្រភេទ</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400 font-khmer">
                គ្មានទិន្នន័យលក់
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 font-khmer">ការបញ្ជាទិញថ្មីៗ</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="font-khmer">លេខសម្គាល់ការបញ្ជាទិញ</th>
                  <th className="font-khmer">អតិថិជន</th>
                  <th className="font-khmer">ចំនួនទឹកប្រាក់</th>
                  <th className="font-khmer">ស្ថានភាព</th>
                  <th className="font-khmer">កាលបរិច្ឆេទ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-sm">{order.transaction_id}</td>
                    <td className="font-medium">{order.customer_name}</td>
                    <td className="font-semibold text-gray-900">${order.total_amount.toFixed(2)}</td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'paid' ? 'បានបង់ប្រាក់' : 'កំពុងរង់ចាំ'}
                      </span>
                    </td>
                    <td className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {recentOrders.length === 0 && (
            <div className="text-center py-8 text-gray-400 font-khmer">
              គ្មានការបញ្ជាទិញ
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;