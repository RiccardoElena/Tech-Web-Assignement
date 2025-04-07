'use strict';

const TicTacToe = (() => {
  const SYMBOLS = {
    X: '❌',
    O: '⭕',
  };

  const BOARD_SIZE = 3;
  const TIMEOUT_DELAY = 100;

  const createGame = (containerId) => {
    const container = document.getElementById(containerId);
    if (!container)
      throw new Error(`Elemento con ID "${containerId}" non trovato`);

    const state = {
      players: [SYMBOLS.X, SYMBOLS.O],
      score: [0, 0],
      currentPlayer: 0,
      moves: 0,
      board: Array(BOARD_SIZE)
        .fill()
        .map(() => Array(BOARD_SIZE).fill('')),
    };

    let boardUI;

    const checkWin = (playerIndex) => {
      const { board, players } = state;
      const symbol = players[playerIndex];

      for (let i = 0; i < BOARD_SIZE; i++)
        if (board[i].every((cell) => cell === symbol)) return true;

      for (let j = 0; j < BOARD_SIZE; j++)
        if (board.every((row) => row[j] === symbol)) return true;

      if (board.every((row, i) => row[i] === symbol)) return true;

      if (board.every((row, i) => row[BOARD_SIZE - 1 - i] === symbol))
        return true;

      return false;
    };

    const checkDraw = () => state.moves === BOARD_SIZE * BOARD_SIZE;

    const handleCellClick = (cell) => {
      if (cell.textContent) return;

      const { currentPlayer, players } = state;
      const symbol = players[currentPlayer];

      cell.textContent = symbol;

      const row = cell.parentElement.rowIndex;
      const col = cell.cellIndex;
      state.board[row][col] = symbol;
      state.moves++;

      if (checkWin(currentPlayer)) {
        setTimeout(() => {
          state.score[currentPlayer]++;
          alert(`Player ${symbol} wins!`);
          resetGame();
          updateScoreBoard();
        }, TIMEOUT_DELAY);
        return;
      }

      if (checkDraw()) {
        setTimeout(() => {
          state.score[0] += 0.5;
          state.score[1] += 0.5;
          alert("It's a draw!");
          resetGame();
          updateScoreBoard();
        }, TIMEOUT_DELAY);
        return;
      }

      state.currentPlayer = (state.currentPlayer + 1) % 2;
      updateGameInfo();
    };

    const resetGame = () => {
      state.currentPlayer = 0;
      state.moves = 0;
      state.board = Array(BOARD_SIZE)
        .fill()
        .map(() => Array(BOARD_SIZE).fill(''));

      const cells = boardUI.querySelectorAll('td');
      cells.forEach((cell) => (cell.textContent = ''));

      updateGameInfo();
    };

    const fullReset = () => {
      state.score = [0, 0];
      resetGame();
      updateScoreBoard();
    };

    const createBoardUI = () => {
      const table = document.createElement('table');

      table.addEventListener('click', (event) => {
        const cell = event.target;
        if (cell.tagName === 'TD') {
          handleCellClick(cell);
        }
      });

      for (let i = 0; i < BOARD_SIZE; i++) {
        const row = document.createElement('tr');

        for (let j = 0; j < BOARD_SIZE; j++) {
          const cell = document.createElement('td');
          row.appendChild(cell);
        }

        table.appendChild(row);
      }

      return table;
    };

    const createGameInfo = () => {
      const { currentPlayer, players, moves } = state;

      const gameInfo = document.createElement('div');
      gameInfo.id = 'game-info';

      const message = document.createElement('p');
      message.textContent = `Player ${players[currentPlayer]}'s turn: ${moves} moves`;

      const resetButton = document.createElement('button');
      resetButton.textContent = 'Reset Game';
      resetButton.addEventListener('click', resetGame);

      gameInfo.appendChild(message);
      gameInfo.appendChild(resetButton);
      applyFlexStyle(gameInfo);

      return gameInfo;
    };

    const updateGameInfo = () => {
      const oldInfo = document.getElementById('game-info');
      const newInfo = createGameInfo();
      container.replaceChild(newInfo, oldInfo);
    };

    const createScoreBoard = () => {
      const { players, score } = state;

      const scoreBoard = document.createElement('div');
      scoreBoard.id = 'score-board';

      const player1Score = document.createElement('p');
      player1Score.textContent = `Player 1 (${players[0]}): ${score[0]}`;

      const player2Score = document.createElement('p');
      player2Score.textContent = `Player 2 (${players[1]}): ${score[1]}`;

      const resetButton = document.createElement('button');
      resetButton.textContent = 'Reset Score';
      resetButton.addEventListener('click', () => {
        state.score = [0, 0];
        updateScoreBoard();
      });

      scoreBoard.appendChild(player1Score);
      scoreBoard.appendChild(player2Score);
      scoreBoard.appendChild(resetButton);

      applyFlexStyle(scoreBoard);

      return scoreBoard;
    };

    const updateScoreBoard = () => {
      const oldScoreBoard = document.getElementById('score-board');
      const newScoreBoard = createScoreBoard();
      container.replaceChild(newScoreBoard, oldScoreBoard);
    };

    const applyFlexStyle = (element) => {
      element.style.display = 'flex';
      element.style.alignItems = 'center';
      element.style.width = '20rem';
      element.style.justifyContent = 'space-between';
    };

    const createFullResetButton = () => {
      const button = document.createElement('button');
      button.textContent = 'Full Reset';
      button.addEventListener('click', fullReset);
      return button;
    };

    const init = () => {
      container.innerHTML = '';

      boardUI = createBoardUI();
      const gameInfo = createGameInfo();
      const scoreBoard = createScoreBoard();
      const fullResetButton = createFullResetButton();

      container.appendChild(fullResetButton);
      container.appendChild(scoreBoard);
      container.appendChild(gameInfo);
      container.appendChild(boardUI);
    };

    return {
      init,
    };
  };

  return {
    createGame,
  };
})();

const setupGame = (id) => {
  const game = TicTacToe.createGame(id);
  game.init();
};
