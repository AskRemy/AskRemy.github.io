import React from 'react';
import './RecipeGlance.css';

const RecipeGlance = ({ recipe, onClose, onLaunch }) => {
  // Mock recipe data for preview if no recipe is provided
  const mockRecipe = {
    title: 'Spaghetti Carbonara',
    image: 'https://via.placeholder.com/400x300',
    prepTime: '15 mins',
    cookTime: '20 mins',
    servings: 4,
    ingredients: [
      '400g spaghetti',
      '200g pancetta',
      '3 large eggs',
      '75g pecorino cheese',
      '50g parmesan',
      'Freshly ground black pepper',
      '1 garlic clove (optional)'
    ],
    equipment: [
      'Large pot',
      'Frying pan',
      'Mixing bowl',
      'Tongs'
    ],
    difficulty: 'Medium'
  };

  // Use provided recipe or fall back to mock data
  const recipeData = recipe || mockRecipe;
  
  // Display only the first 5 ingredients in the glance view
  const previewIngredients = recipeData.ingredients ? 
    recipeData.ingredients.slice(0, 5) : 
    mockRecipe.ingredients.slice(0, 5);

  return (
    <div className="recipe-glance-overlay">
      <div className="recipe-glance-modal">
        <button className="close-button" onClick={onClose}>×</button>
        
        <div className="recipe-glance-header">
          <h2>{recipeData.title}</h2>
          <p className="recipe-subtitle">Recipe at a Glance</p>
        </div>
        
        <div className="recipe-glance-content">
          <div className="recipe-glance-image">
            <img src={recipeData.image} alt={recipeData.title} />
          </div>
          
          <div className="recipe-glance-details">
            <div className="recipe-meta">
              <div className="meta-item">
                <span className="meta-label">Prep Time</span>
                <span className="meta-value">{recipeData.prepTime}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Cook Time</span>
                <span className="meta-value">{recipeData.cookTime}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Servings</span>
                <span className="meta-value">{recipeData.servings}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Difficulty</span>
                <span className="meta-value">{recipeData.difficulty}</span>
              </div>
            </div>
            
            <div className="recipe-glance-ingredients">
              <h3>Main Ingredients</h3>
              <ul>
                {previewIngredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              {recipeData.ingredients && recipeData.ingredients.length > 5 && (
                <p className="more-info">+{recipeData.ingredients.length - 5} more ingredients</p>
              )}
            </div>
            
            <div className="recipe-glance-equipment">
              <h3>Equipment Needed</h3>
              <ul>
                {recipeData.equipment ? 
                  recipeData.equipment.map((item, index) => (
                    <li key={index}>{item}</li>
                  )) : 
                  mockRecipe.equipment.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
        
        <div className="recipe-glance-actions">
          <button className="secondary-button" onClick={onClose}>Cancel</button>
          <button className="primary-button" onClick={onLaunch}>
            Launch Interactive Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeGlance;