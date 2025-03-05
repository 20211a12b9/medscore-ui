import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, AlertCircle, Search } from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

const UpdateDefaultReport = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce implementation
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

  // Fetch invoice data
  const fetchInvoiceData = async (license) => {
    if (!license) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${config.API_HOST}/api/user/getInvoiceRDforDistUpdate?licenseNo=${license}`,
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
        setInvoices(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch invoice data');
      }
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced version of fetchInvoiceData
  const debouncedFetchInvoiceData = useCallback(debounce(fetchInvoiceData, 500), []);

  // Trigger fetch when licenseNo changes
  useEffect(() => {
    if (licenseNo.trim()) {
      debouncedFetchInvoiceData(licenseNo);
    } else {
      setInvoices([]);
    }
  }, [licenseNo, debouncedFetchInvoiceData]);

  const handleSendNotice = async (invoice) => {
    try {
      if (!window.confirm(`Are you sure you want to mark this invoice as received?`)) {
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
            _id:invoice._id
        }),
    });

      if (!response.ok) {
        throw new Error('Failed to update report status');
      }

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        await fetchInvoiceData(licenseNo); // Refresh the list
      } else {
        throw new Error(result.message || 'Failed to update report status');
      }
    } catch (err) {
      alert(`Error updating report status: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-lg">
        <Navbar />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <div className="mb-8">
      <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-2 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Update Payment Details
            </h1>
          </div>
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

      <div className="p-6">
        {error && (
                  <div className="mb-6 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 p-4 rounded-xl">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <p className="ml-3 text-red-700">{error}</p>
                    </div>
                  </div>
                )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice No</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">License Number</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delay Days</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.invoice}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.pharmadrugliseanceno}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDate(invoice.invoiceDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{invoice.delayDays}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleSendNotice(invoice)}
                        disabled={loading || invoice.reportDefault === false}
                        className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                      >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {invoice.reportDefault === false ? 'Received' : 'Mark as Received'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : licenseNo ? (
          <div className="text-center py-8 text-gray-500">
            No invoices found for license number: {licenseNo}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Enter a license number to search for invoices
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default UpdateDefaultReport;
