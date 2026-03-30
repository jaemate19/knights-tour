// Game state
let board = [];
let currentRow = null;
let currentCol = null;
let startRow = null;
let startCol = null;
let visited = [];
let moveHistory = [];
let gameActive = true;

// Initialize board
function initBoard() 
{
    board = Array(8).fill().map(() => Array(8).fill(false));
    visited = [];
    moveHistory = [];
    gameActive = true;
    currentRow = null;
    currentCol = null;
    startRow = null;
    startCol = null;
}

// Convert chess notation (e.g., "A1") to row, col
function notationToCoord(notation) 
{
    const col = notation.charCodeAt(0) - 65;
    const row = 8 - parseInt(notation[1]);
    return { row, col };
}

// Convert row, col to chess notation
function coordToNotation(row, col) 
{
    const letter = String.fromCharCode(65 + col);
    const number = 8 - row;
    return `${letter}${number}`;
}

// Get all possible knight moves
function getKnightMoves(row, col) 
{
    const moves = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    
    return moves
        .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
        .filter(({ row, col }) => row >= 0 && row < 8 && col >= 0 && col < 8);
}

// Get legal moves (unvisited)
function getLegalMoves(row, col) 
{
    const allMoves = getKnightMoves(row, col);
    return allMoves.filter(({ row, col }) => !board[row][col]);
}

// Make a move
function makeMove(row, col) 
{
    if (!gameActive) return false;
    
    // First move
    if (currentRow === null) 
    {
        startRow = currentRow = row;
        startCol = currentCol = col;
        board[row][col] = true;
        visited.push(coordToNotation(row, col));
        updateDisplay();
        updateInfo();
        return true;
    }
    
    // Check if move is legal
    const legalMoves = getLegalMoves(currentRow, currentCol);
    const isValid = legalMoves.some(move => move.row === row && move.col === col);
    
    if (!isValid) return false;
    
    // Make the move
    currentRow = row;
    currentCol = col;
    board[row][col] = true;
    moveHistory.push({ row, col });
    visited.push(coordToNotation(row, col));
    
    updateDisplay();
    updateInfo();
    
    // Check win/loss
    const totalVisited = visited.length;
    if (totalVisited === 64) 
    {
        gameActive = false;
        showMessage('🎉 VICTORY! You completed the Knight\'s Tour! 🎉', 'win');
    } 
    else if (getLegalMoves(currentRow, currentCol).length === 0) 
    {
        gameActive = false;
        showMessage(`💀 GAME OVER! You visited ${totalVisited}/64 squares before getting stuck. 💀`, 'loss');
    }
    
    return true;
}

// Show hint (highlight legal moves)
function showLegalMoves() 
{
    if (!gameActive || currentRow === null) 
    {
        const msgDiv = document.getElementById('informPlayer');
        const originalMsg = msgDiv.innerHTML;
        msgDiv.innerHTML = '<span style="color:#ffd700;">⚠️ Start the game by clicking a square first!</span>';
        setTimeout(() => 
        {
            if (document.getElementById('informPlayer').innerHTML.includes('Start the game')) 
            {
                updateInfo();
            }
        }, 2000);
        return;
    }
    
    const legalMoves = getLegalMoves(currentRow, currentCol);
    if (legalMoves.length === 0) 
    {
        const msgDiv = document.getElementById('informPlayer');
        const originalMsg = msgDiv.innerHTML;
        msgDiv.innerHTML = '<span style="color:#ffd700;">⚠️ No legal moves available! Click Reset to play again.</span>';
        setTimeout(() => updateInfo(), 2000);
        return;
    }
    
    // Highlight hints temporarily
    const squares = document.querySelectorAll('.row button');
    squares.forEach(square => 
    {
        const id = square.id;
        const { row, col } = notationToCoord(id);
        const isLegal = legalMoves.some(move => move.row === row && move.col === col);
        
        if (isLegal && !board[row][col]) 
        {
            const originalClass = square.className;
            square.classList.add('legal-hint');
            setTimeout(() => 
            {
                if (square.classList.contains('legal-hint')) 
                {
                    square.className = originalClass;
                    updateDisplay(); // Refresh display to maintain correct styling
                }
            }, 1500);
        }
    });
}

// Update visual display
function updateDisplay() 
{
    const chessboardDiv = document.getElementById('chessboard');
    chessboardDiv.innerHTML = '';
    
    for (let i = 0; i < 8; i++) 
    {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        
        for (let j = 0; j < 8; j++) 
        {
            const isWhite = (i + j) % 2 === 0;
            const squareId = coordToNotation(i, j);
            const button = document.createElement('button');
            button.id = squareId;
            button.textContent = squareId;
            
            // Determine styling
            if (startRow === i && startCol === j && currentRow === i && currentCol === j) 
            {
                button.className = 'transit-square';
            } 
            else if (currentRow === i && currentCol === j) 
            {
                button.className = 'transit-square';
            } 
            else if (startRow === i && startCol === j) 
            {
                button.className = 'start-square';
            } 
            else if (board[i][j]) 
            {
                button.className = 'visited-square';
            } 
            else 
            {
                button.className = isWhite ? 'white-square' : 'black-square';
            }
            
            button.onclick = (function(r, c) 
            {
                return function() { selectSquare(coordToNotation(r, c)); };
            })(i, j);
            
            rowDiv.appendChild(button);
        }
        chessboardDiv.appendChild(rowDiv);
    }
}

// Update info panel
function updateInfo() 
{
    const infoDiv = document.getElementById('informPlayer');
    const visitedCount = visited.length;
    const percentComplete = (visitedCount / 64 * 100).toFixed(1);
    
    if (!gameActive && visitedCount < 64) 
    {
        infoDiv.innerHTML = `❌ GAME OVER ❌<br>Visited: ${visitedCount}/64 squares<br>${percentComplete}% complete<br><span style="color:#ffd700;">Click Reset to try again!</span>`;
    } 
    else if (visitedCount === 64) 
    {
        infoDiv.innerHTML = `🏆 PERFECT TOUR! 🏆<br>All 64 squares visited!<br>Amazing achievement! 🎉`;
    } 
    else if (currentRow === null) 
    {
        infoDiv.innerHTML = `👑 Ready to play?<br>Click any square to start the Knight's Tour!<br>${visitedCount}/64 squares visited`;
    } 
    else 
    {
        const legalCount = getLegalMoves(currentRow, currentCol).length;
        infoDiv.innerHTML = `📍 Current: ${coordToNotation(currentRow, currentCol)}<br>✓ Visited: ${visitedCount}/64 (${percentComplete}%)<br>🔮 Possible moves: ${legalCount}<br>📜 Moves: ${visitedCount - 1}`;
    }
}

// Show win/loss message
function showMessage(msg, type) 
{
    const controlSection = document.querySelector('.control-section');
    const existingMsg = document.querySelector('.game-message');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = `game-message ${type === 'win' ? 'win-message' : 'loss-message'}`;
    msgDiv.textContent = msg;
    controlSection.insertBefore(msgDiv, controlSection.firstChild);
    
    setTimeout(() => 
    {
        if (msgDiv) msgDiv.remove();
    }, 5000);
}

// Reset game
function resetGame() 
{
    initBoard();
    updateDisplay();
    updateInfo();
    const existingMsg = document.querySelector('.game-message');
    if (existingMsg) existingMsg.remove();
}

// Select square handler
function selectSquare(squareId) 
{
    if (!gameActive) 
    {
        const msgDiv = document.getElementById('informPlayer');
        msgDiv.innerHTML = '<span style="color:#ffd700;">⚠️ Game over! Click Reset to start a new game.</span>';
        setTimeout(() => updateInfo(), 2000);
        return;
    }
    
    const { row, col } = notationToCoord(squareId);
    makeMove(row, col);
}

// Event listeners
document.getElementById('hintBtn').addEventListener('click', showLegalMoves);
document.getElementById('resetBtn').addEventListener('click', resetGame);

// Initialize game
initBoard();
updateDisplay();
updateInfo();

// Make selectSquare globally available
window.selectSquare = selectSquare;