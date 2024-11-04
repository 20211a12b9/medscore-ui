import React from 'react';
import { useNavigate } from 'react-router-dom';
import { config } from '../config';

export const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('jwttoken') !== null;
    console.log("isLoggedIn",isLoggedIn)
    const handleLogout = () => {
        // Clear auth token and any other user data from localStorage
        localStorage.removeItem('jwttoken');
        localStorage.removeItem('userId');
        // Other cleanup if needed...
        
        // Refresh the page to reflect logged out state
        window.location.href = '/';
    };
    const handleRegister = () => {
      navigate("/register")
    };

   
  return (
    <>
      <style>
        {`
          /* Custom CSS */
          .gradient-bg {
            background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
          }
          
          .hero-text {
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          
          .card {
            transition: transform 0.2s ease-in-out;
          }
          
          .card:hover {
            transform: translateY(-5px);
          }
          
          .feature-card {
            transition: all 0.3s ease;
          }
          
          .feature-card:hover {
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          }

          .check-icon::before {
            content: '✓';
            color: #2563eb;
            font-size: 1.2rem;
            margin-right: 8px;
          }
          
          .testimonial-card {
            position: relative;
          }
          
          .testimonial-card::before {
            content: '"';
            position: absolute;
            top: -20px;
            left: 20px;
            font-size: 60px;
            color: #e5e7eb;
            font-family: serif;
          }
          
          .custom-shadow {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
                        0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          .btn-primary {
            background-color: #2563eb;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
          }
          
          .btn-primary:hover {
            background-color: #1d4ed8;
            transform: translateY(-1px);
          }
          
          .btn-secondary {
            border: 2px solid #2563eb;
            color: #2563eb;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            background: transparent;
            cursor: pointer;
          }
          
          .btn-secondary:hover {
            background-color: #2563eb;
            color: white;
          }
          
          .section-title {
            position: relative;
            padding-bottom: 15px;
          }
          
          .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 50px;
            height: 3px;
            background-color: #2563eb;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .grid {
            display: grid;
            gap: 32px;
          }

          .grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }

          /* New header styles */
          .header {
            position: sticky;
            top: 0;
            z-index: 50;
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .header-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }

          .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1a365d;
            text-decoration: none;
          }

          @media (max-width: 768px) {
            .grid-cols-2, .grid-cols-3 {
              grid-template-columns: 1fr;
            }
            
            .container {
              padding: 0 16px;
            }
            
            .hero-text {
              font-size: 2rem !important;
            }

            .header-container {
              padding: 1rem;
            }
          }
        `}
      </style>

      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        {/* Header */}
        <header className="header">
          <div className="header-container">
            {/* <a href="/" className="logo">MedScore</a> */}
            <img 
  src="/medscorelogo.jpeg" 
  alt="logo" 
  className="w-[100px] h-auto object-contain m-1.5 hover:scale-105 transition-transform duration-300"
/>
            <div style={{ display: 'flex', gap: '16px' }}>
                            {isLoggedIn ? (
                                <button 
                                    className="btn-secondary" 
                                    onClick={handleLogout}
                                    style={{ borderColor: '#2563eb', color: '#2563eb' }}
                                >
                                    Logout
                                </button>
                            ) : (
                                <button 
                                    className="btn-primary" 
                                    onClick={handleRegister}
                                >
                                    Register
                                </button>
                            )}
                        </div>          </div>
        </header>

        {/* Hero Section */}
        <section className="gradient-bg" style={{ padding: '80px 0' }}>
          <div className="container">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <h1 className="hero-text" style={{ 
                color: 'white', 
                fontSize: '3.5rem', 
                marginBottom: '24px',
                maxWidth: '800px' 
              }}>
                World's First Credit Score Platform for Medical Shops
              </h1>
              <p style={{ 
                color: 'white', 
                fontSize: '1.25rem', 
                marginBottom: '32px',
                maxWidth: '600px' 
              }}>
                Revolutionizing credit risk management for the pharmaceutical industry.
                MedScore gives distributors reliable data to assess credit risks.
              </p>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn-primary" onClick={() => navigate('/login')}>Get Started</button>
                <button className="btn-secondary" style={{ borderColor: 'white', color: 'white' }}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <h2 className="section-title" style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              marginBottom: '48px',
              color: '#1a365d'
            }}>
              What is MedScore?
            </h2>
            <div className="grid grid-cols-2">
              <div className="card custom-shadow" style={{ 
                backgroundColor: 'white', 
                padding: '32px', 
                borderRadius: '12px' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#1a365d' }}>
                  For Distributors
                </h3>
                <p style={{ color: '#4b5563' }}>
                  Evaluate the creditworthiness of medical shops to lower the risk of defaults.
                </p>
              </div>
              <div className="card custom-shadow" style={{ 
                backgroundColor: 'white', 
                padding: '32px', 
                borderRadius: '12px' 
              }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#1a365d' }}>
                  For Medical Shops
                </h3>
                <p style={{ color: '#4b5563' }}>
                  Build a transparent credit profile to access better terms and strengthen relationships.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ backgroundColor: '#f3f4f6', padding: '80px 0' }}>
          <div className="container">
            <h2 className="section-title" style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              marginBottom: '48px',
              color: '#1a365d'
            }}>
              Features
            </h2>
            <div className="grid grid-cols-3">
              {[
                "Comprehensive Dashboard",
                "Custom Reports & Insights",
                "Real-Time Alerts",
                "Data Security",
                "24/7 Support",
                "API Access"
              ].map((feature, index) => (
                <div key={index} className="feature-card check-icon" style={{ 
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '8px',
                }}>
                  <span style={{ color: '#1a365d', fontWeight: '500' }}>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section style={{ padding: '80px 0' }}>
          <div className="container">
            <h2 className="section-title" style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              marginBottom: '48px',
              color: '#1a365d'
            }}>
              What Our Users Say
            </h2>
            <div className="grid grid-cols-2">
              <div className="testimonial-card custom-shadow" style={{ 
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px'
              }}>
                <p style={{ color: '#4b5563', marginBottom: '16px', lineHeight: '1.6' }}>
                  "MedScore has become an essential tool for our distribution business. 
                  It helps us identify credit risks early and manage cash flow better than ever."
                </p>
                <p style={{ color: '#1a365d', fontWeight: '600' }}>— Rajesh P., Pharmaceutical Distributor</p>
              </div>
              <div className="testimonial-card custom-shadow" style={{ 
                backgroundColor: 'white',
                padding: '32px',
                borderRadius: '12px'
              }}>
                <p style={{ color: '#4b5563', marginBottom: '16px', lineHeight: '1.6' }}>
                  "We never realized how important our credit score was to getting better 
                  terms from distributors. MedScore made it easy to track and improve."
                </p>
                <p style={{ color: '#1a365d', fontWeight: '600' }}>— Neha K., Medical Shop Owner</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section style={{ backgroundColor: '#f3f4f6', padding: '80px 0' }}>
          <div className="container" style={{ maxWidth: '800px' }}>
            <h2 className="section-title" style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              marginBottom: '48px',
              color: '#1a365d'
            }}>
              Contact Us
            </h2>
            <div className="custom-shadow" style={{ 
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '12px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '600', width: '100px' }}>Email:</span>
                  <a href="mailto:support@medscore.com" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    support@medscore.in
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '600', width: '100px' }}>Phone:</span>
                  <a href="tel:+1-800-123-4567" style={{ color: '#2563eb', textDecoration: 'none' }}>
                    04046025805
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontWeight: '600', width: '100px' }}>Location:</span>
                  <span>Dilshuknagar,Hyderabad-500059</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;