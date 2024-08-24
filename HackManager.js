/** @param {NS} ns */

/*
RAM Usage: ?.??GB
*/

let preparedServers = [];
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

			await UpdateTargets(ns); // New server added, so update the targets list
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

async function UpdateTargets(ns)
{
	let possibleTargets = ns.read("PreparedServers.txt").split('\n');
	if (possibleTargets[0] === "")
	{
		return; // Just end. No prepared servers to become targets.
		//possibleTargets = [];
	}
	else if (possibleTargets[possibleTargets.length - 1] === "")
	{
		possibleTargets.pop();
	}
	targets = [];

	const sortedServers = possibleTargets.sort((a, b) =>
	{
		const requiredHackingA = ns.getServerRequiredHackingLevel(a)
		const requiredHackingB = ns.getServerRequiredHackingLevel(b)
		return requiredHackingA - requiredHackingB
	})
	for (let i = 0; i < possibleTargets.length; i++)
	{
		const serv = sortedServers[i];

		const moneyAmount = ns.getServerMaxMoney(serv);
		const hackLevel = ns.getServerRequiredHackingLevel(serv);
		const RAMAmount = ns.getServerMaxRam(serv);
		const hasRoot = ns.hasRootAccess(serv);
		ns.tprint(serv, " ", "(lvl:", hackLevel, ")", " ", "(", "$", ns.formatNumber(moneyAmount), ") (", RAMAmount, "GB RAM", ")", " Root: ", hasRoot);

		if (moneyAmount > 0 && hackLevel >= 0 && RAMAmount > 0)
			targets.unshift(serv);
	}
}

async function UpdateServer(ns, server)
{
	// TODO: We should NOT be calculating this every loop-
	// Calculate thresholds
	let moneyAmount = 0.90; // TODO: args. Value is same for all servers
	let securityAmount = 0.05; // TODO: args. Value is same for all servers
	const moneyThreshold = LinearMapping(moneyAmount, 0, ns.getServerMaxMoney(server));
	const securityThreshold = LinearMapping(securityAmount, ns.getServerMinSecurityLevel(server), 100); // How can we get the max security of a server? Is there a max...

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

let dedicatedServerIterator = 0;
async function UpdateDedicatedServer(ns, server)
{
	// TODO: We should NOT be calculating this every loop-
	// Calculate thresholds
	let moneyAmount = 0.90; // TODO: args. Value is same for all servers
	let securityAmount = 0.05; // TODO: args. Value is same for all servers

	let threads = 1024; // TODO: args. Allow user to set how many threads will be used each time. If the servers have a lot of ram, set this higher or else game will slow down and crash.
	while (threads < (ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam("SingleWeaken.js"))
	{
		const moneyThreshold = LinearMapping(moneyAmount, 0, ns.getServerMaxMoney(targets[dedicatedServerIterator % targets.length]));
		const securityThreshold = LinearMapping(securityAmount, ns.getServerMinSecurityLevel(targets[dedicatedServerIterator % targets.length]), 100); // How can we get the max security of a server? Is there a max...
		if (ns.getServerSecurityLevel(targets[dedicatedServerIterator % targets.length]) > securityThreshold)
		{
			ns.exec("SingleWeaken.js", server, threads, targets[dedicatedServerIterator % targets.length]);
		}
		else if (ns.getServerMoneyAvailable(targets[dedicatedServerIterator % targets.length]) < moneyThreshold)
		{
			ns.exec("SingleGrow.js", server, threads, targets[dedicatedServerIterator % targets.length]);
		}
		else
		{
			ns.exec("SingleHack.js", server, threads, targets[dedicatedServerIterator % targets.length]);
		}
		dedicatedServerIterator++;
	}

	if (dedicatedServerIterator > 1000000)
		dedicatedServerIterator = 0; // Just to be safe... This number will get high FAST!
}

async function UpdateHome(ns, target)
{
	// TODO: We should NOT be calculating this every loop-
	// Calculate thresholds
	let moneyAmount = 0.90; // TODO: args. Value is same for all servers
	let securityAmount = 0.05; // TODO: args. Value is same for all servers
	const moneyThreshold = LinearMapping(moneyAmount, 0, ns.getServerMaxMoney(target));
	const securityThreshold = LinearMapping(securityAmount, ns.getServerMinSecurityLevel(target), 100); // How can we get the max security of a server? Is there a max...

	let threads = 32768; // TODO: args. Allow user to set how many threads will be used each time. If the home computer have a lot of ram, set this higher or else game will slow down and crash.
	let threadsToSave = 256; // TODO: args. Save at least this many threads for the home computer to use.
	if (ns.getServerSecurityLevel(target) > securityThreshold)
	{
		if (threads < Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - threadsToSave)) / ns.getScriptRam("SingleWeaken.js"))
			ns.run("SingleWeaken.js", threads, target);
	}
	else if (ns.getServerMoneyAvailable(target) < moneyThreshold)
	{
		if (threads < Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - threadsToSave)) / ns.getScriptRam("SingleGrow.js"))
			ns.run("SingleGrow.js", threads, target);
	}
	else
	{
		if (threads < Math.floor((ns.getServerMaxRam("home") - ns.getServerUsedRam("home") - threadsToSave)) / ns.getScriptRam("SingleHack.js"))
			ns.run("SingleHack.js", threads, target);
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
		preparedServers = [];
	}
	else if (preparedServers[preparedServers.length - 1] === "")
	{
		preparedServers.pop();
	}
	await UpdateTargets(ns);

	let dedicatedServers = ns.getPurchasedServers();
	for (let i = 0; i < dedicatedServers.length; i++)
	{
		await PrepareServer(ns, dedicatedServers[i]);
	}

	// Launch NetworkInfiltraitor.js
	ns.run("NetworkInfiltraitor.js", 1, "Preparer.js", true, false, true);

	let iterator = 0;
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
			await UpdateDedicatedServer(ns, dedicatedServers[i], targets);
		}

		await UpdateHome(ns, targets[iterator % targets.length]);
		iterator++; // How big can this get...
		if (iterator > 1000000)
			iterator = 0; // Let's just do this to be safe

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