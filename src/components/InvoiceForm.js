import React, { useState ,useEffect} from 'react';
import { AlertCircle, Calendar, DollarSign, FileText, Clock, IndianRupee } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { config } from '../config';
import { Navbar } from './Navbar';

const InvoiceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pharmaDrugLicense, phone_number , pharmacy_name } = location.state || {};
console.log("phone_number ",phone_number)
  const [formData, setFormData] = useState({
    pharmadrugliseanceno: pharmaDrugLicense,
    invoice: '',
    invoiceAmount: '',
    invoiceDate: '',
    dueDate: '',
    delayDays: ''
  });

  const [error, setError] = useState('');

  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const currentDate = new Date();
      
      // Reset time part to avoid time zone issues
      dueDate.setHours(0, 0, 0, 0);
      currentDate.setHours(0, 0, 0, 0);

      // Calculate difference in days
      const diffTime = currentDate - dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Only set delay days if payment is actually delayed (positive number)
      const delayDays = diffDays > 0 ? diffDays : 0;
      
      setFormData(prev => ({
        ...prev,
        delayDays: delayDays.toString()
      }));
    }
  }, [formData.dueDate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const customerId = localStorage.getItem('userId');
    const fullPhoneNumber = `91${phone_number.trim()}`;

    try {
      const response = await fetch(`${config.API_HOST}/api/user/Invoice/${customerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      const dist_pharmacy_name = localStorage.getItem('pharmacy_name');
      if (response.ok) {
       await fetch(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=uewziuRKDUWctgdrHdXm5g&senderid=MEDSCR&channel=2&DCS=0&flashsms=0&number=${fullPhoneNumber}&text=Payment Reminder - Invoice No. ${formData.invoice} Dear ${pharmacy_name}, This is a reminder from MedScore, on behalf of ${dist_pharmacy_name}, regarding your pending payment for Invoice No. ${formData.invoice}, dated ${formData.invoiceDate}, which was due on ${formData.dueDate}. The payment is currently overdue by ${formData.delayDays} days. To maintain a strong MedScore rating and ensure continued access to credit, please complete the payment at your earliest convenience. If payment has already been processed, kindly disregard this notice. Thank you for your prompt attention. Best regards, MedScore&route=1`,{mode: "no-cors"});

        if (response.ok) {
          setSuccess('Invoice created and SMS sent successfully!');
          setFormData({ invoice: '', invoiceAmount: '', invoiceDate: '', dueDate: '', delayDays: '' });
          navigate("/SendNotice");
        } else {
         
          setError('Invoice created, but failed to send SMS: ' + ( 'Unknown error'));
        }
      } else {
        setError(data.message || 'Failed to create invoice');
      }
    } catch (err) {
      setError('Network error: Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };


  return (
    
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar/>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mt-16">
          <h2 className="text-2xl font-bold text-center mb-6">Create Invoice</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invoice Number */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Invoice</span>
              </label>
              <input
                type="text"
                name="invoice"
                value={formData.invoice}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter invoice number"
                required
              />
            </div>

            {/* Invoice Amount */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <IndianRupee className="w-4 h-4" />
                <span>Invoice Amount</span>
              </label>
              <input
                type="number"
                name="invoiceAmount"
                value={formData.invoiceAmount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Invoice Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Invoice Date</span>
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>Due Date</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                min={formData.invoiceDate}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Delay Days */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Clock className="w-4 h-4" />
                <span>Delay Days</span>
              </label>
              <input
                type="number"
                name="delayDays"
                value={formData.delayDays}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter delay days"
                required
              />
            </div>

          

            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-md">
                <p>{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
