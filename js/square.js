export class Square {
	constructor(column, row, isMole = false) {
		this.col = column;
		this.row = row;
		this.isMole = isMole;
		this.isRevealed = false;
		this.isFlagged = false;
		this.adjMoles = 0;
		this.adjacentList = [];
	}
	setRevealed() {
		this.revealed = true;
	}

	addAdj(coord) {
		this.adjacentList.push(coord);
	}
	incAdjMoles() {
		this.adjMoles++;
	}
	get adjacents() {
		return this.adjacentList;
	}
	get coordinates() {
		return JSON.stringify([this.col, this.row]);
	}
}
