import React from 'react';
import { Users, Store, FileText, UserCheck, AlertCircle, Bell, RefreshCw, AlertTriangle } from 'lucide-react';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3B82F6', '#22C55E', '#A855F7', '#EAB308', '#EF4444', '#EC4899', '#6366F1', '#F97316'];
const LoadingShimmer = () => (
  <div className="animate-pulse space-y-3">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-200" />
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
    </div>
    <div className="h-6 w-16 bg-gray-200 rounded mt-3" />
  </div>
);
const ReviewCard = ({ icon: Icon, title, value,value2, color, path,isLoading }) => {
  const navigate = useNavigate();
  return (
    <button
      className="w-full sm:w-80 mx-auto sm:mx-4 p-4 rounded-lg bg-white shadow-lg flex flex-col items-start relative overflow-hidden"
      onClick={() => navigate(path)}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoadingShimmer />
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${color}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
              <p className="text-xs text-gray-500">Current Status</p>
            </div>
          </div>
          <p className="mt-3 text-lg font-bold text-gray-700">
            {title === "TS&MH Cental Data DLH"
              ? `${value?.toLocaleString() || 0}`
              : value?.toLocaleString() || 0}
          </p>
        </>
      )}
      {/* {isLoading && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1s_infinite]" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }} />
      )} */}
    </button>
  );
};

const MarqueeContent = ({ children }) => {
  return (
    <div className="animate-marquee whitespace-nowrap py-3 flex flex-wrap gap-4">
      {children}
      {children}
    </div>
  );
};

const AdminDashboard = ({ data }) => {
  const stats = [
    { icon: Store, title: "Registered Distributors", value: data.distributors, color: "bg-blue-500", path: '/AdminDistData' },
    { icon: Users, title: "Registered Pharmacies", value: data.pharamacustomers, color: "bg-green-500", path: '/AdminpharmacyData' },
    { icon: FileText, title: "TS&MH Cental Data DLH",value: data.centalDataofDLH + data.mahaData,  color: "bg-purple-500", path: '/AdminCentralData' },
    { icon: UserCheck, title: "Linked Users", value: data.linkedUsers, color: "bg-yellow-500", path: '/AdminLinkedData' },
    { icon: AlertCircle, title: "Defaulters", value: data.defaulters, color: "bg-red-500", path: '/AdminDefaulters' },
    { icon: Bell, title: "Notices", value: data.notices, color: "bg-pink-500", path: '/AdminNotices' },
    { icon: RefreshCw, title: "Updated by Distributors", value: data.updatebydist, color: "bg-indigo-500", path: '/AdminDIsputedbydata' },
    { icon: AlertTriangle, title: "Disputes Claimed", value: data.disputesClaimed, color: "bg-orange-500", path: '/AdminDispytesClaimed' },
  ];
  const [isLoading, setIsLoading] = useState(true);
  const pieData = stats.map((stat, index) => ({
    name: stat.title,
    value: stat.value ?? 0,
    color: COLORS[index % COLORS.length],
  }));
  useEffect(() => {
    // Simulate loading for 1.5 seconds or until data is available
    const timer = setTimeout(() => {
      if (data && Object.keys(data).length > 0) {
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [data]);
  return (
    <div className="mt-8 relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* {stats.map((stat, index) => (
          <ReviewCard key={`${stat.title}-${index}`} {...stat} />
        ))} */}
        {stats.map((stat, index) => (
  <ReviewCard 
    key={`${stat.title}-${index}`} 
    {...stat} 
    isLoading={isLoading}
  />
))}
      </div>

      {/* Pie Chart */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Distribution Overview</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="h-96 w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => value.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2">
            <ul className="space-y-2">
              {pieData.map((entry) => (
                <li key={entry.name} className="flex items-center">
                  <span
                    className="inline-block w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                    aria-hidden="true"
                  />
                  <span className="text-gray-600">{entry.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add required keyframes animation
const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    animation: marquee 30s linear infinite;
  }
`;
document.head.appendChild(style);

export default AdminDashboard;
