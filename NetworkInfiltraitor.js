/** @param {NS} ns */

/*
args:
[0] - Script filename to spread
[1] - Boolean to spread to already owned servers

RAM Usage: 4.45GB
*/

let pastNodes = [];
let takenOverNodes = ["home", "darkweb", "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24", "pserv-25"];
async function RemoteWorm(ns, node, spreadScript, shouldSpreadToAll)
{
	if (ns.hasRootAccess(node))
	{
		let children = ns.scan(node);
		pastNodes.push(node);

		/*
		If we already have root access to a server, we likely don't want to
		start running a script on it since we're likely using the server
		already.
		Might be useful to run this code if all scripts were killed.
		*/
		if ((!takenOverNodes.includes(node)) && (spreadScript != "NONE") && shouldSpreadToAll)
		{
			takenOverNodes.push(node);
			ns.scp(spreadScript, node, "home");
			ns.exec(spreadScript, node, 1, node);
		}

		for (let i = 0; i < children.length; i++)
		{
			if (node != children[i] && !pastNodes.includes(children[i]))
			{
				ns.print("Found a new node: " + children[i]);
				await ns.sleep(1000);

				await RemoteWorm(ns, children[i], spreadScript, shouldSpreadToAll);
			}
		}
	}
	else
	{
		if (ns.getHackingLevel() > ns.getServerRequiredHackingLevel(node))
		{
			ns.print("Taking over " + node);
			let portsOpened = 0;
			if (ns.fileExists("BruteSSH.exe", "home"))
			{
				ns.brutessh(node);
				portsOpened++;
			}
			if (ns.fileExists("FTPCrack.exe", "home"))
			{
				ns.ftpcrack(node);
				portsOpened++;
			}
			if (ns.fileExists("relaySMTP.exe", "home"))
			{
				ns.relaysmtp(node);
				portsOpened++;
			}
			if (ns.fileExists("HTTPWorm.exe", "home"))
			{
				ns.httpworm(node);
				portsOpened++;
			}
			if (ns.fileExists("SQLInject.exe", "home"))
			{
				ns.sqlinject(node);
				portsOpened++;
			}

			if (ns.getServerNumPortsRequired(node) <= portsOpened)
			{
				ns.nuke(node);
				return; // Leave early and hope we come back to it
			}

			if (spreadScript != "NONE")
			{
				ns.scp(spreadScript, node, "home");
				ns.exec(spreadScript, node, 1, node);
				await ns.sleep(200);
			}

			takenOverNodes.push(node);
		}
	}
}

export async function main(ns)
{
	options = ns.flags(argsList);
	let spreadScript = "Preparer.js";
	let spreadToOwned = false;
	if (ns.args[0] != null)
	{
		spreadScript = ns.args[0];
	}
	if (ns.args[1] != null)
	{
		spreadToOwned = ns.args[1];
	}

	ns.tail();

	let RootHost = ns.getHostname();
	ns.print("RootHost: " + RootHost);
	ns.print("Spreading: " + spreadScript);
	ns.print("Spread on already owned?: " + spreadToOwned);

	while (true)
	{
		pastNodes = ["home", "darkweb", "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24", "pserv-25"];
		await ns.sleep(200);
		await RemoteWorm(ns, RootHost, spreadScript, spreadToOwned);
	}
}