import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const ChatBot = ({ recipeContext }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [question, setQuestion] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [response, setResponse] = useState('');
  const [apiKey, setApiKey] = useState('');
  const recognitionRef = useRef(null);
  const popupRef = useRef(null);

  // Load API key on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Start listening for wake word
    startWakeWordDetection();

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle wake word detection
  const startWakeWordDetection = () => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          // Check for wake word
          if (transcript.toLowerCase().includes('hey remy')) {
            const questionMatch = transcript.toLowerCase().match(/hey remy,?\s*(.*)/i);
            const questionText = questionMatch ? questionMatch[1].trim() : '';
            
            // Open popup
            setShowPopup(true);
            
            if (questionText) {
              // Process question
              setQuestion(questionText);
              processQuestion(questionText);
            } else {
              setResponse("I'm listening. How can I help with your recipe?");
            }
          }
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      // Restart after brief delay
    //   setTimeout(() => {
    //     if (recognitionRef.current) {
    //       recognition.start();
    //     }
    //   }, 1000);
    };

    recognition.onend = () => {
      // Restart to keep listening for wake word
    //   setTimeout(() => {
    //     if (recognitionRef.current) {
    //       recognition.start();
    //     }
    //   }, 500);
    };

    // Start listening
    recognition.start();
    setIsListening(true);
  };

  // Process the question
  const processQuestion = async (questionText) => {
    // Reset state
    setIsThinking(true);
    setResponse('');

    // Check for API key
    let currentApiKey = apiKey;
    if (!currentApiKey) {
      const newApiKey = prompt('Enter your Gemini API key:');
      if (newApiKey) {
        localStorage.setItem('GEMINI_API_KEY', newApiKey);
        setApiKey(newApiKey);
        currentApiKey = newApiKey;
      } else {
        setIsThinking(false);
        setResponse("I need an API key to answer your question.");
        return;
      }
    }

    try {
      // Create context prompt
      const contextPrompt = `I'm cooking "${recipeContext.title}". 
      It's a ${recipeContext.difficulty} difficulty recipe that serves ${recipeContext.servings} and takes ${recipeContext.cookTime} to prepare. 
      Here's my question: ${questionText}`;

      // Send request to Gemini API
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
      
      // Update state
      setResponse(responseText);

      // Read response aloud
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(responseText);
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}. Please check your API key or connection.`);
    } finally {
      setIsThinking(false);
    }
  };

  // Manual trigger
  const handleButtonClick = () => {
    setShowPopup(true);
    setQuestion('');
    setResponse("I'm listening. What would you like to know about your recipe?");
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
        <span>Listening for "Hey Remy"</span>
      </div>
      
      {/* Popup overlay */}
      {showPopup && (
        <div className="recipe-glance-overlay">
          <div className="recipe-glance-modal" ref={popupRef}>
            <button 
              className="close-button" 
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>
            
            <div className="recipe-glance-header">
              <h2>Remy - Your Recipe Assistant</h2>
              <p className="recipe-subtitle">
                {question ? 'Your question:' : 'How can I help you?'}
              </p>
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