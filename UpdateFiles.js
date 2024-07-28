/** @param {NS} ns */

/*
RAM Usage: 1.60GB
*/

export async function main(ns)
{
	// TODO: Re-write this all, make it fancy and dynamic.
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/NetworkInfiltraitor.js", "NetworkInfiltraitor.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/Preparer.js", "Preparer.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/TempMessageRecorder.js", "TempMessageRecorder.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/Template.js", "Template.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/UpdateFiles.js", "UpdateFiles.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/BuyMaxServers.js", "BuyMaxServers.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/RemoteWorm.js", "RemoteWorm.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/SellAllServers.js", "SellAllServers.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/StandaloneHackingScript.js", "StandaloneHackingScript.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/UpdateServerScripts.js", "UpdateServerScripts.js");
	ns.wget("https://raw.githubusercontent.com/CMDR-JohnAlex/BitburnerScripts/master/README.md", "README.txt");
}