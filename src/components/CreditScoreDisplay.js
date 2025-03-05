import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  Sector, RadialBarChart, RadialBar, Legend 
} from 'recharts';

import { config } from '../config';
import { PharmaNavbar } from './PharmaNavbar';
import { AlertCircle, TrendingUp, PieChart as PieChartIcon, Activity } from 'lucide-react';

const CreditScoreDisplay = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [chartType, setChartType] = useState('donut');
  const COLORS = ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#ef4444'];
  const [activeIndex, setActiveIndex] = useState(0);
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 
 



 
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
    try {
      const license = localStorage.getItem("dl_code");
      if (!license) {
        throw new Error("License code not found");
      }

      const response = await fetch(
        `${config.API_HOST}/api/user/getInvoiceRDforIndividual?licenseNo=${encodeURIComponent(license)}`,
        {
          method:'GET',
          headers:{
            // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            'content-type':'application/json'
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
      console.log(result.data,"--")
      setScore(calculateScore(result.data));
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

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
  
  return (
    <div className="min-h-screen bg-gray-300" >
      <div className="fixed top-0 left-0 w-full z-50">
        <PharmaNavbar />
      </div>
   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">MedScore Analytics</h1>
          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            Last Updated: {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MedScore Card */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm p-6">
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
          </div>

          {/* Payment Distribution Card */}
         <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-sm p-6">
                       <div className="flex items-center gap-2 mb-4">
                         <PieChartIcon className="w-5 h-5 text-purple-600" />
                         <h2 className="text-lg font-semibold text-slate-900">Delay Payment Days & Default Trend</h2>
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

          {/* Trend Analysis Card */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 rounded-lg shadow-sm p-6 lg:col-span-2">
            <div className="flex items-center justify-between pb-2 mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Score Trend Analysis
              </h2>
            </div>
            <div className="h-[400px]">
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
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value, name, props) => [
                      [`Score: ${value}`, `Invoices: ${props.payload.invoiceCount}`]
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6, fill: '#2563eb' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreDisplay;