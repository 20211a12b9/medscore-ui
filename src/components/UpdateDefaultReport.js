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
          headers: {
            'Accept': 'application/json',
          }
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

      const response = await fetch(
        `${config.API_HOST}/api/user/updateReportDefault/${invoice.pharmadrugliseanceno}/${invoice.invoice}/${invoice.customerId}`,
        {
          method: 'PUT',
        }
      );

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
    <div className="bg-white [background-image:none] min-h-screen p-6 mx-auto">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
    
      <div className="border-b p-6 mt-10">
        <h2 className="text-2xl font-bold text-gray-900">Update Payment Details</h2>
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
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
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
  );
};

export default UpdateDefaultReport;
