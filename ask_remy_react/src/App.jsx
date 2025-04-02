// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeViewPage from './pages/RecipeViewPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/recipe-view" element={<RecipeViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;