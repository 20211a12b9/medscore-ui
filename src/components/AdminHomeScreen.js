import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Search, User, X, LogOut } from 'lucide-react';
import { config } from '../config';

export const AdminHomeScreen = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDistModal, setShowDistModal] = useState(false);
  const [distData, setDistData] = useState(null);
  const [distLoading, setDistLoading] = useState(false);
  const [distError, setDistError] = useState(null);

  const handleLogout = () => {
    // Add your logout logic here
    // For example: clear localStorage, redirect to login page, etc.
    localStorage.clear();
    window.location.href = '/login';
  };

  // Rest of your existing functions...
  const handleSearch = async (e) => {
    e.preventDefault();
    const formattedLicenseNo = licenseNo.trim().toUpperCase();
    await fetchInvoiceData(formattedLicenseNo);
};

  const fetchInvoiceData = async (licenseNo) => {
    console.log("licenseNo", licenseNo);
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_HOST}/api/user/getInvoiceRD/${licenseNo}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("result--", result);
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

  const fetchDistributorData = async (customerId) => {
    try {
      setDistLoading(true);
      setDistError(null);
      const response = await fetch(`${config.API_HOST}/api/user/getDistData/${customerId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setDistData(result.data);
        setShowDistModal(true);
      } else {
        throw new Error(result.message || 'Failed to fetch distributor data');
      }
    } catch (err) {
      setDistError(err.message);
    } finally {
      setDistLoading(false);
    }
  };

  const handleSendNotice = async (invoice) => {
    try {
      if (!window.confirm(`Are you sure you want to send notice for Invoice ${invoice.invoice}?`)) {
        return;
      }
      const userId = await localStorage.getItem("userId");
      setLoading(true);
      const response = await fetch('/api/notices/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceId: invoice._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to send notice');
      }

      const result = await response.json();
      if (result.success) {
        alert('Notice sent successfully!');
        fetchInvoiceData(licenseNo);
      } else {
        throw new Error(result.message || 'Failed to send notice');
      }
    } catch (err) {
      alert(`Error sending notice: ${err.message}`);
    } finally {
      setLoading(false);
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
    <div className="max-w-7xl mx-auto mt-4">
      {/* Added header with logo and logout button */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
  <div className="flex items-center">
    <img
      src="medscorelogo.jpeg"
      alt="Company Logo"
      className="h-20 w-20 mr-2"
    />
  </div>
  
  <div className="flex-grow text-center">
    <h1 className="text-2xl font-bold text-blue-900 color-blue">Admin Dashboard</h1>
  </div>
  
  <button
    onClick={handleLogout}
    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
  >
    <LogOut className="w-4 h-4 mr-2" />
    Logout
  </button>
</div>


      <div className="bg-white rounded-lg shadow">
        <div className="border-b p-6">
          <h2 className="text-2xl font-bold text-gray-900">Search and get data</h2>
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
        </div>

        {/* Rest of your existing JSX... */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {invoices && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SerialNo</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">License Number</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delay Days</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Reason for Dispute</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Distributor Update</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.serialNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.invoice}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.pharmadrugliseanceno}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatDate(invoice.invoiceDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.delayDays}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.invoiceAmount}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{invoice.reasonforDispute || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {invoice.updatebydistBoolean ? formatDate(invoice.updatebydist) : 'Distributor not yet updated'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleSendNotice(invoice)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                          >
                            Update Record
                          </button>
                          <button
                            onClick={() => fetchDistributorData(invoice.customerId)}
                            className="px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                          >
                            <User className="w-4 h-4 mr-1" />
                            View Distributor
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showDistModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Distributor Details</h3>
                <button
                  onClick={() => setShowDistModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {distLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}

              {distError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <span className="text-red-700">{distError}</span>
                </div>
              )}

              {distData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pharmacy Name</label>
                      <p className="mt-1 text-sm text-gray-900">{distData.pharmacy_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="mt-1 text-sm text-gray-900">{distData.phone_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-1 text-sm text-gray-900">{distData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">DL Code</label>
                      <p className="mt-1 text-sm text-gray-900">{distData.dl_code}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHomeScreen;