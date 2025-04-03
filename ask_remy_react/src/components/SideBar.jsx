import React, { useState } from 'react';
import './SideBar.css';

// Mock data for the sidebar
const mockSavedRecipes = [
  { id: 1, title: 'Spaghetti Carbonara', image: '/assets/spagetti_carbonara.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane' },
  { id: 2, title: 'Chicken Tikka Masala', image: '/assets/chicken_tikka.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Godlike' },
  { id: 3, title: 'Beef Tacos', image: '/assets/beef_tacos.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Extreme' },
  { id: 4, title: 'Vegetable Stir Fry', image: '/assets/vegetable_stir_fry.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane' }
];

const mockRecentRecipes = [
  { id: 5, title: 'Banana Bread', image: '/assets/banana_bread.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane'  },
  { id: 2, title: 'Chicken Tikka Masala', image: '/assets/chicken_tikka.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane'  },
  { id: 6, title: 'Mushroom Risotto', image: '/assets/mushroom_risoto.jpg', prep_time: '5', cook_time: '30', yields: 4, difficulty: 'Insane'  }
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
                <span className="recipe-title">{recipe.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;