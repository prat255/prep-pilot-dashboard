
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-jee-primary to-jee-secondary flex items-center justify-center text-white font-bold">
                J+
              </div>
              <span className="text-xl font-bold jee-gradient-text">JEETracker+</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Your all-in-one platform to track, analyze, and improve your JEE preparation journey.
              Stay organized, monitor progress, and achieve your dream rank.
            </p>
          </div>
          
          <div className="md:ml-8">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/tests" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  Mock Tests
                </Link>
              </li>
              <li>
                <Link to="/revisions" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  Revisions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Connect With Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-jee-primary dark:hover:text-jee-accent transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} JEETracker+. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
