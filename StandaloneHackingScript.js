/** @param {NS} ns */

/*
args:
[0] - Target hostname
[1] - Percent money before hack (eg. 90 means grow until 90% of server's max money before hacking)
[2] - Percent security before hack (eg. 10 means weaken until 10% of server's security)

RAM Usage: 2.90GB
*/

export async function main(ns)
{
	let target = "n00dles";
	let moneyPercent = 95;
	let securityPercent = 5;
	if (ns.args[0] != null)
	{
		target = ns.args[0];
	}
	if (ns.args[1] != null)
	{
		moneyPercent = ns.args[1];
	}
	if (ns.args[2] != null)
	{
		securityPercent = ns.args[2];
	}

	if (options['target'] == 'home')
	{
		ns.tprint("Why are you trying to hack home?");
		ns.print("Why are you trying to hack home?");
		ns.alert("Why are you trying to hack home?");
		return;
	}

	// Calculate thresholds
	const moneyThreshold = LinearMapping(moneyPercent, ns.getServerMaxMoney(target), 0);
	const securityThreshold = LinearMapping(securityPercent, 100, ns.getServerMinSecurityLevel(target)); // How can we get the max security of a server? Is there a max...

	// Gain access to server
	if (!ns.hasRootAccess(target))
	{
		while (ns.getServerNumPortsRequired(target) > portsOpened)
		{
			let portsOpened = 0;
			if (ns.fileExists("BruteSSH.exe", "home"))
			{
				ns.brutessh(target);
			}
			if (ns.fileExists("FTPCrack.exe", "home"))
			{
				ns.ftpcrack(target);
			}
			if (ns.fileExists("relaySMTP.exe", "home"))
			{
				ns.relaysmtp(target);
			}
			if (ns.fileExists("HTTPWorm.exe", "home"))
			{
				ns.httpworm(target);
			}
			if (ns.fileExists("SQLInject.exe", "home"))
			{
				ns.sqlinject(target);
			}

			await ns.sleep(200);
		}

		// I AM ROOT
		ns.nuke(target);
	}

	// Hack loop
	while (true)
	{
		if (ns.getServerSecurityLevel(target) > securityThreshold)
		{
			await ns.weaken(target);
		}
		else if (ns.getServerMoneyAvailable(target) < moneyThreshold)
		{
			await ns.grow(target);
		}
		else
		{
			await ns.hack(target);
		}
	}
}

function LinearMapping(percent, minimum, maximum)
{
	/*
	Equation of a line is y=mx+b where m is the slope, and b is the y-intercept.
	The slope here will be the maximum value minus the minimum value.
	The x value will be the percentage divided by 100.
	The y-intercept will be the minimum input.
	f(percent,min,max)=(max-min)*(percent/100)+min
	*/
	let output = (maximum - minimum) * (percent / 100) + minimum;
	return output;

}

/*
Annoyingly, every call to `ns.` counts as ram usage, even if it isn't used
(say it was in an if statement that didn't run) as well as it doesn't matter if
the `ns.` call was before or during a loop. This means ram usage will be high..
However, it seems multiple calls of the same `ns.` function doesn't increase
ram usage!
*/