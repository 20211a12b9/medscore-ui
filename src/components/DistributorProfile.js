import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { Building2, Phone, Mail, FileText, MapPin, Calendar, Clock, ChevronRight } from 'lucide-react';
import { Navbar } from './Navbar';

const DistributorProfile = () => {
  const [distributorData, setDistributorData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDistributorData = async () => {
      try {
        const distId = localStorage.getItem('userId');
        if (!distId) {
          console.error('Distributor ID not found in local storage');
          return;
        }
        const response = await fetch(`${config.API_HOST}/api/user/getDistData/${distId}`,
          {
            method: 'GET',
            // headers: {
            //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            //     'Content-Type': 'application/json',
            // },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch distributor data');
        }
        const data = await response.json();
        setDistributorData(data.data);
      } catch (error) {
        console.error('Error fetching distributor data:', error);
      }
    };

    fetchDistributorData();
  }, []);

  if (!distributorData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 animate-pulse">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="max-w-6xl mx-auto pt-20 px-4">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-lg mb-8">
        <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-lg">
          <div className="absolute -bottom-16 left-8">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <Building2 className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start">
            <div>
              <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
            <div className="h-8 w-32 bg-gray-200 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Overview Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 col-span-2">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={`left-${i}`} className="flex items-start gap-4">
                  <div className="bg-gray-200 p-3 rounded-lg w-12 h-12 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={`right-${i}`} className="flex items-start gap-4">
                  <div className="bg-gray-200 p-3 rounded-lg w-12 h-12 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* License Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
            </div>
            
            <div className="h-12 bg-gray-200 rounded-lg w-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
    </div>
    );
  }

  const {
    pharmacy_name,
    phone_number,
    email,
    dl_code,
    address,
    createdAt,
    expiry_date,
  } = distributorData;

  const getExpiryStatus = () => {
    const today = new Date();
    const expiryDate = new Date(expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { text: 'Expired', color: 'bg-red-500' };
    } else if (daysUntilExpiry <= 30) {
      return { text: 'Expiring Soon', color: 'bg-amber-500' };
    }
    return { text: 'Active', color: 'bg-emerald-500' };
  };

  const status = getExpiryStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="max-w-6xl mx-auto pt-20 px-4">
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="relative h-32 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-t-lg">
            <div className="absolute -bottom-16 left-8">
              <div className="bg-white p-4 rounded-xl shadow-lg">
                <Building2 className="h-16 w-16 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{pharmacy_name}</h1>
                <p className="text-gray-500 mt-1">Pharmaceutical Distributor</p>
              </div>
              <div className={`${status.color} px-4 py-2 rounded-full text-white font-medium flex items-center gap-2`}>
                <Clock className="h-4 w-4" />
                {status.text}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 col-span-2">
            <h2 className="text-xl font-semibold mb-6">Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{phone_number}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-900">{email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">License Number</p>
                    <p className="text-gray-900">{dl_code}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">{address}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Registration Date</p>
                    <p className="text-gray-900">{new Date(createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">License Details</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                <p className="text-gray-900 mt-1">
                  {new Date(expiry_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              
              <button
                onClick={() => navigate('/ForgotPassword')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Reset Password
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorProfile;