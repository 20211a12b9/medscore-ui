import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { AlertCircle, TrendingUp, PieChart as PieChartIcon, Activity, Phone, Calendar, Building2, ArrowRight, Hash } from 'lucide-react';
import { config } from '../config';
import { PharmaNavbar } from './PharmaNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';

const DistributorSerchedCreditscore = () => {
  const location = useLocation();
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [pharmacyData, setPharmacyData] = useState([]);
  const [oustandingTotal, setOutStandingTotal] = useState(0);
  // Store license in state and initialize from location OR session storage for persistence
  const [license, setLicense] = useState(() => {
    const locationLicense = location.state?.license;
    const savedLicense = sessionStorage.getItem('currentPharmacyLicense');
    return locationLicense || savedLicense || '';
  });
  const navigate = useNavigate();
  const COLORS = ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#ef4444'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Save license to session storage whenever it changes
  useEffect(() => {
    if (license) {
      sessionStorage.setItem('currentPharmacyLicense', license);
    }
  }, [license]);

  // Update license from location if it changes
  useEffect(() => {
    if (location.state?.license) {
      setLicense(location.state.license);
    }
  }, [location.state]);

  const fetchOutstandingData = async () => {
    try {
      if (!license) {
        throw new Error("License code not found");
      }

      const response = await fetch(
        `${config.API_HOST}/api/user/outstandingReport?licenseNo=${encodeURIComponent(license)}`,
        {
          method: 'GET',
          headers: {
            'content-type': 'application/json'
          }
        }
      );
      
      if (response.status === 404) {
        console.log("Failed to fetch outstanding data");
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Outstanding data:", result.data);
    } catch (err) {
      console.error("Error fetching outstanding data:", err);
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

  const fetchInvoiceData = async () => {
    if (!license) {
      setError("No license code provided. Please select a pharmacy.");
      setLoading(false);
      return;
    }

    try {
      // Show user what's loading
      setLoading(true);
      setError(null);
      
      // Fetch invoice data
      const distId = localStorage.getItem('userId');
      console.log("Distributor ID:", distId, "License:", license);
      
      const invoiceResponse = await fetch(
        `${config.API_HOST}/api/user/getInvoiceRDforDist/${distId}?licenseNo=${license}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
  
      // Check if response is JSON
      const contentType = invoiceResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error. Please try again later.');
      }
      
      const invoiceResult = await invoiceResponse.json();
      console.log("Invoice data:", invoiceResult);
      
      // Fetch pharmacy data - this should happen in all cases
      const response = await fetch(
        `${config.API_HOST}/api/user/getPharmaData?licenseNo=${license}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      const pharmaResult = await response.json();
      
      if (!response.ok) {
        throw new Error(pharmaResult.message || 'Failed to fetch pharmacy data');
      }
      
      console.log("Pharmacy data:", pharmaResult.data);
      setPharmacyData(pharmaResult.data);
      
      // Fetch outstanding data
      const dresponse = await fetch(
        `${config.API_HOST}/api/user/getUploadedData?licenseNo=${license}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      const dresult = await dresponse.json();
      console.log("Outstanding total:", dresult[0]?.Total);
      
      if (dresult && dresult[0] && dresult[0].Total) {
        setOutStandingTotal(Number(dresult[0].Total).toLocaleString('en-IN', { 
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'INR'
        }));
      } else {
        setOutStandingTotal("₹0.00");
      }
      
      // Handle invoice data
      if (!invoiceResponse.ok || !invoiceResult.data || invoiceResult.data.length === 0) {
        console.log("No invoice data found, setting default score");
        setScore(1000);
        setInvoiceData([]);
      } else {
        setInvoiceData(invoiceResult.data);
        const calculatedScore = calculateScore(invoiceResult.data);
        setScore(calculatedScore);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (license) {
      fetchInvoiceData();
      fetchOutstandingData();
    }
  }, [license]);

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

  const getStatusConfig = (value) => {
    if (value >= 900) {
      return {
        status: 'Very Low Risk',
        textColor: '#22c55e',    // Green text
        bgColor: '#dcfce7'       // Light green background
      };
    } else if (value >= 800) {
      return {
        status: 'Low Risk',
        textColor: '#eab308',    // Yellow text
        bgColor: '#fef9c3'       // Light yellow background
      };
    } else if (value >= 700) {
      return {
        status: 'Moderate Risk',
        textColor: '#f97316',    // Orange text
        bgColor: '#ffedd5'       // Light orange background
      };
    } else if (value >= 600) {
      return {
        status: 'High Risk',
        textColor: '#ea580c',    // Dark orange text
        bgColor: '#fee2e2'       // Light red background
      };
    } else {
      return {
        status: 'Very High Risk',
        textColor: '#ef4444',    // Red text
        bgColor: '#fecdd3'       // Light red background
      };
    }
  };

  const { status, textColor, bgColor } = getStatusConfig(score);
  const { pieData, lineData } = processDataForCharts();

  // Handle navigation with license preservation
  const handleNavigate = (path) => {
    // console.log("handleNavigate",path,license)
    navigate(path, { state: { license } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div className="pt-36 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          <p className="mt-4 text-slate-700">Loading pharmacy data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div className="pt-36 px-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4 text-red-500 p-8 bg-red-50 rounded-lg shadow-sm">
            <AlertCircle className="h-12 w-12" />
            <h2 className="text-xl font-bold">Error Loading Data</h2>
            <p className="text-center">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      
      <div className="pt-36 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-8">
          {/* Header Section with Breadcrumb */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center text-sm mb-2">
              <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/')}>Dashboard</span>
              <span className="mx-2 text-slate-400">/</span>
              <span className="text-slate-600">MedScore Analytics</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
              <Activity className="w-8 h-8 text-blue-600" />
              MedScore Analytics
            </h1>
            <p className="text-slate-600">Comprehensive analysis of pharmacy performance and credit metrics</p>
          </div>

          {/* Pharmacy Info Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Pharmacy Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Pharmacy Name</p>
                  <p className="font-semibold text-slate-900">{pharmacyData[0]?.pharmacy_name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <Hash className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">License No</p>
                  <p className="font-semibold text-slate-900">{pharmacyData[0]?.dl_code || license || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                  <Phone className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Contact</p>
                  
                 
                 <p className="font-semibold text-slate-900">
  {pharmacyData[0]?.phone_number 
    ? String(pharmacyData[0].phone_number).substring(0, 4) + "XXXXXX" 
    : "N/A"}
</p>

                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="p-3 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
                  <Calendar className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Expires On</p>
                  <p className="font-semibold text-slate-900">{pharmacyData[0]?.expiry_date || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Outstanding Amount & Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center justify-between bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div>
              <p className="text-sm text-slate-500">Total Market Outstanding</p>
              <p className="text-3xl font-bold text-slate-900">{oustandingTotal}</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleNavigate('/OutstandingAnalysis')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                View Detailed Report
                <ArrowRight className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleNavigate('/ReportOfPharama')}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                View Defaulted Report
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* MedScore Card */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">MedScore</h2>
                </div>
                
                <div 
                  className="px-3 py-1 rounded-full font-medium text-sm"
                  style={{ backgroundColor: bgColor }}
                >
                  <span style={{ color: textColor }}>{status}</span>
                </div>
              </div>

              <div className="relative p-4">
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
                    className="transition-all duration-1000 ease-out"
                  />

                  <path
                    d="M 30 100 A 70 70 0 0 1 170 100"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="220"
                    strokeDashoffset={(1 - (score - 100) / 900) * 220}
                    className="transition-all duration-1000 ease-out"
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
                    className="transition-all duration-1000 ease-out"
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
              
              <div className="mt-2 p-4 bg-white bg-opacity-70 rounded-lg">
                <h3 className="font-medium text-slate-900 mb-1">Score Interpretation</h3>
                <p className="text-sm text-slate-600">
                  {score >= 900 ? 
                    "Excellent payment history. Very low risk for creditors." : 
                    score >= 800 ? 
                    "Good payment history with minimal delays." :
                    score >= 700 ?
                    "Moderate risk with occasional payment delays." :
                    score >= 600 ?
                    "Higher risk with frequent payment delays." :
                    "Very high risk with significant payment defaults."
                  }
                </p>
              </div>
            </div>

            {/* Payment Distribution Card */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-slate-900">Payment Delay Distribution</h2>
              </div>
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
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          className="transition-all duration-300 ease-in-out"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        padding: '12px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trend Chart Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-xl shadow-sm p-6 border border-blue-100">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-900">Score Trend Analysis</h2>
              </div>
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
                        borderRadius: '8px',
                        padding: '12px',
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
                      className="transition-all duration-300 ease-in-out"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 p-4 bg-white bg-opacity-70 rounded-lg">
                <h3 className="font-medium text-slate-900 mb-1">Monthly Trend Insights</h3>
                <p className="text-sm text-slate-600">
                  This chart shows how the MedScore has evolved over time, factoring in payment behavior 
                  for each month. Higher scores indicate better payment performance.
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer Section */}
          <div className="mt-6 mb-10 flex justify-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" />
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorSerchedCreditscore;