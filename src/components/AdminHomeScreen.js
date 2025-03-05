import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Search, User, X, LogOut } from 'lucide-react';
import { config } from '../config';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

export const AdminHomeScreen = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [AdminDashbordDeatisl, setAdminDashbordDetails] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('jwttoken');
      localStorage.removeItem('userId');
      window.location.href = '/';
    }
  };

  useEffect(() => {
    const fetchAdminDashBordDeatils = async () => {
      try {
        const response = await fetch(`${config.API_HOST}/api/user/getcountofAdminneedDetails`,{
          method:'GET',
          // headers:{
          //   // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          //   'content-type':'application/json'
          // }
        });
        const data = await response.json();
        setAdminDashbordDetails(data);
        
        // Show notification if there are unseen disputes
        if (data.disputescountbyAdminUnseen > 0) {
          setShowNotification(true);
          // Auto-hide notification after 5 seconds
          // setTimeout(() => {
          //   setShowNotification(false);
          // }, 5000);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAdminDashBordDeatils();
  }, []);

  return (
    <div className="py-full relative bg-black">
      {/* Custom YouTube-style Notification */}
      {showNotification && AdminDashbordDeatisl.disputescountbyAdminUnseen > 0 && (
        <div className="fixed bottom-4 right-20 z-50 animate-slide-up top-5">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-400" />
              {/* <span>
                {AdminDashbordDeatisl.disputescountbyAdminUnseen} new dispute record{AdminDashbordDeatisl.disputescountbyAdminUnseen > 1 ? 's' : ''} added in disputed data
              </span> */}
              <button onClick={()=>navigate('/AdminDisputedData')}>{AdminDashbordDeatisl.disputescountbyAdminUnseen} new dispute record{AdminDashbordDeatisl.disputescountbyAdminUnseen > 1 ? 's' : ''} added in disputed data</button>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="w-1/5 h-screen bg-slate-900 fixed top-0 right-0 z-50">
          <p className="text-white p-4 font-bold bg-slate-500 flex flex-row gap-10"><User />Hello Admin</p>
          <div className="flex justify-end p-4">
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-gray-300 border-4 bg-black"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col">
            <button
              onClick={() => navigate('/CreateBlog')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Create Blog
            </button>
            <button
              onClick={() => navigate('/JobPostingForm')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Post JOb Openings
            </button>
            <button
              onClick={() => navigate('/AdminJobManagement')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Job Openings Management
            </button>
            <button
              onClick={() => navigate('/UploadDistCentalData')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Upload DistCental Data
            </button>
            
            <button
              onClick={() => navigate('/AdminDisputedData')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disputed Data
            </button>
            <button
              onClick={() => navigate('/AdminpharmacyData')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Pharmacies Data
            </button>
            <button
              onClick={() => navigate('/AdminDistData')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Distribuors Data
            </button>
            <button
              onClick={() => navigate('/AdminCentralData')}
              className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
               Central Data 
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-white font-serif rounded-lg hover:bg-green-600 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex justify-between items-center">
        <div className="flex items-center  h-20  ">
          <img src="/medscore_newlogo.png" alt="Company Logo" className="h-32 w-32 mr-2 " />
        </div>
        <div className="flex-grow text-center">
          <h1 className="text-2xl font-bold text-blue-900 color-blue">Admin Dashboard</h1>
        </div>
        <button 
          className="h-10 w-10 text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="black"
            strokeWidth="2"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 12h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Dashboard */}
      <div className="bg-white rounded-lg shadow">
        <AdminDashboard data={AdminDashbordDeatisl} />
      </div>
     
    </div>
  );
};

export default AdminHomeScreen;