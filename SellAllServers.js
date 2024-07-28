/** @param {NS} ns */

/*
RAM Usage: 4.40GB
*/

export async function main(ns)
{
	let i = 0;

	while (i < ns.getPurchasedServerLimit())
	{
		let hostname = "pserv-" + i;
		ns.killall(hostname, true);
		ns.deleteServer(hostname);
		i++;
	}
}