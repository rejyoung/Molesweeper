export class GameLogic {
	constructor(StateMachine, RenderEngine) {
		let gameLost = false;
		let gameWon = false;
		this.StateMachine = StateMachine;
		this.Molefield = StateMachine.Molefield;
		this.RenderEngine = RenderEngine;
	}

	requestReveal(id) {
		let currentSquare = this.Molefield.getSquare(id);
		if (!currentSquare.isRevealed && !currentSquare.isFlagged) {
			if (currentSquare.isMole) {
				this.moleExplosion(id);
			} else if (currentSquare.adjMoles > 0) {
				currentSquare.isRevealed = true;
				this.RenderEngine.reveal(id, true);
			} else {
				currentSquare.isRevealed = true;
				this.RenderEngine.reveal(id);
				this.revealCascade(currentSquare);
			}
		}
	}

	revealCascade(currentSquare) {
		let adjList = [];
		for (let adjCoord of currentSquare.adjacents) {
			if (!this.StateMachine.Molefield.getSquare(adjCoord).isRevealed) {
				adjList.push(adjCoord);
			}
		}
		let addedList = [...currentSquare.adjacents];
		addedList.push(currentSquare.coordinates);
		while (adjList.length > 0) {
			let currentCoord = adjList.shift();
			let newSquare = this.Molefield.getSquare(currentCoord);
			if (newSquare.isFlagged) {
				continue;
			} else {
				newSquare.isRevealed = true;
				if (newSquare.adjMoles == 0) {
					this.RenderEngine.reveal(currentCoord);
					for (let coord of newSquare.adjacents) {
						if (
							!addedList.includes(coord) &&
							!this.Molefield.getSquare(coord).isRevealed
						) {
							adjList.push(coord);
							addedList.push(coord);
						}
					}
				} else {
					this.RenderEngine.reveal(currentCoord, true);
				}
			}
		}
	}

	moleExplosion(id) {
		this.gameLost = true;
		this.RenderEngine.revealMole(id);
	}
}
