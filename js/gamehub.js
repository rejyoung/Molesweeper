import { ReplayRenderEngine, RenderEngine } from "./render-engine.js";
import { InputHandler } from "./input-handler.js";
import { StateMachine } from "./state-machine.js";
import { GameLogic } from "./game-logic.js";

class GameHubClass {
	constructor() {
		this.height = null;
		this.width = null;
		this.cookieObj = this.makeCookieObj();
		this.StateMachine = null;
		this.GameLogic = null;
		this.replay = null;
		this.checkReplay();
		this.RenderEngine = null;
		this.InputHandler = null;
	}

	createGameState(difficulty) {
		this.StateMachine = new StateMachine(
			this.RenderEngine,
			difficulty,
			this.height,
			this.width
		);
		this.RenderEngine.setStateMachine(this.StateMachine);
		this.GameLogic = new GameLogic(this.StateMachine, this.RenderEngine);
		this.RenderEngine.gameStart();
	}

	setHeightWidth(height, width) {
		this.height = height;
		this.width = width;
	}

	makeCookieObj() {
		let obj = {};
		if (document.cookie) {
			let cookieString = document.cookie;
			let parsedCookie = cookieString.split("; ");

			for (let cookie of parsedCookie) {
				let keyValue = cookie.split("=");
				obj[keyValue[0]] = keyValue[1];
			}
			return obj;
		}
		return null;
	}

	squareInput(action, id) {
		switch (action) {
			case "click":
				this.GameLogic.requestReveal(id);
				break;
			case "flag":
				this.StateMachine.toggleFlag(id);
				break;
			case "mouseenter":
				if (this.StateMachine.checkHoverable(id)) {
					this.RenderEngine.squareHover(id, true);
				}
				break;
			case "mouseleave":
				if (this.StateMachine.checkHoverable(id)) {
					this.RenderEngine.squareHover(id, false);
				}
				break;
			default:
				break;
		}
	}

	checkReplay() {
		setTimeout(() => {
			if (this.cookieObj) {
				if (Object.keys(this.cookieObj).includes("playAgain")) {
					this.replay = this.cookieObj["playAgain"];
				} else {
					this.replay = false;
				}
				if (this.cookieObj["muted"] == "true") {
					this.InputHandler = new InputHandler(true);
					soundtrack.muted = true;
					document.querySelector("#mute-unmute").src = "img/audio-muted.svg";
					document.querySelector("#mobile-mute-unmute").src =
						"img/audio-muted-mobile.svg";
				} else {
					this.InputHandler = new InputHandler(false);
				}
			} else {
				document.cookie = "muted=false";
				this.InputHandler = new InputHandler(false);
			}
			if (this.replay) {
				this.RenderEngine = new ReplayRenderEngine();
			} else {
				this.RenderEngine = new RenderEngine();
			}
		}, 5);
	}

	playGame() {
		this.RenderEngine.chooseDiff();
	}

	showInfo() {
		this.RenderEngine.infoMax();
	}

	dismissInfo() {
		this.RenderEngine.infoMin();
	}

	reset() {
		this.RenderEngine.exitSequence();
	}
}

export const GameHub = new GameHubClass();
