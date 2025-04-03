import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SideBar from '../components/SideBar';
import UrlForm from '../components/UrlForm';
import RecipeGlance from '../components/RecipeGlance';
import { scrapeRecipe } from '../services/api';

import './HomePage.css'; // Assuming you have a CSS file for styling

// const HomePage = () => {
//   const [currentRecipe, setCurrentRecipe] = useState(null);
//   const [showGlance, setShowGlance] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleScrape = async (url) => {
//     try {
//       setIsLoading(true);
//       setError(null);
//       const data = await scrapeRecipe(url);
//       setCurrentRecipe(data);
//       setShowGlance(true);
//       setIsLoading(false);
//     } catch (err) {
//       setError('Unable to scrape the recipe. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   const handleSavedRecipeSelect = (recipe) => {
//     setCurrentRecipe(recipe);
//     setShowGlance(true);
//   };

//   const handleLaunchRecipe = () => {
//     // Navigate to the detailed view with the recipe data
//     navigate('/recipe-view', { state: { recipe: currentRecipe } });
//   };

//   return (
//     <div className="app-container">
//       <Header />
//       <div className="main-content">
//         <SideBar onRecipeSelect={handleSavedRecipeSelect} />
//         <div className="content-area">
//           <h2>Find New Recipes</h2>
//           <UrlForm onSubmit={handleScrape} isLoading={isLoading} />
          
//           {error && <div className="error-message">{error}</div>}
          
//           {showGlance && currentRecipe && (
//             <RecipeGlance 
//               recipe={currentRecipe}
//               onClose={() => setShowGlance(false)}
//               onLaunch={handleLaunchRecipe}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomePage;

const HomePage = () => {
    const [currentRecipe, setCurrentRecipe] = useState(null);
    const [showGlance, setShowGlance] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // setIsLoading(true);

    const handleScrape = async (url) => {
        console.log('Scraping URL:', url);
        try {
        setIsLoading(true);
        setError(null);
        const data = await scrapeRecipe(url);
        setCurrentRecipe(data);
        setShowGlance(true);
        setIsLoading(false);
        } catch (err) {
        setError('Unable to scrape the recipe. Please try again.');
        setIsLoading(false);
        }
    };

    const handleSavedRecipeSelect = (recipe) => {
        setCurrentRecipe(recipe);
        setShowGlance(true);
    };

    const handleLaunchRecipe = () => {
        // Navigate to the detailed view with the recipe data
        navigate('/recipe-view', { state: { recipe: currentRecipe } });
    };


  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        {<SideBar onRecipeSelect={handleSavedRecipeSelect} />}
        <div className="content-area">
          <h2>Find New Recipes</h2>
          {<UrlForm onSubmit={handleScrape} isLoading={isLoading} />}

          <h2></h2>
          <h2></h2>
          <h2></h2>
          <h2>About <span style={{ color: "#E74C3D" }}>AskRemy</span></h2>
          <p class="quote">"I don't wanna eat garbage dad..." – <span>Remy, Ratatouille</span></p>
          <p>AskRemy is built for cooks who want <strong>simple, concise, and ad-free</strong> access to recipes—without the clutter. Whether you're trying a new dish or revisiting a favorite, our hands-free mode keeps your focus on cooking, not scrolling.</p>

          <ul class="features">
            <li>📌 <strong>Favorite recipes</strong> to keep them handy.</li>
            <li>🔍 <strong>Scrape key details</strong> from recipes you’ve found online.</li>
            <li>🎙️ <strong>Go hands-free</strong> with guided cooking assistance.</li>
         </ul>

         <p>Using a recipe should be effortless. Let AskRemy handle the details while you bring the magic to the kitchen.</p>

          
        
          {error && <div className="error-message">{error}</div>}
        
          {showGlance && currentRecipe && (
            <RecipeGlance 
              recipe={currentRecipe}
              onClose={() => setShowGlance(false)}
              onLaunch={handleLaunchRecipe}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;