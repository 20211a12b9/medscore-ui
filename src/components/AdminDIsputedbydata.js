import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RefreshCcw, Building2, Store, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { config } from '../config';

const AdminDIsputedbydata = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedPharmacies, setExpandedPharmacies] = useState({});

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const token= localStorage.getItem('jwttoken')
            const response = await fetch(`${config.API_HOST}/api/user/getDispytedBydistforAdmin`,
                {
                    method: 'GET',
                    // headers: {
                    // //   'Authorization': `Bearer ${token}`,
                    //   'Content-Type': 'application/json'
                    // }
                  }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const jsonData = await response.json();
            setData(jsonData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(Number(amount) || 0);
    };

    const togglePharmacy = (pharmacyName) => {
        setExpandedPharmacies(prev => ({
            ...prev,
            [pharmacyName]: !prev[pharmacyName]
        }));
    };

    // Group data by pharmacy
    const groupedData = React.useMemo(() => {
        if (!data?.Defaults) return {};
        
        return data.Defaults.reduce((acc, invoice) => {
            if (!acc[invoice.pharmacy_name]) {
                acc[invoice.pharmacy_name] = {
                    distributors: {},
                    totalAmount: 0,
                    latestUpdate: new Date(invoice.updatedAt)
                };
            }
            
            if (!acc[invoice.pharmacy_name].distributors[invoice.distributor_name]) {
                acc[invoice.pharmacy_name].distributors[invoice.distributor_name] = {
                    invoices: [],
                    total: 0
                };
            }
            
            const distributorData = acc[invoice.pharmacy_name].distributors[invoice.distributor_name];
            distributorData.invoices.push({
                amount: Number(invoice.invoiceAmount),
                date: invoice.updatedAt,
                id: invoice.id
            });
            distributorData.total += Number(invoice.invoiceAmount);
            
            acc[invoice.pharmacy_name].totalAmount += Number(invoice.invoiceAmount);
            
            const updateDate = new Date(invoice.updatedAt);
            if (updateDate > acc[invoice.pharmacy_name].latestUpdate) {
                acc[invoice.pharmacy_name].latestUpdate = updateDate;
            }
            
            return acc;
        }, {});
    }, [data]);

    const filteredData = React.useMemo(() => {
        return Object.entries(groupedData).filter(([pharmacyName, data]) => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesPharmacy = pharmacyName.toLowerCase().includes(searchTermLower);
            const matchesDistributor = Object.keys(data.distributors).some(dist => 
                dist.toLowerCase().includes(searchTermLower)
            );
            return matchesPharmacy || matchesDistributor;
        });
    }, [groupedData, searchTerm]);

    const activeCases = React.useMemo(() => {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return Object.values(groupedData).filter(pharmacy => 
            pharmacy.latestUpdate > oneWeekAgo
        ).length;
    }, [groupedData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="absolute">
              {/* Spinning border */}
              
              {/* Logo in center - not spinning */}
              <div className=" animate-circle top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <img 
                  src="medscore_newlogo.png"
                  alt="Company Logo" 
                  className="h-24 w-24 object-contain"
                />
                
              </div>
              <h1 className='text-wrap font-serif'>Loading</h1>
            </div>
          </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <div className="text-red-500 text-xl">Error: {error}</div>
                <button 
                    onClick={fetchData}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    const renderDistributorInvoices = (invoices) => (
        <div className="ml-9 space-y-2">
            {invoices.map((invoice, idx) => (
                <div key={`${invoice.id}-${idx}`} className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{formatDate(invoice.date)}</span>
                    <span className="font-medium text-gray-900 ml-4">
                        {formatCurrency(invoice.amount)}
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-orange-100 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="flex items-center text-black hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        
                        <h1 className="text-2xl font-bold text-gray-900">Disputes Updated by Distribuors</h1>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-grow sm:flex-grow-0">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search defaulters..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={fetchData}
                                className="p-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Refresh data"
                            >
                                <RefreshCcw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold mt-1">{formatCurrency(data?.invoiceAmountSum)}</p>
                    </div>
                   
                </div>

                {/* Defaulters List */}
                <div className="space-y-4">
                    {filteredData.map(([pharmacyName, pharmacyData]) => (
                        <div key={pharmacyName} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div 
                                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => togglePharmacy(pharmacyName)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Store className="h-6 w-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">{pharmacyName}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm text-gray-500">
                                                    Total: {formatCurrency(pharmacyData.totalAmount)}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="text-sm text-gray-500">
                                                    Last Updated: {formatDate(pharmacyData.latestUpdate)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {expandedPharmacies[pharmacyName] ? (
                                        <ChevronUp className="h-6 w-6 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-6 w-6 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {expandedPharmacies[pharmacyName] && (
                                <div className="border-t border-gray-100">
                                    {Object.entries(pharmacyData.distributors).map(([distributorName, distData]) => (
                                        <div 
                                            key={distributorName}
                                            className="flex flex-col p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="p-1.5 bg-green-50 rounded-lg">
                                                    <Building2 className="h-4 w-4 text-green-500" />
                                                </div>
                                                <div>
                                                    <span className="text-gray-900 font-medium">{distributorName}</span>
                                                    <div className="text-sm text-gray-500">
                                                        {distData.invoices.length} invoices • Total: {formatCurrency(distData.total)}
                                                    </div>
                                                </div>
                                            </div>
                                            {renderDistributorInvoices(distData.invoices)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="bg-white rounded-xl p-12 text-center">
                            <p className="text-gray-500">
                                {searchTerm ? 'No defaulters found matching your search.' : 'No defaulters available.'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDIsputedbydata;