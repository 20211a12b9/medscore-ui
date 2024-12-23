import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';
import { Building2, Phone, Mail, FileText, MapPin, Calendar, Clock } from 'lucide-react';
import { Navbar } from './Navbar';

const DistributorProfile = () => {
  const [distributorData, setDistributorData] = useState(null);
  const navigate = useNavigate();

  // Fetch distributor data on component mount
  useEffect(() => {
    const fetchDistributorData = async () => {
      try {
        const distId = localStorage.getItem('userId');
        if (!distId) {
          console.error('Distributor ID not found in local storage');
          return;
        }
        const response = await fetch(`${config.API_HOST}/api/user/getDistData/${distId}`);
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

  // Loading state
  if (!distributorData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  // Destructure distributor data
  const {
    pharmacy_name,
    phone_number,
    email,
    dl_code,
    address,
    createdAt,
    expiry_date,
  } = distributorData;

  // Calculate license expiry status
  const getExpiryStatus = () => {
    const today = new Date();
    const expiryDate = new Date(expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) {
      return { text: 'Expired', color: 'text-red-600 bg-red-50' };
    } else if (daysUntilExpiry <= 30) {
      return { text: 'Expiring Soon', color: 'text-amber-600 bg-amber-50' };
    }
    return { text: 'Active', color: 'text-green-600 bg-green-50' };
  };

  const status = getExpiryStatus();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Content Container */}
      <div className="bg-white max-w-4xl mx-auto p-6 mt-16 space-y-6">
        {/* Header Section */}
        <div className="rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-8 w-8" />
              <h1 className="text-3xl font-bold">{pharmacy_name}</h1>
            </div>
            <p className="text-blue-100 ml-11">Pharmaceutical Distributor</p>
          </div>
        </div>

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
              day: 'numeric',
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
                    day: 'numeric',
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
            onClick={() => navigate('/ForgotPassword')}
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default DistributorProfile;
