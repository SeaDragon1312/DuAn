import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import "../../output.css";
import ClockIcon from '../../assets/ClockIcon.jsx';
import { useUser } from "@clerk/clerk-react";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!isLoaded || !user) {
        return;
      }
      
      try {
        setLoading(true);
        // Fetch user's recipes from the backend API using the full URL
        console.log(user);
        const myRecipeResponse = await fetch(`http://localhost:8080/api/recipe/user/get?userId=${user.id}`);
        
        if (!myRecipeResponse.ok) {
          throw new Error(`My Recipes API error: ${myRecipeResponse.status}`);
        }

        const data = await myRecipeResponse.json();
        console.log('API my recipes:', data);
        
        // Transform backend data to match frontend structure
        const transformedData = data.map(recipe => ({
          id: recipe.id.toString(),
          title: recipe.dishName,
          author: recipe.user.fullName || recipe.user.username,
          imageUrl: recipe.image ? `http://localhost:8080/api/image/get?id=${recipe.image.id}` : '/images/default-recipe.png',
          dietType: recipe.dietType,
          prepTime: recipe.preparationTime,
          dateCreated: recipe.publishedDate,
          description: recipe.introduction,
          status: recipe.isPublished ? 'published' : 'draft'
        }));
        
        setRecipes(transformedData);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user, isLoaded]);

  // Filter recipes based on status and search term
  const filteredRecipes = recipes.filter(recipe => {
    const matchesFilter = filter === 'all' || recipe.status === filter;
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.dietType?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Function to delete a recipe
  const handleDeleteRecipe = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        const response = await fetch(`http://localhost:8080/api/recipe/delete/${id}`, {
          method: 'POST',
        });
        
        if (response.ok) {
          // Remove the recipe from state after successful deletion
          setRecipes(recipes.filter(recipe => recipe.id !== id));
        } else {
          throw new Error('Failed to delete recipe');
        }
      } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Failed to delete recipe. Please try again.');
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Back button at top */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <button 
              onClick={() => window.history.back()} 
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
                Back
            </button>
          </div>
        </div>
        
      {/* Header section with dark background */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-12 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-4xl font-bold mb-3 leading-tight">My Recipes</h1>
              <p className="mb-4 text-gray-300 text-lg">Manage and explore all your culinary creations</p>
            </div>
            <Link to="/recipe/submit" className="inline-flex items-center px-5 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all mt-4 md:mt-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Recipe
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filter and search */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <button 
                onClick={() => setFilter('all')} 
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                All Recipes
              </button>
              <button 
                onClick={() => setFilter('published')} 
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Published
              </button>
              <button 
                onClick={() => setFilter('draft')} 
                className={`px-4 py-2 rounded-lg font-medium ${filter === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Drafts
              </button>
            </div>
            
            <div className="w-90 md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search your recipes..."
                  className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Recipe cards */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-center text-xl font-medium text-gray-600">Loading your recipes...</p>
            </div>
          </div>
        ) : filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="relative">
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  {recipe.dateCreated && recipe.status === 'published' && (
                    <div className="absolute top-3 right-3 bg-green-600 from-gray-900 to-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                      {new Date(recipe.dateCreated).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{recipe.title}</h3>
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {recipe.dietType}
                        </span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <ClockIcon />
                          <span className="ml-1">{recipe.prepTime}</span>
                        </div>
                        {recipe.status === 'draft' && (
                          <div className="top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded">DRAFT</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2 mb-4">{recipe.description}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <Link 
                      to={`/recipe/view/${recipe.id}`} 
                      className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                    >
                      View Recipe
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/recipe/edit/${recipe.id}`} 
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit Recipe"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      
                      <button 
                        onClick={() => handleDeleteRecipe(recipe)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete Recipe"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No recipes found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No recipes match your search "${searchTerm}". Try a different search term.` 
                : filter !== 'all' 
                  ? `You don't have any ${filter} recipes yet.` 
                  : "You haven't created any recipes yet. Start sharing your culinary creations!"}
            </p>
            <Link to="/recipe/submit" className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Recipe
            </Link>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>My Recipe Collection • Food Blog</p>
        </div>
      </div>
    </div>
  );
};

export default MyRecipes;