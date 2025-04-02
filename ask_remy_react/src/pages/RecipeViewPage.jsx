import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import NutritionInfo from '../components/RecipeDetailed/NutritionInfo';
import IngredientsList from '../components/RecipeDetailed/IngredientsList';
import InstructionSteps from '../components/RecipeDetailed/InstructionSteps';
import EquipmentList from '../components/RecipeDetailed/EquipmentList';
import ChatBot from '../components/ChatBot';
import { saveRecipe } from '../services/recipeStorage';
import './RecipeViewPage.css'; // Assuming you have a CSS file for styling
import VoiceBot from '../components/VoiceBot';

const RecipeViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  useEffect(() => {
    if (location.state?.recipe) {
      setRecipe(location.state.recipe);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const toggleStepComplete = (index) => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[index] = !newCompletedSteps[index];
    setCompletedSteps(newCompletedSteps);
  };

  const handleSaveRecipe = () => {
    if (recipe) {
      saveRecipe(recipe);
    }
  };

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="recipe-view-container">
      <Header />
      <div className="recipe-content">
        <div className="recipe-header">
          <h1>{recipe.title}</h1>
          <button onClick={handleSaveRecipe}>Save Recipe</button>
        </div>

        <div className="recipe-body">
          {/* Column 1: Recipe Image and Nutritional Info */}
          <div className="recipe-column">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="recipe-image" 
            />
            <div className="recipe-info">
              <p><strong>Time to Cook:</strong> {recipe.cookTime}</p>
              <p><strong>Difficulty Level:</strong> {recipe.difficulty}</p>
              <p><strong>Servings:</strong> {recipe.servings}</p>
              <NutritionInfo nutrients={recipe.nutrients} />
              <IngredientsList ingredients={recipe.ingredients} />

            </div>
          </div>

          {/* Column 2: Ingredients and Equipment */}
          {/* <div className="recipe-column"> */}
            {/* <EquipmentList equipment={recipe.equipment || []} /> */}
          {/* </div> */}

          {/* Column 3: Step-by-Step Instructions */}
          <div className="recipe-column">
            <InstructionSteps 
              instructions={recipe.instructions} 
              completedSteps={completedSteps}
              onToggleStep={toggleStepComplete}
            />
          </div>
        </div>
        
        <div className="chatbot-section">
          <ChatBot recipeContext={recipe} />
          {/* <VoiceBot recipeContext={recipe} /> */}
        </div>
      </div>
    </div>
  );
};

export default RecipeViewPage;