/** @param {NS} ns */

/*
args:
0: [int] Amount of RAM to buy

RAM Usage: 6.50GB
*/

export async function main(ns)
{
	ns.tail();

	const ram = ns.args[0];

	ns.print("It will cost $" + ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit() + " to buy " + ns.getPurchasedServerLimit() + " servers with " + ram + ".00GB of RAM. ($" + ns.getPurchasedServerCost(ram) + " per server)");
	ns.tprint("It will cost $" + ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit() + " to buy " + ns.getPurchasedServerLimit() + " servers with " + ram + ".00GB of RAM. ($" + ns.getPurchasedServerCost(ram) + " per server)");
	ns.alert("It will cost $" + ns.getPurchasedServerCost(ram) * ns.getPurchasedServerLimit() + " to buy " + ns.getPurchasedServerLimit() + " servers with " + ram + ".00GB of RAM. ($" + ns.getPurchasedServerCost(ram) + " per server)");

	let purchasedServerCount = ns.getPurchasedServers().length;
	for (let i = purchasedServerCount; i < ns.getPurchasedServerLimit(); i)
	{
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram))
		{
			ns.purchaseServer("pserv-" + i, ram);
			ns.print("Purchased server pserv-" + i + " with " + ram + ".00GB of RAM.");
			ns.tprint("Purchased server pserv-" + i + " with " + ram + ".00GB of RAM.");
			ns.alert("Purchased server pserv-" + i + " with " + ram + ".00GB of RAM.");
			i++;
		}

		await ns.sleep(5000);
	}
}