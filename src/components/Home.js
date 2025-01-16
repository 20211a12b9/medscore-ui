import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Star, Shield, Bell, BarChart, Database, Headphones ,Building2,Timer} from 'lucide-react';
import { Github, Linkedin, Twitter, Instagram, Facebook, X } from 'lucide-react';
import { HomeNavbar } from './HomeNavbar';
import { useState } from 'react';
import { ChevronsRight, ArrowUpRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect } from 'react';
import { CalendarDays,ArrowUp } from 'lucide-react';
import emailjs from '@emailjs/browser'; 
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
  const [isVisible, setIsVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('jwttoken') !== null;
  const [isChecked, setIsChecked] = useState(false);
  const [formData,setFormData]=useState({
    name:'',
    city:'',
    phone:'',
    businessname:'',
    message:''
  })
  const [sending,setSending]=useState(false)
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value

    })
  }
  const handleSubmit =async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Replace these with your actual EmailJS credentials
      const templateParams = {
        to_name: "Medscore",
        from_name: formData.name,
        from_city: formData.city,
        phone: formData.phone,
        business_name: formData.businessname,
        message: formData.message
      };

      await emailjs.send(
        'service_tam6f72', // Replace with your EmailJS service ID
        'template_aadlafx', // Replace with your EmailJS template ID
        templateParams,
        'MB5Z4ns9hoVRCHL41' // Replace with your EmailJS public key
      );

      alert('Message sent successfully!');
      setFormData({
        name: '',
        city: '',
        phone: '',
        businessname: '',
        message: ''
      });
    } catch (error) {
      alert('Failed to send message. Please try again.');
      console.error('EmailJS Error:', error);
    } finally {
      setSending(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('jwttoken');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const handleRegister = () => {
    navigate('/register');
  };
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const features = [
    { icon: <BarChart className="w-6 h-6 text-[#121441]" />, title: 'Comprehensive Dashboard' },
    { icon: <Star className="w-6 h-6 text-[#121441]" />, title: 'Custom Reports & Insights' },
    { icon: <Bell className="w-6 h-6 text-[#121441]" />, title: 'Real-Time Alerts' },
    { icon: <Shield className="w-6 h-6 text-[#121441]" />, title: 'Data Security' },
    { icon: <Headphones className="w-6 h-6 text-[#121441]" />, title: '24/7 Support' },
    { icon: <Database className="w-6 h-6 text-[#121441]" />, title: 'API Access' }
  ];

  const scrollToSection = (id) => {
    if (id === '#') {
      // If on the home page, scroll to the top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  const testimonials = [
    {
      name: "Neha K",
      role: "Medical Shop Owner",
      image: "/img/testimonial/04.png",
      content: "We never realized how important our credit score was to getting better terms from distributors. MedScore made it easy to track and improve."
    },
    {
      name: "Rajesh P",
      role: "Pharmaceutical Distributor",
      image: "/img/testimonial/04.png",
      content: "MedScore has become an essential tool for our distribution business. It helps us identify credit risks early and manage cash flow better than ever."
    }
  ];
 
    const posts = [
      {
        id: 1,
        image: "/img/news/pp1.jpg",
        date: "20 Feb, 2024",
        title: "Top 5 Most Famous Technology Trend In 2024",
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

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);
  return (
    <div id="#" className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden scrollbar-hide">
      <div className="fixed top-0 left-0 w-full z-50">
      <HomeNavbar/>
      </div>
       
     
     
 <section className="relative min-h-screen bg-cover bg-center py-24 md:py-24 lg:py-36 bg-[#121441]">
      {/* Shape Images - Hidden on mobile, visible on larger screens */}
      <div className="relative hidden md:block">
        <img src="trophy-shape.png" alt="" className="absolute top-40 left-0 w-16 md:w-auto" />
        <img src="left-shape.png" alt="" className="absolute left-0 top-80 w-16 md:w-60" />
        <img src="right-shape.png" alt="" className="absolute right-0 top-1/2 w-16 md:w-auto" />
      </div>

      {/* Container with responsive padding */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="w-full lg:w-1/2 space-y-6 animate-fade-in text-center  lg:text-left">
            <h6 className="text-base hidden:lg sm:text-lg  font-semibold text-white hidden md:block">
              Simplify Credit. Build Trust. Empower Pharma.
            </h6>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white">
              World's First Credit Risk Platform for Pharma & Healthcare Distribution
            </h1>
            <p className="text-white text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
              Revolutionizing credit risk management for the pharmaceutical industry.
              MedScore gives distributors reliable data to assess credit risks.
            </p>
            
            {/* Buttons - Responsive layout */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto font-mono bg-[#74b4d5] text-xl text-white hover:bg-[#17012C] px-6 py-3 sm:px-7 sm:py-4 rounded-3xl shadow-md transition-colors duration-300 flex items-center justify-center"
                aria-label="Go to Register"
              >
                Get Started
                <ChevronsRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => navigate('/LearnMore')}
                className="w-full sm:w-auto font-extrabold text-xl text-white hover:bg-[#17012C] px-6 py-3 sm:px-7 sm:py-4 rounded-3xl shadow-md transition-colors duration-300 flex items-center justify-center"
                aria-label="Learn More"
              >
                Learn More
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-full lg:w-5/12 relative mt-12 lg:mt-0 ">
            <div className="relative">
              <img 
                src="hero-image-2.png" 
                alt="Hero" 
                className="w-full max-w-lg mx-auto lg:max-w-none animate-slide-in-left"
              />
              {/* Decorative images - Hidden on mobile */}
              <div className="">
                <img src="box-shape.png" alt="" className="absolute top-1 left-8 w-12 md:w-auto animate-slow-left-right" />
                <img src="free.png" alt="" className="absolute top-[380px] right-80 w-12 h-36 md:w-auto animate-slow-top-bottom hidden md:block" />
                <img src="cursor.png" alt="" className="absolute top-1 right-2 w-12 md:w-auto animate-slow-left-right" />
                <img src="rocket-2.png" alt="" className="absolute -right-56 -mb-8 w-12 md:w-auto animate-slow-top-bottom hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
     <section  id="distributors" className="py-40 bg-white">
      <div className="container mx-auto px-4 flex-row">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left column with images */}
          <div className="relative flex-shrink-0 w-full md:w-1/2">
            {/* Main image container */}
            <div className="relative">
              <img 
                src="about/01.jpg" 
                alt="About" 
                className="w-full max-w-lg mx-auto md:ml-24 rounded-lg shadow-lg rounded-t-full"
              />
              
              {/* Decorative elements */}
              <img 
                src="about/box-shape-2.png" 
                className="absolute bottom-48 left-4 w-12 md:w-auto animate-slow-left-right z-10"
              />
              
              <img 
                src="about/grap-2.png" 
                className="absolute top-3/4 right-4 w-12 md:w-auto animate-slow-left-right z-10"
              />
             <div className="absolute -top-8 right-1/4 md:right-1/3 lg:right-1/4 z-10 h-32 w-32 bg-orange-400 rounded-full flex items-center justify-center animate-slow-left-right shadow-lg">
  {/* Arrow Icon */}
  <ArrowUpRight className="absolute text-white text-2xl" />

  {/* Image Overlay */}
  <img 
    src="about/white-text.png" 
    alt="White Text" 
    className="absolute h-32 w-auto top-0"
  />
</div>

              
            </div>
          </div>
          
          {/* Right column - empty for now but structured */}
          <div className="lg:w-1/2">
      <div className="space-y-6">
        {/* Section Title */}
        <div className="space-y-4">
          <div className="animate-fadeIn">
          <span className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-2xl font-semibold mb-4">
                  What is MedScore?
                </span>
          </div>
          <h2 className="text-3xl font-bold animate-fadeIn">
            Credit risk for the pharmaceutical industry
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-600 animate-fadeIn">
          MedScore is the world's first credit score platform dedicated to the medical and pharmaceutical industry. 
          We provide a transparent, data-driven solution for assessing creditworthiness, empowering both distributors 
          and medical shops to build strong, trust-based business relationships.
        </p>

        {/* Icon Items */}
        <div className="flex flex-row space-y-6 gap-10">
          {/* Distributor Item */}
          <div className="flex flex-col items-start space-x-4 animate-fadeIn mt-6">
            <img 
              src="img/Distributor.png" 
              alt="Distributor Icon" 
              className="w-1/2"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">For Distributors</h3>
              <p className="text-gray-600">
                Evaluate the creditworthiness of medical shops to lower the risk of defaults.
              </p>
            </div>
          </div>

          {/* Medical Shops Item */}
          <div className="flex flex-col items-start space-x-4 animate-fadeIn">
            <img 
              src="img/Pharmacy.png" 
              alt="Pharmacy Icon" 
              className="w-4/6"
            />
            <div>
              <h3 className="text-xl font-semibold mb-2">For Medical Shops</h3>
              <p className="text-gray-600">
                Build a transparent credit profile to access better terms and strengthen relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
        </div>
       
      </div>
    </section>
     
  
  <section id='features' className="py-20 sm:py-24 lg:py-40" style={{ backgroundImage: `url('img/team/team-bg.jpg')`}}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className='text-6xl font-bold flex justify-items-start justify-self-start text-left mb-20'>Powerful Features</h1>
    <div className="flex flex-col gap-10">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
        <div className="flex flex-row items-start space-x-4 animate-fadeIn border-2 border-gray-200 rounded-3xl p-6">
          <img src="img/service/icon-1.png" alt="Dashboard Icon" className="w-12 sm:w-16" />
          <div>
            <h3 className="font-bold text-xl sm:text-2xl">Dashboard</h3>
            <p className="text-sm sm:text-base text-gray-600">Complete view of credit scores and trends.</p>
          </div>
        </div>
        <div className="flex flex-row items-start space-x-4 animate-fadeIn border-2 border-gray-200 rounded-3xl p-6">
          <img src="img/service/icon-2.png" alt="Custom Reports Icon" className="w-12 sm:w-16" />
          <div>
            <h3 className="font-bold text-xl sm:text-2xl">Custom Reports</h3>
            <p className="text-sm sm:text-base text-gray-600">Actionable insights tailored to your needs.</p>
          </div>
        </div>
        <div className="flex flex-row items-start space-x-4 animate-fadeIn border-2 border-gray-200 rounded-3xl p-6">
          <img src="img/service/icon-3.png" alt="Real-Time Alerts Icon" className="w-12 sm:w-16" />
          <div>
            <h3 className="font-bold text-xl sm:text-2xl">Real-Time Alerts</h3>
            <p className="text-sm sm:text-base text-gray-600">Stay informed about changes instantly</p>
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
        <div className="flex flex-row items-start space-x-4 animate-fadeIn border-2 border-gray-200 rounded-3xl p-6">
          <img src="img/service/icon-4.png" alt="API Access Icon" className="w-12 sm:w-16" />
          <div>
            <h3 className="font-bold text-xl sm:text-2xl">API Access</h3>
            <p className="text-sm sm:text-base text-gray-600">Integrate MedScore with your systems.</p>
          </div>
        </div>
        <div className="flex flex-row items-start space-x-4 animate-fadeIn border-2 border-gray-200 rounded-3xl p-6">
          <img src="img/service/icon-5.png" alt="24/7 Support Icon" className="w-12 sm:w-16" />
          <div>
            <h3 className="font-bold text-xl sm:text-2xl">24/7 Support</h3>
            <p className="text-sm sm:text-base text-gray-600">Help is always at hand.</p>
          </div>
        </div>
        <div className="flex flex-row items-start space-x-4 animate-fadeIn border-2 border-gray-200 rounded-3xl p-6">
          <img src="img/service/icon-6.png" alt="Data Security Icon" className="w-12 sm:w-16" />
          <div>
            <h3 className="font-bold text-xl sm:text-2xl">Data Security</h3>
            <p className="text-sm sm:text-base text-gray-600">Your information is safe with us.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  

     
  
 
     
 <section id="why-choose" className="py-24 bg-gradient-to-r from-[#f1bebb]  to-[#dbdbdd]  ">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-6xl font-bold text-[#2C3E50]">Why Choose Medscore?</h1>
    </div>

    <div className="flex flex-wrap justify-center gap-8">
      <div className="bg-white shadow-xl w-72 h-72 flex flex-col items-center justify-center rounded-xl p-6 space-y-6 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
        <img src="img/service/icon-6.png" alt="Data Security" className="w-16 h-16 mb-4" />
        <h3 className="font-bold text-xl text-[#2C3E50]">Data Security</h3>
        <p className="text-center text-gray-600 text-sm">Complete view of credit score and scale</p>
      </div>

      <div className="bg-white shadow-xl w-72 h-72 flex flex-col items-center justify-center rounded-xl p-6 space-y-6 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
        <img src="img/service/icon-5.png" alt="24/7 Support" className="w-16 h-16 mb-4" />
        <h3 className="font-bold text-xl text-[#2C3E50]">24/7 Support</h3>
        <p className="text-center text-gray-600 text-sm">Always available to assist you with any queries or concerns</p>
      </div>

      <div className="bg-white shadow-xl w-72 h-72 flex flex-col items-center justify-center rounded-xl p-6 space-y-6 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
        <img src="img/service/RInsights_1.png" alt="Reliable Insights" className="w-16 h-16 mb-4" />
        <h3 className="font-bold text-xl text-[#2C3E50]">Reliable Insights</h3>
        <p className="text-center text-gray-600 text-sm">Robust, data-backed credit scores tailored for the pharmaceutical industry</p>
      </div>

      <div className="w-72 h-72 relative">
        <img src="img/feature-img.jpg" alt="Feature Image" className="w-full h-full object-cover rounded-lg shadow-lg" />
      </div>
    </div>
  </div>
</section>

<section 
      id="about" 
      className="py-24 lg:py-32 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url('img/team/team-bg.jpg')` }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
         
          <div className="w-full lg:w-1/2">
            <img 
              src="img/choose-us.png" 
              alt="About MedScore"
              className="w-full h-auto max-w-2xl mx-auto rounded-2xl shadow-2xl"
            />
          </div>

         
          <div className="w-full lg:w-1/2">
            <div className="max-w-xl">
             
              <div className="mb-8">
                <span className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-2xl font-semibold mb-4">
                  About us
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Welcome to MedScore
                </h2>
              </div>

              {/* Paragraphs */}
              <div className="space-y-6 text-gray-600">
  <p className="text-lg leading-relaxed text-justify">
    The world's first centralized Credit Risk Assessment & Management platform tailored for the pharmaceutical industry. We're revolutionizing credit-based transactions by providing pharmaceutical distributors with a reliable, data-driven credit score for medical shops, enabling smarter, safer credit decisions that minimize risks like bad debts and delayed payments.
  </p>
  <p className="text-lg leading-relaxed text-justify">
    We are a forward-thinking company dedicated to innovation in healthcare and pharmaceutical technology solutions. Our mission is to bring unprecedented transparency and efficiency to the pharmaceutical distribution network, supporting financial trust and creditworthiness for both distributors and retailers.
  </p>
  <p className="text-lg leading-relaxed text-justify">
    With MedScore, we are setting a global benchmark for credit risk management in the pharmaceutical sector—simplifying credit, amplifying trust.
  </p>
</div>

            </div>
          </div>
        </div>
      </div>
    </section>

     
  <section className="py-12 sm:py-16 md:py-20 lg:py-24">
  <div className="flex flex-col lg:flex-row gap-12 sm:gap-16 lg:gap-24 px-4 sm:px-6 lg:px-8">
    {/* Left Section */}
    <div className="hidden lg:flex flex-col lg:flex-row gap-2 relative lg:w-1/2">
      <img
        src="img/testimonial/03.png"
        className="mr-14 bg-gray-200 ml-32 px-20 rounded-t-full"
        alt="Testimonial feature"
      />
      <img
        src="img/news/left-shape.png"
        className="absolute top-0 left-0 w-full h-full"
        alt="Background shape"
      />
      <div className="absolute top-0 left-52 flex flex-wrap">
        <img
          src="img/testimonial/rocket.png"
          className="animate-slow-left-right z-10"
          alt="Rocket animation"
        />
        <img 
          src="img/testimonial/msg.png" 
          className="animate-slow-top-bottom z-10" 
          alt="Message animation"
        />
      </div>
    </div>

    {/* Right Section */}
    <div className="w-full lg:w-1/2">
      <div className="max-w-xl mx-auto lg:mx-0">
        <div className="mb-6 sm:mb-8 text-center lg:text-left">
          <span className="inline-block px-4 sm:px-6 py-1.5 sm:py-2 bg-blue-100 text-blue-600 rounded-full text-lg sm:text-2xl font-semibold mb-3 sm:mb-4">
            TESTIMONIALS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-4 sm:px-0">
            Your Marketing Solutions Happy Clients Say?
          </h2>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out rounded-2xl sm:rounded-3xl"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-4 sm:px-0">
                <div className="flex flex-col bg-white border shadow-sm rounded-2xl sm:rounded-3xl">
                  {/* Testimonial Header */}
                  <div className="flex flex-row items-center p-4 sm:p-6">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 sm:w-20 h-16 sm:h-20 rounded-full"
                    />
                    <div className="flex flex-col gap-0.5 sm:gap-1 ml-4">
                      <h5 className="text-lg sm:text-xl font-semibold">{testimonial.name}</h5>
                      <span className="text-sm sm:text-base text-gray-600">{testimonial.role}</span>
                    </div>
                    <img
                      src="/img/testimonial/icon.png"
                      alt="Quote icon"
                      className="w-16 sm:w-20 h-16 sm:h-20 p-3 sm:p-4 ml-auto"
                    />
                  </div>

                  {/* Testimonial Content */}
                  <div className="px-4 sm:px-6 pb-6">
                    <p className="text-base sm:text-lg font-light leading-relaxed text-gray-700">
                      {testimonial.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Navigation Dots */}
          {/* <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  </div>
</section>

       {/* Contact Section */}
       <div id='FAQ' className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-4xl font-bold text-[#2C3E50] text-center mb-12">Let's Connect</h2>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-gray-700 mb-2">Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg bg-gray-100" 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">City</label>
                <input 
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-100"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  className="w-full p-3 border rounded-lg bg-gray-100"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Business Name</label>
                <input 
                  type="text" 
                  className="w-full p-3 border rounded-lg bg-gray-100"
                  id="businessname"
                  name="businessname"
                  value={formData.businessname}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Message</label>
                <textarea 
                  className="w-full p-3 border rounded-lg h-32 bg-gray-100"
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required 
                ></textarea>
              </div>
              <button 
                type="submit"
                className="bg-[#00A9E0] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all w-full"
              >
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
      
      <section className="py-24 -mb-44 relative hidden lg:block">
  <div className="relative">
    <img className="absolute right-6 -top-20 md:w-auto animate-slow-top-bottom" src="img/rokect.png" />
  </div>

  {/* CTA Background Section */}
  <div className="h-52 w-11/12 ml-14 rounded-3xl bg-cover" style={{ backgroundImage: `url('img/cta-bg.jpg')` }}>
    <div className="relative">
      <img className="absolute -top-20 left-24" src="img/cta-img.png" />
    </div>

    {/* Heading Text */}
    <h2 className="text-white font-bold text-center text-4xl pt-10 ml-60">
      Stay Connected With World's First Credit Risk <br />
      Platform for Pharma & Healthcare Distribution
    </h2>
  </div>
</section>


<footer className="bg-[#18185E] py-16 px-6 lg:py-24">
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
            {['about', 'features', 'BlogList', 'FAQ\'S', 'contactUs'].map((section, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(section)}
                className="flex items-center text-white/90 hover:text-white group w-full"
              >
                <span className="text-lg mr-2 group-hover:translate-x-1 transition-transform">→</span>
                <span className="text-sm font-medium">{section.charAt(0).toUpperCase() + section.slice(1)}</span>
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
                  onClick={()=>navigate('/PrivacyPolicy')}
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
      <div className="footer-bottom bg-gray-800 text-white py-6">
  <div className="container mx-auto px-4">
    <div className="footer-wrapper flex flex-col sm:flex-row items-center justify-between">
      <p className="text-gray-400 fadeInLeft" style={{ animationDelay: '.3s' }}>
        © All Copyright 2024 by MedScore
      </p>
      <ul className="footer-menu flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 fadeInRight" style={{ animationDelay: '.5s' }}>
        <li>
          <button  className="text-gray-400 hover:text-white transition duration-300" onClick={()=>navigate('/TermsConditions')}>
            Terms & Condition
          </button>
        </li>
        <li>
          <button onClick={()=>navigate('/PrivacyPolicy')} className="text-gray-400 hover:text-white transition duration-300">
            Privacy Policy
          </button>
        </li>
      </ul>
    </div>
  </div>
</div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-1/2 p-3 rounded-full bg-blue-600 text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowUp 
            className="h-6 w-6 transition-transform duration-300 group-hover:-translate-y-1 " 
          />
        </button>
      )}
    </div>
  );
};

export default Home;