import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/index";
import HomePage from "./pages/HomePage";
import "./App.css";
import DefaultLayout from "./layouts/DefaultLayout";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <SignedIn>
          <UserButton />
          <Routes>
            <Route
              path="/"
              element={
                <DefaultLayout>
                  <HomePage />
                </DefaultLayout>
              }
            />
          </Routes>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;
