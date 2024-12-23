import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Star, Shield, Bell, BarChart, Database, Headphones } from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram, Facebook, X } from 'lucide-react';
import { HomeNavbar } from './HomeNavbar';

const PrivacyPolicy = () => {
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-10">
        <div className="bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold mb-4">MedScore Privacy Policy</h1>
          <p className="text-gray-600 mb-8">
            At MedScore, we are committed to safeguarding your privacy. This Privacy Policy outlines how we collect, use, and protect your information when you interact with our platform.
          </p>

          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">1. Information We Collect</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  <strong>Personal Information</strong>: We collect essential information such as name, contact details, and payment information to facilitate platform access and services.
                </li>
                <li>
                  <strong>Usage Data</strong>: We gather data on interactions with our platform for optimizing user experience and service enhancements.
                </li>
                <li>
                  <strong>Credit Data</strong>: Information related to payment history, credit utilization, and distributor relationships is collected to assess credit scores.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">2. How We Use Your Information</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  <strong>Service Provision</strong>: To provide credit scoring and related services.
                </li>
                <li>
                  <strong>Data Analytics</strong>: To enhance and personalize platform functionality.
                </li>
                <li>
                  <strong>Communication</strong>: For notifications, service updates, and account-related alerts.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">3. Data Protection and Security</h2>
              <p>We implement industry-standard security measures to protect your information from unauthorized access and data breaches.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">4. Data Sharing</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  <strong>Third-Party Services</strong>: We may share data with trusted partners for service delivery.
                </li>
                <li>
                  <strong>Legal Compliance</strong>: Data may be disclosed as required by law or to enforce platform terms.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">5. Your Rights</h2>
              <ul className="space-y-4 list-disc pl-6">
                <li>
                  <strong>Access and Modification</strong>: You can access and update personal information in your profile.
                </li>
                <li>
                  <strong>Data Deletion</strong>: Request data deletion subject to legal and regulatory requirements.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">6. Updates to this Policy</h2>
              <p>MedScore reserves the right to modify this Privacy Policy, with updates posted on our platform.</p>
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
            <h3 className="text-xl font-bold mb-4 mr-10 text-[#282c56]">Quick Links</h3>
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
          <p className="text-[#282c56]">© 2024 MedScore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;