LOQUI Instant Messenger
=====
LOQUI Instant Messenger is a mobile chat app for Firefox OS that allows you to have all your chat accounts
in just one FirefoxOS app. https://loqui.im

Providers support
===
At the moment it supports accounts from:
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
