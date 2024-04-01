import { GameHub } from "./gamehub.js";

const mediaQuery = window.matchMedia("(min-width: 600px)");
const introLogo = document.querySelector("#intro-logo");
const startDialogue = document.querySelector("#startDialogue");
const mobileLogoBanner = document.querySelector(".mobile-logo-banner");
const startBtn = document.querySelector("#start-game");
const playBtn = document.querySelector("#play");
const difSelect = document.querySelector("#difficulty");
const difHead = document.querySelector("#difficulty h2");
const difBtns = document.querySelectorAll(".diff-buttons button");
const introText = document.querySelector(".intro-text");
const introTextP = document.querySelector("#intro-paragraph");
const okayBtn = document.querySelector("#okay");
const gameContainer = document.querySelector(".game-container");
const gameBoard = document.querySelector(".gameBoard");
const sideBar = document.querySelector(".side-bar-content");
const sideBarContain = document.querySelector(".side-bar");
const muteBtn = document.querySelector("#mute-unmute");
let flagDialogue;
const infoBtn = document.querySelector("#info-button");
const flagCounter = document.querySelector("#flags-remaining");
const endDialogue = document.querySelector(".end-dialogue-container");
const endgameH1 = document.querySelector(".end-dialogue h1");
const endgameImg = document.querySelector("#end-game-image");
const endgameText = document.querySelector(".end-dialogue p");
const pop = document.querySelector("#pop");
const tl = gsap.timeline();

class Renderer {
	constructor() {
		this.StateMachine = null;
		this.GameHub = GameHub;
		this.height = ~~(12 * (gameBoard.clientHeight / gameBoard.clientWidth));
		this.width = Math.ceil(
			12 * (gameBoard.clientWidth / gameBoard.clientHeight)
		);
		this.tl = gsap.timeline();
		this.tilesRevealed = 0;
		this.flagDialogue = "";
		this.init();
		this.gameWon = false;
	}

	setStateMachine(stMa) {
		this.StateMachine = stMa;
	}

	init() {
		this.GameHub.setHeightWidth(this.height, this.width);
		if (mediaQuery.matches) {
			tl.set(sideBar, { x: "-40vw" }).set(
				sideBar,
				{ visibility: "visible" },
				"+= 1"
			);
			flagDialogue = `right-clicking<img src="img/right-click.svg" class="right-click">on it. Doing so will mark the hill 
                 so you can remember and will keep you from accidentally smashing the hill. 
                 You can unflag a hill the same way.`;
		} else {
			tl.set(sideBarContain, { y: "10dvh" }).set(
				sideBarContain,
				{ visibility: "visible" },
				"+= 1"
			);
			flagDialogue = `pressing and holding the molehill for one second. Doing so will mark the molehill so you can remember and will keep you from accidentally smashing the molehill in the future. Press and hold for one second again to unflag the molehill.`;
		}

		introTextP.innerHTML = `You just discovered that your yard is covered in molehills. 
                    Smash them down so the grass can grow, but be careful! 
                Some of the hills have moles sleeping underneath, and they don't like to be woken up.
                After you smash a hill, you'll see a handy-dandy number telling you whether there are any moles
                 under the adjacent molehills, and if so, how many there are.<br><br>
                 Think you know where a mole is sleeping? Flag it by ${flagDialogue} (Hint: You have the same number of flags as there are moles.)<br><br>
                 To win, smash all the hills except those that a mole is sleeping under. If you wake a mole, though, it'll wake its friends, and the game will be over.<br><br>
                 Good luck!`;
		this.startViz();
	}

	startViz() {}

	renderVisualBoard(Molefield, moleList) {
		gameBoard.style.gridTemplateColumns = `repeat(${this.width}, 1fr)`;
		for (let coord of Molefield.boardDict.keys()) {
			let square = document.createElement("div");
			square.classList.add("square");
			square.classList.add("hidden");
			square.id = coord;
			let squareP = document.createElement("p");
			squareP.innerText = Molefield.getSquare(coord).adjMoles;
			square.appendChild(squareP);
			gameBoard.appendChild(square);
		}
		flagCounter.innerText = moleList.length;
	}

	squareHover(id, hovering = true) {
		if (hovering) {
			document.getElementById(id).style.backgroundImage =
				'url("/img/dirt-mound-squashed")';
		} else {
			document.getElementById.removeAttribute("style");
		}
	}

	flag(id, flagsRemaining) {
		document.getElementById(id).classList.add("flagged");
		document.getElementById(id).classList.remove("hidden");
		flagCounter.innerText = flagsRemaining;
	}

	unflag(id, flagsRemaining) {
		document.getElementById(id).classList.add("hidden");
		document.getElementById(id).classList.remove("flagged");
		flagCounter.innerText = flagsRemaining;
	}

	reveal(id, hasAdjMoles = false, isMole = false) {
		if (isMole) {
			let newPop = pop.cloneNode();
			newPop.play();
		} else {
			this.tilesRevealed += 1;
		}
		let htmlSquare = document.getElementById(id);
		let p = htmlSquare.firstElementChild;
		htmlSquare.classList.remove("hidden");
		htmlSquare.classList.add("revealed");
		if (!isMole && hasAdjMoles) {
			p.style.opacity = 1;
		}
		if (
			this.tilesRevealed ===
			this.StateMachine.Molefield.boardDict.size -
				this.StateMachine.moleList.length
		) {
			this.gameWon = true;
			endGame(this.gameWon);
		}
	}

	revealMole(id) {
		document.getElementById(id).style.backgroundImage = "url('img/moles.png')";
		this.reveal(id, false, true);
		let moleSqrs = [...this.StateMachine.moleList];
		moleSqrs.splice(moleSqrs.indexOf(id), 1);
		let timer = 400;
		setTimeout(() => this.molePop(moleSqrs, timer), 750);
		if (mediaQuery.matches) {
			this.endGame(this.gameWon);
		} else {
			let endGameDelay = 500;
			for (let i = 0; i < this.StateMachine.moleList.length; i++) {
				let toAdd = 400 - i * 25;
				if (toAdd >= 50) {
					endGameDelay += toAdd;
				} else {
					endGameDelay += 50;
				}
			}
			setTimeout(this.endGame, endGameDelay);
		}
	}

	molePop(moleSqrs, timer) {
		let moleCoord = moleSqrs.pop();
		document.getElementById(moleCoord).style.backgroundImage =
			"url('img/moles.png')";
		this.reveal(moleCoord, false, true);
		if (moleSqrs.length > 0) {
			if (timer > 50) {
				timer -= 25;
			}
			setTimeout(() => this.molePop(moleSqrs, timer), timer);
		}
	}

	infoMin() {
		gsap.to(startDialogue, { duration: 0.2, opacity: 0 });
		if (mediaQuery.matches) {
			gsap.to(sideBar, { duration: 0.2, x: 0, delay: 0.2 });
		} else {
			gsap.to(sideBarContain, { duration: 0.2, y: 0, delay: 0.2 });
		}
		gsap.to(startDialogue, { display: "none", delay: 0.2 });
	}

	infoMax() {
		if (!mediaQuery.matches) {
			gsap.to(sideBarContain, { duration: 0.2, y: "10dvh" });
		}
		tl.set(startDialogue, { display: "flex" }).to(startDialogue, {
			duration: 0.2,
			opacity: 1,
		});
	}

	endGame(gameWon) {
		if (gameWon) {
			endgameH1.innerText = "You Win!";
			endgameImg.src = "img/sleeping-mole.png";
			endgameText.innerHTML =
				"The unoccupied molehills have been smashed, the grass has grown back over them, and the moles are still happily sleeping.<br><br>Good job!";
		} else {
			endgameH1.innerText = "Game Over!";
			endgameImg.src = "img/angry-mole.png";
			endgameText.innerHTML =
				"You woke the moles. The moles are angry. Time to invest in some ankle guards!<br><br>Better luck next time!";
		}

		if (mediaQuery.matches) {
			gsap.to(sideBar, { duration: 0.3, x: "-50vw", ease: "power2.in" });
		} else {
			gsap.to(sideBar, { duration: 0.3, y: "40dvh", ease: "power2.in" });
		}
		gsap.set(sideBar, { display: "none", delay: 0.3 });
		if (mediaQuery.matches) {
			tl.set(endDialogue, {
				display: "flex",
				x: "-50vw",
				y: 0,
				delay: 0.4,
			}).to(endDialogue, { duration: 0.3, x: 0, ease: "power2.out" }, "+=.3");
		} else {
			tl.set(endDialogue, { display: "flex", y: "100dvh" })
				.to(endDialogue, { duration: 0.3, y: 0, ease: "power2.out" })
				.set([gameContainer, mobileLogoBanner], { display: "none" })
				.set(sideBarContain, { backgroundColor: "#76bc32" });
		}
	}

	exitSequence() {
		if (mediaQuery.matches) {
			gsap.to(endDialogue, { duration: 0.3, x: "-100dvh" });
			gsap.to(muteBtn, { duration: 0.3, opacity: 0 });
			gsap.to(gameContainer, {
				duration: 0.5,
				x: "100vw",
				onComplete: () => {
					location.reload();
				},
			});
		} else {
			gsap.to(endDialogue, {
				duration: 0.3,
				y: "100dvh",
				onComplete: () => {
					location.reload();
				},
			});
		}
	}
}

export class ReplayRenderEngine extends Renderer {
	constructor() {
		super();
	}

	startViz() {
		if (mediaQuery.matches) {
			gsap.set(startDialogue, {
				width: "50vw",
				height: "70dvh",
				x: "-100vw",
				opacity: 1,
				justifyContent: "space-between",
			});
		} else {
			gsap.set(startDialogue, {
				width: "100vw",
				height: "100dvh",
				borderRadius: 0,
				y: "100dvh",
				opacity: 1,
				justifyContent: "space-between",
			});
		}
		gsap.set(startDialogue, { visibility: "visible", delay: 1.5 });
		setTimeout(() => this.chooseDiff(), 1500);
	}

	gameStart() {
		gsap.to(startDialogue, { duration: 0.2, opacity: 0 });
		if (mediaQuery.matches) {
			gsap.to(sideBar, { duration: 0.2, x: 0, delay: 0.2 });
		} else {
			gsap.to(sideBarContain, { duration: 0.2, y: 0, delay: 0.2 });
		}
		tl.to(startDialogue, { display: "none", delay: 0.2 })
			.to(gameContainer, { duration: 1, x: 0, opacity: 1 }, "<")
			.set([difSelect, startBtn], { display: "none" })
			.set([introText, okayBtn], { display: "block", opacity: 1 });
		if (mediaQuery.matches) {
			gsap.set(startDialogue, { height: "90dvh", delay: 0.2 });
			muteBtn.style.display = "inline-block";
		}
	}

	chooseDiff() {
		gsap.to(playBtn, { duration: 0.3, scale: 0, opacity: 0 });
		if (mediaQuery.matches) {
			gsap.to(startDialogue, { duration: 0.5, x: 0, ease: "power1.out" });
		} else {
			gsap.to(startDialogue, { duration: 0.5, y: 0, ease: "power1.out" });
		}
		gsap.set(introLogo, { display: "none", delay: 1.3 });
		if (!mediaQuery.matches) {
			tl.set(mobileLogoBanner, { display: "block", delay: 1.3 }).set(
				sideBarContain,
				{ display: "block" }
			);
		}
		tl.set(playBtn, { display: "none", delay: 0.5 })
			.set(startDialogue, { justifyContent: "space-around" })
			.set(difSelect, { display: "block" }, "<")
			.set(startBtn, { display: "block", opacity: 0, scale: 0.2 }, "<")
			.from(difHead, {
				duration: 0.2,
				scale: 0.2,
				opacity: 0,
				transformOrigin: "50% 50%",
			})
			.from(difBtns, {
				duration: 0.2,
				scale: 0.2,
				opacity: 0,
				stagger: 0.1,
				ease: "back-out",
			});
	}
}

export class RenderEngine extends Renderer {
	constructor() {
		super();
	}

	startViz() {
		gsap.set([introLogo, playBtn, startDialogue], { visibility: "visible" });
		gsap.from(introLogo, {
			duration: 1,
			rotation: 360,
			opacity: 0,
			scale: 0.02,
			ease: "power2.out",
			transformOrigin: "50% 50%",
			delay: 0.0000001,
		});
		if (mediaQuery.matches) {
			tl.to(introLogo, { duration: 0.5, scale: 0.5, y: "-22dvh", delay: 1 })
				.from(startDialogue, {
					duration: 0.5,
					scale: 0.2,
					opacity: 0,
					ease: "back.out",
				})
				.set(gameContainer, { x: "100vw" });
		} else {
			tl.from(startDialogue, {
				duration: 0.5,
				scale: 0.2,
				opacity: 0,
				ease: "back.out",
				delay: 1,
			}).set(gameContainer, { x: "100vw" });
		}
	}

	gameStart() {
		gsap.to([difSelect, startBtn], { duration: 0.6, y: "-150dvh" });
		if (mediaQuery.matches) {
			gsap.to(startDialogue, { duration: 0.2, height: "90dvh", delay: 0.2 });
			muteBtn.style.display = "inline-block";
		}
		tl.set([difSelect, startBtn], { display: "none", delay: 0.5 })
			.set(
				[introText, okayBtn],
				{ display: "block", y: "100dvh", opacity: 1 },
				"<"
			)
			.to([introText, okayBtn], { duration: 0.5, y: 0 })
			.to(gameContainer, { duration: 1, x: 0, opacity: 1 }, "<");
	}

	chooseDiff() {
		gsap.to(playBtn, { duration: 0.3, scale: 0, opacity: 0 });
		if (mediaQuery.matches) {
			tl.to(startDialogue, {
				duration: 0.5,
				width: "50vw",
				opacity: 1,
				ease: "back-out",
			}).to(
				startDialogue,
				{ duration: 0.5, height: "70dvh", ease: "back-out" },
				"-=.4"
			);
		} else {
			tl.to(startDialogue, {
				duration: 0.5,
				width: "100vw",
				opacity: 1,
				ease: "back-out",
			}).to(
				startDialogue,
				{
					duration: 0.3,
					height: "100dvh",
					borderRadius: 0,
					ease: "back-out",
				},
				"-=.4"
			);
		}
		gsap.set(introLogo, { display: "none", delay: 0.4 });
		if (!mediaQuery.matches) {
			tl.set(mobileLogoBanner, { display: "block", delay: 0.4 }).set(
				sideBarContain,
				{ display: "block" }
			);
		}
		tl.set(playBtn, { display: "none" })
			.set(startDialogue, { justifyContent: "space-around" })
			.set(difSelect, { display: "block" }, "<")
			.set(startBtn, { display: "block", opacity: 0, scale: 0.2 }, "<")
			.from(difHead, {
				duration: 0.2,
				scale: 0.2,
				opacity: 0,
				transformOrigin: "50% 50%",
			})
			.from(difBtns, {
				duration: 0.2,
				scale: 0.2,
				opacity: 0,
				stagger: 0.1,
				ease: "back-out",
			});
	}
}
