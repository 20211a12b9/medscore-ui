import React, { useState, useEffect } from 'react';
import { LogOut,User,Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

export const PharmacyHomepage = ({ onLogout }) => {
  const [licenseNo, setLicenseNo] = useState('');
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noticeCount, setNoticeCount] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };
  const handleProfileClick = () => {
    onNavigate('/PharmaProfile');
    setIsProfileMenuOpen(false);
  };
  const onNavigate = useNavigate();

  const handleSearch = async () => {
    if (!licenseNo.trim()) {
      setError('Please enter a license number');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.API_HOST}/api/user/getInvoice/${licenseNo}`);
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

  const handleLogout = () => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  useEffect(() => {
    const fetchPharmaData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = localStorage.getItem("userId");
        console.log("User ID from localStorage:", userId);
        
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await fetch(
          `${config.API_HOST}/api/user/getPharamaDatainPharma/${userId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.Pdara) {  
          localStorage.setItem('dl_code', result.Pdara.dl_code);
        } else {
          throw new Error('No pharma data found');
        }

      } catch (err) {
        console.error("Error fetching pharma data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPharmaData();
  }, []); 

  useEffect(() => {
    const fetchNoticeCount = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userId = localStorage.getItem("userId");
        console.log("User ID from localStorage:", userId);
        const license = await localStorage.getItem("dl_code");
        
        if (!userId) {
          throw new Error("User ID not found in localStorage");
        }

        const response = await fetch(
          `${config.API_HOST}/api/user/countNotices?licenseNo=${license}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.totalCount) {  
          setNoticeCount(result.totalCount);
        } else {
          throw new Error('No pharma data found');
        }

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
    { label: 'View Only Score', path: '/CreditScoreDisplay', color: 'from-blue-500 to-blue-600' },
    { label: 'View Detail Report', path: '/PharmaReport', color: 'from-teal-500 to-teal-600' },
    { label: 'Download Detail Report', path: '/DownloadReport', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Notices', path: '/Notices', color: 'from-red-500 to-indigo-600', notificationCount: noticeCount }
   
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo and Logout */}
      <header className="bg-white shadow-md relative">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
             {/* Menu Button */}
             <button
            onClick={toggleProfileMenu}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 ml-2"
          >
            <Menu size={30} className="text-gray-600" />
          </button>
          {/* Logo */}
          <div className="relative group w-20 sm:w-30">
            <img 
              src="/medscore.png" 
              alt="Medscore Logo" 
              className="w-100 h-auto object-contain rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </div>


          {/* Profile Menu Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-[#74b4d5] rounded-lg shadow-lg py-1 z-50">
              <button
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                <User size={16} className="mr-2" />
                View Profile
              </button>
              {/* Add more menu items here if needed */}
            </div>
          )}

          {/* Search Bar */}
          

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center ml-2 gap-1 sm:gap-2 bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center py-16 rounded-2xl shadow-xl mb-10 transform hover:scale-[1.02] transition-transform duration-300">
          <h1 className="text-5xl font-bold mb-6">World's First Credit Score Platform for Medical Shops</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Revolutionizing credit risk management for the pharmaceutical industry. MedScore gives distributors reliable
            data to assess credit risks.
          </p>
        </section>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {navigationButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => onNavigate(btn.path)}
              className={`relative bg-gradient-to-r ${btn.color} text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base`}
            >
              {btn.label}
              {btn.notificationCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {btn.notificationCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Invoice Data Table */}
        {invoiceData.length > 0 && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  {['License No', 'Invoice No', 'Invoice Date', 'Due Date', 'Delay Days'].map((header, index) => (
                    <th key={index} className="px-6 py-4 text-left font-semibold text-gray-700">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoiceData.map((invoice, index) => (
                  <tr key={index} className="border-t hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-gray-700">{invoice.pharmadrugliseanceno}</td>
                    <td className="px-6 py-4 text-gray-700">{invoice.invoice}</td>
                    <td className="px-6 py-4 text-gray-700">{formatDate(invoice.invoiceData)}</td>
                    <td className="px-6 py-4 text-gray-700">{formatDate(invoice.dueDate)}</td>
                    <td className="px-6 py-4 text-gray-700">{invoice.delayDays}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Results Message */}
        {invoiceData.length === 0 && !loading && !error && licenseNo && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg mt-6 text-center shadow-md">
            No invoice data found for this license number.
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyHomepage;