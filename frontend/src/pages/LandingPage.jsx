import React from "react";
import "../output.css";
import { SignIn, SignInButton, SignUp, SignUpButton } from "@clerk/clerk-react";
import "../css/LandingPage.css";

function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-4 md:px-8 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <svg width="32" height="32" viewBox="0 0 100 100" className="text-purple-600">
            <circle cx="50" cy="50" r="45" fill="currentColor" />
            <path 
              d="M30 50 L50 30 L70 50 L50 70 Z" 
              fill="white"
            />
          </svg>
          <span className="text-xl font-bold text-gray-800">MaserChefs</span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-4 ml-8">
          <a href="#" className="text-gray-600 hover:text-purple-600 transition">Home</a>
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
        <SignInButton>
          <button className="sign-in-button">Sign In</button>
        </SignInButton>
        <SignUpButton>
          <button className="sign-up-button">Sign Up</button>
        </SignUpButton>
      </div>
    </header>
      
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Phần hình ảnh (bên trái) */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <div className="rounded-lg overflow-hidden shadow-xl transform transition-transform hover:scale-105">
              <img 
                src="https://vietop.edu.vn/wp-content/uploads/2023/07/idioms-chu-de-food.jpg"
                alt="App demonstration" 
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Phần nội dung (bên phải) */}
          <div className="w-full md:w-1/2 order-1 md:order-2">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Welcome to Our App
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your one-stop solution for amazing features.
            </p>
            <p className="text-gray-600 mb-8">
            We provide the best recipes today, you can share your recipes
             with the help of AI without having to struggle to find pictures to illustrate them
            </p>
            <div className="flex flex-wrap gap-4">
              <SignInButton>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
                  Get Started
                </button>
              </SignInButton>
              <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;