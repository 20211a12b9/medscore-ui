import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { config } from '../config';

export const Addcustomer = () => {
    const [formData, setFormData] = useState({
        pharmacy_name: '',
        email: '',
        phone_number: '',
        dl_code: '',
        address: '',
        password:'123',
        user_type: 'pharmacy',
        expiry_date:''
    });

    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for pharmacy_name and dl_code
        if (name === 'pharmacy_name') {
            const words = value.trim().split(' ');
            const capitalizedWords = words.map(word => 
                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            );
            setFormData({
                ...formData,
                [name]: capitalizedWords.join(' '),
            });
        } 
        else if (name === 'dl_code') {
            setFormData({
                ...formData,
                [name]: value.trim().toUpperCase(),
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

       if(!pharmacy_name || !email || !phone_number || !dl_code || !address )
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
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.01]">
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
                        <input
                            type="email"
                            name="email"
                            placeholder="Owner`s Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
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