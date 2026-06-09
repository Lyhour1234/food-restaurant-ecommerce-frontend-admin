import React, { useState, useEffect } from 'react';
import { UserIcon, EnvelopeIcon, KeyIcon } from '@heroicons/react/24/outline';
import AdminNavbar from '../components/AdminNavbar';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../api';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/admin/me');
      setProfile(response.data);
    } catch (error) {
      toast.error('មិនអាចទាញយកទិន្នន័យប្រវត្តិរូបបានទេ');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នាទេ');
      return;
    }
    
    if (passwordData.new_password.length < 6) {
      toast.error('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ 6 តួអក្សរ');
      return;
    }
    
    try {
      await api.post('/admin/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });
      toast.success('បានប្តូរពាក្យសម្ងាត់ដោយជោគជ័យ');
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'មិនអាចប្តូរពាក្យសម្ងាត់បានទេ');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      <AdminNavbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 font-khmer">ការកំណត់ប្រវត្តិរូប</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-primary-100 rounded-full p-4">
                <UserIcon className="h-12 w-12 text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 font-khmer">{profile?.username}</h2>
                <p className="text-gray-600 font-khmer">អ្នកគ្រប់គ្រងប្រព័ន្ធ</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 font-khmer">អាសយដ្ឋានអ៊ីមែល</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <KeyIcon className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-khmer">ពាក្យសម្ងាត់</p>
                  <p className="font-medium">••••••••</p>
                </div>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-semibold font-khmer"
                >
                  ប្តូរ
                </button>
              </div>
            </div>
          </div>
          
          {showPasswordForm && (
            <div className="bg-white rounded-lg shadow-md p-6 animate-fadeIn">
              <h3 className="text-xl font-bold text-gray-800 mb-4 font-khmer">ប្តូរពាក្យសម្ងាត់</h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                    ពាក្យសម្ងាត់បច្ចុប្បន្ន
                  </label>
                  <input
                    type="password"
                    name="current_password"
                    required
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                    ពាក្យសម្ងាត់ថ្មី
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    required
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="input-field"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-semibold font-khmer">
                    បញ្ជាក់ពាក្យសម្ងាត់ថ្មី
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="input-field"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="btn-secondary font-khmer"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    className="btn-primary font-khmer"
                  >
                    ធ្វើបច្ចុប្បន្នភាព
                  </button>
                </div>
              </form>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-khmer">
              <strong>ចំណាំ៖</strong> រក្សាព័ត៌មានចូលប្រើប្រាស់របស់អ្នកឲ្យមានសុវត្ថិភាព។ កុំចែករំលែកពាក្យសម្ងាត់របស់អ្នកជាមួយនរណាម្នាក់។
              ប្រសិនបើអ្នកសង្ស័យថាមានការចូលប្រើប្រាស់ដោយគ្មានការអនុញ្ញាត សូមប្តូរពាក្យសម្ងាត់របស់អ្នកជាបន្ទាន់។
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;