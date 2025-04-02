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
          <h2>About AskRemy</h2>
          <p>This is the about section...</p>
        
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