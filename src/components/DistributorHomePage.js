import React, { useState,useEffect } from 'react';
import { LogOut, Search,X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell ,LineChart,Line
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { config } from '../config';

export const DistributorHomePage = ({ onLogout }) => {
  const [license, setLicenseNo] = useState('');
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noticeCount, setNoticeCount] = useState(null);
  const [score, setScore] = useState(0);

 
  const onNavigate=useNavigate()
  const handleSearch = async () => {
    setInvoiceData('')
    
    if (!license.trim()) {
      setError('Please enter a license number');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Fetch invoice data
      const distId = localStorage.getItem('userId');
      const invoiceResponse = await fetch(
        `${config.API_HOST}/api/user/getInvoiceRDforDist/${distId}?licenseNo=${license}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
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
       
        return;
      }

      if (!invoiceResult.data || invoiceResult.data.length === 0) {
       
        return;
      }
      setInvoiceData(invoiceResult.data);

      const calculatedScore = calculateScore(invoiceResult.data);
        setScore(calculatedScore);
     
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
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
    { label: 'Link Customer', path: '/PharmacySearch', color: 'from-teal-500 to-teal-600' },
    { label: 'Send Notice', path: '/SendNotice', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Report Default', path: '/ReportDefault', color: 'from-purple-500 to-purple-600' },
    { label: 'Update Payment Details', path: '/UpdateDefaultReport', color: 'from-pink-500 to-pink-600' },
    { label: 'Add Customer', path: '/Addcustomer', color: 'from-pink-500 to-orange-600' },
  ];
 

  const COLORS = ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#ef4444'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const calculateScore = (invoices) => {
    if (!invoices?.length) return 1000;
    
    const sortedInvoices = [...invoices].sort((a, b) => 
      new Date(b.invoiceDate) - new Date(a.invoiceDate)
    );
    
    const weightedScore = sortedInvoices.reduce((acc, invoice, index) => {
      const delayDays = invoice.delayDays;
      const recency = Math.exp(-index * 0.1);
      
      const deduction = 
        delayDays <= 0 ? 0 :
        delayDays <= 7 ? 0 :
        delayDays <= 14 ? 5 :
        delayDays <= 30 ? 10 :
        delayDays <= 60 ? 30 : 50;
      
      return acc + (deduction * recency);
    }, 0);
    
    const averageWeightedDeduction = weightedScore / sortedInvoices.length;
    const finalPoints = Math.max(0, Math.min(100, 100 - averageWeightedDeduction));
    
    const normalizedScore = 1 / (1 + Math.exp(-0.1 * (finalPoints - 50)));
    return Math.round(100 + (normalizedScore * 900));
  };

  const fetchInvoiceData = async () => {
    try {
      const license = localStorage.getItem("dl_code");
      if (!license) {
        throw new Error("License code not found");
      }

      const response = await fetch(
        `${config.API_HOST}/api/user/getInvoiceRD?licenseNo=${encodeURIComponent(license)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 404) {
        setScore(1000);
        setInvoiceData([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (!result?.success) {
        throw new Error(result?.message || 'Failed to fetch invoice data');
      }

      setInvoiceData(result.data || []);
      setScore(calculateScore(result.data));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
      return {
        pieData: [{ name: 'On Time', value: 1 }],
        lineData: MONTHS.map(month => ({ month, score: 1000 }))
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

    // Process monthly scores with cumulative calculation
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
        : 1000; // Default score for months with no data

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


  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-3 py-3 flex justify-between items-center">
        <div className="relative group w-20 sm:w-30">
            <img 
              src="/medscorelogo.jpeg" 
              alt="Medscore Logo" 
              className="w-100 h-auto object-contain rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 w-full sm:max-w-xl sm:mx-8">
            <div className="relative">
              <input
                type="text"
                value={license}
                onChange={(e) => setLicenseNo(e.target.value)}
                placeholder="Enter dealer code..."
                className="w-full px-5 py-2 pr-15 ml-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
              />
              {license && (
                <button
                  onClick={handleClear}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <X size={18} />
                </button>
              )}
              <button
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 transition-colors duration-200"
              >
                <Search size={18} />
              </button>
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Logout Button - Smaller on mobile */}
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
              className={`bg-gradient-to-r ${btn.color} text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm md:text-base`}
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

        {/* Invoice Data Table */}
        {invoiceData.length > 0 && (
         <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
         <h1 className="text-2xl font-bold mb-6 text-gray-900">Invoice Analytics Dashboard</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Credit Score Gauge */}
           <div className="bg-white rounded-lg shadow-md p-6">
             <h2 className="text-lg font-semibold mb-4 text-gray-900">Credit Score</h2>
             <div className="relative">
               <svg viewBox="0 0 200 140" className="w-full">
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

        {/* No Results Message */}
       
      </div>
    </div>
  );
};

export default DistributorHomePage;