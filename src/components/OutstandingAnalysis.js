import React, { useState, useEffect } from 'react';
import { config } from '../config';
import { useLocation } from 'react-router-dom';
import { 
  LineChart, Line, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { AlertCircle, TrendingUp, PieChartIcon, Activity, DollarSign, IndianRupee } from 'lucide-react';
import Navbar from './Navbar';

export const OutstandingAnalysis = () => {
  const [outstandingData, setOutstandingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const { license } = location.state || {};
  console.log(license)
  // Enhanced color palette with better contrast
  const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];
  
  const fetchOutstandingData = async () => {
    setIsLoading(true);
    try {
        if (!license) {
            throw new Error("License number is missing");
        }

        console.log("Fetching data for license:", license); // Debugging

        const response = await fetch(
            `${config.API_HOST}/api/user/outstandingReport?licenseNo=${encodeURIComponent(license)}`,
            {
                method: 'GET',
                // headers: { 'Content-Type': 'application/json' }
            }
        );

        if (!response.ok) {
            if (response.status === 400) {
                throw new Error("Bad request: Missing or invalid licenseNo");
            }
            if (response.status === 404) {
                console.error("No data found for license:", license);
                setOutstandingData([]);
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // console.log("Outstanding Data:", result.data);
        setOutstandingData(result.data || []);
    } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
};


  
  useEffect(() => {
    fetchOutstandingData();
  }, [license]);
  
  const getDelayCategory = (days) => {
    if (days > 0 && days <= 45) return '0-45 days';
    if (days > 45 && days <= 60) return '45-60 days';
    if (days > 60 && days <= 75) return '60-75 days';
    if (days > 75 && days <= 90) return '75-90 days';
    if (days > 90 && days <= 120) return '90-120 days';
    return '120+ days';
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const processDataForCharts = () => {
    if (!outstandingData?.length) {
      return {
        pieData: [{ name: 'No Data', value: 1, amount: 0 }]
      };
    }
    
    const totalOutstandingAmountByCategory = new Map();
    const totalOutstandingCountByCategory = new Map();
    
    outstandingData.forEach(inv => {
      const category = getDelayCategory(inv.DueDate);
      const amount = Number(inv.Total);
      
      totalOutstandingAmountByCategory.set(
        category,
        (totalOutstandingAmountByCategory.get(category) || 0) + amount
      );
      
      totalOutstandingCountByCategory.set(
        category,
        (totalOutstandingCountByCategory.get(category) || 0) + 1
      );
    });
    
    const pieData = Array.from(totalOutstandingCountByCategory.entries())
      .map(([name, value]) => ({
        name,
        value,
        amount: totalOutstandingAmountByCategory.get(name) || 0
      }))
      .sort((a, b) => {
        // Sort by days (extract the first number from the category name)
        const daysA = parseInt(a.name.match(/\d+/)[0]);
        const daysB = parseInt(b.name.match(/\d+/)[0]);
        return daysA - daysB;
      });
    
    return { pieData };
  };
  
  const { pieData } = processDataForCharts();
  
  // Calculate totals for summary
  const totalInvoices = pieData.reduce((sum, item) => sum + item.value, 0);
  const totalAmount = pieData.reduce((sum, item) => sum + item.amount, 0);
  
  // Custom label renderer for the pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill={COLORS[index % COLORS.length]}
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };
  

  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 flex items-center justify-center h-96">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-indigo-100 mb-4"></div>
          <div className="h-4 w-48 bg-indigo-100 rounded mb-3"></div>
          <div className="h-3 w-32 bg-indigo-50 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 rounded-xl shadow-md p-8 flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-700">Error Loading Data</h3>
          <p className="text-red-600 mt-2">{error}</p>
          <button 
            onClick={fetchOutstandingData}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white min-h-screen rounded-xl shadow-lg p-28 border border-gray-100">
        <div className='fixed z-50 left-0 right-0 top-0'>
            <Navbar/>
        </div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div className="flex items-center gap-2 mb-2 md:mb-0">
          <PieChartIcon className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-800">Outstanding Payment Analysis</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-indigo-50 rounded-lg p-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-500">Total Invoices</p>
              <p className="font-semibold text-gray-800">{totalInvoices}</p>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">Total Outstanding</p>
              <p className="font-semibold text-gray-800">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {outstandingData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">No outstanding payments found</p>
          <p className="text-gray-400 text-sm mt-1">All invoices are up to date</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 h-80">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name}  (${(percent * 100).toFixed(0)}%)`}
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
          
          <div className="md:col-span-5">
            <div className="bg-gray-50 p-4 rounded-lg h-full">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Delay Categories</h3>
              <div className="space-y-3">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">{item.value} invoices</span>
                      <span className="text-sm font-medium text-gray-700">{formatCurrency(item.amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-800">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};