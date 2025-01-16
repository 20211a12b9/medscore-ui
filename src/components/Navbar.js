import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, LogOut, ChevronLeft, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('jwttoken');
      localStorage.removeItem('userId');
      localStorage.removeItem('pharmacy_name');
      localStorage.removeItem('dl_code');
      localStorage.removeItem('userType');
      window.location.href = '/';
    }
  };

  return (
    <nav className="relative  bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src="img/logo/white-logo.png"
              alt="MedScore Logo"
              className="h-20 w-20 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => navigate('/DistributorHomePage')}
              className="flex items-center space-x-2 text-gray-100 hover:bg-white rounded-md p-2 hover:text-blue-600 transition-colors duration-200 group"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => navigate('/DistributorProfile')}
              className="flex items-center space-x-2 text-gray-100  hover:bg-white rounded-md p-2 hover:text-blue-600 transition-colors duration-200 group"
            >
              <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-100  hover:bg-white rounded-md p-2 hover:text-blue-600 transition-colors duration-200 group"
            >
              <ChevronLeft className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-100  hover:bg-white rounded-md p-2 hover:text-blue-600 transition-colors duration-200 group"
            >
              <LogOut className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-200 transition-colors duration-200"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl md:hidden z-50 transition-all duration-200 ease-in-out">
          <div className="flex flex-col divide-y divide-gray-100">
            <button
              onClick={() => {
                navigate('/DistributorHomePage');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <Home className="h-5 w-5 text-blue-600" />
              <span className="text-gray-800 font-medium">Home</span>
            </button>

            <button
              onClick={() => {
                navigate('/DistributorProfile');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <User className="h-5 w-5 text-blue-600" />
              <span className="text-gray-800 font-medium">Profile</span>
            </button>

            <button
              onClick={() => {
                navigate(-1);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-blue-600" />
              <span className="text-gray-800 font-medium">Back</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-6 py-4 hover:bg-red-50 group transition-colors duration-200"
            >
              <LogOut className="h-5 w-5 text-red-600 group-hover:text-red-700" />
              <span className="text-red-600 font-medium group-hover:text-red-700">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;