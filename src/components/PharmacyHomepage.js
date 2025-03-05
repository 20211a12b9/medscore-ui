import React, { useState, useEffect } from 'react';
import { LogOut, User, Menu, Search, Bell, AlertCircle, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { PharmaNavbar } from './PharmaNavbar';
import Chatbot from './Chatbot';

export const PharmacyHomepage = ({ onLogout }) => {
  const [licenseNo, setLicenseNo] = useState('');
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noticeCount, setNoticeCount] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const onNavigate = useNavigate();

  // Existing functionality...
  const handleSearch = async () => {
    if (!licenseNo.trim()) {
      setError('Please enter a license number');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.API_HOST}/api/user/getInvoice/${licenseNo}`, {
        method: 'GET',
        // headers: {
        //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
        //     'Content-Type': 'application/json',
        // },
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch invoice data');
      }
      setInvoiceData(result.data);
    } catch (err) {
      setError(err.message || 'Error fetching invoice data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchNoticeCount = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = localStorage.getItem("userId");
        const license = await localStorage.getItem("dl_code");
        
        if (!userId) throw new Error("User ID not found in localStorage");

        const response = await fetch(
          `${config.API_HOST}/api/user/countNotices?licenseNo=${license}`,
          {
            method: 'GET',
            // headers: {
            //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            //     'Content-Type': 'application/json',
            // },
          }
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.totalCount) setNoticeCount(result.totalCount);

      } catch (err) {
        console.error("Error fetching pharma data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticeCount();
  }, []);

  const navigationButtons = [
    { 
      label: 'View Score', 
      description: 'Check your current Medscore',
      path: '/CreditScoreDisplay', 
      color: 'bg-blue-600',
      icon: FileText
    },
    { 
      label: 'Detail Report', 
      description: 'View comprehensive analysis',
      path: '/PharmaReport', 
      color: 'bg-emerald-600',
      icon: Search
    },
    { 
      label: 'Download Report', 
      description: 'Get detailed PDF report',
      path: '/DownloadReport', 
      color: 'bg-purple-600',
      icon: Download
    },
    { 
      label: 'Reminders', 
      description: 'View pending notifications',
      path: '/Notices', 
      color: 'bg-amber-600',
      icon: Bell,
      notificationCount: noticeCount 
    }
  ];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50" >
      <PharmaNavbar />

      <div className="container mx-auto px-4 py-8" >
        {/* Hero Section */}
        <section className=" text-white text-center py-10 rounded-2xl shadow-xl mt-20 mb-10 transform hover:scale-[1.02] transition-transform duration-300"style={{ backgroundImage: `url('img/cta-bg.jpg')` }}>
          <h1 className="text-5xl font-serif mb-6 text-white">World's First Credit Risk Assessment Platform for Pharma & Healthcare Distribution</h1>
          <p className="text-lg mb-8 max-w-3xl mx-auto italic font-mono">
            Revolutionizing credit risk management for the pharmaceutical industry. MedScore gives distributors reliable
            data to assess credit risks.
          </p>
          
        </section>
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {navigationButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => onNavigate(btn.path)}
              className={`relative group ${btn.color} text-white rounded-xl p-6 shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <btn.icon className="w-8 h-8 mb-2" />
                <span className="text-lg font-semibold">{btn.label}</span>
                <span className="text-sm opacity-90">{btn.description}</span>
              </div>
              {btn.notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {btn.notificationCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Invoice Data Section */}
        {invoiceData.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Invoice History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delay Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoiceData.map((invoice, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.pharmadrugliseanceno}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.invoice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(invoice.invoiceData)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.delayDays}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
<Chatbot/>
        {/* No Results Message */}
        {invoiceData.length === 0 && !loading && !error && licenseNo && (
          <div className="flex items-center justify-center p-8 bg-blue-50 rounded-xl border border-blue-100">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-blue-700">No invoice data found for this license number.</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyHomepage;