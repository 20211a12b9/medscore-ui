import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export const PharmaNavbar = () => {
   // MODIFICATION: Renamed onNavigate to navigate for clarity
   const navigate = useNavigate();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const handleLogout = () => {
       const confirmLogout = window.confirm('Are you sure you want to log out?');
       if (confirmLogout) {
         localStorage.removeItem('jwttoken');
         localStorage.removeItem('userId');
         window.location.href = '/';
       }
   };
     
   return (
       
       <nav 
           className='relative  md:flex items-center justify-between p-4 bg-white shadow-md font-mono cursor-pointer'
           aria-label="Main Navigation"
       >
           
           <div className='flex items-center justify-between'>
               <img 
                   src='medscore.png' 
                   alt='MedScore Logo' 
                   
                   className='object-contain h-12 w-24'
                   aria-label="Company Logo"
               />

               
               <button 
                   className='md:hidden'
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

           
           <div className='hidden md:flex space-x-9 pr-10 justify-normal'>
               

               <button 
                   onClick={() => navigate(-1)} 
                   className='font-mono hover:text-blue-500 transition-colors'
                   aria-label="Go Back"
               >
                   Back
               </button>

               <button 
                   onClick={() => navigate('/PharmacyrHomePage')} 
                   className='font-mono hover:text-blue-500 transition-colors'
                   aria-label="Go to Home"
               >
                   Home
               </button>
               <button 
                   onClick={() => navigate('/PharmaProfile')} 
                   className='font-mono hover:text-blue-500 transition-colors'
                   aria-label="Go to Profile"
               >
                   Profile
               </button>

               <button 
                   onClick={handleLogout} 
                   className='font-mono text-red-500 hover:text-red-700 transition-colors'
                   aria-label="Logout"
               >
                   Logout
               </button>
           </div>

           
           {isMobileMenuOpen && (
               <div className='absolute top-full left-0 w-full bg-white shadow-md md:hidden z-50'>
                   <div className='flex flex-col'>
                       <button 
                           onClick={() => {
                               navigate('/DistributorProfile');
                               setIsMobileMenuOpen(false);
                           }} 
                           className='w-full text-left p-4 border-b hover:bg-gray-100'
                       >
                           Profile
                       </button>
                       <button 
                           onClick={() => {
                               navigate(-1);
                               setIsMobileMenuOpen(false);
                           }} 
                           className='w-full text-left p-4 border-b hover:bg-gray-100'
                       >
                           Back
                       </button>
                       <button 
                           onClick={() => {
                               navigate('/PharmacyHomePage');
                               setIsMobileMenuOpen(false);
                           }} 
                           className='w-full text-left p-4 border-b hover:bg-gray-100'
                       >
                           Home
                       </button>
                       <button 
                           onClick={handleLogout} 
                           className='w-full text-left p-4 text-red-500 hover:bg-red-50'
                       >
                           Logout
                       </button>
                   </div>
               </div>
           )}
       </nav>
   )

}
