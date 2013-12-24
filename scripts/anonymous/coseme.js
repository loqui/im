/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/**
 * CryptoJS core components.
 */
var CryptoJS = CryptoJS || (function (Math, undefined) {
    /**
     * CryptoJS namespace.
     */
    var C = {};

    /**
     * Library namespace.
     */
    var C_lib = C.lib = {};

    /**
     * Base object for prototypal inheritance.
     */
    var Base = C_lib.Base = (function () {
        function F() {}

        return {
            /**
             * Creates a new object that inherits from this object.
             *
             * @param {Object} overrides Properties to copy into the new object.
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         field: 'value',
             *
             *         method: function () {
             *         }
             *     });
             */
            extend: function (overrides) {
                // Spawn
                F.prototype = this;
                var subtype = new F();

                // Augment
                if (overrides) {
                    subtype.mixIn(overrides);
                }

                // Create default initializer
                if (!subtype.hasOwnProperty('init')) {
                    subtype.init = function () {
                        subtype.$super.init.apply(this, arguments);
                    };
                }

                // Initializer's prototype is the subtype object
                subtype.init.prototype = subtype;

                // Reference supertype
                subtype.$super = this;

                return subtype;
            },

            /**
             * Extends this object and runs the init method.
             * Arguments to create() will be passed to init().
             *
             * @return {Object} The new object.
             *
             * @static
             *
             * @example
             *
             *     var instance = MyType.create();
             */
            create: function () {
                var instance = this.extend();
                instance.init.apply(instance, arguments);

                return instance;
            },

            /**
             * Initializes a newly created object.
             * Override this method to add some logic when your objects are created.
             *
             * @example
             *
             *     var MyType = CryptoJS.lib.Base.extend({
             *         init: function () {
             *             // ...
             *         }
             *     });
             */
            init: function () {
            },

            /**
             * Copies properties into this object.
             *
             * @param {Object} properties The properties to mix in.
             *
             * @example
             *
             *     MyType.mixIn({
             *         field: 'value'
             *     });
             */
            mixIn: function (properties) {
                for (var propertyName in properties) {
                    if (properties.hasOwnProperty(propertyName)) {
                        this[propertyName] = properties[propertyName];
                    }
                }

                // IE won't copy toString using the loop above
                if (properties.hasOwnProperty('toString')) {
                    this.toString = properties.toString;
                }
            },

            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = instance.clone();
             */
            clone: function () {
                return this.init.prototype.extend(this);
            }
        };
    }());

    /**
     * An array of 32-bit words.
     *
     * @property {Array} words The array of 32-bit words.
     * @property {number} sigBytes The number of significant bytes in this word array.
     */
    var WordArray = C_lib.WordArray = Base.extend({
        /**
         * Initializes a newly created word array.
         *
         * @param {Array} words (Optional) An array of 32-bit words.
         * @param {number} sigBytes (Optional) The number of significant bytes in the words.
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.create();
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
         *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
         */
        init: function (words, sigBytes) {
            words = this.words = words || [];

            if (sigBytes != undefined) {
                this.sigBytes = sigBytes;
            } else {
                this.sigBytes = words.length * 4;
            }
        },

        /**
         * Converts this word array to a string.
         *
         * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
         *
         * @return {string} The stringified word array.
         *
         * @example
         *
         *     var string = wordArray + '';
         *     var string = wordArray.toString();
         *     var string = wordArray.toString(CryptoJS.enc.Utf8);
         */
        toString: function (encoder) {
            return (encoder || Hex).stringify(this);
        },

        /**
         * Concatenates a word array to this word array.
         *
         * @param {WordArray} wordArray The word array to append.
         *
         * @return {WordArray} This word array.
         *
         * @example
         *
         *     wordArray1.concat(wordArray2);
         */
        concat: function (wordArray) {
            // Shortcuts
            var thisWords = this.words;
            var thatWords = wordArray.words;
            var thisSigBytes = this.sigBytes;
            var thatSigBytes = wordArray.sigBytes;

            // Clamp excess bits
            this.clamp();

            // Concat
            if (thisSigBytes % 4) {
                // Copy one byte at a time
                for (var i = 0; i < thatSigBytes; i++) {
                    var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                }
            } else if (thatWords.length > 0xffff) {
                // Copy one word at a time
                for (var i = 0; i < thatSigBytes; i += 4) {
                    thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                }
            } else {
                // Copy all words at once
                thisWords.push.apply(thisWords, thatWords);
            }
            this.sigBytes += thatSigBytes;

            // Chainable
            return this;
        },

        /**
         * Removes insignificant bits.
         *
         * @example
         *
         *     wordArray.clamp();
         */
        clamp: function () {
            // Shortcuts
            var words = this.words;
            var sigBytes = this.sigBytes;

            // Clamp
            words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
            words.length = Math.ceil(sigBytes / 4);
        },

        /**
         * Creates a copy of this word array.
         *
         * @return {WordArray} The clone.
         *
         * @example
         *
         *     var clone = wordArray.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone.words = this.words.slice(0);

            return clone;
        },

        /**
         * Creates a word array filled with random bytes.
         *
         * @param {number} nBytes The number of random bytes to generate.
         *
         * @return {WordArray} The random word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.lib.WordArray.random(16);
         */
        random: function (nBytes) {
            var words = [];
            for (var i = 0; i < nBytes; i += 4) {
                words.push((Math.random() * 0x100000000) | 0);
            }

            return new WordArray.init(words, nBytes);
        }
    });

    /**
     * Encoder namespace.
     */
    var C_enc = C.enc = {};

    /**
     * Hex encoding strategy.
     */
    var Hex = C_enc.Hex = {
        /**
         * Converts a word array to a hex string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The hex string.
         *
         * @static
         *
         * @example
         *
         *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var hexChars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 0x0f).toString(16));
            }

            return hexChars.join('');
        },

        /**
         * Converts a hex string to a word array.
         *
         * @param {string} hexStr The hex string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
         */
        parse: function (hexStr) {
            // Shortcut
            var hexStrLength = hexStr.length;

            // Convert
            var words = [];
            for (var i = 0; i < hexStrLength; i += 2) {
                words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
            }

            return new WordArray.init(words, hexStrLength / 2);
        }
    };

    /**
     * Latin1 encoding strategy.
     */
    var Latin1 = C_enc.Latin1 = {
        /**
         * Converts a word array to a Latin1 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Latin1 string.
         *
         * @static
         *
         * @example
         *
         *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;

            // Convert
            var latin1Chars = [];
            for (var i = 0; i < sigBytes; i++) {
                var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                latin1Chars.push(String.fromCharCode(bite));
            }

            return latin1Chars.join('');
        },

        /**
         * Converts a Latin1 string to a word array.
         *
         * @param {string} latin1Str The Latin1 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
         */
        parse: function (latin1Str) {
            // Shortcut
            var latin1StrLength = latin1Str.length;

            // Convert
            var words = [];
            for (var i = 0; i < latin1StrLength; i++) {
                words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
            }

            return new WordArray.init(words, latin1StrLength);
        }
    };

    /**
     * UTF-8 encoding strategy.
     */
    var Utf8 = C_enc.Utf8 = {
        /**
         * Converts a word array to a UTF-8 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The UTF-8 string.
         *
         * @static
         *
         * @example
         *
         *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
         */
        stringify: function (wordArray) {
            try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
            } catch (e) {
                throw new Error('Malformed UTF-8 data');
            }
        },

        /**
         * Converts a UTF-8 string to a word array.
         *
         * @param {string} utf8Str The UTF-8 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
         */
        parse: function (utf8Str) {
            return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
        }
    };

    /**
     * Abstract buffered block algorithm template.
     *
     * The property blockSize must be implemented in a concrete subtype.
     *
     * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
     */
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
        /**
         * Resets this block algorithm's data buffer to its initial state.
         *
         * @example
         *
         *     bufferedBlockAlgorithm.reset();
         */
        reset: function () {
            // Initial values
            this._data = new WordArray.init();
            this._nDataBytes = 0;
        },

        /**
         * Adds new data to this block algorithm's buffer.
         *
         * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
         *
         * @example
         *
         *     bufferedBlockAlgorithm._append('data');
         *     bufferedBlockAlgorithm._append(wordArray);
         */
        _append: function (data) {
            // Convert string to WordArray, else assume WordArray already
            if (typeof data == 'string') {
                data = Utf8.parse(data);
            }

            // Append
            this._data.concat(data);
            this._nDataBytes += data.sigBytes;
        },

        /**
         * Processes available data blocks.
         *
         * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
         *
         * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
         *
         * @return {WordArray} The processed data.
         *
         * @example
         *
         *     var processedData = bufferedBlockAlgorithm._process();
         *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
         */
        _process: function (doFlush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // Round down to include only full blocks,
                // less the number of blocks that must remain in the buffer
                nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset);
                }

                // Remove processed words
                var processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
            }

            // Return processed words
            return new WordArray.init(processedWords, nBytesReady);
        },

        /**
         * Creates a copy of this object.
         *
         * @return {Object} The clone.
         *
         * @example
         *
         *     var clone = bufferedBlockAlgorithm.clone();
         */
        clone: function () {
            var clone = Base.clone.call(this);
            clone._data = this._data.clone();

            return clone;
        },

        _minBufferSize: 0
    });

    /**
     * Abstract hasher template.
     *
     * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
     */
    var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         */
        cfg: Base.extend(),

        /**
         * Initializes a newly created hasher.
         *
         * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
         *
         * @example
         *
         *     var hasher = CryptoJS.algo.SHA256.create();
         */
        init: function (cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Set initial values
            this.reset();
        },

        /**
         * Resets this hasher to its initial state.
         *
         * @example
         *
         *     hasher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-hasher logic
            this._doReset();
        },

        /**
         * Updates this hasher with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {Hasher} This hasher.
         *
         * @example
         *
         *     hasher.update('message');
         *     hasher.update(wordArray);
         */
        update: function (messageUpdate) {
            // Append
            this._append(messageUpdate);

            // Update the hash
            this._process();

            // Chainable
            return this;
        },

        /**
         * Finalizes the hash computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The hash.
         *
         * @example
         *
         *     var hash = hasher.finalize();
         *     var hash = hasher.finalize('message');
         *     var hash = hasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Final message update
            if (messageUpdate) {
                this._append(messageUpdate);
            }

            // Perform concrete-hasher logic
            var hash = this._doFinalize();

            return hash;
        },

        blockSize: 512/32,

        /**
         * Creates a shortcut function to a hasher's object interface.
         *
         * @param {Hasher} hasher The hasher to create a helper for.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
         */
        _createHelper: function (hasher) {
            return function (message, cfg) {
                return new hasher.init(cfg).finalize(message);
            };
        },

        /**
         * Creates a shortcut function to the HMAC's object interface.
         *
         * @param {Hasher} hasher The hasher to use in this HMAC helper.
         *
         * @return {Function} The shortcut function.
         *
         * @static
         *
         * @example
         *
         *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
         */
        _createHmacHelper: function (hasher) {
            return function (message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
            };
        }
    });

    /**
     * Algorithm namespace.
     */
    var C_algo = C.algo = {};

    return C;
}(Math));
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
/**
 * Cipher core components.
 */
