/** @param {NS} ns */

export async function main(ns)
{
	while (true)
	{
		let data = ns.readPort(1);
		if (data !== "NULL PORT DATA")
		{
			if (data.scriptname == "Preparer.js")
			{
				ns.print("Saving " + data.hostname + " to PreparedServers.txt");
				ns.write("PreparedServers.txt", data.hostname + '\n', 'a');
			}
		}
		await ns.sleep(1000);
	}
}