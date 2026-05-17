# 🧠 MindObserver Pro - Ruthless Edition

A behavioral and digital forensics analysis platform with a cyberpunk interface. Analyze texts, emails, and images for deception indicators, then submit your psychological readings for brutal mentor evaluation.

## 📋 Features

- **Authentication System** - Secure agent registration and login
- **Digital Forensics** - Text, email, and image analysis with deception detection
- **Ruthless Mentor** - Submission system for psychological analysis with feedback
- **Scoring System** - Earn points through forensic analysis and mentor evaluations
- **Neon UI** - Cyberpunk-themed interface with real-time canvas animation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend required - uses browser localStorage

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PsychoScanner/Synapse.git
cd Synapse
```

2. Open `index.html` in your browser:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Or simply open the file directly
open index.html
```

3. Create a new agent profile or log in

## 📁 Project Structure

```
Synapse/
├── index.html          # Main HTML structure
├── styles.css          # Styling and neon effects
├── app.js              # JavaScript logic and interactions
├── README.md           # This file
└── .gitignore          # Git ignore rules
```

## 🎮 Usage

### Creating an Agent Profile

1. Click "Create Profile" on the login screen
2. Enter a codename, email, and security key (minimum 6 characters)
3. Your profile will be stored in browser localStorage

### Digital Forensics Analysis

1. Select evidence type (WhatsApp, Email, or Image)
2. Paste or upload the evidence
3. Click "Initiate Scan" to analyze
4. View deception rate and earn points

### Ruthless Mentor

1. Submit a psychological analysis of any situation
2. The system provides brutal feedback on your reasoning
3. Earn points based on analysis quality

## 🔐 Security Notes

⚠️ **Important:** This application is for educational/entertainment purposes only.

### Current Limitations:
- Passwords are stored in plain text in localStorage
- No backend encryption or authentication
- Client-side only - no server-side validation

### For Production Use:
- Implement proper password hashing (bcrypt, Argon2)
- Use a backend server with HTTPS
- Implement CSRF protection
- Add input validation and sanitization
- Use secure session management
- Consider OAuth2 for authentication

## 🎨 Customization

### Color Scheme
Edit the CSS variables in `styles.css`:
```css
:root {
    --color-neon-cyan: #00ffcc;
    --color-neon-red: #ff3366;
    --color-neon-green: #deff9a;
    /* ... */
}
```

### Canvas Animation
Modify constants in `app.js`:
```javascript
const CONFIG = {
    CANVAS_DOT_COUNT: 40,
    CANVAS_CONNECTION_DISTANCE: 130,
    // ...
};
```

## 🐛 Known Issues

- Image upload analysis returns simulated results (not actual analysis)
- Deception rates are randomly generated for demonstration
- No persistent backend storage between sessions/devices

## 🔮 Future Enhancements

- [ ] Backend integration with proper authentication
- [ ] Real AI-powered text analysis
- [ ] Image recognition and facial analysis
- [ ] User leaderboard system
- [ ] Advanced analytics dashboard
- [ ] Export forensic reports
- [ ] Multi-language support
- [ ] Dark/Light theme toggle

## 📝 License

This project is provided as-is for educational and entertainment purposes.

## 👨‍💻 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📧 Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

---

**Built with** ❤️ **and neon vibes** 🟢
