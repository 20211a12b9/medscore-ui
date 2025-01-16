import React, { useState,useEffect, useCallback,useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { CalendarDays, DollarSign, Clock, AlertCircle, IndianRupee,Search,Send,Building2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-lg">
        <Navbar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Payment Reminder Notice
            </h1>
          </div>

          {/* Search Box */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 p-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Enter pharmacy drug license number..."
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/50 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-purple-900 placeholder-purple-300"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 p-4 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Search Results */}
        {pharmacyData.length > 0 && (
          <div className="mb-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            {pharmacyData.map((pharmacy, index) => (
              <div key={index} className="p-6 hover:bg-purple-50/50 transition-colors border-b border-purple-100 last:border-b-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    <div>
                      <p className="text-sm text-purple-400">Pharmacy Name</p>
                      <p className="font-medium text-purple-900">{pharmacy.pharmacy_name}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-purple-400">Email</p>
                    <p className="font-medium text-purple-900">{pharmacy.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-400">License Number</p>
                    <p className="font-medium text-purple-900">{pharmacy.dl_code}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handleLink(pharmacy.dl_code, pharmacy.phone_number, pharmacy.pharmacy_name, pharmacy._id)}
                      className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all shadow-md hover:shadow-lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Notice
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reminders History */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-900">Reminders History</h2>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-50/50">
                    {["S.No", "Reminder Date", "Pharmacy Name", "Invoice No.", "Amount", "Invoice Date", "Due Date", "Delay", "Status"].map((header) => (
                      <th key={header} className="px-6 py-4 text-left text-sm font-semibold text-purple-900">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-100">
                  {invoiceHistory.map((invoice) => (
                    <tr key={invoice.serialNo} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-purple-900">{invoice.serialNo}</td>
                      <td className="px-6 py-4 text-sm text-purple-700">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-purple-400" />
                          {formatDate(invoice.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-900">{invoice.pharmadrugliseanceno}</td>
                      <td className="px-6 py-4 text-sm font-medium text-purple-900">{invoice.invoice}</td>
                      <td className="px-6 py-4 text-sm text-purple-900">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4 text-purple-400" />
                          {Number(invoice.invoiceAmount).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-purple-700">{formatDate(invoice.invoiceDate)}</td>
                      <td className="px-6 py-4 text-sm text-purple-700">{formatDate(invoice.dueDate)}</td>
                      <td className="px-6 py-4">
                        {invoice.delayDays === "0" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            On Time
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {invoice.delayDays} days
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.reportDefault 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {invoice.reportDefault ? (
                            <>
                              <AlertCircle className="w-4 h-4 mr-1" />
                              Defaulted
                            </>
                          ) : 'Active'}
                        </span>
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