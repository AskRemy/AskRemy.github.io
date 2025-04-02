import React from 'react';
import './InstructionSteps.css';

const InstructionSteps = ({ instructions, completedSteps, onToggleStep }) => {
  // Default mock instructions if none are provided
  const defaultInstructions = [
    "Bring a large pot of salted water to boil. Add spaghetti and cook according to package directions until al dente.",
    "While pasta is cooking, heat a large skillet over medium heat. Add the diced pancetta and cook until crispy, about 5-7 minutes.",
    "In a bowl, whisk together eggs, grated cheeses, and plenty of black pepper.",
    "Drain the pasta, reserving about 1/2 cup of pasta water.",
    "Working quickly, add hot pasta to the skillet with pancetta. Toss to coat in the rendered fat.",
    "Remove skillet from heat. Pour egg and cheese mixture over pasta, tossing continuously until a creamy sauce forms. Add reserved pasta water a little at a time if needed to achieve desired consistency.",
    "Serve immediately with extra grated cheese and black pepper on top."
  ];

  // Use provided instructions or fall back to mock data
  const stepsToRender = instructions || defaultInstructions;
  
  // If completedSteps is not provided, create a default array of all false values
  const stepStatus = completedSteps || new Array(stepsToRender.length).fill(false);
  
  // Handle step toggle if onToggleStep is provided, otherwise do nothing
  const handleToggle = (index) => {
    if (onToggleStep) {
      onToggleStep(index);
    }
  };

  return (
    <div className="instruction-steps">
      <h3>Instructions</h3>
      <ol className="steps-list">
        {stepsToRender.map((step, index) => (
          <li 
            key={index} 
            className={stepStatus[index] ? 'step completed' : 'step'}
          >
            <div className="step-header">
              <label className="step-checkbox">
                <input
                  type="checkbox"
                  checked={stepStatus[index]}
                  onChange={() => handleToggle(index)}
                />
                <span className="step-number">Step {index + 1}</span>
              </label>
            </div>
            <div className="step-content">
              {step}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default InstructionSteps;