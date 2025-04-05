// GeminiService.js
// Handles all API interactions with Gemini

const API_KEY_STORAGE_KEY = 'GEMINI_API_KEY';

export default class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  }

  // Get the current API key or prompt for a new one
  async getApiKey() {
    if (this.apiKey) {
      return this.apiKey;
    }

    const savedApiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (savedApiKey) {
      this.apiKey = savedApiKey;
      return this.apiKey;
    }

    // Prompt user for API key
    const newApiKey = prompt('Enter your Gemini API key:');
    if (newApiKey) {
      this.setApiKey(newApiKey);
      return newApiKey;
    }
    
    return null;
  }

  // Set and store API key
  setApiKey(key) {
    this.apiKey = key;
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  }

  // Clear stored API key
  clearApiKey() {
    this.apiKey = '';
    localStorage.setItem(API_KEY_STORAGE_KEY, '');
  }

  // Generate context prompt from recipe data
  generateContextPrompt(recipeContext, completedStepsStr, question) {
    
    const instructions_string = recipeContext.instructions 
      ? recipeContext.instructions.map((item, index) => `${index + 1}. ${item}`).join(', ') 
      : '';
      
    const ingredients_string = recipeContext.ingredients 
      ? recipeContext.ingredients.map((item, index) => `${index + 1}. ${item}`).join(', ') 
      : '';
    
    // Build completed steps string


    return `You are a cooking assistant helping me with their cooking related queries. Your duty is to answer as clearly, consisely, and encouraging as possible. 
    I am cooking a recipe. I'm cooking "${recipeContext.title || 'a recipe'}". This recipe serves ${recipeContext.servings || 'unknown'} and takes ${recipeContext.prep_time || 'some time'} to prepare and ${recipeContext.cook_time || 'some time'} to cook.
    The ingredients are as follows: ${ingredients_string}. The steps are as follows: ${instructions_string}. ${completedStepsStr ? `The user has completed steps: ${completedStepsStr}.` : 'The user hasn\'t completed any steps yet.'} 
    Here's my question: ${question}`;
  }

  // Send request to Gemini API
  async getResponse(recipeContext, completedStepsStr, question) {
    const currentApiKey = await this.getApiKey();
    
    if (!currentApiKey) {
      return {
        success: false,
        message: "I need an API key to answer your question."
      };
    }

    try {
      const contextPrompt = this.generateContextPrompt(recipeContext, completedStepsStr, question);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${currentApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: contextPrompt }] }]
          })
        }
      );

      const data = await response.json();
      
      // Extract response text
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm having trouble connecting. Please check your API key.";

      // If response indicates API key issue, clear the API key
      if (responseText === "I'm having trouble connecting. Please check your API key.") {
        this.clearApiKey();
        return {
          success: false,
          message: responseText
        };
      }
      
      return {
        success: true,
        message: responseText
      };
    } catch (error) {
      this.clearApiKey();
      return {
        success: false,
        message: `Error: ${error.message}. Please check your API key or connection.`
      };
    }
  }
}