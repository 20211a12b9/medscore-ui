import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate, replace } from 'react-router-dom';
import { AppContext } from '../AppContext';
import { config } from '../config';

export const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dl_code: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useContext(AppContext);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        setIsLoggedIn(true);
        
        // Navigate with replace to prevent back navigation to login
        // if (data.usertype === "Pharma") {
        //   navigate('/PharmacyApp', { replace: true });
        // } else if (data.usertype === "Dist") {
        //   navigate('/PharmacyDashboard', { replace: true });
        // } else if(data.usertype === "Admin");
        // {
        //   navigate('/AdminHomeScreen', { replace: true });
        // }
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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'linear-gradient(to right, #ebf8ff, #f0f4ff)',
      }}
    >
      {/* Rest of your JSX remains the same */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          transform: 'scale(1)',
          transition: 'transform 0.2s',
        }}
      >
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          {/* <h1
            style={{
              fontSize: '2rem',
              fontWeight: '800',
              background: 'linear-gradient(to right, #2563eb, #3b82f6)',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '1rem',
            }}
          >
            Medscore
          </h1> */}
           <div className="flex flex-col items-center mb-6">
                    <img 
                        src="/medscore.png" 
                        alt="Medscore Logo" 
                        className="w-[180px] h-auto object-contain mx-auto mb-4 drop-shadow-md transform transition-all duration-300 hover:scale-105"
                    />
                    <p className="text-[#1565C0] text-sm font-medium mt-2">Credit Simplified, Amplified</p>
                </div>
          <h2 style={{ fontSize: '1.25rem', color: '#4b5563', fontWeight: '500' }}>
            Login to your account
          </h2>
        </div>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              marginBottom: '1rem',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }} htmlFor="dl_code">
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
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#4b5563',
                transition: 'all 0.2s',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#4b5563',
                transition: 'all 0.2s',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#93c5fd' : '#2563eb',
              backgroundImage: loading ? 'none' : 'linear-gradient(to right, #2563eb, #3b82f6)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div style={{ position: 'relative', margin: '1.5rem 0' }}>
            <div
              style={{
                position: 'absolute',
                inset: '0',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div style={{ width: '100%', borderTop: '1px solid #e5e7eb' }}></div>
            </div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '0.875rem',
                color: '#6b7280',
                backgroundColor: 'white',
                padding: '0 1rem',
              }}
            >
              Don't have an account?
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => navigate('/register')}
              type="button"
              style={{
                flex: 1,
                backgroundColor: 'white',
                color: '#2563eb',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                border: '1px solid #bfdbfe',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '0.875rem',
              }}
            >
              Register 
            </button>
          </div>
          <div style={{ textAlign: 'right', marginTop: '-1rem', marginBottom: '1rem' }}>
  <button
    onClick={() => navigate('/ForgotPassword')}
    type="button"
    required
    style={{
      background: 'none',
      border: 'none',
      color: '#2563eb',
      fontSize: '0.875rem',
      cursor: 'pointer',
      textDecoration: 'underline',
    }}
  >
    Forgot Password?
  </button>
</div>
        </form>
      </div>
    </div>
  );
};

export default Login;