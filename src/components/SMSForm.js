import React, { useState } from 'react';

const SMSGatewayForm = () => {
  const [formData, setFormData] = useState({
    number: '',
    text: '',
    senderid: 'MEDSCR',
    APIKey: 'uewziuRKDUWctgdrHdXm5g',
  });
  const [status, setStatus] = useState({ loading: false, error: '', success: false });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: false });

    try {
      const baseUrl = 'https://www.smsgatewayhub.com/api/mt/SendSMS';
      const params = new URLSearchParams({
        APIKey: formData.APIKey,
        senderid: formData.senderid,
        channel: '2',
        DCS: '0',
        flashsms: '0',
        number: formData.number,
        text: formData.text,
        route: '1'
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await response.json();

      if (data.ErrorMessage === 'Success') {
        setStatus({ loading: false, error: '', success: true });
        setFormData(prev => ({ ...prev, number: '', text: '' }));
      } else {
        throw new Error(data.ErrorMessage || 'Failed to send SMS');
      }
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message || 'An unexpected error occurred',
        success: false
      });
    }
  };

  const formStyles = {
    container: {
      maxWidth: '500px',
      margin: '20px auto',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      borderRadius: '8px',
      backgroundColor: 'white',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      marginBottom: '10px',
    },
    textarea: {
      width: '100%',
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      minHeight: '100px',
      marginBottom: '10px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    buttonDisabled: {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
    error: {
      color: '#dc3545',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#f8d7da',
      borderRadius: '4px',
    },
    success: {
      color: '#28a745',
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#d4edda',
      borderRadius: '4px',
    },
  };

  return (
    <div style={formStyles.container}>
      <h2 style={formStyles.title}>Send SMS</h2>
      <form onSubmit={handleSubmit}>
        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Phone Number:</label>
          <input
            type="tel"
            name="number"
            value={formData.number}
            onChange={handleChange}
            placeholder="Enter phone number (e.g., 919XXXXXXXXX)"
            required
            style={formStyles.input}
          />
        </div>

        <div style={formStyles.formGroup}>
          <label style={formStyles.label}>Message:</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            placeholder="Enter your message"
            required
            style={formStyles.textarea}
          />
        </div>

        {status.error && (
          <div style={formStyles.error}>
            {status.error}
          </div>
        )}

        {status.success && (
          <div style={formStyles.success}>
            SMS sent successfully!
          </div>
        )}

        <button 
          type="submit" 
          style={{
            ...formStyles.button,
            ...(status.loading ? formStyles.buttonDisabled : {})
          }}
          disabled={status.loading}
        >
          {status.loading ? 'Sending...' : 'Send SMS'}
        </button>
      </form>
    </div>
  );
};

export default SMSGatewayForm;