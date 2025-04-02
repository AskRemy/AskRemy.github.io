import React, { useState } from 'react';
import './UrlForm.css'; // Assuming you have a CSS file for styling

const UrlForm = ({ onSubmit, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh
    if (url.trim() === '') return; // Ignore empty input
    onSubmit(url); // Call the function passed from HomePage
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter recipe URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Scrape Recipe'}
      </button>
    </form>
  );
};

export default UrlForm;