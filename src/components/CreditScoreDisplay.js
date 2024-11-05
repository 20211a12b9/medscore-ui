import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { config } from '../config';

const CreditScoreDisplay = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);

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

  const { pieData, lineData } = processDataForCharts();

  return (
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
        <div className="bg-white mr-5 rounded-lg shadow-md p-6 md:col-span-2">
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
  );
};

export default CreditScoreDisplay;