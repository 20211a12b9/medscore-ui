import React from 'react';
import { ArrowRight, Mail, Phone, MapPin, CalendarDays } from 'lucide-react';
import { Instagram, X, Facebook, Linkedin } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const HomeFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToSection = (id) => {
    // Check if we're on the home page
    if (location.pathname !== '/') {
      // If not on home page, navigate to home page with section hash
      navigate(`/?section=${id}`);
      return;
    }

    // If we're already on the home page
    if (id === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Quick links array with proper section IDs
  const quickLinks = [
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'BlogList', label: 'Blog List' },
    { id: 'FAQ', label: 'FAQ\'S' },
    { id: 'contactUs', label: 'Contact Us' }
  ];

  const posts = [
    {
      id: 1,
      image: "firstpost.png",
      date: "20 Feb, 2025",
      title: "Say goodbye to payment delays and risky credit decisions!",
      link: "news-details.html"
    },
    {
      id: 2,
      image: "/img/news/pp2.jpg",
      date: "15 Dec, 2024",
      title: "The Surfing Man Will Blow Your Mind",
      link: "news-details.html"
    }
  ];

  return (
    <>
      <footer className="bg-gray-800 py-16 px-6 lg:py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <img 
              className="w-36 h-auto" 
              src="img/logo/white-logo.png" 
              alt="MedScore Logo"
            />
            <p className="text-white/90 text-sm leading-relaxed">
              MedScore is the world's first credit score platform dedicated to the medical and pharmaceutical industry.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <Instagram />, href: "https://www.instagram.com/medscore.in/" },
                { icon: <X />, href: "https://x.com/Medscore_in" },
                { icon: <Facebook />, href: "https://www.facebook.com/Medscore.in/" },
                { icon: <Linkedin />, href: "https://www.linkedin.com/company/medscore-in/" }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-white border border-white/20 rounded-md hover:bg-white/10 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
              Quick Links
            </h3>
            <nav className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.id)}
                  className="flex items-center text-white/90 hover:text-white group w-full"
                >
                  <span className="text-lg mr-2 group-hover:translate-x-1 transition-transform">→</span>
                  <span className="text-sm font-medium">{link.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Recent Posts */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
              Recent Posts
            </h3>
            <div className="space-y-6">
              {posts?.map((post) => (
                <article key={post.id} className="flex gap-4">
                  <img 
                    src={post.image} 
                    alt="" 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <div className="flex items-center text-white/60 text-xs mb-1">
                      <CalendarDays className="w-4 h-4 mr-1" />
                      {post.date}
                    </div>
                    <a 
                      href={post.link}
                      className="text-white/90 text-sm hover:text-white transition-colors line-clamp-2"
                    >
                      {post.title}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white border-b border-white/20 pb-2">
              Contact Us
            </h3>
            <div className="space-y-4">
              <a 
                href="mailto:support@medscore.in" 
                className="flex items-center text-white/90 hover:text-white group"
              >
                <Mail className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm">support@medscore.in</span>
              </a>
              <a 
                href="tel:9347070310" 
                className="flex items-center text-white/90 hover:text-white group"
              >
                <Phone className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm">9347070310</span>
              </a>
              <div className="flex items-start text-white/90">
                <MapPin className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
                <p className="text-sm">
                  Incubated by AIC Aleap We Hub (supported by AIM, NITI AAYOG, GOI)
                  Head Office: Hyderabad - Telangana, India
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="privacyCheckbox"
                  className="h-4 w-4 rounded border-white/20 bg-transparent text-blue-500 focus:ring-blue-500 cursor-pointer"
                />
                <label className="text-sm text-white/90 cursor-pointer">
                  I agree to the{' '}
                  <button 
                    onClick={() => navigate('/PrivacyPolicy')}
                    className="underline hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-400">
              © All Copyright 2024 by MedScore
            </p>
            <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <li>
                <button className="text-gray-400 hover:text-white transition duration-300" onClick={() => navigate('/TermsConditions')}>
                  Terms & Condition
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/PrivacyPolicy')} className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeFooter;