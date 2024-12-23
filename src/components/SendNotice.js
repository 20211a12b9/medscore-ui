import React, { useState,useEffect, useCallback,useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { CalendarDays, DollarSign, Clock, AlertCircle, IndianRupee } from 'lucide-react';
import { Navbar } from './Navbar';

export const SendNotice = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [pharmacyData, setPharmacyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [linkingStatus, setLinkingStatus] = useState('');
  const [pharmaDrugliceId,setPharmaDrugLicId]=useState('');
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    const fetchInvoiceHistory = async () => {
      try {
        const distId = localStorage.getItem('userId');
        const response = await fetch(`${config.API_HOST}/api/user/getinvoicesbydistId/${distId}`);
        const result = await response.json();
        if (result.success) {
          setInvoiceHistory(result.data);
        }
      } catch (err) {
        console.error('Error fetching invoice history:', err);
      }
    };

    fetchInvoiceHistory();
  }, []);



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const debounce = useMemo(() => {
    return (func, delay) => {
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
  }, []);

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
            state: { pharmaDrugLicense: licenseNumber,phone_number:phone_number,pharmacy_name:pharmacy_name }
          });
      } catch (err) {
        setError(err.message || 'Error fetching pharmacy data');
      } finally {
        setLoading(false);
      }
    
  };
  


  return (
    <div className="bg-white [background-image:none] min-h-screen p-6  mx-auto">
     <div className="fixed top-0 left-0 w-full z-50">
  <Navbar />
</div>

      <div className="flex flex-col gap-6 mt-14">
        {/* Search Section */}
        <h2 className="text-2xl font-bold text-gray-900">Search and Send Reminder Message</h2>
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
<div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Reminders History
          </h2>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">S.No</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">Reminder Issued On</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">License No.</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">Invoice No.</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">Invoice Date</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">Delay Days</th>
                    <th className="border-b px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoiceHistory.map((invoice) => (
                    <tr key={invoice.serialNo} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.serialNo}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          {formatDate(invoice.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.pharmadrugliseanceno}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{invoice.invoice}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-gray-500" />
                          {Number(invoice.invoiceAmount).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4 text-gray-500" />
                          {formatDate(invoice.invoiceDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {invoice.delayDays === "0" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            On Time
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {invoice.delayDays} days
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {invoice.reportDefault ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Defaulted
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
       </div>
      </div>
      
    </div>
  );
};

export default SendNotice;