import { Board } from "./board.js";

export class StateMachine {
	constructor(RenderEngine, difficulty, height, width) {
		this.width = width;
		this.height = height;
		this.RenderEngine = RenderEngine;
		this.Molefield = new Board(this.height, this.width);
		this.moleList = this.genMoles(difficulty);
		this.generateBoard();
		this.flagsRemaining = this.moleList.length;
	}

	generateBoard() {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				if (this.moleList.includes(JSON.stringify([x, y]))) {
					this.Molefield.addSquare(x, y, true);
				} else {
					this.Molefield.addSquare(x, y);
				}
			}
		}
		this.Molefield.establishAdjs();
		this.RenderEngine.renderVisualBoard(this.Molefield, this.moleList);
	}

	genMoles(difficulty) {
		const moles = [];
		let numHills = this.height * this.width;
		let coord;
		let num_moles =
			difficulty == "easy"
				? ~~(numHills * 0.12)
				: difficulty == "medium"
				? ~~(numHills * 0.15)
				: ~~(numHills * 0.2);
		while (moles.length < num_moles) {
			coord = JSON.stringify([
				~~(Math.random() * this.width),
				~~(Math.random() * this.height),
			]);
			if (!moles.includes(coord)) {
				moles.push(coord);
			}
		}
		return moles;
	}

	toggleFlag(id) {
		const currentSquare = this.Molefield.getSquare(id);
		if (!currentSquare.isRevealed) {
			if (!currentSquare.isFlagged) {
				currentSquare.isFlagged = true;
				this.flagsRemaining -= 1;
				this.RenderEngine.flag(id, this.flagsRemaining);
			} else {
				currentSquare.isFlagged = false;
				this.flagsRemaining += 1;
				this.RenderEngine.unflag(id, this.flagsRemaining);
			}
		}
	}

	checkHoverable(id) {
		const currentSquare = this.Molefield.getSquare(id);
		if (currentSquare.isRevealed || currentSquare.isFlagged) {
			return false;
		}
		return true;
	}
}
