import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MapPin, Star, Shield, Bell, BarChart, Database, Headphones } from 'lucide-react';

export const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('jwttoken') !== null;
    
    const handleLogout = () => {
        localStorage.removeItem('jwttoken');
        localStorage.removeItem('userId');
        window.location.href = '/';
    };
    
    const handleRegister = () => {
        navigate("/register");
    };

    const features = [
        { icon: <BarChart className="w-6 h-6 text-blue-600" />, title: "Comprehensive Dashboard" },
        { icon: <Star className="w-6 h-6 text-blue-600" />, title: "Custom Reports & Insights" },
        { icon: <Bell className="w-6 h-6 text-blue-600" />, title: "Real-Time Alerts" },
        { icon: <Shield className="w-6 h-6 text-blue-600" />, title: "Data Security" },
        { icon: <Headphones className="w-6 h-6 text-blue-600" />, title: "24/7 Support" },
        { icon: <Database className="w-6 h-6 text-blue-600" />, title: "API Access" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Enhanced Header */}
            <header className="sticky top-0 z-50 bg-white/95 shadow-md backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-26">
                        <img 
                            src="/medscorelogo.jpeg" 
                            alt="logo" 
                            className="w-24 h-auto object-contain hover:scale-105 transition-all duration-300"
                        />
                        <div className="flex gap-4">
                            {isLoggedIn ? (
                                <button 
                                    onClick={handleLogout}
                                    className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300"
                                >
                                    Logout
                                </button>
                            ) : (
                                <button 
                                    onClick={handleRegister}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                                >
                                    Register
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Enhanced Hero Section with CSS-only background */}
            <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 py-32">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)]"></div>
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold text-white mb-8 leading-tight">
                            World's First Credit Score Platform
                            <span className="block text-blue-200">for Medical Shops</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
                            Revolutionizing credit risk management for the pharmaceutical industry.
                            MedScore gives distributors reliable data to assess credit risks.
                        </p>
                        <div className="flex justify-center gap-6">
                            <button 
                                onClick={() => navigate('/login')}
                                className="group px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center"
                            >
                                Get Started
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button 
                                onClick={() => navigate('/LearnMore')}
                                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced About Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        What is <span className="text-blue-600">MedScore</span>?
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "For Distributors",
                                description: "Evaluate the creditworthiness of medical shops to lower the risk of defaults.",
                                gradient: "from-blue-500 to-blue-700"
                            },
                            {
                                title: "For Medical Shops",
                                description: "Build a transparent credit profile to access better terms and strengthen relationships.",
                                gradient: "from-blue-600 to-blue-800"
                            }
                        ].map((card, index) => (
                            <div key={index} 
                                className={`group relative overflow-hidden rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 bg-gradient-to-br ${card.gradient}`}
                            >
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-semibold text-white mb-4">{card.title}</h3>
                                    <p className="text-blue-100">{card.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Features Section */}
            <section className="py-24 bg-blue-50/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        Powerful <span className="text-blue-600">Features</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} 
                                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="mb-4 p-3 bg-blue-50 rounded-lg w-fit">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Testimonials Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        What Our <span className="text-blue-600">Users Say</span>
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                text: "MedScore has become an essential tool for our distribution business. It helps us identify credit risks early and manage cash flow better than ever.",
                                author: "Rajesh P.",
                                role: "Pharmaceutical Distributor"
                            },
                            {
                                text: "We never realized how important our credit score was to getting better terms from distributors. MedScore made it easy to track and improve.",
                                author: "Neha K.",
                                role: "Medical Shop Owner"
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
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
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Contact Section */}
            <section className="py-24 bg-blue-50/50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                        Get in <span className="text-blue-600">Touch</span>
                    </h2>
                    <div className="bg-white rounded-2xl p-8 shadow-xl">
                        {[
                            { icon: <Mail className="w-6 h-6" />, label: "Email", value: "support@medscore.in", href: "mailto:support@medscore.in" },
                            { icon: <Phone className="w-6 h-6" />, label: "Phone", value: "04046025805", href: "tel:04046025805" },
                            { icon: <MapPin className="w-6 h-6" />, label: "Location", value: "Dilshuknagar, Hyderabad-500059" }
                        ].map((contact, index) => (
                            <div key={index} className="flex items-center gap-4 mb-6 last:mb-0">
                                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                    {contact.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">{contact.label}</p>
                                    {contact.href ? (
                                        <a href={contact.href} className="text-blue-600 hover:text-blue-700 font-medium">
                                            {contact.value}
                                        </a>
                                    ) : (
                                        <p className="text-gray-900 font-medium">{contact.value}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;