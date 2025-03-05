import { useEffect, useState } from 'react';
import { FiPackage, FiPhone, FiMapPin, FiCalendar, FiUser, FiSearch } from 'react-icons/fi';
import { config } from '../config';
import Navbar from './Navbar';

const PhramaConnections = () => {
  const [connections, setConnections] = useState({});
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameFilter, setNameFilter] = useState('');
  const [dlFilter, setDlFilter] = useState('');

  const pharmaId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch(`${config.API_HOST}/api/user/getPharmaConnections?pharmaId=${pharmaId}`,
          {
            method: 'GET',
            // headers: {
            //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            //     'Content-Type': 'application/json',
            // },
          }
        );
        if (!response.ok) throw new Error('Failed to fetch connections');
        
        const data = await response.json();
        console.log("--data--",data.Defaults)
        setConnections(data.Defaults);
        setCount(data.count);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [pharmaId]);

  const filteredPharmacies = Object.values(connections).filter(pharmacy => {
    const nameMatch = pharmacy.pharmacy_name.toLowerCase().includes(nameFilter.toLowerCase()) || pharmacy.dl_code.toLowerCase().includes(nameFilter.toLowerCase());
    return nameMatch ;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 bg-blue-200 rounded-full"></div>
          <div className="space-y-4">
            <div className="h-4 bg-blue-200 rounded w-36"></div>
            <div className="h-4 bg-blue-200 rounded w-24"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg mx-4 mt-6">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-lg">
        <Navbar />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-28">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FiPackage className="text-blue-600" />
              Connected Distributors
            </h1>
            <p className="text-gray-600 mt-2">Total Connections: <span className="font-semibold text-blue-600">{count}</span></p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pharmacy name or Drug license"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
              />
            </div>
           
          </div>
        </div>

        {filteredPharmacies.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 text-lg">No matching pharmacies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPharmacies.map((pharmacy, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <FiUser className="text-blue-500" />
                      {pharmacy.pharmacy_name}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {pharmacy.dl_code}
                    </span>
                  </div>

                  <div className="space-y-3 text-gray-600">
                    <div className="flex items-center gap-2">
                      <FiPhone className="text-gray-400" />
                      <span>{pharmacy.phone_number.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-gray-400 mt-1" />
                      <span>{pharmacy.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FiCalendar className="text-gray-400" />
                      <span>Expiry: {new Date(pharmacy.expiry_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhramaConnections;