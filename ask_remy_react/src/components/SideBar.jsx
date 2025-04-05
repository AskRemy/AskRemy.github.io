import React, { useState } from 'react';
import { format } from 'date-fns';  // Import date formatting function
import './SideBar.css';

// Mock ingredient data
const mockInstructions = [
    "Heat the pasta water: Put a large pot of salted water on to boil (1 tablespoon salt for every 2 quarts of water.)",
    "Sauté the pancetta or bacon and garlic: While the water is coming to a boil, heat the olive oil or butter in a large sauté pan over medium heat. Add the bacon or pancetta and cook slowly until crispy. Add the garlic (if using) and cook another minute, then turn off the heat and put the pancetta and garlic into a large bowl.",
    "Beat the eggs and half of the cheese: In a small bowl, beat the eggs and mix in about half of the cheese.",
    "Cook the pasta: Once the water has reached a rolling boil, add the dry pasta, and cook, uncovered, at a rolling boil.",
    "Toss the pasta with pancetta or bacon: When the pasta is al dente (still a little firm, not mushy), use tongs to move it to the bowl with the bacon and garlic. Let it be dripping wet. Reserve some of the pasta water. Move the pasta from the pot to the bowl quickly, as you want the pasta to be hot. It's the heat of the pasta that will heat the eggs sufficiently to create a creamy sauce. Toss everything to combine, allowing the pasta to cool just enough so that it doesn't make the eggs curdle when you mix them in. (That's the tricky part.)",
    "Add the beaten egg mixture: Add the beaten eggs with cheese and toss quickly to combine once more. Add salt to taste. Add some pasta water back to the pasta to keep it from drying out. Serve at once with the rest of the parmesan and freshly ground black pepper. If you want, sprinkle with a little fresh chopped parsley.Did you enjoy this recipe? Let us know with a rating and review!"];

const mockIngredients = [
    "1 tablespoon extra virgin olive oil or unsalted butter",
    "1/2 pound pancetta or thick cut bacon, diced",
    "1-2 garlic cloves, minced, about 1 teaspoon (optional)",
    "3-4 whole eggs",
    "1 cup grated parmesan or pecorino cheese",
    "1 pound spaghetti (or bucatini or fettuccine)",
    "Salt and black pepper to taste"
    ];

// Mock data for the sidebar
const mockSavedRecipes = [
  { id: 1, title: 'Spaghetti Carbonara', image: '/assets/spagetti_carbonara.jpg', prep_time: '500', cook_time: '30', yields: 4, difficulty: 'Insane', url: 'https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/', ingredients: mockIngredients, instructions: mockInstructions },
  { id: 2, title: 'Chicken Tikka Masala', image: '/assets/chicken_tikka.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Godlike', url: 'https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/' , ingredients: mockIngredients, instructions: mockInstructions},
  { id: 3, title: 'Beef Tacos', image: '/assets/beef_tacos.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Extreme', url: 'https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/' , ingredients: mockIngredients, instructions: mockInstructions},
  { id: 4, title: 'Vegetable Stir Fry', image: '/assets/vegetable_stir_fry.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane', url: 'https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/' , ingredients: mockIngredients, instructions: mockInstructions}
];

const mockRecentRecipes = [
  { id: 5, title: 'Banana Bread', image: '/assets/banana_bread.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane', url: 'https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/', lastUsed: '2025-04-03T08:30:00Z', ingredients: mockIngredients, instructions: mockInstructions},
  { id: 2, title: 'Chicken Tikka Masala', image: '/assets/chicken_tikka.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane', url: 'https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/', lastUsed: '2025-03-25T08:30:00Z', ingredients: mockIngredients, instructions: mockInstructions},
  { id: 6, title: 'Mushroom Risotto', image: '/assets/mushroom_risoto.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane', url: 'https://www.simplyrecipes.com/recipes/spaghetti_alla_carbonara/', lastUsed: '1923-02-14T08:30:00Z', ingredients: mockIngredients, instructions: mockInstructions}
];



const SideBar = ({ onRecipeSelect }) => {
  const [activeTab, setActiveTab] = useState('saved');

  // Mock function to handle recipe selection
  const handleRecipeClick = (recipe) => {
    if (onRecipeSelect) {
      onRecipeSelect(recipe);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>My Recipes</h2>
      </div>
      
      <div className="sidebar-tabs">
        <button 
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Favorites
        </button>
        <button 
          className={`tab-button ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
      </div>
      
      <div className="sidebar-content">
        {activeTab === 'saved' && (
          <div className="recipe-list">
            {mockSavedRecipes.map(recipe => (
              <div 
                key={recipe.id} 
                className="recipe-item"
                onClick={() => handleRecipeClick(recipe)}
              >
                <img src={recipe.image} alt={recipe.title} className="recipe-thumb" />
                <span className="recipe-title">{recipe.title}</span>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'recent' && (
          <div className="recipe-list">
            {mockRecentRecipes.map(recipe => (
              <div 
                key={recipe.id} 
                className="recipe-item"
                onClick={() => handleRecipeClick(recipe)}
              >
                <img src={recipe.image} alt={recipe.title} className="recipe-thumb" />
                
                <div className="recipe-info">
                    <span className="recipe-title">{recipe.title}</span>
                    <span className="recipe-date">
                    {format(new Date(recipe.lastUsed), 'MMM dd, yyyy')}
                    </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;