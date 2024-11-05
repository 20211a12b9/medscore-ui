import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Download } from 'lucide-react';
import { config } from '../config';

const DownloadReport = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a license number');
      return;
    }
    
    setLicenseNo(searchQuery);
    await fetchInvoiceData(searchQuery);
  };

  const fetchInvoiceData = async () => {
    const license = await localStorage.getItem("dl_code");
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_HOST}/api/user/getInvoiceRD?licenseNo=${license}`);
      
      if (response.status === 404) {
        setError('No invoices found in database');
        setInvoices([]);
        return;
      }
      
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

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const handleDownloadExcel = async () => {
    const license = await localStorage.getItem("dl_code");
    try {
      setDownloading(true);
      const response = await fetch(`${config.API_HOST}/api/user/downloadReport/excel?license=${license}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      // Create a blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_report_${license}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(`Error downloading report: ${err.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-4 bg-white rounded-lg shadow">
      <div className="border-b p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Your Detailed Report</h2>
          <button
            onClick={handleDownloadExcel}
            disabled={downloading || loading || invoices.length === 0}
            className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download Excel Report
          </button>
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

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Invoice
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  License Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Invoice Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Delay Days
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Invoice Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {invoice.invoice}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {invoice.pharmadrugliseanceno}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatDate(invoice.invoiceDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatDate(invoice.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {invoice.delayDays}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {invoice.invoiceAmount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DownloadReport;