CryptoJS.lib.Cipher || (function (undefined) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var Base64 = C_enc.Base64;
    var C_algo = C.algo;
    var EvpKDF = C_algo.EvpKDF;

    /**
     * Abstract base cipher template.
     *
     * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
     * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
     * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
     * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
     */
    var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
        /**
         * Configuration options.
         *
         * @property {WordArray} iv The IV to use for this operation.
         */
        cfg: Base.extend(),

        /**
         * Creates this cipher in encryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
         */
        createEncryptor: function (key, cfg) {
            return this.create(this._ENC_XFORM_MODE, key, cfg);
        },

        /**
         * Creates this cipher in decryption mode.
         *
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {Cipher} A cipher instance.
         *
         * @static
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
         */
        createDecryptor: function (key, cfg) {
            return this.create(this._DEC_XFORM_MODE, key, cfg);
        },

        /**
         * Initializes a newly created cipher.
         *
         * @param {number} xformMode Either the encryption or decryption transormation mode constant.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @example
         *
         *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
         */
        init: function (xformMode, key, cfg) {
            // Apply config defaults
            this.cfg = this.cfg.extend(cfg);

            // Store transform mode and key
            this._xformMode = xformMode;
            this._key = key;

            // Set initial values
            this.reset();
        },

        /**
         * Resets this cipher to its initial state.
         *
         * @example
         *
         *     cipher.reset();
         */
        reset: function () {
            // Reset data buffer
            BufferedBlockAlgorithm.reset.call(this);

            // Perform concrete-cipher logic
            this._doReset();
        },

        /**
         * Adds data to be encrypted or decrypted.
         *
         * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
         *
         * @return {WordArray} The data after processing.
         *
         * @example
         *
         *     var encrypted = cipher.process('data');
         *     var encrypted = cipher.process(wordArray);
         */
        process: function (dataUpdate) {
            // Append
            this._append(dataUpdate);

            // Process available blocks
            return this._process();
        },

        /**
         * Finalizes the encryption or decryption process.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
         *
         * @return {WordArray} The data after final processing.
         *
         * @example
         *
         *     var encrypted = cipher.finalize();
         *     var encrypted = cipher.finalize('data');
         *     var encrypted = cipher.finalize(wordArray);
         */
        finalize: function (dataUpdate) {
            // Final data update
            if (dataUpdate) {
                this._append(dataUpdate);
            }

            // Perform concrete-cipher logic
            var finalProcessedData = this._doFinalize();

            return finalProcessedData;
        },

        keySize: 128/32,

        ivSize: 128/32,

        _ENC_XFORM_MODE: 1,

        _DEC_XFORM_MODE: 2,

        /**
         * Creates shortcut functions to a cipher's object interface.
         *
         * @param {Cipher} cipher The cipher to create a helper for.
         *
         * @return {Object} An object with encrypt and decrypt shortcut functions.
         *
         * @static
         *
         * @example
         *
         *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
         */
        _createHelper: (function () {
            function selectCipherStrategy(key) {
                if (typeof key == 'string') {
                    return PasswordBasedCipher;
                } else {
                    return SerializableCipher;
                }
            }

            return function (cipher) {
                return {
                    encrypt: function (message, key, cfg) {
                        return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                    },

                    decrypt: function (ciphertext, key, cfg) {
                        return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                    }
                };
            };
        }())
    });

    /**
     * Abstract base stream cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
     */
    var StreamCipher = C_lib.StreamCipher = Cipher.extend({
        _doFinalize: function () {
            // Process partial blocks
            var finalProcessedBlocks = this._process(!!'flush');

            return finalProcessedBlocks;
        },

        blockSize: 1
    });

    /**
     * Mode namespace.
     */
    var C_mode = C.mode = {};

    /**
     * Abstract base block cipher mode template.
     */
    var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
        /**
         * Creates this mode for encryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
         */
        createEncryptor: function (cipher, iv) {
            return this.Encryptor.create(cipher, iv);
        },

        /**
         * Creates this mode for decryption.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @static
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
         */
        createDecryptor: function (cipher, iv) {
            return this.Decryptor.create(cipher, iv);
        },

        /**
         * Initializes a newly created mode.
         *
         * @param {Cipher} cipher A block cipher instance.
         * @param {Array} iv The IV words.
         *
         * @example
         *
         *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
         */
        init: function (cipher, iv) {
            this._cipher = cipher;
            this._iv = iv;
        }
    });

    /**
     * Cipher Block Chaining mode.
     */
    var CBC = C_mode.CBC = (function () {
        /**
         * Abstract base CBC mode.
         */
        var CBC = BlockCipherMode.extend();

        /**
         * CBC encryptor.
         */
        CBC.Encryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // XOR and encrypt
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);

                // Remember this block to use with next block
                this._prevBlock = words.slice(offset, offset + blockSize);
            }
        });

        /**
         * CBC decryptor.
         */
        CBC.Decryptor = CBC.extend({
            /**
             * Processes the data block at offset.
             *
             * @param {Array} words The data words to operate on.
             * @param {number} offset The offset where the block starts.
             *
             * @example
             *
             *     mode.processBlock(data.words, offset);
             */
            processBlock: function (words, offset) {
                // Shortcuts
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;

                // Remember this block to use with next block
                var thisBlock = words.slice(offset, offset + blockSize);

                // Decrypt and XOR
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);

                // This block becomes the previous block
                this._prevBlock = thisBlock;
            }
        });

        function xorBlock(words, offset, blockSize) {
            // Shortcut
            var iv = this._iv;

            // Choose mixing block
            if (iv) {
                var block = iv;

                // Remove IV for subsequent blocks
                this._iv = undefined;
            } else {
                var block = this._prevBlock;
            }

            // XOR blocks
            for (var i = 0; i < blockSize; i++) {
                words[offset + i] ^= block[i];
            }
        }

        return CBC;
    }());

    /**
     * Padding namespace.
     */
    var C_pad = C.pad = {};

    /**
     * PKCS #5/7 padding strategy.
     */
    var Pkcs7 = C_pad.Pkcs7 = {
        /**
         * Pads data using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to pad.
         * @param {number} blockSize The multiple that the data should be padded to.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
         */
        pad: function (data, blockSize) {
            // Shortcut
            var blockSizeBytes = blockSize * 4;

            // Count padding bytes
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

            // Create padding word
            var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

            // Create padding
            var paddingWords = [];
            for (var i = 0; i < nPaddingBytes; i += 4) {
                paddingWords.push(paddingWord);
            }
            var padding = WordArray.create(paddingWords, nPaddingBytes);

            // Add padding
            data.concat(padding);
        },

        /**
         * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
         *
         * @param {WordArray} data The data to unpad.
         *
         * @static
         *
         * @example
         *
         *     CryptoJS.pad.Pkcs7.unpad(wordArray);
         */
        unpad: function (data) {
            // Get number of padding bytes from last byte
            var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

            // Remove padding
            data.sigBytes -= nPaddingBytes;
        }
    };

    /**
     * Abstract base block cipher template.
     *
     * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
     */
    var BlockCipher = C_lib.BlockCipher = Cipher.extend({
        /**
         * Configuration options.
         *
         * @property {Mode} mode The block mode to use. Default: CBC
         * @property {Padding} padding The padding strategy to use. Default: Pkcs7
         */
        cfg: Cipher.cfg.extend({
            mode: CBC,
            padding: Pkcs7
        }),

        reset: function () {
            // Reset cipher
            Cipher.reset.call(this);

            // Shortcuts
            var cfg = this.cfg;
            var iv = cfg.iv;
            var mode = cfg.mode;

            // Reset block mode
            if (this._xformMode == this._ENC_XFORM_MODE) {
                var modeCreator = mode.createEncryptor;
            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                var modeCreator = mode.createDecryptor;

                // Keep at least one block in the buffer for unpadding
                this._minBufferSize = 1;
            }
            this._mode = modeCreator.call(mode, this, iv && iv.words);
        },

        _doProcessBlock: function (words, offset) {
            this._mode.processBlock(words, offset);
        },

        _doFinalize: function () {
            // Shortcut
            var padding = this.cfg.padding;

            // Finalize
            if (this._xformMode == this._ENC_XFORM_MODE) {
                // Pad data
                padding.pad(this._data, this.blockSize);

                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');
                // Initial values
                this._data = new WordArray.init();
                this._nDataBytes = 0;

            } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                // Process final blocks
                var finalProcessedBlocks = this._process(!!'flush');

                // Unpad data
                padding.unpad(finalProcessedBlocks);
            }

            return finalProcessedBlocks;
        },

        blockSize: 128/32
    });

    /**
     * A collection of cipher parameters.
     *
     * @property {WordArray} ciphertext The raw ciphertext.
     * @property {WordArray} key The key to this ciphertext.
     * @property {WordArray} iv The IV used in the ciphering operation.
     * @property {WordArray} salt The salt used with a key derivation function.
     * @property {Cipher} algorithm The cipher algorithm.
     * @property {Mode} mode The block mode used in the ciphering operation.
     * @property {Padding} padding The padding scheme used in the ciphering operation.
     * @property {number} blockSize The block size of the cipher.
     * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
     */
    var CipherParams = C_lib.CipherParams = Base.extend({
        /**
         * Initializes a newly created cipher params object.
         *
         * @param {Object} cipherParams An object with any of the possible cipher parameters.
         *
         * @example
         *
         *     var cipherParams = CryptoJS.lib.CipherParams.create({
         *         ciphertext: ciphertextWordArray,
         *         key: keyWordArray,
         *         iv: ivWordArray,
         *         salt: saltWordArray,
         *         algorithm: CryptoJS.algo.AES,
         *         mode: CryptoJS.mode.CBC,
         *         padding: CryptoJS.pad.PKCS7,
         *         blockSize: 4,
         *         formatter: CryptoJS.format.OpenSSL
         *     });
         */
        init: function (cipherParams) {
            this.mixIn(cipherParams);
        },

        /**
         * Converts this cipher params object to a string.
         *
         * @param {Format} formatter (Optional) The formatting strategy to use.
         *
         * @return {string} The stringified cipher params.
         *
         * @throws Error If neither the formatter nor the default formatter is set.
         *
         * @example
         *
         *     var string = cipherParams + '';
         *     var string = cipherParams.toString();
         *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
         */
        toString: function (formatter) {
            return (formatter || this.formatter).stringify(this);
        }
    });

    /**
     * Format namespace.
     */
    var C_format = C.format = {};

    /**
     * OpenSSL formatting strategy.
     */
    var OpenSSLFormatter = C_format.OpenSSL = {
        /**
         * Converts a cipher params object to an OpenSSL-compatible string.
         *
         * @param {CipherParams} cipherParams The cipher params object.
         *
         * @return {string} The OpenSSL-compatible string.
         *
         * @static
         *
         * @example
         *
         *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
         */
        stringify: function (cipherParams) {
            // Shortcuts
            var ciphertext = cipherParams.ciphertext;
            var salt = cipherParams.salt;

            // Format
            if (salt) {
                var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
            } else {
                var wordArray = ciphertext;
            }

            return wordArray.toString(Base64);
        },

        /**
         * Converts an OpenSSL-compatible string to a cipher params object.
         *
         * @param {string} openSSLStr The OpenSSL-compatible string.
         *
         * @return {CipherParams} The cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
         */
        parse: function (openSSLStr) {
            // Parse base64
            var ciphertext = Base64.parse(openSSLStr);

            // Shortcut
            var ciphertextWords = ciphertext.words;

            // Test for salt
            if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                // Extract salt
                var salt = WordArray.create(ciphertextWords.slice(2, 4));

                // Remove salt from ciphertext
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
            }

            return CipherParams.create({ ciphertext: ciphertext, salt: salt });
        }
    };

    /**
     * A cipher wrapper that returns ciphertext as a serializable cipher params object.
     */
    var SerializableCipher = C_lib.SerializableCipher = Base.extend({
        /**
         * Configuration options.
         *
         * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
         */
        cfg: Base.extend({
            format: OpenSSLFormatter
        }),

        /**
         * Encrypts a message.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Encrypt
            var encryptor = cipher.createEncryptor(key, cfg);
            var ciphertext = encryptor.finalize(message);

            // Shortcut
            var cipherCfg = encryptor.cfg;

            // Create and return serializable cipher params
            return CipherParams.create({
                ciphertext: ciphertext,
                key: key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
            });
        },

        /**
         * Decrypts serialized ciphertext.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {WordArray} key The key.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, key, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Decrypt
            var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

            return plaintext;
        },

        /**
         * Converts serialized ciphertext to CipherParams,
         * else assumed CipherParams already and returns ciphertext unchanged.
         *
         * @param {CipherParams|string} ciphertext The ciphertext.
         * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
         *
         * @return {CipherParams} The unserialized ciphertext.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
         */
        _parse: function (ciphertext, format) {
            if (typeof ciphertext == 'string') {
                return format.parse(ciphertext, this);
            } else {
                return ciphertext;
            }
        }
    });

    /**
     * Key derivation function namespace.
     */
    var C_kdf = C.kdf = {};

    /**
     * OpenSSL key derivation function.
     */
    var OpenSSLKdf = C_kdf.OpenSSL = {
        /**
         * Derives a key and IV from a password.
         *
         * @param {string} password The password to derive from.
         * @param {number} keySize The size in words of the key to generate.
         * @param {number} ivSize The size in words of the IV to generate.
         * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
         *
         * @return {CipherParams} A cipher params object with the key, IV, and salt.
         *
         * @static
         *
         * @example
         *
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
         *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
         */
        execute: function (password, keySize, ivSize, salt) {
            // Generate random salt
            if (!salt) {
                salt = WordArray.random(64/8);
            }

            // Derive key and IV
            var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

            // Separate key and IV
            var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
            key.sigBytes = keySize * 4;

            // Return params
            return CipherParams.create({ key: key, iv: iv, salt: salt });
        }
    };

    /**
     * A serializable cipher wrapper that derives the key from a password,
     * and returns ciphertext as a serializable cipher params object.
     */
    var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
        /**
         * Configuration options.
         *
         * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
         */
        cfg: SerializableCipher.cfg.extend({
            kdf: OpenSSLKdf
        }),

        /**
         * Encrypts a message using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {WordArray|string} message The message to encrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {CipherParams} A cipher params object.
         *
         * @static
         *
         * @example
         *
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
         *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
         */
        encrypt: function (cipher, message, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Encrypt
            var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

            // Mix in derived params
            ciphertext.mixIn(derivedParams);

            return ciphertext;
        },

        /**
         * Decrypts serialized ciphertext using a password.
         *
         * @param {Cipher} cipher The cipher algorithm to use.
         * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
         * @param {string} password The password.
         * @param {Object} cfg (Optional) The configuration options to use for this operation.
         *
         * @return {WordArray} The plaintext.
         *
         * @static
         *
         * @example
         *
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
         *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
         */
        decrypt: function (cipher, ciphertext, password, cfg) {
            // Apply config defaults
            cfg = this.cfg.extend(cfg);

            // Convert string to CipherParams
            ciphertext = this._parse(ciphertext, cfg.format);

            // Derive key and other params
            var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

            // Add IV to config
            cfg.iv = derivedParams.iv;

            // Decrypt
            var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

            return plaintext;
        }
    });
}());
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex != -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
}());
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function (Math) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Constants table
    var T = [];

    // Compute constants
    (function () {
        for (var i = 0; i < 64; i++) {
            T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
        }
    }());

    /**
     * MD5 hash algorithm.
     */
    var MD5 = C_algo.MD5 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init([
                0x67452301, 0xefcdab89,
                0x98badcfe, 0x10325476
            ]);
        },

        _doProcessBlock: function (M, offset) {
            // Swap endian
            for (var i = 0; i < 16; i++) {
                // Shortcuts
                var offset_i = offset + i;
                var M_offset_i = M[offset_i];

                M[offset_i] = (
                    (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                    (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
                );
            }

            // Shortcuts
            var H = this._hash.words;

            var M_offset_0  = M[offset + 0];
            var M_offset_1  = M[offset + 1];
            var M_offset_2  = M[offset + 2];
            var M_offset_3  = M[offset + 3];
            var M_offset_4  = M[offset + 4];
            var M_offset_5  = M[offset + 5];
            var M_offset_6  = M[offset + 6];
            var M_offset_7  = M[offset + 7];
            var M_offset_8  = M[offset + 8];
            var M_offset_9  = M[offset + 9];
            var M_offset_10 = M[offset + 10];
            var M_offset_11 = M[offset + 11];
            var M_offset_12 = M[offset + 12];
            var M_offset_13 = M[offset + 13];
            var M_offset_14 = M[offset + 14];
            var M_offset_15 = M[offset + 15];

            // Working varialbes
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];

            // Computation
            a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
            d = FF(d, a, b, c, M_offset_1,  12, T[1]);
            c = FF(c, d, a, b, M_offset_2,  17, T[2]);
            b = FF(b, c, d, a, M_offset_3,  22, T[3]);
            a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
            d = FF(d, a, b, c, M_offset_5,  12, T[5]);
            c = FF(c, d, a, b, M_offset_6,  17, T[6]);
            b = FF(b, c, d, a, M_offset_7,  22, T[7]);
            a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
            d = FF(d, a, b, c, M_offset_9,  12, T[9]);
            c = FF(c, d, a, b, M_offset_10, 17, T[10]);
            b = FF(b, c, d, a, M_offset_11, 22, T[11]);
            a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
            d = FF(d, a, b, c, M_offset_13, 12, T[13]);
            c = FF(c, d, a, b, M_offset_14, 17, T[14]);
            b = FF(b, c, d, a, M_offset_15, 22, T[15]);

            a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
            d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
            c = GG(c, d, a, b, M_offset_11, 14, T[18]);
            b = GG(b, c, d, a, M_offset_0,  20, T[19]);
            a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
            d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
            c = GG(c, d, a, b, M_offset_15, 14, T[22]);
            b = GG(b, c, d, a, M_offset_4,  20, T[23]);
            a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
            d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
            c = GG(c, d, a, b, M_offset_3,  14, T[26]);
            b = GG(b, c, d, a, M_offset_8,  20, T[27]);
            a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
            d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
            c = GG(c, d, a, b, M_offset_7,  14, T[30]);
            b = GG(b, c, d, a, M_offset_12, 20, T[31]);

            a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
            d = HH(d, a, b, c, M_offset_8,  11, T[33]);
            c = HH(c, d, a, b, M_offset_11, 16, T[34]);
            b = HH(b, c, d, a, M_offset_14, 23, T[35]);
            a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
            d = HH(d, a, b, c, M_offset_4,  11, T[37]);
            c = HH(c, d, a, b, M_offset_7,  16, T[38]);
            b = HH(b, c, d, a, M_offset_10, 23, T[39]);
            a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
            d = HH(d, a, b, c, M_offset_0,  11, T[41]);
            c = HH(c, d, a, b, M_offset_3,  16, T[42]);
            b = HH(b, c, d, a, M_offset_6,  23, T[43]);
            a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
            d = HH(d, a, b, c, M_offset_12, 11, T[45]);
            c = HH(c, d, a, b, M_offset_15, 16, T[46]);
            b = HH(b, c, d, a, M_offset_2,  23, T[47]);

            a = II(a, b, c, d, M_offset_0,  6,  T[48]);
            d = II(d, a, b, c, M_offset_7,  10, T[49]);
            c = II(c, d, a, b, M_offset_14, 15, T[50]);
            b = II(b, c, d, a, M_offset_5,  21, T[51]);
            a = II(a, b, c, d, M_offset_12, 6,  T[52]);
            d = II(d, a, b, c, M_offset_3,  10, T[53]);
            c = II(c, d, a, b, M_offset_10, 15, T[54]);
            b = II(b, c, d, a, M_offset_1,  21, T[55]);
            a = II(a, b, c, d, M_offset_8,  6,  T[56]);
            d = II(d, a, b, c, M_offset_15, 10, T[57]);
            c = II(c, d, a, b, M_offset_6,  15, T[58]);
            b = II(b, c, d, a, M_offset_13, 21, T[59]);
            a = II(a, b, c, d, M_offset_4,  6,  T[60]);
            d = II(d, a, b, c, M_offset_11, 10, T[61]);
            c = II(c, d, a, b, M_offset_2,  15, T[62]);
            b = II(b, c, d, a, M_offset_9,  21, T[63]);

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

            var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
            var nBitsTotalL = nBitsTotal;
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
            );
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
            );

            data.sigBytes = (dataWords.length + 1) * 4;

            // Hash final blocks
            this._process();

            // Shortcuts
            var hash = this._hash;
            var H = hash.words;

            // Swap endian
            for (var i = 0; i < 4; i++) {
                // Shortcut
                var H_i = H[i];

                H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                       (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
            }

            // Return final computed hash
            return hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    function FF(a, b, c, d, x, s, t) {
        var n = a + ((b & c) | (~b & d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function GG(a, b, c, d, x, s, t) {
        var n = a + ((b & d) | (c & ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function HH(a, b, c, d, x, s, t) {
        var n = a + (b ^ c ^ d) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    function II(a, b, c, d, x, s, t) {
        var n = a + (c ^ (b | ~d)) + x + t;
        return ((n << s) | (n >>> (32 - s))) + b;
    }

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.MD5('message');
     *     var hash = CryptoJS.MD5(wordArray);
     */
    C.MD5 = Hasher._createHelper(MD5);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacMD5(message, key);
     */
    C.HmacMD5 = Hasher._createHmacHelper(MD5);
}(Math));
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var StreamCipher = C_lib.StreamCipher;
    var C_algo = C.algo;

    /**
     * RC4 stream cipher algorithm.
     */
    var RC4 = C_algo.RC4 = StreamCipher.extend({
        _doReset: function () {
            // Shortcuts
            var key = this._key;
            var keyWords = key.words;
            var keySigBytes = key.sigBytes;

            // Init sbox
            var S = this._S = [];
            for (var i = 0; i < 256; i++) {
                S[i] = i;
            }

            // Key setup
            for (var i = 0, j = 0; i < 256; i++) {
                var keyByteIndex = i % keySigBytes;
                var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

                j = (j + S[i] + keyByte) % 256;

                // Swap
                var t = S[i];
                S[i] = S[j];
                S[j] = t;
            }

            // Counters
            this._i = this._j = 0;
        },

        _doProcessBlock: function (M, offset) {
            M[offset] ^= generateKeystreamWord.call(this);
        },

        keySize: 256/32,

        ivSize: 0
    });

    function generateKeystreamWord() {
        // Shortcuts
        var S = this._S;
        var i = this._i;
        var j = this._j;

        // Generate keystream word
        var keystreamWord = 0;
        for (var n = 0; n < 4; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;

            // Swap
            var t = S[i];
            S[i] = S[j];
            S[j] = t;

            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
        }

        // Update counters
        this._i = i;
        this._j = j;

        return keystreamWord;
    }

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
     */
    C.RC4 = StreamCipher._createHelper(RC4);

    /**
     * Modified RC4 stream cipher algorithm.
     */
    var RC4Drop = C_algo.RC4Drop = RC4.extend({
        /**
         * Configuration options.
         *
         * @property {number} drop The number of keystream words to drop. Default 192
         */
        cfg: RC4.cfg.extend({
            drop: 192
        }),

        _doReset: function () {
            RC4._doReset.call(this);

            // Drop
            for (var i = this.cfg.drop; i > 0; i--) {
                generateKeystreamWord.call(this);
            }
        }
    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
     */
    C.RC4Drop = StreamCipher._createHelper(RC4Drop);
}());
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Reusable object
    var W = [];

    /**
     * SHA-1 hash algorithm.
     */
    var SHA1 = C_algo.SHA1 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init([
                0x67452301, 0xefcdab89,
                0x98badcfe, 0x10325476,
                0xc3d2e1f0
            ]);
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];

            // Computation
            for (var i = 0; i < 80; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                    W[i] = (n << 1) | (n >>> 31);
                }

                var t = ((a << 5) | (a >>> 27)) + e + W[i];
                if (i < 20) {
                    t += ((b & c) | (~b & d)) + 0x5a827999;
                } else if (i < 40) {
                    t += (b ^ c ^ d) + 0x6ed9eba1;
                } else if (i < 60) {
                    t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                } else /* if (i < 80) */ {
                    t += (b ^ c ^ d) - 0x359d3e2a;
                }

                e = d;
                d = c;
                c = (b << 30) | (b >>> 2);
                b = a;
                a = t;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA1('message');
     *     var hash = CryptoJS.SHA1(wordArray);
     */
    C.SHA1 = Hasher._createHelper(SHA1);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacSHA1(message, key);
     */
    C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
}());
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function (Math) {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var Hasher = C_lib.Hasher;
    var C_algo = C.algo;

    // Initialization and round constants tables
    var H = [];
    var K = [];

    // Compute constants
    (function () {
        function isPrime(n) {
            var sqrtN = Math.sqrt(n);
            for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n % factor)) {
                    return false;
                }
            }

            return true;
        }

        function getFractionalBits(n) {
            return ((n - (n | 0)) * 0x100000000) | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
            if (isPrime(n)) {
                if (nPrime < 8) {
                    H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                }
                K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                nPrime++;
            }

            n++;
        }
    }());

    // Reusable object
    var W = [];

    /**
     * SHA-256 hash algorithm.
     */
    var SHA256 = C_algo.SHA256 = Hasher.extend({
        _doReset: function () {
            this._hash = new WordArray.init(H.slice(0));
        },

        _doProcessBlock: function (M, offset) {
            // Shortcut
            var H = this._hash.words;

            // Working variables
            var a = H[0];
            var b = H[1];
            var c = H[2];
            var d = H[3];
            var e = H[4];
            var f = H[5];
            var g = H[6];
            var h = H[7];

            // Computation
            for (var i = 0; i < 64; i++) {
                if (i < 16) {
                    W[i] = M[offset + i] | 0;
                } else {
                    var gamma0x = W[i - 15];
                    var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                                  ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                   (gamma0x >>> 3);

                    var gamma1x = W[i - 2];
                    var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                  ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                   (gamma1x >>> 10);

                    W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                }

                var ch  = (e & f) ^ (~e & g);
                var maj = (a & b) ^ (a & c) ^ (b & c);

                var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

                var t1 = h + sigma1 + ch + K[i] + W[i];
                var t2 = sigma0 + maj;

                h = g;
                g = f;
                f = e;
                e = (d + t1) | 0;
                d = c;
                c = b;
                b = a;
                a = (t1 + t2) | 0;
            }

            // Intermediate hash value
            H[0] = (H[0] + a) | 0;
            H[1] = (H[1] + b) | 0;
            H[2] = (H[2] + c) | 0;
            H[3] = (H[3] + d) | 0;
            H[4] = (H[4] + e) | 0;
            H[5] = (H[5] + f) | 0;
            H[6] = (H[6] + g) | 0;
            H[7] = (H[7] + h) | 0;
        },

        _doFinalize: function () {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;

            var nBitsTotal = this._nDataBytes * 8;
            var nBitsLeft = data.sigBytes * 8;

            // Add padding
            dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
            dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
            data.sigBytes = dataWords.length * 4;

            // Hash final blocks
            this._process();

            // Return final computed hash
            return this._hash;
        },

        clone: function () {
            var clone = Hasher.clone.call(this);
            clone._hash = this._hash.clone();

            return clone;
        }
    });

    /**
     * Shortcut function to the hasher's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     *
     * @return {WordArray} The hash.
     *
     * @static
     *
     * @example
     *
     *     var hash = CryptoJS.SHA256('message');
     *     var hash = CryptoJS.SHA256(wordArray);
     */
    C.SHA256 = Hasher._createHelper(SHA256);

    /**
     * Shortcut function to the HMAC's object interface.
     *
     * @param {WordArray|string} message The message to hash.
     * @param {WordArray|string} key The secret key.
     *
     * @return {WordArray} The HMAC.
     *
     * @static
     *
     * @example
     *
     *     var hmac = CryptoJS.HmacSHA256(message, key);
     */
    C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
}(Math));
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var C_enc = C.enc;
    var Utf8 = C_enc.Utf8;
    var C_algo = C.algo;

    /**
     * HMAC algorithm.
     */
    var HMAC = C_algo.HMAC = Base.extend({
        /**
         * Initializes a newly created HMAC.
         *
         * @param {Hasher} hasher The hash algorithm to use.
         * @param {WordArray|string} key The secret key.
         *
         * @example
         *
         *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
         */
        init: function (hasher, key) {
            // Init hasher
            hasher = this._hasher = new hasher.init();

            // Convert string to WordArray, else assume WordArray already
            if (typeof key == 'string') {
                key = Utf8.parse(key);
            }

            // Shortcuts
            var hasherBlockSize = hasher.blockSize;
            var hasherBlockSizeBytes = hasherBlockSize * 4;

            // Allow arbitrary length keys
            if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.finalize(key);
            }

            // Clamp excess bits
            key.clamp();

            // Clone key for inner and outer pads
            var oKey = this._oKey = key.clone();
            var iKey = this._iKey = key.clone();

            // Shortcuts
            var oKeyWords = oKey.words;
            var iKeyWords = iKey.words;

            // XOR keys with pad constants
            for (var i = 0; i < hasherBlockSize; i++) {
                oKeyWords[i] ^= 0x5c5c5c5c;
                iKeyWords[i] ^= 0x36363636;
            }
            oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

            // Set initial values
            this.reset();
        },

        /**
         * Resets this HMAC to its initial state.
         *
         * @example
         *
         *     hmacHasher.reset();
         */
        reset: function () {
            // Shortcut
            var hasher = this._hasher;

            // Reset
            hasher.reset();
            hasher.update(this._iKey);
        },

        /**
         * Updates this HMAC with a message.
         *
         * @param {WordArray|string} messageUpdate The message to append.
         *
         * @return {HMAC} This HMAC instance.
         *
         * @example
         *
         *     hmacHasher.update('message');
         *     hmacHasher.update(wordArray);
         */
        update: function (messageUpdate) {
            this._hasher.update(messageUpdate);

            // Chainable
            return this;
        },

        /**
         * Finalizes the HMAC computation.
         * Note that the finalize operation is effectively a destructive, read-once operation.
         *
         * @param {WordArray|string} messageUpdate (Optional) A final message update.
         *
         * @return {WordArray} The HMAC.
         *
         * @example
         *
         *     var hmac = hmacHasher.finalize();
         *     var hmac = hmacHasher.finalize('message');
         *     var hmac = hmacHasher.finalize(wordArray);
         */
        finalize: function (messageUpdate) {
            // Shortcut
            var hasher = this._hasher;

            // Compute HMAC
            var innerHash = hasher.finalize(messageUpdate);
            hasher.reset();
            var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

            return hmac;
        }
    });
}());
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var Base = C_lib.Base;
    var WordArray = C_lib.WordArray;
    var C_algo = C.algo;
    var SHA1 = C_algo.SHA1;
    var HMAC = C_algo.HMAC;

    /**
     * Password-Based Key Derivation Function 2 algorithm.
     */
    var PBKDF2 = C_algo.PBKDF2 = Base.extend({
        /**
         * Configuration options.
         *
         * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
         * @property {Hasher} hasher The hasher to use. Default: SHA1
         * @property {number} iterations The number of iterations to perform. Default: 1
         */
        cfg: Base.extend({
            keySize: 128/32,
            hasher: SHA1,
            iterations: 1
        }),

        /**
         * Initializes a newly created key derivation function.
         *
         * @param {Object} cfg (Optional) The configuration options to use for the derivation.
         *
         * @example
         *
         *     var kdf = CryptoJS.algo.PBKDF2.create();
         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
         *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
         */
        init: function (cfg) {
            this.cfg = this.cfg.extend(cfg);
        },

        /**
         * Computes the Password-Based Key Derivation Function 2.
         *
         * @param {WordArray|string} password The password.
         * @param {WordArray|string} salt A salt.
         *
         * @return {WordArray} The derived key.
         *
         * @example
         *
         *     var key = kdf.compute(password, salt);
         */
        compute: function (password, salt) {
            // Shortcut
            var cfg = this.cfg;

            // Init HMAC
            var hmac = HMAC.create(cfg.hasher, password);

            // Initial values
            var derivedKey = WordArray.create();
            var blockIndex = WordArray.create([0x00000001]);

            // Shortcuts
            var derivedKeyWords = derivedKey.words;
            var blockIndexWords = blockIndex.words;
            var keySize = cfg.keySize;
            var iterations = cfg.iterations;

            // Generate key
            while (derivedKeyWords.length < keySize) {
                var block = hmac.update(salt).finalize(blockIndex);
                hmac.reset();

                // Shortcuts
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;

                // Iterations
                var intermediate = block;
                for (var i = 1; i < iterations; i++) {
                    intermediate = hmac.finalize(intermediate);
                    hmac.reset();

                    // Shortcut
                    var intermediateWords = intermediate.words;

                    // XOR intermediate with block
                    for (var j = 0; j < blockWordsLength; j++) {
                        blockWords[j] ^= intermediateWords[j];
                    }
                }

                derivedKey.concat(block);
                blockIndexWords[0]++;
            }
            derivedKey.sigBytes = keySize * 4;

            return derivedKey;
        }
    });

    /**
     * Computes the Password-Based Key Derivation Function 2.
     *
     * @param {WordArray|string} password The password.
     * @param {WordArray|string} salt A salt.
     * @param {Object} cfg (Optional) The configuration options to use for this computation.
     *
     * @return {WordArray} The derived key.
     *
     * @static
     *
     * @example
     *
     *     var key = CryptoJS.PBKDF2(password, salt);
     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
     *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
     */
    C.PBKDF2 = function (password, salt, cfg) {
        return PBKDF2.create(cfg).compute(password, salt);
    };
}());
/*
 * Derived from
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * UInt8Array encoding strategy.
     */
    var CJUInt8Array = C_enc.UInt8Array = {

        /**
         * Converts a word array to a UInt8Array.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {UInt8Array} The UInt8Array string.
         *
         * @static
         *
         * @example
         *
         *     var uint8Array = CryptoJS.enc.UInt8Array.stringify(wordArray);
         */
        stringify: function (wordArray) {
          // Shortcuts
          var words = wordArray.words;
          var sigBytes = wordArray.sigBytes;

          // Clamp excess bits
          wordArray.clamp();

          // Convert
          var uint8Array = new Uint8Array(sigBytes);
          for (var i = 0; i < sigBytes; i++) {
            uint8Array[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
          }

          return uint8Array;
        },

        /**
         * Converts a UInt8Array to a word array.
         *
         * @param {UInt8Array} buffer The UInt8Array.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.UInt8Array.parse(uint8array);
         */
        parse: function (buffer) {
          // Shortcut
          var byteLength = buffer.length;

          // Convert
          var words = [];
          for (var i = 0; i < byteLength; i++) {
            words[i >>> 2] |= (buffer[i] & 0xff) << (24 - (i % 4) * 8);
          }

          return new WordArray.init(words, byteLength);
        }
    };
}());
/*
 * Derived from
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var StreamCipher = C_lib.StreamCipher;
    var C_algo = C.algo;

    function generateKeystreamWordWP(bytesToProc) {
        // Shortcuts
          var S = this._S;
          var i = this._i;
          var j = this._j;
        var iters = 4;
        if (bytesToProc !== undefined) {
          iters = Math.min(bytesToProc, iters);
        }

        // Generate keystream word
        var keystreamWord = 0;
        for (var n = 0; n < iters; n++) {
            i = (i + 1) % 256;
            j = (j + S[i]) % 256;

            // Swap
            var t = S[i];
            S[i] = S[j];
            S[j] = t;

            keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
        }

        // Update counters
        this._i = i;
        this._j = j;

        return keystreamWord;
    }

    /**
     * Modified RC4 stream cipher algorithm.
     * Modifications:
     *   * Allow to cipher bytes instead of full words
     *   * Cipher in place: Allow only calls to finalize. And decipher in-place, so as to not need to copy the data
     */
    var RC4WP = C_algo.RC4WP = C_algo.RC4Drop.extend({
        _doProcessBlock: function (M, offset, bytesToProc) {
            M[offset] ^= generateKeystreamWordWP.call(this, bytesToProc);
        },

        // Update is not supported since we decipher in place!
        update: function() {
          throw new Error("Update not supported!");
        },

        // This append doesn't actually append... 
        // It just stores a ref to data. So any previous data will be lost!
        _append: function (data) {
          this._data = data;
        },

        _process: function (doFlush) {
            // Shortcuts
            var data = this._data;
            var dataWords = data.words;
            var dataSigBytes = data.sigBytes;
            var blockSize = this.blockSize;
            var blockSizeBytes = blockSize * 4;

            // Count blocks ready
            var nBlocksReady = dataSigBytes / blockSizeBytes;
            if (doFlush) {
                // Round up to include partial blocks
                nBlocksReady = Math.ceil(nBlocksReady);
            } else {
                // You guessed it, this is not supported either!
                throw new Error("Cannot call _process without doFlush");
            }

            // Count words ready
            var nWordsReady = nBlocksReady * blockSize;

            // Count bytes ready
            var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

            // Process blocks
            if (nWordsReady) {
                var totBytes = 0;
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                    // Perform concrete-algorithm logic
                    this._doProcessBlock(dataWords, offset, nBytesReady - totBytes);
                    totBytes += 4;
                }

                // Remove processed words, which will be all of them...
                this._data = null;
            }

            // Return processed words
            return data;
        }

    });

    /**
     * Shortcut functions to the cipher's object interface.
     *
     * @example
     *
     *     var ciphertext = CryptoJS.RC4WP.encrypt(message, key, cfg);
     *     var plaintext  = CryptoJS.RC4WP.decrypt(ciphertext, key, cfg);
     */
    C.RC4WP = StreamCipher._createHelper(RC4WP);
}());
/*
 * Derived from
 CryptoJS v3.1.2
 code.google.com/p/crypto-js
 (c) 2009-2013 by Jeff Mott. All rights reserved.
 code.google.com/p/crypto-js/wiki/License
 */
