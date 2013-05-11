LOQUI Instant Messenger
=====

LOQUI Instant Messenger is a mobile chat app for Firefox OS that allows you to use your Google Talk™ or Jabber® account.
https://loqui.im

How does it work? (It does!)
====
It uses a great javascript library for performing XMPP communication which is called "Strophe.js".
Strophe is capable of connecting to any XMPP server listening trough BOSH (Bidirectional-streams Over Synchronous HTTP).

Currently all connections are made through the open BOSH gateway at http://app.loqui.im/http-bind but soon the app should be able to detect wether user's account provided has its own BOSH server and connect to it and if not, connect to a open BOSH from its country.

In longer term, connections should be made through javascript TCPSockets API, avoiding the need for BOSH servers and thus improving performance and reliability.

Acknowledgements
===
We would like to thank:
 * Jack Moffitt and everyone who contributed to create Strophe.js
 * Javi Jimenez and Ignacio Olalde from Tapquo for creating Lungo, the framework supporting the UI.
 * Alastair Cameron (CameronMusic) for composing the notification sounds.
 * Movilforum for providing us the awesome Firefox OS Developer Preview devices from Geeksphone.
 * You for being about to stargaze or fork this project on GitHub ;)
