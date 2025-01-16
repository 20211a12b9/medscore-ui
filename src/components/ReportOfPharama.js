import React, { useState,useEffect } from 'react';
import { Loader2, AlertCircle, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { config } from '../config';
import { Navbar } from './Navbar';

const ReportOfPharama = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const {license}=location.state || {}

const [dl_code,setDl_code]=useState('');
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
    
 
      
    try {
      setLoading(true);
      setError(null);
      const distId = localStorage.getItem('userId');
      const license2=license.trim().toUpperCase();
      const response = await fetch(`${config.API_HOST}/api/user/getInvoiceRDforDist/${distId}?licenseNo=${license2}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        const sortedInvoices = result.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
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

  useEffect(()=>{
         fetchInvoiceData();
        
  },[])
  const handleSendNotice = async (invoice) => {
    try {
      if (!window.confirm(`Are you sure you want to send notice for Invoice ${invoice.invoice}?`)) {
        return;
      }
      const userId =await localStorage.getItem("userId");
      console.log("userId",userId)
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
    <div className="max-w-5xl mx-auto mt-4 bg-white rounded-lg shadow">
      <div className="fixed top-0 left-0 w-full z-50">
  <Navbar />
</div>
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold text-gray-900">{license} Detailed Report</h2>
       
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
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    SerialNo 
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Issued On 
                  </th>
                  {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Issued On
                  </th> */}
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Invoice Date
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Delay Days
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Invoice Amount
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Reason/Remark
                  </th>
                 
                 
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {invoice.serialNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(invoice.createdAt)}
                    </td>
                    {/* <td className="px-4 py-3 text-sm text-gray-900">
                      {invoice.pharmadrugliseanceno}
                    </td> */}
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(invoice.invoiceData)}
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
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {invoice.reason}
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

export default ReportOfPharama;