import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronRight, Users, Zap, Shield, Target, BookOpen, Heart } from 'lucide-react';
import { HomeNavbar } from "./HomeNavbar";
import HomeFooter from "./HomeFooter";
import { useNavigate } from 'react-router-dom';
export const Culture = () => {
  const [scrollY, setScrollY] = useState(0);
const [isVisible, setIsVisible] = useState({});
    const [showNavbar, setShowNavbar] = useState(false);
  const navigate=useNavigate();
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
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Values section data with enhanced content
  const coreValues = [
    {
      title: "Innovation First",
      icon: <Zap className="w-12 h-12 text-blue-600" />,
      desc: "Pioneering breakthrough solutions and embracing cutting-edge technologies to shape the future of our industry."
    },
    {
      title: "Collaborative Spirit",
      icon: <Users className="w-12 h-12 text-blue-600" />,
      desc: "Fostering an environment where diverse perspectives unite to create exceptional outcomes through seamless teamwork."
    },
    {
      title: "Unwavering Integrity",
      icon: <Shield className="w-12 h-12 text-blue-600" />,
      desc: "Maintaining the highest standards of ethical conduct and transparency in every interaction and decision."
    }
  ];

  // Enhanced benefits data
  const benefits = [
    {
      title: "Professional Development",
      icon: 'rag-doll-blue-targey.jpg',
      features: [
        "Personalized growth roadmaps",
        "Leadership development programs",
        "Industry certification support",
        "Global learning opportunities"
      ]
    },
    {
      title: "Work-Life Harmony",
      icon: '3d-character-playing-computer.jpg',
      features: [
        "Flexible work arrangements",
        "Wellness programs",
        "Sabbatical opportunities",
        "Family-friendly policies"
      ]
    },
    {
      title: "Learning & Growth",
      icon: 'employee-working-promotion.jpg',
      features: [
        "Mentorship programs",
        "Skill development workshops",
        "Innovation labs",
        "Cross-functional projects"
      ]
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen text-gray-900">
      <div className={`fixed top-0 left-0 w-full z-50 transition-opacity duration-300 ${
              showNavbar ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}>
              <HomeNavbar />
            </div>

      {/* Hero Section (keeping as is since you liked it) */}
      <div id="hero-section" className="relative h-screen flex items-center justify-center overflow-hidden">
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
      backgroundImage: "url('freepik__work-culture-background-image__23480.jpg')",
      transform: `scale(${1 + scrollY * 0.0002})`
    }}
  />
  <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('freepik__work-culture-backgroung-imge__23480.jpg')",
            transform: `scale(${1 + scrollY * 0.0002})`,
            transition: 'transform 0.3s ease-out'
          }}
        />
  <div className="relative z-20 text-center text-white max-w-4xl mx-auto px-4">
    <h1 className="text-6xl font-bold mb-6 animate-fade-in">Our Work Culture</h1>
    <p className="text-xl animate-fade-in-delayed">
      Where innovation meets excellence, and every day brings new possibilities.
    </p>
  </div>
</div>


      {/* Enhanced Core Values Section */}
      <section className="max-w-7xl mx-auto py-32 px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">Core Values that Define Us</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
            Our values shape every decision we make and guide us in creating exceptional experiences for our team and clients.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
          {coreValues.map((value, index) => (
            <div 
              key={index}
              className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Work Environment Section */}
      <section className="relative py-32 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold leading-tight">
                A Space Designed for <span className="text-blue-600">Excellence</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                We've crafted an environment that inspires creativity, fosters innovation, and empowers every team member to achieve their fullest potential.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  "State-of-the-art facilities",
                  "Collaborative spaces",
                  "Wellness areas",
                  "Innovation labs"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white p-4 rounded-xl shadow-sm">
                    <ChevronRight className="text-blue-600 w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-600/10 rounded-2xl transform rotate-3"></div>
              <img 
                src="freepik__the-style-is-candid-image-photography-with-natural__23481.jpg" 
                alt="Modern Office Space"
                className="relative rounded-xl shadow-xl transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-6">Exceptional Benefits</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
              We believe in taking care of our team with comprehensive benefits that support both professional growth and personal wellbeing.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-4  rounded-xl inline-block mb-6">
                <img src={benefit.icon} alt="Benefit Icon" className="w-20 h-20" />
                </div>
                <h3 className="text-2xl font-bold mb-6">{benefit.title}</h3>
                <ul className="space-y-4">
                  {benefit.features.map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3">
                      <ArrowRight className="w-5 h-5 text-blue-600 mt-1" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

export default Culture;