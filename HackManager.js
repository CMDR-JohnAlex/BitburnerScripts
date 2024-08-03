/** @param {NS} ns */

/*
RAM Usage: ?.??GB
*/

let preparedServers = {};
let index = 0;

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
	ns.scriptKill("Weaken.js", server);
	ns.scriptKill("Grow.js", server);
	ns.scriptKill("Hack.js", server);

	// Copy necessary scripts to server
	ns.scp("Weaken.js", server);
	ns.scp("Grow.js", server);
	ns.scp("Hack.js", server);
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
	if (ns.scriptRunning("Weaken.js", server) || ns.scriptRunning("Grow.js", server) || ns.scriptRunning("Hack.js", server))
	{
		return;
	}

	if (ns.getServerSecurityLevel(server) > securityThreshold)
	{
		let threads = getMaxThreads(ns, server, "Weaken.js");
		ns.exec("Weaken.js", server, threads, server);
	}
	else if (ns.getServerMoneyAvailable(server) < moneyThreshold)
	{
		let threads = getMaxThreads(ns, server, "Grow.js");
		ns.exec("Grow.js", server, threads, server);
	}
	else
	{
		// We don't want to hack the server to nothing...
		let threads = getMaxThreads(ns, server, "Hack.js");
		ns.exec("Hack.js", server, threads, server);
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
	// Load current prepared servers from file
	preparedServers = ns.read("PreparedServers.txt").split('\n');

	if (preparedServers[0] === "")
	{
		preparedServers = {};
	}

	// Do more prep work here
	// ...

	// Launch NetworkInfiltraitor.js
	ns.run("NetworkInfiltraitor.js", 1, "Preparer.js", false);

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

		await ns.sleep(200);
	}
}

/*
TODO:
Perhaps the Hack.js, Weaken.js, and Grow.js scripts can return a value when
they are done and then the server can run new scripts on them instead of
constantly checking and wasting time and CPU resources.
*/