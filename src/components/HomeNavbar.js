import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChevronsRight, ChevronDown } from 'lucide-react'

export const HomeNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect();
        setIsScrolled(heroRect.bottom <= 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Work Culture', path: '/Culture' },
    { label: 'Life@Medscore', path: '/Life' },
    { label: 'Current Openings', path: '/Openings' }
  ];

  const scrollToSection = (id) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
 
  return (
    <nav 
      className={`relative md:flex items-center justify-between p-4 shadow-md font-mono cursor-pointer transition-colors duration-300 ${
        isScrolled ? 'bg-gray-800' : 'bg-[#121441]'
      }`}
      aria-label="Main Navigation"
    >
      <div className='flex items-center h-20 justify-between'>
        <img 
          src='medscore_newlogo.png' 
          alt='MedScore Logo' 
          className='object-contain h-32 w-60 ml-8'
          aria-label="Company Logo"
        />
        
        <button 
          className='md:hidden text-white'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <div className='hidden md:flex items-center space-x-9 pr-10 text-white'>
        <div className='flex space-x-9 mr-28 text-lg'>
          <button 
            onClick={() => scrollToSection('/')} 
            className='font-mono hover:text-blue-500 transition-colors'
            aria-label="Go to Home"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className='font-mono hover:text-blue-500 transition-colors'
            aria-label="Go to About"
          >
            About Us
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className='font-mono hover:text-blue-500 transition-colors'
            aria-label="Go to Features"
          >
            Features
          </button>
          <button 
            onClick={() => navigate('/BlogList')}
            className='font-mono hover:text-blue-500 transition-colors'
            aria-label="Go to Blogs"
          >
            Blogs
          </button>
          <div className="relative">
            <button
              className="flex items-center gap-1 font-mono hover:text-blue-500 transition-colors"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              aria-label="Careers Menu"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              Careers
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div
                className={`absolute top-full left-0 mt-0 py-2 w-48 rounded-md shadow-lg ${
                  isScrolled ? 'bg-gray-800' : 'bg-[#121441]'
                }`}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                role="menu"
              >
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                    role="menuitem"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/Testimonials')}
            className='font-mono hover:text-blue-500 transition-colors'
            aria-label="Go to Blogs"
          >
            Testimonials
          </button>
        </div>
        <button 
          onClick={() => navigate('/Register')} 
          className='font-mono bg-[#74b4d5] text-white hover:bg-[#17012C] px-7 py-4 rounded-3xl shadow-md transition-colors duration-300 flex items-center'
          aria-label="Go to Register"
        >
          Register 
          <ChevronsRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className={`absolute top-full left-0 w-full shadow-md md:hidden z-50 ${
          isScrolled ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}>
          <div className='flex flex-col'>
            <button 
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-blue-500/10'
            >
              Home
            </button>
            <button 
              onClick={() => {
                scrollToSection('about');
                setIsMobileMenuOpen(false);
              }}
              className='w-full text-left p-4 border-b hover:bg-blue-500/10'
            >
              About Us
            </button>
            <button 
              onClick={() => {
                scrollToSection('features');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-blue-500/10'
            >
              Features
            </button>
            <button 
              onClick={() => {
                navigate('/BlogList');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-blue-500/10'
            >
              Blogs
            </button>
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
                className='w-full text-left p-4 border-b hover:bg-blue-500/10'
              >
                {item.label}
              </button>
            ))}
             <div className="relative">
            <button
              className="flex items-center gap-1 font-mono hover:text-blue-500 transition-colors"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              aria-label="Careers Menu"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              Careers
              <ChevronDown 
                className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isOpen && (
              <div
                className={`absolute top-full left-0 mt-1 py-2 w-48 rounded-md shadow-lg ${
                  isScrolled ? 'bg-gray-800' : 'bg-[#121441]'
                }`}
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                role="menu"
              >
                {menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-white hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                    role="menuitem"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
            <button 
              onClick={() => {
                navigate('/Register');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-blue-500/10'
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}