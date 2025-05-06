import React from 'react';
import { Button } from '@progress/kendo-react-buttons';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-12">
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* DSIQ Overview */}
                <div>
                    <h3 className="text-xl font-semibold text-white mb-4">DSIQ</h3>
                    <p className="text-sm">
                        Empowering businesses with deep retail insights through data-driven intelligence and real-time tracking.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link to="/" className="hover:text-white">Home</Link></li>
                        <li><Link to="/login" className="hover:text-white">Login</Link></li>
                        <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                    </ul>
                </div>

                {/* Services */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Services</h4>
                    <ul className="space-y-2 text-sm">
                        <li>Product Tracking</li>
                        <li>Review Analysis</li>
                        <li>Sales Insights</li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-lg font-semibold text-white mb-3">Contact</h4>
                    <p className="text-sm">Email: support@dsiq.com</p>
                    <p className="text-sm">Phone: +1 (800) 123-4567</p>
                    <p className="text-sm">Address: 123 Insight Lane, NY, USA</p>
                </div>
            </div>
            {/* for testing*/}
            <div className="border-t border-gray-700 text-center py-4 text-sm flex justify-center gap-4 ">
                <Link to="/workspaceCreate">
                    <Button
                        themeColor="primary"
                        size="large"
                        rounded="full"
                        className="px-6 py-2 "
                    >
                        Create Workshop
                    </Button>
                </Link>
                <Link to="/ModifyWorkspace">
                    <Button
                        themeColor="primary"
                        size="large"
                        rounded="full"
                        className="px-6 py-2 "
                    >
                        Modify Workshop
                    </Button>
                </Link>
            </div>

            <div className="border-t border-gray-700 text-center py-4 text-sm">
                &copy; {new Date().getFullYear()} DSIQ. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
