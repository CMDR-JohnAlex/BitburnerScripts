/** @param {NS} ns */

/*
args:
0: [int] Amount of RAM to buy

RAM Usage: 4.25GB
*/

export async function main(ns)
{
	ns.tail();

	let ram = 1048576; // 2^20 is max
	if (ns.args[0] != null)
		ram = ns.args[0];

	ns.print("It will cost $" + ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit() + " to buy " + ns.getPurchasedServerLimit() + " servers with " + ram + ".00GB of RAM. ($" + ns.getPurchasedServerCost(ram) + " per server)");
	ns.tprint("It will cost $" + ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit() + " to buy " + ns.getPurchasedServerLimit() + " servers with " + ram + ".00GB of RAM. ($" + ns.getPurchasedServerCost(ram) + " per server)");
	ns.alert("It will cost $" + ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit() + " to buy " + ns.getPurchasedServerLimit() + " servers with " + ram + ".00GB of RAM. ($" + ns.getPurchasedServerCost(ram) + " per server)");

	let purchasedServerCount = 0 /*ns.getPurchasedServers().length*/;
	for (let i = purchasedServerCount; i < ns.getPurchasedServerLimit(); i)
	{
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram))
		{
			//ns.killall("pserv-" + i, true);
			//ns.deleteServer("pserv-" + i);
			ns.purchaseServer("pserv-" + i, ram);
			ns.print("Purchased server pserv-" + i + " with " + ram + ".00GB of RAM.");
			ns.tprint("Purchased server pserv-" + i + " with " + ram + ".00GB of RAM.");
			ns.alert("Purchased server pserv-" + i + " with " + ram + ".00GB of RAM.");
			i++;
		}

		await ns.sleep(1000);
	}
}