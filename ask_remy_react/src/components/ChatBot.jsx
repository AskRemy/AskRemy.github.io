import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.css';

const ChatBot = ({ recipeContext }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showChatbot, setShowChatbot] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneStreamRef = useRef(null);
  const wakeDetectionTimerRef = useRef(null);
  const wakePhraseDetectedRef = useRef(false);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('GEMINI_API_KEY');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
    
    // Check if voice functionality is supported
    const voiceSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setVoiceEnabled(voiceSupported);
    
    return () => {
      // Clean up voice recognition on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopMicrophoneProcessing();
    };
  }, []);

  // Auto-scroll to the bottom of the chat when messages update
  useEffect(() => {
    if (messagesEndRef.current && showChatbot) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChatbot]);

  // Initialize speech synthesis
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Get available voices and try to set a neutral voice
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a neutral English voice
        const englishVoice = voices.find(voice => 
          voice.lang.includes('en') && voice.name.includes('Google') && !voice.name.includes('Female')
        ) || voices[0];
        utterance.voice = englishVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Initialize wake word detection with audio processing
  const startMicrophoneProcessing = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      microphoneStreamRef.current = micStream;
      
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      const source = audioContextRef.current.createMediaStreamSource(micStream);
      source.connect(analyserRef.current);
      
      // Start continuous monitoring for wake word activation
      detectActivation();
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setVoiceEnabled(false);
    }
  };
  
  const stopMicrophoneProcessing = () => {
    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      microphoneStreamRef.current = null;
    }
    
    if (wakeDetectionTimerRef.current) {
      clearTimeout(wakeDetectionTimerRef.current);
    }
    
    if (audioContextRef.current && audioContextRef.current.state === 'running') {
      audioContextRef.current.suspend();
    }
  };
  
  // Simple audio activity detection to save resources
  const detectActivation = () => {
    if (!analyserRef.current || !voiceEnabled) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average volume level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    
    // If we detect significant audio activity, start the wake word recognition
    if (average > 20 && !isListening && !wakePhraseDetectedRef.current) {
      startWakeWordRecognition();
    }
    
    wakeDetectionTimerRef.current = setTimeout(detectActivation, 500);
  };
  
  // Setup and start speech recognition for wake word detection
  const startWakeWordRecognition = () => {
    console.log("startWakeWordRecognition");
    if (!voiceEnabled) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Heard:", transcript);
      
      // Check for wake phrase "Hey Remy"
      if (transcript.includes("hey remy") || transcript.includes("hey remmy") || 
          transcript.includes("hay remy") || transcript.includes("hey remi")) {
        
        wakePhraseDetectedRef.current = true;
        handleWakePhraseDetected();
      }
    };
    
    recognition.onend = () => {
      if (!wakePhraseDetectedRef.current) {
        // If wake phrase not detected, continue passive listening
        wakeDetectionTimerRef.current = setTimeout(detectActivation, 500);
      }
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      wakeDetectionTimerRef.current = setTimeout(detectActivation, 1000);
    };
    
    recognition.start();
    setIsListening(true);
  };
  
  // Handle wake phrase detection
  const handleWakePhraseDetected = () => {
    // Visual feedback that we heard the wake phrase
    setShowChatbot(true);
    
    // Add assistant message indicating it's listening
    const assistantMessage = {
      text: "I'm listening. How can I help with your recipe?",
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    speak("I'm listening. How can I help with your recipe?");
    
    // Start listening for the actual command
    startCommandRecognition();
  };
  
  // Listen for the user's command after wake word detected
  const startCommandRecognition = () => {
    if (!voiceEnabled) return;
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    setIsListening(true);
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript;
      
      // Process the command
      setInputText(command);
      sendMessage(command);
    };
    
    recognition.onend = () => {
      setIsListening(false);
      wakePhraseDetectedRef.current = false;
      // Resume passive listening for wake word
      wakeDetectionTimerRef.current = setTimeout(detectActivation, 1000);
    };
    
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      wakePhraseDetectedRef.current = false;
      wakeDetectionTimerRef.current = setTimeout(detectActivation, 1000);
    };
    
    recognition.start();
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const promptForApiKey = () => {
    const newApiKey = prompt('Enter your Gemini API key:');
    if (newApiKey) {
      localStorage.setItem('GEMINI_API_KEY', newApiKey);
      setApiKey(newApiKey);
      return newApiKey;
    }
    return null;
  };

  const sendMessage = async (message = null) => {
    const textToSend = message || inputText.trim();
    if (!textToSend) return;
    
    // Get or prompt for API key
    let currentApiKey = apiKey;
    if (!currentApiKey) {
      currentApiKey = promptForApiKey();
      if (!currentApiKey) return;
    }

    // Add user message to chat
    const userMessage = {
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare context about the recipe for better responses
      const contextPrompt = `I'm cooking "${recipeContext.title}". 
      It's a ${recipeContext.difficulty} difficulty recipe that serves ${recipeContext.servings} and takes ${recipeContext.cookTime} to prepare. 
      Here's my question: ${textToSend}`;

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
      
      // Handle the response
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
        "I'm having trouble connecting to the assistant. Please check your API key or try again later.";
      
      const botMessage = {
        text: responseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Read out the response
      speak(responseText);
      
    } catch (error) {
      // Add error message to chat
      const errorMessage = {
        text: `Error: ${error.message}. Please check your API key or network connection.`,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      speak("I'm sorry, I encountered an error. Please check your API key or network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  const toggleVoiceListening = () => {
    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      stopMicrophoneProcessing();
      setIsListening(false);
    } else {
      // Start listening
      startMicrophoneProcessing();
      setIsListening(true);
      
      // Add a message to let the user know voice is active
      const systemMessage = {
        text: "Voice assistant activated. Say 'Hey Remy' to get my attention.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prevMessages => [...prevMessages, systemMessage]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-controls">
        <button 
          className="chatbot-toggle" 
          onClick={toggleChatbot}
        >
          {showChatbot ? "Hide Recipe Assistant" : "Show Recipe Assistant"}
        </button>
        
        {voiceEnabled && (
          <button 
            className={`voice-toggle ${isListening ? 'listening' : ''}`}
            onClick={toggleVoiceListening}
            title={isListening ? "Turn off voice assistant" : "Turn on voice assistant"}
          >
            {isListening ? "Voice Listening..." : "Enable Voice"}
            <span className={`microphone-icon ${isListening ? 'active' : ''}`}>
              🎤
            </span>
          </button>
        )}
      </div>
      
      {showChatbot && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h3>Remy - Your Recipe Assistant</h3>
            {isListening && <div className="listening-indicator">Listening for "Hey Remy"</div>}
          </div>
          
          <div className="chatbot-messages">
            {messages.length === 0 ? (
              <div className="welcome-message">
                <p>Hi there! I'm Remy, your recipe assistant. Ask me anything about cooking 
                "{recipeContext.title}" or get help with substitutions, techniques, or tips!</p>
                {voiceEnabled && (
                  <p className="voice-hint">Try saying "Hey Remy" followed by your question for hands-free help!</p>
                )}
              </div>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-content">{msg.text}</div>
                  <div className="message-timestamp">{msg.timestamp}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                <span>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this recipe..."
              disabled={isLoading}
            />
            <button 
              onClick={() => sendMessage()}
              disabled={isLoading || !inputText.trim()}
            >
              Send
            </button>
          </div>
          
          {!apiKey && (
            <div className="api-key-notice">
              <p>You'll need to provide a Gemini API key to use the assistant.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;