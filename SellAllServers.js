/** @param {NS} ns */
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