/** @param {NS} ns */

/*
RAM Usage: 6.60GB
*/

export async function main(ns)
{
	let i = 0;

	while (i < ns.getPurchasedServers().length)
	{
		let hostname = "pserv-" + i;
		ns.killall(hostname, true);
		ns.deleteServer(hostname);
		i++;
	}
}