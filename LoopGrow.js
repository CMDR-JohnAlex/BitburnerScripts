/** @param {NS} ns */

/*
args:
0: [string] Target

RAM Usage: 1.75GB
*/

export async function main(ns)
{
	while (true)
	{
		await ns.grow(ns.args[0]);
	}
}