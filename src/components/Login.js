import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { config } from '../config';
import { Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dl_code: '',
    password: '',
    type: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);
const [sessionMessage, setSessionMessage] = useState('');
const [captchaValue, setCaptchaValue] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('jwttoken');
    const userType = localStorage.getItem('userType');
    
    if (token && userType) {
      const redirectPath = userType === "Pharma" ? '/pharmacy-dashboard' : '/pharmacy-app';
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'dl_code') {
      setFormData({
        ...formData,
        [name]: value.trim().toUpperCase(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (error) setError('');
  };

  const handleTypeSelection = async (selectedType) => {
    setFormData(prev => ({ ...prev, type: selectedType }));
    setShowTypeModal(false);
    
    try {
      const response = await fetch(`${config.API_HOST}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type: selectedType })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwttoken', data.jwttoken);
        localStorage.setItem('userType', data.usertype);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('pharmacy_name', data.pharmacy_name);
        localStorage.setItem('dl_code', data.dl_code);
        setIsLoggedIn(true);
        // setupTokenRefresh();
        navigate(data.usertype === "Pharma" ? '/PharmacyDashboard' : '/PharmacyApp', { replace: true });
      } else {
        setCaptchaValue(null);
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setCaptchaValue(null);
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
    setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const proceedWithLogin = async () => {
    try {
      const response = await fetch(`${config.API_HOST}/api/user/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('jwttoken', data.jwttoken);
        localStorage.setItem('userType', data.usertype);
        localStorage.setItem('userId', data.id);
        localStorage.setItem('pharmacy_name', data.pharmacy_name);
        localStorage.setItem('dl_code', data.dl_code);
        setIsLoggedIn(true);
        // setupTokenRefresh();
        navigate(data.usertype === "Pharma" ? '/PharmacyDashboard' : '/PharmacyApp', { replace: true });
      } else {
        setCaptchaValue(null);
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setCaptchaValue(null);
    if (window.grecaptcha) {
      window.grecaptcha.reset();
    }
    setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


// Token refresh setup
// const setupTokenRefresh = () => {
//   const REFRESH_INTERVAL =14 * 60 * 1000; // 14 minute in milliseconds
//   const type=localStorage.getItem('userType')
//   const refreshAccessToken = async () => {
//     try {
//       const currentToken = localStorage.getItem('jwttoken');
//       const userId = localStorage.getItem('userId');
      
//       if (!currentToken || !userId) {
//         throw new Error('Missing token or userId');
//       }

//       const response = await fetch(`${config.API_HOST}/api/user/refreshToken`, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Authorization': `Bearer ${currentToken}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ userId })
        
       
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
//       }
  
//       const data = await response.json();
      
//       if (data.jwttoken) {
//         localStorage.setItem('jwttoken', data.jwttoken);
//         console.log('Token refreshed successfully');
//       } else {
//         throw new Error('No token in response');
//       }
//     } catch (error) {
//       console.error('Token refresh failed:', error);
      
//       // Only clear session and redirect if it's a token-related error
//       if (error.message.includes('token') || error.message.includes('401') || error.message.includes('403')) {
//         clearSessionAndRedirect();
//       }
//     }
//   };

//   const clearSessionAndRedirect = () => {
//     localStorage.removeItem('jwttoken');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('userType');
//     localStorage.removeItem('pharmacy_name');
//     localStorage.removeItem('dl_code');
//     setIsLoggedIn(false);
   
//     navigate('/login', { replace: true });
//   };

//   // Initial token refresh
//   // refreshAccessToken();

//   // Set up periodic refresh every 1 minute
//   const refreshInterval = setInterval(refreshAccessToken, REFRESH_INTERVAL);

//   // Clean up on component unmount
//   return () => {
//     clearInterval(refreshInterval);
//     console.log('Token refresh interval cleared');
//   };
// };
// useEffect(()=>{
//   setupTokenRefresh();
// },[])
const handleCaptchaChange = (value) => {
  setCaptchaValue(value);
  if (error) setError('');
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // if (!captchaValue) {
    //   setError('Please complete the CAPTCHA verification');
    //   setLoading(false);
    //   return;
    // }
    try {

      // const captchaResponse = await fetch(`${config.API_HOST}/api/user/recaptcha`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     mode: 'no-cors',
      //   },
      //   body: JSON.stringify({ captchaToken: captchaValue })
      // });

      // const captchaData = await captchaResponse.json();
      
      // if (!captchaData.success) {
      //   setError('CAPTCHA verification failed. Please try again.');
      //   setLoading(false);
      //   return;
      // }
      // First check if user is logged in elsewhere
      const checkResponse = await fetch(`${config.API_HOST}/api/user/checkIfLoggedinbith`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const checkData = await checkResponse.json();

      if (checkResponse.ok) {
        if (checkData.status === true) {
          // Show the type selection modal if already logged in
          console.log("checkData ",checkData)
          setShowTypeModal(true);
          setLoading(false);
          return;
        } else {
          // If not logged in elsewhere, proceed directly with login
          await proceedWithLogin();
        }
      } else {
      //   setCaptchaValue(null);
      // if (window.grecaptcha) {
      //   window.grecaptcha.reset();
      // }
      // setError( 'Login failed. Please check your credentials.');
      }
    } catch (error) {
    //   setCaptchaValue(null);
    // if (window.grecaptcha) {
    //   window.grecaptcha.reset();
    // }
    // setError('Login failed. Please check your credentials.');
    //   setLoading(false);
    }
  };

  if (localStorage.getItem('jwttoken')) {
    const userType = localStorage.getItem('userType');
    return <Navigate to={userType === "Pharma" ? '/PharmacyDashboard' : '/PharmacyApp'} replace />;
  }

  return (
    <>
      {/* Type Selection Modal */}
      {showTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Select Login Type</h2>
            <p className="text-gray-600 mb-6">
            This account is registered as both a Pharmacy and a Distributor. Please select how you would like to proceed.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => handleTypeSelection('Pharma')}
                className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Login as a Buyer
              </button>
              <button
                onClick={() => handleTypeSelection('Dist')}
                className="w-full py-2 px-4 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Login as a Seller
              </button>
              <button
                onClick={() => setShowTypeModal(false)}
                className="w-full py-2 px-4 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Login Form */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-[1.02]">
          <div className="mb-8 text-center">
            <div className="flex flex-col items-center mb-6">
              <img 
                src="/medscore_newlogo.png" 
                alt="Medscore Logo" 
                className="w-48 h-auto object-contain mx-auto mb-4 drop-shadow-md transform transition-all duration-300 hover:scale-105"
              />
              <p className="text-[#1565C0] text-sm font-medium">Credit Simplified, Amplified</p>
            </div>
            <h2 className="text-xl text-gray-600 font-medium">Login to your account</h2>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
{/* Session Expired Modal */}
{showSessionExpiredModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
      <h2 className="text-xl font-semibold mb-4 text-red-600">Session Expired</h2>
      <p className="text-gray-600 mb-6">
        {sessionMessage}
      </p>
      <button
        onClick={() => {
          setShowSessionExpiredModal(false);
          setSessionMessage('');
        }}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Login Again
      </button>
    </div>
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
            {/* <div className="flex justify-center my-4">
              <ReCAPTCHA
                sitekey="6LfgT9IqAAAAANlJ6C4iT0udjmhYy7oauoXWuheq"
                onChange={handleCaptchaChange}
                theme="light"
                size="normal"
              />
            </div> */}
            <button
              type="submit"
              // disabled={loading || !captchaValue}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                loading || captchaValue
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
    </>
  );
};

export default Login;