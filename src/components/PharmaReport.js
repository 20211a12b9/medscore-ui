import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Search, X, User, FileText, Calendar, DollarSign, Clock,Timer } from 'lucide-react';
import { config } from '../config';
import { PharmaNavbar } from './PharmaNavbar';


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
        const sortedInvoices = result.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setInvoices(sortedInvoices);
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
    if (!selectedInvoice) {
        alert('No invoice selected');
        return;
    }

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

        // Prepare the final reason for dispute
        const finalReason = disputeReason === 'custom' ? customReason.trim() : 
            disputeReasons.find(r => r.value === disputeReason)?.label;

        const response = await fetch(`${config.API_HOST}/api/user/disputebypharma`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                reasonforDispute: finalReason,
                pharmadrugliseanceno: selectedInvoice.pharmadrugliseanceno,
                invoice: selectedInvoice.invoice,
                customerId: selectedInvoice.customerId,
            }),
        });

        // Handle non-OK HTTP responses
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit dispute');
        }

        const result = await response.json();

        // Check success flag from the API
        if (result.success) {
            setInvoices(prevInvoices =>
                prevInvoices.map(inv =>
                    inv._id === selectedInvoice._id
                        ? { ...inv, isDisputed: true }
                        : inv
                )
            );

            alert(result.message || 'Dispute submitted successfully!');
            setIsDisputeModalOpen(false);
            setDisputeReason('');
            setCustomReason('');
            setSelectedInvoice(null);
        } else {
            alert(result.message || 'Dispute already exists for this invoice');
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
  const StatusBadge = ({ status }) => {
    const styles = {
      accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200"
    };

    const getStyle = () => {
      if (status.accept) return styles.accepted;
      if (status.reject) return styles.rejected;
      return styles.pending;
    };

    const getLabel = () => {
      if (status.accept) return "Accepted";
      if (status.reject) return "Rejected";
      return "Pending";
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStyle()}`}>
        {getLabel()}
      </span>
    );
  };

  const StatCard = ({ icon: Icon, label, value,color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-cyan-100">
    <div className="fixed top-0 left-0 w-full z-50">
      <PharmaNavbar />
    </div>

    <div className="pt-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Defaults Dashboard</h1>
          <p className="mt-2 text-gray-600">Track and manage your pharmacy defaults</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={FileText}
            label="Total Report Defaults"
            value={invoices.length}
          />
          <StatCard 
            icon={AlertCircle}
            label="Cleared Defaults"
            value={invoices.filter(i => i.accept ).length}
          />
          <StatCard 
            icon={AlertCircle}
            color='red'
            label="Rejected Defaults"
            value={invoices.filter(i => i.reject ).length}
          />
          <StatCard 
            icon={AlertCircle}
            label="Disputed Defaults"
            value={invoices.filter(i => i.dispute ).length}
          />
        </div>

        {/* Alert Notice */}
        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-amber-800">Important Notice</h3>
              <p className="mt-1 text-amber-700">
                If your dispute has been rejected, please reach out to your distributor directly to resolve the matter. 
                Open communication can help resolve most payment-related issues efficiently.
              </p>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{invoice.invoice}</p>
                        <p className="text-xs text-gray-500 mt-1">#{invoice.serialNo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(invoice.invoiceDate)}</p>
                        <p className="text-xs text-gray-500 mt-1">Issued: {formatDate(invoice.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</p>
                        <p className="text-xs text-red-500 mt-1">{invoice.delayDays} days delay</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">₹{invoice.invoiceAmount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={invoice} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDisputeClick(invoice)}
                          disabled={invoice.dispute || invoice.isDisputed}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed inline-flex items-center gap-2
                            ${invoice.dispute || invoice.isDisputed
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                            }`}
                        >
                          {invoice.dispute || invoice.isDisputed ? 'Disputed' : 'Report Issue'}
                        </button>
                        {invoice.reject && (
                          <button
                            onClick={() => fetchDistributorData(invoice.customerId)}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 inline-flex items-center gap-2"
                          >
                            <User className="w-4 h-4" />
                            Contact
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
   
  );
};

export default PharmaReport;