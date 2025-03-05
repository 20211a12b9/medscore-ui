import React from "react";
import Navbar from "./Navbar";
import { HomeNavbar } from "./HomeNavbar";

const Testimonials = () => {
  return (
    <div className="bg-gray-100  text-center">
        <HomeNavbar/>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Customer Testimonials</h2>
      <p className="text-gray-600 mb-8">
        See how our customers are benefiting from Medscore!
      </p>

      {/* Video Section */}
      <div className="max-w-3xl mx-auto">
        <video 
          className="rounded-lg shadow-lg w-full" 
          controls
        >
          <source src="ap_pharma_feedback.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <p className="mt-4 text-gray-700 italic">
        "This platform has transformed how we manage pharma distribution!" – Happy Customer
      </p>
    </div>
  );
};

export default Testimonials;
