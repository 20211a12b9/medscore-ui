import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, DollarSign, FileText, Clock ,Search,Building2,Phone,MapPin} from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

export const Addcustomer = () => {
    const [formData, setFormData] = useState({
        pharmacy_name: '',
        email: '',
        phone_number: '',
        dl_code: '',
        address: '',
        password: '123',
        user_type: 'pharmacy',
        expiry_date: '',
    });
    const [showForm, setShowForm] = useState(false);
    const [state,setState]=useState('');
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [suggestionList, setSuggestionList] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const fetchPharmacySuggestions = useCallback(async (searchTerm) => {
        if (hasSelectedSuggestion) {
            return;
        }
        if (!searchTerm.trim()) {
            setSuggestionList([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const license2 = searchTerm.trim().toUpperCase();
            let endpoint;
           
            console.log(state,"state")
            if(state==='Maharashtra')
            {
                endpoint='getMHCentalData'
            }
            else if(state==='Telangana'){
              endpoint='getPharmaCentalData'
            }
            else {
              console.log('Unsupported state:', state);
              return; // Exit if state is not supported
          }
            const response = await fetch(
                `${config.API_HOST}/api/user/${endpoint}?licenseNo=${license2}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: { 'Accept': 'application/json' }
                }
            );

            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
             console.log('result.data',result.data)
            setSuggestionList(result.data || []);
            setShowSuggestions(Boolean(result.data?.length));
        } catch (err) {
            console.error('Error:', err);
            setSuggestionList([]);
            setShowSuggestions(false);
        }
    }, [hasSelectedSuggestion, isManualEntry,state]);

    const debouncedFetchSuggestions = useCallback(
        debounce(fetchPharmacySuggestions, 300),
        [fetchPharmacySuggestions]
    );

    useEffect(() => {
        if (formData.pharmacy_name.trim() && !hasSelectedSuggestion && !isManualEntry) {
            debouncedFetchSuggestions(formData.pharmacy_name);
        } else {
            setSuggestionList([]);
            setShowSuggestions(false);
        }
    }, [formData.pharmacy_name, debouncedFetchSuggestions, hasSelectedSuggestion, isManualEntry]);

    const handleSuggestionSelect = (selectedPharmacy) => {
        const convertToValidDate = (dateValue) => {
            if (typeof dateValue === 'string' && dateValue.includes('-')) {
                const [day, month, year] = dateValue.split('-');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            if (!isNaN(parseFloat(dateValue))) {
                const excelDate = parseFloat(dateValue);
                const jsDate = new Date(1899, 11, 30);
                jsDate.setDate(jsDate.getDate() + Math.floor(excelDate));
                return jsDate.toISOString().split('T')[0];
            }
            return '';
        };

        setFormData(prev => ({
            ...prev,
            pharmacy_name: selectedPharmacy.FirmName ||selectedPharmacy.Firm_Name,
            dl_code: selectedPharmacy.LicenceNumber,
            address: selectedPharmacy.Address,
            expiry_date: convertToValidDate(selectedPharmacy.ExpDate || selectedPharmacy.ExpiryDate || '')
        }));

        setHasSelectedSuggestion(true);
        setSuggestionList([]);
        setShowSuggestions(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'pharmacy_name' || name === 'dl_code') {
            setFormData(prev => ({
                ...prev,
                [name]: value.toUpperCase(),
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }

        if (name === 'pharmacy_name' && !isManualEntry) {
            setHasSelectedSuggestion(false);
        }
    };
    const handleState = (e) => {
        const newState = e.target.value;
        setState(newState);
        setShowForm(true);
        
        // Reset suggestion-related state when state changes
        setSuggestionList([]);
        setShowSuggestions(false);
        setHasSelectedSuggestion(false);
    };
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    const toggleManualEntry = () => {
        setIsManualEntry(!isManualEntry);
        if (!isManualEntry) {
            setHasSelectedSuggestion(false);
            setSuggestionList([]);
            setShowSuggestions(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { pharmacy_name, phone_number, dl_code, address, expiry_date } = formData;

        if (!pharmacy_name || !phone_number || !dl_code || !address) {
            alert("All fields are mandatory!");
            return;
        }

        try {
            const response = await fetch(`${config.API_HOST}/api/user/Pharmacyregister`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (response.ok) {
                const fullPhoneNumber = `91${formData.phone_number.trim()}`;
                console.log("full phone numebr",fullPhoneNumber)
               const smsResult = await fetch(`${config.API_HOST}/api/user/sendSMS`, {
                               method: 'POST',
                               headers: { 'Content-Type': 'application/json' },
                               body: JSON.stringify({
                                 phone: fullPhoneNumber,
                                 message: `Hello ${formData.pharmacy_name} , your information has been successfully added to MedScore by distributor . To access your account, please go to medscore.in and Select Forgot Password then use your drug license number as the username to reset your password and login. Best regards, MedScore`
                                  
                               })
                             });
                       
                             if (!smsResult.ok) {
                               
                               throw new Error('Failed to send SMS');
                             }

                const customerId = localStorage.getItem('userId');
                await fetch(`${config.API_HOST}/api/user/linkPharma/${customerId}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pharmaId: data.user._id }),
                });

                alert("Customer details added successfully!");
                navigate('/DistributorHomePage');
            } else {
                alert(`Failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        }
        finally{
            setIsLoading(false);
        }
    };
    const handlesuggession =()=>{
        setShowSuggestions(false)
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <Navbar />
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <img 
                                src="img\logo\black-logo.png" 
                                alt="Medscore Logo" 
                                className="w-40 h-auto mx-auto mb-4"
                            />
                            <h2 className="text-2xl font-bold text-gray-800">Add New Pharmacy</h2>
                            <p className="text-gray-600 mt-2">Register a new pharmacy in the MedScore network</p>
                        </div>

                        {/* <div className="mb-6">
                            <button
                                onClick={() => setIsManualEntry(!isManualEntry)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                {isManualEntry ? <Search className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                                {isManualEntry ? "Switch to Search Mode" : "Switch to Manual Entry"}
                            </button>
                        </div> */}
 <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select State *
                    </label>
                    <select
                        name="state"
                        value={state}
                        onChange={handleState}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                        required
                    >
                        <option value="">Select a state</option>
                        {indianStates.map((state, index) => (
                            <option key={index} value={state}>
                                {state}
                            </option>
                        ))}
                    </select>
                </div>
                        {showForm &&(
                            <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative">
                                <div className="flex items-center border-2 rounded-lg focus-within:border-indigo-500 transition-colors">
                                    <Building2 className="w-5 h-5 text-gray-400 ml-3" />
                                    <input
                                        type="text"
                                        name="pharmacy_name"
                                        placeholder="Pharmacy Name"
                                        value={formData.pharmacy_name}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-transparent outline-none"
                                        required
                                    />
                                </div>

                                {!isManualEntry && showSuggestions && suggestionList.length > 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
                                        {suggestionList.map((suggestion, index) => (
                                            <div 
                                                key={index}
                                                onClick={() => handleSuggestionSelect(suggestion)}
                                                className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                                            >
                                                <div className="font-medium text-gray-800">{suggestion.FirmName || suggestion.Firm_Name}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    <div>License: {suggestion.LicenceNumber}</div>
                                                    <div className="truncate">Address: {suggestion.Address}</div>
                                                </div>
                                            </div>
                                        ))}
                                         <button onClick={()=>handlesuggession()} className='text-xl w-full hover:bg-gray-100 align-middle justify-between font-serif'>
                      Others
                </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center border-2 rounded-lg focus-within:border-indigo-500 transition-colors">
                                <Phone className="w-5 h-5 text-gray-400 ml-3" />
                                <input
                                    type="text"
                                    name="phone_number"
                                    placeholder="Owner Phone Number"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-transparent outline-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center border-2 rounded-lg focus-within:border-indigo-500 transition-colors">
                                <FileText className="w-5 h-5 text-gray-400 ml-3" />
                                <input
                                    type="text"
                                    name="dl_code"
                                    placeholder="Drug License No"
                                    value={formData.dl_code}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-transparent outline-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center border-2 rounded-lg focus-within:border-indigo-500 transition-colors">
                                <MapPin className="w-5 h-5 text-gray-400 ml-3" />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-transparent outline-none"
                                    required
                                />
                            </div>

                            <div className="flex items-center border-2 rounded-lg focus-within:border-indigo-500 transition-colors">
                                <Calendar className="w-5 h-5 text-gray-400 ml-3" />
                                <input
                                    type="date"
                                    name="expiry_date"
                                    value={formData.expiry_date}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-transparent outline-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-4 px-6 rounded-lg font-medium shadow-md hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    "Register Pharmacy"
                                )}
                            </button>
                        </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addcustomer;