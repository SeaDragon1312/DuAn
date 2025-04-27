import React from 'react';
import { Link } from 'react-router-dom';
import "../output.css";

const dietTypeColors = {
  Vegetarian: 'text-green-600',
  'Non-Vegetarian': 'text-red-600',
  Vegan: 'text-emerald-600'
};

const RecipeCard = ({ id, imageUrl, title, author, dietType }) => {
  return (
    <Link to={`/recipe/view/${id}`} className="block w-full h-full">
      <div className="w-full h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
        <div className="relative h-48 w-full overflow-hidden">
          <img 
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{author}</span>
            <span className={`text-sm font-medium ${dietTypeColors[dietType]}`}>
              {dietType}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

const HomePage = () => {
  const recipes = [
    {
      id: '1001',
      imageUrl: '/images/garlic-bread.png',
      title: 'The Best Garlic Bread You\'ll Ever Eat',
      author: 'Guest Chef',
      dietType: 'Vegetarian'
    },
    {
      id: '1002',
      imageUrl: '/images/iced-coffee.png',
      title: 'Energising Iced Coffee',
      author: 'Dhruv Malik',
      dietType: 'Vegetarian'
    },
    {
      id: '1003',
      imageUrl: '/images/spanish-omelet.png',
      title: 'Spanish Omelet With Pickled Cherry Tomatoes',
      author: 'Michael Smith',
      dietType: 'Non-Vegetarian'
    },
    {
      id: '1004',
      imageUrl: '/images/roasted-squash.png',
      title: 'Roasted Squash & Tomato Bowl With White Beans',
      author: 'Anna Olson',
      dietType: 'Vegan'
    },
    {
      id: '1005',
      imageUrl: '/images/butter-chicken.png',
      title: 'Authentic Butter Chicken (Restaurant-Style)',
      author: 'Ranveer Brar',
      dietType: 'Non-Vegetarian'
    },
    {
      id: '1006',
      imageUrl: '/images/egg-fried-rice.png',
      title: 'Uncle Roger\'s World-Famous Egg Fried Rice',
      author: 'Nigel Ng',
      dietType: 'Non-Vegetarian'
    },
    {
      id: '1007',
      imageUrl: '/images/vegetables-paprika.png',
      title: 'Vegetables In Paprika Sauce With Spinach Rice',
      author: 'Sanjyot Keer',
      dietType: 'Vegetarian'
    },
    {
      id: '1008',
      imageUrl: '/images/shrimp-scampi.png',
      title: 'Shrimp Scampi With Capellini Pasta',
      author: 'Gordon Ramsay',
      dietType: 'Non-Vegetarian'
    }
  ];

  // Rest of the component remains the same
  return (
    <div className="container mx-auto px-4 py-8">

      <div className="flex flex-col md:flex-row mb-8 gap-4">
        <div className="bg-gray-900 text-white rounded-lg p-6 md:w-5/6 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-2">Featured</h2>
          <p className="italic">A delectable garlic bread recipe with a perfect balance of flavors.</p>
        </div>
        
        <RecipeCard
          id="1001"
          imageUrl="/images/garlic-bread.png"
          title="The Best Garlic Bread You'll Ever Eat" 
          author="Guest Chef"
          dietType="Vegetarian"
          className="md:w-1/2"
        />

        <div className="mt-auto p-4 bg-green-100 rounded-b-lg md:w-1/2">
          <h3 className="text-2xl font-bold text-green-800 mb-8">Share with AI Assist</h3>
          <button className="w-full mb-4 bg-green-800 text-white font-semibold py-3 shadow-md rounded-lg hover:bg-green-600 transition-colors">
            <Link 
              to="/recipe/submit"
            >
              Add Recipe
            </Link>
          </button>
          <button className="w-full bg-green-800 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors">
            <Link 
              to="/recipe/my-recipes"
            >
              My Recipes
            </Link>
          </button>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">There's more to explore</h1>
      
      <div className="relative mb-6">
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">🔍</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recipes.map((recipe, index) => (
          <RecipeCard key={index} {...recipe} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;