import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Star, Shield, Bell, BarChart, Database, Headphones } from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram, Facebook, X } from 'lucide-react';

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, variant, color, rightIcon, ...props }) => (
  <button
    className={`px-6 py-2 font-semibold rounded-lg transition-all duration-300 ${
      variant === 'solid'
        ? `bg-${color}-600 text-white hover:bg-${color}-700 shadow-lg hover:shadow-${color}-500/30`
        : `text-${color}-600 border-2 border-${color}-600 hover:bg-${color}-600 hover:text-white`
    }`}
    {...props}
  >
    {children}
    {rightIcon && <span className="ml-2">{rightIcon}</span>}
  </button>
);

export const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('jwttoken') !== null;

  const handleLogout = () => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const features = [
    { icon: <BarChart className="w-6 h-6 text-[#91C4E1]" />, title: 'Comprehensive Dashboard' },
    { icon: <Star className="w-6 h-6 text-[#91C4E1]" />, title: 'Custom Reports & Insights' },
    { icon: <Bell className="w-6 h-6 text-[#91C4E1]" />, title: 'Real-Time Alerts' },
    { icon: <Shield className="w-6 h-6 text-[#91C4E1]" />, title: 'Data Security' },
    { icon: <Headphones className="w-6 h-6 text-[#91C4E1]" />, title: '24/7 Support' },
    { icon: <Database className="w-6 h-6 text-[#91C4E1]" />, title: 'API Access' }
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="#" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-22">
            <img
              src="/medscore.png"
              alt="logo"
              className="w-24 h-35 object-contain hover:scale-105 transition-all duration-300"
            />
            <div className="flex gap-4">
              {isLoggedIn ? (
                <Button onClick={handleLogout} variant="outlined" color="blue">
                  Logout
                </Button>
              ) : (
                <Button onClick={handleRegister} variant="solid" className="bg-[#121441] text-white w-24 h-35 br-6 rounded-lg p-2">
                 Register
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section with CSS-only background */}
      <section className="relative overflow-hidden bg-[#74b4d5] py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-[#121441] mb-8 leading-tight">
              World's First Credit Score Platform
              <span className="block text-[#121441]">for Medical Shops</span>
            </h1>
            <p className="text-xl text-[#282c56] mb-12 max-w-2xl mx-auto">
              Revolutionizing credit risk management for the pharmaceutical industry.
              MedScore gives distributors reliable data to assess credit risks.
            </p>
            <div className="flex justify-center gap-6">
              <Button onClick={() => navigate('/login')} variant="solid" className="bg-[#121441] text-white w-25 h-35 br-6 rounded-lg p-2" >
                Get Started
              </Button>
              <Button onClick={() => navigate('/LearnMore')} variant="outlined" className="bg-[#121441] text-white w-28 h-35 br-6 rounded-lg p-2">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="distributors" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">
            What is <span className="text-[#74b4d5]">MedScore</span>?
          </h2>
          <div className="bg-[#91C4E1] p-8 rounded-lg shadow-md ">
            <p>
              MedScore is the world's first credit score platform dedicated to the medical and
              pharmaceutical industry. We provide a transparent, data-driven solution for assessing
              creditworthiness, empowering both distributors and medical shops to build strong,
              trust-based business relationships.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'For Distributors',
                description:
                  'Evaluate the creditworthiness of medical shops to lower the risk of defaults.',
                gradient: 'from-sky-300 to-indigo-900'
              },
              {
                title: 'For Medical Shops',
                description:
                  'Build a transparent credit profile to access better terms and strengthen relationships.',
                gradient: 'from-sky-300 to-indigo-900'
              }
            ].map((card, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${card.gradient}`}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-4">{card.title}</h3>
                  <p className="text-blue-100">{card.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="features" className="py-24 bg-blue-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Powerful <span className="text-[#74b4d5]">Features</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose MedScore? */}
      <section id="why-choose" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose <span className="text-[#74b4d5]">MedScore</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <Shield className="w-12 h-12 text-[#91C4E1] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Security</h3>
              <p className="text-gray-600">
                Advanced security protocols to ensure the safety and privacy of your information.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Headphones className="w-12 h-12 text-[#91C4E1] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">
                Dedicated support team available around the clock to assist you.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <BarChart className="w-12 h-12 text-[#91C4E1] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable Insights</h3>
              <p className="text-gray-600">
                Robust, data-backed credit scores tailored for the pharmaceutical industry.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#91C4E1] mb-2">About Us</h2>
          <div className="bg-white p-8 rounded-lg shadow-md">
          <p>
              Welcome to MedScore, the world's first centralized Credit Risk Assessment & Management
              platform tailored for the pharmaceutical industry. We're revolutionizing credit-based
              transactions by providing pharmaceutical distributors with a reliable, data-driven
              credit score for medical shops, enabling smarter, safer credit decisions that minimize
              risks like bad debts and delayed payments.
              <br />
              <br />
              MedScore is a brand by <em className="text-blue-500">Medicozin Techno Private Limited</em>, a
              forward-thinking company dedicated to innovation in healthcare and pharmaceutical
              technology solutions. Our mission is to bring unprecedented transparency and efficiency
              to the pharmaceutical distribution network, supporting financial trust and
              creditworthiness for both distributors and retailers.
              <br />
              <br />
              With MedScore, we are setting a global benchmark for credit risk management in the
              pharmaceutical sector - simplifying credit, amplifying trust.
            </p>
          </div>
        </div>
      </section>
      {/* Enhanced Testimonials Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            What Our <span className="text-[#91C4E1]">Users Say</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 ">
            {[
              {
                text: "MedScore has become an essential tool for our distribution business. It helps us identify credit risks early and manage cash flow better than ever.",
                author: 'Rajesh P.',
                role: 'Pharmaceutical Distributor'
              },
              {
                text: "We never realized how important our credit score was to getting better terms from distributors. MedScore made it easy to track and improve.",
                author: 'Neha K.',
                role: 'Medical Shop Owner'
              }
            ].map((testimonial, index) => (
              <Card
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-blue-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#91C4E1] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-3 text-[#121441]">Follow Us</h3>
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
            <h3 className="text-xl font-bold mb-4 text-[#121441]">Contact Us</h3>
            <div id="contactUs" className="flex flex-col gap-2">
              <a href="mailto:support@medscore.in" className="hover:text-blue-500 transition-colors">
                <Mail className="w-5 h-5 inline-block mr-2" /> support@medscore.in
              </a>
              <a href="tel:04046025805" className="hover:text-blue-500 transition-colors">
                <Phone className="w-5 h-5 inline-block mr-2" /> 04046025805
              </a>
              <div>
                <MapPin className="w-5 h-5 inline-block mr-2" /> Dilshuknagar, Hyderabad-500059
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 mr-10 text-[#121441] ">Quick Links</h3>
            <div className="flex flex-row space-x-7 ml-10">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => scrollToSection('#')}
                className="hover:text-blue-500 transition-colors "
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="hover:text-blue-500 transition-colors "
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="hover:text-blue-500 transition-colors "
              >
                About Us
              </button>
             
              <button
                onClick={() => scrollToSection('distributors')}
                className="hover:text-blue-500 transition-colors "
              ></button>
             
              <button 
                onClick={() => scrollToSection('distributors')}
                className="hover:text-blue-500 transition-colors "
              >
                For Distributors
              </button>
             
          </div>
          <div className="flex flex-col space-y-2">
          <button 
                onClick={() => navigate('/Blogs')}
                className="hover:text-blue-500 transition-colors "
              >
                Blogs

              </button>
              <button 
      onClick={() => navigate('/PrivacyPolicy')}
      className="hover:text-blue-500 transition-colors"
    >
      Privacy Policy
    </button>
              <button 
                onClick={() => scrollToSection('distributors')}
                className="hover:text-blue-500 transition-colors "
              >
                For Medical Shops
              </button>
            
              <button 
                onClick={() => navigate('/TermsConditions')}
                className="hover:text-blue-500 transition-colors "
              >
                Terms & Conditions

              </button>
          </div>
            </div>
            
          </div>
        </div>
       
 
<div className="mt-8 pt-8 border-t border-gray-700 text-center">
  <p className="text-[#121441]">© 2024 MedScore. All rights reserved.</p>
</div>

      </footer>
    </div>
  );
};

export default Home;