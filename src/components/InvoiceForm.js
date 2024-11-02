import React, { useState ,useEffect} from 'react';
import { AlertCircle, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pharmaDrugLicense, phone_number , pharmacy_name } = location.state || {};

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
    const fullPhoneNumber = `+91${phone_number.trim()}`;

    try {
      // Submit the invoice
      const response = await fetch(`http://localhost:5001/api/user/Invoice/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Send SMS notification
        const smsResponse = await fetch('http://localhost:5001/api/user/sendSMS/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            to: fullPhoneNumber,
            body: ` Urgent Demand Notice for Pending Payment - Invoice No. ${formData.invoice}

Dear ${pharmacy_name}, 

This is a reminder from MedScore on behalf of Ayan Medineeds regarding your outstanding payment associated with Invoice No. ${formData.invoice}, dated ${formData.invoiceDate}, with a due date of ${formData.dueDate}. The payment is now delayed by ${formData.delayDays} days.

Please settle the pending amount immediately to avoid a potential credit default on MedScore, which could impact your MedScore rating. A lower MedScore may reduce your chances of obtaining future credit from other distributors and could have lasting effects on your creditworthiness.

Kindly disregard this notice if the payment has already been made.

Thank you for your immediate attention to this matter.please visit our website: [medscore.in](http://medscore.in).

Best regards,
MedScore`
          })
        });

        // Check if SMS was sent successfully
        if (smsResponse.ok) {
          setSuccess('Invoice created and SMS sent successfully!');
          setFormData({
            invoice: '',
            invoiceAmount: '',
            invoiceDate: '',
            dueDate: '',
            delayDays: ''
          });
          // Navigate to the next screen
          navigate("/SendNotice");
        } else {
          const smsData = await smsResponse.json();
          setError('Invoice created, but failed to send SMS: ' + smsData.message);
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
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
                <DollarSign className="w-4 h-4" />
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
