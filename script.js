// Game state variables
let tourStage = 'firstMove';  // Tracks the current stage of the tour: 'firstMove', 'secondMove', or 'tillEnd'
let level = 'manual';         // Currently unused, possibly for different difficulty levels or automation
let previousSquare = null;    // Keeps track of the last visited square
let legalMoves = [];          // Array of valid knight moves from the current position
let visitedSquares = [];      // Array of all visited squares

document.querySelectorAll('.white-square')
    .forEach((square, index) => {
        square.addEventListener('click', () => {
            console.log(square.innerHTML);
        });
    });


// Called when a player selects a square
function selectSquare(square) 
{
    removeHints(); // Clear previous move hints

    switch(tourStage) 
    {
        case 'firstMove': 
        {
            // First click of the game: mark it as the starting point
            markStartSquare(square);
            document.getElementById(`${square}`).setAttribute('disabled', 'true');
            visitedSquares.push(square);
            document.getElementById('informPlayer').innerHTML = visitedSquares;
            legalMoves = getLegalMoves(square); // Calculate legal knight moves
            tourStage = 'secondMove';           // Advance game stage
            break;
        }
        case 'secondMove': 
        {
            // Validate if the selected square is a legal knight move
            if (legalMoves.includes(square)) 
            {
                markCurrentSquare(square);
                document.getElementById(`${square}`).setAttribute('disabled', 'true');
                previousSquare = square; // Set previous square for next turn
                visitedSquares.push(square);
                document.getElementById('informPlayer').innerHTML = visitedSquares;
                legalMoves = getLegalMoves(square);
                tourStage = 'tillEnd'; // All subsequent moves are handled here
            } 
            else 
            {
                alert('Move not legal!!');
            }
            break;
        }
        case 'tillEnd': 
        {
            // Handles all moves after the second one
            if (legalMoves.includes(square)) 
            {
                markPreviousSquare();      // Mark the previously selected square as visited
                markCurrentSquare(square); // Highlight the new square
                document.getElementById(`${square}`).setAttribute('disabled', 'true');
                previousSquare = square;
                visitedSquares.push(square);
                document.getElementById('informPlayer').innerHTML = visitedSquares;
                legalMoves = getLegalMoves(square); // Get next set of valid moves
                checkEndState();                    // Check if the tour is complete or has a reached a dead-end
            } 
            else 
            {
                alert('Move not legal!!');
            }
            break;
        }
        default: 
        {
            alert('A critical error has occurred. Press OK to reset.');
            location.reload(); // Reload the page to reset game
        }
    }
}

// Highlights the square selected as the start of the tour
function markStartSquare(startSquare) 
{
    const startPoint = document.getElementById(startSquare);
    startPoint.classList.add('start-square');
    startPoint.innerHTML = 'START';
}

// Highlights the currently selected square
function markCurrentSquare(square) 
{
    const currentSquare = document.getElementById(square);
    currentSquare.classList.add('transit-square');
    currentSquare.innerHTML = square;
}

// Marks the previously selected square as visited
function markPreviousSquare() 
{
    const currentSquare = document.getElementById(previousSquare);
    currentSquare.classList.remove('transit-square');
    currentSquare.classList.add('visited-square');
}

// Calculates all valid knight moves from a given position, excluding visited squares
function getLegalMoves(position) 
{
    const columns = 'ABCDEFGH';
    const row = parseInt(position[1], 10) - 1;              // Convert row to 0-indexed
    const col = columns.indexOf(position[0].toUpperCase()); // Convert column to 0-indexed

    const moves = [
        [2, 1], [1, 2], [-1, 2], [-2, 1],
        [-2, -1], [-1, -2], [1, -2], [2, -1]
    ];

    const legalMoves = [];

    for (const [dx, dy] of moves) 
    {
        const newCol = col + dx;
        const newRow = row + dy;

        // Check if the new position is on the board
        if (newCol >= 0 && newCol < 8 && newRow >= 0 && newRow < 8) 
        {
            const newPosition = columns[newCol] + (newRow + 1);
            legalMoves.push(newPosition);
        }
    }

    // Remove squares that have already been visited
    for (let i = 0; i < legalMoves.length; i++) 
    {
        if (visitedSquares.includes(legalMoves[i])) 
        {
            legalMoves.splice(i, 1);
            i--; // Adjust index due to removed item,otherwise the for loop might end without going through all elements
        }
    }
    return legalMoves;
}

// Checks if the game has ended, either successfully or in failure
function checkEndState() 
{
    if (legalMoves.length === 0) 
    {
        if (visitedSquares.length === 64) 
        {
            // All squares visited: tour successful
            alert('');
            setTimeout(function() 
            {
                alert('Congratulations, you have successfully completed the tour. Well done!!');
            }, 300);
        } 
        else 
        {
            // No legal moves left and not all squares visited
            setTimeout(function() 
            {
                alert('Unfortunately you have reached a dead end. Better luck next time.');
            }, 300);
        }
    }
}

// Temporarily highlights legal knight moves
function showLegalMoves() 
{
    for (let i = 0; i < legalMoves.length; i++) 
    {
        document.getElementById(legalMoves[i]).classList.add('legal-hint');
    }

    // Remove hints after 1 second
    setTimeout(function() 
    {
        removeHints();
    },  1000);
}

// Removes all current legal move highlights
function removeHints() 
{
    for (let i = 0; i < legalMoves.length; i++) 
    {
        document.getElementById(legalMoves[i]).classList.remove('legal-hint');
    }
}



