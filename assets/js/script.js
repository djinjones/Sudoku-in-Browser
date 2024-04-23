document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const errorCount = document.getElementById('errorCount');
    let mistakes = 0;
    let solvedBoard = [];

    function generateBoard() {
        const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
        numbers.sort(() => Math.random() - 0.5); // Shuffle numbers

        const rows = [];
        for (let i = 0; i < 9; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                if (Math.random() < 0.5) {
                    row.push(0); // Fill half of the cells with zeros
                } else {
                    row.push(numbers[(i * 3 + Math.floor(i / 3) + j) % 9]);
                }
            }
            rows.push(row);
        }
        return rows;
    }

    function generatePartialBoard(difficulty) {
        let filledCellsCount;
        switch (difficulty) {
            case 'easy':
                filledCellsCount = 20;
                break;
            case 'medium':
                filledCellsCount = 30;
                break;
            case 'hard':
                filledCellsCount = 47;
                break;
            case 'extreme':
                filledCellsCount = 60;
                break;
            default:
                filledCellsCount = 20; // Default to easy
        }
    
        const numbers = Array.from({ length: 9 }, (_, i) => i + 1);
        numbers.sort(() => Math.random() - 0.5); // Shuffle numbers
    
        const rows = [];
        for (let i = 0; i < 9; i++) {
            const row = [];
            for (let j = 0; j < 9; j++) {
                if (Math.random() < filledCellsCount / 81) {
                    row.push(0); // Fill cell with zero based on probability
                } else {
                    row.push(numbers[(i * 3 + Math.floor(i / 3) + j) % 9]);
                }
            }
            rows.push(row);
        }
        solvedBoard = solveSudoku(rows);
        renderBoard(rows);
        updateMistakesCount();
    }
    
    

    function renderBoard(boardData) {
        console.log("Rendering board...");
        board.innerHTML = '';
        boardData.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('row');
            row.forEach((cell, colIndex) => {
                const cellElement = document.createElement('div');
                cellElement.classList.add('cell');
                cellElement.innerText = cell === 0 ? '' : cell;
                if (cell === 0) {
                    cellElement.contentEditable = true;
                    cellElement.addEventListener('input', () => {
                        validateCell(rowIndex, colIndex, cellElement);
                        updateMistakesCount();
                    });
                    cellElement.addEventListener('keypress', (e) => {
                        const keyValue = e.key;
                        if (!/[1-9]/.test(keyValue)) {
                            e.preventDefault();
                        }
                    });
                }
                rowElement.appendChild(cellElement);
            });
            board.appendChild(rowElement);
        });
    }
    
    
    

    function validateCell(row, col, cellElement) {
        const userInput = parseInt(cellElement.innerText) || 0;
        if (userInput !== solvedBoard[row][col]) {
            mistakes++;
            cellElement.innerText = ''; // Clear incorrect input
            cellElement.setAttribute('placeholder', userInput); // Set placeholder to incorrect value
            cellElement.style.color = 'red'; // Set placeholder color to red
        } else {
            cellElement.removeAttribute('placeholder'); // Remove placeholder if input is correct
            cellElement.style.color = 'black'; // Set text color to black for correct input
        }
    }
    
    

    function updateMistakesCount() {
        errorCount.textContent = `Mistakes: ${mistakes}`;
    }

    function solveSudoku(board) {
        board = JSON.parse(JSON.stringify(board)); // Deep clone the board
        if (solveHelper(board)) {
            return board;
        } else {
            return null; // If the board is unsolvable, return null
        }
    }

    function solveHelper(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveHelper(board)) {
                                return true;
                            } else {
                                board[row][col] = 0;
                            }
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num || board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + i % 3] === num) {
                return false;
            }
        }
        return true;
    }

    function solve() {
        const currentBoard = getCurrentBoard();
        const solved = solveSudoku(currentBoard);
        if (solved) {
            renderBoard(solved);
        } else {
            console.error("Unable to solve the Sudoku puzzle.");
        }
    }
    

    function getCurrentBoard() {
        const currentBoard = [];
        const rows = board.querySelectorAll('.row');
        rows.forEach(row => {
            const cells = row.querySelectorAll('.cell');
            const rowData = [];
            cells.forEach(cell => {
                const value = cell.textContent.trim();
                rowData.push(value === '' ? 0 : parseInt(value));
            });
            currentBoard.push(rowData);
        });
        return currentBoard;
    }

    document.getElementById('solveBtn').addEventListener('click', solve);

    document.getElementById('newGameBtn').addEventListener('click', () => {
        const difficulty = document.getElementById('difficulty').value;
        generatePartialBoard(difficulty);
        mistakes = 0;
        updateMistakesCount();
    });

    generatePartialBoard('easy'); // Call generatePartialBoard function when page loads
});
