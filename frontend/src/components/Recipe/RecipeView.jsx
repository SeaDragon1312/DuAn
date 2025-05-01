import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../../output.css";
import ClockIcon from '../../assets/ClockIcon.jsx';
import WarningIcon from '../../assets/WarningIcon.jsx';
import HealthIcon from '../../assets/HealthIcon.jsx';

const RecipeView = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeData = async () => {
      try {
        setLoading(true);

        // Fetch recipe details
        const recipeResponse = await fetch(`http://localhost:8080/api/recipe/get-by-param-id?id=${id}`);
        // const recipeResponse = await fetch('http://localhost:8080/api/recipe/get', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ id: Number(id) })
        // });

        if (!recipeResponse.ok) {
          throw new Error(`Recipe API error: ${recipeResponse.status}`);
        }

        const recipeData = await recipeResponse.json();

        // Fetch ingredients
        const ingredientsResponse = await fetch(`http://localhost:8080/api/ingredient/recipe/get?recipeId=${id}`);
        
        if (!ingredientsResponse.ok) {
          throw new Error(`Ingredients API error: ${ingredientsResponse.status}`);
        }

        const ingredientsData = await ingredientsResponse.json();

        // Fetch cooking steps
        const stepsResponse = await fetch(`http://localhost:8080/api/step/recipe/get?recipeId=${id}`);
        
        if (!stepsResponse.ok) {
          throw new Error(`Steps API error: ${stepsResponse.status}`);
        }

        // console.log('Recipe ID:', recipe.id);
        // console.log('Recipe data:', recipe);
        // console.log('Ingredients data:', ingredients);
        // console.log('Steps data:', steps);

        const stepsData = await stepsResponse.json();

        // Organize ingredients by type
        const categorizedIngredients = categorizeIngredients(ingredientsData);

        // Update state with fetched data
        setRecipe(recipeData);
        setIngredients(categorizedIngredients);
        setSteps(stepsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRecipeData();
  }, [id]);

  // Helper function to categorize ingredients
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-center text-xl font-medium text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-bold mt-4">Error loading recipe</p>
          <p className="text-gray-500 mt-2">{error}</p>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
              &larr; Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xl font-bold mt-4">Recipe not found</p>
          <p className="text-gray-500 mt-2">We couldn't find the recipe you're looking for.</p>
          <div className="mt-6">
            <Link to="/" className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors">
              &larr; Back to Recipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderIngredientBadge = (name) => (
    <div key={name} className="bg-gray-100 rounded-full px-4 py-2 inline-block m-1 border border-gray-200 hover:bg-gray-200 transition-colors">
      <span className="text-gray-800 font-medium">{name}</span>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back button at top */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Recipes
          </Link>
        </div>
      </div>

      {/* Header section with dark background */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-12 shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 pr-0 md:pr-12 mb-8 md:mb-0">
            <h1 className="text-4xl font-bold mb-3 leading-tight">{recipe.dishName}</h1>
            <p className="mb-4 text-gray-300 text-lg">By {recipe.user?.fullName || 'Unknown Chef'}</p>
            
            <div className="flex items-center space-x-6 mt-6">
              <div className="flex items-center bg-gray-800 bg-opacity-50 px-4 py-2 rounded-lg">
                <ClockIcon />
                <span className="ml-2 font-medium">30 mins</span>
              </div>
              {recipe.dietType && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                  {recipe.dietType}
                </div>
              )}
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src={`http://localhost:8080/api/image/get?id=${recipe.image?.id}` || '/default-recipe.jpg'} 
                alt={recipe.dishName} 
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with white background */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Introduction</h2>
          <p className="text-gray-700 leading-relaxed text-lg font-semibold">{recipe.introduction}</p>
        </div>

        {recipe.healthImpact && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Good To Know</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Health Impact Card */}
              <div className="bg-white rounded-xl">
                <div className="bg-green-100 rounded-xl p-4">
                  <div className="flex items-center mb-4">
                    <span className="p-2 rounded-full mr-3">
                      <HealthIcon />
                    </span>
                    <h2 className="text-xl font-bold text-gray-800">Health Impact</h2>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    Health Score: {recipe.healthScore || 'Not Rated'}
                  </h2>
                  <p className="text-gray-600 leading-relaxed mt-2">{recipe.healthImpact}</p>
                </div>
              </div>
              
              {/* Allergy Card */}
              {recipe.allergyWarning && (
                <div className="bg-white rounded-xl">
                  <div className="bg-yellow-100 rounded-xl p-4">
                    <div className="flex items-center mb-4">
                      <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-3">
                        <WarningIcon />
                      </span>
                      <h2 className="text-xl font-bold text-gray-800">Allergy Information</h2>
                    </div>
                  </div>
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800">Allergy Warning</h2>
                    <p className="text-gray-600 leading-relaxed mt-2">{recipe.allergyWarning}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">What you'll need</h2>
          
          {/* Ingredients by category */}
          <div className="space-y-6">
            {ingredients.veggiesAndFruits.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-green-500 rounded-r inline-block mr-3"></span>
                  Veggies & Fruits
                </h3>
                <div className="flex flex-wrap">
                  {ingredients.veggiesAndFruits.map(item => renderIngredientBadge(item))}
                </div>
              </div>
            )}
            
            {ingredients.dairy.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-yellow-400 rounded-r inline-block mr-3"></span>
                  Dairy
                </h3>
                <div className="flex flex-wrap">
                  {ingredients.dairy.map(item => renderIngredientBadge(item))}
                </div>
              </div>
            )}
            
            {ingredients.spicesAndCondiments.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-r inline-block mr-3"></span>
                  Spices, condiments, nuts & everything else
                </h3>
                <div className="flex flex-wrap">
                  {ingredients.spicesAndCondiments.map(item => renderIngredientBadge(item))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Steps</h2>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-200 text-black-700 flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className={`pb-8 ${index < steps.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <p className="text-gray-700 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Recipe by {recipe.user?.fullName || 'Unknown Chef'} • Food Blog</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeView;