LOQUI Instant Messenger
=====
Loqui Instant Messenger unifies all your chat accounts in just one FirefoxOS app
https://loqui.im

Providers support
===
At the moment it supports accounts from:
 * WhatsApp
 * Google Hangouts
 * Facebook Chat
 * Nimbuzz
 * Nokia ovi
 * Microsoft Lync
 * Any other XMPP/Jabber provider in the world

How does it work? (It does!)
====
It uses a great javascript library for performing XMPP communication which is called "Strophe.js".
Strophe is capable of connecting to any XMPP server listening trough BOSH (Bidirectional-streams Over Synchronous HTTP).

We may change soon the connection protocol for WebSockets + SimplePUSH in order to save battery when multiple accounts are set up.

In longer term, connections should be made through javascript TCPSockets API, avoiding the need for BOSH or WebSockets servers and thus improving performance and reliability.

Contribute
===

There are many ways to contribute, sending a Pull Request, testing the latest changes in the repository, filling a new issue or just confirming an issue reported by other user. If you have a problem and you are going to create a new issue, first check if another user have not been reported yet an issue similar to the yours, if not create a new issue.

If you are thinking on send a Pull Request with a fix for an issue, new feature, or a new language localization for Loqui, those are the steps to follow:

 * Fork this project
 * Create another branch to work on the fix, feature, localization. (ex: Fix-for-issue-#XXX)
 * Make your changes on your fork
 * Commit the changes (Try to be descriptibe with your commits)
 * Create a Pull Request.
 * Explain as best as you can why and what are the changes in the Pull Request.
 * Wait for an answer from owners to know if it is good to be landed in Loqui or needs changes.

If you have been submited a Pull Request that needs attention and no owners have been commented it, ping us (@aesedepece or @Gioyik) and we will take a look of the Pull Request as soon as possible.

Acknowledgements
===
We would like to thank:
 * Jack Moffitt and everyone who contributed to create Strophe.js and its plugins.
 * Javi Jimenez and Ignacio Olalde from Tapquo for creating Lungo, the framework supporting the UI.
 * Alastair Cameron (CameronMusic) for composing the notification sounds.
 * Fabien Cazenave for creating l10n.js, the library that helps to have Loqui in different languages.
 * Telefónica I+D for their promotion and support in addition to provide us the awesome Firefox OS Developer Preview devices from Geeksphone.
 * Everyone who has kindly reported issues or made pull requests.
 * You for being about to stargaze or fork this project on GitHub ;)
