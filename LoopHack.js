/** @param {NS} ns */

/*
args:
0: [string] Target

RAM Usage: 1.70GB
*/

export async function main(ns)
{
	while (true)
	{
		await ns.hack(ns.args[0]);
	}
}