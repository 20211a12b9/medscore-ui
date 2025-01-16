import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate, replace } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { config } from '../config';
import { Eye, EyeOff } from 'lucide-react';
export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dl_code: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('jwttoken');
    const userType = localStorage.getItem('userType');
    
    if (token && userType) {
      // Redirect to appropriate dashboard based on user type
      if (userType === "Pharma") {
        navigate('PharmacyHomepage', { replace: true });
      } else if (userType === "Dist") {
        navigate('DistributorHomePage', { replace: true });
      }
    }
  }, [navigate]);
  useEffect(() => {
    const token = localStorage.getItem('jwttoken');
    const userType = localStorage.getItem('userType');
    
    if (token && userType) {
      const redirectPath = userType === "Pharma" ? '/pharmacy-dashboard' : '/pharmacy-app';
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);
  const handleChange = (e) => {
    const {name,value}=e.target;
    if (name === 'dl_code') {
      setFormData({
          ...formData,
          [name]: value.trim().toUpperCase(),
      });
  } 
  else {
      setFormData({
          ...formData,
          [name]: value,
      });
  }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${config.API_HOST}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Store the token and user type
        localStorage.setItem('jwttoken', data.jwttoken);
        localStorage.setItem('userType', data.usertype);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('pharmacy_name', data.pharmacy_name);
        localStorage.setItem('dl_code', data.dl_code);
        setIsLoggedIn(true);
        
     
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // If user is already logged in, redirect them
  if (localStorage.getItem('jwttoken')) {
    const userType = localStorage.getItem('userType');
    return <Navigate to={userType === "Pharma" ? '/PharmacyDashboard' : '/PharmacyApp'} replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/medscore.png" 
              alt="Medscore Logo" 
              className="w-48 h-auto object-contain mx-auto mb-4 drop-shadow-md transform transition-all duration-300 hover:scale-105"
            />
            <p className="text-[#1565C0] text-sm font-medium">Credit Simplified, Amplified</p>
          </div>
          <h2 className="text-xl text-gray-600 font-medium">Login to your account</h2>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="dl_code" className="block text-sm font-semibold text-gray-700 mb-2">
              Drug License Code
            </label>
            <input
              id="dl_code"
              name="dl_code"
              type="text"
              placeholder="Enter your drug license code"
              value={formData.dl_code}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline text-sm"
            >
              Create an Account
            </button>
            <button
              type="button"
              onClick={() => navigate('/ForgotPassword')}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate('/')}
              type="button"
              className="text-white bg-slate-500 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;