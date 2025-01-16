import React, { useState, useEffect, useCallback } from 'react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Search, Building2, Phone, LinkIcon } from 'lucide-react';

export const PharmacySearch = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [pharmacyData, setPharmacyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkingStatus, setLinkingStatus] = useState({});
  const [pharmaDrugliceId, setPharmaDrugLicId] = useState('');
  
  const navigate = useNavigate();

  // Debounce function to limit API calls
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

  // Check if pharmacy is already linked
  const checkLinkStatus = useCallback(async (pharmaIds) => {
    try {
      const customerId = localStorage.getItem('userId');
      const linkStatuses = {};

      for (const pharmaId of pharmaIds) {
        const response = await fetch(
          `${config.API_HOST}/api/user/checkIfLinked/${pharmaId}/${customerId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Accept': 'application/json',
            }
          }
        );

        if (response.ok) {
          linkStatuses[pharmaId] = 'linked';
        } else {
          linkStatuses[pharmaId] = 'not_linked';
        }
      }

      setLinkingStatus(linkStatuses);
    } catch (err) {
      console.error('Error checking link status:', err);
    }
  }, []);

  // Fetch pharmacy data
  const fetchPharmacyData = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setPharmacyData([]);
      setError(null);
      return;
    }

    setPharmacyData('');
    setPharmaDrugLicId('');
    setLoading(true);
    setError(null);

    try {
      const license2 = searchTerm.trim().toUpperCase();
      const response = await fetch(
        `${config.API_HOST}/api/user/getPharmaData?licenseNo=${license2}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch pharmacy data');
      }

      if (result.data && result.data.length > 0) {
        setPharmaDrugLicId(result.data[0].dl_code);
        setPharmacyData(result.data);
        
        // Check link status for fetched pharmacies
        const pharmaIds = result.data.map(pharmacy => pharmacy._id);
        checkLinkStatus(pharmaIds);
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
  }, [checkLinkStatus]);

  // Create a debounced version of fetchPharmacyData
  const debouncedFetchPharmacyData = useCallback(
    debounce(fetchPharmacyData, 500), // 500ms delay
    [fetchPharmacyData]
  );

  // Use effect to trigger search when license number changes
  useEffect(() => {
    if (licenseNo.trim()) {
      debouncedFetchPharmacyData(licenseNo);
    }
    else{
      setPharmacyData([]);
      setError(null);
    }
  }, [licenseNo, debouncedFetchPharmacyData]);

  const handleLink = async (pharmaId) => {
    try {
      const updatedLinkingStatus = { ...linkingStatus };
      updatedLinkingStatus[pharmaId] = 'linking';
      setLinkingStatus(updatedLinkingStatus);

      const customerId = localStorage.getItem('userId');
      const response = await fetch(`${config.API_HOST}/api/user/linkPharma/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pharmaId }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to link pharmacy');
      }
  
      // Update linking status to linked
      updatedLinkingStatus[pharmaId] = 'linked';
      setLinkingStatus(updatedLinkingStatus);
    } catch (err) {
      const updatedLinkingStatus = { ...linkingStatus };
      updatedLinkingStatus[pharmaId] = 'error';
      setLinkingStatus(updatedLinkingStatus);
      setError(err.message || 'Error linking pharmacy');
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
                  const linkStatus = linkingStatus[pharmacy._id] || 'not_linked';
                  const cardColors = [
                    'bg-gradient-to-br from-purple-50 to-indigo-50',
                    'bg-gradient-to-br from-blue-50 to-cyan-50',
                    'bg-gradient-to-br from-indigo-50 to-purple-50'
                  ];
                  const cardColor = cardColors[index % cardColors.length];
                  
                  return (
                    <div key={index} className={`${cardColor} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100/50`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-5 w-5 text-indigo-500" />
                            <span className="font-medium text-indigo-900">{pharmacy.pharmacy_name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-indigo-400" />
                            <span className="text-indigo-700">{pharmacy.phone_number}</span>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2">
                            {/* <License className="h-5 w-5 text-indigo-400" /> */}
                            <span className="text-indigo-700">{pharmacy.dl_code}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleLink(pharmacy._id)}
                              disabled={linkStatus === 'linked' || linkStatus === 'linking'}
                              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all duration-200 ${
                                linkStatus === 'linked' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                                linkStatus === 'error' ? 'bg-red-500 text-white hover:bg-red-600' :
                                linkStatus === 'linking' ? 'bg-amber-500 text-white' :
                                'bg-indigo-600 text-white hover:bg-indigo-700'
                              }`}
                            >
                              <LinkIcon className="h-4 w-4 mr-2" />
                              {linkStatus === 'linked' ? 'Linked' :
                               linkStatus === 'error' ? 'Failed' :
                               linkStatus === 'linking' ? 'Linking...' :
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
    </div>
  );
};

export default PharmacySearch;