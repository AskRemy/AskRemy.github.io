// src/services/api.js
import axios from 'axios';

const API_URL = 'https://scraper-3kvv.onrender.com';

export const scrapeRecipe = async (url) => {
  try {
    const response = await axios.get(`${API_URL}/scrape?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error('Error scraping recipe:', error);
    throw error;
  }
};