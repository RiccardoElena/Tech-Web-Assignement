'use strict';

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(point) {
    return new Position(this.x + point.x, this.y + point.y);
  }

  equals(point) {
    return this.x === point.x && this.y === point.y;
  }
}

const DIRECTIONS = {
  UP: new Position(0, -1),
  DOWN: new Position(0, 1),
  LEFT: new Position(-1, 0),
  RIGHT: new Position(1, 0),
};

class Snake {
  constructor(points) {
    this.body = points.map((point) => new Position(point.x, point.y));
    this.direction = DIRECTIONS.RIGHT;
    this.dead = false;
  }

  isPartOfBody(position) {
    return this.body.some((pos) => pos.equals(position));
  }

  move(newHead = this.body[0].plus(this.direction), hasEaten = false) {
    if (this.dead) return;
    if (this.isPartOfBody(newHead)) {
      this.dead = true;
      return;
    }
    this.body.unshift(newHead);

    this.head = newHead;
    if (!hasEaten) this.body.pop();
  }

  changeDirection(dir) {
    if (!dir) return;
    if (dir.x === this.direction.x || dir.y === this.direction.y) return;
    this.direction = dir;
  }
}

class GameState {
  BOARD_SIZE = 19;
  INITIAL_SNAKE_LEN = 3;
  constructor() {
    this.pause = false;
    this.score = 0;
    this.record = 0;
    this.win = false;
    this.snake = new Snake(
      Array(this.INITIAL_SNAKE_LEN)
        .fill()
        .map(
          (_, index) =>
            new Position(
              Math.floor(this.BOARD_SIZE / 2) - index,
              Math.floor(this.BOARD_SIZE / 2)
            )
        )
    );

    this.foodPos = this.generateFood();
    this.gameOver = false;
  }

  resetState() {
    this.score = 0;
    this.snake = new Snake(
      Array(this.INITIAL_SNAKE_LEN)
        .fill()
        .map(
          (_, index) =>
            new Position(
              Math.floor(this.BOARD_SIZE / 2) - index,
              Math.floor(this.BOARD_SIZE / 2)
            )
        )
    );

    this.foodPos = this.generateFood();
    this.gameOver = false;
  }

  isOutOfBound(point) {
    return (
      point.x < 0 ||
      point.x >= this.BOARD_SIZE ||
      point.y < 0 ||
      point.y >= this.BOARD_SIZE
    );
  }

  resetRecord() {
    this.record = 0;
  }

  generateFood() {
    let newFood;
    do {
      newFood = new Position(
        Math.floor(Math.random() * this.BOARD_SIZE),
        Math.floor(Math.random() * this.BOARD_SIZE)
      );
    } while (this.snake.isPartOfBody(newFood));
    return newFood;
  }

  gameStep() {
    const direction = this.snake.direction;

    const newHead = this.snake.body[0].plus(direction);
    if (this.isOutOfBound(newHead)) {
      this.snake.dead = true;
      this.gameOver = true;
      return;
    }

    const hasEaten = newHead.equals(this.foodPos);
    this.snake.move(newHead, hasEaten);
    if (hasEaten) {
      this.foodPos = this.generateFood();
      this.score++;
      if (this.score > this.record) this.record = this.score;
    }

    this.gameOver = this.snake.dead;
    if (this.snake.body.length === this.BOARD_SIZE * this.BOARD_SIZE)
      this.win = true;
  }
}

class Renderer {
  constructor(gameState, containerId) {
    this.gameState = gameState;
    this.container = document.getElementById(containerId);
  }

  flexStyle() {
    return 'display: flex; height: 2rem; align-items: center';
  }

  initialRender() {
    const recordContainer = document.createElement('div');
    recordContainer.style = this.flexStyle();
    const resetRecordButton = document.createElement('button');
    resetRecordButton.style = 'margin: 10px';
    resetRecordButton.textContent = 'Reset Record';
    resetRecordButton.addEventListener('click', () => {
      this.gameState.resetRecord();
      this.render();
    });

    const record = document.createElement('p');
    record.id = 'record';
    record.textContent = `Current Record: ${this.gameState.record}`;
    recordContainer.appendChild(record);
    recordContainer.appendChild(resetRecordButton);

    const score = document.createElement('p');
    score.id = 'score';
    score.textContent = `Current Score: ${this.gameState.score}`;

    const table = document.createElement('table');
    for (let y = 0; y < this.gameState.BOARD_SIZE; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.gameState.BOARD_SIZE; x++) {
        const cell = document.createElement('td');
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    this.container.innerHTML = '';
    this.container.appendChild(recordContainer);
    this.container.appendChild(score);
    this.container.appendChild(table);
  }

  render() {
    const table = this.container.querySelector('table');
    if (!table) return;

    const cells = table.getElementsByTagName('td');
    Array.from(cells).forEach(
      (cell, index) => (cell.className = this.retrieveClassFromGameState(index))
    );

    const gameInfo = this.container.querySelectorAll('p');
    gameInfo.forEach((value) => {
      const id = value.id;
      value.textContent = `Current ${
        id.charAt(0).toUpperCase() + id.slice(1)
      }: ${this.gameState[id]}`;
    });
  }

  retrieveClassFromGameState(index) {
    const pos = new Position(
      index % this.gameState.BOARD_SIZE,
      Math.floor(index / this.gameState.BOARD_SIZE)
    );

    if (pos.equals(this.gameState.snake.body[0])) return 'snake-head';
    if (this.gameState.snake.isPartOfBody(pos)) return 'snake-body';
    if (this.gameState.foodPos.equals(pos)) return 'food';

    return '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const gameState = new GameState();

  const renderer = new Renderer(gameState, 'snake-container');

  const convertKeystrokeToDir = (key) =>
    ({
      ArrowUp: DIRECTIONS.UP,
      ArrowLeft: DIRECTIONS.LEFT,
      ArrowDown: DIRECTIONS.DOWN,
      ArrowRight: DIRECTIONS.RIGHT,
    }[key] || null);

  renderer.initialRender();

  let canChangeDirection = true;

  window.addEventListener('keydown', (event) => {
    if (event.key === ' ') gameState.pause = !gameState.pause;
    if (gameState.pause) return;
    if (!canChangeDirection) return;

    canChangeDirection = false;
    gameState.snake.changeDirection(convertKeystrokeToDir(event.key));
    setTimeout(() => (canChangeDirection = true), 80);
  });

  const generateMessage = (gameState) => {
    if (gameState.win) {
      return 'HAI VINTO! Hai raggiunto il punteggio massimo. Vuoi ricominciare?';
    } else {
      const isNewRecord =
        gameState.score > 0 && gameState.score >= gameState.record;
      return `Hai perso! Il tuo punteggio è di ${gameState.score}${
        isNewRecord ? ', ma hai battuto il tuo precedente record!' : ''
      }`;
    }
  };

  const startGameLoop = () =>
    setInterval(() => {
      if (gameState.pause) return;
      if (gameState.gameOver || gameState.win) {
        clearInterval(gameLoopId);

        if (confirm(generateMessage(gameState))) {
          gameState.resetState();
          renderer.initialRender();

          gameLoopId = startGameLoop();
        }
      }
      gameState.gameStep();
      renderer.render();
    }, 100);
  let gameLoopId = startGameLoop();
});
