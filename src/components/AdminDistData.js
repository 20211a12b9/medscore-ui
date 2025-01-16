import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

export const AdminDistData = () => {
  const [distData, setDistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    pharma_ethical: false,
    generic_general: false,
    surgicals: false,
    pcd: false,
  });
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 10
  });
  const navigate = useNavigate();

  const statesAndDistricts = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": [
      "Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagitial",
      "Jangoan", "Jayashankar Bhupalapally", "Jogulamba Gadwal", "Kamareddy", 
      "Karimnagar", "Khammam", "Kumuram Bheem Asifabad", "Mahabubabad", 
      "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", 
      "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", 
      "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", 
      "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
    ]
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleFilterToggle = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const fetchDistData = async (page = 1) => {
    try {
      setLoading(true);
      const activeFilters = Object.entries(filters)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      const address = selectedDistrict || selectedState || "";
      const queryParams = new URLSearchParams({
        page,
        limit: pagination.perPage,
        address,
        filters: JSON.stringify(activeFilters),
        search: debouncedSearchTerm
      });

      const response = await fetch(`${config.API_HOST}/api/user/getDistributorsData?${queryParams}`);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      setDistData(data.dist || []);
      setPagination(prev => ({
        ...prev,
        ...data.pagination,
        currentPage: page
      }));
    } catch (err) {
      setError('Failed to fetch distributors data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistData(pagination.currentPage);
  }, [pagination.currentPage, filters, selectedState, selectedDistrict, debouncedSearchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchDistData(1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          <span className="text-2xl font-bold">Distributors Dashboard</span>
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or DL code..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Location Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <select
            className="w-full md:w-1/4 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('');
            }}
          >
            <option value="">Select State</option>
            {Object.keys(statesAndDistricts).map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          {selectedState && (
            <select
              className="w-full md:w-1/4 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {statesAndDistricts[selectedState]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          )}
        </div>

        {/* Type Filters */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleFilterToggle(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                value 
                  ? 'bg-blue-100 text-blue-800 border-blue-300' 
                  : 'bg-gray-100 text-gray-800 border-gray-300'
              } border transition-colors hover:shadow-sm`}
            >
              {key.split('_').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {distData.length} of {pagination.totalCount} distributors
      </div>

      {/* Distributor Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {distData.map((dist) => (
          <div key={dist._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4">
              <h3 className="text-lg font-semibold truncate">{dist.pharmacy_name}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2 flex-wrap">
                {Object.entries(dist.distributor_types).map(([type, has]) => 
                  has && (
                    <span key={type} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  )
                )}
              </div>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>📍</span> {dist.address}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>📱</span> {dist.phone_number}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span>🔢</span> {dist.dl_code}
              </p>
              {dist.expiry_date && (
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <span>⏳</span> Expires: {new Date(dist.expiry_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-sm">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>

          <button
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDistData;