import React, { useState } from 'react';

const SMSForm = () => {
  const [toNumber, setToNumber] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: toNumber,
          body: message
        })
      });

      if (response.ok) {
        alert('SMS sent successfully!');
        setToNumber('');
        setMessage('');
        setError('');
      } else {
        const errorData = await response.json();
        setError(`Failed to send SMS: ${errorData.error}`);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Error sending SMS:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <label>
        To:
        <input
          type="tel"
          value={toNumber}
          onChange={(e) => setToNumber(e.target.value)}
          required
        />
      </label>
      <label>
        Message:
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send SMS'}
      </button>
    </form>
  );
};

export default SMSForm;