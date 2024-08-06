# Bitburner

Hello, welcome to my Bitburner repository!

Here I'll be storing all my work on Bitburner scripts and stuff.

[Useful page](https://bitburner.readthedocs.io/en/latest/advancedgameplay/hackingalgorithms.html)

TODO:
- [X] Standalone script
- [X] Remote Worm
- [ ] Hacking Managers
  - [X] Single command scripts
    - [X] Hack
    - [X] Grow
    - [X] Weaken
  - [X] Hack Manager
    - [X] Record taken-over servers
    - [X] Launch `NetworkInfiltraitor.js`
    - [X] Launch appropriate weaken/grow/hack script+threads
    - [X] Test and fix bugs
    - [X] Use dedicated servers
- [ ] Batch Algorithms
- [ ] Update README.md
- [ ] IPvGO 1.0

## Current Scripts (NEEDS UPDATING)

`StandaloneHackingScript.js` - My standalone hacking script, pretty basic and
nice for early game. Includes modifiable threshold settings for easy tweaking.
With a small tweak to `NetworkInfiltraitor.js` to make it run this script with
as many threads as possible, this script can be nice.

`RemoteWorm.js` - This script attempts to hack every server it can find and
then spreads a script to those servers. OLD (Surpassed by
`NetworkInfiltraitor.js`)

`NetworkInfiltraitor.js` - Another remote worm that will gain access to as
many servers as it can and spread the `Preparer.js` script. (Configurable)

`Preparer.js` - A script that will prepare a server for hacking.
`NetworkInfiltraitor.js` will run this script on a server and this script will
then weaken and grow the server before messaging the main server that it is
ready to be used.

`TempMessageRecorder.js` - This script will read all the messages sent from
`Preparer.js` and store them in a file. This is until I make a main server.

`BuyMaxServers.js` - This script will try to buy as many servers as possible.
It will loop until there is enough money to buy the max amount of servers. It
can buy servers with configurable amounts of RAM.

`SellAllServers.js` - This script will kill all running scripts on bought
servers, and then sell the server.

`UpdateServerScripts.js` - This script will kill all running scripts on bought
servers, and then run some given script. Loops for all bought servers.

`UpdateFiles.js` - Simply overwrites all files in the game with those
currently on the github repository. WIP

`HackManager.js` - 

### Idea



<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

---

#### OLD
New idea, imagine three different scripts, (names are WIP)

Infiltrator: This script when ran on (or targeting?) a server, will prepare it
to be hacked and used by the other two scripts. This script will connect to the
server, gain root access, open all possible ports, backdoor the server, and
finally weaken and grow the server before alerting the main server that this
server is ready.

Worker: This script will be on every server that has been prepared. It will
await commands from the main server and execute them. Command will mainly be
to grow, weaken, or hack other servers (or itself).

Main Server: This huge script will be in-charge of keeping track of all
prepared servers, sending them worker scripts and then keeping track of all the
servers with worker scripts and sending them commands. It will need to also
keep track of all possible targets and be able to select the best target to
hack, and how many workers to use.