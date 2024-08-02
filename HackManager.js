/** @param {NS} ns */

/*
RAM Usage: ?.??GB
*/

let preparedServers;

async function ReadPortUpdate(ns, port)
{
	let data = ns.readPort(1);
	if ((data !== "NULL PORT DATA") && (data.type == "Prepared"))
	{
		if (!preparedServers.includes(data.hostname))
		{
			ns.print("Saving " + data.hostname + " to PreparedServers.txt");
			ns.write("PreparedServers.txt", data.hostname + '\n', 'a');
			preparedServers.push(data.hostname);
		}
	}
}

export async function main(ns)
{
	// Load current prepared servers from file
	preparedServers = ns.read("PreparedServers.txt").split('\n');

	// Do more prep work here
	// ...

	// Launch NetworkInfiltraitor.js
	ns.run("NetworkInfiltraitor.js", 1, "Preparer.js", false);

	while (true)
	{
		ReadPortUpdate(ns, 1);

		await ns.sleep(400);
	}
}