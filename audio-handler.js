class AudioHandler {
    constructor() {
        this.synthesis = window.speechSynthesis;
        this.utterance = null;
        this.voices = [];
        this.hindiVoice = null;
        this.isPlaying = false;
        this.rate = 1;
        this.pitch = 1;
        
        this.init();
    }

    init() {
        // Load voices
        this.loadVoices();
        
        // Chrome loads voices asynchronously
        if (this.synthesis.onvoiceschanged !== undefined) {
            this.synthesis.onvoiceschanged = () => {
                this.loadVoices();
            };
        }
    }

    loadVoices() {
        this.voices = this.synthesis.getVoices();
        
        // Try to find Hindi voice
        // Look for voices with 'hi' or 'Hindi' in the lang or name
        this.hindiVoice = this.voices.find(voice => 
            voice.lang.startsWith('hi') || 
            voice.lang.startsWith('hi-IN') ||
            voice.name.toLowerCase().includes('hindi')
        );

        // Fallback to any Indian English voice
        if (!this.hindiVoice) {
            this.hindiVoice = this.voices.find(voice => 
                voice.lang.startsWith('en-IN')
            );
        }

        // Final fallback to default voice
        if (!this.hindiVoice && this.voices.length > 0) {
            this.hindiVoice = this.voices[0];
        }

        console.log('Available voices:', this.voices.length);
        console.log('Selected Hindi voice:', this.hindiVoice);
    }

    speak(text, onStart, onEnd, onError) {
        // Stop any ongoing speech
        this.stop();

        if (!text || text.trim() === '') {
            if (onError) onError('No text to speak');
            return;
        }

        // Create new utterance
        this.utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        if (this.hindiVoice) {
            this.utterance.voice = this.hindiVoice;
        }
        
        // Set language to Hindi
        this.utterance.lang = 'hi-IN';
        
        // Set rate and pitch
        this.utterance.rate = this.rate;
        this.utterance.pitch = this.pitch;
        
        // Set volume
        this.utterance.volume = 1;

        // Event handlers
        this.utterance.onstart = () => {
            this.isPlaying = true;
            console.log('Speech started');
            if (onStart) onStart();
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            console.log('Speech ended');
            if (onEnd) onEnd();
        };

        this.utterance.onerror = (event) => {
            this.isPlaying = false;
            console.error('Speech error:', event);
            if (onError) onError(event.error);
        };

        // Speak
        try {
            this.synthesis.speak(this.utterance);
        } catch (error) {
            console.error('Error speaking:', error);
            if (onError) onError(error.message);
        }
    }

    stop() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
        }
        this.isPlaying = false;
    }

    pause() {
        if (this.synthesis.speaking && !this.synthesis.paused) {
            this.synthesis.pause();
        }
    }

    resume() {
        if (this.synthesis.paused) {
            this.synthesis.resume();
        }
    }

    setRate(rate) {
        this.rate = Math.max(0.5, Math.min(2, rate));
    }

    setPitch(pitch) {
        this.pitch = Math.max(0.5, Math.min(2, pitch));
    }

    getVoices() {
        return this.voices;
    }

    getHindiVoice() {
        return this.hindiVoice;
    }

    isSupported() {
        return 'speechSynthesis' in window;
    }

    getStatus() {
        return {
            isPlaying: this.isPlaying,
            isSpeaking: this.synthesis.speaking,
            isPaused: this.synthesis.paused,
            voicesLoaded: this.voices.length > 0,
            hindiVoiceAvailable: this.hindiVoice !== null
        };
    }
}

// Test if Hindi text is present
function containsHindiText(text) {
    // Devanagari Unicode range: U+0900 to U+097F
    const devanagariRegex = /[\u0900-\u097F]/;
    return devanagariRegex.test(text);
}

// Utility function to estimate speech duration
function estimateSpeechDuration(text, rate = 1) {
    // Average speaking rate is about 150 words per minute
    // Adjust for rate
    const wordsPerMinute = 150 * rate;
    const words = text.trim().split(/\s+/).length;
    const minutes = words / wordsPerMinute;
    const seconds = minutes * 60;
    
    // Add some buffer time
    return Math.ceil(seconds) + 2;
}
