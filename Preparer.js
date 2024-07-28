/** @param {NS} ns */

/* Our only job is to prepare a server for hacking by weakening and growing it
before sending a message to the master server.

RAM Usage: 2.35GB
*/

export async function main(ns)
{
	let ready = false;
	let hostname = ns.getHostname();
	while (!ready)
	{
		if (ns.getServerSecurityLevel(hostname) > ns.getServerMinSecurityLevel(hostname))
		{
			await ns.weaken(hostname);
		}
		else if (ns.getServerMoneyAvailable(hostname) < ns.getServerMaxMoney(hostname))
		{
			await ns.grow(hostname);
		}
		else
		{
			ready = true;
		}
	}

	// Send message to master server
	let message = [];
	message.hostname = ns.getHostname();
	message.scriptname = "Preparer.js";
	message.type = "Prepared";
	ns.tryWritePort(1, message);
}