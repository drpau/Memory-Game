# 🐕 Dog Breed Match - Memory Game

A fun, browser-based memory matching game featuring the top 12 dog breeds. Match all pairs to win!

## 🎮 Game Features

- **24 tiles** arranged in a 6×4 grid
- **12 matching pairs** of dog breed images
- **Two game modes**: Single Player & Two Player
- **Custom player names** - enter your name before playing
- **Game timer** - tracks how long each game takes
- **Animated tile flips** with smooth 3D effects
- **Score tracking** with turn indicators for multiplayer
- **Responsive design** - works on desktop and mobile
- **Single player mode** hides player 2 for a cleaner UI

## 🚀 How to Play

1. Open `index.html` in any modern web browser
2. Enter your name(s) in the player name fields
3. Choose your game mode (Single Player or Two Players)
4. Click tiles to flip them and reveal the dog breed image
5. Match pairs to earn points:
   - **Match**: Tiles are removed, player earns 1 point, and takes another turn
   - **No Match**: Tiles flip back after 1.2 seconds, turn passes to next player
6. Try to match all 12 pairs in the fastest time possible!
7. In Single Player mode, compete against the clock
8. In Two Player mode, take turns with your opponent

## 🛠️ Technical Details

- Pure HTML/CSS/JavaScript - no build step required
- CSS Grid for responsive layout
- CSS 3D transforms for flip animations
- Fisher-Yates shuffle algorithm for randomization

## 🎨 Design

- Kid-friendly, colorful design with:
  - Playful Fredoka One font for headings
  - Soft gradient backgrounds
  - Paw print pattern on tile backs
  - Smooth hover and click animations

## 📱 Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## 🧪 Testing

Run the automated test suite:

```bash
npm install
npm test
```

The test suite verifies:
- Mode selection screen loads correctly
- Player name input fields work
- Single player mode starts correctly
- Game board has 24 tiles in 6x4 grid
- Tiles can be flipped with animation
- Cannot click more than 2 tiles at once
- Match handling works correctly
- Score updates on match
- Two player mode switches turns
- Timer counts up during gameplay
- Restart button works
- Main menu button works

## License

ISC