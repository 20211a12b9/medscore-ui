import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Star, Shield, Bell, BarChart, Database, Headphones } from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram, Facebook, X } from 'lucide-react';
import { HomeNavbar } from './HomeNavbar';

const TermsConditions = () => {
  const navigate = useNavigate();
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 w-full z-50">
      <HomeNavbar/>
      </div>
    

      {/* Privacy Policy Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-md rounded-lg p-8 mt-10">
          <h1 className="text-2xl font-bold mb-4">MedScore Terms & Conditions</h1>
          <p className="text-gray-600 mb-8">
          Welcome to MedScore! By accessing our platform, you agree to these Terms and Conditions. Please read carefully          
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">1. Account Registration</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                Users must provide accurate information during registration. Unauthorized access or misuse may result in account suspension.
                </li>
               
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">2. Platform Usage</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  <strong>Permitted Use:</strong>: MedScore is intended for pharmaceutical credit scoring purposes only.
                </li>
                <li>
                  <strong>User Responsibility</strong>: Users are responsible for maintaining confidentiality and security of login details.
                </li>
                
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">3. Service Fees</h2>
              <p>Access to specific services, such as detailed credit reports, may incur fees as outlined in our pricing plan.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">4.Credit Score Information
              </h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                MedScore provides credit scores and related data as decision-support tools. Users should verify data relevance independently.                </li>
                
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">5.Dispute Resolution</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                Distributors may report and manage credit disputes. MedScore serves as a platform for dispute logging but does not mediate directly.                </li>
                
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
              <p>MedScore is not liable for business decisions based on credit data, nor for delays or inaccuracies in data.</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">7. Termination</h2>
              <p>Users may terminate accounts at any time. MedScore reserves the right to suspend accounts for policy violations.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#91C4E1] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3 text-[#282c56]">Follow Us</h3>
            <div className="flex gap-2 ml-28">
              <a
                href="https://www.instagram.com/medscore/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <Instagram className="w-7 h-7" />
              </a>
              <a
                href="https://twitter.com/medscore"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <X className="w-7 h-7" />
              </a>
              <a
                href="https://www.facebook.com/medscore"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <Facebook className="w-7 h-7" />
              </a>
              <a
                href="https://www.facebook.com/medscore"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500 transition-colors"
              >
                <Linkedin className="w-7 h-7" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#282c56]">Contact Us</h3>
            <div className="flex flex-col gap-2">
              <a href="mailto:support@medscore.in" className="text-white-500 hover:text-blue-700 transition-colors">
                <i className="fas fa-envelope mr-2"></i> support@medscore.in
              </a>
              <a href="tel:04046025805" className="text-white-500 hover:text-blue-700 transition-colors">
                <i className="fas fa-phone mr-2"></i> 04046025805
              </a>
              <div>
                <i className="fas fa-map-marker-alt mr-2"></i> Dilshuknagar, Hyderabad-500059
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#282c56]">Quick Links</h3>
            <div className="flex flex-row space-x-7 ml-10">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigate('/')}
                className="hover:text-blue-500 transition-colors "
              >
                Home
              </button>
              <button
                onClick={() => navigate('/')}
                className="hover:text-blue-500 transition-colors "
              >
                About Us
              </button>
              <button
                onClick={() => navigate('/')}
                className="hover:text-blue-500 transition-colors "
              >
                Features
              </button>
              <button
                onClick={() => navigate('/')}
                className="hover:text-blue-500 transition-colors "
              ></button>
             
              <button 
                onClick={() => navigate('/')}
                className="hover:text-blue-500 transition-colors "
              >
                For Distributors
              </button>
             
          </div>
          <div className="flex flex-col space-y-2">
          <button 
                onClick={() => navigate('/')}
                className="hover:text-blue-500 transition-colors "
              >
                Blogs
              </button>
              <button 
                onClick={() => navigate('/')}
                className="hover:text-blue-500 transition-colors "
              >
                For Medical Shops
              </button>
            
              <button 
      onClick={() => navigate('/PrivacyPolicy')}
      className="hover:text-blue-500 transition-colors"
    >
      Privacy Policy
    </button>
              <button 
                onClick={() => navigate('/TermsConditions')}
                className="hover:text-blue-500 transition-colors "
              >
                Terms & Conditions

              </button>
          </div>
            </div >
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="ttext-[#282c56]">© 2024 MedScore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsConditions;