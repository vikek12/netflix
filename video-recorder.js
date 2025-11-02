class VideoRecorder {
    constructor(canvas) {
        this.canvas = canvas;
        this.mediaRecorder = null;
        this.recordedChunks = [];
        this.isRecording = false;
        this.stream = null;
        this.audioContext = null;
        this.audioDestination = null;
    }

    async startRecording(options = {}) {
        try {
            this.recordedChunks = [];
            
            // Get canvas stream
            const fps = options.fps || 30;
            this.stream = this.canvas.captureStream(fps);
            
            // Setup audio context if audio is enabled
            if (options.includeAudio && options.audioStream) {
                // Create audio context
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.audioDestination = this.audioContext.createMediaStreamDestination();
                
                // Add audio tracks to the stream
                const audioTracks = options.audioStream.getAudioTracks();
                audioTracks.forEach(track => {
                    this.stream.addTrack(track);
                });
            }

            // Setup MediaRecorder
            const mimeType = this.getSupportedMimeType();
            const recorderOptions = {
                mimeType: mimeType,
                videoBitsPerSecond: options.videoBitsPerSecond || 2500000
            };

            this.mediaRecorder = new MediaRecorder(this.stream, recorderOptions);

            // Handle data available
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this.recordedChunks.push(event.data);
                }
            };

            // Handle recording stop
            this.mediaRecorder.onstop = () => {
                console.log('Recording stopped, chunks:', this.recordedChunks.length);
            };

            // Handle errors
            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                this.isRecording = false;
            };

            // Start recording
            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
            
            console.log('Recording started with mime type:', mimeType);
            return true;

        } catch (error) {
            console.error('Error starting recording:', error);
            this.isRecording = false;
            throw error;
        }
    }

    stopRecording() {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder || !this.isRecording) {
                reject(new Error('No active recording'));
                return;
            }

            this.mediaRecorder.onstop = () => {
                this.isRecording = false;
                
                // Create blob from recorded chunks
                const mimeType = this.mediaRecorder.mimeType;
                const blob = new Blob(this.recordedChunks, { type: mimeType });
                
                console.log('Recording stopped, blob size:', blob.size);
                
                // Clean up
                if (this.stream) {
                    this.stream.getTracks().forEach(track => track.stop());
                }
                
                if (this.audioContext) {
                    this.audioContext.close();
                }
                
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    getSupportedMimeType() {
        const types = [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm;codecs=h264',
            'video/webm',
            'video/mp4'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        return 'video/webm'; // Fallback
    }

    downloadVideo(blob, filename = 'animation-video.webm') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    isSupported() {
        return !!(window.MediaRecorder && this.canvas.captureStream);
    }

    getRecordedBlob() {
        if (this.recordedChunks.length === 0) {
            return null;
        }
        
        const mimeType = this.mediaRecorder ? this.mediaRecorder.mimeType : 'video/webm';
        return new Blob(this.recordedChunks, { type: mimeType });
    }

    reset() {
        this.recordedChunks = [];
        this.isRecording = false;
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

// Utility function to create a video preview
function createVideoPreview(blob, containerElement) {
    const video = document.createElement('video');
    video.src = URL.createObjectURL(blob);
    video.controls = true;
    video.style.width = '100%';
    video.style.maxWidth = '600px';
    video.style.borderRadius = '10px';
    
    containerElement.innerHTML = '';
    containerElement.appendChild(video);
    
    return video;
}

// Utility function to get video duration
function getVideoDuration(blob) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(video.src);
            resolve(video.duration);
        };
        
        video.onerror = () => {
            reject(new Error('Failed to load video metadata'));
        };
        
        video.src = URL.createObjectURL(blob);
    });
}