(function () {
  // Shortcuts
  var C = CryptoJS;
  var C_lib = C.lib;
  var WordArray = C_lib.WordArray;
  var Hasher = C_lib.Hasher;
  var C_algo = C.algo;

  /**
   * SHA-1 hash algorithm.
   */
  var SHA1_IP = C_algo.SHA1_IP = C_algo.SHA1.extend({

    // Append doesn't actually append anymore!
    // It just stores a ref to data. So any previous data will be lost!
    _append: function(data) {
       this._data = data;
       // Count the bytes even if we're not really appending
       this._nDataBytes += data.sigBytes;
     },

     // Special process that does NOT remove the processed blocks...
     // This one is actually quite similar to the one in RC4_WP
     _process: function (doFlush) {
       // Shortcuts
       var data = this._data;
       var dataWords = data.words;
       var dataSigBytes = data.sigBytes;
       var blockSize = this.blockSize;
       var blockSizeBytes = blockSize * 4;

       // Count blocks ready
       var nBlocksReady = dataSigBytes / blockSizeBytes;
       if (doFlush) {
         // Round up to include partial blocks
         nBlocksReady = Math.ceil(nBlocksReady);
       } else {
         // Round down to include only full blocks,
         // less the number of blocks that must remain in the buffer
         nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
       }

       // Count words ready
       var nWordsReady = nBlocksReady * blockSize;

       // Count bytes ready
       var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

       // Process blocks
       var offset = 0;
       if (nWordsReady) {
         for (offset = 0; offset < nWordsReady; offset += blockSize) {
           // Perform concrete-algorithm logic
           this._doProcessBlock(dataWords, offset);
         }
       }
       // Remove processed even if we didn't process any words... 
       // the hard way. Let's assume dataWords is NOT an array
       var l = dataWords.length;
       var dataLeft = new Array(l - offset)
       for(offset = nWordsReady; offset < l; offset ++) {
         dataLeft[offset - nWordsReady] = dataWords[offset];
       }
       this._data = new WordArray.init(dataLeft, data.sigBytes - nBytesReady);

       // Return nothing
       return ;
     },

     _doFinalize: function () {

       // Process the real data blocks
       this._process();

       // And now hash the padding

       // Shortcuts
       var data = this._data;
       var dataWords = data.words;

       var nBitsTotal = this._nDataBytes * 8;
       var nBitsLeft = data.sigBytes * 8;

       // Add padding
       dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
       dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
       dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
       data.sigBytes = dataWords.length * 4;

       // Hash final blocks
       this._process();

       // Return final computed hash
       return this._hash;
     }
   });

   /**
    * Shortcut function to the hasher's object interface.
    *
    * @param {WordArray|string} message The message to hash.
    *
    * @return {WordArray} The hash.
    *
    * @static
    *
    * @example
    *
    *     var hash = CryptoJS.SHA1_IP('message');
    *     var hash = CryptoJS.SHA1_IP(wordArray);
    */
   C.SHA1_IP = Hasher._createHelper(SHA1_IP);

   /**
    * Shortcut function to the HMAC's object interface.
    *
    * @param {WordArray|string} message The message to hash.
    * @param {WordArray|string} key The secret key.
    *
    * @return {WordArray} The HMAC.
    *
    * @static
    *
    * @example
    *
    *     var hmac = CryptoJS.HmacSHA1_IP(message, key);
    */
   C.HmacSHA1_IP = Hasher._createHmacHelper(SHA1_IP);
 }());

(function(global) {
  'use strict';

  global.CoSeMe = global.CoSeMe || {};

  function addAsConstructor(namespace, constructor) {
    namespace[constructor.name] = constructor;
  }

  function addAsSet(namespace, set) {
    var descriptor;
    for (var member in set) if (set.hasOwnProperty(member)) {
      descriptor = Object.getOwnPropertyDescriptor(set, member);
      Object.defineProperty(namespace, member, descriptor);
    }
  }

  global.CoSeMe.namespace = function (path, obj) {
    var name, pathNames = path.split('.');
    var currentNamespace = this;

    for (var remaining = pathNames.length; remaining; remaining--) {
      name = pathNames.shift();
      if (!name) continue;

      if (currentNamespace[name] === undefined) {
        currentNamespace[name] = {};
      }

      currentNamespace = currentNamespace[name];

      if (remaining === 1) {

        switch(typeof obj) {
          case 'function':
            if (!obj.name) {
              throw new Error('Error adding constructor to "' + name + '". ' +
                              'The constructor has no name.');
            } else {
              addAsConstructor(currentNamespace, obj);
            }
            break;

          case 'object':
            addAsSet(currentNamespace, obj);
            break;

          default:
            throw new Error('Error extending namespace "' + name + '". ' +
                            'Only objects or constructors can be added to ' +
                            'namespaces');
            break;
        }
      }
    }
    return currentNamespace;
  };

}(this));
CoSeMe.namespace('crypto', CryptoJS);
CoSeMe.namespace('config', (function(){
  'use strict';

  return {
    logger: true,

    domain: 's.whatsapp.net',

    tokenData: {
      "v": "2.11.134",
      // should be tokenData[d] + - + tokenData[v] + - + 443
      "r": "Android-2.11.134-443",
      "u": "WhatsApp/2.11.134 Android/4.3 Device/GalaxyS3",
      "t": "PdA2DJyKoUrwLw1Bg6EIhzh502dF9noR9uFCllGk1377032097395{phone}",
      "d": "Android"
    },

    auth: {
      host: 'c2.whatsapp.net',
      port: 443,
//      host: 'localhost',
//      port: 8080,
      domain: 's.whatsapp.net',
      options: {
        binaryType: 'arraybuffer',
        useSSL: false,
        useSecureTransport: false
      },
      rc4Options: {
        drop: 256/4
      },
      pbkdf2Options: {
        keySize: (20*8) / 32,
        iterations: 16
      },
      hmacLength: 4
    },

    contacts: {
      "url_auth": "https://sro.whatsapp.net/v2/sync/a",
      "url_query": "https://sro.whatsapp.net/v2/sync/q",
      "method": "POST",
      "authData": {
        "nc": "00000001",
        "realm": "s.whatsapp.net",
        "qop": "auth",
        "digestUri": "WAWA/s.whatsapp.net",
        "charSet": "utf-8",
        "authMethod": "X-WAWA"
      }
    }
  }
}()));
CoSeMe.namespace('common', (function(){
  'use strict';

  var isOn = CoSeMe.config.logger;

  function Logger(topic) {
    this._topic = topic || null;
    if (!topics.hasOwnProperty(topic)) {
      Logger.topics[topic] = true;
    }
  }

  Object.defineProperty(Logger, 'topics', { value: {} });
  var topics = Logger.topics;

  Logger.on = function() {
    isOn = true;
  };

  Logger.off = function() {
    isOn = false;
  };

  Logger.disable = function() {
    Array.prototype.forEach.call(arguments, function(topic) {
      topics[topic] = false;
    });
  };

  Logger.enable = function() {
    Array.prototype.forEach.call(arguments, function(topic) {
      topics[topic] = true;
    });
  };

  Logger.disableAll = function() {
    Object.keys(topics).forEach(function(topic) {
      topics[topic] = false;
    });
  };

  Logger.enableAll = function() {
    Object.keys(topics).forEach(function(topic) {
      topics[topic] = true;
    });
  };

  Logger.select = function(selection) {
    Object.keys(selection).forEach(function(topic) {
      topics[topic] = !!selection[topic];
    });
  };

  Logger.prototype.log = function() {
    this._message(arguments, 'log');
  };

  Logger.prototype.warn = function() {
    this._message(arguments, 'warn');
  };

  Logger.prototype.error = function() {
    this._message(arguments, 'error');
  };

  Logger.prototype._message = function(args, kind) {
    if (!isOn || this._topic && !topics[this._topic]) return;

    kind = kind || 'log';

    var stack; // creepy trick to obtain the current stack
    try { throw new Error() } catch(err) { stack = err.stack; }
    var where = stack.split('\n')[2];
    var message = getMessage(this._topic, where, args);
    putMessage(kind, message);
  }

  function getMessage(topic, where, args) {
    var token, tokens = [];
    for (var i = 0, l = args.length; i < l; i++) {
      token = stringify(args[i]);
      tokens.push(token)
    }
    tokens.push('~ ' + where);
    if (topic) {
      tokens.push('[' + topic + ']');
    }

    return tokens.join(' ');
  }

  function stringify(obj) {
    var string;

    // Already a string
    if (typeof obj === 'string') {
      string = obj;

    // An exception
    } else if (obj instanceof Error) {
      var stack = obj.stack || '';
      var sanitizedStack = stack.replace(/\n/g, ' > ');
      string = obj.name + ': "' + obj.message + '" at ' + sanitizedStack;

    // A date or regular expression
    } else if (obj instanceof Date || obj instanceof RegExp) {
      string = obj.toString();

    // Stringify by default
    } else {
      string = JSON.stringify(obj);
    }

    // Deeper exploration
    if (string === '{}') {

      // An event
      if (obj.target && obj.type) {
        var data = stringify(obj.data ? obj.data : undefined);
        var obj = stringify(obj.target);
        string = stringify({ type: obj.type, target: obj.target, data: data});
      }

    }

    return string;
  }

  function putMessage(kind, message) {
    if (typeof console[kind] !== 'function') {
      kind = 'log';
    }
    console[kind](message);
  }

  return Logger;
}()));
CoSeMe.namespace('utils', (function(){
  'use strict';

  var logger = new CoSeMe.common.Logger('utils');

  /**
   * ByteBuffer supported by a duck type of CryptoJS.lib.wordArray in order
   * to reduce copies. The wordArray is supported byte an Uint32Array in order
   * to be compatible with the TCPSocket and reduce copies even more.
   *
   * Constructor accepts two forms:
   *  - ByteArrayWA(sizeInBytes):
   *      build a new ByteArrayWA of sizeInBytes bytes.
   *
   *  - ByteArrayWA(Uint32Array, initialSizeInBytes):
   *      build a new ByteArrayWA supported by the Uint32Array setting the
   *      initial size to initialSizeInBytes.
   *
   */
  function ByteArrayWA(sizeOrUint32, initialSizeInBytes) {
    var WordArray = CryptoJS.lib.WordArray;

    // Called as new ByteArrayWA(sizeInBytes)
    if (typeof sizeOrUint32 === 'number') {
      var sizeInBytes, sizeInWords;
      sizeInBytes = sizeOrUint32;
      sizeInWords = (sizeInBytes >>> 2) + (sizeInBytes & 0x3 ? 1 : 0);

      this.initialByte = 0;
      this.size = sizeInBytes;
      this.array = new WordArray.init(new Uint32Array(sizeInWords), 0);

    // Called as new ByteArrayWA(Uint32Array, initialSizeInBytes)
    } else if (sizeOrUint32 instanceof Uint32Array) {
      var uint32Array = sizeOrUint32;
      this.initialByte = 0;
      this.size = uint32Array.buffer.byteLength;
      this.array = new WordArray.init(uint32Array, initialSizeInBytes || 0);

    // Other calls not supported
    } else {
      throw new Error(
        'Expecting first parameter to be a number of an Uint32Array.');
    }
  }

  ByteArrayWA.prototype = {
    write: function(w, numBytes) {
      numBytes = numBytes || 1;
      w = w << (32 - numBytes * 8);
      for(var byt = 0; byt < numBytes; byt++) {
        if (this.isFull()) {
          throw new RangeError('Cannot extend a ByteArrayWA');
        }
        var desp = 24 - (byt * 8);
        var b = (w & (0xff << desp)) >>> desp;
        var i = this.array.sigBytes++;
        this.array.words[i >>> 2] |= b << (24 - (i & 0x3) * 8);
      }
    },

    read: function() {
      try {
        var r = this.get(0);
        this.initialByte++;
        return r;
      } catch (x) {
        return undefined;
      }
    },

    /*
     * This method 'finishes' the buffer, returning it as a Uint8Array,
     * and invalidating the buffer for future reads or writes
     * We *do* support getting a partial buffer... although it's a PITA
     */
    finish: function() {
      var byteArray = new Uint8Array(this.array.words.buffer);
      // Let's see... If we just sort from the Wword that contains initialByte
      // to the word that contains currentByte and then return the whole buffer
      // (so as to not copy it) then it should work...
      var words = this.array.words;
      var finalWord = this.array.sigBytes >>> 2;
      var currentWord, currentByte;
      for(currentWord = this.initialByte >>> 2, currentByte = currentWord << 2;
          currentWord <= finalWord; currentWord++, currentByte +=4) {
        var b3 = byteArray[currentByte],
            b2 = byteArray[currentByte + 1];
        byteArray[currentByte] = byteArray[currentByte + 3];
        byteArray[currentByte + 1] =  byteArray[currentByte + 2];
        byteArray[currentByte + 2] = b2;
        byteArray[currentByte + 3] = b3;
      }
      var result = {
        offset: this.initialByte,
        length: this.length,
        buffer: byteArray
      };
      this.array = null;
      return result;
    },

    get length() {
      return this.array.sigBytes - this.initialByte;
    },

    get bufferSize() {
      return this.size;
    },

    isEmpty: function() {
      return this.array.sigBytes == this.initialByte;
    },

    isFull: function() {
      // The buffer doesn't grow nor is reusable!
      return this.array.sigBytes == this.size;
    },

    // I was going to throw an exception, but not having the function at all works also
    // Leaving this here, commented, so nobody thinks of adding it :P
/*    resize: function(size) {
      if (size > this.size) {
        // In this case the word array will grow automagically...
        this.size = this.array.sigBytes = size;
        this.array.words[size >>> 2] = undefined;
      }
    },
*/

    get: function(index) {
      var i = this.initialByte + index;
      if (index < 0 || i >= this.array.sigBytes) {
        throw new RangeError('index out of bounds.');
      }
      var desp = (24 - (i & 0x3) * 8);
      return (this.array.words[i >>> 2] & (0xff << desp)) >>> desp;
    },

    // It accepts sequence of bytes or WordArrays
    writeAll: function(sequence) {
      // Nifty trick... we allow also writing WordArrays
      var numBytes = sequence.words && sequence.sigBytes ? 4 : 1;
      var bytesLeft = sequence.sigBytes || sequence.length;
      if (numBytes > 1) {
        sequence = sequence.words;
      }
      for(var i = 0; bytesLeft > 0; bytesLeft -= numBytes, i++) {
        var data = sequence[i];
        var bytesToCopy = bytesLeft < numBytes ? bytesLeft : numBytes;
        this.write(data >>> (32 - bytesToCopy * 8), bytesToCopy);
      }
      return this;
    }

  };

  function ByteArray(size) {
    // virtualSize is the size the user wants
    var virtualSize = typeof size !== 'undefined' ? Math.floor(size) : 1023;

    // bufSize is the real size of the buffer
    var bufSize = virtualSize + 1;

    var array = new Uint8Array(bufSize);
    var start = 0, end = 0;

    function _nextIndex(index) {
      var next;
      return (next = index + 1) === bufSize ? 0 : next;
    }

    function _dumpContent(destination) {
      if (end < start) {
        destination.set(array.subarray(start, bufSize));
        destination.set(array.subarray(0, end), bufSize - start);
      } else {
        destination.set(array.subarray(start, end));
      }
    }

    Object.defineProperty(this, 'bufferSize', { get: function() {
      return virtualSize;
    } });

    Object.defineProperty(this, 'length', { get: function() {
      return end - start + (end < start ? bufSize : 0);
    } });

    Object.defineProperty(this, 'buffer', { get: function() {
      var a = new Uint8Array(this.length);
      _dumpContent(a);
      return a.buffer;
    } });

    this.isEmpty = function() { return start === end; };

    this.isFull = function() { return this.length === virtualSize; };

    this.write = function(n) {
      if (this.isFull()) {
        this.resize(bufSize * 2);
      }
      array[end] = n;
      end = _nextIndex(end);
    };

    this.read = function() {
      if (this.isEmpty()) {
        return undefined;
      }
      var item = array[start];
      start = _nextIndex(start);
      return item;
    };

    this.resize = function(newSize) {
      var contentLength = this.length;
      var newVirtualSize = Math.max(Math.floor(newSize), contentLength);
      if (newVirtualSize !== virtualSize) {
        var newBufferSize = newVirtualSize + 1;
        var newArray = new Uint8Array(newBufferSize);
        _dumpContent(newArray);

        virtualSize = newVirtualSize;
        bufSize = newBufferSize;
        array = newArray;
        start = 0;
        end = contentLength;
      }

      return virtualSize;
    };

    this.get = function(i) {
      if (i < 0 || i >= this.length) {
        throw new RangeError('index out of bounds.');
      }
      var fixedIndex = start + i;
      fixedIndex -= (fixedIndex >= bufSize ? bufSize : 0);
      return array[fixedIndex];
    };

    this.writeAll = function(sequence) {
      for (var i = 0, l = sequence.length; i < l; i++) {
        this.write(sequence[i]);
      }
    };
  }

  ByteArray.fromBuffer = function(buffer) {
    if (buffer instanceof ArrayBuffer) {
      buffer = new Uint8Array(buffer);
    }

    if (buffer instanceof Uint8Array) {
      var output = new ByteArray(buffer.length);
      output.writeAll(buffer);
      return output;
    }

    throw new Error('fromBuffer(buffer) only works with instances of ' +
                    'ArrayBuffer or Uint8Array.')
  };

  function hex(array) {
    if (array instanceof ArrayBuffer) {
      array = new Uint8Array(array);
    } else if (array instanceof ByteArray) {
      array = new Uint8Array(array.buffer);
    } else if (array instanceof ByteArrayWA) {
      return CryptoJS.enc.Hex.stringify(array.buffer);
    }
    var c, hexrepr = '';
    for (var i = 0, l = array.length; i < l; i++) {
      c = array[i].toString(16);
      hexrepr += (c.length < 2) ? '0' + c : c;
    }
    return hexrepr;
  }

  function bytesFromLatin1(string) {
    var buffer = new Uint8Array(string.length);
    var b1, b0, c;
    for (var i = 0, l = string.length; i < l; i++) {
      c = string.charCodeAt(i);
      b1 = (c & 0xFF00) >>> 8;
      if (b1) {
        logger.warn(
          'High order byte !== 0x00 in character number', i, 'of ', string);
      }
      b0 = (c & 0xFF);
      buffer[i] = b0;
    }
    return buffer;
  }

  function latin1FromBytes(buffer) {
    var result = '';
    var l = buffer.length;
    for (var i = 0; i < l; i++) {
      result = result + String.fromCharCode(buffer[i]);
    }
    return result;
    // was
    //    return String.fromCharCode.apply(null, buffer);
    // but for some unknown reason, this is way slower...
  }

  var utils = {
    urlencode: function _urlencode(params) {
      var pairs = [];
      for (var paramName in params) {
        if (Array.isArray(params[paramName])) {
          var aux = [];
          for (var i in params[paramName]) {
            aux.push(encodeURIComponent(paramName + '[]') + '=' +
                     encodeURIComponent(params[paramName][i]));
          };
          pairs.push(aux.join('&'));
        } else {
          pairs.push(encodeURIComponent(paramName) + '=' +
                     encodeURIComponent(params[paramName]));
        }
      }
      return pairs.join('&');
    },

    len: function _len(obj) {
      if (typeof obj !== 'object' && typeof obj.length === 'number')
        return obj.length;

      if (typeof obj === 'object')
        return Object.keys(obj).length;
    },

    ByteArray: ByteArray,
    ByteArrayWA: ByteArrayWA,

    /**
     * Converts a Latin1 string into a typed array of bytes (Uint8Array).
     */
    bytesFromLatin1: bytesFromLatin1,

    /**
     * Converts a typed array of bytes (Uint8Array) into a Latin1 string.
     */
    latin1FromBytes: latin1FromBytes,

    /**
     * Encodes a JS string into UTF-8.
     */
    utf8FromString: function(string) {
      return unescape(encodeURIComponent(string));
    },

    /**
     * Decodes a UTF-8 message into a JS string.
     */
    stringFromUtf8: function(string) {
      return decodeURIComponent(escape(string));
    },

    /**
     * Converts a string with a hex representation of binary data into a
     * typed array (Uint8Array).
     */
    bytesFromHex: function(hexrepr) {
      hexrepr = hexrepr.toLowerCase().replace(/[^0-9a-f]/g, '');
      var byte, array = new Uint8Array(hexrepr.length / 2);
      for (var i = 0, l = array.length; i < l; i++) {
        byte = hexrepr.substr(2 * i, 2);
        array[i] = parseInt(byte, 16);
      }
      return array;
    },

    /**
     * Converts an Uint8Array or ArrayBuffer or ByteArray into a hex
     * representation of the same data.
     */
    hex: hex,

    /**
     * Converts a base64 string into a blob of the given mimeType.
     */
    aToBlob: function(base64, mimeType) {
      var latin1 = atob(base64);
      return utils.latin1ToBlob(latin1, mimeType);
    },

    /**
     * Converts a base64 string into a blob of the given mimeType.
     */
    latin1ToBlob: function(latin1, mimeType) {
      return new Blob([utils.bytesFromLatin1(latin1)], {type: mimeType});
    },

    random: function _random(min, max) {
      return Math.random() * (max - min) + min;
    },

    formatStr: function _formatStr(template, params) {
      if (typeof(params) != 'object') {
        logger.warn('`params` parameter is not an object');
        return template;
      }
      var param;
      for (param in params) {
        template = template.replace('{' + param + '}', params[param], 'g');
      }
      return template;
    }
  };

  return utils;
}()));

CoSeMe.namespace('protocol.emitters', (function(){
  'use strict';

  function XML(tree) {
    this._tree = tree;
  }

  XML.prototype.getRepresentation = function() {
    var tree = this._tree;

    // Begin of the opening tag
    var repr = '<' + tree.tag;

    // Attributes
    var attributes = tree.attributes;
    if (typeof attributes === 'object') {
      for (var name in attributes) if (attributes.hasOwnProperty(name)) {
        repr += (' ' + name + '="' + tree.getAttributeValue(name) + '"');
      }
    }

    // End of the opening tag
    repr += '>\n';

    // Data
    var data = tree.data;
    if (data) {
      repr += data;
    }

    // Children
    var children = tree.children;
    if (Array.isArray(children)) {
      for (var i = 0, l = children.length; i < l; i++) {
        repr += children[i].toString();
      }
    }

    // Closing tag
    repr += '</' + tree.tag + '>\n';

    return repr;
  };

  return XML;
}()));

CoSeMe.namespace('protocol', (function(){
  'use strict';

  var XMLEmitter = CoSeMe.protocol.emitters.XML;

  function Tree(tag, options) {
    options = options || {};
    this.tag = tag;
    this.children = options.children || [];
    this.attributes = options.attributes || {};
    this._data = options.data || null;
  }

  Tree.tagEquals = function(tree, name) {
    return tree.tag === name;
  };

  Tree.require = function(tree, name) {
    if (!Tree.tagEquals(tree, name))
      throw new Error('Failed require. name: ' + name);
  };

  Tree.prototype.toString = function() {
    var emitter = new XMLEmitter(this);
    return emitter.getRepresentation();
  };

  Tree.prototype.getChild = function(identifier) {
    var found, child = null;
    var children = this.children;
    if (children && children.length > 0) {

      if (typeof identifier === 'number' && identifier < children.length) {
        child = children[identifier];
      }
      else if (typeof identifier === 'string') {
        for (var i = 0, l = children.length; i < l && !child; i++) {
          if (children[i].tag === identifier) {
            child = children[i];
          }
        }
      }
    }
    return child;
  };

  Object.defineProperty(Tree.prototype, "data", {
    get: function() {
      var value = this._data;
      if (value && value.hexdata) {
        value = CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Hex.parse(value.hexdata));
      };
      return value;
    },
    set: function(data) {
      this._data = data;
    }
  });

  Object.defineProperty(Tree.prototype, "hexData", {
    get: function() {
      return this._data && this._data.hexdata;
    }
  });

  Tree.prototype.getAttributeValue = function(attributeName, getHex) {
    if (!this.attributes)
      return null;

    var value = this.attributes[attributeName];
    if (value && value.hexdata) {
      value = getHex ? value.hexdata :
                       CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Hex.parse(value.hexdata));
    };

    return typeof value !== 'undefined' ? value : null;
  };

  Tree.prototype.getAllChildren = function(tag) {
    var all = typeof tag !== 'undefined';
    var filteredChildren = this.children.filter(function(child) {
      return all || child.tag === tag;
    });
    return filteredChildren;
  };

  return Tree;
}()));

