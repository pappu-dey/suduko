const TicTac = {
  cPlayer: "X",
  state: Array(9).fill(null),
  gameOver: false,
  mode: "friend", // Default mode
  sounds: {
    click: new Audio("clik.mp3"),
    win: new Audio("win.mp3"),
    tie: new Audio("tie.mp3"),
  },

  soundEnabled: true,
  vibrationEnabled: true,

  init() {
    this.addModeSelection();
    document
      .getElementById("reset")
      .addEventListener("click", () => this.reset());
    document
      .getElementById("toggle-sound")
      .addEventListener("click", this.toggleSound.bind(this));
    document
      .getElementById("toggle-vibration")
      .addEventListener("click", this.toggleVibration.bind(this));
  },

  addModeSelection() {
    document
      .getElementById("play-friend")
      .addEventListener("click", () => this.startGame("friend"));
    document
      .getElementById("play-computer")
      .addEventListener("click", () => this.startGame("computer"));
  },

  startGame(mode) {
    this.mode = mode;
    this.cBoard();
    document.getElementById("mode-select").classList.add("hidden");
    document.getElementById("game").classList.remove("hidden");
  },

  cBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    this.state.forEach((_, i) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      board.appendChild(cell);
    });
    board.addEventListener("click", (e) => this.handleClick(e));
    this.uMessage(`Player ${this.cPlayer}'s turn`);
  },

  handleClick(e) {
    const cell = e.target;
    const i = cell.dataset.index;

    if (this.gameOver || !cell.classList.contains("cell") || this.state[i])
      return;

    this.playSound("click");
    this.state[i] = this.cPlayer;
    cell.textContent = this.cPlayer;
    cell.classList.add("taken");

    if (this.checkWin()) {
      this.highlightWin();
      this.playSound("win");
      if (this.vibrationEnabled && navigator.vibrate) navigator.vibrate(300);
      this.uMessage(`Player ${this.cPlayer} wins!`);
      this.gameOver = true;
    } else if (this.state.every((cell) => cell)) {
      this.playSound("tie");
      this.uMessage("It's a tie!");
      this.gameOver = true;
    } else {
      this.cPlayer = this.cPlayer === "X" ? "O" : "X";
      this.uMessage(`Player ${this.cPlayer}'s turn`);
      if (this.mode === "computer" && this.cPlayer === "O") this.computerMove();
    }
  },

  computerMove() {
    const emptyCells = this.state
      .map((v, i) => (v === null ? i : null))
      .filter((v) => v !== null);
    const randomMove =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    setTimeout(() => {
      document.querySelector(`.cell[data-index='${randomMove}']`).click();
    }, 500);
  },

  checkWin() {
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    return wins.find((combo) =>
      combo.every((i) => this.state[i] === this.cPlayer)
    );
  },

  highlightWin() {
    const winCombo = this.checkWin();
    winCombo.forEach((i) => {
      document
        .querySelector(`.cell[data-index='${i}']`)
        .classList.add("highlight");
    });
  },

  reset() {
    this.state = Array(9).fill(null);
    this.cPlayer = "X";
    this.gameOver = false;
    this.cBoard();
  },

  uMessage(msg) {
    document.getElementById("message").textContent = msg;
  },

  playSound(type) {
    if (this.soundEnabled && this.sounds[type]) {
      this.sounds[type].play().catch((error) => {
        console.warn(`Failed to play ${type} sound: ${error.message}`);
      });
    }
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    alert(`Sound ${this.soundEnabled ? "enabled" : "disabled"}`);
  },

  toggleVibration() {
    this.vibrationEnabled = !this.vibrationEnabled;
    alert(`Vibration ${this.vibrationEnabled ? "enabled" : "disabled"}`);
  },
};

TicTac.init();
