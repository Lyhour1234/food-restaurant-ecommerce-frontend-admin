import React from 'react';

const StatsCard = ({ title, value, icon: Icon, color = 'primary', change }) => {
  const colors = {
    primary: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  // Khmer translations for common titles
  const khmerTitles = {
    'Total Products': 'មុខម្ហូបសរុប',
    'Categories': 'ប្រភេទម្ហូប',
    'Total Orders': 'ការបញ្ជាទិញសរុប',
    'Total Revenue': 'ចំណូលសរុប'
  };

  const displayTitle = khmerTitles[title] || title;

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colors[color]} p-3 rounded-xl`}>
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <span className={`text-sm font-semibold ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <h3 className="text-gray-500 text-sm mb-1 font-khmer">{displayTitle}</h3>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default StatsCard;