let a11 = document.querySelector(".index11");
let a12 = document.querySelector(".index12");
let a13 = document.querySelector(".index13");
let a21 = document.querySelector(".index21");
let a22 = document.querySelector(".index22");
let a23 = document.querySelector(".index23");
let a31 = document.querySelector(".index31");
let a32 = document.querySelector(".index32");
let a33 = document.querySelector(".index33");


let totalWonX = 0;
let totalWonO = 0;
let score = document.querySelector('.score');
// Remove all classes from all cells
let startIndex;
function restart(){
    // Only reset the game cells, not the restart button or overlay
    const cellSelectors = [
        '.index11', '.index12', '.index13',
        '.index21', '.index22', '.index23',
        '.index31', '.index32', '.index33'
    ];
    cellSelectors.forEach(sel => {
        const cell = document.querySelector(sel);
        // Remove all classes except 'cell' and index
        cell.className = sel.replace('.', '') + ' cell';
        // Remove preview classes if any
        cell.classList.remove('preview-x', 'preview-o');
        // Remove all event listeners by cloning
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
    });
    // Re-query all cells after replacement
    a11 = document.querySelector(".index11");
    a12 = document.querySelector(".index12");
    a13 = document.querySelector(".index13");
    a21 = document.querySelector(".index21");
    a22 = document.querySelector(".index22");
    a23 = document.querySelector(".index23");
    a31 = document.querySelector(".index31");
    a32 = document.querySelector(".index32");
    a33 = document.querySelector(".index33");
    // Reset team_switch and startIndex
    team_switch = ['o', 'x','o', 'x','o', 'x','o', 'x','o', 'x','o', 'x'];
    randomTurn = Math.random();
    startIndex = (randomTurn < 0.5) ? 0 : 1;
    // Re-attach click and hover handlers to cells
    [a11, a12, a13, a21, a22, a23, a31, a32, a33].forEach(cell => {
        cell.addEventListener("mouseover", () => {
            if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                const previewClass = team_switch[startIndex] === 'x' ? 'preview-x' : 'preview-o';
                cell.classList.add(previewClass);
            }
        });
        cell.addEventListener("mouseout", () => {
            cell.classList.remove('preview-x');
            cell.classList.remove('preview-o');
        });
        function handler() {
            if (!cell.classList.contains('x') && !cell.classList.contains('o')) {
                cell.classList.remove('preview-x', 'preview-o');
                cell.classList.add(team_switch[startIndex]);
                startIndex++;
                cell.removeEventListener('click', handler);
                setTimeout(checkWinner, 10);
            }
        }
        cell.addEventListener('click', handler);
    });
}

restart();

const restartBtn = document.querySelector('.restart');
const restartText = restartBtn.querySelector('div');
const restartImg = restartBtn.querySelector('img');

restartBtn.addEventListener('click', () => {
    // Animate button
    restartBtn.classList.add('animating');
    // Actually restart the game
    restart();
    // After 1s, restore
    setTimeout(() => {
        restartBtn.classList.remove('animating');
    }, 1000);
});


const gameBoard = document.querySelector('.game-board');
const winnerOverlay = document.getElementById('winnerOverlay');

function checkWinner() {
    const cells = [a11, a12, a13, a21, a22, a23, a31, a32, a33];
    const wins = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // cols
        [0,4,8], [2,4,6]           // diags
    ];
    for (let combo of wins) {
        const [i, j, k] = combo;
        if (
            cells[i].classList.contains('x') &&
            cells[j].classList.contains('x') &&
            cells[k].classList.contains('x')
        ) {
            showWinner('Cross Player Wins!');
            totalWonX++;
            score.innerHTML = `${totalWonX}-${totalWonO}`;
            return 'x';
        }
        if (
            cells[i].classList.contains('o') &&
            cells[j].classList.contains('o') &&
            cells[k].classList.contains('o')
        ) {
            showWinner('Zero Player Wins!');
            totalWonO++;
            score.innerHTML = `${totalWonX}-${totalWonO}`;
            return 'o';
        }
    }
    // Draw condition: all cells filled, no winner
    const allFilled = cells.every(cell => cell.classList.contains('x') || cell.classList.contains('o'));
    if (allFilled) {
        showWinner('Draw!');
        return 'draw';
    }
    return null;
}

function showWinner(msg) {
    gameBoard.classList.add('blur');
    winnerOverlay.textContent = msg;
    winnerOverlay.style.display = 'flex';
}

function hideWinner() {
    gameBoard.classList.remove('blur');
    winnerOverlay.style.display = 'none';
}

// Hide overlay and blur on restart
restartBtn.addEventListener('click', hideWinner);