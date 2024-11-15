import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [dlCode, setDlCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
   
    try {
      const dl_code2=dlCode.trim().toUpperCase();
      const response = await fetch(`${config.API_HOST}/api/user/resetpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dl_code: dl_code2 })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/ConfirmReset');
        }, 2000);
      } else {
        setError(data.message || 'Failed to send reset token. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      background: 'linear-gradient(to right, #ebf8ff, #f0f4ff)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'white',
        borderRadius: '1.5rem',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
      }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <div className="flex flex-col items-center mb-6">
            <img 
              src="/medscorelogo.jpeg" 
              alt="Medscore Logo" 
              className="w-[180px] h-auto object-contain mx-auto mb-4 drop-shadow-md transform transition-all duration-300 hover:scale-105"
            />
            <p className="text-[#1565C0] text-sm font-medium mt-2">Reset Your Password</p>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '0.75rem',
            marginBottom: '1rem',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            textAlign: 'center',
          }}>
            Reset token sent successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ gap: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4b5563' }} htmlFor="dl_code">
              Drug License Code
            </label>
            <input
              id="dl_code"
              type="text"
              placeholder="Enter your drug license code"
              value={dlCode}
              onChange={(e) => setDlCode(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                color: '#4b5563',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#93c5fd' : '#2563eb',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Token'}
          </button>

          <button
            onClick={() => navigate('/login')}
            type="button"
            style={{
              width: '100%',
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '1px solid #bfdbfe',
              cursor: 'pointer',
            }}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;