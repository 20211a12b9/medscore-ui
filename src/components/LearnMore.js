import React, { useState } from 'react';
import { 
  CheckCircle, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  BarChart2, 
  ArrowRight,
  Star,
  Users,
  Building2
} from 'lucide-react';

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-xl shadow-lg ${className}`} {...props}>
    {children}
  </div>
);

export const LearnMore = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      title: "Comprehensive Dashboard",
      icon: <BarChart2 className="w-8 h-8 text-blue-600" />,
      description: "Access detailed real-time credit scores and financial health indicators with our intuitive dashboard"
    },
    {
      title: "Custom Reports & Insights",
      icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
      description: "Get comprehensive credit reports with AI-powered insights for smarter decision-making"
    },
    {
      title: "Real-Time Alerts",
      icon: <AlertCircle className="w-8 h-8 text-blue-600" />,
      description: "Stay informed about score changes and potential risks with instant notifications"
    },
    {
      title: "Data Security",
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      description: "Bank-grade encryption and security protocols to protect your sensitive financial data"
    }
  ];

  const benefits = {
    distributors: [
      "Make data-driven credit decisions",
      "Reduce payment default risks",
      "Streamline business operations"
    ],
    medicalShops: [
      "Build strong credit profiles",
      "Access better financing terms",
      "Accelerate business growth"
    ]
  };

  const stats = [
    { value: "500+", label: "Medical Shops" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "24/7", label: "Support" },
    { value: "50M+", label: "Transactions Processed" }
  ];

  const howItWorks = [
    {
      title: "Connect Accounts",
      description: "Medical shops securely link their financial data through our encrypted platform",
      icon: <Users className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Analyze Data",
      description: "Our AI processes payment history and generates accurate credit scores",
      icon: <BarChart2 className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Access Insights",
      description: "Get real-time credit scores and detailed analytical insights",
      icon: <TrendingUp className="w-6 h-6 text-blue-600" />
    },
    {
      title: "Stay Updated",
      description: "Receive continuous score updates and notifications for timely decisions",
      icon: <AlertCircle className="w-6 h-6 text-blue-600" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Welcome to MedScore
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100">
              The world's first centralized platform designed to track and evaluate credit scores for medical shops.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors">
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 -mt-16">
        <Card className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`p-8 transform transition-all duration-300 hover:scale-105 ${
                hoveredFeature === index ? 'shadow-2xl' : 'shadow-lg'
              }`}
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 p-4 bg-blue-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How MedScore Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-lg">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/4 -right-4 text-blue-300 w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">Who Benefits?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Distributors Card */}
          <Card className="p-8 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-8">
              <Building2 className="w-8 h-8 text-blue-600 mr-4" />
              <h3 className="text-2xl font-bold">For Distributors</h3>
            </div>
            <ul className="space-y-6">
              {benefits.distributors.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Medical Shops Card */}
          <Card className="p-8 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-8">
              <Star className="w-8 h-8 text-blue-600 mr-4" />
              <h3 className="text-2xl font-bold">For Medical Shops</h3>
            </div>
            <ul className="space-y-6">
              {benefits.medicalShops.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of medical shops and distributors already using MedScore to make better credit decisions.
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnMore;