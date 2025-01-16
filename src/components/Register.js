import React, { useState,useCallback,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { config } from '../config';
import { Eye, EyeOff } from 'lucide-react';
export const Register = ({ onRegistrationSuccess }) => {
    const [formData, setFormData] = useState({
        pharmacy_name: '',
        email: '',
        phone_number: '',
        dl_code: '',
        gstno: '',
        address: '',
        password: '',
        confirmPassword: '',
        user_type: 'pharmacy',
        expiry_date:'',
        distributor_types: {
            pharma_ethical: false,
            generic_general: false,
            surgicals: false,
            pcd: false
        }
    });
    const [license, setLicenseNo] = useState('');
    const [pharmacyData, setPharmacyData] = useState(0);
    const [suggestionList, setSuggestionList] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
    const navigate = useNavigate(); 
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          timeoutId = setTimeout(() => {
            func(...args);
          }, delay);
        };
      };
    
      // Fetch pharmacy suggestions
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
          const response = await fetch(
            `${config.API_HOST}/api/user/getPharmaCentalData?licenseNo=${license2}`,
            {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Accept': 'application/json',
              }
            }
          );
          
          const result = await response.json();
    
          if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch pharmacy suggestions');
          }
    
          if (result.data && result.data.length > 0) {
            console.log(result.data,"result------")
            setSuggestionList(result.data);
            setShowSuggestions(true);
          } else {
            setSuggestionList([]);
            setShowSuggestions(false);
          }
        } catch (err) {
          console.error('Error fetching pharmacy suggestions:', err);
          setSuggestionList([]);
          setShowSuggestions(false);
        }
      }, []);
    
      // Create a debounced version of fetchPharmacySuggestions
      const debouncedFetchSuggestions = useCallback(
        debounce(fetchPharmacySuggestions, 300), // 300ms delay
        [fetchPharmacySuggestions]
      );
    
      // Handle input change
      useEffect(() => {
        if (formData.pharmacy_name.trim() && !hasSelectedSuggestion) {
            debouncedFetchSuggestions(formData.pharmacy_name);
        } else {
            setSuggestionList([]);
            setShowSuggestions(false);
        }
    }, [formData.pharmacy_name, debouncedFetchSuggestions, hasSelectedSuggestion]);

    
    const handleSuggestionSelect = (selectedPharmacy) => {
        const convertToValidDate = (dateValue) => {
            if (typeof dateValue === 'string' && dateValue.includes('-')) {
                const [day, month, year] = dateValue.split('-');
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            
            if (!isNaN(parseFloat(dateValue))) {
                const excelDate = parseFloat(dateValue);
                const days = Math.floor(excelDate);
                const jsDate = new Date(1899, 11, 30);
                jsDate.setDate(jsDate.getDate() + days);
                const year = jsDate.getFullYear();
                const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
                const day = jsDate.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            return '';
        };

        console.log('Original Date:', selectedPharmacy.ExpDate);
        const convertedDate = convertToValidDate(selectedPharmacy.ExpDate || '');
        console.log('Converted Date:', convertedDate);

        setFormData(prevData => ({
            ...prevData,
            pharmacy_name: selectedPharmacy.FirmName,
            dl_code: selectedPharmacy.LicenceNumber,
            address: selectedPharmacy.Address,
            expiry_date: convertedDate
        }));
        
        // Set the flag to indicate a suggestion has been selected
        setHasSelectedSuggestion(true);
        setSuggestionList([]);
        setShowSuggestions(false);
    };

    // Modified handleChange
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Reset hasSelectedSuggestion when pharmacy_name is changed manually
        if (name === 'pharmacy_name') {
            setHasSelectedSuggestion(false);
            setFormData({
                ...formData,
                [name]: value.toUpperCase(),
            });
        } 
        else if (name === 'dl_code') {
            setFormData({
                ...formData,
                [name]: value.toUpperCase(),
            });
        } 
        else if (name === 'expiry_date') {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };
    const handlesuggession =()=>{
        setShowSuggestions(false)
    }
    const handleDistributorTypeChange = (type) => {
        setFormData({
            ...formData,
            distributor_types: {
                ...formData.distributor_types,
                [type]: !formData.distributor_types[type]
            }
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const { pharmacy_name, email, phone_number, dl_code, gstno, address, password, confirmPassword, user_type,expiry_date,distributor_types } = formData;

        const requiredFields = user_type === 'distributor' 
            ? [pharmacy_name, phone_number, dl_code, gstno, address, password,expiry_date]
            : [pharmacy_name, phone_number, dl_code, address, password,expiry_date];

        if (requiredFields.some(field => !field)) {
            setIsLoading(false);
            alert("All fields are mandatory!");
            return;
        }

        if (password !== confirmPassword) {
            setIsLoading(false);
            alert("Passwords do not match!");
            return;
        }
        if (user_type === 'distributor' && !Object.values(distributor_types).some(value => value)) {
            setIsLoading(false);
            alert("Please select at least one distributor type!");
            return;
        }
        try {
            const endpoint = user_type === 'pharmacy' 
                ? `${config.API_HOST}/api/user/Pharmacyregister`
                : `${config.API_HOST}/api/user/Distributorregister`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            setIsLoading(false);
            const fullPhoneNumber = `91${formData.phone_number.trim()}`;
            if (response.ok) {
                 const smsResult = await fetch(`${config.API_HOST}/api/user/sendSMS`, {
                                               method: 'POST',
                                               headers: { 'Content-Type': 'application/json' },
                                               body: JSON.stringify({
                                                 phone: fullPhoneNumber,
                                                 message: `Welcome to MedScore – Your Account is Ready! Dear ${formData.pharmacy_name}, Welcome to MedScore! Your account has been successfully created. User ID: ${formData.dl_code} Log in to start exploring our credit risk solutions designed specifically for the pharmaceutical industry. For security, please change your password upon first login. Thank you for joining MedScore. Best Regards, The MedScore Team`
                                               })
                                             });
                                       
                                             if (!smsResult.ok) {
                                               
                                               throw new Error('Failed to send SMS');
                                             }

                console.log('Registration successful:', data);
                alert("Registration successful!");
                navigate('/login'); 
               
            } else {
                console.error('Registration failed:', data.message);
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#4e98cc] to-[#494da4] p-4">
            <div className="w-full max-w-md bg-white/90  rounded-2xl shadow-xl p-14 transform transition-all hover:scale-[1.01]">
                <div className="flex flex-col items-center mb-6">
                    <img 
                        src="/medscore.png" 
                        alt="Medscore Logo" 
                        className="w-[180px] h-auto object-contain mx-auto mb-4 drop-shadow-md transform transition-all duration-300 hover:scale-105"
                    />
                    <p className="text-[#1565C0] text-sm font-medium mt-2">Credit Simplified, Amplified</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 bg-white/80 p-6 rounded-xl">
                    <div className="flex justify-center space-x-6 mb-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="user_type"
                                value="pharmacy"
                                checked={formData.user_type === 'pharmacy'}
                                onChange={handleChange}
                                className="form-radio text-[#1565C0] w-4 h-4"
                            />
                          {showSuggestions && suggestionList.length > 0 && (
    <div className="absolute z-50 w-full mb-44  bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        {suggestionList.map((suggestion, index) => (
            <div 
                key={index} 
                onClick={() => handleSuggestionSelect(suggestion)}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-200"
            >
                <div className="font-semibold text-sm">
                    {suggestion.FirmName || suggestion.firm_name || suggestion.pharmacy_name}
                </div>
                <div className="text-xs text-gray-600">
                    License: {suggestion.LicenceNumber || suggestion.license_number}
                </div>
                <div className="text-xs text-gray-600">
                    Address: {suggestion.Address || suggestion.address}
                </div>
                
            </div>
            
        ))}
        <button onClick={()=>handlesuggession()} className='text-xl w-full hover:bg-gray-100 align-middle justify-between font-serif'>
                      Others
                </button>
    </div>
)}
                            <span className="text-gray-700 font-medium">Pharmacy</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="user_type"
                                value="distributor"
                                checked={formData.user_type === 'distributor'}
                                onChange={handleChange}
                                className="form-radio text-[#1565C0] w-4 h-4"
                            />
                            <span className="text-gray-700 font-medium">Distributor</span>
                        </label>
                    </div>
                    
                    <div className="space-y-4">
                    <div className="relative">
            <input
                type="text"
                name="pharmacy_name"
                placeholder={formData.user_type === 'pharmacy' ? "Pharmacy Name" : "Distributor Name"}
                value={formData.pharmacy_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                required
            />
            <small className="absolute text-xs text-gray-500 mt-1">* Will be automatically capitalized</small>
        </div>
        {formData.user_type === 'distributor' && (
                            <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Distributor Type 
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.distributor_types.pharma_ethical}
                                            onChange={() => handleDistributorTypeChange('pharma_ethical')}
                                            className="rounded text-[#1565C0] focus:ring-[#1565C0]"
                                        />
                                        <span className="text-sm text-gray-700">Pharma - Ethical</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.distributor_types.generic_general}
                                            onChange={() => handleDistributorTypeChange('generic_general')}
                                            className="rounded text-[#1565C0] focus:ring-[#1565C0]"
                                        />
                                        <span className="text-sm text-gray-700">Generic, General</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.distributor_types.surgicals}
                                            onChange={() => handleDistributorTypeChange('surgicals')}
                                            className="rounded text-[#1565C0] focus:ring-[#1565C0]"
                                        />
                                        <span className="text-sm text-gray-700">Surgicals</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.distributor_types.pcd}
                                            onChange={() => handleDistributorTypeChange('pcd')}
                                            className="rounded text-[#1565C0] focus:ring-[#1565C0]"
                                        />
                                        <span className="text-sm text-gray-700">PCD</span>
                                    </label>
                                </div>
                            </div>
                        )}
                        <input
                            type="email"
                            name="email"
                            placeholder="Owner`s Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                           
                        />
                        <input
                            type="text"
                            name="phone_number"
                            placeholder="Owner`s Phone Number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                        <input
                            type="text"
                            name="dl_code"
                            placeholder="Drug License No"
                            value={formData.dl_code}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                         <small className="absolute text-xs text-gray-500 mt-1">* Will be automatically capitalized</small>
                        {formData.user_type === 'distributor' && (
                            <input
                                type="text"
                                name="gstno"
                                placeholder="GST Number"
                                value={formData.gstno}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                                required
                            />
                        )}
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                          <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>DL Expiry Date</span>
              </label>
              <input
    type="date"
    name="expiry_date"
    value={formData.expiry_date}
    onChange={handleChange}
    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    required
/>
            </div>
            <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        >
                            {!showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                        
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#1565C0] to-[#1976D2] text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:from-[#1976D2] hover:to-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:ring-offset-2 transform transition-all hover:scale-[1.02] mt-6"
                    >
                        {isLoading ? (
                <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Registering...
                </div>
            ) : (
                'Register'
            )}
                       
                    </button>
                    <button
                         onClick={()=>{navigate("/")}}
                        type="submit"
                        className='w-28 h-10 bg-slate-500 text-white font-bold hover:bg-slate-800 rounded-s-sm shadow-md'
                    >
                      Home
                       
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;