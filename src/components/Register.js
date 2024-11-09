import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { config } from '../config';

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
        expiry_date:''
    });

    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { pharmacy_name, email, phone_number, dl_code, gstno, address, password, confirmPassword, user_type,expiry_date } = formData;

        const requiredFields = user_type === 'distributor' 
            ? [pharmacy_name, email, phone_number, dl_code, gstno, address, password]
            : [pharmacy_name, email, phone_number, dl_code, address, password];

        if (requiredFields.some(field => !field)) {
            alert("All fields are mandatory!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
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

            if (response.ok) {
                console.log('Registration successful:', data);
                alert("Registration successful!");
                navigate('/login'); 
                if (onRegistrationSuccess) {
                    onRegistrationSuccess();
                }
            } else {
                console.error('Registration failed:', data.message);
                alert(`Registration failed: ${data.message}`);
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
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1565C0] focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#1565C0] to-[#1976D2] text-white py-3 px-4 rounded-lg font-semibold shadow-lg hover:from-[#1976D2] hover:to-[#1565C0] focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:ring-offset-2 transform transition-all hover:scale-[1.02] mt-6"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;