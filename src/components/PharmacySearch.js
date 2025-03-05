import React, { useState, useEffect, useCallback } from 'react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Search, Building2, Phone, LinkIcon, Plus, X } from 'lucide-react';

export const PharmacySearch = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [pharmacyData, setPharmacyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkingInProgress, setLinkingInProgress] = useState({});
  const [pharmaDrugliceId, setPharmaDrugLicId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [addingPhone, setAddingPhone] = useState(false);
  
  const navigate = useNavigate();

  // Existing debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Existing fetchPharmacyData function
  const fetchPharmacyData = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setPharmacyData([]);
      setError(null);
      return;
    }

    setPharmacyData([]);
    setPharmaDrugLicId('');
    setLoading(true);
    setError(null);

    try {
      const license2 = searchTerm.trim().toUpperCase();
      const customerId = localStorage.getItem('userId');
      const response = await fetch(
        `${config.API_HOST}/api/user/getPharmaData2?licenseNo=${license2}&customerId=${customerId}`,
        {
          method: 'GET',
          // headers: {
          //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          //     'Content-Type': 'application/json',
          // },
        }
      );
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch pharmacy data');
      }

      if (result.data && result.data.length > 0) {
        // Ensure each pharmacy has a phone_number array
        console.log("data",result.data)
        const processedData = result.data.map(pharmacy => ({
          ...pharmacy,
          phone_number: Array.isArray(pharmacy.phone_number) ? pharmacy.phone_number : []
        }));
        setPharmaDrugLicId(processedData[0].dl_code);
        setPharmacyData(processedData);
      } else {
        setPharmacyData([]);
        setError('No pharmacy found');
      }
    } catch (err) {
      setError(err.message || 'Error fetching pharmacy data');
      setPharmacyData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle adding new phone number
  const handleAddPhoneNumber = async (pharmacyId) => {
    if (!newPhoneNumber.trim()) {
        setError('Please enter a valid phone number');
        return;
    }

    setAddingPhone(true);
    try {
        console.log('Sending request with:', {
            pharmacyId,
            phoneNumber: newPhoneNumber
        });

        const response = await fetch(`${config.API_HOST}/api/user/addPhoneNumber/${pharmacyId}`, {
            method: 'POST',
            // headers: {
            //    'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            //     'Content-Type': 'application/json',
            // },
            body: JSON.stringify({ phoneNumber: newPhoneNumber }),
            credentials: 'include' // Add this if you're using cookies
        });

        console.log('Response status:', response.status);
        const result = await response.json();
        console.log('Response data:', result);

        if (!response.ok) {
            throw new Error(result.message || 'Failed to add phone number');
        }

        // Rest of your code...
    } catch (err) {
        console.error('Error in handleAddPhoneNumber:', err);
        setError(err.message || 'Error adding phone number');
    } finally {
        setAddingPhone(false);
    }
};
  // Existing useEffect and handleLink functions remain the same
  const debouncedFetchPharmacyData = useCallback(
    debounce(fetchPharmacyData, 500),
    [fetchPharmacyData]
  );

  useEffect(() => {
    if (licenseNo.trim()) {
      debouncedFetchPharmacyData(licenseNo);
    } else {
      setPharmacyData([]);
      setError(null);
    }
  }, [licenseNo, debouncedFetchPharmacyData]);

  const handleLink = async (pharmaId) => {
    try {
      setLinkingInProgress(prev => ({ ...prev, [pharmaId]: true }));

      const customerId = localStorage.getItem('userId');
      const response = await fetch(`${config.API_HOST}/api/user/linkPharma/${customerId}`, {
        method: 'POST',
        headers: {
          // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pharmaId }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to link pharmacy');
      }
  
      setPharmacyData(prevData => 
        prevData.map(pharmacy => 
          pharmacy._id === pharmaId 
            ? { ...pharmacy, isLinked: true }
            : pharmacy
        )
      );
    } catch (err) {
      setError(err.message || 'Error linking pharmacy');
    } finally {
      setLinkingInProgress(prev => ({ ...prev, [pharmaId]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-lg">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-xl p-8 border border-indigo-100">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
              Search and Link Pharmacy
            </h1>

            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder="Enter Pharmacy Drug License Number"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="block w-full pl-10 pr-3 py-4 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition duration-150 ease-in-out text-indigo-900 placeholder-indigo-400"
              />
            </div>

            {loading && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 p-4 mb-8 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => navigate('/Addcustomer')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Customer
                  </button>
                </div>
              </div>
            )}

{pharmacyData.length > 0 && (
              <div className="space-y-4">
                {pharmacyData.map((pharmacy, index) => {
                  const isLinking = linkingInProgress[pharmacy._id];
                  const cardColors = [
                    'bg-gradient-to-br from-purple-50 to-indigo-50',
                    'bg-gradient-to-br from-blue-50 to-cyan-50',
                    'bg-gradient-to-br from-indigo-50 to-purple-50'
                  ];
                  const cardColor = cardColors[index % cardColors.length];
                  
                  return (
                    <div key={pharmacy._id || index} className={`${cardColor} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100/50`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5 text-indigo-500" />
                            <span className="font-medium text-indigo-900">{pharmacy.pharmacy_name}</span>
                          </div>
                        {pharmacy.isLinked &&(
                            <div className="space-y-2">
                            {/* Safe access to phone_number array */}
                            {Array.isArray(pharmacy.phone_number) && (
  <div className="flex items-center space-x-2">
    <Phone className="h-5 w-5 text-indigo-400" />
    <span className="text-indigo-700">{pharmacy.phone_number.join(", ")}</span>
  </div>
)}

                            <button
                              onClick={() => {
                                setSelectedPharmacy(pharmacy);
                                setIsModalOpen(true);
                              }}
                              className="inline-flex items-center px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Phone
                            </button>
                          </div>
                        )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-indigo-700">{pharmacy.dl_code}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleLink(pharmacy._id)}
                              disabled={pharmacy.isLinked || isLinking}
                              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all duration-200 ${
                                pharmacy.isLinked ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                                isLinking ? 'bg-amber-500 text-white' :
                                'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              {pharmacy.isLinked ? 'Linked' :
                               isLinking ? 'Linking...' :
                               'Link Pharmacy'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 text-indigo-700 text-sm bg-white/50 rounded-md p-2">
                        <p>{pharmacy.address}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for adding phone number */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Add Phone Number</h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewPhoneNumber('');
                  setSelectedPharmacy(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              type="tel"
              value={newPhoneNumber}
              onChange={(e) => setNewPhoneNumber(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewPhoneNumber('');
                  setSelectedPharmacy(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddPhoneNumber(selectedPharmacy._id)}
                disabled={addingPhone}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:bg-indigo-400"
              >
                {addingPhone ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacySearch;