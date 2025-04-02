import React, { useState, useEffect, useRef } from 'react';

const VoiceBot = () => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState([]);
  const recognitionRef = useRef(null);

  // Check if speech recognition is supported
  useEffect(() => {
    const voiceSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    setVoiceEnabled(voiceSupported);
    
    return () => {
      // Clean up voice recognition on unmount
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    console.log("startListening called");
    if (!voiceEnabled) {
      addMessage("Speech recognition not supported in this browser", "system");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    // Stop any existing recognition instance
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    // Create and configure a new recognition instance
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // Set to continuous to keep listening
    recognition.continuous = true;
    // Get interim results to show feedback while speaking
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // Handle results
    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        // Final results are considered more accurate
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          addMessage(`Transcribed: "${transcript}"`, "transcription");
        } else {
          // Interim results may change as more audio is processed
          interimTranscript += transcript;
        }
      }
      
      // Update the displayed transcript
      setTranscript(interimTranscript);
    };
    
    // Handle errors
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      addMessage(`Voice recognition error: ${event.error}`, "system");
      setIsListening(false);
    };
    
    // Handle when recognition stops
    recognition.onend = () => {
      // Only restart if we're still supposed to be listening
      if (isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };
    
    // Start listening
    try {
      recognition.start();
      setIsListening(true);
      addMessage("Voice recognition activated. Try saying something!", "system");
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      addMessage(`Error starting speech recognition: ${error.message}`, "system");
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setTranscript('');
    addMessage("Voice recognition deactivated.", "system");
  };
  
  const addMessage = (text, type) => {
    setMessages(prevMessages => [
      ...prevMessages, 
      {
        text,
        type,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const toggleVoiceListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="speech-recognition-container">
      <div className="controls">
        <button 
          className={`voice-toggle ${isListening ? 'listening' : ''}`}
          onClick={toggleVoiceListening}
          disabled={!voiceEnabled}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
          <span className={`microphone-icon ${isListening ? 'active' : ''}`}>
            🎤
          </span>
        </button>
      </div>
      
      {/* Current transcription display */}
      {isListening && transcript && (
        <div className="transcript-area">
          <p><strong>Currently hearing:</strong> {transcript}</p>
          <div className="listening-wave">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      )}
      
      {/* Messages/History area */}
      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="instructions">
            <p>Click "Start Listening" to begin speech recognition.</p>
            {!voiceEnabled && (
              <p className="warning">
                Speech recognition is not supported in this browser or requires HTTPS.
              </p>
            )}
          </div>
        ) : (
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">{msg.text}</div>
                <div className="message-timestamp">{msg.timestamp}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceBot;