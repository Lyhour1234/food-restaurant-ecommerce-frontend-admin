import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  TagIcon, 
  ClipboardDocumentListIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const navItems = [
    { path: '/', icon: HomeIcon, label: 'ផ្ទាំងគ្រប់គ្រង', labelEn: 'Dashboard' },
    { path: '/products', icon: ShoppingBagIcon, label: 'មុខម្ហូប', labelEn: 'Products' },
    { path: '/categories', icon: TagIcon, label: 'ប្រភេទ', labelEn: 'Categories' },
    { path: '/orders', icon: ClipboardDocumentListIcon, label: 'ការបញ្ជាទិញ', labelEn: 'Orders' },
    { path: '/profile', icon: UserIcon, label: 'ប្រវត្តិរូប', labelEn: 'Profile' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold group">
              <span className="text-3xl transform group-hover:scale-110 transition">🍕</span>
              <span className="hidden sm:inline gradient-text font-khmer">ផ្ទាំងគ្រប់គ្រង</span>
            </Link>

            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium font-khmer">{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span className="font-khmer">ចាកចេញ</span>
              </button>

              <button
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-40 mt-16 animate-slideIn shadow-lg">
          <div className="flex flex-col p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-lg font-medium font-khmer">{item.label}</span>
              </Link>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition w-full text-left"
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6" />
              <span className="text-lg font-medium font-khmer">ចាកចេញ</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminNavbar;