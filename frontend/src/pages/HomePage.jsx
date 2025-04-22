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
      imageUrl: '/images/garlic-bread.jpg',
      title: 'The Best Garlic Bread You\'ll Ever Eat',
      author: 'Guest Chef',
      dietType: 'Vegetarian'
    },
    {
      id: '1002',
      imageUrl: '/images/iced-coffee.jpg',
      title: 'Energising Iced Coffee',
      author: 'Dhruv Malik',
      dietType: 'Vegetarian'
    },
    {
      id: '1003',
      imageUrl: '/images/spanish-omelet.jpg',
      title: 'Spanish Omelet With Pickled Cherry Tomatoes',
      author: 'Michael Smith',
      dietType: 'Non-Vegetarian'
    },
    {
      id: '1004',
      imageUrl: '/images/roasted-squash.jpg',
      title: 'Roasted Squash & Tomato Bowl With White Beans',
      author: 'Anna Olson',
      dietType: 'Vegan'
    },
    {
      id: '1005',
      imageUrl: '/images/butter-chicken.jpg',
      title: 'Authentic Butter Chicken (Restaurant-Style)',
      author: 'Ranveer Brar',
      dietType: 'Non-Vegetarian'
    },
    {
      id: '1006',
      imageUrl: '/images/egg-fried-rice.jpg',
      title: 'Uncle Roger\'s World-Famous Egg Fried Rice',
      author: 'Nigel Ng',
      dietType: 'Non-Vegetarian'
    },
    {
      id: '1007',
      imageUrl: '/images/vegetables-paprika.jpg',
      title: 'Vegetables In Paprika Sauce With Spinach Rice',
      author: 'Sanjyot Keer',
      dietType: 'Vegetarian'
    },
    {
      id: '1008',
      imageUrl: '/images/shrimp-scampi.jpg',
      title: 'Shrimp Scampi With Capellini Pasta',
      author: 'Gordon Ramsay',
      dietType: 'Non-Vegetarian'
    }
  ];

  // Rest of the component remains the same
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          to="/recipe/submit" 
          className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors"
        >
          Submit a Recipe
        </Link>
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