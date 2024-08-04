/** @param {NS} ns */

/*
RAM Usage: ?.??GB
*/

let preparedServers = {};
let index = 0;
let targets = []; // Update this manually for now. Populate with the hostnames of the servers you want the dedicated servers to hack.

async function UpdatePort(ns, port)
{
	let data = ns.readPort(port);
	if ((data !== "NULL PORT DATA") && (data.type == "Prepared"))
	{
		if (!preparedServers.includes(data.hostname))
		{
			ns.print("Saving " + data.hostname + " to PreparedServers.txt");
			ns.write("PreparedServers.txt", data.hostname + '\n', 'a');
			preparedServers.push(data.hostname);
		}
	}
	// If the data isn't what we want and not NULL PORT DATA, then discard it
}

async function PrepareServer(ns, server)
{
	// Kill active scripts
	//ns.killall(server); // We might want to keep non-hack manager scripts running
	ns.scriptKill("SingleWeaken.js", server);
	ns.scriptKill("SingleGrow.js", server);
	ns.scriptKill("SingleHack.js", server);

	// Copy necessary scripts to server
	ns.scp("SingleWeaken.js", server);
	ns.scp("SingleGrow.js", server);
	ns.scp("SingleHack.js", server);
}

async function UpdateServer(ns, server)
{
	// TODO: We should NOT be calculating this every loop-
	// Calculate thresholds
	let moneyAmount = 0.90; // TODO: args. Value is same for all servers
	let securityAmount = 0.05; // TODO: args. Value is same for all servers
	const moneyThreshold = LinearMapping(moneyAmount, ns.getServerMaxMoney(server), 0);
	const securityThreshold = LinearMapping(securityAmount, 100, ns.getServerMinSecurityLevel(server)); // How can we get the max security of a server? Is there a max...

	// If our scripts are currently running on the server, skip
	if (ns.scriptRunning("SingleWeaken.js", server) || ns.scriptRunning("SingleGrow.js", server) || ns.scriptRunning("SingleHack.js", server))
	{
		return;
	}

	if (ns.getServerSecurityLevel(server) > securityThreshold)
	{
		let threads = getMaxThreads(ns, server, "SingleWeaken.js");
		ns.exec("SingleWeaken.js", server, threads, server);
	}
	else if (ns.getServerMoneyAvailable(server) < moneyThreshold)
	{
		let threads = getMaxThreads(ns, server, "SingleGrow.js");
		ns.exec("SingleGrow.js", server, threads, server);
	}
	else
	{
		// We don't want to hack the server to nothing...
		let threads = getMaxThreads(ns, server, "SingleHack.js");
		ns.exec("SingleHack.js", server, threads, server);
	}
}

async function UpdateDedicatedServer(ns, server, target)
{
	// TODO: We should NOT be calculating this every loop-
	// Calculate thresholds
	let moneyAmount = 0.90; // TODO: args. Value is same for all servers
	let securityAmount = 0.05; // TODO: args. Value is same for all servers
	const moneyThreshold = LinearMapping(moneyAmount, ns.getServerMaxMoney(target), 0);
	const securityThreshold = LinearMapping(securityAmount, 100, ns.getServerMinSecurityLevel(target)); // How can we get the max security of a server? Is there a max...

	// If our scripts are currently running on the server, skip
	if (ns.scriptRunning("SingleWeaken.js", server) || ns.scriptRunning("SingleGrow.js", server) || ns.scriptRunning("SingleHack.js", server))
	{
		return;
	}

	if (ns.getServerSecurityLevel(target) > securityThreshold)
	{
		let threads = getMaxThreads(ns, server, "SingleWeaken.js");
		ns.exec("SingleWeaken.js", server, threads, target);
	}
	else if (ns.getServerMoneyAvailable(target) < moneyThreshold)
	{
		let threads = getMaxThreads(ns, server, "SingleGrow.js");
		ns.exec("SingleGrow.js", server, threads, target);
	}
	else
	{
		// We don't want to hack the target to nothing...
		let threads = getMaxThreads(ns, server, "SingleHack.js");
		ns.exec("SingleHack.js", server, threads, target);
	}
}

function getMaxThreads(ns, server, scriptName)
{
	return Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(scriptName)); // ns.getServerRam() is deprecated?
}

function LinearMapping(value, minimum, maximum)
{
	/*
	Equation of a line is y=mx+b where m is the slope, and b is the y-intercept.
	The slope here will be the maximum value minus the minimum value.
	The x value will be the value.
	The y-intercept will be the minimum input.
	f(value,min,max)=(max-min)*value+min
	*/
	return (maximum - minimum) * value + minimum;
}

export async function main(ns)
{
	ns.tail();

	// Load current prepared servers from file
	preparedServers = ns.read("PreparedServers.txt").split('\n');

	if (preparedServers[0] === "")
	{
		preparedServers = {};
	}
	else if (preparedServers[preparedServers.length - 1] === "")
	{
		preparedServers.pop();
	}

	// Do more prep work here
	// ...

	let dedicatedServers = ns.getPurchasedServers();
	for (let i = 0; i < dedicatedServers.length; i++)
	{
		await PrepareServer(ns, dedicatedServers[i]);
	}

	// Launch NetworkInfiltraitor.js
	ns.run("NetworkInfiltraitor.js", 1, "Preparer.js", true, false, true);

	while (true)
	{
		await UpdatePort(ns, 1);

		for (index; index < preparedServers.length; index++)
		{
			await PrepareServer(ns, preparedServers[index]);
		}

		for (let i = 0; i < preparedServers.length; i++)
		{
			await UpdateServer(ns, preparedServers[i]);
		}

		for (let i = 0; (i < dedicatedServers.length) && (targets.length > 0); i++)
		{
			await UpdateDedicatedServer(ns, dedicatedServers[i], targets[i % targets.length]);
		}

		await ns.sleep(200);
	}
}

/*
TODO:
Perhaps the Hack.js, Weaken.js, and Grow.js scripts can return a value when
they are done and then the server can run new scripts on them instead of
constantly checking and wasting time and CPU cycles/resources.

Also, instead of checking if there is a script running on the server, we should
check if there is free RAM to use. However, if we are only going off of
callbacks once things get started, we should instead do some logic so that we
don't use max threads for hacking, and then we can use the remaining threads to
weaken and grow the server. The only issue with that is we would become out of
sync when two scripts are reporting complete when they are not fully...
*/