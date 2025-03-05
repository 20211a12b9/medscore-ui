import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Bell } from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

const Notices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pharmaData, setPharmaData] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    limit: 10,
    totalRecords: 0
  });
  const fetchPharmaData = async (license) => {
    try {
      const response = await fetch(`${config.API_HOST}/api/user/getPharmaData?licenseNo=${license}`,
        {
          method: 'GET',
          // headers: {
          //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          //     'Content-Type': 'application/json',
          // },
        }
      );
      const data = await response.json();
      if (data.success) {
        console.log("data.data[0]",data.data[0])
        setPharmaData(prevState => ({
          ...prevState,
          [license]: data.data[0]
        }));
      }
    } catch (error) {
      console.error('Error fetching pharmacy data:', error);
    }
  };

  const updateSeenStatus = async (invoiceIds) => {
    try {
      const response = await fetch(`${config.API_HOST}/api/user/updateNoticeSeenStatus`, {
        method: 'PUT',
        headers: {
          // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to update seen status');
      }
    } catch (err) {
      console.error('Error updating seen status:', err);
    }
  };

  const fetchInvoiceData = async () => {
    const license = localStorage.getItem("dl_code");
    const { currentPage, limit } = pagination;
    if (!license) {
      setError("License number not found");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_HOST}/api/user/getInvoice?licenseNo=${license}&page=${currentPage}&limit=${limit}`,
        {
          method: 'GET',
          // headers: {
          //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          //     'Content-Type': 'application/json',
          // },
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        const sortedInvoices = result.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setInvoices(sortedInvoices);
        setPagination(prev => ({
          ...prev,
          totalPages: result.pagination?.totalPages || 0,
          totalRecords: result.pagination?.totalCount || 0
        }));
        
        const unseenInvoiceIds = sortedInvoices
          .filter(invoice => !invoice.seen)
          .map(invoice => invoice._id);
        
        if (unseenInvoiceIds.length > 0) {
          await updateSeenStatus(unseenInvoiceIds);
        }
      }
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };
  useEffect(() => {
    fetchInvoiceData();
  }, [pagination.currentPage]);

  useEffect(() => {
    const missingPharmaData = invoices.filter(
      invoice => !pharmaData[invoice.pharmadrugliseanceno]
    );
    
    missingPharmaData.forEach(invoice => {
      fetchPharmaData(invoice.pharmadrugliseanceno);
    });
  }, [invoices, pharmaData]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Invalid date';
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      {/* <div className="relative">
  <img 
    className="hidden lg:block absolute right-0 top-5 lg:h-6 w-6 md:right-0 md:top-10 md:h-60 md:w-60 lg:-right-10 lg:top-8 xl:h-auto xl:w-auto" 
    src="notice-mg4-removebg-preview.png"
    alt="Announcement" 
  />
</div> */}


      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Reminders</h1>
                <p className="mt-1 text-gray-600">Track and manage your payment notifications</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Loading reminders...</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Details</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pharmacy</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delay</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((invoice) => (
                    <tr 
                      key={invoice._id} 
                      className={`hover:bg-gray-50 transition-colors ${!invoice.seen ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {invoice.seen ? (
                            <CheckCircle2 className="h-5 w-5 text-blue-600" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-amber-500 animate-pulse" />
                          )}
                          <span className="text-sm text-gray-600">
                            {invoice.seen ? 'Viewed' : 'New'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">#{invoice.invoice}</p>
                          <p className="text-xs text-gray-500 mt-1">Serial: {invoice.serialNo}</p>
                          <p className="text-xs text-gray-500 mt-1">Issued: {formatDate(invoice.createdAt)}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {pharmaData[invoice.pharmadrugliseanceno]?.pharmacy_name || 'Loading...'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          invoice.delayDays > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {invoice.delayDays} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{invoice.invoiceAmount.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notices;