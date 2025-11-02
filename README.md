# 🎬 Text to 3D Animation Video with Hindi Audio

A modern web application that converts text into stunning 3D animated videos with Hindi audio narration.

## ✨ Features

- **3D Text Animation**: Create beautiful 3D text animations using Three.js
- **Hindi Audio Support**: Text-to-speech with Hindi (Devanagari) language support
- **Multiple Animation Styles**: 
  - Rotate 360°
  - Wave Motion
  - Zoom In/Out
  - Bounce
  - Spiral
  - Float
- **Customization Options**:
  - Text color picker
  - Animation speed control
  - Speech rate and pitch adjustment
  - Video duration settings
- **Video Export**: Record and download animations as WebM video files
- **Real-time Preview**: See your animation before generating the video
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- No installation required - runs entirely in the browser!

### Usage

1. **Open the Application**
   - Simply open `index.html` in your web browser
   - Or use a local server: `python -m http.server 8000`

2. **Enter Your Text**
   - Type your text in Hindi (Devanagari) or English
   - Example: "नमस्ते! यह एक 3D एनिमेशन है।"

3. **Customize Your Animation**
   - Choose an animation style from the dropdown
   - Select your preferred text color
   - Adjust animation speed
   - Configure audio settings (rate and pitch)
   - Set video duration

4. **Preview**
   - Click "👁️ Preview Animation" to see and hear your animation

5. **Generate Video**
   - Click "🎥 Generate Video" to record the animation
   - Wait for the recording to complete

6. **Download**
   - Click "⬇️ Download Video" to save your video file

## 🛠️ Technologies Used

- **HTML5**: Structure and canvas element
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Application logic
- **Three.js**: 3D graphics and animations
- **Web Speech API**: Text-to-speech for Hindi audio
- **MediaRecorder API**: Video recording and export
- **Canvas API**: Rendering and capture

## 📁 Project Structure

```
.
├── index.html              # Main HTML file
├── styles.css              # Styling and layout
├── app.js                  # Main application logic
├── three-animation.js      # Three.js animation engine
├── audio-handler.js        # Hindi text-to-speech handler
├── video-recorder.js       # Video recording functionality
└── README.md              # This file
```

## 🎨 Animation Styles

1. **Rotate**: Smooth 360° rotation with subtle tilt
2. **Wave**: Vertical wave motion with rotation
3. **Zoom**: Pulsating zoom in/out effect
4. **Bounce**: Bouncing animation with rotation
5. **Spiral**: Circular spiral motion
6. **Float**: Gentle floating movement

## 🔊 Audio Features

- **Hindi Language Support**: Uses Web Speech API with Hindi (hi-IN) locale
- **Devanagari Script**: Full support for Hindi text input
- **Voice Customization**: Adjust speech rate (0.5x - 2x) and pitch (0.5x - 2x)
- **Fallback Support**: Automatically selects best available voice

## 📹 Video Recording

- **Format**: WebM (VP9/VP8 codec)
- **Frame Rate**: 30 FPS
- **Quality**: High bitrate (2.5 Mbps)
- **Duration**: Customizable (3-30 seconds)
- **Audio Sync**: Synchronized audio and video recording

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| 3D Animation | ✅ | ✅ | ✅ | ✅ |
| Hindi TTS | ✅ | ✅ | ⚠️ | ✅ |
| Video Recording | ✅ | ✅ | ⚠️ | ✅ |

⚠️ = Limited support or requires specific configuration

## 💡 Tips

1. **Hindi Voice**: For best Hindi audio quality, use Chrome or Edge browsers
2. **Video Duration**: Keep videos between 5-15 seconds for optimal file size
3. **Text Length**: Shorter text (1-3 lines) works best for 3D rendering
4. **Performance**: Close other tabs for smoother recording
5. **Mobile**: Desktop browsers recommended for video recording

## 🐛 Troubleshooting

### No Hindi Voice Available
- Check browser language settings
- Try Chrome or Edge browsers
- System may need Hindi language pack installed

### Video Recording Fails
- Ensure browser supports MediaRecorder API
- Check browser permissions
- Try reducing video duration
- Close other resource-intensive applications

### Animation Lag
- Reduce animation speed
- Close other browser tabs
- Use a more powerful device
- Reduce video quality settings

## 🔒 Privacy

- All processing happens locally in your browser
- No data is sent to external servers
- No tracking or analytics
- Your text and videos remain private

## 📝 License

This project is open source and available for personal and educational use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For issues or questions, please create an issue in the repository.

## 🎉 Acknowledgments

- Three.js community for excellent 3D graphics library
- Web Speech API for text-to-speech capabilities
- Google Fonts for Noto Sans Devanagari font

---

**Made with ❤️ using Three.js, Web Speech API & MediaRecorder API**
