import React, { useState, useEffect, useCallback } from 'react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';

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
    <div className="p-6 max-w-6xl mx-auto">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar/>
      </div>
      <div className="flex flex-col gap-6 mt-20">
        {/* Search Section */}
        <h2 className="text-2xl font-bold text-gray-900">Search and Link Your Customer</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Pharmacy Drug License Number"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button
                onClick={() => navigate('/Addcustomer')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Add Customer
              </button>
            </div>
          </div>
        )}

        {/* Results Table */}
        {pharmacyData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-2 text-left">Pharmacy Name</th>
                  <th className="border border-gray-200 p-2 text-left">Address</th>
                  <th className="border border-gray-200 p-2 text-left">Phone Number</th>
                  <th className="border border-gray-200 p-2 text-left">License Number</th>
                  <th className="border border-gray-200 p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {pharmacyData.map((pharmacy, index) => {
                  const linkStatus = linkingStatus[pharmacy._id] || 'not_linked';
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-200 p-2">{pharmacy.pharmacy_name}</td>
                      <td className="border border-gray-200 p-2">{pharmacy.address}</td>
                      <td className="border border-gray-200 p-2">{pharmacy.phone_number}</td>
                      <td className="border border-gray-200 p-2">{pharmacy.dl_code}</td>
                      <td className="border border-gray-200 p-2">
                        <button
                          onClick={() => handleLink(pharmacy._id)}
                          disabled={linkStatus === 'linked' || linkStatus === 'linking'}
                          className={`px-3 py-1 rounded text-white ${
                            linkStatus === 'linked' ? 'bg-green-500' :
                            linkStatus === 'error' ? 'bg-red-500' :
                            linkStatus === 'linking' ? 'bg-yellow-500' :
                            'bg-blue-500 hover:bg-blue-600'
                          }`}
                        >
                          {linkStatus === 'linked' ? 'Linked' :
                           linkStatus === 'error' ? 'Failed' :
                           linkStatus === 'linking' ? 'Linking...' :
                           'Link'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacySearch;