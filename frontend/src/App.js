import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import Index from "./pages/index";
import HomePage from "./pages/HomePage";
import "./App.css";
import DefaultLayout from "./layouts/DefaultLayout";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import RecipeView from "./components/Recipe/RecipeView";
import RecipeSubmit from "./components/Recipe/RecipeSubmit";
import MyRecipes from "./components/Recipe/MyRecipes";
import RecipeEdit from "./components/Recipe/RecipeEdit";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import ExampleProvider from "./providers/ExampleProvide";
import LandingPage from "./pages/LandingPage";
import "../src/output.css";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <ExampleProvider>
        <BrowserRouter>
          <SignedIn>
            <Routes>
              <Route
                path="/"
                element={
                  <DefaultLayout>
                    <HomePage />
                  </DefaultLayout>
                }
              />
              <Route
                path="/about"
                element={
                  <DefaultLayout>
                    <AboutPage />
                  </DefaultLayout>
                }
              />
              <Route
                path="/contact"
                element={
                  <DefaultLayout>
                    <ContactPage />
                  </DefaultLayout>
                }
              />
              <Route
                path="/recipe/view/:id"
                element={
                  <DefaultLayout>
                    <RecipeView />
                  </DefaultLayout>
                }
              />
              <Route
                path="/recipe/submit"
                element={
                  <DefaultLayout>
                    <RecipeSubmit />
                  </DefaultLayout>
                }
              />
              <Route
                path="/recipe/my-recipes"
                element={
                  <DefaultLayout>
                    <MyRecipes />
                  </DefaultLayout>
                }
              />
              <Route
                path="/recipe/edit/:id"
                element={
                  <DefaultLayout>
                    <RecipeEdit />
                  </DefaultLayout>
                }
              />
            </Routes>
          </SignedIn>
          <SignedOut>
            {/* <SignInButton /> */}
            <LandingPage />
          </SignedOut>
        </BrowserRouter>
      </ExampleProvider>
    </ClerkProvider>
  );
}

export default App;
