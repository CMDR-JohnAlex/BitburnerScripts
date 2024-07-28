/** @param {NS} ns */

/*
args:
0: [int] Amount of RAM to buy

RAM Usage: 4.25GB
*/

export async function main(ns)
{
    ns.tail();

    // How much RAM each purchased server will have
    const ram = ns.args[0];

    // Iterator we'll use for our loop
    let i = 0;

    ns.print("It costs " + ns.getPurchasedServerCost(ram) + " to buy a server with " + ram + "GB of RAM");

    // Continuously try to purchase servers until we've reached the maximum
    // amount of servers
    while (i < ns.getPurchasedServerLimit())
    {
        // Check if we have enough money to purchase a server
        if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram))
        {
            ns.purchaseServer("pserv-" + i, ram);
            i++;
        }

        // Make the script wait for a second before looping again.
		await ns.sleep(5000);
	}
}