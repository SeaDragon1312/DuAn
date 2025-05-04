import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../output.css";
import WarningIcon from '../../assets/WarningIcon.jsx';
import HealthIcon from '../../assets/HealthIcon.jsx';
import { useUser } from "@clerk/clerk-react";

const RecipeEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const { user, isLoaded } = useUser();
  
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
    steps: [''],
    isPublished: true
  });

  // Fetch recipe data
  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setInitialLoading(true);
  
        // Fetch recipe details
        const recipeResponse = await fetch(`http://localhost:8080/api/recipe/get-by-param-id?id=${id}`);
        
        if (!recipeResponse.ok) {
          throw new Error(`Recipe API error: ${recipeResponse.status}`);
        }
  
        const recipeData = await recipeResponse.json();
        console.log('Recipe data:', recipeData);
  
        // Fetch ingredients
        const ingredientsResponse = await fetch(`http://localhost:8080/api/ingredient/recipe/get?recipeId=${id}`);
        
        if (!ingredientsResponse.ok) {
          throw new Error(`Ingredients API error: ${ingredientsResponse.status}`);
        }
  
        const ingredientsData = await ingredientsResponse.json();
        console.log('Ingredients data:', ingredientsData);
  
        // Fetch cooking steps
        const stepsResponse = await fetch(`http://localhost:8080/api/step/recipe/get?recipeId=${id}`);
        
        if (!stepsResponse.ok) {
          throw new Error(`Steps API error: ${stepsResponse.status}`);
        }
  
        const stepsData = await stepsResponse.json();
        console.log('Steps data:', stepsData);
  
        // Categorize ingredients
        const categorizedIngredients = categorizeIngredients(ingredientsData);
  
        // Set image preview if available
        if (recipeData.image?.id) {
          setImagePreview(`http://localhost:8080/api/image/get?id=${recipeData.image.id}`);
        }
        
        // Update form data with fetched recipe
        setFormData({
          title: recipeData.dishName || '',
          dietType: recipeData.dietType || 'Vegetarian',
          prepTime: recipeData.preparationTime || '',
          description: recipeData.introduction || '',
          healthImpact: recipeData.healthImpact || '',
          healthScore: recipeData.healthScore || 8,
          allergyInfo: recipeData.allergyWarning || '',
          ingredients: {
            veggiesAndFruits: categorizedIngredients.veggiesAndFruits.length > 0 ? 
              categorizedIngredients.veggiesAndFruits : [''],
            dairy: categorizedIngredients.dairy.length > 0 ? 
              categorizedIngredients.dairy : [''],
            spicesAndCondiments: categorizedIngredients.spicesAndCondiments.length > 0 ? 
              categorizedIngredients.spicesAndCondiments : ['']
          },
          steps: stepsData.length > 0 ? stepsData.map(step => step.description) : [''],
          isPublished: recipeData.isPublished !== undefined ? recipeData.isPublished : true
        });
        
        setInitialLoading(false);
      } catch (error) {
        console.error('Error fetching recipe data:', error);
        alert('Failed to load recipe. Please try again.');
        navigate('/recipe/my-recipes');
        setInitialLoading(false);
      }
    };
  
    fetchRecipeData();
  }, [id, navigate]);

  const categorizeIngredients = (ingredientsList) => {
    // Default categories
    const categories = {
      veggiesAndFruits: [],
      dairy: [],
      spicesAndCondiments: []
    };
  
    // Keywords to identify vegetable and fruit ingredients
    const veggieKeywords = ['vegetable', 'tomato', 'onion', 'carrot', 'garlic', 
      'scallion', 'herb', 'pepper', 'chili', 'lettuce', 'spinach', 'kale', 
      'cilantro', 'basil', 'mint', 'lemon', 'lime', 'orange', 'apple', 'bean', 
      'sprout', 'cabbage', 'cucumber', 'ginger', 'broccoli', 'fruit'];
  
    // Keywords to identify dairy ingredients
    const dairyKeywords = ['milk', 'cheese', 'yogurt', 'cream', 'butter', 'dairy'];
  
    ingredientsList.forEach(ingredient => {
      const name = ingredient.name.toLowerCase();
  
      // Check if ingredient is a veggie or fruit
      if (veggieKeywords.some(keyword => name.includes(keyword))) {
        categories.veggiesAndFruits.push(ingredient.name);
      }
      // Check if ingredient is dairy
      else if (dairyKeywords.some(keyword => name.includes(keyword))) {
        categories.dairy.push(ingredient.name);
      }
      // Everything else goes to spices and condiments
      else {
        categories.spicesAndCondiments.push(ingredient.name);
      }
    });
    return categories;
    };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  // Handle publishing status change
  const handlePublishStatusChange = (e) => {
    setFormData({ ...formData, isPublished: e.target.checked });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isLoaded || !user) {
      alert("You need to be logged in to update recipes");
      setLoading(false);
      return;
    }
    
    try {
      const userId = user.id;
      
      const allIngredients = [
        ...formData.ingredients.veggiesAndFruits,
        ...formData.ingredients.dairy,
        ...formData.ingredients.spicesAndCondiments
      ].filter(item => item.trim() !== '');

      // Format the data for the API
      const updatedRecipe = {
        healthImpact: formData.healthImpact,
        preparationTime: formData.prepTime,
        isPublished: formData.isPublished,
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
      
      formDataToSend.append('recipeId', id);
      // Append the recipe data as a JSON string
      formDataToSend.append('updatedRecipe', new Blob([JSON.stringify(updatedRecipe)], { type: 'application/json' }));
      
      // Get the image file from the imagePreview
      if (imagePreview) {
        // Check if it's a new image (starts with data:) or an existing one (URL)
        if (imagePreview.startsWith('data:')) {
          // Convert dataURL to file
          const fetchRes = await fetch(imagePreview);
          const blob = await fetchRes.blob();
          formDataToSend.append('image', blob, 'recipe-image.jpg');
        } else {
          // For existing images, only include if it's been changed
          // This is left empty as the server will keep the existing image
        }
      }

    console.log('Sending update with recipeId:', id);
    console.log('Updated Recipe data:', updatedRecipe);
  
      // Send the request to update recipe
      const response = await axios.post(
        `http://localhost:8080/api/recipe/update`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          },
        }
      );
  
      console.log('Recipe updated successfully:', response.data);
      alert('Recipe updated successfully!');
      navigate(`/recipe/my-recipes`);
      
    } catch (error) {
      console.error('Error updating recipe:', error.response?.data || error.message);
      alert('Failed to update recipe. Please try again.');
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

  if (initialLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-center text-xl font-medium text-gray-600">Loading recipe data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back button at top */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <Link to="/recipe/my-recipes" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Recipes
          </Link>
        </div>
      </div>

      {/* Header section with dark background */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-12 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-3 leading-tight">Edit Recipe</h1>
          <p className="mb-4 text-gray-300 text-lg">Update your recipe information and details</p>
        </div>
      </div>
      
      {/* Main form content */}
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
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

                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={handlePublishStatusChange}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                    Published (uncheck to save as draft)
                  </label>
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
          
          {/* Submit and Cancel Buttons */}
          <div className="flex justify-center space-x-4">
            <Link
              to="/recipe/my-recipes"
              className="inline-flex items-center px-6 py-3 bg-red-400 hover:bg-red-500 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium text-lg rounded-lg shadow-md hover:shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Updating Recipe...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Edit Your Recipe • Food Blog</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeEdit;