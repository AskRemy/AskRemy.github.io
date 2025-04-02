import React from 'react';
import './NutritionInfo.css';

const NutritionInfo = ({ nutrients }) => {
  // Default mock nutrition data if none is provided
  const defaultNutrients = {
    calories: '540',
    proteinContent: '22',
    carbohydrateContent: '58',
    fatContent: '24',
    fiberContent: '4',
    sodiumContent: '820'
  };

  // Use provided nutrients or fall back to mock data
  const nutritionData = nutrients || defaultNutrients;

  return (
    <div className="nutrition-info">
      <h3>Nutrition Information</h3>
      <div className="nutrition-grid">
        <div className="nutrition-item">
          <span className="nutrition-value">{nutritionData.calories}</span>
          <span className="nutrition-label">Calories</span>
        </div>
        <div className="nutrition-item">
          <span className="nutrition-value">{nutritionData.proteinContent}g</span>
          <span className="nutrition-label">Protein</span>
        </div>
        <div className="nutrition-item">
          <span className="nutrition-value">{nutritionData.carbohydrateContent}g</span>
          <span className="nutrition-label">Carbs</span>
        </div>
        <div className="nutrition-item">
          <span className="nutrition-value">{nutritionData.fatContent}g</span>
          <span className="nutrition-label">Fat</span>
        </div>
        {nutritionData.fiberContent && (
          <div className="nutrition-item">
            <span className="nutrition-value">{nutritionData.fiberContent}g</span>
            <span className="nutrition-label">Fiber</span>
          </div>
        )}
        {nutritionData.sodiumContent && (
          <div className="nutrition-item">
            <span className="nutrition-value">{nutritionData.sodiumContent}mg</span>
            <span className="nutrition-label">Sodium</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NutritionInfo;