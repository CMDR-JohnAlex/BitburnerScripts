/** @param {NS} ns */

/*
RAM Usage: ?.??GB
*/

export async function main(ns)
{
	ns.tail();

	let result, x, y, lastX, lastY;

	let currentStrategy = "Start";

	do
	{
		const board = ns.go.getBoardState();
		const validMoves = ns.go.analysis.getValidMoves();

		// Log opponent's next move, once it happens
		await ns.go.opponentNextTurn();

		await ns.sleep(25);

		return; // TEMP
	}
	while (result?.type !== "gameOver");
}

/*
Let's try to make my strat. I start in the middle and make a + sign shape
before trying to surround the opponent where it has the most or least enemy
pieces.

I actually have a new strat, try to make a small + sign with the middle missing
and one corner of the + sign filled in before expanding. That way you're safer?
*/