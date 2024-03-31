import { Square } from "./Square.js";

export class Board {
	constructor(height, width) {
		this.height = height;
		this.width = width;
		this.boardDict = new Map();
	}
	addSquare(column, row, isMole = false) {
		let square = new Square(column, row, isMole);
		let coord = square.coordinates;
		this.boardDict.set(coord, square);
	}
	getSquare(coord) {
		return this.boardDict.get(coord);
	}
	toggleFlag(coord) {
		let square = this.boardDict.get(coord);
		square.toggleFlag();
	}
	establishAdjs() {
		const directions = [
			[-1, -1],
			[-1, 0],
			[-1, 1],
			[0, -1],
			[0, 1],
			[1, -1],
			[1, 0],
			[1, 1],
		];
		for (const [coord, square] of this.boardDict) {
			let parsCoord = JSON.parse(coord);
			for (let [x, y] of directions) {
				let adj = [parsCoord[0] + x, parsCoord[1] + y];
				if (
					adj[0] >= 0 &&
					adj[0] < this.width &&
					adj[1] >= 0 &&
					adj[1] < this.height
				) {
					if (Math.abs(x) != Math.abs(y)) {
						square.addAdj(JSON.stringify(adj));
					}
					if (this.boardDict.get(JSON.stringify(adj)).isMole) {
						square.incAdjMoles();
					}
				}
			}
		}
	}
}
