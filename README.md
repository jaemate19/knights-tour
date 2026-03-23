# Knight's Tour Web App

Welcome to the **Knight's Tour** – a classic chess puzzle implemented as an interactive web application.

This project allows users to manually explore all legal knight moves on a standard 8×8 chessboard, aiming to visit every square exactly once without repeating. It’s a fun and educational way to understand how the knight piece moves and to practice logic and planning.

## Features

- Interactive 8×8 Chessboard
- Legal knight moves highlighted on request
- Start from any square
- Invalid moves are not allowed
- Reset button to start a new game
- Hint system to guide you to the next move
- Win or lose condition based on move history

## Game Rules

- The knight moves in an **L-shape**: 2 squares in one direction, then 1 square perpendicular.
- Each square can be visited **only once**.
- The game is won when **all 64 squares** have been visited.
- Use the **Hint** button to reveal possible next moves.
- Use the **Reset** button to restart the tour at any time.

To run the app locally:

1. Clone this repository:
   ```bash
   git clone git@github.com:jaemate19/knights-tour-web.git
   cd knights-tour-web

2.Open the index.html file in your web browser

Technologies Used

    HTML5
    CSS
    JavaScript (vanilla)

Future Improvements

   - Add a move counter		
   - Add timer so there's a time limit on the game
   - Add an AI solver for automated tour generation
   - Add animation for knight's move    