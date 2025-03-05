import React, { useState, useEffect } from 'react';
import { config } from '../config';
import { CalendarDays, DollarSign, Clock, AlertCircle, IndianRupee,Search,Building2,Send } from 'lucide-react';

import Navbar from './Navbar';
const DetailedDefaultedData = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [invoiceHistory, setInvoiceHistory] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    limit: 10,
    totalRecords: 0
  });

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        const distId = localStorage.getItem('userId');
        const { currentPage, limit } = pagination;

        const response = await fetch(
          `${config.API_HOST}/api/user/getinvoiceDetailedRDbydistId/${distId}?page=${currentPage}&limit=${limit}`,
          {
            method:'GET',
            // headers:{
            //   'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            //   'content-type':'application/json'
            // }
          }
        );
        const result = await response.json();

        if (result.success) {
          const sortedInvoices = result.data.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setInvoiceHistory(sortedInvoices);
          setInvoices(sortedInvoices);

          // Update pagination state
          setPagination(prev => ({
            ...prev,
            totalPages: result.pagination?.totalPages || 0,
            totalRecords: result.pagination?.totalCount || 0
          }));
        } else {
          setError('Failed to fetch invoices');
        }
      } catch (err) {
        console.error('Error fetching invoice history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [pagination.currentPage]);  // Only re-fetch on page change

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const filteredInvoices = invoiceHistory.filter(invoice =>
    invoice.pharmacy_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 max-w-7xl mx-auto mt-6">
      Error loading invoices: {error}
    </div>;
  }
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'>
 <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm shadow-lg">
        <Navbar />
      </div>
    <div className="p-6 max-w-7xl mx-auto space-y-6 mt-20">
     

      <div className="relative mb-6 mt-10">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search by pharmacy name or invoice number..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button 
          onClick={() => handlePageChange(pagination.currentPage - 1)} 
          disabled={pagination.currentPage === 1}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(pagination.currentPage + 1)} 
          disabled={pagination.currentPage === pagination.totalPages}
          className="px-4 py-2 bg-purple-100 text-purple-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Invoice Table */}
      <div>
  <div className="flex items-center gap-3 mb-6">
    <Clock className="w-6 h-6 text-purple-400" />
    <h2 className="text-2xl font-bold text-purple-900">Total Default History</h2>
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
          {filteredInvoices.map((invoice) => (
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

export default DetailedDefaultedData;
