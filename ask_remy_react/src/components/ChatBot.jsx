import React, { useState, useEffect, useRef, useMemo } from 'react';
import './ChatBot.css';
import GeminiService from '../services/GeminiService';
import VoiceService from '../services/VoiceService';

const ChatBot = ({ recipeContext, completedSteps }) => {
  // Component state
  const [showPopup, setShowPopup] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [question, setQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [response, setResponse] = useState('');
  
  // Service references
  const geminiServiceRef = useRef(null);
  const voiceServiceRef = useRef(null);
  const popupRef = useRef(null);
  
  // Reference to completedSteps to ensure we always have the latest value
  const completedStepsRef = useRef(completedSteps);


  const handleClosePopup = () => {
    // Stop speaking when popup is closed
    if (voiceServiceRef.current) {
      voiceServiceRef.current.stopSpeaking();
    }

    setQuestion('');
    setResponse('');
    setTranscript('');
    setIsThinking(false);
    setShowPopup(false);
  };
  
  // Update the ref whenever completedSteps changes
  useEffect(() => {
    completedStepsRef.current = completedSteps;
  }, [completedSteps]);
  
  // Helper function to get completed steps string
  const getCompletedStepsString = (stepsArray) => {
    // Ensure steps is an array
    const steps = Array.isArray(stepsArray) ? stepsArray : [];
    
    if (steps.length === 0) return "";
    
    const completedIndices = [];
    for (let i = 0; i < steps.length; i++) {
      if (steps[i] === true) {
        completedIndices.push(i + 1);
      }
    }
    return completedIndices.join(', ');
  };
  
  // Compute completed steps string whenever completedSteps changes
  const completedStepsString = useMemo(() => {
    return getCompletedStepsString(completedSteps);
  }, [completedSteps]);
  
  // Debug logging
  useEffect(() => {
    console.log("Current completed steps string:", completedStepsString);
  }, [completedStepsString]);

  // Initialize services on mount
  useEffect(() => {
    // Initialize API service
    geminiServiceRef.current = new GeminiService();
    
    // Initialize voice service with callbacks
    voiceServiceRef.current = new VoiceService(
      handleWakeWordDetected,
      updateTranscript
    );
    
    // Start listening for wake word
    const listenerStarted = voiceServiceRef.current.startWakeWordDetection();
    setIsListening(listenerStarted);
    
    // Cleanup on unmount
    return () => {
      if (voiceServiceRef.current) {
        voiceServiceRef.current.stopListening();
      }
    };
  }, []);

  // Handle wake word detection
  const handleWakeWordDetected = (questionText) => {
    setShowPopup(true);
    
    if (questionText) {
      setQuestion(questionText);
      processQuestion(questionText);
    } else {
      setResponse("Ask me a question! Or say \"go away\"");
    }
  };
  
  // Update transcript from speech recognition
  const updateTranscript = (text) => {
    setTranscript(text);

    console.log("Transcript:", text);
    if (text.toLowerCase().includes('go away')) {
      handleClosePopup();
    }
  };

  // Process the question and get a response
  const processQuestion = async (questionText) => {
    // Reset state
    setIsThinking(true);
    setResponse('');
    
    // Always use the latest completedSteps from ref
    const currentCompletedSteps = completedStepsRef.current;
    const currentCompletedStepsString = getCompletedStepsString(currentCompletedSteps);
    
    console.log("Processing question with completed steps:", currentCompletedStepsString);

    try {
      // Generate context with the current completed steps
      const contextPrompt = generateContextPrompt(
        recipeContext,
        currentCompletedSteps,
        questionText,
        currentCompletedStepsString
      );
      
      // Get API response
      const result = await getApiResponse(contextPrompt);
      
      // Update state with response
      setResponse(result.message);
      
      // Read response aloud
      // TODO: Maybe only read aloud if the popup is open? tried this, but then wouldn't speak the first time sometimes...
      if (result.success) {
        voiceServiceRef.current.speakResponse(result.message);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsThinking(false);
    }
  };
  
  // Generate context prompt
  const generateContextPrompt = (recipeContext, completedSteps, question, completedStepsString) => {
    const instructions_string = recipeContext.instructions 
      ? recipeContext.instructions.map((item, index) => `${index + 1}. ${item}`).join(', ') 
      : '';
      
    const ingredients_string = recipeContext.ingredients 
      ? recipeContext.ingredients.map((item, index) => `${index + 1}. ${item}`).join(', ') 
      : '';

    return `You are a cooking assistant helping me with their cooking related queries. Your duty is to answer as clearly, consisely, and encouraging as possible. 
    I am cooking a recipe. I'm cooking "${recipeContext.title || 'a recipe'}". This recipe serves ${recipeContext.servings || 'unknown'} and takes ${recipeContext.prep_time || 'some time'} to prepare and ${recipeContext.cook_time || 'some time'} to cook.
    The ingredients are as follows: ${ingredients_string}. The steps are as follows: ${instructions_string}. ${completedStepsString ? `The user has completed steps: ${completedStepsString}.` : 'The user hasn\'t completed any steps yet.'} 
    Here's my question: ${question}`;
  };
  
  // Get API response
  const getApiResponse = async (contextPrompt) => {
    // Use the service's API key management
    const currentApiKey = await geminiServiceRef.current.getApiKey();
    
    if (!currentApiKey) {
      return {
        success: false,
        message: "I need an API key to answer your question."
      };
    }

    try {
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
        geminiServiceRef.current.clearApiKey();
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
      geminiServiceRef.current.clearApiKey();
      return {
        success: false,
        message: `Error: ${error.message}. Please check your API key or connection.`
      };
    }
  };

  // Manual trigger button handler
  const handleButtonClick = () => {
    setShowPopup(true);
    setQuestion('');
    setResponse("Ask me a question! Or say \"go away\"");
  };

  return (
    <div className="voice-assistant-container">
      {/* Button to manually trigger assistant */}
      <button 
        className="assistant-button" 
        onClick={handleButtonClick}
      >
        Ask Remy
      </button>
      
      {/* Listening status indicator */}
      <div className="listening-status">
        <span className={`status-indicator ${isListening ? 'active' : ''}`}></span>
        <span>Say "Hey Remy" for hands-free assistance</span>
      </div>
      
      {/* Popup overlay */}
      {showPopup && (
        <div className="recipe-glance-overlay">
          <div className="recipe-glance-modal" ref={popupRef}>
            <button 
              className="close-button" 
              onClick={handleClosePopup}
            >
              ×
            </button>
            
            <div className="recipe-glance-header">
              <h2>Remy - Your Recipe Assistant</h2>
              {question 
    ? 'Your question:' 
    : <>Ask away! Commands begin with the phrase <b style={{ color: '#E74C3D' }}>"hey remy"</b></>
  }
            </div>
            
            <div className="recipe-glance-content">
              {/* Question display */}
              {question && (
                <div className="question-container">
                  <p className="question-text">{question}</p>
                </div>
              )}
              
              {/* Thinking state */}
              {isThinking && (
                <div className="thinking-container">
                  <div className="thinking-indicator">
                    <span></span><span></span><span></span>
                  </div>
                  <p>Thinking about your question...</p>
                </div>
              )}
              
              {/* Response display */}
              {!isThinking && response && (
                <div className="response-container">
                  <div className="response-text">
                    {response}
                  </div>
                </div>
              )}
              
              {/* Voice transcript display */}
              {transcript && (
                <div className="transcript-container">
                  <p className="transcript-label">Currently hearing:</p>
                  <p className="transcript-text">{transcript}</p>
                </div>
              )}
            </div>
            
            {/* Buttons on the Bottom of the Screen */}
            <div className="recipe-glance-actions">
              <button 
                className="secondary-button"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
              
              {question && (
                <button 
                  className="primary-button"
                  onClick={() => processQuestion(question)}
                  disabled={isThinking}
                >
                  Ask Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;