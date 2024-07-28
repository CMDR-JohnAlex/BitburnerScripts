/** @param {NS} ns */
/*
args:
0: [string] Script to run
1: [int] Threads to use

RAM Usage: 4.05GB
*/
export async function main(ns)
{
	let i = 0;

	while(i < ns.getPurchasedServerLimit())
	{
		let hostname = "pserv-" + i;
		ns.killall(hostname, true);
		ns.scp(ns.args[0], hostname);
		ns.exec(ns.args[0], hostname, ns.args[1]);
		i++;
	}
}