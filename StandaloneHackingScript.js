/** @param {NS} ns */

const argsList = [
	['target', 'n00dles'],
	['money-percent', 95],
	['security-percent', 5]
];
let options;

/*
args:
[0] = Target hostname
[1] = Percent money before hack (eg. 90 means grow until 90% of server's max money before hacking)
[2] = Percent security before hack (eg. 10 means weaken until 10% of server's security)

RAM Usage: 2.80GB
*/
export async function main(ns)
{
	options = ns.flags(argsList);

	if (options['target'] == 'home')
	{
		ns.tprint("Why are you trying to hack home?");
		ns.print("Why are you trying to hack home?");
		ns.alert("Why are you trying to hack home?");
		return;
	}

	// Calculate thresholds
	const moneyThreshold = LinearMapping(options['money-percent'], ns.getServerMaxMoney(options['target']), 0);
	const securityThreshold = LinearMapping(options['security-percent'], 100, ns.getServerMinSecurityLevel(options['target'])); // How can we get the max security of a server? Is there a max...

	// Gain access to server
	if (ns.fileExists("BruteSSH.exe", "home"))
	{
		ns.brutessh(options['target']);
	}
	if (ns.fileExists("FTPCrack.exe", "home"))
	{
		ns.ftpcrack(options['target']);
	}
	if (ns.fileExists("relaySMTP.exe", "home"))
	{
		ns.relaysmtp(options['target']);
	}
	if (ns.fileExists("HTTPWorm.exe", "home"))
	{
		ns.httpworm(options['target']);
	}
	if (ns.fileExists("SQLInject.exe", "home"))
	{
		ns.sqlinject(options['target']);
	}

	// I AM ROOT
	ns.nuke(options['target']);

	// Hack loop
	while (true)
	{
		if (ns.getServerSecurityLevel(options['target']) > securityThreshold)
		{
			await ns.weaken(options['target']);
		}
		else if (ns.getServerMoneyAvailable(options['target']) < moneyThreshold)
		{
			await ns.grow(options['target']);
		}
		else
		{
			await ns.hack(options['target']);
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