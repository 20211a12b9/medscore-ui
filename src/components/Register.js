import React, { useState,useCallback,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { config } from '../config';
import { Eye, EyeOff } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";

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
        user_type: '',
        expiry_date:'',
        distributor_types: {
            pharma_ethical: false,
            generic_general: false,
            surgicals: false,
            pcd: false
        }
    });
    const [location, setLocation] = useState(null);
  const [address, setAddress] = useState({
    city:'',
    state:'',
    country:''
  });
  const [captchaValue, setCaptchaValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [state,setState]=useState('');
    const [license, setLicenseNo] = useState('');
    const [pharmacyData, setPharmacyData] = useState(0);
    const [suggestionList, setSuggestionList] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
    const [showForm2, setShowForm2] = useState(false); 
    const navigate = useNavigate(); 

//     useEffect(()=>{
//         const getLocation = () => {
//             setLoading(true);
//             setError(null);
        
//             if (!navigator.geolocation) {
//               setError('Geolocation is not supported by your browser');
//               setLoading(false);
//               return;
//             }
        
//             navigator.geolocation.getCurrentPosition(
//               async (position) => {
//                 const { latitude, longitude } = position.coords;
//                 setLocation({ latitude, longitude });
//                 await fetchAddress(latitude, longitude); // Fetch location name
//                 setLoading(false);
//               },
//               (error) => {
//                 setError('Unable to retrieve your location');
//                 setLoading(false);
//               }
//             );
//           };
//           getLocation()
//     },[])
    
//       const fetchAddress = async (latitude, longitude) => {
//         try {
//           const apiKey = '385810ebbd724da68526edb9632bdf35';
//           const response = await fetch(
//             `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`
//           );
//           const data = await response.json();
    
//           if (data.results && data.results.length > 0) {
//             console.log("adress",data.results)
//             const match = address.match(/(.+),\s(.+),\s([^-,]+)\s-\s\d+,\s([^,]+),\s(.+)/);

// if (match) {
//   const city = match[3].trim();  // Hyderabad
//   const state = match[4].trim(); // Telangana
//   const country = match[5].trim(); // India
//   setAddress({
//     city,
//     state,
//     country
// })
//   console.log(`City: ${city}, State: ${state}, Country: ${country}`);
// }
//             const locationName = data.results[0].formatted; // Get formatted address
  
//           } else {
//             setError('Unable to fetch address');
//           }
//         } catch (err) {
//           setError('Error fetching address');
//         }
//       };
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
      }, [state,hasSelectedSuggestion]);
    
      // Create a debounced version of fetchPharmacySuggestions
      const debouncedFetchSuggestions = useCallback(
        debounce(fetchPharmacySuggestions, 300), // 300ms delay
        [fetchPharmacySuggestions]
      );
    
      // Handle input change
      useEffect(() => {
        if (formData.pharmacy_name.trim() && !hasSelectedSuggestion && state) {
            debouncedFetchSuggestions(formData.pharmacy_name, state);
        } else {
            setSuggestionList([]);
            setShowSuggestions(false);
        }
    }, [formData.pharmacy_name, debouncedFetchSuggestions, hasSelectedSuggestion, state]);


    const handleCLear=()=>{
         setFormData(prevData => ({
            ...prevData,
            address: '',
            expiry_date: '',
            pharmacy_name: '',
            dl_code: ''
        }));

    }
    const handleCaptchaChange = (value) => {
        setCaptchaValue(value);
        if (error) setError('');
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
    const handleUserType = (e) => {
        const userType = e.target.value;
        setFormData(prevData => ({
            ...prevData,
            user_type: userType
        }));
        setShowForm2(true);
    };
    const indianStates = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
        "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
        "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
        "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
        "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Ladakh", "Lakshadweep", "Puducherry"
    ];
    const userTypes = [
        "distributor", "pharmacy"
        
    ];
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
        const convertedDate = convertToValidDate(selectedPharmacy.ExpDate || selectedPharmacy.ExpiryDate || '');
        console.log('Converted Date:', convertedDate);

        setFormData(prevData => ({
            ...prevData,
            pharmacy_name: selectedPharmacy.FirmName||selectedPharmacy.Firm_Name,
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
        if (!captchaValue) {
            setError('Please complete the CAPTCHA verification');
            setLoading(false);
            return;
          }
        const { pharmacy_name, email, phone_number, dl_code, gstno, address, password, confirmPassword, user_type,expiry_date,distributor_types } = formData;
        setFormData((prevData) => ({
            ...prevData,
            address: prevData.address + (state ? `, ${state}` : '')
        }));
        
        // console.log(formData.address,"address--",state)
        
        const requiredFields = user_type === 'distributor' 
            ? [pharmacy_name, phone_number, dl_code, address, password,expiry_date]
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
             const captchaResponse = await fetch(`${config.API_HOST}/api/user/recaptcha`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ captchaToken: captchaValue })
                  });
            
                  const captchaData = await captchaResponse.json();
                  
                  if (!captchaData.success) {
                    setError('CAPTCHA verification failed. Please try again.');
                    setLoading(false);
                    return;
                  }

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
                                                 message: `Welcome to MedScore Your Account is Ready! Dear ${formData.pharmacy_name}, Welcome to MedScore! Your account has been successfully created.User ID: ${formData.dl_code} Log in to start exploring our credit risk solutions designed specifically for the pharmaceutical industry. For security, please change your password upon first login. Thank you for joining MedScore. Best Regards, The MedScore Team`   
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
                        src="/medscore_newlogo.png" 
                        alt="Medscore Logo" 
                        className="w-[180px] h-auto object-contain mx-auto mb-4 drop-shadow-md transform transition-all duration-300 hover:scale-105"
                    />
                    <p className="text-[#1565C0] text-sm font-medium mt-2">Credit Simplified, Amplified</p>
                </div>
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
               { showForm && (
            //      <div className="flex justify-center space-x-6 mb-4">
            //      <label className="flex items-center space-x-2 cursor-pointer">
            //          <input
            //              type="radio"
            //              name="user_type"
            //              value="pharmacy"
            //              checked={formData.user_type === 'pharmacy'}
            //              onChange={handleChange}
            //              className="form-radio text-[#1565C0] w-4 h-4"
            //          />
                 
            //          <span className="text-gray-700 font-medium">Pharmacy</span>
            //      </label>
            //      <label className="flex items-center space-x-2 cursor-pointer">
            //          <input
            //              type="radio"
            //              name="user_type"
            //              value="distributor"
            //              checked={formData.user_type === 'distributor'}
            //              onChange={handleChange}
            //              className="form-radio text-[#1565C0] w-4 h-4"
            //          />
            //          <span className="text-gray-700 font-medium">Distributor</span>
            //      </label>
            //  </div>
            <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User Type *
            </label>
            <select
                name="user_type"
                value={formData.user_type}
                onChange={handleUserType}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                required
            >
                <option value="">Select a User Type</option>
                {userTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
               )}
              {showForm2 &&(
                  <form onSubmit={handleSubmit} className="space-y-5 bg-white/80 p-6 rounded-xl">
                     
  {showSuggestions && suggestionList.length > 0 && (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto top-[70px]">
        {suggestionList.map((suggestion, index) => (
            <div 
                key={index} 
                onClick={() => handleSuggestionSelect(suggestion)}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-200"
            >
                <div className="font-semibold text-sm">
                    {suggestion.FirmName || suggestion.firm_name || suggestion.pharmacy_name || suggestion.Firm_Name}
                </div>
                <div className="text-xs text-gray-600">
                    License: {suggestion.LicenceNumber || suggestion.LicenceNumber}
                </div>
                <div className="text-xs text-gray-600">
                    Address: {suggestion.Address || suggestion.address}
                </div>
            </div>
        ))}
        <button 
            onClick={() => handlesuggession()} 
            className="w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border-t border-gray-200 transition-colors duration-150"
        >
            Others
        </button>
    </div>
  )}
              
                  
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

                  <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
    {/* Register Button */}
    <div className="flex justify-center my-4">
              <ReCAPTCHA
                sitekey="6LfgT9IqAAAAANlJ6C4iT0udjmhYy7oauoXWuheq"
                onChange={handleCaptchaChange}
                theme="light"
                size="normal"
              />
            </div>
    <button
        type="submit"
        disabled={loading || !captchaValue}
        className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
          loading || !captchaValue
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg'
        }`}
    >
        
        {isLoading ? (
            <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                <span className="animate-pulse">Registering...</span>
            </div>
        ) : (
            <div className="flex items-center justify-center space-x-2">
                <span>Register</span>
                <svg 
                    className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                </svg>
            </div>
        )}
    </button>

    {/* Clear Button */}
    <button
        type="button"
        onClick={handleCLear}
        className="flex-1 min-w-[140px] bg-gradient-to-r from-gray-500 to-gray-600 text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 group"
    >
        <div className="flex items-center justify-center space-x-2">
            <svg 
                className="w-5 h-5 transform transition-transform group-hover:rotate-180" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
            </svg>
            <span>Clear All</span>
        </div>
    </button>

    {/* Home Button */}
    <button
        type="button"
        onClick={() => navigate("/")}
        className="flex-1 min-w-[140px] bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-4 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:from-indigo-700 hover:to-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 group"
    >
        <div className="flex items-center justify-center space-x-2">
            <svg 
                className="w-5 h-5 transform transition-transform group-hover:-translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                />
            </svg>
            <span>Home</span>
        </div>
    </button>
</div>
                  
              </form>
              )}
            </div>
        </div>
    );
};

export default Register;