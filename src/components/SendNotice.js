import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

export const SendNotice = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [pharmacyData, setPharmacyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkingStatus, setLinkingStatus] = useState('');
  const [pharmaDrugliceId,setPharmaDrugLicId]=useState('')
  const navigate=useNavigate();
 
  const handleSearch = async () => {
    if (!licenseNo.trim()) {
      setError('Please enter a license number');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.API_HOST}/api/user/getPharmaData?licenseNo=${licenseNo}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch pharmacy data');
      }
      console.log("---amam00",result.data[0])
      setPharmaDrugLicId(result.data[0].dl_code)
      setPharmacyData(result.data);
    } catch (err) {
      setError(err.message || 'Error fetching pharmacy data');
    } finally {
      setLoading(false);
    }
  };

  const handleLink =async (licenseNumber,phone_number,pharmacy_name,_id) => {
    try {
        const distId = localStorage.getItem('userId');
        const pharmaId=_id;
        console.log("_id",_id,"distId",distId)
        const response = await fetch(`${config.API_HOST}/api/user/checkIfLinked/${pharmaId}/${distId}`);
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch pharmacy data');
        }
        navigate("/InvoiceForm", {
            state: { pharmaDrugLicense: licenseNumber,phone_number:phone_number,pharmacy_name }
          });
      } catch (err) {
        setError(err.message || 'Error fetching pharmacy data');
      } finally {
        setLoading(false);
      }
    
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-6">
        {/* Search Section */}
        <h2 className="text-2xl font-bold text-gray-900">Search and Send Notice</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Pharmacy Drug License Number"
              value={licenseNo}
              onChange={(e) => setLicenseNo(e.target.value)}
              className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Results Table */}
        {pharmacyData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse table-auto bg-white shadow rounded">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-2 text-left">Pharmacy Name</th>
                  <th className="border border-gray-200 p-2 text-left">Email</th>
                  <th className="border border-gray-200 p-2 text-left">Phone Number</th>
                  <th className="border border-gray-200 p-2 text-left">License Number</th>
                  {/* <th className="border border-gray-200 p-2 text-left">Delay Days</th> */}
                  <th className="border border-gray-200 p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {pharmacyData.map((pharmacy, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 p-2">{pharmacy.pharmacy_name}</td>
                    <td className="border border-gray-200 p-2">{pharmacy.email}</td>
                    <td className="border border-gray-200 p-2">{pharmacy.phone_number}</td>
                    <td className="border border-gray-200 p-2">{pharmacy.dl_code}</td>
                    {/* <td className="border border-gray-200 p-2">{pharmacy.delayDays}</td> */}
                    <td className="border border-gray-200 p-2">
                      <button
                        onClick={() => handleLink(licenseNo,pharmacy.phone_number,pharmacy.pharmacy_name,pharmacy._id)}
                        disabled={linkingStatus === 'linking'}
                        className={`px-3 py-1 rounded text-white ${
                          linkingStatus === 'success' ? 'bg-green-500' :
                          linkingStatus === 'error' ? 'bg-red-500' :
                          linkingStatus === 'linking' ? 'bg-yellow-500' :
                          'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {linkingStatus === 'success' ? 'Linked!' :
                         linkingStatus === 'error' ? 'Failed' :
                         linkingStatus === 'linking' ? 'Linking...' :
                         'Send Notice'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default SendNotice;