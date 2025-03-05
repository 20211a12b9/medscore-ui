import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { config } from '../config';
import { Building2, Phone, Mail, FileText, MapPin, Calendar, Clock,AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search,X ,Menu, User} from 'lucide-react';
import { PharmaNavbar } from './PharmaNavbar';
const PharmaProfile = () => {
  const [distributorData, setDistributorData] = useState(null);
  
const navigate=useNavigate();
  useEffect(() => {
    const fetchDistributorData = async () => {
      try {
        const license = await localStorage.getItem("dl_code");
        const response = await fetch(`${config.API_HOST}/api/user/getPharmaData?licenseNo=${license}`,
          {
            method: 'GET',
            // headers: {
            //     'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
            //     'Content-Type': 'application/json',
            // },
          }
        );
        const data = await response.json();
        console.log(data.data[0],"data")
        setDistributorData(data.data[0]);
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
             <PharmaNavbar />
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
    expiry_date
  } = distributorData;

  const isExpiringSoon = () => {
    const today = new Date();
    const expiryDate = new Date(expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30;
  };

  const getExpiryStatus = () => {
    const today = new Date();
    const expiryDate = new Date(expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { 
        text: 'Expired', 
        color: 'bg-red-100 border-red-300', 
        textColor: 'text-red-600', 
        hint: 'Your license has expired. Please renew immediately to continue operations.',
        icon: AlertTriangle
      };
    } else if (daysUntilExpiry <= 30) {
      return { 
        text: 'Expiring Soon', 
        color: 'bg-amber-100 border-amber-300', 
        textColor: 'text-amber-600', 
        hint: `Your license will expire in ${daysUntilExpiry} days. Please renew to avoid service interruption.`,
        icon: AlertTriangle
      };
    }
    return { 
      text: 'Active', 
      color: 'bg-green-100 border-green-300', 
      textColor: 'text-green-600', 
      hint: null,
      icon: null 
    };
  };

  const status = getExpiryStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="fixed top-0 left-0 w-full z-50">
        <PharmaNavbar/>
      </div>
      <div className="bg-white max-w-4xl mx-auto p-6 mt-16 space-y-6">
      <div className="rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 mt-10 ">
        <div className="text-white ">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8" />
            <h1 className="text-3xl font-bold">{pharmacy_name}</h1>
          </div>
          {/* <p className="text-blue-100 ml-11">Pharmaceutical Distributor</p> */}
        </div>
      </div>
      {status.hint && (
          <div className={`rounded-lg p-4 ${status.color} ${status.textColor} border flex items-center space-x-4`}>
            {status.icon && <status.icon className="h-6 w-6" />}
            <div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">License Status: {status.text}</span>
              </div>
              <p className="text-sm mt-1">{status.hint}</p>
            </div>
            <span className="ml-auto text-sm">
              Expires on: {new Date(expiry_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        )}

      {/* License Status Banner */}
      <div className={`rounded-lg p-4 ${status.color} flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">License Status: {status.text}</span>
        </div>
        <span className="text-sm">
          Expires on: {new Date(expiry_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </span>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="border-b p-4">
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{phone_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium">{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">License Number</p>
                <p className="font-medium">{dl_code}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="border-b p-4">
            <h2 className="text-xl font-semibold text-gray-800">Additional Details</h2>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{address}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="font-medium">{new Date(createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      
      <div className="flex justify-end gap-4">
      
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg" onClick={() => navigate('/ForgotPassword')}>
          Reset Password
        </button>
      </div>
      </div>
    </div>
  );
};

export default PharmaProfile;