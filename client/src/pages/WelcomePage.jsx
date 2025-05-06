import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const WelcomePage = () => {
  const services = [
    {
      title: "Product & Category Tracking",
      description: "Scrape and monitor products, categories, and listing changes from top retailers.",
    },
    {
      title: "Review & Sentiment Analysis",
      description: "Analyze customer reviews to extract sentiment, key feedback, and product perception.",
    },
    {
      title: "Sales & Rank Insights",
      description: "Understand product performance, estimate sales, and monitor search rankings.",
    },
  ];

  const partners = [
    "Amazon", "eBay", "Walmart", "Target", "BestBuy"
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar isLoggedIn={false} /> {/* Pass the isLoggedIn prop as needed */}

      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center h-screen text-center px-6 bg-gradient-to-br from-indigo-50 to-purple-100 overflow-hidden">
        {/* Decorative Background Circles */}
        <div className="absolute -top-24 -left-20 w-72 h-72 bg-blue-100 rounded-full opacity-30 z-0 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-100 rounded-full opacity-30 z-0 blur-3xl" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight drop-shadow-lg">
            Know Your Market. <br className="hidden md:inline" /> <span className="text-green-600">Know Your Move.</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 mt-4 mb-8 italic">
            Empowering smarter decisions with deep retail intelligence — Welcome to <span className="font-semibold text-blue-700">DSIQ</span>.
          </p>
          <p className="text-lg sm:text-xl text-gray-700 mt-6 mb-10">
            Decode retail data into actionable insights. Monitor trends, track products, and grow smarter.
          </p>
        </div>
      </div>

      {/* Login Options Section */}
      <div className="bg-white py-16 px-6 md:px-24">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-gray-800 mb-12">Choose Your Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Agency Card */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition duration-300 ease-in-out">
            <div className="text-sm font-semibold uppercase text-blue-500 mb-2">Agency Access</div>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">For <span className="italic text-blue-800">Agencies</span></h3>
            <p className="text-gray-600 mb-6">
              Analyze multiple brands, manage clients, and deliver retail intelligence at scale.
            </p>
            <Link to="/login">
              <Button
                themeColor="primary"
                size="large"
                rounded="full"
                className="px-6 py-2 shadow hover:shadow-md"
              >
                Login
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-green-600 font-medium hover:underline">Sign up</Link>
            </p>
          </div>

          {/* Brand Card */}
          <div className="bg-gray-50 p-8 rounded-2xl shadow-md text-center hover:shadow-lg transition duration-300 ease-in-out">
            <div className="text-sm font-semibold uppercase text-green-500 mb-2">Brand Access</div>
            <h3 className="text-2xl sm:text-3xl font-semibold mb-4">For <span className="italic text-green-800">Brands</span></h3>
            <p className="text-gray-600 mb-6">
              Track performance, monitor reviews, and optimize your retail strategy.
            </p>
            <Link to="/login">
              <Button
                fillMode="outline"
                size="large"
                rounded="full"
                className="px-6 py-2 border-2 border-green-500 text-green-700 hover:bg-green-100 shadow"
              >
                Login
              </Button>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-green-600 font-medium hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Partner Companies */}
      <div className="bg-white py-16 px-6 md:px-24">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center text-gray-800 mb-10">Our Data Partners</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 justify-items-center">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="w-full text-center bg-gray-50 px-4 py-3 rounded-xl shadow hover:shadow-md transition duration-300 ease-in-out"
            >
              <span className="text-lg font-semibold text-gray-700">{partner}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-16">
        <h2 className="text-4xl sm:text-5xl font-bold text-center text-blue-800 mb-12">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                  {service.title.charAt(0)}
                </div>
                <h3 className="ml-4 text-xl sm:text-2xl font-semibold text-gray-800">
                  {service.title}
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default WelcomePage;
