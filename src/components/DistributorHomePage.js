import React, { useState, useEffect, useCallback } from 'react';
import { LogOut, Search, X, Menu, User, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

export const DistributorHomePage = ({ onLogout }) => {
  const [license, setLicenseNo] = useState('');
  const [suggestionList, setSuggestionList] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noticeCount, setNoticeCount] = useState(null);
  const [score, setScore] = useState(0);
  const [pharmacyData, setPharmacyData] = useState(0);
  const [oustandingTotal, setOutStandingTotal] = useState(0);

  const onNavigate = useNavigate();

  // Debounce function to limit API calls
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

  // Fetch pharmacy suggestions
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
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch pharmacy suggestions');
      }

      if (result.data && result.data.length > 0) {
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

  // Create a debounced version of fetchPharmacySuggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchPharmacySuggestions, 300), // 300ms delay
    [fetchPharmacySuggestions]
  );

  // Handle input change
  useEffect(() => {
    if (license.trim()) {
      debouncedFetchSuggestions(license);
    } else {
      // Clear everything when search is empty
      setSuggestionList([]);
      setShowSuggestions(false);
      setPharmacyData([]);
      setError(null);
      setScore(0);
      setInvoiceData('');
      setOutStandingTotal(0);
    }
  }, [license, debouncedFetchSuggestions]);

  // Handle suggestion selection
  const handleSuggestionSelect = (selectedPharmacy) => {
    setLicenseNo(selectedPharmacy.dl_code);
    setSuggestionList([]);
    setShowSuggestions(false);
    
    // Trigger search with the selected pharmacy's license code
    handleSearch(selectedPharmacy.dl_code);
  };
  const handleSearch = async (providedLicense) => {
    const license2 = (providedLicense || license).trim().toUpperCase();

    if (!license2) {
      setError('Please enter a license number');
      return;
    }

    setInvoiceData('');
    setLoading(true);
    setError(null);

    try {
      // Fetch invoice data
      const distId = localStorage.getItem('userId');
      console.log("distIs",distId)
      const invoiceResponse = await fetch(
        `${config.API_HOST}/api/user/getInvoiceRDforDist/${distId}?licenseNo=${license2}`,
        {
          
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json'
          }
         
        }
      );
  
      // Check if response is JSON
      const contentType = invoiceResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again later.');
      }
      const invoiceResult = await invoiceResponse.json();
     
      console.log("invoiceResult",invoiceResult)
      if (!invoiceResponse.ok) {
        // Set score to 1000 when no data
        const response = await fetch(
        `${config.API_HOST}/api/user/getPharmaData?licenseNo=${license2}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json'
          }
        }
      );
      
      const result = await response.json();

      if (!response.ok) {
        const dresponse = await fetch(
          `${config.API_HOST}/api/user/getUploadedData?licenseNo=${license2}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              // 'Content-Type': 'application/json'
            }
          }
        );
        
        const dresult = await dresponse.json();
      
       
        setOutStandingTotal(Number(dresult[0].Total).toLocaleString('en-IN', { 
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'INR'
      }), "result")
        throw new Error(result.message || 'Failed to fetch pharmacy data');
      }
      console.log("---amam00",result.data[0])
      const dresponse = await fetch(
        `${config.API_HOST}/api/user/getUploadedData?licenseNo=${license2}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json'
          }
        }
      );
      
      const dresult = await dresponse.json();
    
     
      setOutStandingTotal(Number(dresult[0].Total).toLocaleString('en-IN', { 
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        style: 'currency',
        currency: 'INR'
    }), "result")
      setPharmacyData(result.data);
        setScore(1000);
        setInvoiceData([]);
        return;
      }

      if (!invoiceResult.data || invoiceResult.data.length === 0) {
        // Set score to 1000 when no data
        const response = await fetch(
          `${config.API_HOST}/api/user/getPharmaData?licenseNo=${license2}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              // 'Content-Type': 'application/json'
            }
          }
        );
        
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch pharmacy data');
        }
        console.log("---amam00",result.data[0])
        setPharmacyData(result.data);
          setScore(1000);
          setInvoiceData([]);
        
        return;
      }
      const response = await fetch(
        `${config.API_HOST}/api/user/getPharmaData?licenseNo=${license2}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            // 'Content-Type': 'application/json'
          }
        }
      );
      
      const result = await response.json();

      if (!response.ok) {
        
        throw new Error(result.message || 'Failed to fetch pharmacy data');
      }
      console.log("---amam00",result.data[0])
      setPharmacyData(result.data);
        
        
      setInvoiceData(invoiceResult.data);
      const calculatedScore2 = calculateScore(invoiceResult.data);
      setScore(calculatedScore2);
      setInvoiceData(invoiceResult.data);
      
      const calculatedScore = calculateScore(invoiceResult.data);
        setScore(calculatedScore);
        const dresponse = await fetch(
          `${config.API_HOST}/api/user/getUploadedData?licenseNo=${license2}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              // 'Content-Type': 'application/json'
            }
          }
        );
        
        const dresult = await dresponse.json();
      
       
        setOutStandingTotal(Number(dresult[0].Total).toLocaleString('en-IN', { 
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'INR'
      }), "result")
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };
    const handleViewButton =(license)=>{
     onNavigate('/ReportOfPharama',{
      state:{license:license}
     })
    }
  const handleLogout = () => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };
  const handleClear = () => {
    setLicenseNo('');
    setError(null);
    setScore(0);
    setInvoiceData('');
  };
  const handleNavigate = (path) => {
    window.location.href = path;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const navigationButtons = [
    { label: 'Link Customer', path: '/PharmacySearch', color: 'bg-gradient-to-r from-[#517296] via-[#6eaece] to-[#8dc0df]'},
    { label: 'Send Reminder', path: '/SendNotice', color: 'from-orange-900 to-orange-500' },
    { label: 'Report Default', path: '/ReportDefault', color: 'from-red-900 to-red-500' },
    { label: 'Update Payment Details', path: '/UpdateDefaultReport', color: 'from-green-900 to-green-500' },
    { label: 'Add Customer', path: '/Addcustomer', color: 'bg-gradient-to-r from-[#517296] via-[#6eaece] to-[#8dc0df]' },
    { label: 'Upload Your Outstanding File', path: '/FileUpload', color: 'from-yellow-900 to-yellow-600' },
  ];
 

  const COLORS = ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#ef4444'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getCreditScoreStatus = (score) => {
    if (score >= 900) {
      return {
        category: 'Excellent',
        description: 'Extremely reliable payer with excellent payment history',
        color: '#22c55e',
        riskLevel: 'Very Low Risk'
      };
    } else if (score >= 800) {
      return {
        category: 'Good',
        description: 'Very reliable payer with strong payment history',
        color: '#3b82f6',
        riskLevel: 'Low Risk'
      };
    } else if (score >= 700) {
      return {
        category: 'Fair',
        description: 'Generally reliable payer with occasional delays',
        color: '#eab308',
        riskLevel: 'Medium Risk'
      };
    } else if (score >= 600) {
      return {
        category: 'Need Improvement',
        description: 'Somewhat reliable payer with frequent delays',
        color: '#f97316',
        riskLevel: 'High Risk'
      };
    } else {
      return {
        category: 'Poor',
        description: 'Unreliable payer with significant payment issues',
        color: '#ef4444',
        riskLevel: 'Very High Risk'
      };
    }
  };
  const calculateScore = (invoices) => {
    if (!invoices?.length) return 1000;
  
    const sortedInvoices = [...invoices].sort((a, b) => 
      new Date(b.invoiceDate) - new Date(a.invoiceDate)
    );
  
    // Base score starts at 1000
    let baseScore = 1000;
  
    // 1. Payment History Component (50% of score deduction)
    const paymentHistoryDeductions = sortedInvoices.reduce((acc, invoice, index) => {
      const delayDays = invoice.delayDays;
      const recency = Math.exp(-index * 0.1); // More recent invoices have higher weight
  
      // Progressive deduction based on delay severity
      let deduction = 0;
      if (delayDays <= 0) {
        deduction = 0; // On-time payment, no deduction
      } else if (delayDays <= 7) {
        deduction = 5 * recency; // Minor delay
      } else if (delayDays <= 15) {
        deduction = 15 * recency; // Moderate delay
      } else if (delayDays <= 30) {
        deduction = 30 * recency; // Significant delay
      } else if (delayDays <= 60) {
        deduction = 50 * recency; // Severe delay
      } else {
        deduction = 500 * recency; // Critical delay
      }
  
      return acc + deduction;
    }, 0);
  
    // 2. Payment Consistency Component (25% of score deduction)
    const delayVariance = sortedInvoices.reduce((acc, invoice) => {
      return acc + Math.pow(invoice.delayDays, 2);
    }, 0) / sortedInvoices.length;
    
    const consistencyDeduction = Math.min(125, Math.sqrt(delayVariance) * 2);
  
    // 3. Recent Payment Behavior (15% of score deduction)
    const recentInvoices = sortedInvoices.slice(0, Math.min(3, sortedInvoices.length));
    const recentBehaviorDeduction = recentInvoices.reduce((acc, invoice) => {
      return acc + (invoice.delayDays > 0 ? 25 : 0);
    }, 0);
  
    // 4. Payment Trend Component (10% of score deduction)
    let trendDeduction = 0;
    if (sortedInvoices.length >= 3) {
      const recent = sortedInvoices.slice(0, 3).reduce((acc, inv) => acc + inv.delayDays, 0) / 3;
      const older = sortedInvoices.slice(-3).reduce((acc, inv) => acc + inv.delayDays, 0) / 3;
      if (recent > older) {
        trendDeduction = Math.min(50, (recent - older) * 2); // Worsening trend
      }
    }
  
    // Calculate final score
    const totalDeduction = Math.min(900, 
      paymentHistoryDeductions * 0.5 + // 50% weight
      consistencyDeduction * 0.25 + // 25% weight
      recentBehaviorDeduction * 0.15 + // 15% weight
      trendDeduction * 0.1 // 10% weight
    );
  
    return Math.round(baseScore - totalDeduction);
  };

  

 

  const getDelayCategory = (days) => {
    if (days <= 0) return 'On Time';
    if (days <= 7) return '1-7 days';
    if (days <= 14) return '8-14 days';
    if (days <= 30) return '15-30 days';
    return '30+ days';
  };

  const calculateRotation = (score) => {
    return ((score - 100) / 900) * 180 - 90;
  };

  const processDataForCharts = () => {
    if (!invoiceData?.length) {
      // Return maximum values when no invoice data
      return {
        pieData: [
          { name: 'On Time', value: 100 }  // Show 100% on-time payments
        ],
        lineData: MONTHS.map(month => ({ 
          month, 
          score: 1000,  // Maximum score for each month
          invoiceCount: 0 
        }))
      };
    }
    

    // Process delay distribution for pie chart
    const delayDistribution = invoiceData.reduce((acc, inv) => {
      const category = getDelayCategory(inv.delayDays);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    
    const pieData = Object.entries(delayDistribution)
      .map(([name, value]) => ({ name, value }));

    const sortedInvoices = [...invoiceData].sort((a, b) => 
      new Date(a.invoiceDate) - new Date(b.invoiceDate)
    );

    let cumulativeInvoices = [];
    const lineData = MONTHS.map(month => {
      const monthIndex = MONTHS.indexOf(month);
      const currentYearInvoices = sortedInvoices.filter(inv => {
        const invDate = new Date(inv.invoiceDate);
        const invMonth = invDate.getMonth();
        return invMonth <= monthIndex;
      });

      cumulativeInvoices = currentYearInvoices;
      const monthScore = currentYearInvoices.length > 0 
        ? calculateScore(currentYearInvoices)
        : 1000;

      return {
        month,
        score: monthScore,
        invoiceCount: currentYearInvoices.length
      };
    });

    return { pieData, lineData };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-500 p-6 bg-red-50 rounded-lg">
        <AlertCircle className="h-5 w-5" />
        <span className="font-medium">{error}</span>
      </div>
    );
  }

  const { pieData, lineData } = processDataForCharts();
  const { category, color,riskLevel } = getCreditScoreStatus(score);

  return (
    <div className="min-h-screen bg-gray-50">
     
       <Navbar/>
       <div className="container mx-auto px-4 py-8">
        {/* Search with Suggestions */}
        
        <div className="relative w-full sm:max-w-xl sm:mx-8 mb-5">
          <div className="relative">
            <input
              type="text"
              value={license}
              onChange={(e) => setLicenseNo(e.target.value)}

              placeholder="Enter pharmacy name or drug license No..."
              className="w-full px-5 py-2 pr-15 ml-1 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
              onFocus={() => {
                if (suggestionList.length > 0) {
                  setShowSuggestions(true);
                }
              }}
            />
            {license && (
              <button
                onClick={() => {
                  setLicenseNo('');
                  setSuggestionList([]);
                  setShowSuggestions(false);
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            )}
          
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestionList.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestionList.map((pharmacy, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionSelect(pharmacy)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"
                >
                  <span className="font-medium">{pharmacy.pharmacy_name}</span>
                  <span className="text-gray-500 text-sm">{pharmacy.dl_code}</span>
                </div>
              ))}
            </div>
          )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
           {/* Invoice Data Table */}
        {score >0 && (
         <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
         <h1 className="text-2xl font-bold mb-6 text-gray-900">Credit Analytics Dashboard</h1>
         
         <div class="bg-[#91C4E1] rounded-lg shadow-md px-6 py-8">
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="flex items-center">
      <h1 class="text-lg font-bold text-[#121441]">Pharmacy Name:</h1>
      <span class="text-lg font-semibold text-red-500 ml-2">
        {pharmacyData[0].pharmacy_name}
      </span>
    </div>
    <div class="flex items-center">
      <h1 class="text-lg font-bold text-[#121441]">Drug License No:</h1>
      <span class="text-lg font-semibold text-red-500 ml-2">
        {pharmacyData[0].dl_code}
      </span>
    </div>
    <div class="flex items-center">
      <h1 class="text-lg font-bold text-[#121441]">Contact Details:</h1>
      <span class="text-lg font-semibold text-red-500 ml-2">
        {pharmacyData[0].phone_number}
      </span>
    </div>
    <div class="flex items-center">
      <h1 class="text-lg font-bold text-[#121441]">Expiry Date:</h1>
      <span class="text-lg font-semibold text-red-500 ml-2">
        {pharmacyData[0].expiry_date}
      </span>
    </div>
  </div>
</div>
<button 
                onClick={() => onNavigate('/ReportOfPharama', {
                  state: { license: pharmacyData[0].dl_code, }
                })}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"

              >
                Click to get Detailed Report

              </button>
             <div>
             
             <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-b from-[#8dc0df] to-[#121441] bg-clip-text text-transparent">
  Total Market Outstanding: {oustandingTotal}
</h1>
              </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Credit Score Gauge */}
          
           <div className="bg-white rounded-lg shadow-md p-6">
             <h2 className="text-lg font-semibold mb-4 text-gray-900">MedScore</h2>
             <div className="relative">
               <svg viewBox="0 0 200 140" className="w-full">
               <text x="104" y="117" textAnchor="middle" className="text-xs font-mono">
               <tspan fill={'blue'}>{category}</tspan>
              
               </text>
               <text x="104" y="130" textAnchor="middle" className="text-xs font-mono">
              
               <tspan fill={color}>{riskLevel}</tspan>
               </text>
                 <defs>
                   <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#ef4444" />
                     <stop offset="50%" stopColor="#eab308" />
                     <stop offset="100%" stopColor="#22c55e" />
                   </linearGradient>
                 </defs>
                 
                 <path
                   d="M 30 100 A 70 70 0 0 1 170 100"
                   fill="none"
                   stroke="#e5e7eb"
                   strokeWidth="12"
                   strokeLinecap="round"
                 />
   
                 <path
                   d="M 30 100 A 70 70 0 0 1 170 100"
                   fill="none"
                   stroke="url(#scoreGradient)"
                   strokeWidth="12"
                   strokeLinecap="round"
                   strokeDasharray="220"
                   strokeDashoffset={(1 - (score - 100) / 900) * 220}
                 />
   
                 <circle cx="100" cy="100" r="8" fill="#1f2937" />
                 <line
                   x1="100"
                   y1="100"
                   x2="100"
                   y2="40"
                   stroke="#1f2937"
                   strokeWidth="3"
                   strokeLinecap="round"
                   transform={`rotate(${calculateRotation(score)}, 100, 100)`}
                 />
   
                 <text x="30" y="130" className="text-sm" fill="#6b7280">100</text>
                 <text x="165" y="130" className="text-sm" fill="#6b7280">1000</text>
                 <text 
                   x="100" 
                   y="80" 
                   textAnchor="middle" 
                   className="text-3xl font-bold" 
                   fill="#1f2937"
                 >
                   {score}
                 </text>
                 
               </svg>
               
             </div>
           </div>
   
           {/* Payment Delay Distribution */}
           <div className="bg-white rounded-lg shadow-md p-6">
             <h2 className="text-lg font-semibold mb-4 text-gray-900">Payment Delay Distribution</h2>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={pieData}
                     dataKey="value"
                     nameKey="name"
                     cx="50%"
                     cy="50%"
                     outerRadius={100}
                     label={({ name, percent }) => 
                       ` (${(percent * 100).toFixed(0)}%)`
                     }
                   >
                     {pieData.map((entry, index) => (
                       <Cell 
                         key={`cell-${index}`} 
                         fill={COLORS[index % COLORS.length]} 
                       />
                     ))}
                   </Pie>
                   <Tooltip />
                 </PieChart>
               </ResponsiveContainer>
             </div>
           </div>
   
           {/* Monthly Score Trend */}
           <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
             <h2 className="text-lg font-semibold mb-4 text-gray-900">
               Monthly Credit Score Trend
               <span className="text-sm font-normal text-gray-500 ml-2">
                 (Cumulative calculation)
               </span>
             </h2>
             <div className="h-80">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={lineData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                   <XAxis 
                     dataKey="month" 
                     stroke="#6b7280"
                     tick={{ fill: '#6b7280' }}
                   />
                   <YAxis 
                     domain={[0, 1000]}
                     ticks={[0, 200, 400, 600, 800, 1000]}
                     stroke="#6b7280"
                     tick={{ fill: '#6b7280' }}
                   />
                   <Tooltip 
                     contentStyle={{ 
                       backgroundColor: 'white',
                       border: '1px solid #e5e7eb'
                     }}
                     formatter={(value, name, props) => [
                       [`Score: ${value}`, `Invoices: ${props.payload.invoiceCount}`]
                     ]}
                   />
                   <Line 
                     type="monotone" 
                     dataKey="score" 
                     stroke="#3b82f6" 
                     strokeWidth={2}
                     dot={{ fill: '#3b82f6', r: 4 }}
                     activeDot={{ r: 6 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
             </div>
           </div>
         </div>
       </div>
        )}
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#8dc0df] via-[#6eaece] to-[#517296] text-[#121441] text-center py-16 rounded-2xl shadow-xl mb-10 transform hover:scale-[1.02] transition-transform duration-300">
          <h1 className="text-5xl font-bold mb-6 text-[#121441]">World's First Credit Risk Platform for Pharma & Healthcare Distribution</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto italic font-bold">
            Revolutionizing credit risk management for the pharmaceutical industry. MedScore gives distributors reliable
            data to assess credit risks.
          </p>
          {noticeCount !== null && (
            <p className="text-lg">
              Total Notices: <span className="font-bold">{noticeCount}</span>
            </p>
          )}
        </section>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {navigationButtons.map((btn, index) => (
            <button
              key={index}
              onClick={() => onNavigate(btn.path)}
              className={`bg-gradient-to-r ${btn.color} text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        )}

       

        {/* No Results Message */}
       
      </div>
    </div>
  );
};

export default DistributorHomePage;