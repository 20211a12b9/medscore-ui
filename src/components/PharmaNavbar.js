import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, LogOut, ChevronLeft, Menu, X } from 'lucide-react';

export const PharmaNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?');
    if (confirmLogout) {
      localStorage.removeItem('jwttoken');
      localStorage.removeItem('userId');
      window.location.href = '/';
    }
  };

  return (
    <nav className="relative bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src="img/logo/white-logo.png"
              alt="MedScore Logo"
              className="h-14 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => navigate('/PharmacyrHomePage')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => navigate('/PharmaProfile')}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden z-50">
          <div className="flex flex-col p-2 space-y-1">
            <button
              onClick={() => {
                navigate('/PharmacyHomePage');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => {
                navigate('/PharmaProfile');
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200"
            >
              <User className="h-5 w-5" />
              <span className="font-medium">Profile</span>
            </button>

            <button
              onClick={() => {
                navigate(-1);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PharmaNavbar;