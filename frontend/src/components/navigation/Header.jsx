import React from 'react';
import {
    UserButton,
  } from "@clerk/clerk-react";
import "../../output.css";
const Header = () => {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Logo */}
          <div className="flex items-center space-x-2">
            <a href="/" className="flex items-center space-x-2">
              <svg width="32" height="32" viewBox="0 0 100 100" className="text-purple-600">
                <circle cx="50" cy="50" r="45" fill="currentColor" />
                <path 
            d="M30 50 L50 30 L70 50 L50 70 Z" 
            fill="white"
                />
              </svg>
              <span className="text-xl font-bold text-gray-800">MasterChefs</span>
            </a>
          </div>

          {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4 ml-8">
          <a href="/" className="text-gray-600 hover:text-purple-600 transition">Home</a>
          <a href="#" className="text-gray-600 hover:text-purple-600 transition">Payment</a>
          <a href="#" className="text-gray-600 hover:text-purple-600 transition">Features</a>
        </nav>
      </div>

      {/* Authentication Buttons */}
      <div className="flex items-center space-x-4">
        {/* <a href="#" className="text-gray-600 hover:text-purple-600 transition">
          Login
        </a>
        <Button variant="default" className="bg-purple-600 hover:bg-purple-700 text-white">
          Sign Up
        </Button> */}
        <UserButton />
      </div>
    </header>
  );
};

export default Header;