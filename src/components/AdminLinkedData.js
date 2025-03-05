import React, { useState, useEffect } from 'react';
import { Search, RefreshCcw, SlidersHorizontal, ChevronDown, ChevronUp, Building2, Store,ArrowLeft } from 'lucide-react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
const AdminLinkedData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedDistributors, setExpandedDistributors] = useState({});
  const navigate=useNavigate()
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_HOST}/api/user/getAdminLikedData`,
        {
          method:'GET',
          // headers:{
          //   // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          //   'content-type':'application/json'
          // }
        }
      );
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result.Defaults || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupedData = data.reduce((acc, item) => {
    const distributorName = item.distributor_name || 'Unknown Distributor';
    if (!acc[distributorName]) {
      acc[distributorName] = {
        distId: item.distId,
        pharmacies: []
      };
    }
    acc[distributorName].pharmacies.push({
      pharmacy_name: item.pharmacy_name || 'Unknown Pharmacy',
      pharmaId: item.pharmaId
    });
    return acc;
  }, {});

  const filteredData = Object.entries(groupedData).filter(([distributorName, data]) => {
    const matchesDistributor = distributorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPharmacy = data.pharmacies.some(pharmacy => 
      pharmacy.pharmacy_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesDistributor || matchesPharmacy;
  });

  const toggleDistributor = (distributorName) => {
    setExpandedDistributors(prev => ({
      ...prev,
      [distributorName]: !prev[distributorName]
    }));
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
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="text-red-500 text-xl">Error: {error}</div>
        <button 
          onClick={fetchData}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button 
                    onClick={() => navigate(-1)}
                    className=" flex items-center text-black hover:text-black transition-colors mb-2 space-x-2 "
                >
                    <ArrowLeft className="h-7 w-7 font-bold" />
                   
                </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Connections</h1>
              
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search partnerships..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                {/* <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </button> */}
                <button 
                  onClick={fetchData}
                  className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCcw className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {filteredData.map(([distributorName, data]) => (
            <div key={distributorName} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleDistributor(distributorName)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{distributorName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {data.pharmacies.length} {data.pharmacies.length === 1 ? 'pharmacy' : 'pharmacies'}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm font-mono text-gray-500">ID: {data.distId || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  {expandedDistributors[distributorName] ? (
                    <ChevronUp className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedDistributors[distributorName] && (
                <div className="border-t border-gray-100">
                  {data.pharmacies.map((pharmacy, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-green-50 rounded-lg">
                          <Store className="h-4 w-4 text-green-500" />
                        </div>
                        <span className="text-gray-900">{pharmacy.pharmacy_name}</span>
                      </div>
                      <span className="text-sm font-mono text-gray-500">ID: {pharmacy.pharmaId || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="bg-white rounded-xl p-12 text-center">
              <div className="max-w-sm mx-auto">
                <p className="text-gray-500">
                  {searchTerm ? 'No partnerships found matching your search.' : 'No partnerships available.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLinkedData;