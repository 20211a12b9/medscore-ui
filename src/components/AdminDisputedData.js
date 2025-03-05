import React, { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle, User, X, Search, ChevronLeft, ChevronRight,Eye } from 'lucide-react';
import { config } from '../config';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export const AdminDisputedData = () => {
  const [disputeData, setDisputeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDistModal, setShowDistModal] = useState(false);
  const [distData, setDistData] = useState(null);
  const [distLoading, setDistLoading] = useState(false);
  const [distError, setDistError] = useState(null);
  const [pharmaData, setPharmaData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
   const [seenStatus, setSeenStatus] = useState({});
    const [unseenIds, setUnseenIds] = useState([]);
  const itemsPerPage = 12;
  const [pagination, setPagination] = useState({
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      perPage: 12
    });
  
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
const navigate=useNavigate();
const fetchDistributorData = async (customerId) => {
  try {
    setDistLoading(true);
    const token=localStorage.getItem('jwttoken');
    const response = await fetch(`${config.API_HOST}/api/user/getDistData/${customerId}`,
      {
        method: 'GET',
        // headers: {
        //   // 'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json'
        // }
      }
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result.success) {
      setDistData(result.data);
      setShowDistModal(true);
    } else throw new Error(result.message);
  } catch (err) {
    setDistError(err.message);
  } finally {
    setDistLoading(false);
  }
};

const fetchPharmaData = async (license) => {
  try {
    const token=localStorage.getItem('token')
    const response = await fetch(`${config.API_HOST}/api/user/getPharmaData?licenseNo=${license}`,
      {
        method: 'GET',
        // headers: {
        //   // 'Authorization': `Bearer ${token}`,
        //   'Content-Type': 'application/json'
        // }
      }
    );
    const data = await response.json();
    if (data.success) {
      setPharmaData(prevState => ({
        ...prevState,
        [license]: data.data[0]
      }));
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const updateSeenStatus = async (invoiceIds) => {
  try {
    const token =localStorage.getItem('jwttoken')
    const response = await fetch(`${config.API_HOST}/api/user/updateDisputeAdminSeenStatus`, {
      method: 'PUT',
      headers: {
        // 'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ invoiceIds }),
    });
   
    if (response.ok) {
      const updatedSeenStatus = { ...seenStatus };
      invoiceIds.forEach(id => {
        updatedSeenStatus[id] = true;
      });
      setSeenStatus(updatedSeenStatus);
    }
  } catch (err) {
    console.error('Error updating seen status:', err);
  }
};



useEffect(() => {
  const fetchDisputeData = async () => {
    try {
      setLoading(true);
      const token= localStorage.getItem('jwttoken')
      const response = await fetch(`${config.API_HOST}/api/user/getDipsutedData?page=${pagination.currentPage}&limit=${pagination.perPage}&address=${debouncedSearchTerm}&licenseNo=${debouncedSearchTerm}`,
        {
          method: 'GET',
          // headers: {
          //   // 'Authorization': `Bearer ${token}`,
          //   'Content-Type': 'application/json'
          // }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        const sortedInvoices = result.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setDisputeData(sortedInvoices);
        setPagination(result.pagination || {});
        // Initialize seen status from fetched data
        const initialSeenStatus = {};
        const newUnseenIds = [];
        
        sortedInvoices.forEach(invoice => {
          initialSeenStatus[invoice._id] = invoice.seenbyAdmin;
          if (!invoice.seenbyAdmin) {
            newUnseenIds.push(invoice._id);
          }
        });
        
        setSeenStatus(initialSeenStatus);
        setUnseenIds(newUnseenIds); // Set the unseen IDs for delayed update
      } else {
        throw new Error(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchDisputeData();
}, [pagination.currentPage,pagination.perPage,debouncedSearchTerm]);

// Add timer for updating seen status
useEffect(() => {
  if (unseenIds.length > 0) {
    const timer = setTimeout(() => {
      updateSeenStatus(unseenIds);
      setUnseenIds([]); // Clear the unseen IDs after updating
    }, 30000); // 30 seconds delay

    return () => clearTimeout(timer);
  }
}, [unseenIds]);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId); // Cleanup the timeout on each change
  }, [searchTerm]);
useEffect(() => {
  disputeData.forEach(dispute => {
    if (!pharmaData[dispute.pharmadrugliseanceno]) {
      fetchPharmaData(dispute.pharmadrugliseanceno);
    }
  });
}, [disputeData]);

 




  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return (
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

  if (error) return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="border border-red-200 bg-red-50 rounded-lg">
        <div className="flex items-center space-x-2 p-6">
          <AlertCircle className="h-6 w-6 text-red-500" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    </div>
  );
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };
  return (
    <div className="py-full">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="border-b bg-gradient-to-r from-blue-600 to-blue-800 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
          <button 
                    onClick={() => navigate(-1)}
                    className=" flex items-center text-white hover:text-black transition-colors mb-2 space-x-2 "
                >
                    <ArrowLeft className="h-7 w-7 font-bold" />
                   
                </button>
            <h2 className="text-2xl font-bold text-white">Disputed Records</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                <input 
                  type="search"
                  placeholder="Search records..."
                  className="pl-10 bg-white/10 border border-white/20 text-white placeholder:text-white/60 w-64 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-white/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disputeData.map((dispute) => (
             <div 
             key={dispute._id} 
             className={`group bg-white rounded-xl shadow-md border ${
               !seenStatus[dispute._id] ? 'border-blue-300' : 'border-gray-100'
             } hover:shadow-xl transition-all duration-300 overflow-hidden relative`}
           >
             {/* Seen/Unseen Indicator */}
             <div className={`absolute top-4 right-4 flex items-center space-x-1 ${
               !seenStatus[dispute._id] ? 'text-blue-600' : 'text-gray-400'
             }`}>
               <Eye className="h-4 w-4" />
               <span className="text-xs font-medium">
                 {seenStatus[dispute._id] ? 'Seen' : 'New'}
               </span>
             </div>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b">
                  <h3 className="text-lg font-semibold text-blue-900">
                    {pharmaData[dispute.pharmadrugliseanceno]?.pharmacy_name || 'Loading...'}
                  </h3>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Invoice No</span>
                      <p className="font-semibold text-gray-900">{dispute.invoice}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">License No</span>
                      <p className="font-semibold text-gray-900">{dispute.pharmadrugliseanceno}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Invoice Date</span>
                      <p className="font-semibold text-gray-900">{formatDate(dispute.invoiceDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Due Date</span>
                      <p className="font-semibold text-gray-900">{formatDate(dispute.dueDate)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Amount</span>
                      <p className="font-semibold text-green-600">₹{dispute.invoiceAmount.toLocaleString()}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-gray-500">Delay</span>
                      <p className="font-semibold text-red-600">{dispute.delayDays} days</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <span className="text-sm text-gray-500">Dispute Reason</span>
                    <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded-lg text-sm">
                      {dispute.reasonforDispute || 'No reason provided'}
                    </p>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                  <button 
                    onClick={() => fetchDistributorData(dispute.customerId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    View Distributor Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
           <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  <span className="text-sm">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
          
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
        </div>
      </div>

      {/* Modal */}
      {showDistModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Distributor Details</h3>
              <button
                onClick={() => setShowDistModal(false)}
                className="text-gray-400 hover:text-gray-500 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {distLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              ) : distError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span className="text-red-700">{distError}</span>
                </div>
              ) : distData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900 font-medium">{distData.pharmacy_name}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900 font-medium">{distData.phone_number}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 font-medium">{distData.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500">License</label>
                      <p className="text-gray-900 font-medium">{distData.dl_code}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDisputedData;