import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import "../../output.css";
import ClockIcon from '../../assets/ClockIcon.jsx';
import WarningIcon from '../../assets/WarningIcon.jsx';
import HealthIcon from '../../assets/HealthIcon.jsx';

const RecipeView = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        // In a real app, fetch data from API. For now using mock data
        const mockData = {
          id,
          title: "The Best Garlic Bread You'll Ever Eat",
          author: 'Guest Chef',
          imageUrl: '/images/garlic-bread.jpg',
          dietType: 'Vegetarian',
          prepTime: '25 mins',
          description: 'Indulge in the irresistible flavors of The Best Garlic Bread You\'ll Ever Eat by Guest Chef. This recipe combines the richness of butter and cheese with the aromatic garlic and parsley, resulting in a mouthwatering combination that will leave you craving for more.',
          healthImpact: 'The recipe contains butter, which is high in saturated fat. However, it does not contain any other unhealthy ingredients and can be enjoyed in moderation.',
          allergyInfo: 'This recipe may not be suitable for individuals with allergic tendencies to the following items: Dairy',
          ingredients: {
            veggiesAndFruits: [
              'garlic',
              'parsley',
              'chives'
            ],
            dairy: [
              'butter',
              'cheese'
            ],
            spicesAndCondiments: [
              'Italian bread',
              'sea salt'
            ]
          },
          steps: [
            'Prep your pan & bread - line a large baking sheet with parchment paper or foil, slice your bread in half lengthwise, and place the bread cut side up on the baking sheet.',
            'Make the garlic butter- In a small bowl mix the herbs (parsley, sea salt, chives), and soft together with the softened butter. Spread it evenly over the top of the bread halves.',
            'Bake - bake the bread for 10-15 minutes at 425 degrees F until it\'s slightly golden brown on the edges.',
            'If you\'d like to add cheese, add it in the last 2 minutes of baking.',
            'Cool & slice into 1-inch pieces. Enjoy!'
          ]
        };
        
        setRecipe(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

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
            <h1 className="text-4xl font-bold mb-3 leading-tight">{recipe.title}</h1>
            <p className="mb-4 text-gray-300 text-lg">By {recipe.author}</p>
            
            <div className="flex items-center space-x-6 mt-6">
              <div className="flex items-center bg-gray-800 bg-opacity-50 px-4 py-2 rounded-lg">
                <ClockIcon />
                <span className="ml-2 font-medium">{recipe.prepTime}</span>
              </div>
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium">
                {recipe.dietType}
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="rounded-xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title} 
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
          <p className="text-gray-700 leading-relaxed text-lg font-semibold">{recipe.description}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Good To Know</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Healthy Card */}
            <div className="bg-white rounded-xl">
              <div className="bg-green-100 rounded-xl">
                <div className="flex items-center mb-4">
                  <span className="p-2 rounded-full mr-3">
                    <HealthIcon />
                  </span>
                  <h2 className="text-xl font-bold text-gray-800">Health Impact</h2>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Some health implications (5/10)</h2>
              <p className="text-gray-600 leading-relaxed">{recipe.healthImpact}</p>
            </div>
            
            {/* Allergy Card */}
            <div className="bg-white rounded-xl">
              <div className="bg-yellow-100 rounded-xl">
                <div className="flex items-center mb-4">
                  <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-3">
                    <WarningIcon />
                  </span>
                  <h2 className="text-xl font-bold text-gray-800">Allergy Information</h2>
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">No Common Allergens</h2>
              <p className="text-gray-600 leading-relaxed">{recipe.allergyInfo}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">What you'll need</h2>
          
          {/* Ingredients by category */}
          <div className="space-y-6">
            {recipe.ingredients.veggiesAndFruits.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-green-500 rounded-r inline-block mr-3"></span>
                  Veggies & Fruits
                </h3>
                <div className="flex flex-wrap">
                  {recipe.ingredients.veggiesAndFruits.map(item => renderIngredientBadge(item))}
                </div>
              </div>
            )}
            
            {recipe.ingredients.dairy.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-yellow-400 rounded-r inline-block mr-3"></span>
                  Dairy
                </h3>
                <div className="flex flex-wrap">
                  {recipe.ingredients.dairy.map(item => renderIngredientBadge(item))}
                </div>
              </div>
            )}
            
            {recipe.ingredients.spicesAndCondiments.length > 0 && (
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-700 flex items-center">
                  <span className="w-2 h-8 bg-red-500 rounded-r inline-block mr-3"></span>
                  Spices, condiments, nuts & everything else
                </h3>
                <div className="flex flex-wrap">
                  {recipe.ingredients.spicesAndCondiments.map(item => renderIngredientBadge(item))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Steps</h2>
          
          <div className="space-y-8">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-200 text-black-700 flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                </div>
                <div className={`pb-8 ${index < recipe.steps.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  <p className="text-gray-700 leading-relaxed">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>Recipe by {recipe.author} • Food Blog</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeView;