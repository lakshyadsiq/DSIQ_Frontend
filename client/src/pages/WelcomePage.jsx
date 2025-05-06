import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Card, CardTitle, CardBody } from '@progress/kendo-react-layout';
import { Link } from 'react-router-dom';

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
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <h1 className="text-5xl font-bold mb-4 text-blue-800">Welcome to DSIQ</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Decode retail data into strategic insights. Monitor products, analyze reviews, and drive brand performance.
        </p>
        <div className="space-x-4">
          <Link to="/login">
            <Button primary={true}>Agency Login</Button>
          </Link>
          <Link to="/login">
            <Button>Brand Login</Button>
          </Link>
        </div>
      </div>

      {/* Login Options Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x bg-white py-12 px-6 md:px-24">
        {/* Agency Section */}
        <div className="text-center p-8">
          <span className="text-sm font-semibold uppercase text-gray-500">Agency Access</span>
          <h2 className="text-2xl font-bold mt-2 mb-4">For <span className="italic">Agencies</span></h2>
          <p className="text-gray-600 mb-6">
            Analyze multiple brands, manage clients, and provide strategic retail intelligence.
          </p>
          <Link to="/login">
            <Button themeColor="dark">Login</Button>
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-green-600 font-medium">Sign up</Link>
          </p>
        </div>

        {/* Brand Section */}
        <div className="text-center p-8">
          <span className="text-sm font-semibold uppercase text-gray-500">Brand Access</span>
          <h2 className="text-2xl font-bold mt-2 mb-4">For <span className="italic">Brands</span></h2>
          <p className="text-gray-600 mb-6">
            Track your product performance, monitor reviews, and optimize your retail presence.
          </p>
          <Link to="/login">
            <Button fillMode="outline">Login</Button>
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-600 font-medium">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Partner Companies */}
      <div className="bg-white py-10">
        <h2 className="text-3xl font-semibold text-center mb-6">Our Data Partners</h2>
        <div className="flex flex-wrap justify-center gap-8 px-4">
          {partners.map((partner, idx) => (
            <div key={idx} className="text-lg font-medium text-gray-700 border px-6 py-2 rounded-md shadow-sm bg-gray-100">
              {partner}
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-gray-100 py-12">
        <h2 className="text-3xl font-semibold text-center mb-10">What We Offer</h2>
        <div className="flex flex-wrap justify-center gap-6 px-6">
          {services.map((service, index) => (
            <Card key={index} style={{ width: 300 }} className="shadow-md">
              <CardBody>
                <CardTitle>{service.title}</CardTitle>
                <p className="mt-2 text-sm text-gray-600">{service.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
