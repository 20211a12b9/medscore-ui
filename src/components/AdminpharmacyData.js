import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Phone, Key, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

const PharmacyCard = ({ pharmacy }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{pharmacy.pharmacy_name}</h3>
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-7 w-7 mr-2 text-blue-500" />
          <span className="break-words font-normal text-xs">{pharmacy.address}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Phone className="h-5 w-5 mr-2 text-green-500" />
          <span>{pharmacy.phone_number.join(", ")}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Key className="h-5 w-5 mr-2 text-purple-500" />
          <span>{pharmacy.dl_code}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-red-500" />
          <span>Expires: {new Date(pharmacy.expiry_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2 text-red-500" />
          <span>createdAt: {new Date(pharmacy.createdAt).toISOString().split('T')[0]}</span>
        </div>
      </div>
    </div>
  </div>
);

export const AdminpharmacyData = () => {
  const [pharmacyData, setPharmacyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [dateFilter, setDateFilter] = useState({
      endDate: '',
    });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    perPage: 12
  });

  // Predefined states and districts
  const statesAndDistricts = {
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Karnataka": ["Bengaluru", "Mysuru", "Hubli"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Telangana":["Adilabad","Bhadradri Kothagudem","Hanumakonda","Hyderabad","Jagitial","Jangoan","Jayashankar Bhupalapally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam",
      "Kumuram Bheem Asifabad","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli",
      "Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal","Yadadri Bhuvanagiri"
     ]
  };
const address = selectedDistrict || selectedState || "";
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  // Debouncing logic: Update the debouncedSearchTerm after a delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId); // Cleanup the timeout on each change
  }, [searchTerm]);
  useEffect(() => {
    const fetchPharmacyData = async () => {
      try {
        const response = await fetch(`${config.API_HOST}/api/user/getPharmacyData?page=${pagination.currentPage}&limit=${pagination.perPage}&address=${address}&licenseNo=${debouncedSearchTerm}&endDate=${dateFilter.endDate}`,
          {
            method:'GET',
            // headers:{
            //   // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            //   'content-type':'application/json'
            // }
          }
        );
        if (!response.ok) {
          
        }
        const data = await response.json();

        if (data.dist && Array.isArray(data.dist)) {
          console.log(data.pagination)
          setPharmacyData(data.dist);
          setPagination(data.pagination || {});
        } else {
          console.error('Received data structure:', data);
          throw new Error('Invalid pharmacy data format');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to fetch pharmacy data');
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacyData();
  }, [pagination.currentPage, address, pagination.perPage, debouncedSearchTerm,dateFilter]);


  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="absolute">
        {/* Spinning border */}
        
        {/* Logo in center - not spinning */}
        <div className=" animate-circle top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img 
            src="medscore_newlogo.png"
            alt="Company Logo" 
            className="h-24 w-24 object-contain"
          />
          
        </div>
        <h1 className='text-wrap font-serif'>Loading</h1>
      </div>
    </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-red-500 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 hover:bg-gray-100 p-2 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Pharmacy Dashboard</h1>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by firm name or license number..."
              className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search pharmacies"
            />
          </div>
<div className="flex items-center gap-4 mt-4">
    <div className="relative flex-1">
      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <input
        type="date"
        placeholder="End Date"
        className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
        value={dateFilter.endDate}
        onChange={(e) => setDateFilter({ endDate: e.target.value })}
      />
      {dateFilter.endDate && (
        <button
          onClick={() => setDateFilter({ endDate: '' })}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      )}
    </div>
  </div>
          {/* State and District Filter */}
          <div className="mt-6">
            <div className="mb-4">
              {/* <label htmlFor="state" className="block text-sm font-medium text-gray-700">Select State</label> */}
              <select
                id="state"
                className="mt-1 block w-1/5 px-3 py-2 border-black border rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={selectedState}
                onChange={(e) => {
                  setSelectedState(e.target.value);
                  setSelectedDistrict('');  // Reset district on state change
                }}
              >
                <option value="">Select State</option>
                {Object.keys(statesAndDistricts).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            {selectedState && (
              <div className="mb-4 ">
                {/* <label htmlFor="district" className="block text-sm font-medium ml-28 text-gray-700">Select District</label> */}
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
        </div>
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
        <h1 className='text-wrap font-serif '>Total Count: <span className='text-wrap font-bold'>{pagination.totalCount}</span></h1>
        {/* Pharmacy Cards Grid */}
        {pharmacyData.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pharmacyData.map((pharmacy) => (
              <PharmacyCard key={pharmacy._id} pharmacy={pharmacy} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pharmacies found matching your search criteria</p>
          </div>
        )}

     
        
      </div>
    </div>
  );
};