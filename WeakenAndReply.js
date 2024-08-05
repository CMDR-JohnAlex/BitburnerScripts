/** @param {NS} ns */

/*
args:
0: [string] Target
0: [int] Reply port (0 for no reply)

RAM Usage: ?.??GB
*/

export async function main(ns)
{
	await ns.weaken(ns.args[0]);

	if (ns.args[1] !== 0)
	{
		let message = [];
		message.hostname = ns.getHostname();
		message.scriptname = "WeakenAndReply.js";
		message.type = "WeakenComplete";
		ns.tryWritePort(ns.args[1], message);
	}
}