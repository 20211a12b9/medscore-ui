import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  Coffee, 
  Award, 
  Calendar, 
  Smile, 
  Camera,
  ChevronRight
} from 'lucide-react';
import HomeFooter from './HomeFooter';
import { HomeNavbar } from './HomeNavbar';
import { useNavigate } from 'react-router-dom';
export const Life = () => {
    const [isVisible, setIsVisible] = useState({});
    const [showNavbar, setShowNavbar] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const navigate=useNavigate();
  
   useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
      const handleScroll = () => {
        // Check for animate-on-scroll elements
        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight * 0.75;
          setIsVisible(prev => ({ ...prev, [el.id]: isVisible }));
        });
  
        // Check hero section
        const heroSection = document.getElementById('hero-section');
        if (heroSection) {
          const heroRect = heroSection.getBoundingClientRect();
          const hasPassedHero = heroRect.bottom <= 0;
          setShowNavbar(hasPassedHero);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);



  const events = [
    {
      title: "Annual Team Retreat",
      date: "October 2024",
      image: "freepik__the-style-is-candid-image-photography-with-natural__43852.jpg",
      description: "A week of team building, strategy planning, and adventure in the mountains."
    },
    {
      title: "Innovation Week",
      date: "November 2024",
      image: "freepik__the-style-is-candid-image-photography-with-natural__43851.jpg",
      description: "Showcasing breakthrough ideas and celebrating our innovative spirit."
    },
    {
      title: "Wellness Month",
      date: "December 2024",
      image: "freepik__the-style-is-candid-image-photography-with-natural__12798.jpg",
      description: "Focus on physical and mental well-being with workshops and activities."
    }
  ];

  const perks = [
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Work-Life Balance",
      description: "Flexible hours and remote work options to help you maintain perfect harmony."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Growth Opportunities",
      description: "Continuous learning and development programs to advance your career."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health & Wellness",
      description: "Comprehensive healthcare and wellness programs for you and your family."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
       <div className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-300 ${
        showNavbar ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <HomeNavbar />
      </div>
      {/* Hero Section */}
     
<div id='hero-section' className="relative h-screen flex items-center justify-center overflow-hidden">
{!showNavbar && (
  <button 
    onClick={() => navigate(-1)} 
    className="absolute top-10 left-10 z-50 w-10 h-10"
    aria-label="Go Back"
  >
    <img 
      src="top-left_10024227.png" 
      alt="Decorative" 
      className="w-full h-full object-contain"
    />
  </button>
)}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('freepik__the-style-is-candid-image-photography-with-natural__43850.jpg')",
            transform: `scale(${1 + scrollY * 0.0002})`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">Life at Medscore</h1>
          <p className="text-xl animate-fade-in-delayed">Where Innovation Meets Well-being.</p>
        </div>
      </div>
      {/* Culture Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Culture</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              At Medscre, we foster an environment where innovation thrives, 
              collaboration is celebrated, and every individual can make a meaningful impact.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="w-12 h-12 text-blue-600" />,
                title: "Collaborative Spirit",
                desc: "Work alongside passionate individuals who inspire and support each other."
              },
              {
                icon: <Smile className="w-12 h-12 text-blue-600" />,
                title: "Inclusive Environment",
                desc: "Celebrate diversity and create a space where everyone belongs."
              },
              {
                icon: <Camera className="w-12 h-12 text-blue-600" />,
                title: "Work & Play",
                desc: "Balance hard work with fun team activities and celebrations."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life Events Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Life at Medscre</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div 
                key={index}
                className="group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title}
                    className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <p className="text-sm mb-2">{event.date}</p>
                    <h3 className="text-xl font-bold">{event.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Perks & Benefits</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {perks.map((perk, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  {perk.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{perk.title}</h3>
                <p className="text-gray-600">{perk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    <HomeFooter/>
    </div>
  );
};

export default Life;