/** @param {NS} ns */

/*
args:
0: [string] Script to run
1: [int/"max"] Threads to use

RAM Usage: 4.20GB
*/

export async function main(ns)
{
	let i = 0;

	while (i < ns.getPurchasedServerLimit())
	{
		let hostname = "pserv-" + i;
		ns.killall(hostname, true);
		ns.scp(ns.args[0], hostname);
		let possibleThreads = args[1];
		if (ns.args[1] == "max")
		{
			possibleThreads = ns.getServerMaxRam(hostname) / ns.getScriptRam(ns.args[0], "home");
		}
		ns.exec(ns.args[0], possibleThreads, ns.args[1]);
		i++;
	}
}