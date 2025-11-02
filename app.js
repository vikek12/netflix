// Main Application
class App {
    constructor() {
        this.animation = null;
        this.audioHandler = null;
        this.videoRecorder = null;
        this.recordedBlob = null;
        this.isGenerating = false;
        
        this.init();
    }

    init() {
        // Initialize Three.js animation
        this.animation = new ThreeAnimation('threejsCanvas');
        
        // Initialize audio handler
        this.audioHandler = new AudioHandler();
        
        // Initialize video recorder
        this.videoRecorder = new VideoRecorder(this.animation.getCanvas());
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check browser support
        this.checkBrowserSupport();
        
        // Start animation loop
        this.animation.start();
        
        console.log('App initialized successfully');
    }

    setupEventListeners() {
        // Text input
        const textInput = document.getElementById('textInput');
        
        // Animation style
        const animationStyle = document.getElementById('animationStyle');
        animationStyle.addEventListener('change', (e) => {
            this.animation.setAnimationStyle(e.target.value);
        });
        
        // Text color
        const textColor = document.getElementById('textColor');
        textColor.addEventListener('change', (e) => {
            const color = parseInt(e.target.value.replace('#', ''), 16);
            this.animation.setTextColor(color);
            
            // Update text if exists
            const text = textInput.value.trim();
            if (text) {
                this.animation.createTextGeometry(text);
            }
        });
        
        // Animation speed
        const animationSpeed = document.getElementById('animationSpeed');
        const speedValue = document.getElementById('speedValue');
        animationSpeed.addEventListener('input', (e) => {
            const speed = parseFloat(e.target.value);
            this.animation.setAnimationSpeed(speed);
            speedValue.textContent = speed.toFixed(1) + 'x';
        });
        
        // Speech rate
        const speechRate = document.getElementById('speechRate');
        const rateValue = document.getElementById('rateValue');
        speechRate.addEventListener('input', (e) => {
            const rate = parseFloat(e.target.value);
            this.audioHandler.setRate(rate);
            rateValue.textContent = rate.toFixed(1) + 'x';
        });
        
        // Speech pitch
        const speechPitch = document.getElementById('speechPitch');
        const pitchValue = document.getElementById('pitchValue');
        speechPitch.addEventListener('input', (e) => {
            const pitch = parseFloat(e.target.value);
            this.audioHandler.setPitch(pitch);
            pitchValue.textContent = pitch.toFixed(1) + 'x';
        });
        
        // Preview button
        const previewBtn = document.getElementById('previewBtn');
        previewBtn.addEventListener('click', () => this.handlePreview());
        
        // Generate button
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.addEventListener('click', () => this.handleGenerate());
        
        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', () => this.handleDownload());
    }

    checkBrowserSupport() {
        const status = document.getElementById('status');
        
        if (!this.audioHandler.isSupported()) {
            this.showStatus('Warning: Speech synthesis not supported in this browser', 'error');
        }
        
        if (!this.videoRecorder.isSupported()) {
            this.showStatus('Warning: Video recording not supported in this browser', 'error');
        }
        
        // Check for Hindi voice
        setTimeout(() => {
            const audioStatus = this.audioHandler.getStatus();
            if (!audioStatus.hindiVoiceAvailable) {
                console.warn('Hindi voice not available, using default voice');
            }
        }, 1000);
    }

    handlePreview() {
        const textInput = document.getElementById('textInput');
        const text = textInput.value.trim();
        
        if (!text) {
            this.showStatus('Please enter some text', 'error');
            return;
        }
        
        // Create text geometry
        this.animation.reset();
        this.animation.createTextGeometry(text);
        
        // Test audio if enabled
        const enableAudio = document.getElementById('enableAudio').checked;
        if (enableAudio) {
            this.audioHandler.speak(
                text,
                () => {
                    this.showStatus('Playing audio preview...', 'info');
                },
                () => {
                    this.showStatus('Preview complete!', 'success');
                },
                (error) => {
                    this.showStatus('Audio error: ' + error, 'error');
                }
            );
        } else {
            this.showStatus('Preview started (audio disabled)', 'success');
        }
    }

    async handleGenerate() {
        if (this.isGenerating) {
            this.showStatus('Already generating video...', 'info');
            return;
        }
        
        const textInput = document.getElementById('textInput');
        const text = textInput.value.trim();
        
        if (!text) {
            this.showStatus('Please enter some text', 'error');
            return;
        }
        
        const enableAudio = document.getElementById('enableAudio').checked;
        const videoDuration = parseInt(document.getElementById('videoDuration').value) * 1000;
        
        this.isGenerating = true;
        this.recordedBlob = null;
        
        // Disable buttons
        document.getElementById('generateBtn').disabled = true;
        document.getElementById('downloadBtn').disabled = true;
        
        try {
            // Reset animation
            this.animation.reset();
            this.animation.createTextGeometry(text);
            
            this.showStatus('Preparing video recording...', 'info');
            
            // Start recording
            await this.videoRecorder.startRecording({
                fps: 30,
                videoBitsPerSecond: 2500000
            });
            
            this.showStatus('Recording video... Please wait', 'info');
            
            // Play audio if enabled
            if (enableAudio) {
                this.audioHandler.speak(text);
            }
            
            // Record for specified duration
            await this.delay(videoDuration);
            
            // Stop audio
            this.audioHandler.stop();
            
            // Stop recording
            this.showStatus('Finalizing video...', 'info');
            this.recordedBlob = await this.videoRecorder.stopRecording();
            
            this.showStatus('Video generated successfully! Click download to save.', 'success');
            
            // Enable download button
            document.getElementById('downloadBtn').disabled = false;
            
        } catch (error) {
            console.error('Error generating video:', error);
            this.showStatus('Error generating video: ' + error.message, 'error');
        } finally {
            this.isGenerating = false;
            document.getElementById('generateBtn').disabled = false;
        }
    }

    handleDownload() {
        if (!this.recordedBlob) {
            this.showStatus('No video to download. Generate a video first.', 'error');
            return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        const filename = `3d-animation-${timestamp}.webm`;
        
        this.videoRecorder.downloadVideo(this.recordedBlob, filename);
        this.showStatus('Video downloaded successfully!', 'success');
    }

    showStatus(message, type = 'info') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = 'status-message show ' + type;
        
        // Auto hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                status.classList.remove('show');
            }, 5000);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    
    // Make app globally accessible for debugging
    window.app = app;
    
    console.log('Text to 3D Animation Video App loaded successfully!');
    console.log('Enter text in Hindi or English and click Preview or Generate Video');
});
