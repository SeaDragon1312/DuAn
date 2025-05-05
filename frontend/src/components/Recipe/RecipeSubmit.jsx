import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../output.css";
import WarningIcon from '../../assets/WarningIcon.jsx';
import HealthIcon from '../../assets/HealthIcon.jsx';
import { useUser } from "@clerk/clerk-react";

const RecipeSubmit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const { user, isLoaded } = useUser();
  const [procedure, setProcedure] = useState('');
  const [aiSectionOpen, setAiSectionOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    dietType: 'Vegetarian',
    prepTime: '',
    description: '',
    healthImpact: '',
    healthScore: 8,
    allergyInfo: '',
    ingredients: {
      veggiesAndFruits: [''],
      dairy: [''],
      spicesAndCondiments: ['']
    },
    steps: ['']
  });

  // Handle AI Recipe Generation
  const handleGenerateRecipe = async () => {
    if (!formData.title.trim() || !procedure.trim()) {
      alert("Please enter a recipe title and procedure first");
      return;
    }
    
    setAiLoading(true);
    
    try {
      // Call the generative recipe API
      const aiResponse = await axios.post('http://localhost:8080/gemini/generative-recipe', {
        dishName: formData.title,
        procedure: procedure
      });
      
      const recipeData = aiResponse.data;
      
      // Update ingredients by categories
      const allIngredients = recipeData.ingredients || [];
      const veggiesAndFruits = [];
      const dairy = [];
      const spicesAndCondiments = [];
      
      // Categorize ingredients (simple approach)
      allIngredients.forEach(ingredient => {
        const lowerIngredient = ingredient.toLowerCase();
        if (lowerIngredient.includes('milk') || 
            lowerIngredient.includes('cream') || 
            lowerIngredient.includes('cheese') || 
            lowerIngredient.includes('yogurt') || 
            lowerIngredient.includes('butter')) {
          dairy.push(ingredient);
        } else if (lowerIngredient.includes('salt') || 
                  lowerIngredient.includes('pepper') || 
                  lowerIngredient.includes('spice') || 
                  lowerIngredient.includes('oil') || 
                  lowerIngredient.includes('sauce') || 
                  lowerIngredient.includes('sugar') ||
                  lowerIngredient.includes('vinegar')) {
          spicesAndCondiments.push(ingredient);
        } else {
          veggiesAndFruits.push(ingredient);
        }
      });
      
      // Ensure arrays aren't empty
      if (veggiesAndFruits.length === 0) veggiesAndFruits.push('');
      if (dairy.length === 0) dairy.push('');
      if (spicesAndCondiments.length === 0) spicesAndCondiments.push('');
      
      // Update form data with AI generated content
      setFormData({
        ...formData,
        description: recipeData.introduction || formData.description,
        healthImpact: recipeData.healthImpact || formData.healthImpact,
        healthScore: recipeData.healthScore || formData.healthScore,
        allergyInfo: recipeData.allergyWarning || formData.allergyInfo,
        dietType: recipeData.dietType || formData.dietType,
        prepTime: recipeData.preparationTime || formData.prepTime,
        steps: recipeData.steps?.length ? recipeData.steps : [''],
        ingredients: {
          veggiesAndFruits,
          dairy,
          spicesAndCondiments
        }
      });

      setImagePreview(`https://duan-1jwf.onrender.com/api/image/get?id=${recipeData.imageId}`);

      alert("Recipe successfully generated with AI!");
      
    } catch (error) {
      console.error('Error generating recipe with AI:', error.response?.data || error.message);
      alert('Failed to generate recipe with AI. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle procedure input change
  const handleProcedureChange = (e) => {
    setProcedure(e.target.value);
  };

  // Handle diet type change
  const handleDietTypeChange = (e) => {
    setFormData({ ...formData, dietType: e.target.value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle ingredient changes
  const handleIngredientChange = (category, index, value) => {
    const updatedIngredients = { ...formData.ingredients };
    updatedIngredients[category][index] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  // Add new ingredient field
  const addIngredientField = (category) => {
    const updatedIngredients = { ...formData.ingredients };
    updatedIngredients[category] = [...updatedIngredients[category], ''];
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  // Remove ingredient field
  const removeIngredientField = (category, index) => {
    if (formData.ingredients[category].length > 1) {
      const updatedIngredients = { ...formData.ingredients };
      updatedIngredients[category] = updatedIngredients[category].filter((_, i) => i !== index);
      setFormData({ ...formData, ingredients: updatedIngredients });
    }
  };

  // Handle step changes
  const handleStepChange = (index, value) => {
    const updatedSteps = [...formData.steps];
    updatedSteps[index] = value;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleHealthScoreChange = (e) => {
    const score = parseInt(e.target.value, 10);
    setFormData({ ...formData, healthScore: score });
  };

  // Add new step field
  const addStepField = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  // Remove step field
  const removeStepField = (index) => {
    if (formData.steps.length > 1) {
      const updatedSteps = formData.steps.filter((_, i) => i !== index);
      setFormData({ ...formData, steps: updatedSteps });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate form before submission
    setLoading(true);

    if (!isLoaded || !user) {
      alert("You need to be logged in to submit recipes");
      setLoading(false);
      return;
    }
    
    try {
      const userId = user.id
      
      const allIngredients = [
        ...formData.ingredients.veggiesAndFruits,
        ...formData.ingredients.dairy,
        ...formData.ingredients.spicesAndCondiments
      ].filter(item => item.trim() !== '');

      // Format the data for the API
      const recipeData = {
        healthImpact: formData.healthImpact,
        preparationTime: formData.prepTime,
        isPublished: true,
        dishName: formData.title,
        userId: userId,
        stepList: formData.steps.filter(step => step.trim() !== ''),
        dietType: formData.dietType,
        ingredientList: allIngredients,
        healthScore: formData.healthScore,
        introduction: formData.description,
        allergyWarning: formData.allergyInfo,
      };
  
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      
      // Append the recipe data as a JSON string
      formDataToSend.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
      
      // Get the image file from the imagePreview
      if (imagePreview) {
        // Convert dataURL to file
        const fetchRes = await fetch(imagePreview);
        const blob = await fetchRes.blob();
        formDataToSend.append('image', blob, 'recipe-image.jpg');
      }
  
      // Send the request
      const response = await axios.post(
        'https://duan-1jwf.onrender.com/api/recipe/manual/add',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        }
      );
  
      console.log('Recipe submitted successfully:', response.data);

      alert('Recipe submitted successfully!');
      
      navigate(`/recipe/my-recipes`);
      
    } catch (error) {
      const userId = user.id
      
      const allIngredients = [
        ...formData.ingredients.veggiesAndFruits,
        ...formData.ingredients.dairy,
        ...formData.ingredients.spicesAndCondiments
      ].filter(item => item.trim() !== '');

      // Format the data for the API
      const recipeData = {
        healthImpact: formData.healthImpact,
        preparationTime: formData.prepTime,
        isPublished: true,
        dishName: formData.title,
        userId: userId,
        stepList: formData.steps.filter(step => step.trim() !== ''),
        dietType: formData.dietType,
        ingredientList: allIngredients,
        healthScore: formData.healthScore,
        introduction: formData.description,
        allergyWarning: formData.allergyInfo,
      };
      const formDataToSend = new FormData();
      
      // Append the recipe data as a JSON string
      formDataToSend.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
      
      // Get the image file from the imagePreview
      if (imagePreview) {
        // Convert dataURL to file
        const fetchRes = await fetch(imagePreview);
        const blob = await fetchRes.blob();
        formDataToSend.append('image', blob, 'recipe-image.jpg');
      }
      console.error('Error submitting recipe:', error.response?.data || error.message);
      console.log('data:', recipeData);
      console.log('imagePreview:', imagePreview);
      console.log('formDataToSend:', formDataToSend);
      alert('Failed to submit recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Update the handleSaveDraft function with similar approach
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const userId = user.id;

      const allIngredients = [
        ...formData.ingredients.veggiesAndFruits,
        ...formData.ingredients.dairy,
        ...formData.ingredients.spicesAndCondiments
      ].filter(item => item.trim() !== '');
      
      // Format the data for the API
      const recipeData = {
        healthImpact: formData.healthImpact,
        preparationTime: formData.prepTime,
        isPublished: false,
        dishName: formData.title,
        userId: userId,
        stepList: formData.steps.filter(step => step.trim() !== ''),
        dietType: formData.dietType,
        ingredientList: allIngredients,
        healthScore: formData.healthScore,
        introduction: formData.description,
        allergyWarning: formData.allergyInfo,
      };
  
      // Create FormData object for multipart/form-data
      const formDataToSend = new FormData();
      
      // Append the recipe data as a JSON string
      formDataToSend.append('recipe', new Blob([JSON.stringify(recipeData)], { type: 'application/json' }));
      
      // Get the image file from the imagePreview
      if (imagePreview) {
        // Convert dataURL to file
        const fetchRes = await fetch(imagePreview);
        const blob = await fetchRes.blob();
        formDataToSend.append('image', blob, 'recipe-image.jpg');
      }
  
      // Send the request to save as draft
      // You might need a different endpoint for drafts
      const response = await axios.post(
        'https://duan-1jwf.onrender.com/api/recipe/manual/add', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('Recipe draft saved successfully:', response.data);
      alert('Recipe draft saved successfully!');

      navigate(`/recipe/my-recipes`);
      
    } catch (error) {
      console.error('Error saving draft:', error.response?.data || error.message);
      alert('Failed to save draft. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render ingredient input fields by category
  const renderIngredientFields = (category) => {
    return formData.ingredients[category].map((ingredient, index) => (
      <div key={`${category}-${index}`} className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          value={ingredient}
          onChange={(e) => handleIngredientChange(category, index, e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Add ${category} item`}
        />
        <button
          type="button"
          onClick={() => removeIngredientField(category, index)}
          className="p-2 text-red-500 hover:bg-red-100 rounded-full"
          disabled={formData.ingredients[category].length <= 1}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back button at top */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Link>
        </div>
      </div>

      {/* Header section with dark background */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-12 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-3 leading-tight">Share Your Recipe</h1>
          <p className="mb-4 text-gray-300 text-lg">Share your culinary creations with our community of food lovers</p>
        </div>
      </div>
      
      {/* Main form content */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* AI Recipe Generator */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <div 
              className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 cursor-pointer"
              onClick={() => setAiSectionOpen(!aiSectionOpen)}
            >
              <div className="mb-4 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Recipe Generator</h2>
                <p className="text-gray-600">Too busy to find pictures, think of health benefits and other stuff? Just fill in the recipe title and things you need to note about the dish, our AI will do the rest!</p>
                <p className="text-green-600">Just click here!</p>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <img src="/images/ai-chef.svg" alt="AI Chef" className="w-24 h-24 mr-2" onError={(e) => {e.target.style.display = 'none'}} />
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-gray-600 transform transition-transform duration-300" 
                  style={{ transform: aiSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            
            {/* AI Generator content - only shown when aiSectionOpen is true */}
            {aiSectionOpen && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
                    <input
                      type="text"
                      id="ai-title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter recipe title"
                    />
                  </div>
                  <div className="md:col-span-2 mb-2">
                    <label htmlFor="procedure" className="block text-sm font-medium text-gray-700 mb-1">Procedures (To help AI understand your recipes better)</label>
                    <textarea
                      id="procedure"
                      name="procedure"
                      value={procedure}
                      onChange={handleProcedureChange}
                      rows="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Briefly describe how to make this dish (optional)"
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={handleGenerateRecipe}
                    className="inline-flex items-center px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors cursor-pointer"
                    disabled={aiLoading}
                  >
                    {aiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Generating Recipe...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Basic Recipe Information */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Recipe Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a catchy title for your recipe"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dietType" className="block text-sm font-medium text-gray-700 mb-1">Diet Type</label>
                    <select
                      id="dietType"
                      value={formData.dietType}
                      onChange={handleDietTypeChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">Preparation Time</label>
                    <input
                      type="text"
                      id="prepTime"
                      name="prepTime"
                      value={formData.prepTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 25 mins"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your recipe and what makes it special"
                    required
                  ></textarea>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipe Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors">
                  {imagePreview ? (
                    <div className="relative w-full" style={{ width: '100%', paddingBottom: '100%' }}>
                      <img 
                        src={imagePreview} 
                        alt="Recipe preview" 
                        className="absolute inset-0 w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full text-white hover:bg-opacity-70"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-500 text-center mb-2">Drag and drop an image here, or click to select</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="recipe-image"
                      />
                      <label
                        htmlFor="recipe-image"
                        className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md transition-colors cursor-pointer"
                      >
                        Select Image
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Health and Allergy Information */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Health Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center mb-4">
                  <span className="p-2 rounded-full mr-3">
                    <HealthIcon />
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">Health Impact</h3>
                </div>
                <textarea
                  id="healthImpact"
                  name="healthImpact"
                  value={formData.healthImpact}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe any health benefits or concerns related to your recipe"
                ></textarea>

                {/* Health Score Slider */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="healthScore" className="block text-sm font-medium text-gray-700">Health Score (1-10)</label>
                    <span className={`text-lg font-semibold ${formData.healthScore <= 5 ? 'text-red-600' : 'text-green-600'}`}>
                      {formData.healthScore}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      id="healthScore"
                      name="healthScore"
                      min="1"
                      max="10"
                      value={formData.healthScore}
                      onChange={handleHealthScoreChange}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, 
                          ${formData.healthScore <= 5 ? '#f87171' : '#10b981'} 0%, 
                          ${formData.healthScore <= 5 ? '#f87171' : '#10b981'} ${(formData.healthScore / 10) * 100}%, 
                          #e5e7eb ${(formData.healthScore / 10) * 100}%, 
                          #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>2</span>
                      <span>3</span>
                      <span>4</span>
                      <span>5</span>
                      <span>6</span>
                      <span>7</span>
                      <span>8</span>
                      <span>9</span>
                      <span>10</span>
                    </div>
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-red-600">Less Healthy</span>
                      <span className="text-green-600">Very Healthy</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-4">
                  <span className="p-2 rounded-full mr-3">
                    <WarningIcon />
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">Allergy Information</h3>
                </div>
                <textarea
                  id="allergyInfo"
                  name="allergyInfo"
                  value={formData.allergyInfo}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="List any common allergens in your recipe (e.g., dairy, nuts, gluten)"
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Ingredients</h2>
            
            <div className="space-y-8">
              {/* Veggies & Fruits */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-green-500 rounded-r inline-block mr-3"></span>
                  Veggies & Fruits
                </h3>
                {renderIngredientFields('veggiesAndFruits')}
                <button
                  type="button"
                  onClick={() => addIngredientField('veggiesAndFruits')}
                  className="mt-2 inline-flex items-center px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Item
                </button>
              </div>
              
              {/* Dairy */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-yellow-400 rounded-r inline-block mr-3"></span>
                  Dairy
                </h3>
                {renderIngredientFields('dairy')}
                <button
                  type="button"
                  onClick={() => addIngredientField('dairy')}
                  className="mt-2 inline-flex items-center px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Item
                </button>
              </div>
              
              {/* Spices and Condiments */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-r inline-block mr-3"></span>
                  Spices, condiments, nuts & everything else
                </h3>
                {renderIngredientFields('spicesAndCondiments')}
                <button
                  type="button"
                  onClick={() => addIngredientField('spicesAndCondiments')}
                  className="mt-2 inline-flex items-center px-3 py-1.5 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Item
                </button>
              </div>
            </div>
          </div>
          
          {/* Steps */}
          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Cooking Steps</h2>
            
            <div className="space-y-4">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 flex-shrink-0 mt-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start space-x-2">
                      <textarea
                        value={step}
                        onChange={(e) => handleStepChange(index, e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Step ${index + 1} instructions`}
                        rows="2"
                      ></textarea>
                      <button
                        type="button"
                        onClick={() => removeStepField(index)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full"
                        disabled={formData.steps.length <= 1}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addStepField}
                className="inline-flex items-center px-4 py-2 mt-4 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Step
              </button>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-600 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Saving Draft...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save Draft
                </>
              )}
            </button>

            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Publishing Recipe...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Share Recipe
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Share Your Best Recipes • Food Blog</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeSubmit;