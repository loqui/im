/**
 * Copyright (C) 2015 Joe Bandenburg
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function (root, factory) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define("axolotl-crypto", ["axlsign"], factory);
    } else if (typeof exports === "object") {
        module.exports = factory(require("axlsign"));
    } else {
        root.axolotlCrypto = factory(root.axlsign);
    }
}(this, function(curve25519) {
    "use strict";

    var padding = new Uint8Array([16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]);

    var crypto = {
        generateKeyPair: function() {
            var privateKey = window.crypto.getRandomValues(new Uint8Array(32));
            var pair = curve25519.generateKeyPair(privateKey);
            var publicKey = new Uint8Array(33);
            publicKey[0] = 0x05;
            publicKey.set(pair.public, 1);
            return {
                public: publicKey.buffer,
                private: pair.private.buffer
            };
        },
        calculateAgreement: function(publicKey, privateKey) {
            return curve25519.sharedKey(new Uint8Array(privateKey), new Uint8Array(publicKey.slice(1)));
        },
        randomBytes: function(byteCount) {
            return window.crypto.getRandomValues(new Uint8Array(byteCount)).buffer;
        },
        sign: function(privateKey, dataToSign) {
            return curve25519.sign(new Uint8Array(privateKey), new Uint8Array(dataToSign)).buffer;
        },
        verifySignature: function(signerPublicKey, dataToSign, purportedSignature) {
            return curve25519.verify(new Uint8Array(signerPublicKey.slice(1)), new Uint8Array(dataToSign), new Uint8Array(purportedSignature));
        },
        hmac: function(key, data) {
            if (window.crypto.subtle) {
                var keyOptions = {
                    name: "HMAC",
                    hash: {
                        name: "SHA-256"
                    }
                };
                var signOptions = {
                    name: "HMAC",
                    hash: "SHA-256"
                };
                return window.crypto.subtle.importKey("raw", key, keyOptions, false, ["sign"]).then(function(key) {
                    return window.crypto.subtle.sign(signOptions, key, data)
                        .then(function (o) { return o.buffer ? o.buffer : o; });
                });
            } else {
                return Promise.resolve(asmCrypto.HMAC_SHA256.bytes(data, key).buffer);
            }
        },
        deriveHKDFv3Secrets: function(refKey, cryptKeys, size) {
            var numBlocks = Math.ceil(size / 32);
            var buf = new Uint8Array(32 * numBlocks);
            var self = this;

            function expand(prk, t, i) {
                var input = new Uint8Array(t.length + cryptKeys.length + 1);
                input.set(t);
                input.set(cryptKeys, t.length);
                input[input.length - 1] = i + 1;
                return self.hmac(prk, input).then(function (mac) {
                    var macArray = new Uint8Array(mac);
                    buf.set(macArray, i*32);
                    return (++i < numBlocks) ? expand(prk, macArray, i) : buf.subarray(0, size);
                });
            };

            return self.hmac(new Uint8Array(32).buffer, refKey).then(function (mac) {
                return expand(new Uint8Array(mac), new Uint8Array(), 0);
            });
        },
        encrypt: function(key, message, iv) {
            if (window.crypto.subtle) {
                var keyOptions = {
                    name: "AES-CBC"
                };
                var encryptOptions = {
                    name: "AES-CBC",
                    iv: new Uint8Array(iv)
                };
                return window.crypto.subtle.importKey("raw", key, keyOptions, false, ["encrypt"]).then(function(key) {
                    return window.crypto.subtle.encrypt(encryptOptions, key, message)
                        .then(function (o) { return o.buffer ? o.buffer : o; });
                });
            } else {
                return Promise.resolve(asmCrypto.AES_CBC.encrypt(message, key, true, iv).buffer);
            }
        },
        decrypt: function(key, ciphertext, iv) {
            if (window.crypto.subtle) {
                var keyOptions = {
                    name: "AES-CBC"
                };
                var decryptOptions = {
                    name: "AES-CBC",
                    iv: new Uint8Array(iv)
                };
                return window.crypto.subtle.importKey("raw", key, keyOptions, false, ["decrypt"]).then(function(key) {
                    return window.crypto.subtle.decrypt(decryptOptions, key, ciphertext)
                        .then(function (o) { return o.buffer ? o.buffer : o; });
                });
            } else {
                return Promise.resolve(asmCrypto.AES_CBC.decrypt(ciphertext, key, true, iv).buffer);
            }
        }
    };
    return crypto;
}));
