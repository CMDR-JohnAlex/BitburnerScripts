/** @param {NS} ns */

/*
args:
[0] - Script filename to spread
[1] - Use as many threads as possible?
[2] - Boolean to spread to already owned servers
[3] - Single argument to give to spread script

RAM Usage: 4.45GB
*/

/*
These two lists are in the "module scope". The module scope is created when the
game is loaded and is destroyed when the game is closed. This means that these
variables will persist between script runs, meaning you can stop, edit, and
restart this script and the variables will still exist. It will however, not
persist between game loads.
*/
let pastNodes = [];
let takenOverNodes = ["home", "darkweb", "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24", "pserv-25"];
async function RemoteWorm(ns, node, spreadScript, useMaxThreads, shouldSpreadToAll, spreadScriptArgument)
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
			let threads = 1;
			if (useMaxThreads)
			{
				threads = getMaxThreads(ns, node, spreadScript);
			}
			if (threads !== 0)
				ns.exec(spreadScript, node, threads, node, spreadScriptArgument);
		}

		for (let i = 0; i < children.length; i++)
		{
			if (node != children[i] && !pastNodes.includes(children[i]))
			{
				ns.print("Found a new node: " + children[i]);
				await ns.sleep(1000);

				await RemoteWorm(ns, children[i], spreadScript, useMaxThreads, shouldSpreadToAll, spreadScriptArgument);
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

			if (ns.getServerNumPortsRequired(node) > portsOpened)
			{
				return; // Leave early and hope we come back to it
			}

			ns.nuke(node);

			if (spreadScript != "NONE")
			{
				ns.scp(spreadScript, node, "home");
				let threads = 1;
				if (useMaxThreads)
				{
					threads = getMaxThreads(ns, node, spreadScript);
				}
				if (threads != 0)
					ns.exec(spreadScript, node, threads, node, spreadScriptArgument);
				await ns.sleep(200);
			}

			takenOverNodes.push(node);
		}
	}
}

function getMaxThreads(ns, server, scriptName)
{
	return Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(scriptName));
}

export async function main(ns)
{
	let spreadScript = "Preparer.js";
	let useMaxThreads = false;
	let spreadToOwned = false;
	let spreadScriptArgument = "";
	if (ns.args[0] != null)
	{
		spreadScript = ns.args[0];
	}
	if (ns.args[1] != null)
	{
		useMaxThreads = ns.args[1];
	}
	if (ns.args[2] != null)
	{
		spreadToOwned = ns.args[2];
	}
	if (ns.args[3] != null)
	{
		spreadScriptArgument = ns.args[3];
	}

	ns.tail();

	let RootHost = ns.getHostname();
	ns.print("RootHost: " + RootHost);
	ns.print("Spreading: " + spreadScript);
	ns.print("Spread on already owned?: " + spreadToOwned);
	ns.print("Spread script argument: " + spreadScriptArgument);

	while (true)
	{
		pastNodes = ["home", "darkweb", "pserv-0", "pserv-1", "pserv-2", "pserv-3", "pserv-4", "pserv-5", "pserv-6", "pserv-7", "pserv-8", "pserv-9", "pserv-10", "pserv-11", "pserv-12", "pserv-13", "pserv-14", "pserv-15", "pserv-16", "pserv-17", "pserv-18", "pserv-19", "pserv-20", "pserv-21", "pserv-22", "pserv-23", "pserv-24", "pserv-25"];
		await ns.sleep(200);
		await RemoteWorm(ns, RootHost, spreadScript, useMaxThreads, spreadToOwned, spreadScriptArgument);
	}
}