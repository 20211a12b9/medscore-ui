import React, { useState,useCallback,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { config } from '../config';
import { Navbar } from './Navbar';

export const Addcustomer = () => {
    const [formData, setFormData] = useState({
        pharmacy_name: '',
        email: '',
        phone_number: '',
        dl_code: '',
        address: '',
        password:'123',
        user_type: 'pharmacy',
        expiry_date:'',
    });

    const [license, setLicenseNo] = useState('');
    const [pharmacyData, setPharmacyData] = useState(0);
    const [suggestionList, setSuggestionList] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
        if (formData.pharmacy_name.trim()) {
          debouncedFetchSuggestions(formData.pharmacy_name);
        } else {
          // Clear everything when search is empty
          setSuggestionList([]);
          setShowSuggestions(false);
         
        }
      }, [formData.pharmacy_name, debouncedFetchSuggestions]);
    
      // Handle suggestion selection
      const handleSuggestionSelect = (selectedPharmacy) => {
        // Robust date conversion function
        const convertToValidDate = (dateValue) => {
            // If it's already in DD-MM-YYYY format
            if (typeof dateValue === 'string' && dateValue.includes('-')) {
                // Split the date and rearrange to YYYY-MM-DD
                const [day, month, year] = dateValue.split('-');
                // Ensure month is padded correctly
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            
            // If it's an Excel date number
            if (!isNaN(parseFloat(dateValue))) {
                // Convert Excel date
                const excelDate = parseFloat(dateValue);
                const days = Math.floor(excelDate);
                
                // Create a new Date object
                const jsDate = new Date(1899, 11, 30); // Excel's epoch start
                jsDate.setDate(jsDate.getDate() + days);
                
                // Format as YYYY-MM-DD
                const year = jsDate.getFullYear();
                const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
                const day = jsDate.getDate().toString().padStart(2, '0');
                
                return `${year}-${month}-${day}`;
            }
            
            // If no valid date is found, return empty string
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
        
        // Clear suggestions
        setSuggestionList([]);
        setShowSuggestions(false);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Existing cases for pharmacy_name and dl_code
        if (name === 'pharmacy_name') {
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
        // New case for expiry_date
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { pharmacy_name, email, phone_number, dl_code, address, user_type,expiry_date } = formData;

       if(!pharmacy_name  || !phone_number || !dl_code || !address )
       {
        alert("All fields are mandatory!");
            return;
       }

       
       const dist_pharmacy_name = localStorage.getItem('pharmacy_name');
        try {
            const endpoint = user_type === 'pharmacy' 
                ? `${config.API_HOST}/api/user/Pharmacyregister`
                : `${config.API_HOST}/api/user/Distributorregister`;

            const response = await fetch(`${config.API_HOST}/api/user/Pharmacyregister`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            const fullPhoneNumber = `91${formData.phone_number.trim()}`;
            if (response.ok) {
               
                 await fetch(`https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=uewziuRKDUWctgdrHdXm5g&senderid=MEDSCR&channel=2&DCS=0&flashsms=0&number=${fullPhoneNumber}&text=Hello  ${formData.pharmacy_name}, your information has been successfully added to MedScore by distributor ${''} . To access your account, please go to medscore.in Select ‘Forgot Password’ and use your drug license number as the username to reset your password and log in. Best regards, MedScore&route=1`,{mode: "no-cors"});

                alert("Customer details added successfully!");
                
                const pharmaId=data.user._id;
                console.log("pharcy id",pharmaId)
                const customerId = localStorage.getItem('userId');
                const response = await fetch(`${config.API_HOST}/api/user/linkPharma/${customerId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ pharmaId }),
                });
            
                const result = await response.json();
            
                if (!response.ok) {
                  throw new Error(result.message || 'Failed to link pharmacy');
                }
                console.log("linked")
                navigate('/DistributorHomePage');
            } else {
                console.error('failed:', data.message);
                alert(` failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] p-4">
            <div className="fixed top-0 left-0 w-full z-50">
  <Navbar />
</div>
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 transform transition-all hover:scale-[1.01] mt-10">
                <div className="flex flex-col items-center mb-6">
                    <img 
                        src="/medscorelogo.jpeg" 
                        alt="Medscore Logo" 
                        className="w-[180px] h-auto object-contain mx-auto mb-4 drop-shadow-md transform transition-all duration-300 hover:scale-105"
                    />
                    <p className="text-[#1565C0] text-sm font-medium mt-2">Credit Simplified, Amplified</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 bg-white/80 p-6 rounded-xl">
                   
                    
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="pharmacy_name"
                            placeholder={formData.user_type === 'pharmacy' ? "Pharmacy Name" : "Distributor Name"}
                            value={formData.pharmacy_name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                           {showSuggestions && suggestionList.length > 0 && (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
    </div>
)}
                         <small className="absolute text-xs text-gray-500 mt-1">* Will be automatically capitalized</small>
                        {/* <input
                            type="email"
                            name="email"
                            placeholder="Owner`s Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                           
                        /> */}
                        
                        <input
                            type="text"
                            name="phone_number"
                            placeholder="Owner Phone Number"
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
                        
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#1565C0] to-[#1976D2] text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:from-[#1976D2] hover:to-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:ring-offset-2 transform transition-all hover:scale-[1.02] mt-6"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Addcustomer;