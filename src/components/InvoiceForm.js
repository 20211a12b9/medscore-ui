import React, { useState, useEffect } from 'react';
import { AlertCircle, Calendar, FileText, Clock, IndianRupee, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { config } from '../config';
import { Navbar } from './Navbar';

const InvoiceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pharmaDrugLicense, phone_number, pharmacy_name } = location.state || {};
  const [smsStatus, setSmsStatus] = useState('');

  const [formData, setFormData] = useState({
    pharmadrugliseanceno: pharmaDrugLicense,
    invoice: '',
    invoiceAmount: '',
    invoiceDate: '',
    dueDate: '',
    delayDays: '0'
  });
  console.log("phone_number",phone_number)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.dueDate && formData.invoiceDate) {
      const dueDate = new Date(formData.dueDate);
      const currentDate = new Date();
      dueDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);
      const diffTime = currentDate - dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData(prev => ({
        ...prev,
        delayDays: Math.max(0, diffDays).toString()
      }));
    }
  }, [formData.dueDate, formData.invoiceDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'invoiceAmount' && value < 0) return;
    if (name === 'delayDays' && value < 0) return;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendSMS = async (phoneNumbers,dist_pharmacy_name) => {
    const smsPromises = phoneNumbers.map(async (phone) => {
      console.log("fullPhoneNumber--",phone)
      const smsResult = await fetch(`${config.API_HOST}/api/user/sendSMS`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          message: `Payment Reminder - Invoice No. ${formData.invoice} Dear ${pharmacy_name}, This is a reminder from MedScore, on behalf of ${dist_pharmacy_name}, regarding your pending payment for Invoice No. ${formData.invoice}, dated ${formData.invoiceDate}, which was due on ${formData.dueDate}. The payment is currently overdue by ${formData.delayDays} days. To maintain a strong MedScore rating and ensure continued access to credit, please complete the payment at your earliest convenience. If payment has already been processed, kindly disregard this notice. Thank you for your prompt attention. Best regards, MedScore`
          
        })
      });
  
      return smsResult;
    });
  
    const results = await Promise.all(smsPromises);
    return results;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSmsStatus('');
  
    const customerId = localStorage.getItem('userId');
    const dist_pharmacy_name = localStorage.getItem('pharmacy_name');
    const fullPhoneNumbers = phone_number && Array.isArray(phone_number)
      ? phone_number.map(num => `91${String(num).trim()}`)
      : [];
    console.log("fullPhoneNumbers",fullPhoneNumbers)
    try {
      const invoiceResponse = await fetch(`${config.API_HOST}/api/user/Invoice/${customerId}`, {
        method: 'POST',
        headers: { 
          // 'Authorization':`Bearer ${localStorage.getItem('jwttoken')}`,
          'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      if (!invoiceResponse.ok) throw new Error('Failed to create invoice');
  
      const smsResult = await sendSMS(fullPhoneNumbers,dist_pharmacy_name); // Correctly await sendSMS
  
      const failedSms = smsResult.find(result => !result.ok);
      if (failedSms) {
        setSmsStatus('SMS delivery failed');
        throw new Error('Failed to send SMS');
      }
  
      setSmsStatus('SMS Status: Sent');
      setSuccess('Invoice created and notification sent successfully!');
      navigate("/SendNotice");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white text-center">Create New Invoice</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Invoice Number</span>
                </label>
                <input
                  type="text"
                  name="invoice"
                  value={formData.invoice}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter invoice number"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <IndianRupee className="w-4 h-4 text-blue-600" />
                  <span>Invoice Amount (₹)</span>
                </label>
                <input
                  type="number"
                  name="invoiceAmount"
                  value={formData.invoiceAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Invoice Date</span>
                </label>
                <input
                  type="date"
                  name="invoiceDate"
                  value={formData.invoiceDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Due Date</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  min={formData.invoiceDate}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Delay Days</span>
                </label>
                <input
                  type="number"
                  name="delayDays"
                  value={formData.delayDays}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500"
                  readOnly
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {smsStatus && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-lg flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 flex-shrink-0" />
                <p className="text-sm">{smsStatus}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
                <p className="text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </span>
              ) : (
                'Send Remainder Notice'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;