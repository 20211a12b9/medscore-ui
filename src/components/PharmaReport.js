import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Search, X } from 'lucide-react';

const PharmaReport = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dl_code, setDl_code] = useState('');
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [disputeReason, setDisputeReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const disputeReasons = [
    { value: 'payment_cleared', label: 'Payment already cleared' },
    { value: 'payment_mismatch', label: 'Payment details not matching with our records' },
    { value: 'stocks_not_delivered', label: 'This invoice stocks not delivered' },
    { value: 'custom', label: 'Custom Reason' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a license number');
      return;
    }
    setLicenseNo(searchQuery);
    await fetchInvoiceData(searchQuery);
  };

  const fetchInvoiceData = async () => {
    const userId = await localStorage.getItem("userId");
    const license = await localStorage.getItem("dl_code");
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:5001/api/user/getInvoiceRD/${license}`);
      console.log("response----",response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("result----",result)
      if (result.success) {
        setInvoices(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch invoice data');
      }
    } catch (err) {
      setError(err.message);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, []);

  const handleDisputeClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDisputeModalOpen(true);
  };

  const handleSubmitDispute = async () => {
    if (!disputeReason) {
      alert('Please select a reason for dispute');
      return;
    }

    if (disputeReason === 'custom' && !customReason.trim()) {
      alert('Please enter a custom reason');
      return;
    }

    try {
      setLoading(true);
      
      const finalReason = disputeReason === 'custom' ? customReason : 
        disputeReasons.find(r => r.value === disputeReason)?.label;
       console.log("finalReason",finalReason)
      const response = await fetch(
        `http://localhost:5001/api/user/disputebypharma/${selectedInvoice.pharmadrugliseanceno}/${selectedInvoice.invoice}/${selectedInvoice.customerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json' // Add this header
          },
          body: JSON.stringify({ // Convert to JSON string and fix the object structure
            reasonforDispute: finalReason
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to submit dispute');
      }
      const fullPhoneNumber = `+917036222121`;
       await fetch('http://localhost:5001/api/user/sendSMS/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: fullPhoneNumber,
          body: `Dear Admin,

A forced dispute request has been made for dealer with Drug License No. ${selectedInvoice.pharmadrugliseanceno}, regarding invoice ${selectedInvoice.invoice}. website: [medscore.in](http://medscore.in).`
        })
      });

      const result = await response.json();
      if (result.success) {
        // Update the local invoices state to mark this invoice as disputed
        setInvoices(prevInvoices => 
          prevInvoices.map(inv => 
            inv._id === selectedInvoice._id 
              ? { ...inv, isDisputed: true }
              : inv
          )
        );
        alert('Dispute submitted successfully!');
        setIsDisputeModalOpen(false);
        setDisputeReason('');
        setCustomReason('');
      }
    } catch (err) {
      alert(`Error submitting dispute: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-4 bg-white rounded-lg shadow">
      <div className="border-b p-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Detailed Report</h2>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">SerialNo</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">License Number</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Delay Days</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Invoice Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{invoice.serialNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{invoice.invoice}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{invoice.pharmadrugliseanceno}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatDate(invoice.invoiceData)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{invoice.delayDays}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{invoice.invoiceAmount}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDisputeClick(invoice)}
                      disabled={invoice.dispute || invoice.isDisputed}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed inline-flex items-center
                        ${invoice.dispute || invoice.isDisputed
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                        }`}
                    >
                      {invoice.dispute || invoice.isDisputed ? 'Disputed' : 'Report Dispute'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Custom Modal */}
        {isDisputeModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-25" 
                onClick={() => setIsDisputeModalOpen(false)}
              />

              {/* Modal Content */}
              <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="absolute right-4 top-4">
                  <button
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Report Dispute</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please select a reason for disputing this invoice
                  </p>
                </div>

                <div className="space-y-4">
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="">Select reason for dispute</option>
                    {disputeReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>

                  {disputeReason === 'custom' && (
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Enter your reason here..."
                      className="w-full px-3 py-2 border rounded-md text-sm"
                      rows={4}
                    />
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setIsDisputeModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitDispute}
                      disabled={!disputeReason || (disputeReason === 'custom' && !customReason.trim())}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Dispute
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmaReport;