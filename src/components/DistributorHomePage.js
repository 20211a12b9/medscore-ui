import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Search, X, Menu, User, IndianRupee, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { Navbar } from './Navbar';
import Chatbot from './Chatbot';

export const DistributorHomePage = ({ onLogout }) => {
  const [license, setLicenseNo] = useState('');
  const [suggestionList, setSuggestionList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noticeCount, setNoticeCount] = useState(null);
  const [countDipsutes, setCountDisputes] = useState([]);
  const onNavigate = useNavigate();

  // Existing fetch disputes count useEffect...
  useEffect(() => {
    const fetchDisputesCount = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = localStorage.getItem("userId");
        const license = await localStorage.getItem("dl_code");
        if (!userId) throw new Error("User ID not found in localStorage");
        
        const response = await fetch(
          `${config.API_HOST}/api/user/countDisputes?licenseNo=${userId}`,
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
        if (result.totalCount) setCountDisputes(result.totalCount);
      } catch (err) {
        console.error("Error fetching pharma data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDisputesCount();
  }, []);

  // Existing debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Existing fetchPharmacySuggestions function
  const fetchPharmacySuggestions = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestionList([]);
      setShowSuggestions(false);
      return;
    }

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
      if (!response.ok) throw new Error(result.message || 'Failed to fetch pharmacy suggestions');
      
      if (result.data?.length > 0) {
        setSuggestionList(result.data);
        setShowSuggestions(true);
      } else {
        setSuggestionList([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('Error fetching pharmacy suggestions:', err);
      setSuggestionList([]);
      setShowSuggestions(false);
    }
  }, []);

  const debouncedFetchSuggestions = useCallback(
    debounce(fetchPharmacySuggestions, 300),
    [fetchPharmacySuggestions]
  );

  useEffect(() => {
    if (license.trim()) {
      debouncedFetchSuggestions(license);
    } else {
      setSuggestionList([]);
      setShowSuggestions(false);
      setError(null);
    }
  }, [license, debouncedFetchSuggestions]);

  const handleSuggestionSelect = (selectedPharmacy) => {
    setLicenseNo(selectedPharmacy.dl_code);
    setSuggestionList([]);
    setShowSuggestions(false);
    handleSearch(selectedPharmacy.dl_code);
  };

  const handleSearch = async (providedLicense) => {
    const license2 = (providedLicense || license).trim().toUpperCase();
    onNavigate('/DistributorSerchedCreditscore', { state: { license: license2 } });
  };

  const navigationButtons = [
    { 
      label: 'Link Customer', 
      path: '/PharmacySearch', 
      color: 'bg-blue-600 hover:bg-blue-700',
      icon: User
    },
    { 
      label: 'Send Reminder', 
      path: '/SendNotice', 
      color: 'bg-amber-600 hover:bg-amber-700',
      icon: AlertCircle
    },
    { 
      label: 'Report Default', 
      path: '/ReportDefault', 
      color: 'bg-red-600 hover:bg-red-700',
      icon: AlertCircle
    },
    { 
      label: 'Update Payment Details', 
      path: '/UpdateDefaultReport', 
      color: 'bg-green-600 hover:bg-green-700',
      icon: IndianRupee
    },
    { 
      label: 'Add Customer', 
      path: '/Addcustomer', 
      color: 'bg-purple-600 hover:bg-purple-700',
      icon: User
    },
    { 
      label: 'Upload Outstanding File', 
      path: '/FileUpload', 
      color: 'bg-teal-600 hover:bg-teal-700',
      icon: Menu
    },
    { 
      label: 'Disputed Data', 
      path: '/DisputedDatainDistribuorScn', 
      color: 'bg-orange-600 hover:bg-orange-700',
      icon: AlertCircle,
      notificationCount: countDipsutes 
    }
  ];
  const loadingnavigationButtons = [
    { 
      label: 'Link Customer', 
      path: '/PharmacySearch', 
      color: 'bg-grey-300 hover:bg-grey-500',
      icon: User
    },
    { 
      label: 'Send Reminder', 
      path: '/SendNotice', 
      color: 'bg-grey-300 hover:bg-grey-500',
      icon: AlertCircle
    },
    { 
      label: 'Report Default', 
      path: '/ReportDefault', 
      color: 'bg-grey-300 hover:bg-grey-500',
      icon: AlertCircle
    },
    { 
      label: 'Update Payment Details', 
      path: '/UpdateDefaultReport', 
      color: 'bg-grey-300 hover:bg-grey-500',
      icon: IndianRupee
    },
    { 
      label: 'Add Customer', 
      path: '/Addcustomer', 
      color: 'bg-grey-300 hover:bg-grey-500',
      icon: User
    },
    { 
      label: 'Upload Outstanding File', 
      path: '/FileUpload', 
      color: 'bg-grey-300 hover:bg-grey-500',
      icon: Menu
    },
    { 
      label: 'Disputed Data', 
      path: '/DisputedDatainDistribuorScn', 
      color: 'bg-grey-300 hover:bg-grey-500',
      icon: AlertCircle,
      notificationCount: countDipsutes 
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
       <div className="fixed top-0 left-0 w-full z-50">
                      <Navbar />
                    </div>
     
      <div className="container mx-auto px-4 py-8">
      {/* <img className="absolute  left-0" src="img/Distributor.png" /> */}
        {/* Hero Section */}
        

<section className=" text-white text-center py-10 rounded-2xl shadow-xl mt-20 mb-10 transform hover:scale-[1.02] transition-transform duration-300"style={{ backgroundImage: `url('img/cta-bg.jpg')` }}>
          <h1 className="text-5xl font-serif mb-6 text-white">World's First Credit Risk Assessment Platform for Pharma & Healthcare Distribution</h1>
          <p className="text-lg mb-8 max-w-3xl mx-auto italic font-mono">
            Revolutionizing credit risk management for the pharmaceutical industry. MedScore gives distributors reliable
            data to assess credit risks.
          </p>
          {noticeCount !== null && (
            <p className="text-lg">
              Total Notices: <span className="font-bold">{noticeCount}</span>
            </p>
          )}
        </section>
        

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto mb-12 animate-pulse">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={license}
              onChange={(e) => setLicenseNo(e.target.value)}
              placeholder=""
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 animate-pulse focus:ring-gray-400 focus:border-transparent transition-all duration-200 bg-gray-200"
            />
            
          </div>

        </div>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {loadingnavigationButtons.map((btn, index) => {
            const IconComponent = btn.icon;
            return (
              <button
                key={index}
                
                className={`relative group bg-gray-200 text-gray-300 rounded-lg p-6 shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-center space-x-3 animate-pulse">
                  <IconComponent className="bg-gray-300 p-3 rounded-lg w-12 h-12 animate-pulse" />
                  <span className="h-8 w-64 bg-gray-300 rounded animate-pulse"></span>
                  
                </div>
                {btn.notificationCount < 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-300 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                   
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
       <div className="fixed top-0 left-0 w-full z-50">
                      <Navbar />
                    </div>
     
      <div className="container mx-auto px-4 py-8">
      {/* <img className="absolute  left-0" src="img/Distributor.png" /> */}
        {/* Hero Section */}
        

<section className=" text-white text-center py-10 rounded-2xl shadow-xl mt-20 mb-10 transform hover:scale-[1.02] transition-transform duration-300"style={{ backgroundImage: `url('img/cta-bg.jpg')` }}>
          <h1 className="text-5xl font-serif mb-6 text-white">World's First Credit Risk Assessment Platform for Pharma & Healthcare Distribution</h1>
          <p className="text-lg mb-8 max-w-3xl mx-auto italic font-mono">
            Revolutionizing credit risk management for the pharmaceutical industry. MedScore gives distributors reliable
            data to assess credit risks.
          </p>
          {noticeCount !== null && (
            <p className="text-lg">
              Total Notices: <span className="font-bold">{noticeCount}</span>
            </p>
          )}
        </section>
        

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={license}
              onChange={(e) => setLicenseNo(e.target.value)}
              placeholder="Search pharmacy name or license number..."
              className="w-full pl-10 pr-10 py-3 border-2 border-blue-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-200"
            />
            {license && (
              <button
                onClick={() => {
                  setLicenseNo('');
                  setSuggestionList([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestionList.length > 0 && (
            <div className="absolute z-50 w-full bg-white rounded-lg shadow-xl mt-2 border border-gray-100 overflow-hidden">
              {suggestionList.map((pharmacy, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionSelect(pharmacy)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-gray-800">{pharmacy.pharmacy_name}</div>
                  <div className="text-sm text-gray-500">{pharmacy.dl_code}</div>
                </div>
              ))}
            </div>
          )}
        </div>
<Chatbot/>
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationButtons.map((btn, index) => {
            const IconComponent = btn.icon;
            return (
              <button
                key={index}
                onClick={() => onNavigate(btn.path)}
                className={`relative group ${btn.color} text-white rounded-lg p-6 shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-6 h-6" />
                  <span className="text-lg font-semibold">{btn.label}</span>
                </div>
                {btn.notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {btn.notificationCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DistributorHomePage;