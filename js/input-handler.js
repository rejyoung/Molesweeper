import { GameHub } from "./gamehub.js";

const gameBoard = document.querySelector(".gameBoard");
const mediaQuery = window.matchMedia("(min-width: 600px)");
const startBtn = document.querySelector("#start-game");
const soundtrack = document.querySelector("#soundtrack");
export class InputHandler {
	constructor(isMuted) {
		this.GameHub = GameHub;
		this.StateEngine = null;
		this.buttons = this.getButtons();
		this.difficulty = "";
		this.assignEventListeners();
		this.isMuted = isMuted;
		this.initSound();
	}

	getButtons() {
		return document.querySelectorAll('button, #mute-unmute, #mobile-mute-unmute, #info-button')
	}

	assignEventListeners() {
		let touchTimer = null;
		let justFlagged = false;
		this.buttons.forEach(element => {
			if (element.id != "start-game") {
				element.addEventListener("click", event =>
					this.handleElementClick(element)
				);
			}
		});

		if (mediaQuery.matches) {
			gameBoard.addEventListener("click", e => {
				let target = e.target.closest(".square");
				if (target) {
					this.handleElementClick(target);
				}
			});
			gameBoard.addEventListener("contextmenu", e => {
				let target = e.target.closest(".square");
				e.preventDefault();
				if (target) {
					this.GameHub.squareInput("flag", target.id);
				}
			});
			gameBoard.addEventListener("mouseenter", e => {
				let target = e.target.closest(".square");
				if (target) {
					this.GameHub.squareInput("mouseenter", target.id);
				}
			});
			gameBoard.addEventListener("mouseleave", e => {
				let target = e.target.closest(".square");
				if (target) {
					this.GameHub.squareInput("mouseleave", target.id);
				}
			});
		} else {
			gameBoard.addEventListener("touchstart", e => {
				let target = e.target.closest(".square");
				if (target) {
					touchTimer = setTimeout(() => {
						this.GameHub.squareInput("flag", target.id);
						justFlagged = true;
					}, 1000);
				}
			});
			gameBoard.addEventListener("touchend", e => {
				let target = e.target.closest(".square");
				if (target) {
					if (touchTimer) {
						clearTimeout(touchTimer);
						touchTimer = null;
						this.handleElementClick(target);
					} else if (justFlagged) {
						justFlagged = false;
					} else {
						this.handleElementClick(target);
					}
				}
			});
			gameBoard.addEventListener("touchcancel", e => {
				let target = e.target.closest(".square");
				if (target && touchTimer) {
					clearTimeout(touchTimer);
					touchTimer = null;
				}
			});
		}
	}

	addStartBtnListen() {
		document
			.querySelector("#start-game")
			.addEventListener("click", e => this.handleElementClick(e.target));
	}

	handleElementClick(element) {
		const id = element.id;
		switch (id) {
			case "mute-unmute":
				this.toggleMusic();
				break;
			case "mobile-mute-unmute":
				this.toggleMusic(true);
				break;
			case "play":
				this.initGame();
				break;
			case "easy":
				this.setDifficulty(element, id);
				break;
			case "medium":
				this.setDifficulty(element, id);
				break;
			case "hard":
				this.setDifficulty(element, id);
				break;
			case "start-game":
				this.GameHub.createGameState(this.difficulty);
				soundtrack.volume = 0.4;
				soundtrack.play();
				break;
			case "okay":
				this.GameHub.dismissInfo();
				break;
			case "play-again":
				this.playAgain();
				break;
			case "info-button":
				this.GameHub.showInfo();
				break;
			default:
				this.GameHub.squareInput("click", id);
				break;
		}
	}

	setDifficulty(button, selectID) {
		const diffBtns = document.querySelectorAll(".diff-buttons button");
		for (let btn of diffBtns) {
			if (btn.id != selectID && btn.classList.contains("selected")) {
				btn.classList.remove("selected");
			}
		}
		button.classList.add("selected");
		this.difficulty = selectID;
		this.addStartBtnListen();
		if (startBtn.style.opacity == 0) {
			gsap.to(startBtn, {
				duration: 0.2,
				opacity: 1,
				scale: 1,
				ease: "back-out",
			});
		}
	}

	setStateMachine(StateMachine) {
		this.StateMachine = StateMachine;
	}

	toggleMusic(mobile = false) {
		let mobExt = "";
		let muteBtn;
		if (mobile) {
			mobExt = "-mobile";
			muteBtn = document.querySelector("#mobile-mute-unmute");
		} else {
			muteBtn = document.querySelector("#mute-unmute");
		}
		if (!soundtrack.muted) {
			soundtrack.muted = true;
			console.log(muteBtn.src);
			muteBtn.src = `img/audio-muted${mobExt}.svg`;
			console.log(muteBtn.src);
			document.cookie = "muted=true";
		} else {
			soundtrack.muted = false;
			muteBtn.src = `img/audio${mobExt}.svg`;
			document.cookie = "muted=false";
		}
	}

	initSound() {
		if (this.isMuted) {
			let mobExt = "";
			let muteBtn;
			if (!mediaQuery.matches) {
				mobExt = "-mobile";
				muteBtn = document.querySelector("#mute-unmute");
			} else {
				muteBtn = document.querySelector("#mobile-mute-unmute");
			}
			soundtrack.muted = true;
			muteBtn.src = `img/audio-muted${mobExt}.svg`;
			document.cookie = "muted=true";
		}
	}

	initGame() {
		this.GameHub.playGame();
	}

	playAgain() {
		document.cookie = "playAgain=true; max-age=8";
		let audioFade = setInterval(() => {
			if (!soundtrack.muted && soundtrack.volume > 0.05) {
				soundtrack.volume -= 0.05;
			} else {
				clearInterval(audioFade);
			}
		}, 35);
		this.GameHub.reset();
	}
}
