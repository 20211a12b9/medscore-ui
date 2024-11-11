import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Search, X,User } from 'lucide-react';
import { config } from '../config';

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
  const [distData, setDistData] = useState(null);
  const [showDistModal, setShowDistModal] = useState(false);
  const [distLoading, setDistLoading] = useState(false);
  const [distError, setDistError] = useState(null);

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
  const fetchDistributorData = async (customerId) => {
    try {
      setDistLoading(true);
      setDistError(null);
      const response = await fetch(`${config.API_HOST}/api/user/getDistData/${customerId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setDistData(result.data);
        setShowDistModal(true);
      } else {
        throw new Error(result.message || 'Failed to fetch distributor data');
      }
    } catch (err) {
      setDistError(err.message);
    } finally {
      setDistLoading(false);
    }
  };
  const fetchInvoiceData = async () => {
    const userId = await localStorage.getItem("userId");
    const license = await localStorage.getItem("dl_code");
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${config.API_HOST}/api/user/getInvoiceRD?licenseNo=${license}`);
      console.log("response----",response)
      if (response.status === 404) {
        setError('No invoices found in database');
        setInvoices([]);
        return;
      }
      
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
        `${config.API_HOST}/api/user/disputebypharma/${selectedInvoice.pharmadrugliseanceno}/${selectedInvoice.invoice}/${selectedInvoice.customerId}`,
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
      const license = await localStorage.getItem("dl_code");
       await fetch(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=uewziuRKDUWctgdrHdXm5g&senderid=MEDSCR&channel=2&DCS=0&flashsms=0&number=${fullPhoneNumber}&text=Dear Admin,A forced dispute request has been made for dealer with Drug License No. ${license}, regarding invoice ${selectedInvoice}. website: medxbid.in&route=1`,{mode: "no-cors"});

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
    <div className="max-w-7xl mx-auto mt-8 bg-white rounded-xl shadow-lg">
      <div className="border-b border-gray-100 p-8">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Your Detailed Report</h2>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">SerialNo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">IssuedOn</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">License Number</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Delay Days</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice Amount</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.serialNo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.createdAt)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-blue-600">{invoice.invoice}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{invoice.pharmadrugliseanceno}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.invoiceDate)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4 text-sm font-medium text-red-600">{invoice.delayDays}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{invoice.invoiceAmount}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleDisputeClick(invoice)}
                        disabled={invoice.dispute || invoice.isDisputed}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed inline-flex items-center gap-2
                          ${invoice.dispute || invoice.isDisputed
                            ? 'bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-500' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                          }`}
                      >
                        {invoice.dispute || invoice.isDisputed ? 'Disputed' : 'Report Dispute'}
                      </button>
                      <button
                        onClick={() => fetchDistributorData(invoice.customerId)}
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        View Distributor
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dispute Modal */}
        {isDisputeModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={() => setIsDisputeModalOpen(false)} />
              
              <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-8">
                <div className="absolute right-6 top-6">
                  <button
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="text-gray-400 hover:text-gray-500 transition-colors"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Report Dispute</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Please select a reason for disputing this invoice
                  </p>
                </div>

                <div className="space-y-6">
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                    />
                  )}

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setIsDisputeModalOpen(false)}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitDispute}
                      disabled={!disputeReason || (disputeReason === 'custom' && !customReason.trim())}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Dispute
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Distributor Modal */}
        {showDistModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Distributor Details</h3>
                <button
                  onClick={() => setShowDistModal(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {distLoading && (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              )}

              {distError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <div className="flex items-center gap-3 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-medium">{distError}</span>
                  </div>
                </div>
              )}

              {distData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Pharmacy Name</label>
                      <p className="mt-2 text-sm font-medium text-gray-900">{distData.pharmacy_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="mt-2 text-sm font-medium text-gray-900">{distData.phone_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="mt-2 text-sm font-medium text-gray-900">{distData.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">DL Code</label>
                      <p className="mt-2 text-sm font-medium text-gray-900">{distData.dl_code}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmaReport;