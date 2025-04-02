import React, { useState } from 'react';
import './IngredientsList.css';

const IngredientsList = ({ ingredients }) => {
  // Default mock ingredients if none are provided
  const defaultIngredients = [
    '400g spaghetti',
    '200g pancetta or guanciale, diced',
    '3 large eggs',
    '75g pecorino cheese, grated',
    '50g parmesan, grated',
    'Freshly ground black pepper',
    '1 garlic clove (optional)'
  ];

  // Use provided ingredients or fall back to mock data
  const ingredientsList = ingredients || defaultIngredients;
  
  // State to track checked ingredients
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="ingredients-list">
      <h3>Ingredients</h3>
      <ul>
        {ingredientsList.map((ingredient, index) => (
          <li key={index} className={checkedIngredients[index] ? 'checked' : ''}>
            <label className="ingredient-label">
              <input 
                type="checkbox"
                checked={!!checkedIngredients[index]}
                onChange={() => toggleIngredient(index)}
              />
              <span className="ingredient-text">{ingredient}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsList;