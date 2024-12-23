import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react'
export const HomeNavbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Add a scrollToSection function similar to the one in Home
  const scrollToSection = (id) => {
    // If we're not on the home page, navigate to home first
    if (window.location.pathname !== '/') {
      navigate('/');
      
      // Use setTimeout to ensure the navigation completes before scrolling
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Small delay to allow navigation to complete
    } else {
      // If we're already on the home page, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  // const scrollToSection = (id) => {
  //   if (id === '/') {
  //     // If on the home page, scroll to the top
  //     window.scrollTo({ top: 0, behavior: 'smooth' });
  //   } else {
  //     const element = document.getElementById(id);
  //     if (element) {
  //       element.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   }
  // };
  return (
    <nav 
      className='relative md:flex items-center justify-between p-4 bg-[#121441] shadow-md font-mono cursor-pointer'
      aria-label="Main Navigation"
    >
      <div className='flex items-center justify-between'>
        <img 
          src='white-logo1.png' 
          alt='MedScore Logo' 
          className='object-contain h-20 w-60 ml-8'
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

      <div className='hidden md:flex space-x-9 pr-10 justify-normal text-white'>
       <div className='hidden md:flex space-x-9 pr-10 justify-normal text-white mr-28 text-lg'>
       <button 
          onClick={() => scrollToSection ('/')} 
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
          className='font-mono hover:text-blue-500 transition-colors '
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
       </div>
       <button 
      onClick={() => navigate('/Register')} 
      className='font-mono bg-[#74b4d5] text-white hover:bg-[#17012C] px-7 py-4 rounded-3xl shadow-md transition-colors duration-300 flex items-center'
      aria-label="Go to Register"
    >
      Get Started 
      <ChevronsRight className="ml-2 h-4 w-4" />
    </button>
      </div>

      {isMobileMenuOpen && (
        <div className='absolute top-full left-0 w-full bg-white shadow-md md:hidden z-50'>
          <div className='flex flex-col'>
            <button 
              onClick={() => {
                navigate('/Home');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-gray-100'
            >
              Home
            </button>
            <button 
              onClick={() => {
                scrollToSection('about');
                setIsMobileMenuOpen(false);
              }}
              className='w-full text-left p-4 border-b hover:bg-gray-100'
            >
              About Us
            </button>
            <button 
              onClick={() => {
                scrollToSection('features');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-gray-100'
            >
              Features
            </button>
            <button 
              onClick={() => {
                navigate('/BlogList');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-gray-100'
            >
              Blogs
            </button>
            <button 
              onClick={() => {
                navigate('/Register');
                setIsMobileMenuOpen(false);
              }} 
              className='w-full text-left p-4 border-b hover:bg-gray-100'
            >
              Register
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}