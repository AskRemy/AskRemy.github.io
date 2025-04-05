// VoiceService.js
// Handles speech recognition and speech synthesis

export default class VoiceService {
    constructor(onWakeWordDetected, onTranscriptUpdate) {
      this.recognition = null;
      this.isListening = false;
      this.onWakeWordDetected = onWakeWordDetected;
      this.onTranscriptUpdate = onTranscriptUpdate;
      
      // Check if speech recognition is supported
      this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    }
  
    // Start listening for the wake word
    startWakeWordDetection() {
      if (!this.isSupported) {
        console.log('Speech recognition not supported');
        return false;
      }
  
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
  
      // Configure recognition
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
  
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          
          if (event.results[i].isFinal) {
            // Check for wake word
            if (transcript.toLowerCase().includes('hey remy')) {
              const questionMatch = transcript.toLowerCase().match(/hey remy,?\s*(.*)/i);
              const questionText = questionMatch ? questionMatch[1].trim() : '';
              
              // Call the wake word handler with the question (if any)
              this.onWakeWordDetected(questionText);
            }
          } else {
            interimTranscript += transcript;
          }
        }
        
        this.onTranscriptUpdate(interimTranscript);
      };
  
      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
  
      this.recognition.onend = () => {
        console.log('Recognition ended');
        // Attempt to restart if it stops unexpectedly
        if (this.isListening) {
          this.recognition.start();
        }
      };
  
      // Start listening
      this.recognition.start();
      this.isListening = true;
      return true;
    }
  
    // Stop listening
    stopListening() {
      if (this.recognition) {
        this.recognition.stop();
        this.isListening = false;
      }
    }
  
    // Speak a response
    speakResponse(text) {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
      }
    }
  }