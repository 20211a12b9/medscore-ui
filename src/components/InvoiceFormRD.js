import React, { useState,useEffect } from 'react';
import { AlertCircle, Calendar, DollarSign, FileText, Clock, IndianRupee } from 'lucide-react';
import { useLocation,useNavigate } from 'react-router-dom';
import { config } from '../config';

const InvoiceFormRD = () => {
    const location=useLocation();
const {pharmaDrugLicense,phone_number,pharmacy_name,pharmaId}=location.state ||{}
console.log("phone_number",phone_number,pharmaId,"pharmaId")

  const [formData, setFormData] = useState({
    pharmadrugliseanceno:pharmaDrugLicense,
    invoice: '',
    invoiceAmount: '',
    invoiceDate: '',
    dueDate: '',
    delayDays: '',
    reason:''
  });
const navigate=useNavigate();
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
console.log("pharmaDrugLicense",pharmaDrugLicense)
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

    // Replace with your actual API endpoint and customer ID
    const customerId = localStorage.getItem('userId');
    const fullPhoneNumber = `91${phone_number.trim()}`;
    console.log("customerId : ", customerId);

    try {
        // First API call to create invoice
        const response = await fetch(`${config.API_HOST}/api/user/InvoiceReportDefault/${customerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        console.log(data);

        try {
          if (response.ok) {
              // Get all distributor data
              const getalldistData = await fetch(`${config.API_HOST}/api/user/getdistdatabyphid/${pharmaId}`);
              const responseData = await getalldistData.json(); // Added 'await' here
              const distributors = responseData.data; 
              console.log("getAllDistData", distributors);
      
              // Send SMS to all distributors
              await Promise.all(distributors.map(async (distributor) => {
                  if (!distributor.phone_number) {
                      console.warn(`No phone number found for distributor: ${distributor.id}`);
                      return;
                  }
      
                  const distFullPhoneNumber = `91${distributor.phone_number.trim()}`;
                  console.log("distributor.phone_number", distFullPhoneNumber);
                  
                  try {
                      await fetch(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=uewziuRKDUWctgdrHdXm5g&senderid=MEDSCR&channel=2&DCS=0&flashsms=0&number=${distFullPhoneNumber}&text=MedScore Update for ${pharmacy_name} Dear Partner, Please be advised that ${pharmacy_name}'s MedScore has been reduced due to a ${formData.delayDays}-day delay in payment. This adjustment reflects their recent credit performance. Click the link for detailed report medscore.in. Thank you for your attention. Best regards, MedScore Team&route=1`,{mode: "no-cors"});
                  } catch (error) {
                      console.error("Failed to send SMS to distributor:", distributor.id, error);
                  }
              }));
      
              // Send SMS to pharmacy
              try {
                  await fetch(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=uewziuRKDUWctgdrHdXm5g&senderid=MEDSCR&channel=2&DCS=0&flashsms=0&number=${fullPhoneNumber}&text=Important Update: MedScore Reduced Due to Payment Delay Dear ${pharmacy_name},We are writing to inform you that your MedScore has been reduced due to a delayed payment of ${formData.delayDays} days on Invoice No. ${formData.invoice}. Maintaining a strong MedScore is essential for seamless credit access with distributors. Please click the link below for a detailed report on your updated score: medscore.in Thank you for your attention to this matter.Best regards,MedScore Team&route=1`,{mode: "no-cors"});
              } catch (error) {
                  console.error("Failed to send SMS to pharmacy:", error);
              }
      
              // Reset form data
              setFormData({
                  invoice: '',
                  invoiceAmount: '',
                  invoiceDate: '',
                  dueDate: '',
                  delayDays: '',
                  reason: ''
              });
      
              // Navigate to the next screen
              navigate("/ReportDefault");
      
          } else {
              setError(data.message || 'Failed to create invoice');
          }
      } catch (error) {
          console.error("An error occurred:", error);
          setError('An unexpected error occurred. Please try again later.');
      }
      
      
    } catch (err) {
        setError(`Error: ${err.message || 'Failed to process request'}`);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Create Invoice for Report Default</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
             {/*Phrama Drugliseance Number */}
             {/* <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4" />
                <span>Phrama Drugliseance Number</span>
              </label>
              <input
                type="text"
                name="pharmadrugliseanceno"
                value={formData.pharmadrugliseanceno}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter pharmadrugliseanceno number"
                required
              />
            </div> */}
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
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              
                <span>Reason/Remark</span>
              </label>
              <input
                type="text"
                name="reason"
                value={formData.reason}
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

export default InvoiceFormRD;