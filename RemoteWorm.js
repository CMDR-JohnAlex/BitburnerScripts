/** @param {NS} ns */

/*
RAM Usage: 4.35GB
*/

let pastNodes = [];
let takenOverNodes = ["home", "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24", "pserv-25"];
async function RemoteWorm(ns, node, spreadScript)
{
	if (ns.hasRootAccess(node))
	{
		let children = ns.scan(node);
		pastNodes.push(node);

		if (!takenOverNodes.includes(node) && (spreadScript != "NONE")) // If we have taken over this node before this script (therefore not in list), we might not want to mess with it and run something on it.
		{
			takenOverNodes.push(node);
			ns.scp(spreadScript, node, "home");
			ns.exec(spreadScript, node, 1);
		}

		for (let i = 0; i < children.length; i++)
		{
			if (node != children[i] && !pastNodes.includes(children[i]))
			{
				ns.print("Found a new node: " + children[i]);
				await ns.sleep(1000);

				await RemoteWorm(ns, children[i]);
			}
		}
	}
	else
	{
		if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(node))
		{
			ns.print("Taking over " + node);
			if (ns.fileExists("BruteSSH.exe", "home"))
			{
				ns.brutessh(node);
			}
			if (ns.fileExists("FTPCrack.exe", "home"))
			{
				ns.ftpcrack(node);
			}
			if (ns.fileExists("relaySMTP.exe", "home"))
			{
				ns.relaysmtp(node);
			}
			if (ns.fileExists("HTTPWorm.exe", "home"))
			{
				ns.httpworm(node);
			}
			if (ns.fileExists("SQLInject.exe", "home"))
			{
				ns.sqlinject(node);
			}
			ns.nuke(node);

			if (spreadScript != "NONE")
			{
				ns.scp(spreadScript, node, "home");
				ns.exec(spreadScript, node, 1);
				await ns.sleep(1000);
			}

			takenOverNodes.push(node);
		}
	}
}

export async function main(ns)
{
	var RootHost = ns.getHostname();
	if (args[0] != null)
	{
		var SpreadScript = args[0];
	}
	else
	{
		var SpreadScript = "NONE";
	}
	ns.print("RootHost: " + RootHost);
	ns.print("Spreading: " + SpreadScript);


	while (true)
	{
		pastNodes = ["home", "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24", "pserv-25"];
		await ns.sleep(1000);
		await RemoteWorm(ns, RootHost, SpreadScript);
	}
}