CoSeMe.namespace('protocol.dictionary', (function(){
  'use strict';

  var code2Token = [
    , , , , , "account", "ack", "action", "active", "add","after", "ib", "all",
    "allow", "apple", "audio", "auth", "author", "available", "bad-protocol",
    "bad-request", "before", "Bell.caf", "body", "Boing.caf", "cancel",
    "category", "challenge", "chat", "clean", "code", "composing", "config",
    "conflict", "contacts", "count", "create", "creation", "default", "delay",
    "delete", "delivered", "deny", "digest", "DIGEST-MD5-1", "DIGEST-MD5-2",
    "dirty", "elapsed", "broadcast", "enable", "encoding", "duplicate",
    "error", "event", "expiration", "expired", "fail", "failure", "false",
    "favorites", "feature", "features", "field", "first", "free", "from",
    "g.us", "get", "Glass.caf", "google", "group", "groups", "g_notify",
    "g_sound", "Harp.caf", "http://etherx.jabber.org/streams",
    "http://jabber.org/protocol/chatstates", "id", "image", "img", "inactive",
    "index", "internal-server-error", "invalid-mechanism", "ip", "iq", "item",
    "item-not-found", "user-not-found", "jabber:iq:last", "jabber:iq:privacy",
    "jabber:x:delay", "jabber:x:event", "jid", "jid-malformed", "kind", "last",
    "latitude", "lc", "leave", "leave-all", "lg", "list", "location",
    "longitude", "max", "max_groups", "max_participants", "max_subject",
    "mechanism", "media", "message", "message_acks", "method", "microsoft",
    "missing", "modify", "mute", "name", "nokia", "none", "not-acceptable",
    "not-allowed", "not-authorized", "notification", "notify", "off", "offline",
    "order", "owner", "owning", "paid", "participant", "participants",
    "participating", "password", "paused", "picture", "pin", "ping", "platform",
    "pop_mean_time", "pop_plus_minus", "port", "presence", "preview", "probe",
    "proceed", "prop", "props", "p_o", "p_t", "query", "raw", "reason",
    "receipt", "receipt_acks", "received", "registration", "relay",
    "remote-server-timeout", "remove", "Replaced by new connection", "request",
    "required", "resource", "resource-constraint", "response", "result",
    "retry", "rim", "s.whatsapp.net", "s.us", "seconds", "server",
    "server-error", "service-unavailable", "set", "show", "sid", "silent",
    "sound", "stamp", "unsubscribe", "stat", "status", "stream:error",
    "stream:features", "subject", "subscribe", "success", "sync",
    "system-shutdown", "s_o", "s_t", "t", "text", "timeout","TimePassing.caf",
    "timestamp", "to", "Tri-tone.caf", "true", "type", "unavailable", "uri",
    "url", "urn:ietf:params:xml:ns:xmpp-sasl",
    "urn:ietf:params:xml:ns:xmpp-stanzas",
    "urn:ietf:params:xml:ns:xmpp-streams", "urn:xmpp:delay", "urn:xmpp:ping",
    "urn:xmpp:receipts", "urn:xmpp:whatsapp", "urn:xmpp:whatsapp:account",
    "urn:xmpp:whatsapp:dirty", "urn:xmpp:whatsapp:mms",
    "urn:xmpp:whatsapp:push", "user", "username", "value", "vcard","version",
    "video", "w", "w:g", "w:p", "w:p:r", "w:profile:picture", "wait", "x",
    "xml-not-well-formed", "xmlns", "xmlns:stream", "Xylophone.caf", "1",
    "WAUTH-1"
  ];

  var token2Code = {};
  for (var i = code2Token.length - 1; i >= 0; i--) {
    token2Code[code2Token[i]] = i;
  }

  var STREAM_START = 1;

  var SHORT_LIST_MARK = 248;
  var LONG_LIST_MARK  = 249;
  var EMPTY_LIST_MARK =   0;

  var SURROGATE_MARK = 254;

  var SHORT_STRING_MARK = 252;
  var LONG_STRING_MARK  = 253;

  var JID_MARK = 250;

  var MAC_LENGTH = 4;

  var HEADER_LENGTH = 3;

  return {
    get code2Token() { return code2Token; },
    get token2Code() { return token2Code; },

    get STREAM_START() { return STREAM_START; },

    get SHORT_LIST_MARK() { return SHORT_LIST_MARK; },
    get LONG_LIST_MARK() { return LONG_LIST_MARK; },
    get EMPTY_LIST_MARK() { return EMPTY_LIST_MARK; },

    get SURROGATE_MARK() { return SURROGATE_MARK; },

    get SHORT_STRING_MARK() { return SHORT_STRING_MARK; },
    get LONG_STRING_MARK() { return LONG_STRING_MARK; },

    get JID_MARK() { return JID_MARK; },

    get MAC_LENGTH() { return MAC_LENGTH; },

    get HEADER_LENGTH() { return HEADER_LENGTH; }
  };
}()));

CoSeMe.namespace('protocol', (function(){
  'use strict';

  var k = CoSeMe.protocol.dictionary; // protocol constants
  var token2Code = k.token2Code;
  var ByteArray = CoSeMe.utils.ByteArrayWA;
  var logger = new CoSeMe.common.Logger('BinaryWriter');

  var IS_COUNTING = true;
  var IS_RAW = true;

  /**
   * The binary writer sends via TCPSocket the required data avoiding
   * unnecessary copies. To accomplish this purpose, as the size is not known
   * before codifying the tree, the algorithm preprocess the tree by calculating
   * the necessary space only, then repeat the processing to effectively write
   * the data.
   */
  function BinaryWriter(connection) {
    this._socket = connection.socket; // an opened socket in binary mode
    this.outputKey = undefined;
  }

  var STREAM_START = k.STREAM_START;

  /**
   * Sends the start of the protocol.
   */
  BinaryWriter.prototype.streamStart = function(domain, resource, callback) {
    var writerTask = this.newWriteTask(callback);
    setTimeout(function() {
      writerTask._sendProtocol(IS_COUNTING);
      writerTask._sendProtocol();

      writerTask._streamStart(domain, resource, IS_COUNTING);
      writerTask._streamStart(domain, resource);
    });
  };

  BinaryWriter.prototype._sendProtocol = function(counting) {
    // Protocol marks
    var streamAttributesCount = 2; // no attributes

    this.resetBuffer(counting, IS_RAW);
    this.writeASCII('WA', counting);
    this.writeByte(STREAM_START, counting);
    this.writeByte(streamAttributesCount, counting);
    this.flushBuffer(counting);
  }

  BinaryWriter.prototype._streamStart = function(domain, resource, counting) {
    var attributes = {to: domain, resource: resource};

    this.resetBuffer(counting);
    this.writeListStart(1 + 2 * CoSeMe.utils.len(attributes), counting);
    this.writeInt8(1, counting);
    this.writeAttributes(attributes, undefined, counting);
    this.sendMessage(counting);
  }

  /**
   * Spawn a new BinaryWriter in charge of sending the tree via socket.
   */
  BinaryWriter.prototype.write = function(tree, callback) {
    var writerTask = this.newWriteTask(callback);
    setTimeout(function() {
      writerTask._write(tree, IS_COUNTING);
      writerTask._write(tree);
    });
  };

  /*
   * Creates a new BinaryWriter object proxying the current one. This new
   * object can not spawn new write tasks.
   */
  BinaryWriter.prototype.newWriteTask = function(callback) {
    var task = Object.create(this);
    task.newWriteTask = undefined;
    task._callback = callback;
    return task;
  };

  BinaryWriter.prototype._write = function(tree, counting) {
    this.resetBuffer(counting);
    if (!tree) {
      this.writeInt8(0, counting);
    }
    else {
      this.writeTree(tree, counting);
      !counting && logger.log(tree.toString());
    }
    this.sendMessage(counting);
  }

  /**
   * Encode the tree in binary format and put it in the output buffer.
   */
  BinaryWriter.prototype.writeTree = function(tree, counting) {
    var length = 1 + (2 * CoSeMe.utils.len(tree.attributes));
    if (tree.children.length > 0) length++;
    if (tree.data !== null) length++;

    // Tree header and tag
    this.writeListStart(length, counting);
    this.writeString(tree.tag, counting);

    // Attributes
    this.writeAttributes(tree.attributes, tree, counting);

    // Data
    if (tree.data) {
      this.writeBytes(tree.data, counting);
    }

    // Children
    var childrenCount = tree.children.length;
    if (childrenCount !== 0) {
      this.writeListStart(childrenCount, counting);
      for (var i = 0; i < childrenCount; i++) {
        this.writeTree(tree.children[i], counting);
      }
    }
  };

  var SHORT_LIST_MARK = k.SHORT_LIST_MARK;
  var LONG_LIST_MARK  = k.LONG_LIST_MARK;
  var EMPTY_LIST_MARK = k.EMPTY_LIST_MARK;

  /**
   * Writes an attributes header in the output buffer.
   */
  BinaryWriter.prototype.writeListStart = function(length, counting) {
    if (length === 0) {
      counting ? this.messageLength++ : this.message.write(EMPTY_LIST_MARK);
    }
    else if (length < 256) {
      counting ? this.messageLength++ : this.message.write(SHORT_LIST_MARK);
      this.writeInt8(length, counting);
    }
    else {
      counting ? this.messageLength++ : this.message.write(LONG_LIST_MARK);
      this.writeInt16(length, counting);
    }
    return this;
  };

  /**
   * Writes an attribute object in the output buffer.
   */
  BinaryWriter.prototype.writeAttributes = function(attrs, tree, counting) {
    var attributes = attrs || {};
    var value;
    for (var attrName in attributes) if (attributes.hasOwnProperty(attrName)) {
      value = tree ? tree.getAttributeValue(attrName) : attributes[attrName];
      this.writeString(attrName, counting);
      this.writeString(value, counting);
    }
    return this;
  };

  /**
   * Wrapper to encode both tokens and JID (Jabber ID).
   */
  BinaryWriter.prototype.writeString = function(string, counting) {
    if (typeof string !== 'string') {
      logger.warn('Expecting a string!', typeof string, 'given instead.');
      if (string === null || string === undefined) {
        string = '';
      } else {
        string = string.toString();
      }
    }

    if (token2Code.hasOwnProperty(string)) {
      this.writeToken(token2Code[string], counting);
    } else {
      if (string.indexOf('@') < 1) {
        this.writeBytes(string, counting);
      }
      else {
        var userAndServer = string.split('@');
        var user = userAndServer[0];
        var server = userAndServer[1];
        this.writeJid(user, server, counting);
      }
    }
    return this;
  };

  var SURROGATE_MARK = k.SURROGATE_MARK;

  /**
   * Writes a string token in an efficent encoding derived from a dictionary.
   */
  BinaryWriter.prototype.writeToken = function(code, counting) {
    if (code < 245) {
      counting ? this.messageLength++ : this.message.write(code);
    }
    else if (code <= 500) {
      counting ? this.messageLength++ : this.message.write(SURROGATE_MARK);
      counting ? this.messageLength++ : this.message.write(code - 245);
    }
    return this;
  };

  var SHORT_STRING_MARK = k.SHORT_STRING_MARK;
  var LONG_STRING_MARK  = k.LONG_STRING_MARK;

  /**
   * Writes a string token in an efficent encoding derived from a dictionary.
   */
  BinaryWriter.prototype.writeBytes = function(string, counting) {
    var bytes = CoSeMe.utils.bytesFromLatin1(string);

    var l = bytes.length;

    if (l < 256) {
      counting ? this.messageLength++ : this.message.write(SHORT_STRING_MARK);
      this.writeInt8(l, counting);
    }
    else {
      counting ? this.messageLength++ : this.message.write(LONG_STRING_MARK);
      this.writeInt24(l, counting);
    }

    for (var i = 0; i < l; i++) {
      counting ? this.messageLength++ : this.message.write(bytes[i]);
    }
    return this;
  };

  var JID_MARK = k.JID_MARK;

  /**
   * Writes the JID in the output buffer.
   */
  BinaryWriter.prototype.writeJid = function(user, server, counting) {
    counting ? this.messageLength++ : this.message.write(JID_MARK);
    if (user) {
      this.writeString(user, counting);
    } else {
      this.writeToken(0, counting);
    }
    this.writeString(server, counting);
    return this;
  };

  /**
   * Writes the ASCII values for each character of the given input.
   */
  BinaryWriter.prototype.writeASCII = function(input, counting) {
    var character;
    for (var i = 0, l = input.length; i < l; i++) {
      character = input.charCodeAt(i);
      this.writeByte(character, counting);
    }
    return this;
  };

  /**
   * An alias for writeInt8.
   */
  BinaryWriter.prototype.writeByte = function(i, counting) {
    this.writeInt8(i, counting)
    return this;
  };

  /**
   * Writes a 8-bit integer into the output buffer.
   */
  BinaryWriter.prototype.writeInt8 = function(i, counting) {
    counting ? this.messageLength++ : this.message.write(i & 0xFF);
    return this;
  };

  /**
   * Writes a 16-bit integer into the output buffer.
   */
  BinaryWriter.prototype.writeInt16 = function(i, counting) {
    counting ? this.messageLength++ : this.message.write((i & 0xFF00) >>> 8);
    counting ? this.messageLength++ : this.message.write((i & 0x00FF));
    return this;
  };

  /**
   * Writes a 24-bit integer into the output buffer.
   */
  BinaryWriter.prototype.writeInt24 = function(i, counting) {
    counting ? this.messageLength++ : this.message.write((i & 0xFF0000) >>> 16);
    counting ? this.messageLength++ : this.message.write((i & 0x00FF00) >>>  8);
    counting ? this.messageLength++ : this.message.write((i & 0x0000FF));
    return this;
  };

  /**
   * Sends the message in the output buffer.
   */
  BinaryWriter.prototype.sendMessage = function(counting) {
    if (counting) { return; }

    if (this.isEncrypted()) {
      this.cipherMessage();
    }
    this.addMessageHeader();
    this.flushBuffer(counting);
  };

  /**
   * Consumes all the data in the output buffer sending them via the socket.
   */
  BinaryWriter.prototype.flushBuffer = function(counting) {
    if (counting) { return; }

    try {
      // This includes the header and trailing paddings.
      var out, offset, realOutLength;

      if (this.isRaw) {
        out = this.message.finish().buffer;
        offset = 0;
        realOutLength = this.messageLength;
      }
      else {
        var completeView = new Uint32Array(this.outBuffer);
        var completeViewLength = completeView.buffer.byteLength;
        out = new ByteArray(completeView, completeViewLength).finish().buffer;

        offset = HEADER_PADDING;
        realOutLength = HEADER_LENGTH + this.messageLength;
      }

      // TODO: For Firefox OS >= v1.2, check:
      // https://bugzilla.mozilla.org/show_bug.cgi?id=939116
      // If not solved, uncomment the following solution and remove as soon as
      // the bug is solved as it introduces an unnecessary copy.
      /*var bytes = new Uint8Array(realOutLength);
      for (var i = offset; i < offset + realOutLength; i++) {
        bytes[i - offset] = out[i];
      }
      offset = 0;
      out = bytes;*/

      // With these offset and length we omit the header and trailing paddings.
      this._socket.send(out.buffer, offset, realOutLength);
      if (typeof this._callback === 'function') {
        this._callback(null, realOutLength);
      }
    } catch (x) {
      var socketState = this._socket.readyState;
      logger.error('Error writing. Socket state:', socketState);
      if (typeof this._callback === 'function') {
        this._callback(socketState === 'closed' ? 'disconnected' : x);
      }
    }
  };

  var HEADER_LENGTH = k.HEADER_LENGTH;
  var HEADER_PADDING = 4 - (HEADER_LENGTH % 4);
  var COMPLETE_HEADER_LENGTH = HEADER_LENGTH + HEADER_PADDING;

  var MAC_LENGTH = k.MAC_LENGTH;

  /**
   * If not counting, allocate an outgoing buffer for the message.
   * If only counting, reset the outgoing length to 0.
   *
   * If isRaw parameter is set to true, no header, mac nor cyphering size
   * considerations will be taken into account. Now is used to send the
   * `streamStart`.
   */
  BinaryWriter.prototype.resetBuffer = function(counting, isRaw) {
    if (counting) {
      this.messageLength = 0;
    }
    else {
      // If encrypted, it is needed to allocate extra space for the mac.
      this.isRaw = isRaw;

      // No headers, no mac, no cyphering
      if (isRaw) {
        this.message = new ByteArray(this.messageLength);
      }

      // Headers + mac + cyphering
      else {
        var macLength = this.isEncrypted() ? MAC_LENGTH : 0;
        this.messageLength += macLength;
        this.messagePadding = 4 - (this.messageLength % 4);
        this.completeMessageLength = this.messageLength + this.messagePadding;

        var totalSize = COMPLETE_HEADER_LENGTH + this.completeMessageLength;
        this.outBuffer = new Uint8Array(totalSize).buffer;

        var headerView =
          new Uint32Array(this.outBuffer, 0, COMPLETE_HEADER_LENGTH >>> 2);
        var messageView =
          new Uint32Array(this.outBuffer, COMPLETE_HEADER_LENGTH);

        this.header = new ByteArray(headerView);
        this.message = new ByteArray(messageView);
      }
    }
  };

  /**
   * Ciphers the message and signs it. Ciphering occurs IN-PLACE.
   */
  BinaryWriter.prototype.cipherMessage = function() {
    var textAndMac = this.outputKey.encodeMessage(this.message);
    for (var i = 0; i < MAC_LENGTH; i++) {
      this.message.write(textAndMac.hmacSHA1.get(i));
    }
  };

  /**
   * Adds the header of the message and encrypt the output buffer.
   */
  BinaryWriter.prototype.addMessageHeader = function() {
    // Write padding
    for (var i = 0; i < HEADER_PADDING; i++) {
      this.header.write(0);
    }

    var messageLength = this.messageLength;
    var encryptedFlag = this.isEncrypted() ? 0x10 : 0x00;
    var b2 = encryptedFlag | ((messageLength & 0xFF0000) >>> 16);
    var b1 = (messageLength & 0xFF00) >>> 8;
    var b0 = (messageLength & 0x00FF);

    this.header.write(b2);
    this.header.write(b1);
    this.header.write(b0);
  };

  /**
   * Returns true if the RC4 key is set.
   */
  BinaryWriter.prototype.isEncrypted = function() {
    return !!this.outputKey;
  };

  return BinaryWriter;
}()));
CoSeMe.namespace('protocol', (function(){
  'use strict';

  var k = CoSeMe.protocol.dictionary; // protocol constants
  var code2Token = k.code2Token;
  var ByteArray = CoSeMe.utils.ByteArrayWA;
  var Tree = CoSeMe.protocol.Tree;
  var logger = new CoSeMe.common.Logger('BinaryReader');

  /**
   * Deserialize protocol data. Public functions accepts data as array
   * buffers (i.e received from a TCPSocket ondata() event) and return
   * undefined if there is not enough data to parse something.
   */
  function BinaryReader() {
    this.incoming = [];
    this.incomingCount = 0;
    this.incomingOffset = { chunk: 0, byte: 0 };
    this.partialConsumed = 0;

    this.inputKey = null;
  }

  var STREAM_START = k.STREAM_START;

  /**
   * Receives a connection and start to capture data on the connection calling
   * onStreamStart(err) when the start of the stream is received or
   * onTree(err, tree) when receiving a tree.
   */
  BinaryReader.prototype.startListening = function(connection) {
    this.socket = connection.socket;
    this.isStreamStartRead = false;
    this.paused = false;

    var self = this;
    this.socket.ondata = function(evt) {
     self.onSocketData(evt.data);
    };
  };

  BinaryReader.prototype.pendingTrees = [];

  /**
   * Suspend receiving data and calling onStreamStart and onTree callbacks.
   * Call it before switching from one handler to another.
   */
  BinaryReader.prototype.suspend = function() {
    if (this.paused) return;
    this.socket.suspend(); //TODO: Consider the option of not suspend the socket
    this.paused = true;
  };

  /**
   * Resume receiving data and calling onStreamStart and onTree callbacks.
   * Call it after switching from one handler to another.
   */
  BinaryReader.prototype.resume = function() {
    if (!this.paused) return;
    this.socket.resume();
    this.paused = false;
    this.attendPendingTrees();
  };

  /**
   * Adds the new data to the current chunks and try for parsing a tree.
   */
  BinaryReader.prototype.onSocketData = function(rawData) {
    logger.log('Received socket data:', rawData.byteLength, 'bytes!')
    rawData && this.addDataChunk(rawData);
    setTimeout(this.checkForAnotherTree.bind(this));
  };

  /**
   * Check if there is enought available data to parse another tree. If so,
   * consumes the message and reprogram itself to continue checking if there
   * are more trees.
   */
  BinaryReader.prototype.checkForAnotherTree = function() {
    if (this.waitingForMessage()) return;

    if (!this.isStreamStartRead) {
      this.readStreamStart();
      this.isStreamStartRead = true;
    } else {
      this.readNextTree();
    }

    setTimeout(this.checkForAnotherTree.bind(this));
  }

  /**
   * Enqueue a task to read the start of the stream, then call to
   * onStreamStart() callback.
   */
  BinaryReader.prototype.readStreamStart = function() {
    var readerTask = this.newReaderTask();
    setTimeout(function() {
      readerTask._readStreamStart();
    });
  };

  /**
   * Enqueue a task to read a tree, then call to onTree() callback.
   */
  BinaryReader.prototype.readNextTree = function() {
    var readerTask = this.newReaderTask();
    setTimeout(function() {
      readerTask._readNextTree();
    });
  };

  /**
   * Creates a task as a specialization of the main BinaryReader unable to spawn
   * new taskes with the mission of read a given tree.
   */
  BinaryReader.prototype.newReaderTask = function() {
    var task = Object.create(this);

    this.readStanza();
    task.startListening = undefined;
    task.suspend = undefined;
    task.resume = undefined;
    task.newReaderTask = undefined;

    task.mac = this.mac;
    task.message = this.message;
    task.stanzaSize = this.stanzaSize;
    task.isEncrypted = this.isEncrypted;
    this.finishReading();

    return task;
  };

  var IS_STREAM_START = true;

  /**
   * Parses the start of the protocol. If all goes well, call onStreamStart()
   * with null as error. It can return an Error with 'Expecting STREAM_START'
   * if the start of the stream is not correctly parsed.
   */
  BinaryReader.prototype._readStreamStart = function() {
    var listMark = this.message.read();
    var listSize = this.readListSize(listMark);
    var tag = this.message.read();
    var err = null;
    if (tag === STREAM_START) {
      var attributeCount = (listSize - 2 + listSize % 2) / 2;
      this.readAttributes(attributeCount);

    // Bad stanza
    } else {
      err = new Error('Expecting STREAM_START');
      logger.error(err);
    }

    this.dispatchResult(err, IS_STREAM_START, 'onStreamStart');
  };

  /**
   * Parses a tree and calls onTree(err, tree) with null as error and the
   * parsed tree if all goes well or with err set to a SyntaxError if not.
   */
  BinaryReader.prototype._readNextTree = function() {
    var err = null, tree;
    try {
      tree = this.readTree();
      logger.log(tree.toString());

    // Catch malformed tree errors
    } catch (e) {
      err = e;
      tree = undefined;

      logger.error(e);
    }

    this.dispatchResult(err, tree, 'onTree');
  };

  /**
   * Enqueue the task of calling the callback `callbackName` with `err` and
   * `tree` as parameters once the queue is attended.
   */
  BinaryReader.prototype.dispatchResult = function(err, tree, callbackName) {
    this.pendingTrees.push([err, tree, callbackName]);
    if (!this.paused) {
      this.attendPendingTrees();
    }
  };

  /**
   * Attend all pending trees by calling to the proper callback.
   * Tree dispatching occurs in the same order than they were received.
   */
  BinaryReader.prototype.attendPendingTrees = function() {
    var args, err, tree, callbackName;
    while (args = this.pendingTrees.shift()) {

      err = args[0];
      tree = args[1];
      callbackName = args[2];

      setTimeout((function _processTree(callbackName, err, tree) {
        var method = this[callbackName];
        if (typeof method === 'function') {
          method(err, tree);
        }
      }).bind(this, callbackName, err, tree));
    }
  };

  /**
   * Frees unneeded memory and reset the BinaryReader state.
   */
  BinaryReader.prototype.finishReading = function() {
    this.freeIncoming();

    this.mac = null;
    this.message = null;

    this.isEncrypted = undefined;
    this.stanzaSize = undefined;
  };

  /**
   * Frees already consumed chunks of incoming data and adjust incomin metadata
   * such as the current incoming offset and incoming size.
   */
  BinaryReader.prototype.freeIncoming = function() {
    var currentChunk, releasedBytes = 0;
    var offset = this.incomingOffset;
    var chunkIndex = offset.chunk;

    // Frees complete chunks (all except the last)
    for (var i = 0; i < chunkIndex; i++) {
      currentChunk = this.incoming.shift();
      releasedBytes += currentChunk.length;
    }

    // Frees the partial chunk
    releasedBytes += (offset.byte - this.partialConsumed);
    this.partialConsumed = offset.byte;

    // Fixes incoming metadata
    offset.chunk = 0;
    this.incomingCount -= releasedBytes;
  }

  /**
   * Adds a new chunk of bytes to the incoming buffer.
   */
  BinaryReader.prototype.addDataChunk = function(rawData) {
    var data = new Uint8Array(rawData);
    this.incoming[this.incoming.length] = data;
    this.incomingCount += data.length;
  };

  var HEADER_LENGTH = k.HEADER_LENGTH;

  /**
   * Return true if the reader is waiting for completing the incoming buffer.
   */
  BinaryReader.prototype.waitingForMessage = function() {

    // No stanza size set? Try parsing header.
    if (this.stanzaSize === undefined) {

      // Not enough bytes for the header? Continue waiting.
      if (this.incomingCount < HEADER_LENGTH) {
        return true;
      }

      // Determine stanza size.
      else {
        var b2 = this.readIncoming(); // for flags only
        var b1 = this.readIncoming();
        var b0 = this.readIncoming();
        this.stanzaSize = (b1 << 8) + b0;
        this.isEncrypted = !!(b2 & 0x80);
      }

    }

    // Waiting if there are not enough bytes to parse yet.
    return this.incomingCount < (HEADER_LENGTH + this.stanzaSize);
  };

  /**
   * Consumes a byte from the incoming chunk list.
   */
  BinaryReader.prototype.readIncoming = function() {
    // Get the byte
    var offset = this.incomingOffset;
    var byteIndex = offset.byte;
    var chunkIndex = offset.chunk;
    var currentChunk = this.incoming[chunkIndex];
    var byte = currentChunk[byteIndex];

    // Advance offset
    byteIndex++;
    if (byteIndex === currentChunk.length) {

      // Before changing to the next chunk. Check if there is partially
      // consumed data here. If so, adjust the chunk so freeIncoming()
      // behaves properly.
      if (this.partialConsumed) {
        this.incoming[chunkIndex] =
          new Uint8Array(
            this.incoming[chunkIndex].buffer, this.partialConsumed);
      }

      chunkIndex++;
      byteIndex = 0;
      this.partialConsumed = 0;
    }
    offset.byte = byteIndex;
    offset.chunk = chunkIndex;

    return byte;
  };

  /**
   * Reads the XML stanza (the message) from the incoming buffer and
   * fills the message buffer and the mac with the decrypted version.
   */
  BinaryReader.prototype.readStanza = function() {
    this.fillMessageBuffer();

    var isEncrypted = this.isEncrypted;
    if (isEncrypted && !this.inputKey)
      throw new Error('The messages are ciphered but there is no key to ' +
                      'decipher.');

    if (isEncrypted)
      this.decipherMessage();
  };

  var MAC_LENGTH = k.MAC_LENGTH;

  /**
   * Fills the message buffer from the incoming buffer.
   */
  BinaryReader.prototype.fillMessageBuffer = function() {

    var messageLength = this.stanzaSize;

    if (this.isEncrypted) {
      messageLength -= MAC_LENGTH;

      this.mac = new ByteArray(MAC_LENGTH);
      for (var i = 0; i < MAC_LENGTH; i++) {
        this.mac.write(this.readIncoming());
      }
    }

    this.message = new ByteArray(messageLength);
    for (var i = 0; i < messageLength; i++) {
      this.message.write(this.readIncoming());
    }
  };

  /**
   * Decipher the message IN-PLCE replacing ciphered text by the
   * deciphered version.
   */
  BinaryReader.prototype.decipherMessage = function() {
    this.message = this.inputKey.decodeMessage(this.message, this.mac);
  };

  /**
   * Parses the tree from the message buffer.
   */
  BinaryReader.prototype.readTree = function() {

    // Read tree structure.
    var listMark = this.message.read();
    var listSize = this.readListSize(listMark);

    var stringMark = this.message.read();
    if (stringMark === 2) {
      return null;
    }

    // Read tag.
    var tag = this.readString(stringMark);
    if (listSize === 0 || tag === null)
      throw new SyntaxError('0 list or null tag!');

    // Read attributes.
    var attributeCount = (listSize - 2 + (listSize % 2)) / 2;
    var attributes = this.readAttributes(attributeCount);

    // No data nor children.
    if (listSize % 2 === 1) {
      return new Tree(tag, { attributes: attributes });
    }

    // Attributes and children but no data.
    var listMarkCandidate = this.message.read();
    if (this.isListMark(listMarkCandidate)) {
      return new Tree(tag, {
        attributes: attributes,
        children: this.readList(listMarkCandidate)
      });
    }

    // Attributes and data but no children.
    stringMark = listMarkCandidate;
    return new Tree(tag, {
      attributes: attributes,
      data: this.readString(stringMark)
    });
  };

  /**
   * Reads a list of child trees from the message buffer.
   */
  BinaryReader.prototype.readList = function(listMark) {
    var listSize = this.readListSize(listMark);
    var children = [];
    for (var i = 0; i < listSize; i++) {
      children.push(this.readTree());
    }
    return children;
  };

  /**
   * Returns true if the byte is one of the list marks.
   */
  BinaryReader.prototype.isListMark = function(b) {
    return (b == SHORT_LIST_MARK) ||
           (b == LONG_LIST_MARK) ||
           (b == EMPTY_LIST_MARK);
  };

  /**
   * Reads a 8-bit integer from the message buffer.
   */
  BinaryReader.prototype.readInt8 = function() {
    return this.message.read();
  };

  /**
   * Reads a 16-bit integer from the message buffer.
   */
  BinaryReader.prototype.readInt16 = function() {
    var b1 = this.message.read();
    var b0 = this.message.read();
    return b1 !== undefined && b0 !== undefined ?
           (b1 << 8) + b0 :
           undefined;
  };

  /**
   * Reads a 24-bit integer from the message buffer.
   */
  BinaryReader.prototype.readInt24 = function() {
    var b2 = this.message.read();
    var b1 = this.message.read();
    var b0 = this.message.read();
    return b2 !== undefined && b1 !== undefined && b0 !== undefined ?
           (b2 << 16) + (b1 << 8) + b0 :
           undefined;
  };

  var SHORT_LIST_MARK = k.SHORT_LIST_MARK;
  var LONG_LIST_MARK  = k.LONG_LIST_MARK;
  var EMPTY_LIST_MARK = k.EMPTY_LIST_MARK;

  /**
   * Parses the size of a list from the message buffer;
   */
  BinaryReader.prototype.readListSize = function(sizeMark) {
    var size;
    switch(sizeMark) {
      case EMPTY_LIST_MARK:
        size = 0;
        break;

      case SHORT_LIST_MARK:
        size = this.readInt8();
        break;

      case LONG_LIST_MARK:
        size = this.readInt16();
        break;

      default:
        var error = 'Invalid list size: sizeMark = ' + sizeMark;
        throw new SyntaxError(error);
        break;
    }

    return size;
  };

  /**
   * Parses a set of tree attributes from the message buffer.
   */
  BinaryReader.prototype.readAttributes = function(attributeCount) {
    var key, value, attributes = {};
    while (attributeCount > 0) {
      key = this.readString(this.message.read());
      value = this.readString(this.message.read());
      attributes[key] = value;
      attributeCount--;
    }
    return attributes;
  };

  var SHORT_STRING_MARK = k.SHORT_STRING_MARK;
  var LONG_STRING_MARK  = k.LONG_STRING_MARK;

  var SURROGATE_MARK = k.SURROGATE_MARK;

  var JID_MARK = k.JID_MARK;

  /**
   * Parses a string from the message buffer.
   */
  BinaryReader.prototype.readString = function(stringMark, returnRaw) {
    var string = null;

    // The string is efficently encoded as a token.
    if (stringMark > 4 && stringMark < 245) {
      var code = stringMark;
      string = this.getToken(code);

    // Short 8-bit length string.
    } else if (stringMark === SHORT_STRING_MARK) {
      var size = this.readInt8();
      var buffer = new Uint8Array(size)
      this.fillArray(buffer, size);
      string = { hexdata: this.bufferToString(buffer) };

    // Long 24-bit length string.
    } else if (stringMark === LONG_STRING_MARK) {
      var size = this.readInt24();
      var buffer = new Uint8Array(size)
      this.fillArray(buffer, size);
      string = { hexdata: this.bufferToString(buffer) };

    // Surrogate mark.
    } else if (stringMark === SURROGATE_MARK) {
      var code = this.message.read();
      string = this.getToken(code + 245);

    // Jabber ID.
    } else if (stringMark === JID_MARK) {
      var user = this.readString(this.message.read(), true);
      var server = this.readString(this.message.read(), true);
      if (user && server) {
        string = user + '@' + server;
      }
      else if (server) {
        string = server;
      }
      else {
        throw new SyntaxError('could not reconstruct JID.');
      }
    } else {
      throw new SyntaxError('could not find a string.');
    }

    if (returnRaw && string && string.hexdata) {
      string = CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Hex.parse(string.hexdata));
    }

    return string;
  };

  /**
   * Get the string representation for the given token code.
   */
  BinaryReader.prototype.getToken = function(code) {
    if (code >= 0 && code < code2Token.length) {
      return code2Token[code];
    }

    throw new SyntaxError('Invalid token: code = ' + code);
  };

  /**
   * Fills the buffer with length bytes from the message buffer.
   */
  BinaryReader.prototype.fillArray = function(buffer, length) {
    for (var i = 0; i < length; i++) {
      buffer[i] = this.message.read();
    }
  };

  /**
   * Converts a byte buffer to a string. Returns it in Hex form
   */
  BinaryReader.prototype.bufferToString = function(buffer) {
    var charArray = [];
    var c;
/*    for (var i = 0, l = buffer.length; i < l; i++) {
      charArray.push(String.fromCharCode(buffer[i]));
    }
*/
    for (var i = 0, l = buffer.length; i < l; i++) {
      c = Number(buffer[i]).toString(16);
      if (buffer[i] < 16)
        c = '0' + c;
      charArray.push(c);
    }

    return charArray.join('');
  };

  return BinaryReader;
}()));
CoSeMe.namespace('http', (function(){
  'use strict';

  var logger = new CoSeMe.common.Logger('http');

  return {
    doRequest: function _doRequest(operation, params, onready, onerror) {

      // Get the URI
      var URL = 'https://v.whatsapp.net/v2/' +
                operation + '?' + CoSeMe.utils.urlencode(params);
      logger.log('Request:', URL);

      // Perform the query
      var xhr = new XMLHttpRequest({mozSystem: true});
      xhr.onload = function() { onready && onready.call(this, this.response); };
      xhr.onerror = onerror;
      xhr.open('GET', URL);
      xhr.overrideMimeType('json');
      xhr.responseType = 'json';
      xhr.setRequestHeader('User-Agent', CoSeMe.config.tokenData['u']);
      xhr.setRequestHeader('Accept', 'text/json');
      xhr.send();
    },

    doContactsRequest: function _doContactsRequest(authField, params, onready, onerror) {
      var xhr = new XMLHttpRequest({mozSystem: true});
      xhr.onload = function() { onready && onready.call(this, this.response); };
      xhr.onerror = onerror;
      if (params) {
        xhr.open(CoSeMe.config.contacts.method, CoSeMe.config.contacts.url_query);
      } else {
        xhr.open(CoSeMe.config.contacts.method, CoSeMe.config.contacts.url_auth);
      }
      xhr.overrideMimeType('json');
      xhr.responseType = 'json';
      xhr.setRequestHeader('User-Agent', CoSeMe.config.tokenData['u']);
      xhr.setRequestHeader('Authorization', authField);
      xhr.setRequestHeader('Accept', 'text/json');
      if (params) {
        var data = CoSeMe.utils.urlencode(params);
        logger.log('Contact request parameters:', data);
        xhr.send(data);
      } else {
        xhr.send();
      }
    }
  };
}()));
CoSeMe.namespace('registration', (function(){
  'use strict';

  // This has come here cause it isn't used anywhere else... and so we only need to create this
  // when we're actually registering
  function getToken(phone) {
    // Ok, most of this code is bullshit since it'll generate the same code
    // everytime, the only variable step is the last one. Still, the
    // registration is something that will be done only once per installation
    // and leaving it this way it should be easier to fix when WA change their
    // registration code again.
    // Just remember to NOT include this file on the general file!

    var classesMd5 = atob("r4WQV17nVTl3+uFlF9mvEg==");
    var prefix = atob("Y29tLndoYXRzYXBw");
    var signature = atob(
      "MIIDMjCCAvCgAwIBAgIETCU2pDALBgcqhkjOOAQDBQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFDASBgNVBAcTC1NhbnRhIENsYXJhMRYwFAYDVQQKEw1XaGF0c0FwcCBJbmMuMRQwEgYDVQQLEwtFbmdpbmVlcmluZzEUMBIGA1UEAxMLQnJpYW4gQWN0b24wHhcNMTAwNjI1MjMwNzE2WhcNNDQwMjE1MjMwNzE2WjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEUMBIGA1UEBxMLU2FudGEgQ2xhcmExFjAUBgNVBAoTDVdoYXRzQXBwIEluYy4xFDASBgNVBAsTC0VuZ2luZWVyaW5nMRQwEgYDVQQDEwtCcmlhbiBBY3RvbjCCAbgwggEsBgcqhkjOOAQBMIIBHwKBgQD9f1OBHXUSKVLfSpwu7OTn9hG3UjzvRADDHj+AtlEmaUVdQCJR+1k9jVj6v8X1ujD2y5tVbNeBO4AdNG/yZmC3a5lQpaSfn+gEexAiwk+7qdf+t8Yb+DtX58aophUPBPuD9tPFHsMCNVQTWhaRMvZ1864rYdcq7/IiAxmd0UgBxwIVAJdgUI8VIwvMspK5gqLrhAvwWBz1AoGBAPfhoIXWmz3ey7yrXDa4V7l5lK+7+jrqgvlXTAs9B4JnUVlXjrrUWU/mcQcQgYC0SRZxI+hMKBYTt88JMozIpuE8FnqLVHyNKOCjrh4rs6Z1kW6jfwv6ITVi8ftiegEkO8yk8b6oUZCJqIPf4VrlnwaSi2ZegHtVJWQBTDv+z0kqA4GFAAKBgQDRGYtLgWh7zyRtQainJfCpiaUbzjJuhMgo4fVWZIvXHaSHBU1t5w//S0lDK2hiqkj8KpMWGywVov9eZxZy37V26dEqr/c2m5qZ0E+ynSu7sqUD7kGx/zeIcGT0H+KAVgkGNQCo5Uc0koLRWYHNtYoIvt5R3X6YZylbPftF/8ayWTALBgcqhkjOOAQDBQADLwAwLAIUAKYCp0d6z4QQdyN74JDfQ2WCyi8CFDUM4CaNB+ceVXdKtOrNTQcc0e+t"
    );
    var k =
      CryptoJS.enc.Base64.parse("PkTwKSZqUfAUyR0rPQ8hYJ0wNsQQ3dW1+3SCnyTXIfEAxxS75FwkDf47wNv/c8pP3p0GXKR6OOQmhyERwx74fw1RYSU10I4r1gyBVDbRJ40pidjM41G1I1oN");

    // And this is the biggest bullshit part... I know it's ugly, but it's easier and faster than reading this from a file.
    var f =
      CoSeMe.utils.bytesFromLatin1(atob(
                                     "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"
      )
    );

    var KEY = CoSeMe.utils.bytesFromLatin1("The piano has been drinking");

    // We xor this file because apparently the final f is copyrighted
    var count = 0;
    var l = f.length;
    for (var i=0; i < l; i++) {
      f[i] = f[i] ^ KEY[count++];
      if (count == KEY.length - 1) {
        count = 0;
      }
    }

    var d = CryptoJS.enc.Latin1.parse(
              prefix + CoSeMe.utils.latin1FromBytes(f)
            );

    var key2 = CryptoJS.PBKDF2(d, k, {
                                 keySize: (80*8) / 32,
                                 iterations: 128
                               }).toString(CryptoJS.enc.UInt8Array);

    var opad = new Uint8Array(64);
    var ipad = new Uint8Array(64);
    for (i = 0; i < 64; i++) {
      opad[i] = 0x5C ^ key2[i];
      ipad[i] = 0x36 ^ key2[i];
    }
    ipad = CryptoJS.enc.UInt8Array.parse(ipad);
    opad = CryptoJS.enc.UInt8Array.parse(opad);

    // And this is why I said this is bullshit. For all practical senses,
    // everything up to this point could just be a nifty constant... So we do a
    // lot of hand wriggling to generate the same value every time. Yay us!
    var data = CryptoJS.enc.Latin1.parse(signature + classesMd5 + phone);

    return CryptoJS.SHA1(opad.concat(CryptoJS.SHA1(ipad.concat(data)))).toString(CryptoJS.enc.Base64);
  }

  function getRealDeviceId(aSeed) {
    var seed = aSeed || (Math.random() * 1e16).toString(36).substring(2,10);
    var id = CryptoJS.SHA1(seed).toString(CryptoJS.enc.Latin1).substring(0,20);
    return {
      seed: seed,
      id: id
    };
  }

  return {
    getCode: function(countryCode, phone, onready, onerror, deviceId) {
      var params = Object.create(null);
      params['cc'] = countryCode;
      params['in'] = phone;
      params['lc'] = 'US';
      params['lg'] = 'en';
      params['mcc'] = '000';
      params['mnc'] = '000';
      params['method'] = 'sms';
      var seedAndId = getRealDeviceId(deviceId);
      params['id'] = seedAndId.id;

      // Get token
      params['token'] = getToken(phone);

      CoSeMe.http.doRequest('code', params, onready, onerror);
      return seedAndId.seed; // Return the deviceId we've used in case we want to store it.
    },

    register: function(countryCode, phone, registerCode, onready, onerror, deviceId) {
      // Set parameters
      var params = Object.create(null);
      params['cc'] = countryCode;
      params['in'] = phone;
      params['code'] = registerCode;
      var seedAndId = getRealDeviceId(deviceId);
      params['id'] = seedAndId.id;

      CoSeMe.http.doRequest('register', params, onready, onerror);
      return seedAndId.id; // Return the deviceId we've used in case we want to store it.
    }
  };
}()));
CoSeMe.namespace('media', (function() {
  'use strict';

  var logger = new CoSeMe.common.Logger('media');

  /**
   * Per Yowsup.
   */
  var MAX_UPLOAD_BODY_ANSWER = 8192*7;

  /**
   * Converts into Latin1 an array of bytes.
   */
  function _latin1(array) {
    //return CryptoJS.enc.Latin1.parse(array).toString();
    var c, latinarray = [];
    for (var i = 0, l = array.length; i < l; i++) {
      c = String.fromCharCode(array[i]);
      latinarray.push(c);
    }
    return latinarray.join('');
  }

  function _str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }

  function download(url, successCb, errorCb, progressCb) {
    var blob = null;
    var xhr = new XMLHttpRequest({mozSystem: true});

    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.setRequestHeader("User-Agent", CoSeMe.config.tokenData.u);

    xhr.onprogress = function(e) {
      logger.log('XHR fired onprogress...');
      if (progressCb) {
        if (e.lengthComputable) {
          var pr = Math.floor((e.loaded/e.total) * 100);
          progressCb(pr);
        }
      }
    };

    xhr.onload = function () {
      logger.log('XHR fired onload. xhr.status:', xhr.status);
      if (xhr.status === 200 || xhr.status === 0) {
        blob = xhr.response;
        if (successCb) {
          successCb(blob);
        }
      } else {
        if (errorCb) {
          errorCb(xhr.status);
        }
      }
    };

    xhr.onerror = function(e) {
      if (errorCb) {
        errorCb(xhr.status);
      }
    };

    xhr.send();
  }

  function upload(toJID, blob, uploadUrl, successCb, errorCb, progressCb) {
    var TCPSocket = navigator.mozTCPSocket;
    if (!TCPSocket) {
      if (errorCb) {
        errorCb('No TCPSocket available.');
      }
      return;
    }

    var url = uploadUrl.replace('https://', '');
    var host = url.slice(0, url.indexOf('/'));
    var port = host.split(':')[1] || 443;

    logger.log('Going to open TCPSocket to host ', host, 'and port', port);

    var _socket;
    try {
      _socket = TCPSocket.open(
        host,
        port,
        {
          binaryType: 'arraybuffer',
          useSSL: true,
          useSecureTransport: true
        }
      );
    } catch(e) {
      logger.error('Media Exception:', e.data);
      if (errorCb) {
        errorCb(e.data);
      }
      return;
    }

    _socket.onerror = function (evt) {
      logger.log('Socket error:', evt.data);
      var err = evt.data;
      var wrappedErr;
      if (err && typeof(err) === 'object') {
        wrappedErr = {
          name: err.name,
          type: err.type,
          message: err.message
        };
      } else {
        wrappedErr = err;
      }

      logger.log('Wrapped error:', wrappedErr);

      if (errorCb) {
        errorCb(wrappedErr);
      }
    };

    _socket.onopen = function () {
      logger.log('Socket.onopen() called');

      var filesize = blob.size;
      var filetype = blob.type;
      logger.log('size:', filesize, 'filetype:', filetype);

      var reader = new FileReader();
      reader.addEventListener("loadend", function() {
        var el = new CryptoJS.lib.WordArray.init(reader.result);
        var crypto = CryptoJS.MD5(el) + "." + filetype.split('/')[1];

        logger.log('base64:', reader.result)
        logger.log('MD5+ext:', crypto);

        onCryptoReady(crypto, reader.result);
      })
      reader.readAsArrayBuffer(blob);

      function onCryptoReady(crypto, blobAsArrayBuffer) {
        var boundary = "zzXXzzYYzzXXzzQQ";
        var contentLength = 0;

        /**
         * Header BAOS
         */
        var hBAOS = "--" + boundary + "\r\n";
        hBAOS += "Content-Disposition: form-data; name=\"to\"\r\n\r\n";
        hBAOS += toJID + "\r\n";
        hBAOS += "--" + boundary + "\r\n";
        hBAOS += "Content-Disposition: form-data; name=\"from\"\r\n\r\n";
        hBAOS += CoSeMe.yowsup.connectionmanager.jid.replace("@whatsapp.net","") + "\r\n";

        hBAOS += "--" + boundary + "\r\n";
        hBAOS += "Content-Disposition: form-data; name=\"file\"; filename=\"" + crypto + "\"\r\n";
        hBAOS += "Content-Type: " + filetype + "\r\n\r\n";

        /**
         * Final BAOS
         */
        var fBAOS = "\r\n--" + boundary + "--\r\n";

        contentLength += hBAOS.length;
        contentLength += fBAOS.length;
        contentLength += blob.size;

        /**
         * Initial data to be sent
         */
        var POST = "POST " + uploadUrl + "\r\n";
        POST += "Content-Type: multipart/form-data; boundary=" + boundary + "\r\n";
        POST += "Host: " + host +  "\r\n";
        POST += "User-Agent: " + CoSeMe.config.tokenData.u + "\r\n";
        POST += "Content-Length: " + contentLength + "\r\n\r\n";

        logger.log('POST:', POST);
        logger.log('hBAOS:', hBAOS);

        /**
         * Send initial data and header BAOS
         */
        logger.log("Sending request...");

        _socket.send(_str2ab(POST));
        _socket.send(_str2ab(hBAOS));

        var totalsent = 0;
        var buf = 1024;
        var status = 0;
        var lastEmit = 0;

        /**
         * Send real file data
         */
        logger.log('Sending the file in chunks of', buf, 'bytes');
        var end;
        while (totalsent < filesize) {
          end = totalsent + buf;
          _socket.send(blobAsArrayBuffer.slice(totalsent, end));
          status = Math.floor(totalsent * 100 / filesize);
          if (lastEmit != status && status != 100 && filesize > 12288) {
            if (progressCb) {
              progressCb(status);
            }
          }
          lastEmit = status;
          blob = blob.slice(1024, blob.size);
          totalsent = totalsent + buf;

          logger.log('Sent', totalsent, 'bytes');
        }
        logger.log('All data sent, going to send final BAOS');

        /**
         * Send final data… and wait for response on _socket.ondata
         */
        _socket.send(_str2ab(fBAOS));
        logger.log('All sent. Have fun with _socket.ondata()!');
      }
    };

    var datalatin1 = '';
    _socket.ondata = function(event) {
      logger.log('Got some data!');

      datalatin1 += _latin1(new Uint8Array(event.data));

      var contentLength = (function() {
        var idx = datalatin1.indexOf('Content-Length: ');
        var doubleRC = datalatin1.indexOf('\r\n\r\n');
        if (idx === -1 || !doubleRC) {
          return 0;
        }
        var a = datalatin1.substring(idx, datalatin1.indexOf('\r\n', idx));
        var b = a.split(':')[1];
        contentLength = parseInt(b, 10);
        logger.log('Content length:', contentLength);
        return contentLength;
      })();

      var body = '';
      if (contentLength) {
        body = (function() {
          var rv = datalatin1.substring(datalatin1.length - contentLength,
                                        datalatin1.length);
          if (rv.length !== contentLength) {
            rv = '';
          }
          return rv;
        })();
      }

       if (datalatin1.length > MAX_UPLOAD_BODY_ANSWER || body) {
        logger.log('Enough data, closing socket and start parsing');

        if (progressCb) {
          progressCb(100);
        }

        var json;
        try {
          json = JSON.parse(body);
        } catch (e) {
          logger.error('Media exception:', e);
          if (errorCb) {
            errorCb('JSON not valid -- ' + e);
            return;
          }
        }

        if (json.url) {
          logger.log('We got an URL on the result:', json.url);
          if (successCb) {
            successCb(json.url);
          }
        } else {
          if (errorCb) {
            errorCb('No URL in result');
          }
        }

      // Let's close the socket and remove the errorCb handler
      errorCb = undefined;
      _socket.close();
      } else {
        logger.log('Not enough data, continue reading from the socket');
      }
    };
  }

  return {
    download: download,
    upload: upload
  };
}()));
CoSeMe.namespace('contacts', (function(){
  'use strict';

  var _username = '';
  var _password = '';
  var _contacts = [];
  var logger = new CoSeMe.common.Logger('contacts');

  function getAuthField(nonce) {
    nonce = nonce || 0;
    var cnonce = Math.floor(
      CoSeMe.utils.random(100000000000000,1000000000000000)).toString(36);
    logger.log('cnonce:', cnonce);

    var credentials =
      CryptoJS.enc.Utf8.parse(
        CoSeMe.utils.formatStr('{username}:s.whatsapp.net:', {
          username: _username
        }));
    credentials.concat(CryptoJS.enc.Base64.parse(_password));
    logger.log('credentials:', credentials.toString());

    var response =
      CryptoJS.MD5(
        CryptoJS.MD5(
          CryptoJS.MD5(credentials).concat(CryptoJS.enc.Utf8.parse(
            CoSeMe.utils.formatStr(':{nonce}:{cnonce}', {
              nonce: nonce,
              cnonce: cnonce
            })))).toString() +
        CoSeMe.utils.formatStr(':{nonce}:{nc}:{cnonce}:auth:', {
          nonce: nonce,
          nc: CoSeMe.config.contacts.authData.nc,
          cnonce: cnonce
        }) +
        CryptoJS.MD5(CoSeMe.utils.formatStr('AUTHENTICATE:{uri}',{
          uri: CoSeMe.config.contacts.authData.digestUri
        })).toString()
      ).toString();
    logger.log('response:', response);

    var authTemplate = '{auth_method}: username="{username}",' +
      'realm="{realm}",nonce="{nonce}",cnonce="{cnonce}",nc="{nc}",' +
      'qop="auth",digest-uri="{digest_uri}",response="{response}",' +
      'charset="utf-8"';

    return CoSeMe.utils.formatStr(authTemplate, {
      auth_method: CoSeMe.config.contacts.authData.authMethod,
      username: _username,
      realm: CoSeMe.config.contacts.authData.realm,
      nonce: nonce,
      cnonce: cnonce,
      nc: CoSeMe.config.contacts.authData.nc,
      digest_uri: CoSeMe.config.contacts.authData.digestUri,
      response: response
    });
  }

  function sendAuthQuery_Phase1(onready, onerror) {
    var authField = getAuthField();
    logger.log('authField = ', authField);
    CoSeMe.http.doContactsRequest(authField, null, onready, onerror);
  }

  function sendAuthQuery_Phase2(nonce, onready, onerror) {
    var authField = getAuthField(nonce);
    logger.log('authField = ', authField);

    var params = [];
    params['ut'] = 'all';
    params['t'] = 'c';
    params['u'] = _contacts;

    CoSeMe.http.doContactsRequest(authField, params, onready, onerror);
  }

  return {
    setCredentials: function(username, password) {
      _username = username;
      _password = password;
    },

    addContacts: function(contacts) {
      if (typeof(contacts) == 'string') {
        _contacts.push(contacts);
      }
      if (!Array.isArray(contacts)) {
        return;
      }
      _contacts = _contacts.concat(contacts);
      logger.log('contacts:', _contacts);
    },

    clearContacts: function() {
      _contacts = [];
    },

    query: function _query(onready, onerror) {
      // Send the query
      sendAuthQuery_Phase1(function onContactsAuth_Phase1(response) {
        logger.log('response:', response);
        if (response.message != 'next token')
          return onerror('Failed phase 1 authentication (no token received)');

        var auth_phase2 = this.getResponseHeader('WWW-Authenticate');
        var nonce = auth_phase2.match(/nonce="(.+)"/);

        logger.log('WWW-Authenticate header:', auth_phase2);
        logger.log('nonce:', nonce);

        if (nonce.length != 2)
          return onerror('Failed phase 1 authentication (no nonce found)');

        sendAuthQuery_Phase2(nonce[1], onready, onerror);
      }, onerror);
    }
  };
}()));
CoSeMe.namespace('connection', (function() {
  'use strict';

  var _connection;

  function Connection() {
    if (!_connection) {
      _connection = Object.create(Connection.prototype);
    }
    return _connection;
  }

  Connection.prototype.connect = function(host, port, options,
                                          onSuccess, onError) {

    var socket = navigator.mozTCPSocket.open(host, port, options);
    socket.onerror = onError;
    socket.onopen = function _connectionSuccess() {
      _connection.socket = socket;
      setErrorHandlers();
      setBinaryStreams();
      onSuccess.apply(this, arguments);
    };
  };

  function setErrorHandlers() {
    _connection.socket.onerror = fire('onconnectionlost');
    _connection.socket.onclose = fire('onconnectionclosed');
  }

  function fire(event) {
    return function() {
      var handler = _connection[event];
      if (typeof handler === 'function') {
        handler.apply(this, arguments);
      }
    };
  }

  function setBinaryStreams() {
    _connection.reader = new CoSeMe.protocol.BinaryReader(_connection);
    _connection.writer = new CoSeMe.protocol.BinaryWriter(_connection);
  }

  return Connection;

}()));
CoSeMe.namespace('time', (function(){
  'use strict';

/* Quite a complicated way to do the same...
    // var d=datetime.datetime(*map(int, re.split('[^\d]', iso)[:-1]))
    var regex = /(?:[\d]+)/g;
    var matched = null;
    var elems = [];
    while (matched = regex.exec(iso)) {
      elems.push(matched[0]);
    }
    elems.pop();
    elems.unshift(null);
    var d = new (Date.bind.apply(Date, elems))();
    return d;
*/
	function parseIso(iso) {
    return new Date(iso);
  }

  function utcToLocal(dt) {
    return dt;
  }


  function utcTimestamp() {
    return Math.floor(Date.now() / 1000);
  }

  function datetimeToTimestamp(dt) {
    return Math.floor(dt.getTime() / 1000);
  }


  return {
    parseIso: parseIso,
    utcToLocal: utcToLocal,
    utcTimestamp: utcTimestamp,
    datetimeToTimestamp: datetimeToTimestamp
  };
}()));
CoSeMe.namespace('auth', (function() {

  'use strict';

  var logger = new CoSeMe.common.Logger('auth');
  var ByteArrayWA = CoSeMe.utils.ByteArrayWA;

  var ATR_EXPIRATION = 'expiration';

  var ATR_KIND = 'kind';
  var KIND_PAID = 'paid';
  var KIND_FREE = 'free';

  var ATR_STATUS = 'status';
  var STATUS_EXPIRED = 'expired';
  var STATUS_ACTIVE = 'active';

  var connection = null;
  var authenticated = false;
  var supportsReceiptAcks = true;
  var expireDate = null;
  var accountKind = null;
  var outputKey;
  var inputKey;
  var userName;
  var password;
  var ProtocolTreeNode = CoSeMe.protocol.Tree;

  function sendFeatures() {
    var tag = 'stream:features';
    var options = {
      children: [
        new ProtocolTreeNode('receipt_acks'),
        new ProtocolTreeNode('w:profile:picture',
                 { attributes: {
                     'type': 'all'
                   }
                 }),
        new ProtocolTreeNode('w:profile:picture',
                 {
                   attributes: {
                     'type': 'group'
                   }
                 }),
        new ProtocolTreeNode('notification',
                 {
                   attributes: {
                     'type': 'participant'
                   }
                 }),
        new ProtocolTreeNode('status')
      ]
    };

    var toWrite = new ProtocolTreeNode(tag, options);
    connection.writer.write(toWrite);
  };

  function sendAuth(aUsr) {
    //'user':self.connection.user, --> connection hasnt usr, should be has it?
    //var blob = [];

    var node = new ProtocolTreeNode('auth', {
                          attributes: {
                            'user': aUsr,
                            'xmlns': 'urn:ietf:params:xml:ns:xmpp-sasl',
                            'mechanism': 'WAUTH-1'
                          },
                          data: '' //''.join(map(chr, blob))); donde blob=[]
                        });
    connection.writer.write(node);
  };

/*
function str2Hex(str) {
    var result = '';
    for (var i = 0; i < str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
}

function hex2Str(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}
*/
  /**
   * @aChallengeData Desafio en Latin1
   */
  function getAuthBlob(aChallengeData, aUsr, aPwd) {
    try {
      var key = CoSeMe.auth.KeyStream.keyFromPasswordAndNonce(aPwd, aChallengeData);
      var key2 = CoSeMe.auth.KeyStream.keyFromPasswordAndNonce(aPwd, aChallengeData);
      connection.reader.inputKey = inputKey = new CoSeMe.auth.KeyStream(key, 'input');
      outputKey = new CoSeMe.auth.KeyStream(key2, 'output');

      var utcNow = CryptoJS.enc.Latin1.parse(Number(CoSeMe.time.utcTimestamp()).toString());
      var msg = CryptoJS.enc.Latin1.parse(aUsr);
      msg.concat(CryptoJS.enc.Hex.parse(aChallengeData));
      msg.concat(utcNow);

      logger.log('Cleartext message: ', msg.toString());
      var encoded = outputKey.encodeMessage(new ByteArrayWA(msg.sigBytes).writeAll(msg));

      var macLength = CoSeMe.config.auth.hmacLength;
      var ba = new ByteArrayWA(macLength + encoded.text.array.sigBytes);
      for (var i = 0; i < macLength; i++) {
        ba.write(encoded.hmacSHA1.get(i));
      }
      return ba.writeAll(encoded.text.array);
    } catch (x) {
      logger.error(x);
      return null;
    }
  };

  /**
   * @aChallengeData Challenge in Hex
   */
  function sendResponse(aChallengeData, aUsr, aPwd) {
    try {
      logger.log('Generating response');
      var authBlob = getAuthBlob(aChallengeData, aUsr, aPwd);
      var node = new ProtocolTreeNode('response',{
        attributes: {
        'xmlns': 'urn:ietf:params:xml:ns:xmpp-sasl'
        },
        data: CryptoJS.enc.Latin1.stringify(authBlob.array)
      });
      connection.writer.write(node);
    } catch (x) {
      logger.error(x);
    }
  }

  function authenticationFailed() {
    logger.log('Auth failed!');
  }

  function authenticationComplete() {
    authenticated = true;
  }

  function readSuccess(node) {
    try {
      logger.log('Login status:', node.tag);
      if (node.tag === 'failure') {
        authenticationFailed();
        return false;
      }
      ProtocolTreeNode.require(node, 'success');

      var expiration = node.getAttributeValue(ATR_EXPIRATION);

      if (!expiration) {
        logger.log('Expires:', expiration);
        expireDate = expiration;
      }
      var kind = node.getAttributeValue(ATR_KIND);
      logger.log('Account type:', kind);
      if (kind === KIND_PAID) {
        accountKind = 1;
      } else if (kind === KIND_FREE) {
        accountKind = 0;
      } else {
        accountKind = -1;
      }
      var status = node.getAttributeValue(ATR_STATUS);
      logger.log('Account status:', status);
      if (status === STATUS_EXPIRED) {
        throw new Error('Account expired on ' + expireDate);
      }
      if (status === STATUS_ACTIVE) {
        if (!expiration) {
          //throw new Error('active account with no expiration');
          //@@TODO expiration changed to creation
        }
      } else {
        accountKind = 1;
      }
      connection.writer.outputKey = outputKey;
      authenticationComplete();
      return true;
    } catch (x) {
      logger.error(x);
      return false;
    }
  }

  function authenticate(aUsr, aPwd, aCallback) {
    function onError(evt) {
      var err = evt.data;
      var wrapperErr;
      if (err && typeof(err) === 'object') {
        wrapperErr = {
          name: err.name,
          type: err.type,
          message: err.message
        };
      } else {
        wrapperErr = err;
      }
      logger.log('Error authenticating:', wrapperErr);
      aCallback(null);
    };

    function login(evt) {
      var step = 0;
      connection.reader.startListening(connection);

      connection.reader.onStreamStart = function(err) {
        if (err) {
          logger.error(err);
          aCallback(null);
        }

        step++;
        logger.log('Got Stream Start!');
      };

      connection.reader.onTree = function(err, tree) {
        if (err) throw err;
        var root, node;

        try {
          switch (step) {
            case 1: // reading features and challenge
              root = tree;
              logger.log('Reading features and challenge... The tree is',
                         root ? 'not null' : 'null');

              if (root === null) {
                var msg = 'Out of loop while reading features and challenge.';
                logger.error(msg);
                throw new Error(msg);
              }

              if (root.tag === 'stream:features') {
                logger.log('Got features!');
                var receipt = root.getChild('receipt_acks');
                if (receipt !== undefined) {
                  supportsReceiptAcks = receipt;
                }

              } else if (root.tag === 'challenge') {
                logger.log('Got challenge!');
                sendResponse(root.hexData, aUsr, aPwd);
                step++;
              }

              break;

            case 2: // reading success
              logger.log('Trying to get the success data...');
              node = tree;
              if (node) {
                var success = readSuccess(node);
                connection.reader.suspend();
                connection.reader.onTree = undefined;
                connection.reader.onStreamStart = undefined;
                connection.jid = aUsr + '@' + CoSeMe.config.auth.domain;
                aCallback(success ? connection : null);
              }

              break;
          }

        } catch (err) {
          logger.error(x);
          aCallback(null);
        }
      };

      try {
        logger.log('Starting stream...');
        connection.writer.streamStart(CoSeMe.config.auth.domain,
                                      CoSeMe.config.tokenData.r);

        logger.log('Sending features...');
        sendFeatures();

        logger.log('Sending auth...');
        sendAuth(aUsr);
      } catch (x) {
        logger.error(x);
        throw x;
      }
    }

    connection = new CoSeMe.connection.Connection();
    var host = CoSeMe.config.auth.host;
    var port = CoSeMe.config.auth.port;
    logger.log('Connecting to:', host + ':' + port);
    connection.connect(host, port, CoSeMe.config.auth.options || {},
                       login, onError);
  }

  return {
    authenticate: authenticate,

    get isAuthenticated() {
      return authenticated;
    }
  };
}()));

CoSeMe.namespace('auth', (function() {
  var logger = new CoSeMe.common.Logger('KeyStream');
  var ByteArrayWA = CoSeMe.utils.ByteArrayWA;

  /**
   * @param aKey is a WordArray
   */
  function KeyStream(aKey, aName) {
    this.name = aName;
    this.key = aKey;
    this.encryptor = CryptoJS.algo.RC4WP.createEncryptor(this.key,
                                                         CoSeMe.config.auth.rc4Options);
  };

  /**
   * @param {WordArray|string} password The password. Base64
   * @param {WordArray|string} salt A salt. Latin1
   * @return {WordArray} The derived key. KeySize=20, Iterations=16.
   */
  KeyStream.keyFromPasswordAndNonce = function(aPwd, aChallengeData) {
    try {
      logger.log('aChallengeData:', aChallengeData);
      logger.log('aPwd:', aPwd);

      var credentials = CryptoJS.enc.Base64.parse(aPwd);
      logger.log('Credentials:', credentials);

      var salt = CryptoJS.enc.Hex.parse(aChallengeData);
      logger.log('salt: ', salt);

      var k = CryptoJS.PBKDF2(credentials, salt, CoSeMe.config.auth.pbkdf2Options);
      logger.log('Key from password and nonce:', k);
      return k;
    } catch (x) {
      logger.error(x);
      return null;
    }
  };

  /**
   * @param aMsg  cypher text, ByteArrayWA
   * @param aHmacSHA1 hmac, ByteArrayWA
   * TODO Error conditions verifications
   * @exception If calculated hmac is different from received hmac
   * @return RC4WP.decrypt(aMsg) INPLACE (so it actually returns cipherTxt)
   */
  KeyStream.prototype.decodeMessage = function(cipherTxt, aHmacSHA1) {

    var cipherData = cipherTxt.array;
    var hmacCal = CryptoJS.HmacSHA1_IP(cipherData, this.key).toString(CryptoJS.enc.Hex);

    var hmacTxt = CryptoJS.enc.Hex.stringify(aHmacSHA1.array);

    if (hmacTxt !== hmacCal.substring(0, hmacTxt.length)) {
      logger.error('INVALID MAC!');
      throw new Error('Invalid MAC');
    }

    var plainTxt = this.encryptor.finalize(cipherData);

    return cipherTxt;
  };

  /**
   * @param aMsg plainText
   * @return {text: RC4WP(msg), hmacSHA1: HmacSHA1(RC4WP(msg)) }
   */
  // aMsg is a ByteArrayWA, since now...
  // Oh, and it modifies it in place! Copies are the suck!
  KeyStream.prototype.encodeMessage = function(aMsg) {

    var cipherwords = aMsg.array;
    // In place encryption! This modifies cipherwords also!
    this.encryptor.finalize(cipherwords);

    // Note! This hash *does* not make a copy of the data!
    // Well, it actually up to the last 64 byte block
    var hash = CryptoJS.HmacSHA1_IP(cipherwords, this.key);

    return {
      text: aMsg,
      hmacSHA1: new ByteArrayWA(hash.sigBytes).writeAll(hash)
    };
  };

  return KeyStream;

}()));
CoSeMe.namespace('yowsup', (function() {
  'use strict';

  var stringFromUtf8 = CoSeMe.utils.stringFromUtf8;
  var utf8FromString = CoSeMe.utils.utf8FromString;

  var logger = new CoSeMe.common.Logger('yowsupAPI');

  function registerListener(aSignal, aListener) {
    // Listeners are actually a list...
    if (aSignal in CoSeMe.yowsup.connectionmanager.signals) {
      CoSeMe.yowsup.connectionmanager.signals[aSignal].push(aListener);
    }
  }

  function call(aMethod, aParams) {
    try {
      return CoSeMe.yowsup.connectionmanager.methods[aMethod].apply(undefined, aParams);
    } catch (x) {
      logger.error('Error invoking', aMethod, 'with', aParams);
      logger.error('Error details:', x);
      throw x;
    }
  }

  function getSignalsInterface() {
    return {
      registerListener: registerListener
    };
  }

  function getMethodsInterface() {
    return {
      call: call,

      // This isn't defined on the doc...
      registerCallback: function(aMethod, aHandler) {
        CoSeMe.yowsup.connectionmanager.methods[aMethod] = aHandler;
      }
    };
  }


  return {
    getSignalsInterface: getSignalsInterface,
    getMethodsInterface: getMethodsInterface
  };

// signalsInterface = y.getSignalsInterface()
// methodsInterface = y.getMethodsInterface()
// signalsInterface.registerListener('auth_success', onAuthSuccess)
// methodsInterface.call('auth_login', ('username', 'password'))


}()));

CoSeMe.namespace('yowsup.readerThread', (function() {
  'use strict';

  var stringFromUtf8 = CoSeMe.utils.stringFromUtf8;
  var utf8FromString = CoSeMe.utils.utf8FromString;

  var logger = new CoSeMe.common.Logger('ReaderThread');

  var _requests = [];

  var _lastPongTime = 0;
  var _pingInterval = 120;

  // _connection.socket should be a socket though
  var _connection = null;
  var _signalInterface;

  var ProtocolTreeNode = CoSeMe.protocol.Tree;


  var processNode = {
    result: function(iqType, idx, node) {
      if (idx in _requests) {
        _requests[idx](node);
        delete _requests[idx];
      }  else if (idx.startsWith(_connection.user)) {
        var accountNode = node.getChild(0);
        ProtocolTreeNode.require(accountNode,'account');
        var kind = accountNode.getAttributeValue('kind');

        if (kind == 'paid') {
          _connection.accountKind = 1;
        } else if (kind == 'free') {
          _connection.accountKind = 0;
        } else {
          _connection.accountKind = -1;
        }

        var expiration = accountNode.getAttributeValue('expiration');
        if (!expiration) {
          throw 'no expiration';
        }
        _connection.expireDate = expiration;

        // TO-DO! Note! This is called on python... but I can't find the code for this
        // self.eventHandler.onAccountChanged(_connection.accountKind,
        //                                    _connection.expireDate)

      }
    },

    error: function(iqType, idx, node) {
      _requests[idx](node);
      delete _requests[idx];
    },

    get: function(iqType, idx, node) {
      var childNode = node.getChild(0);
      if (ProtocolTreeNode.tagEquals(childNode,'ping')) {
        if (_autoPong) {
          _onPing(idx);
        }
        _signalInterface.send('ping', [idx]);
      } else if (ProtocolTreeNode.tagEquals(childNode,'query') &&
                 node.getAttributeValue('from') &&
                 'http://jabber.org/protocol/disco#info' == childNode.getAttributeValue('xmlns')) {
        var pin = childNode.getAttributeValue('pin');
        var timeoutString = childNode.getAttributeValue('timeout');
        if (pin) {
          // TO-DO! I can't find the code for this anywhere!
          // self.eventHandler.onRelayRequest(pin,timeoutSeconds,idx)
        }
      }
    },

    set: function(iqType, idx, node) {
      // As far as I know thid doesn't actually DO anything...
      var childNode = node.getChild(0);
      if (ProtocolTreeNode.tagEquals(childNode,'query')) {
        var xmlns = childNode.getAttributeValue('xmlns');

        if (xmlns == 'jabber:iq:roster') {
          var itemNodes = childNode.getAllChildren('item');
          itemNodes.forEach(function (itemNode) {
            var jid = itemNode.getAttributeValue('jid');
            var subscription = itemNode.getAttributeValue('subscription');
            var ask = itemNode.getAttributeValue('ask');
          });
        }
      }
    }
  };

  function onError(evt) {
    var reason = evt.data;
    logger.error('Socket error due to:', evt, '!');
    _signalInterface.send('disconnected', [reason]);
  }

  /**
   * This is attached to reader.onTree when authenticate success.
   */
  function handleNode(err, node) {
    try {

      if (ProtocolTreeNode.tagEquals(node, 'iq')) {
        var iqType = node.getAttributeValue('type');
        var idx = node.getAttributeValue('id');
        if (!iqType || !processNode[iqType]) {
          var error = 'Invalid or missing iq type: ' + iqType;
          throw error;
        }
        processNode[iqType](iqType, idx, node);

      } else if (ProtocolTreeNode.tagEquals(node,'presence')) {
        var xmlns = node.getAttributeValue('xmlns');
        var jid = node.getAttributeValue('from');

        if (!xmlns || ((xmlns == 'urn:xmpp') && jid )) {
          var presenceType = node.getAttributeValue('type');
          if (presenceType == 'unavailable') {
            _signalInterface.send('presence_unavailable', [jid]);
          } else if (!presenceType || (presenceType == 'available')) {
            _signalInterface.send('presence_available', [jid]);
          }
        } else if (xmlns == 'w' && jid) {
          var status = node.getAttributeValue('status');

          if (status == 'dirty') {
            //categories = self.parseCategories(node); #@@TODO, send along with signal
            logger.log('Will send DIRTY');
            _signalInterface.send('status_dirty');
            logger.log('DIRTY sent');
          }

          // If this exists, this is a group presence update
          var removeSubject = node.getAttributeValue('remove');
          var addSubject = node.getAttributeValue('add');
          var fromAttribute = node.getAttributeValue('from');
          var author = stringFromUtf8(node.getAttributeValue('author'));
          var timestamp = null;
          var msgId = null;
          var receiptRequested = null;

          if (addSubject) {
            _signalInterface.send("notification_groupParticipantAdded",
                                  [fromAttribute, addSubject, author, timestamp, msgId,
                                  receiptRequested]);
          } else if (removeSubject) {
            _signalInterface.send("notification_groupParticipantRemoved",
                                  [fromAttribute, removeSubject, author, timestamp,
                                  msgId, receiptRequested]);
          }
        }

      } else if (ProtocolTreeNode.tagEquals(node,'message')) {
        parseMessage(node);
      }

    } catch (x) {
      logger.error(x);
      // Should probably do something here...
    }
  }

  function parseMessage(messageNode) {
    var bodyNode = messageNode.getChild("body"),
        newSubject = bodyNode ? bodyNode.data : "",
        msgData = null,
        timestamp = Number(messageNode.getAttributeValue("t")).valueOf(),
        isGroup = false,
        isBroadcast = false,
        fromAttribute = messageNode.getAttributeValue("from"),
        author = stringFromUtf8(messageNode.getAttributeValue("author")),
        pushName = null,
        notifNode = messageNode.getChild("notify"),
        msgId = messageNode.getAttributeValue("id"),
        attribute_t = messageNode.getAttributeValue("t"),
        typeAttribute = messageNode.getAttributeValue("type"),
        wantsReceipt = false;

    logger.log("Parsing message:",  messageNode);

    function processMedia(childNode) {
      var mediaUrl = childNode.getAttributeValue("url");
      var mediaType = childNode.getAttributeValue("type");
      var mediaSize = childNode.getAttributeValue("size");
      var encoding = childNode.getAttributeValue("encoding");
      var mediaPreview = childNode.data;

      var mediaProcessor = {
        // These functions are surprisingly similar, aren't they?...
        image: function(childNode) {
          if (isGroup) {
            _signalInterface.send("group_imageReceived",
                                  [msgId, fromAttribute, author, mediaPreview,
                                  mediaUrl, mediaSize, wantsReceipt]);
          } else {
            _signalInterface.send("image_received", [msgId, fromAttribute, mediaPreview, mediaUrl,
                                                     mediaSize, wantsReceipt, isBroadcast]);
          }
        },

        video: function(childNode) {
          if (isGroup) {
            _signalInterface.send("group_videoReceived",
                                  [msgId, fromAttribute, author, mediaPreview, mediaUrl,
                                   mediaSize, wantsReceipt]);
          } else {
            _signalInterface.send("video_received", [msgId, fromAttribute, mediaPreview,
                                                     mediaUrl, mediaSize, wantsReceipt, isBroadcast]);
          }
        },


        audio: function(childNode) {
          if (isGroup) {
            _signalInterface.send("group_audioReceived",
                                  [msgId, fromAttribute, author,
                                  mediaUrl, mediaSize, wantsReceipt]);
          } else {
            _signalInterface.send("audio_received",
                                  [msgId, fromAttribute, mediaUrl,
                                  mediaSize, wantsReceipt, isBroadcast]);
          }
        },

        location: function(childNode) {
          logger.log("Location Childnode:", childNode);
          var mlatitude = childNode.getAttributeValue("latitude");
          var mlongitude = childNode.getAttributeValue("longitude");
          var name = stringFromUtf8(childNode.getAttributeValue("name")) || "";

          if (isGroup) {
            _signalInterface.send("group_locationReceived",
                                  [msgId, fromAttribute, author, name, mediaPreview,
                                   mlatitude, mlongitude, wantsReceipt]);
          } else {
            _signalInterface.send("location_received",
                                  [msgId, fromAttribute, name, mediaPreview, mlatitude,
                                  mlongitude, wantsReceipt, isBroadcast]);
          }
        },

        vcard: function(childNode) {
          //#return
          //#mediaItem.preview = messageNode.getChild("media").data
          logger.log("VCARD:", childNode);
          var vcardData = childNode.getChild("vcard").toString();
          var vcardName = stringFromUtf8(
            childNode.getChild("vcard").getAttributeValue("name"));

          if (vcardData) {
            var n = vcardData.indexOf(">") +1;
            vcardData = vcardData.substr(n,vcardData.length - n);
            vcardData = vcardData.replace("</vcard>","");

            if (isGroup) {
                _signalInterface.send("group_vcardReceived",
                                      [msgId, fromAttribute, author, vcardName,
                                       vcardData, wantsReceipt]);
            } else {
              _signalInterface.send("vcard_received",
                                    [msgId, fromAttribute, vcardName,
                                     vcardData, wantsReceipt, isBroadcast]);
            }
          }
        }
      };

      if (encoding == "raw" && mediaPreview) {
        mediaPreview = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Latin1.parse(mediaPreview));
      }

      try {
        mediaProcessor[mediaType](childNode);
      } catch (x) {
        logger.error("Unknown media type!", x);
        return;
      }

    }

    function processActive(childNode) {
      var notify_name;
      var stamp_str;
      var xmlns;
      var stamp;
      if (ProtocolTreeNode.tagEquals(childNode,"request")) {
        wantsReceipt = true;
      } else if (ProtocolTreeNode.tagEquals(childNode,"notify")) {
        notify_name = stringFromUtf8(childNode.getAttributeValue("name"));
      } else if (ProtocolTreeNode.tagEquals(childNode,"delay")) {
        xmlns = childNode.getAttributeValue("xmlns");
        if ("urn:xmpp:delay" == xmlns) {
          stamp_str = childNode.getAttributeValue("stamp");
          if (stamp_str) {
            stamp = stamp_str;
            timestamp = self.parseOfflineMessageStamp(stamp)*1000;
          }
        }
      } else if (ProtocolTreeNode.tagEquals(childNode,"x")) {
        xmlns = childNode.getAttributeValue("xmlns");
        if ("jabber:x:event" == xmlns && msgId) {
          if (fromAttribute == "broadcast") {
            _signalInterface.send("receipt_broadcastSent", [msgId]);
          } else {
            _signalInterface.send("receipt_messageSent", [fromAttribute, msgId]);
          }
        } else if ("jabber:x:delay" == xmlns) {
          return; // #@@TODO FORCED CONTINUE, WHAT SHOULD I DO HERE? #wtf?
          stamp_str = childNode.getAttributeValue("stamp");
          if (stamp_str) {
            stamp = stamp_str;
            timestamp = stamp;
          }
        }
      } else {
        if (ProtocolTreeNode.tagEquals(childNode,"delay") ||
            !ProtocolTreeNode.tagEquals(childNode,"received") || !msgId) {
          return; // WTF-redux
          var receipt_type = childNode.getAttributeValue("type");
          if (!receipt_type || receipt_type == "delivered") {
            _signalInterface.send("receipt_messageDelivered", [fromAttribute, msgId]);
          } else if (receipt_type == "visible") {
            _signalInterface.send("receipt_visible", [fromAttribute, msgId]);
          }
        }
      }
    }

    // This sucks. No, bar that. This raises the bar on sucking... but I don't have
    // neither the time nor the inclination to refactor this now.
    function processChildNode(childNode) {

      if (ProtocolTreeNode.tagEquals(childNode,"request")) {
        wantsReceipt = true;
      } else if (ProtocolTreeNode.tagEquals(childNode,"broadcast")) {
        isBroadcast = true;
      } else if (ProtocolTreeNode.tagEquals(childNode,"composing")) {
        _signalInterface.send("contact_typing", [fromAttribute]);

      } else if (ProtocolTreeNode.tagEquals(childNode,"paused")) {
        _signalInterface.send("contact_paused",[fromAttribute]);

      } else if (ProtocolTreeNode.tagEquals(childNode,"media") && msgId) {
        logger.log("Multimedia message!");
        processMedia(childNode);

      } else if (ProtocolTreeNode.tagEquals(childNode, "body") && msgId) {
        msgData = childNode.data;

      } else if (ProtocolTreeNode.tagEquals(childNode,"received") && fromAttribute && msgId) {
        if (fromAttribute == "s.us") {
          _signalInterface.send("profile_setStatusSuccess", ["s.us", msgId]);
          return;
        }
        //          #@@TODO autosend ack from client
        //          #print "NEW MESSAGE RECEIVED NOTIFICATION!!!"
        //          #self.connection.sendDeliveredReceiptAck(fromAttribute,msg_id);
        _signalInterface.send("receipt_messageDelivered", [fromAttribute, msgId]);
        return;

      } else if (!ProtocolTreeNode.tagEquals(childNode,"active")) {
        processActive(childNode);
      }
    }

    var parser = {
      error: function() {
        var errorNodes = messageNode.getAllChildren("error");
        errorNodes.forEach(function(errorNode) {
        var codeString = errorNode.getAttributeValue("code");
        var errorCode = Number(codeString).valueOf();
          _signalInterface.send("message_error", [data.msgId, data.fromAttribute, errorCode]);
        });
      },

      notification: function() {
        var pictureUpdated = messageNode.getChild("notification").getAttributeValue("type");
        var wr = messageNode.getChild("request").getAttributeValue("xmlns");
        var receiptRequested = (wr == "urn:xmpp:receipts");
        notifNode = messageNode.getChild("notification");

        if (pictureUpdated == "picture") {
          bodyNode = notifNode && notifNode.getChild("set");
          if (bodyNode) {
            var pictureId = Number(bodyNode.getAttributeValue("id")).valueOf;
            if (isGroup) {
              _signalInterface.send("notification_groupPictureUpdated",
                                    [bodyNode.getAttributeValue("jid"),
                                     stringFromUtf8(
                                       bodyNode.getAttributeValue("author")
                                     ),
                                     timestamp, msgId, pictureId, receiptRequested]);
            } else {
              _signalInterface.send("notification_contactProfilePictureUpdated",
                                    [bodyNode.getAttributeValue("jid"), timestamp, msgId,
                                     pictureId, receiptRequested]);
            }
          } else {
            bodyNode = notifNode && notifNode.getChild("delete");
            if (bodyNode) {
              if (isGroup) {
                _signalInterface.send("notification_groupPictureRemoved",
                                      [bodyNode.getAttributeValue("jid"),
                                       stringFromUtf8(
                                         bodyNode.getAttributeValue("author")
                                       ),
                                       timestamp, msgId, receiptRequested]);
              } else {
                _signalInterface.send("notification_contactProfilePictureRemoved",
                                      [bodyNode.getAttributeValue("jid"),
                                      timestamp, msgId, receiptRequested]);
              }
            }
          }
        } else {
          var addSubject = null;
          var removeSubject = null;
          author = null;

          bodyNode = notifNode && notifNode.getChild("add");
          if (bodyNode) {
            addSubject = bodyNode.getAttributeValue("jid");
            author = stringFromUtf8(bodyNode.getAttributeValue("author")) ||
                     addSubject;
          }
          bodyNode = notifNode && notifNode.getChild("remove");
          if (bodyNode) {
            removeSubject = bodyNode.getAttributeValue("jid");
            author = stringFromUtf8(bodyNode.getAttributeValue("author")) ||
                     removeSubject;
          }
          if (addSubject) {
            _signalInterface.send("notification_groupParticipantAdded",
                                  [fromAttribute, addSubject, author, timestamp, msgId,
                                   receiptRequested]);
          }
          if (removeSubject) {
            _signalInterface.send("notification_groupParticipantRemoved",
                                  [fromAttribute, removeSubject, author, timestamp,
                                   msgId, receiptRequested]);
          }
        }
      },

      subject: function() {
        var receiptRequested = false;
        var requestNodes = messageNode.getAllChildren("request");
        receiptRequested = requestNodes.some(function (requestNode) {
          return (requestNode.getAttributeValue("xmlns") == "urn:xmpp:receipts");
        });
        if (newSubject) {
          _signalInterface.send("group_subjectReceived",
                                [msgId, fromAttribute, author, newSubject,
                                 Number(attribute_t).valueOf(),  receiptRequested]);
        }
      },

      chat: function() {
        wantsReceipt = false;
        var messageChildren = messageNode.children || [];
        messageChildren.forEach(processChildNode);

      }
    };

    if (newSubject.contains("New version of WhatsApp Messenger is now available")) {
      logger.log("Rejecting server message");
      return; // #REJECT THIS FUCKING MESSAGE!
    }

    if (fromAttribute.contains('-')) {
      isGroup = true;
    }

    pushName = notifNode && stringFromUtf8(notifNode.getAttributeValue("name"));

    try {
      parser[typeAttribute]();
    } catch (x) {
      logger.error(x);
      throw new Error("Unknown type of message:" + typeAttribute + "!");
    }

    if (msgData) {
      // Change the UTF-8 representation to the internal JS representation
      msgData = stringFromUtf8(msgData);
      if (isGroup) {
        _signalInterface.send("group_messageReceived", [msgId, fromAttribute, author, msgData,
                                                        timestamp, wantsReceipt, pushName]);

      } else {
        _signalInterface.send("message_received", [msgId, fromAttribute, msgData, timestamp,
                                                   wantsReceipt, pushName, isBroadcast]);
      }
    }
  }

  // TO-DO
  function parsePingResponse(node) {
    var idx = node.getAttributeValue("id"); // FIXME: Why this?
    this.lastPongTime = Date.now();
  }

  function parseGroupInfo(node) {
    var jid = node.getAttributeValue("from");
    var groupNode = node.getChild(0);
    if (groupNode.toString().contains('error code')) {
      _signalInterface.send("group_infoError",[0]); // @@TODO replace with real error code
    } else {
      ProtocolTreeNode.require(groupNode,"group");
      //gid = groupNode.getAttributeValue("id");
      var owner = groupNode.getAttributeValue("owner");
      var subject = groupNode.getAttributeValue("subject");
      var subjectT = groupNode.getAttributeValue("s_t");
      var subjectOwner = groupNode.getAttributeValue("s_o");
      var creation = groupNode.getAttributeValue("creation");

      _signalInterface.send("group_gotInfo",[jid, owner, subject, subjectOwner, subjectT, creation]);
    }
  }

  function parseGetPicture(node) {
    var jid = node.getAttributeValue("from");
    if (node.toString().contains('error code')) {
      return;
    }
    var  pictureNode = node.getChild("picture");
    if (pictureNode) {
      var picture = CoSeMe.utils.latin1ToBlob(pictureNode.data, 'image/jpeg');
      var pictureId = Number(pictureNode.getAttributeValue('id')).valueOf();
      if (jid.contains('-')) {
        _signalInterface.send("group_gotPicture", [jid, pictureId, picture]);
      } else {
        _signalInterface.send(
          "contact_gotProfilePicture", [jid, pictureId, picture]);
      }
    }
  }

  function parseGroupCreated(node) {
    var groupNode = node.getChild(0);

    if (groupNode.tag === 'error') {
      errorCode = groupNode.getAttributeValue('code');
      _signalInterface.send('group_createFail', [errorCode]);
    }
    else {
      ProtocolTreeNode.require(groupNode, 'group');
      groupId = groupNode.getAttributeValue('id');
      _signalInterface.send('group_createSuccess', [groupId + '@g.us']);
    }
  }

  function parseAddedParticipants(node) {
    var jabberId = node.getAttributeValue("from");
    var jabberIds = [];
    var type, child, addNodes = node.getAllChildren("add");

    for (var i = 0, l = addNodes.length; i < l; i++) {
      child = addNodes[i];
      type = child.getAttributeValue('type');
      if (type === 'success') {
        jabberIds.push(child.getAttributeValue('participant'));
      }
      else {
        logger.log('Failed to add',
                   childCount.getAttributeValue('participant'));
      }
    }

    _signalInterface.send("group_addParticipantsSuccess",
                              [jabberId, jabberIds])
  }

  function parseRemovedParticipants(node) {
    var jabberId = node.getAttributeValue("from");
    var jabberIds = [];
    var type, child, removeNodes = node.getAllChildren("remove");

    for (var i = 0, l = removeNodes.length; i < l; i++) {
      child = removeNodes[i];
      type = child.getAttributeValue('type');
      if (type === 'success') {
        jabberIds.push(child.getAttributeValue('participant'));
      }
      else {
        logger.log('Failed to remove',
                    childCount.getAttributeValue('participant'));
      }
    }

    _signalInterface.send("group_removeParticipantsSuccess",
                              [jabberId, jabberIds])
  }

  function parseSetPicture(node) {
    var jabberId = node.getAttributeValue("from");
    var picNode = node.getChild("picture");
    var pictureId;

    try {
      if (picNode === null) {
        // TODO: Send the correct error code instead of 0
        _signalInterface.send("group_setPictureError", [jabberId, 0]);
      } else {
        pictureId = parseInt(picNode.getAttributeValue("id"), 10);
        _signalInterface.send("group_setPictureSuccess",
                                  [jabberId, pictureId]);
      }
    } catch (e) {
      if (picNode === null) {
        //TODO: Send correct error code instead of 0
        _signalInterface.send("profile_setPictureError", [0]);
      } else {
        pictureId = parseInt(picNode.getAttributeValue("id"), 10);
        _signalInterface.send("profile_setPictureSuccess", [pictureId]);
      }
    }

  }

  function parseGroupEnded(node) {
    var leaveNode = node.getChild(0);
    var groupNode = leaveNode.getChild(0);
    var jabberId = groupNode.getAttributeValue("id");
    _signalInterface.send("group_endSuccess", [jabberId]);
  }

  function parseGroupSubject(node) {
    var jabberId = node.getAttributeValue("from");
    _signalInterface.send("group_setSubjectSuccess", [jabberId])
  }

  function parseGroups(node) {
    var groupNode, children = node.getAllChildren("group");
    var jabberId, owner, subject, subjectT, subjectOwner, creation;

    for (var i = 0, l = children.length; i < l; i++) {
      groupNode = children[i];

      jabberId = groupNode.getAttributeValue("id") + "@g.us";
      owner = groupNode.getAttributeValue("owner");
      subject = groupNode.getAttributeValue("subject")
      subjectT = groupNode.getAttributeValue("s_t")
      subjectOwner = groupNode.getAttributeValue("s_o")
      creation = groupNode.getAttributeValue("creation")

      _signalInterface.send(
        "group_gotInfo",
        [
          jabberId, owner, subject,
          subjectOwner, parseInt(subjectT, 10), parseInt(creation)
        ]
      );
    }
  }

  function parseParticipants(node) {
    var jabberId = node.getAttributeValue("from");
    var children = node.getAllChildren("participant");
    var child, jabberIds = []
    for (var i = 0, l = children.length; i < l; i++) {
      child = children[i];
      jabberIds.push(child.getAttributeValue("jid"))
    }
    _signalInterface.send("group_gotParticipants", [jabberId, jabberIds]);
  }

  function parseLastOnline(node) {
    var jabberId = node.getAttributeValue("from");
    var firstChild = node.getChild(0);

    if (firstChild.toString().indexOf("error") >= 0)
      return;

    ProtocolTreeNode.require(firstChild, "query");
    var seconds = firstChild.getAttributeValue("seconds");
    // TODO: What about data?

    try {
      if (seconds !== null && jabberId !== null)
        _signalInterface.send("presence_updated", [jabberId, Math.floor(seconds)])
    }
    catch (e) {
      logger.error("Ignored exception in handleLastOnline!", e);
    }

  }

  function parseGetPictureIds(node) {
    var jabberId = node.getAttributeValue("from");
    var groupNode = node.getChild("list");
    var child, children = groupNode.getAllChildren("user");

    for (var i = 0, l = children.length; i < l; i++) {
      child = children[i];
      if (child.getAttributeValue('id') !== null) {
        _signalInterface.send(
          "contact_gotProfilePictureId",
          [child.getAttributeValue("jid"), child.getAttributeValue("id")]
        );
      }
    }
  }

  function parseRequestUpload(_hash, iqNode) {
    var mediaNode = iqNode.getChild("media");

    if (mediaNode) {
      var url = mediaNode.getAttributeValue("url");
      var resumeFrom = mediaNode.getAttributeValue("resume");
      if (!resumeFrom) {
        resumeFrom = 0;
      }

      if (url) {
        _signalInterface.send("media_uploadRequestSuccess", [_hash, url, resumeFrom]);
      } else {
        _signalInterface.send("media_uploadRequestFailed", [_hash]);
      }
    } else {
      var duplicateNode = iqNode.getChild("duplicate");

      if (duplicateNode) {
        var url = duplicateNode.getAttributeValue("url");
        _signalInterface.send("media_uploadRequestDuplicate", [_hash, url]);
      } else {
        _signalInterface.send("media_uploadRequestFailed", [_hash]);
      }
    }
  }

  var alive = false;

  var pingId;

  function sendPings() {
    _autoPong && _ping();
  }

  var _onPing;
  var _ping;
  var _autoPong;

  return {
    set onPing(aFun) {
      _onPing = aFun;
    },

    get onPing() {
      return _onPing;
    },

    set autoPong(aValue) {
      _autoPong = aValue;
    },

    get autoPong() {
      return _autoPong;
    },

    set ping(aFun) {
      _ping = aFun;
    },

    get ping() {
      return _ping;
    },

    set socket(aSocket) {
      if (aSocket) {
        _connection = aSocket;
        _connection.reader.onTree = handleNode;
        _connection.onconnectionclosed = onError;
        _connection.reader.resume();
        alive = true;
        pingId = setInterval(sendPings, 1000 * _pingInterval);
      } else {
        _connection.reader.onStreamStart = undefined;
        _connection.reader.onTree = undefined;
        _connection.onconnectionclosed = undefined;
        _connection = aSocket;
        alive = false;
        clearInterval(pingId);
      }
    },

    get requests() {
      return _requests;
    },

    parseRequestUpload: parseRequestUpload,

    parsePingResponse: parsePingResponse,

    parseGroupInfo: parseGroupInfo,

    parseGetPicture: parseGetPicture,

    parseGroupCreated: parseGroupCreated,

    parseAddedParticipants: parseAddedParticipants,

    parseRemovedParticipants: parseRemovedParticipants,

    parseSetPicture: parseSetPicture,

    parseGroupEnded: parseGroupEnded,

    parseGroupSubject: parseGroupSubject,

    parseGroups: parseGroups,

    parseParticipants: parseParticipants,

    parseLastOnline: parseLastOnline,

    parseGetPictureIds: parseGetPictureIds,

    // Not very pretty but then, what is?
    set signalInterface(si) {
      _signalInterface = si;
    },

    get signalInterface() {
      return _signalInterface;
    },

    isAlive: function() {
      return alive;
    },

    terminate: function() {
      throw 'NOT IMPLEMENTED!';
    },

    sendDisconnected: function(reason) {
      _signalInterface.send('disconnected', [reason]);
    }
  };
}()));

