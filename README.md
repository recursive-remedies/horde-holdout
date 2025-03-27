# Train Simulation Game

## Overview
This project is a train simulation game where players can draw tracks between randomly generated cities to transport people and goods. The objective is to generate the most income through successful deliveries.

## Project Structure
```
train-simulation-game
├── src
│   ├── scenes
│   │   ├── Boot.ts
│   │   ├── Preloader.ts
│   │   ├── MainMenu.ts
│   │   ├── Game.ts
│   │   ├── GameOver.ts
│   │   └── HUD.ts
│   ├── assets
│   │   ├── images
│   │   │   └── placeholder.txt
│   │   └── audio
│   │       └── placeholder.txt
│   ├── main.ts
│   └── vite-env.d.ts
├── vite
│   └── config.dev.mjs
├── package.json
├── tsconfig.json
├── index.html
└── README.md
```

## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   cd train-simulation-game
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080` to play the game.

## Gameplay
- Players will start in the Main Menu where they can begin the game.
- The game will generate random cities on the map.
- Players can draw tracks between cities to transport passengers and goods.
- Successful deliveries will generate income, which can be used to expand the network.
- The game ends when certain conditions are met, and players can view their final score on the Game Over screen.

## Assets
- Placeholder files for images and audio are included in the `src/assets` directory. Replace these with actual game assets to enhance the gameplay experience.

## Technologies Used
- Phaser 3: A fast, robust, and versatile game framework.
- TypeScript: A typed superset of JavaScript that compiles to plain JavaScript.
- Vite: A modern build tool that provides a fast development environment.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.