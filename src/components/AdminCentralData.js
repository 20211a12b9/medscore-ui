import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';

const AdminCentralData = () => {
  const [centralData, setCentralData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 12
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const navigate = useNavigate();

  const statesAndDistricts = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hanumakonda", "Hyderabad", "Jagitial", "Jangoan", "Jayashankar Bhupalapally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam",
      "Kumuram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli",
      "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal", "Yadadri Bhuvanagiri"
    ]
  };

  const address = selectedDistrict || selectedState || "";

  // Debouncing logic: Update the debouncedSearchTerm after a delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId); // Cleanup the timeout on each change
  }, [searchTerm]);

  useEffect(() => {
    const fetchCentralData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${config.API_HOST}/api/user/getCentaldata?page=${pagination.currentPage}&limit=${pagination.perPage}&address=${address}&licenseNo=${debouncedSearchTerm}`
        );
        const data = await response.json();
        setCentralData(data.dist || []);
        setPagination(data.pagination || {});
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch central data');
        setLoading(false);
      }
    };

    // Fetch data only when the debouncedSearchTerm changes
    fetchCentralData();
  }, [pagination.currentPage, address, pagination.perPage, debouncedSearchTerm]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-full bg-gray-400">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center hover:bg-gray-100 p-2 rounded-full"
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Central Data Dashboard</h1>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by firm name or license number..."
            className="w-full pl-10 pr-4 py-3 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <select
            id="state"
            className="mt-1 block w-1/5 px-3 py-2 border-black border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        </div>

        {selectedState && (
          <div className="mb-4">
            <select
              id="district"
              className="mt-1 block w-1/5 px-3 py-2 border-black border rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">Select District</option>
              {statesAndDistricts[selectedState]?.map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {centralData.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gray-50 p-4">
              <h3 className="text-lg font-semibold">{item.FirmName}</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">📝 License Number: {item.LicenceNumber}</p>
                <p className="text-sm text-gray-600">📍 Location: {item.Address}</p>
                {item.status && (
                  <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {centralData.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No data found matching your criteria
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={pagination.currentPage === 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <span className="text-sm">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={pagination.currentPage === pagination.totalPages}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default AdminCentralData;