CoSeMe.namespace('yowsup.connectionmanager', (function() {

  var stringFromUtf8 = CoSeMe.utils.stringFromUtf8;
  var utf8FromString = CoSeMe.utils.utf8FromString;

  var logger = new CoSeMe.common.Logger('ConnectionManager');

  function fireEvent(aSignal, aParams) {
    // To-do: To be faithful with Yowsup, this should spawn a thread per handler
    signalHandlers[aSignal].forEach(function (aHandler) {
      try {
        setTimeout(function() {aHandler.apply(undefined, aParams);}, 0);
      } catch (x) {
        logger.error('FireEvent exception!', x);
      }
    });
  }

  // We will implement the high level interface of Yowsup so other users of the
  // library can port to this one directly
  var signalHandlers = {
      auth_success: [],
      auth_fail: [],

      message_received: [],
      image_received: [],
      vcard_received: [],
      video_received: [],
      audio_received: [],
      location_received: [],

      message_error: [],

      receipt_messageSent: [],
      receipt_messageDelivered: [],
      receipt_visible: [],
      receipt_broadcastSent: [],
      status_dirty: [],

      presence_updated: [],
      presence_available: [],
      presence_unavailable: [],

      group_subjectReceived: [],
      group_createSuccess: [],
      group_createFail: [],
      group_endSuccess: [],
      group_gotInfo: [],
      group_infoError: [],
      group_addParticipantsSuccess: [],
      group_removeParticipantsSuccess: [],
      group_gotParticipants: [],
      group_setSubjectSuccess: [],
      group_messageReceived: [],
      group_imageReceived: [],
      group_vcardReceived: [],
      group_videoReceived: [],
      group_audioReceived: [],
      group_locationReceived: [],
      group_setPictureSuccess: [],
      group_setPictureError: [],
      group_gotPicture: [],
      group_gotGroups: [],

      notification_contactProfilePictureUpdated: [],
      notification_contactProfilePictureRemoved: [],
      notification_groupPictureUpdated: [],
      notification_groupPictureRemoved: [],
      notification_groupParticipantAdded: [],
      notification_groupParticipantRemoved: [],

      contact_gotProfilePictureId: [],
      contact_gotProfilePicture: [],
      contact_typing: [],
      contact_paused: [],

      profile_setPictureSuccess: [],
      profile_setPictureError: [],
      profile_setStatusSuccess: [],

      ping: [],
      pong: [],
      disconnected: [],

      media_uploadRequestSuccess: [],
      media_uploadRequestFailed: [],
      media_uploadRequestDuplicate: []

  };



  // Python: ProtocolTreeNode(tag,attributes,children=None,data=None):
  // This function just translates the new interface to the old one...
  // And yeah, I know it's sinister, but it was easier this way
  function newProtocolTreeNode(aTag, aAttributes, aChildren, aData) {
    return new CoSeMe.protocol.Tree(aTag, {
      attributes: aAttributes,
      children: aChildren,
      data: aData
    });
  };



  // Persistent state, per connectionmanager.py
  var self = {
    // Warning: Not really a thread :P
    readerThread: CoSeMe.yowsup.readerThread,
    autoPong: true,
    state: 0,
    socket: null,
    jid: null,
    out: null,
    currKeyId: 0,

    _writeNode: function (aNode) {
      logger.log('Write node called with ', aNode);
      if (self.state == 2) {
        self.out.write(aNode, this._onErrorSendDisconnected);
      }
    },

    _onErrorSendDisconnected: function (error) {
      if (error && self.state !== 0) {
        self.state = 0;
        self.readerThread.socket = null;
        self.readerThread.sendDisconnected(error);
        logger.error('Error writing!', error);
      }
    },

    getMessageNode: function(aJid, aChild) {
      var requestNode = null;
      var serverNode = newProtocolTreeNode('server');
      var xNode = newProtocolTreeNode('x', {xmlns: 'jabber:x:event'},
                                      [serverNode]);
      // was (0 if requestNode is None else 1) + 2
      var childCount = 2;
      var messageChildren = [ ]; // [None]*childCount;
      messageChildren.push(xNode);

      if (aChild instanceof Array) {
        messageChildren = messageChildren.concat(aChild);
      } else {
        messageChildren.push(aChild);
      }

      var msgId = Math.floor(Date.now() / 1000)  + '-' + self.currKeyId;

      var messageNode = newProtocolTreeNode('message',
                          {to: aJid, type: 'chat', id: msgId}, messageChildren);

      self.currKeyId++;

      return messageNode;
    },

    sendMessage:  function() {
      var aParams = Array.prototype.slice.call(arguments);
      var aFun = aParams.shift();
      var node = aFun.apply(self, aParams);
      var jid =
        (typeof aParams[0] === 'string') || (aParams[0] instanceof String) ?
            aParams[0] :
            'broadcast';
      var messageNode = self.getMessageNode(jid, node);
      self._writeNode(messageNode);
      // To-Do: Check that ProtocolTreeNode has getAttributeValue!!!
      return messageNode.getAttributeValue('id');
    },

    mediaNode: function() {
      var aParams = Array.prototype.slice.call(arguments);
      var aFun = aParams.shift();
      var mediaType = aFun.apply(self, aParams);
      var url = aParams[1];
      var name = utf8FromString(aParams[2]);
      var size = aParams[3];

      if (typeof size !== 'string') {
        size = size.toString();
      }

      var mmNode = newProtocolTreeNode('media',
                     {'xmlns':'urn:xmpp:whatsapp:mms','type':mediaType,'file':name,'size':size,'url':url},
                     null, aParams[4]);
      return mmNode;
    },

    sendReceipt: function(jid, mtype, mid) {
      var receivedNode = newProtocolTreeNode('received',{xmlns: 'urn:xmpp:receipts'});
      var messageNode = newProtocolTreeNode('message', {to: jid, type: mtype, id: mid}, [receivedNode]);
      self._writeNode(messageNode);
    },

    getReceiptAck: function(aTo, aMsgId, aReceiptType) {
      var ackNode = newProtocolTreeNode('ack',{
          xmlns: 'urn:xmpp:receipts',
          type: aReceiptType
      });
      var messageNode = newProtocolTreeNode('message',
          {to:aTo, type: 'chat', 'id': aMsgId},[ackNode]);
      return messageNode;
    },

    getSubjectMessage: function (aTo, aMsgId, aChild) {
      var messageNode = newProtocolTreeNode('message',
        {to: aTo, type: 'subject', id: aMsgId}, [aChild]);
      return messageNode;
    },

    iqId: 0,
    verbose: true,
    makeId: function(prefix) {
      self.iqId++;
      var idx;
      if (self.verbose) {
        idx = prefix + self.iqId;
      } else {
        idx = self.iqId.toString(16);
      }
      return idx;
    },

    sendSubscribe: function(aTo) {
      var presenceNode = newProtocolTreeNode(
                           'presence',{type: 'subscribe', to: aTo});
      self._writeNode(presenceNode);
    },

    sendPing: function() {
      var idx = self.makeId('ping_');

      self.readerThread.requests[idx] = self.readerThread.parsePingResponse;

      var pingNode = newProtocolTreeNode('ping', {xmlns: 'w:p'});
      var iqNode = newProtocolTreeNode('iq',{
        id: idx, type: 'get', to: self.domain}, [pingNode]);
      self._writeNode(iqNode);
      return idx;
    },

    sendPong: function(aIdx) {
      var iqNode =
        newProtocolTreeNode('iq', {type: 'result', to: self.domain, id: aIdx});
      self._writeNode(iqNode);
    }
  };

  function _sendTypingState(aState, aJid) {
    try {
      var composing = newProtocolTreeNode(aState,
        { xmlns: 'http://jabber.org/protocol/chatstates' });
      var message = newProtocolTreeNode('message',
        { to: aJid, type: 'chat'}, [composing]);
      self._writeNode(message);
    } catch (x) {
      logger.error('Error sending typing state!', x);
    }
  }


  function modifyGroupParticipants(aOperation, aCallback, aGjid, aParticipants) {
      var idx = self.makeId(aOperation + '_group_participants_');
      self.readerThread.requests[idx] = aCallback;

      var innerNodeChildren = [];

      aParticipants.forEach(function(aPart) {
        innerNodeChildren.push(newProtocolTreeNode('participant', {jid: aPart}));
      });

      var queryNode = newProtocolTreeNode(aOperation,
        {xmlns: 'w:g'},
        innerNodeChildren);
      var iqNode = newProtocolTreeNode(
                     'iq',
                      {id: idx,type: 'set', to: aGjid},
                      [queryNode]);

      self._writeNode(iqNode);

  }


  function sendSetPicture(aJid, aImageData) {

      var idx = self.makeId('set_picture_');
      self.readerThread.requests[idx] = self.readerThread.parseSetPicture;

      var  listNode = newProtocolTreeNode(
                       'picture',
                       {xmlns: 'w:profile:picture', type: 'image'},
                       null,
                       aImageData);

      var iqNode = newProtocolTreeNode(
                     'iq',
                     {id: idx, to: aJid, type: 'set'},
                     [listNode]);

      self._writeNode(iqNode);
  }

  function sendGetPicture(aJid) {
    var idx = self.makeId('get_picture_');

    // #@@TODO, ?!
    self.readerThread.requests[idx] =  self.readerThread.parseGetPicture;

    var listNode =
      newProtocolTreeNode('picture', {xmlns: 'w:profile:picture', type: 'image'});
    var iqNode = newProtocolTreeNode('iq', {id: idx, to: aJid, type: 'get'},
                                     [listNode]);

    self._writeNode(iqNode);
  }

  var methodList = {

    /*
     * Authentication
     */
    auth_login: function(aUsername, aPassword) {
        logger.log('auth_login called for', aUsername);
        CoSeMe.auth.authenticate(aUsername, aPassword, function(aConn) {
          try {
            if (aConn) {
              self.socket = aConn;
              self.readerThread.socket = self.socket;
              self.readerThread.autoPong = self.autoPong;
              self.readerThread.ping = self.sendPing;
              self.readerThread.onPing = self.sendPong;
              self.readerThread.signalInterface = {
                send: fireEvent
              };
              self.jid = self.socket.jid;
              self.out = self.socket.writer;
              self.state = 2;
              self.domain = CoSeMe.config.auth.domain;
              fireEvent('auth_success', [aUsername, null]);
            } else {
              fireEvent('auth_fail', [aUsername, null]);
            }
          } catch (x) {
            logger.error('Error authenticating!', x);
            self.state = 0;
            fireEvent('auth_fail', [aUsername, null]);
          }
        });
    },

    /*
     * Message Sending
     */

    // I still think that the @syntax sucks :P
    // TO-DO TO-DO: aText should be re-coded so every byte is duplicated.
    // (0x00 0x1A becomes 0x00 0x00 0x00 0x1A) so the highest byte is 0 ALWAYS...
    // At the moment, corner case for the future
    message_send: self.sendMessage.bind(self, function(aJid, aText) {
      // Change the byte representation to UTF-8.
      aText = utf8FromString(aText);
      return newProtocolTreeNode('body', undefined, undefined, aText);
    }),

    typing_send: function(aJid) {
      _sendTypingState('composing', aJid);
    },

    typing_paused: function(aJid) {
      _sendTypingState('paused', aJid);
    },

    /*
     * Media
     */

    // Hmm... To-Do? I don't think this will actually work...
    message_imageSend: self.sendMessage.bind(self, self.mediaNode.bind(self, function() {
      return 'image';
    })),
    message_videoSend: self.sendMessage.bind(self, self.mediaNode.bind(self, function() {
      return 'video';
    })),
    message_audioSend: self.sendMessage.bind(self, self.mediaNode.bind(self, function() {
      return 'audio';
    })),

    message_locationSend: self.sendMessage.bind(self,
      function(aJid, aLatitude, aLongitude, aPreview) {
      return newProtocolTreeNode('media',
          {xmlns: 'urn:xmpp:whatsapp:mms',
           type: 'location',
           latitude: aLatitude,
           longitude: aLongitude},
          null, aPreview);
    }),
    message_vcardSend: self.sendMessage.bind(self, function(aJid, aData, aName) {
      aName = utf8FromString(aName)
      var cardNode = newProtocolTreeNode('vcard', {name: aName}, null, aData);
      return newProtocolTreeNode('media',
          {xmlns: 'urn:xmpp:whatsapp:mms', type: 'vcard'}, [cardNode]);
    }),

    //Message and Notification Acks

    message_ack: function(aJid, aMsgId) {
      self.sendReceipt(aJid, 'chat', aMsgId);
    },
    notification_ack: function(aJid, aNotificationId) {
      self.sendReceipt(aJid, 'notification', aNotificationId);
    },
    delivered_ack: function(aTo, aMsgId) {
      self._writeNode(self.getReceiptAck(aTo, aMsgId, 'delivered'));
    },
    visible_ack: function(aJid, aMsgId) {
      self._writeNode(self.getReceiptAck(aJid, aMsgId, 'visible'));
    },
    subject_ack: function(aJid, aMessageId) {
      logger.log('Sending subject recv receipt...');
      var receivedNode = newProtocolTreeNode('received',
                                             {xmlns: 'urn:xmpp:receipts'});
      var messageNode = self.getSubjectMessage(aJid, aMessageId, receivedNode);
      self._writeNode(messageNode);
    },

    // Keep Alive

    ping: self.sendPing,

    pong: self.sendPong,

    //Groups

    group_getInfo: function(aJid) {
      var idx = self.makeId('get_g_info_');
      self.readerThread.requests[idx] = self.readerThread.parseGroupInfo;
      var queryNode = newProtocolTreeNode('query',{xmlns: 'w:g'});
      var iqNode = newProtocolTreeNode('iq',
                                       {id: idx, type: 'get', to: aJid},
                                       [queryNode]);
      self._writeNode(iqNode);
    },

    group_getPicture: function(aJid) {
      var idx = self.makeId('get_picture_');

      //@@TODO, ?!
      self.readerThread.requests[idx] = self.readerThread.parseGetPicture;

      var listNode = newProtocolTreeNode(
                       'picture',
                       {xmlns:'w:profile:picture', type: 'image'});
      var iqNode = newProtocolTreeNode(
                     'iq',
                     {id:idx, to:aJid, type: 'get'}, [listNode]);

      self._writeNode(iqNode);
    },

    group_create: function(aSubject) {
      var idx = self.makeId('create_group_');
      self.readerThread.requests[idx] = self.readerThread.parseGroupCreated;

      var  queryNode = newProtocolTreeNode(
                        'group',
                        {xmlns: 'w:g', action: 'create', subject: aSubject});
      var iqNode = newProtocolTreeNode(
                     'iq',
                     {id: idx, type: 'set', to: 'g.us'},
                     [queryNode]);

      self._writeNode(iqNode);
    },

    group_addParticipants: function(aGjid, aParticipants) {
      modifyGroupParticipants(
        'add',
        self.readerThread.parseAddedParticipants,
        aGjid,
        aParticipants);
    },

    group_removeParticipants: function(aGjid, aParticipants) {
      modifyGroupParticipants(
        'remove',
        self.readerThread.parseRemovedParticipants,
        aGjid,
        aParticipants);
    },

    // This method (and all the ones that use it) have changed from
    // the original. They receive a blob now instead of a path
    // TO-DO: NOTE THAT THERE'S A GOOD CHANCE THIS WILL FAIL AS IS!
    group_setPicture: sendSetPicture,

    group_end: function(aGjid) {
      var  idx = self.makeId('leave_group_');
      self.readerThread.requests[idx] = self.readerThread.parseGroupEnded;

      var innerNodeChildren = [];
      innerNodeChildren.push(newProtocolTreeNode('group', {id: aGjid}));

      var  queryNode = newProtocolTreeNode(
                        'leave', {xmlns: 'w:g'}, innerNodeChildren);
      var iqNode = newProtocolTreeNode(
                     'iq', {id: idx, type: 'set', to: 'g.us'}, [queryNode]);

      self._writeNode(iqNode);
    },

    group_setSubject: function(aGjid, aSubject) {
      //subject = subject.encode('utf-8')
      var idx = self.makeId('set_group_subject_');
      self.readerThread.requests[idx] = self.readerThread.parseGroupSubject;

      var queryNode = newProtocolTreeNode(
                        'subject', {xmlns: 'w:g', value: aSubject});
      var iqNode = newProtocolTreeNode(
                     'iq',{id: idx, type: 'set', to: aGjid},[queryNode]);

      self._writeNode(iqNode);
    },

    group_getParticipants: function(aGjid) {
      var idx = self.makeId('get_participants_');
      self.readerThread.requests[idx] = self.readerThread.parseParticipants;

      var listNode = newProtocolTreeNode('list', {xmlns: 'w:g'});
      var iqNode = newProtocolTreeNode('iq', {id: idx, type: 'get', to: aGjid},
                                       [listNode]);

      self._writeNode(iqNode);
    },

    // Presence

    presence_sendAvailable: function() {
      var presenceNode = newProtocolTreeNode('presence', {type: 'available'});
      self._writeNode(presenceNode);
    },

    presence_request: function(aJid) {
      if ((aJid === 'Server@s.whatsapp.net') || (aJid.split('-').length == 2)) {
        return;
      }
      self.sendSubscribe(aJid);

      var idx = self.makeId('last_');
      self.readerThread.requests[idx] = self.readerThread.parseLastOnline;

      var query = newProtocolTreeNode('query', {xmlns: 'jabber:iq:last'});
      var iqNode = newProtocolTreeNode(
        'iq', {id: idx, type: 'get', to: aJid},[query]);
      self._writeNode(iqNode);
    },

    presence_sendUnavailable: function() {
      var presenceNode = newProtocolTreeNode('presence', {type: 'unavailable'});
      self._writeNode(presenceNode);
    },

    presence_sendAvailableForChat: function(aPushname) {
      aPushname = utf8FromString(aPushname);
      var presenceNode = newProtocolTreeNode('presence', {name: aPushname});
      self._writeNode(presenceNode);
    },

    presence_subscribe: function(aJid) {
      var presenceNode = newProtocolTreeNode(
        'presence', {type: 'subscribe', to: aJid});
      self._writeNode(presenceNode);
    },

    presence_unsubscribe: function(aJid) {
      var presenceNode = newProtocolTreeNode(
        'presence', {type: 'unsubscribe', to: aJid});
      self._writeNode(presenceNode);
    },

    // Contacts

    contact_getProfilePicture: sendGetPicture,
    picture_getIds: function(aJids) {
      var idx = self.makeId('get_picture_ids_');
      self.readerThread.requests[idx] = self.readerThread.parseGetPictureIds;

      var innerNodeChildren = [];
      aJids.forEach(function (aJid) {
        innerNodeChildren.push(newProtocolTreeNode('user', {jid: aJid}));
      });

      var queryNode = newProtocolTreeNode('list', {xmlns: 'w:profile:picture'},
                                          innerNodeChildren);
      var iqNode = newProtocolTreeNode('iq', {id: idx, type: 'get'}, [queryNode]);

      self._writeNode(iqNode);
    },

    // Profile

    profile_getPicture: function() {
      sendGetPicture(self.jid);
    },

    profile_setStatus: function(aStatus) {
      aStatus = utf8FromString(aStatus);
      var bodyNode = newProtocolTreeNode('body', null, null, aStatus);
      var messageNode = self.getMessageNode('s.us', bodyNode);
      self._writeNode(messageNode);

      return messageNode.getAttributeValue('id');
    },

    profile_setPicture: sendSetPicture.bind(undefined, self.jid),

    // Misc

    ready: function() {
      if (self.readerThread.isAlive()) {
        logger.warn('Reader already started');
        return 0;
      }

      logger.log('Starting reader...');
      // Nothiing to do here, really... or is it?
      // TO-DO?
      return 1;
    },

    getVersion: function() { return CoSeMe.config.tokenData['v']; },

    disconnect: function(aReason) {
      logger.log('Disconnect sequence initiated...');
      logger.log('Sending term signal to reader thread');
      if (self.readerThread.isAlive()) {
        self.readerThread.terminate();
        // TO-DO!!!! CHECK THE METHOD NAME!!!!
        self.socket.socket.close();
      }

      logger.log('Disconnected!', aReason);
      self.state = 0;
      self.readerThread.sendDisconnected(aReason);
    },

    media_requestUpload: function(aB64Hash, aT, aSize, aB64OrigHash) {
      var idx = self.makeId('upload_');

      // NOTE! TO-DO! parseRequestUpload will have it's arguments REVERSED!
      self.readerThread.requests[idx] =
        self.readerThread.parseRequestUpload.bind(undefined, aB64Hash);

      if (typeof aSize !== 'string') {
        aSize = aSize.toString(10);
      }

      var attribs = {xmlns: 'w:m', hash: aB64Hash, type: aT, size: aSize};

      if (aB64OrigHash) {
        attribs.orighash = aB64OrigHash;
      }

      var mediaNode = newProtocolTreeNode('media', attribs);
      var iqNode = newProtocolTreeNode('iq',
                     {id: idx, to: 's.whatsapp.net', type: 'set'},[mediaNode]);
      self._writeNode(iqNode);
    },

   message_broadcast: self.sendMessage.bind(undefined, function(aJids, aContent) {
     var jidNodes = [];
     aJids.forEach(function(aJid) {
       jidNodes.push(newProtocolTreeNode('to', {'jid': aJid}));
     });

     var broadcastNode = newProtocolTreeNode('broadcast', null, jidNodes);

     var messageNode = newProtocolTreeNode('body', null, null, aContent);

     return [broadcastNode, messageNode];
   }),

   clientconfig_send: function(aSound, aPushID, aPreview, aPlatform) {
     var idx = self.makeId('config_');
     var configNode =
       newProtocolTreeNode('config', {
                             xmlns: 'urn:xmpp:whatsapp:push',
                             sound: aSound,
                             id: aPushID,
                             preview: aPreview ? '1':'0',
                             platform: aPlatform});
     var iqNode =
       newProtocolTreeNode('iq',
                           {id: idx, type: 'set', to: self.domain},
                           [configNode]);

    self._writeNode(iqNode);
   },

   group_getGroups: function(aGtype) {
     var idx = self.makeId('get_groups_');
     self.readerThread.requests[idx] = self.readerThread.parseGroups;

     var queryNode = newProtocolTreeNode('list',{xmlns: 'w:g', type: aGtype});
     var iqNode = newProtocolTreeNode('iq',{id: idx, type: 'get', to: 'g.us'},
                                      [queryNode]);

     self._writeNode(iqNode);
   },

   picture_get: function(aJid) {
     var idx = self.makeId('get_picture_');

    //#@@TODO, ?!
    self.readerThread.requests[idx] =  self.readerThread.parseGetPicture;

     var listNode =
       newProtocolTreeNode('picture',
                           {xmlns: 'w:profile:picture', type: 'image'});
     var iqNode =
       newProtocolTreeNode('iq',{id: idx, to: aJid, type: 'get'}, [listNode]);

     self._writeNode(iqNode);
   },

   status_update: function(aStatus) {
     var bodyNode = newProtocolTreeNode('body', null, null, aStatus);
     var messageNode = self.getMessageNode('s.us', bodyNode);
     self._writeNode(messageNode);
     return messageNode.getAttributeValue('id');
   }

  };

  return {
    get methods() {
      return methodList;
    },
    get signals() {
      return signalHandlers;
    },
    fireEvent: fireEvent,
    get jid() {
      return self.jid;
    }
  };
})());
