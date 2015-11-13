/**
 * @interface Connector
 * @param {Account} account
 */

/**
 * @member {Account} account
 * @memberof Connector#
 */

/**
 * @member {Provider} provider
 * @memberof Connector#
 */

/**
 * @function connect
 * @param {function} callback
 * @memberof Connector#
 */

/**
 * @function disconnect
 * @memberof Connector#
 */

/**
 * @function isConnected
 * @return {boolean}
 * @memberof Connector#
 */

/**
 * @function start
 * @memberof Connector#
 */

/**
 * @function sync
 * @param {function} callback
 * @memberof Connector#
 */

/**
 * @namespace contacts
 * @memberof Connector
 */

/**
 * @function getStatus
 * @param {string[]} jids
 * @memberof Connector.contacts#
 */

/**
 * @function sync
 * @param {function} cb
 * @memberof Connector.contacts#
 */

/**
 * @function order
 * @param {function} cb
 * @memberof Connector.contacts#
 */

/**
 * @function remove
 * @param {string} jid
 * @memberof Connector.contacts#
 */

/**
 * @namespace presence
 * @memberof Connector
 */

/**
 * @function subscribe
 * @param {string} jid
 * @memberof Connector.presence#
 */

/**
 * @function set
 * @param {string} show
 * @param {string} status
 * @param {string} name
 * @memberof Connector.presence#
 */

/**
 * @function send
 * @param {string} show
 * @param {string} status
 * @param {string} name
 * @memberof Connector.presence#
 */

/**
 * @function send
 * @param {string} jid
 * @param {string} text
 * @param {MessageOptions} options
 * @memberof Connector#
 */

/**
 * @function ack
 * @param {number} id
 * @param {string} from
 * @param {string} type
 * @memberof Connector#
 */

/**
 * @function avatar
 * @param {function} callback
 * @param {number} id
 * @memberof Connector#
 */

/**
 * @namespace muc
 * @memberof Connector
 */

/**
 * @function avatar
 * @param {function} callback
 * @param {number} id
 * @memberof Connector.muc#
 */
