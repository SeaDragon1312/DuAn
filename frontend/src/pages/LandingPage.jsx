import React from "react";
import { SignInButton } from "@clerk/clerk-react";
import "../css/LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="content">
        <h1>Welcome to Our App</h1>
        <p>Your one-stop solution for amazing features.</p>
        <SignInButton>
          <button className="sign-in-button">Sign In</button>
        </SignInButton>
      </div>
    </div>
  );
}

export default LandingPage;