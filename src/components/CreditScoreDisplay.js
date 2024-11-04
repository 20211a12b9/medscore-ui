import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { AlertCircle } from 'lucide-react';
import { config } from '../config';

const CreditScoreDisplay = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);

  const calculateScore = (invoices) => {
    if (!invoices.length) return 750; // Default score for no payment history
    
    let totalPoints = 100; // Start with maximum points
    let weightedDeduction = 0;
    
    // Sort invoices by date to give more weight to recent delays
    const sortedInvoices = [...invoices].sort((a, b) => 
      new Date(b.invoiceDate) - new Date(a.invoiceDate)
    );
    
    sortedInvoices.forEach((invoice, index) => {
      const delayDays = invoice.delayDays;
      const recency = Math.exp(-index * 0.1); // Exponential decay for older invoices
      
      // Progressive deduction based on delay severity
      let deduction = 0;
      if (delayDays <= 0) {
        deduction = 0; // On time payment
      } else if (delayDays <= 7) {
        deduction = 0; // Minor delay
      } else if (delayDays <= 14) {
        deduction = 5; // Moderate delay
      } else if (delayDays <= 30) {
        deduction = 10; // Significant delay
      } else if (delayDays <= 60) {
        deduction = 30; // Severe delay
      } else {
        deduction = 50; // Critical delay
      }
      
      // Apply recency weight to deduction
      weightedDeduction += deduction * recency;
    });
    
    // Calculate average weighted deduction
    const averageWeightedDeduction = weightedDeduction / sortedInvoices.length;
    
    // Calculate final points (100 - weighted deduction)
    const finalPoints = Math.max(0, Math.min(100, totalPoints - averageWeightedDeduction));
    
    // Convert percentage to 300-900 range with non-linear scaling
    const minScore = 100;
    const maxScore = 1000;
    const scoreRange = maxScore - minScore;
    
    // Apply sigmoid-like transformation for more nuanced scoring
    const normalizedScore = 1 / (1 + Math.exp(-0.1 * (finalPoints - 50)));
    const finalScore = Math.round(minScore + (normalizedScore * scoreRange));
    
    return finalScore;
  };

  const fetchInvoiceData = async () => {
    try {
      const license = localStorage.getItem("dl_code");
      const response = await fetch(`${config.API_HOST}/api/user/getInvoiceRD?licenseNo=${license}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 404) {
        // Set score to 1000 for 404 status
        setScore(1000);
        setInvoiceData([]); // Set empty invoice data
        setLoading(false);
        return; // Exit early
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setInvoiceData(result.data);
        const calculatedScore = calculateScore(result.data);
        setScore(calculatedScore);
      } else {
        throw new Error(result.message || 'Failed to fetch invoice data');
      }
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
    const minScore = 100;
    const maxScore = 1000;
    const degrees = ((score - minScore) / (maxScore - minScore)) * 90;
    return degrees;
  };

  const processDataForCharts = () => {
    if (!invoiceData.length) return { 
      pieData: [{ name: 'On Time', value: 1 }], // Default data for empty state
      barData: [] 
    };

    // Delay distribution data
    const delayDistribution = invoiceData.reduce((acc, inv) => {
      const category = getDelayCategory(inv.delayDays);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const pieData = Object.entries(delayDistribution).map(([name, value]) => ({
      name,
      value
    }));

    // Monthly invoice amounts
    const monthlyData = invoiceData.reduce((acc, inv) => {
      const month = new Date(inv.invoiceDate).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + inv.invoiceAmount;
      return acc;
    }, {});

    const barData = Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    }));

    return { pieData, barData };
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-2 text-red-500 p-6">
      <AlertCircle className="h-5 w-5" />
      <span>{error}</span>
    </div>
  );

  const { pieData, barData } = processDataForCharts();
  const COLORS = ['#22c55e', '#f97316', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Invoice Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credit Score Gauge */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Credit Score</h2>
          <div className="relative">
            <svg viewBox="0 0 200 140" className="w-full">
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="33%" stopColor="#f97316" />
                  <stop offset="66%" stopColor="#eab308" />
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
              />

              <circle cx="100" cy="100" r="15" fill="#e5e7eb" />
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="40"
                stroke="#1f2937"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${calculateRotation(score)}, 100, 100)`}
              />

              <text x="25" y="130" className="text-sm" fill="#6b7280">100</text>
              <text x="165" y="130" className="text-sm" fill="#6b7280">1000</text>
              
              <text 
                x="100" 
                y="120" 
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
          <h2 className="text-lg font-semibold mb-4">Payment Delay Distribution</h2>
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
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Invoice Amounts */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Monthly Invoice Amounts</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => {
                    const cleanValue = parseInt(value, 10).toLocaleString('en-IN');
                    return `₹${cleanValue}`;
                  }}
                />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreDisplay;