import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { 
  CalendarDays, 
  DollarSign, 
  Clock, 
  AlertCircle, 
  IndianRupee, 
  Search, 
  Building2, 
  Send ,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { Navbar } from './Navbar';

export const ReportDefault = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [pharmacyData, setPharmacyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    limit: 10,
    totalRecords: 0
  });
  const navigate = useNavigate();

  const fetchInvoiceHistory = async () => {
    try {
      const distId = localStorage.getItem('userId');
      const { currentPage, limit } = pagination;
      
      const response = await fetch(
        `${config.API_HOST}/api/user/getinvoiceRDbydistId/${distId}?page=${currentPage}&limit=${limit}`,
        {
          method: 'GET',
          // headers: {
          //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          //     'Content-Type': 'application/json',
          // },
        }
      );
      const result = await response.json();
      
      if (result.success) {
        const sortedInvoices = result.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setInvoiceHistory(sortedInvoices);
        setPagination(prev => ({
          ...prev,
          totalPages: result.pagination?.totalPages || 0,
          totalRecords: result.pagination?.totalCount || 0
        }));
      }
    } catch (err) {
      console.error('Error fetching invoice history:', err);
    }
  };

  const handleUpdateRD = async (invoice) => {
    try {
      if (!window.confirm('Are you sure you want to mark this invoice as received?')) {
        return;
      }

      setLoading(true);
      const response = await fetch(`${config.API_HOST}/api/user/updateReportDefault`, {
        method: 'PUT',
        headers: {
          // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: invoice._id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report status');
      }

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        await fetchInvoiceHistory();
      } else {
        throw new Error(result.message || 'Failed to update report status');
      }
    } catch (err) {
      alert(`Error updating report status: ${err.message}`);
    } finally {
      setLoading(false);
    }
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

    setLoading(true);
    setError(null);

    try {
      const license2 = searchTerm.trim().toUpperCase();
      const response = await fetch(
        `${config.API_HOST}/api/user/getPharmaData?licenseNo=${license2}`,
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

  const handleLink = async (licenseNumber, phone_number, pharmacy_name, _id) => {
    try {
      const distId = localStorage.getItem('userId');
      const response = await fetch(`${config.API_HOST}/api/user/checkIfLinked/${_id}/${distId}`,
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
     
      navigate("/InvoiceFormRD", {
        state: { 
          pharmaDrugLicense: licenseNumber,
          phone_number: phone_number,
          pharmacy_name: pharmacy_name,
          pharmaId: _id 
        }
      });
    } catch (err) {
      setError(err.message || 'Error fetching pharmacy data');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Debounced search
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

  useEffect(() => {
    fetchInvoiceHistory();
  }, [pagination.currentPage]);

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
              Search and Report Default
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
                      Report Default
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Default History Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-900">Default History</h2>
          </div>
          
          <button 
          onClick={() => navigate('/DetailedDefaultedData')}
          className="w-full p-4 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart2 className="w-6 h-6 text-purple-700" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Detailed Default History
                </h3>
                <p className="text-sm text-gray-600">
                  Click here to get Detailed Default History
                </p>
              </div>
            </div>
            <ChevronRight 
             
            />
          </div>
        </button>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-purple-50/50">
                    {["S.No", "Reminder Date", "Pharmacy Name", "Invoice No.", "Amount", "Invoice Date", "Due Date", "Delay", "Status", "Actions"].map((header) => (
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
                      <td className="px-6 py-4 text-sm text-purple-900">{invoice.pharmacy_name}</td>
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
                          )  : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleUpdateRD(invoice)}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                          >
                            {loading ? 'Processing...' : 'Received'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
  
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-4 p-4 bg-white/50">
                <button 
                  onClick={() => handlePageChange(pagination.currentPage - 1)} 
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:hover:bg-purple-100 transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-sm text-purple-900">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                
                <button 
                  onClick={() => handlePageChange(pagination.currentPage + 1)} 
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:opacity-50 disabled:hover:bg-purple-100 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ReportDefault;