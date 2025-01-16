import React, { useState,useEffect } from 'react';
import { AlertCircle, Calendar, FileText, Clock, IndianRupee, MessageCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { config } from '../config';
import { Navbar } from './Navbar';

const InvoiceFormRD = () => {
    const location = useLocation();
    const { pharmaDrugLicense, phone_number, pharmacy_name, pharmaId } = location.state || {};
    console.log(pharmaDrugLicense,"----")
    const [formData, setFormData] = useState({
        pharmadrugliseanceno: pharmaDrugLicense,
        invoice: '',
        invoiceAmount: '',
        invoiceDate: '',
        dueDate: '',
        delayDays: '',
        reason: ''
    });
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [smsStatus, setSmsStatus] = useState('');

    useEffect(() => {
      const interval = setInterval(checkScheduledActions, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
  }, []);

  const checkScheduledActions = async () => {
      try {
          const scheduleInfoListStr = localStorage.getItem('scheduleInfoList');
          if (!scheduleInfoListStr) return;

          const scheduleInfoList = JSON.parse(scheduleInfoListStr);
          const currentTime = new Date().getTime();
          const updatedScheduleList = [];

          for (const scheduleInfo of scheduleInfoList) {
              if (currentTime - scheduleInfo.timestamp >= 72 * 24 * 60 * 1000 && !scheduleInfo.processed) {
                  try {
                      const disputeResponse = await fetch(
                          `${config.API_HOST}/api/user/checkifdisputedtrue/${scheduleInfo.pharmacyId}?pharmadrugliseanceno=${scheduleInfo.drugLicenseNo}&invoice=${scheduleInfo.invoice}`
                      );
                      const disputeData = await disputeResponse.json();
                      
                      if (!disputeData.disputed) {
                          const getalldistData = await fetch(`${config.API_HOST}/api/user/getdistdatabyphid/${scheduleInfo.pharmacyId}`);
                          const distributors = (await getalldistData.json()).data;
                          
                          await Promise.all(distributors.filter(d => d.phone_number).map(async (distributor) => {
                              const distFullPhoneNumber = `91${distributor.phone_number.trim()}`;
                              await fetch(`${config.API_HOST}/api/user/sendSMS`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                      phone: distFullPhoneNumber,
                                      message: `MedScore Update for ${distributor.pharmacy_name} Dear Partner, Please be advised that ${scheduleInfo.pharmacyName}'s MedScore has been reduced due to a ${scheduleInfo.delayDays}-day delay in payment. This adjustment reflects their recent credit performance. Click the link for detailed report medscore.in. Thank you for your attention. Best regards, MedScore Team`
                                  })
                              });
                          }));
                          scheduleInfo.processed = true;
                      }
                  } catch (error) {
                      console.error(`Error processing schedule: ${error}`);
                  }
              }
              
              if (!scheduleInfo.processed) {
                  updatedScheduleList.push(scheduleInfo);
              }
          }

          localStorage.setItem('scheduleInfoList', JSON.stringify(updatedScheduleList));
      } catch (error) {
          console.error('Error in checkScheduledActions:', error);
      }
  };

    const handleDueDateChange = (dueDate) => {
        if (dueDate) {
            const dueDateTime = new Date(dueDate);
            const currentDate = new Date();
            
            dueDateTime.setHours(0, 0, 0, 0);
            currentDate.setHours(0, 0, 0, 0);

            const diffTime = currentDate - dueDateTime;
            const delayDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            
            setFormData(prev => ({
                ...prev,
                delayDays: delayDays.toString()
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        if (name === 'dueDate') {
            handleDueDateChange(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        const customerId = localStorage.getItem('userId');

        const fullPhoneNumber = `91${phone_number.trim()}`;

        try {
            const response = await fetch(`${config.API_HOST}/api/user/InvoiceReportDefault/${customerId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
             console.log(data.data)
            if (response.ok) {
                const newScheduleInfo = {
                    id: Date.now(),
                    timestamp: new Date().getTime(),
                    pharmacyId: pharmaId,
                    pharmacyName: pharmacy_name,
                    phoneNumber: fullPhoneNumber,
                    drugLicenseNo: formData.pharmadrugliseanceno,
                    invoice: formData.invoice,
                    delayDays: formData.delayDays,
                    processed: false
                };
                
                const existingListStr = localStorage.getItem('scheduleInfoList');
                const scheduleList = existingListStr ? JSON.parse(existingListStr) : [];
                scheduleList.push(newScheduleInfo);
                localStorage.setItem('scheduleInfoList', JSON.stringify(scheduleList));

                await checkScheduledActions();

                const smsResult = await fetch(`${config.API_HOST}/api/user/sendSMS`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phone: fullPhoneNumber,
                        message: `Important Update: MedScore Reduced Due to Payment Delay Dear ${pharmacy_name}, We are writing to inform you that your MedScore has been reduced due to a delayed payment of ${formData.delayDays} days on Invoice No. ${formData.invoice}. Maintaining a strong MedScore is essential for seamless credit access with distributors. Please click the link below for a detailed report on your updated score: medscore.in Thank you for your attention to this matter. Best regards, MedScore Team`
                    })
                });

                if (!smsResult.ok) {
                    setSmsStatus('SMS delivery failed');
                    throw new Error('Failed to send SMS');
                }

                const smsData = await smsResult.json();
                setSmsStatus(`SMS Status: ${smsData.status || 'Sent'}`);
                setSuccess('Invoice created and notification sent successfully!');
                navigate("/ReportDefault");
            } else {
                setError(data.message || 'Failed to create invoice');
            }
        } catch (err) {
            setError(`Error: ${err.message || 'Failed to process request'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <div className="fixed top-0 left-0 w-full z-50">
                <Navbar/>
            </div>
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-100 rounded-2xl shadow-xl overflow-hidden">
                   
                    <div className="bg-blue-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white text-center">Create Invoice for Report Default</h2>
          </div>
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className='grid grid-cols-2 md:grid-cols-2 gap-8'>

                       
                        <div className="space-y-2">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span>Invoice No</span>
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
                                placeholder="Enter reason"
                                required
                            />
                        </div>
                        </div>
                        {error && (
                            <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-center space-x-2">
                                <AlertCircle className="h-4 w-4" />
                                <p>{error}</p>
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 text-green-700 p-4 rounded-md">
                                <p>{success}</p>
                            </div>
                        )}

                        {smsStatus && (
                            <div className="bg-blue-50 text-blue-700 p-4 rounded-md flex items-center space-x-2">
                                <MessageCircle className="h-4 w-4" />
                                <p>{smsStatus}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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