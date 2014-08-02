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
/*
 * Derived from
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
    var SHA256_IP = C_algo.SHA256_IP = C_algo.SHA1_IP.extend({

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
    C.SHA256_IP = Hasher._createHelper(SHA256_IP);

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
    C.HmacSHA256_IP = Hasher._createHmacHelper(SHA256_IP);
}(Math));

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
CoSeMe.namespace('crypto', (function() {
  'use strict';

  // From: http://en.wikipedia.org/wiki/MD5#Pseudocode
  CryptoJS.MD5_IP = function(arrayBuffer) {

    // Constants are the integer part of the sines of integers (in radians) * 2^32.
    var k = [
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee ,
      0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501 ,
      0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be ,
      0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821 ,
      0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa ,
      0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8 ,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed ,
      0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a ,
      0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c ,
      0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70 ,
      0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05 ,
      0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665 ,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039 ,
      0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1 ,
      0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1 ,
      0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391 ];

    // r specifies the per-round shift amounts
    var r = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21];

    arrayBuffer = arrayBuffer || [];
    var dataView = new Uint8Array(arrayBuffer);

    // Prepare a chunk of data with the tail of the bitstream
    var messageLength = dataView.length;
    var totalLength = messageLength + 1;
    while (totalLength % (512/8) !== (448/8)) {
      totalLength++;
    }
    totalLength += 8; // for the messageLength in bits mod 2^64 (8 bytes)

    var padding = new Uint8Array(totalLength - messageLength);
    var paddingLength = padding.length;

    // Append 1 bit
    padding[0] = 0x80;
    // Append 0s until reaching a length in bits === 448 mod 512
    // -- This is implicit as initially, the buffer is filled with 0s --
    // Append length in bits mod 2^64 (8 bytes) (in two chunks)
    putWord(messageLength * 8, padding, paddingLength - 8);
    putWord(messageLength >>> 29, padding, paddingLength - 4);

    function putWord(value, target, offset) {
      target[offset]     = value        & 0xff;
      target[offset + 1] = value >>> 8  & 0xff;
      target[offset + 2] = value >>> 16 & 0xff;
      target[offset + 3] = value >>> 24 & 0xff;
    }

    // Initialisation
    var h0 = 0x67452301,
        h1 = 0xefcdab89,
        h2 = 0x98badcfe,
        h3 = 0x10325476;

    var w = [], a, b, c, d, f, g, temp;

    // Process chunks of 512 bits
    for (var offset = 0; offset < totalLength; offset += (512/8)) {
      // break chunk into sixteen 32-bit words w[j], 0 ≤ j ≤ 15
      for (var i = 0; i < 16; i++) {
        w[i] = getAsWord(offset + (i * 4));
      }

      a = h0;
      b = h1;
      c = h2;
      d = h3;

      // main loop
      for (i = 0; i < 64; i++) {
        if (i < 16) {
          f = (b & c) | ((~b) & d);
          g = i;
        } else if (i < 32) {
          f = (d & b) | ((~d) & c);
          g = (5*i + 1) % 16;
        } else if (i < 48) {
          f = b ^ c ^ d;
          g = (3*i + 5) % 16;
        } else {
          f = c ^ (b | (~d));
          g = (7*i) % 16;
        }

        temp = d;
        d = c;
        c = b;
        b = b + leftrotate((a + f + k[i] + w[g]), r[i]);
        a = temp;
      }

      // update hash
      h0 = (h0 + a) & 0xffffffff;
      h1 = (h1 + b) & 0xffffffff;
      h2 = (h2 + c) & 0xffffffff;
      h3 = (h3 + d) & 0xffffffff;
    }

    // digest := h0 append h1 append h2 append h3 (in little-endian)
    var digest = new Uint8Array(16);
    putWord(h0, digest, 0);
    putWord(h1, digest, 4);
    putWord(h2, digest, 8);
    putWord(h3, digest, 12);

    return CoSeMe.utils.hex(digest);

    // The source of these two functions is the
    //   "complete stream" = message + padding
    // These functions allow to read without creating a concatenation of both
    // chunks.
    function getAsWord(offset) {
      var b3 = getFromCompleteStream(offset);
      var b2 = getFromCompleteStream(offset + 1);
      var b1 = getFromCompleteStream(offset + 2);
      var b0 = getFromCompleteStream(offset + 3);
      return (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
    }

    function getFromCompleteStream(offset) {
      if (offset < messageLength) {
        return dataView[offset] & 0xff;
      }
      else {
        return padding[offset - messageLength] & 0xff;
      }
    }

    function leftrotate(x, c) {
      return x << c | x >>> (32 - c);
    }

  };

  return CryptoJS;
}()));
CoSeMe.namespace('config', (function(){
  'use strict';

  return {
    logger: true,

    domain: 's.whatsapp.net',

    groupDomain: 'g.us',

    tokenData: {
      "v": "2.11.151",
      // should be tokenData[d] + - + tokenData[v] + - + port
      "r": "Android-2.11.151-5222",
      "u": "WhatsApp/2.11.151 Android/4.2.1 Device/GalaxyS3",
      "t": "PdA2DJyKoUrwLw1Bg6EIhzh502dF9noR9uFCllGk1377032097395{phone}",
      "d": "Android"
    },

    auth: {
      host: 'c2.whatsapp.net',
      port: 5222,
//      host: 'localhost',
//      port: 8080,
      connectionOptions: {
        binaryType: 'arraybuffer',
        useSSL: false,
        useSecureTransport: false
      },
      rc4Options: {
        drop: 768/4
      },
      pbkdf2Options: {
        keySize: (20*8) / 32,
        iterations: 2
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
      // This additional word is to "store" the sequence number and compute
      // the HMAC but the information is never sent.
      sizeInBytes = sizeOrUint32 + 4;
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

    rewind: function (numBytes) {
      for (var i = 0; i < numBytes; i++) {
        this.pop();
      }
    },

    pop: function () {
      var result = this.get(this.length - 1);
      var last = --this.array.sigBytes;
      // Set to 0: move a mask in the form 0x00ff0000, negate and make AND
      this.array.words[last >>> 2] &= ~(0xff << (24 - (last & 0x3) * 8));
      return result;
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
      return string?unescape(encodeURIComponent(string)):'';
    },

    /**
     * Decodes a UTF-8 message into a JS string.
     */
    stringFromUtf8: function(string) {
      return string?decodeURIComponent(escape(string)):'';
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
    return tree && tree.tag === name;
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

  Object.defineProperty(Tree.prototype, "tag", {
    get: function() {
      var value = this._tag;
      if (value && value.hexdata) {
        value = CryptoJS.enc.Latin1.stringify(CryptoJS.enc.Hex.parse(value.hexdata));
      };
      return value;
    },
    set: function(tag) {
      this._tag = tag;
    }
  });

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

  var primaryStrings = [
    '',
    '',
    '',
    'account',
    'ack',
    'action',
    'active',
    'add',
    'after',
    'all',
    'allow',
    'apple',
    'auth',
    'author',
    'available',
    'bad-protocol',
    'bad-request',
    'before',
    'body',
    'broadcast',
    'cancel',
    'category',
    'challenge',
    'chat',
    'clean',
    'code',
    'composing',
    'config',
    'contacts',
    'count',
    'create',
    'creation',
    'debug',
    'default',
    'delete',
    'delivery',
    'delta',
    'deny',
    'digest',
    'dirty',
    'duplicate',
    'elapsed',
    'enable',
    'encoding',
    'error',
    'event',
    'expiration',
    'expired',
    'fail',
    'failure',
    'false',
    'favorites',
    'feature',
    'features',
    'feature-not-implemented',
    'field',
    'first',
    'free',
    'from',
    'g.us',
    'get',
    'google',
    'group',
    'groups',
    'http://etherx.jabber.org/streams',
    'http://jabber.org/protocol/chatstates',
    'ib',
    'id',
    'image',
    'img',
    'index',
    'internal-server-error',
    'ip',
    'iq',
    'item-not-found',
    'item',
    'jabber:iq:last',
    'jabber:iq:privacy',
    'jabber:x:event',
    'jid',
    'kind',
    'last',
    'leave',
    'list',
    'max',
    'mechanism',
    'media',
    'message_acks',
    'message',
    'method',
    'microsoft',
    'missing',
    'modify',
    'mute',
    'name',
    'nokia',
    'none',
    'not-acceptable',
    'not-allowed',
    'not-authorized',
    'notification',
    'notify',
    'off',
    'offline',
    'order',
    'owner',
    'owning',
    'p_o',
    'p_t',
    'paid',
    'participant',
    'participants',
    'participating',
    'paused',
    'picture',
    'pin',
    'ping',
    'platform',
    'port',
    'presence',
    'preview',
    'probe',
    'prop',
    'props',
    'query',
    'raw',
    'read',
    'reason',
    'receipt',
    'received',
    'relay',
    'remote-server-timeout',
    'remove',
    'request',
    'required',
    'resource-constraint',
    'resource',
    'response',
    'result',
    'retry',
    'rim',
    's_o',
    's_t',
    's.us',
    's.whatsapp.net',
    'seconds',
    'server-error',
    'server',
    'service-unavailable',
    'set',
    'show',
    'silent',
    'stat',
    'status',
    'stream:error',
    'stream:features',
    'subject',
    'subscribe',
    'success',
    'sync',
    't',
    'text',
    'timeout',
    'timestamp',
    'to',
    'true',
    'type',
    'unavailable',
    'unsubscribe',
    'uri',
    'url',
    'urn:ietf:params:xml:ns:xmpp-sasl',
    'urn:ietf:params:xml:ns:xmpp-stanzas',
    'urn:ietf:params:xml:ns:xmpp-streams',
    'urn:xmpp:ping',
    'urn:xmpp:receipts',
    'urn:xmpp:whatsapp:account',
    'urn:xmpp:whatsapp:dirty',
    'urn:xmpp:whatsapp:mms',
    'urn:xmpp:whatsapp:push',
    'urn:xmpp:whatsapp',
    'user',
    'user-not-found',
    'value',
    'version',
    'w:g',
    'w:p:r',
    'w:p',
    'w:profile:picture',
    'w',
    'wait',
    'WAUTH-2',
    'x',
    'xmlns:stream',
    'xmlns',
    '1',
    'chatstate',
    'crypto',
    'enc',
    'class',
    'off_cnt',
    'w:g2',
    'promote',
    'demote',
    'creator'
  ];

  var secondaryStrings = [
    [
      'Bell.caf',
      'Boing.caf',
      'Glass.caf',
      'Harp.caf',
      'TimePassing.caf',
      'Tri-tone.caf',
      'Xylophone.caf',
      'background',
      'backoff',
      'chunked',
      'context',
      'full',
      'in',
      'interactive',
      'out',
      'registration',
      'sid',
      'urn:xmpp:whatsapp:sync',
      'flt',
      's16',
      'u8',
      'adpcm',
      'amrnb',
      'amrwb',
      'mp3',
      'pcm',
      'qcelp',
      'wma',
      'h263',
      'h264',
      'jpeg',
      'mpeg4',
      'wmv',
      'audio/3gpp',
      'audio/aac',
      'audio/amr',
      'audio/mp4',
      'audio/mpeg',
      'audio/ogg',
      'audio/qcelp',
      'audio/wav',
      'audio/webm',
      'audio/x-caf',
      'audio/x-ms-wma',
      'image/gif',
      'image/jpeg',
      'image/png',
      'video/3gpp',
      'video/avi',
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/x-flv',
      'video/x-ms-asf',
      '302',
      '400',
      '401',
      '402',
      '403',
      '404',
      '405',
      '406',
      '407',
      '409',
      '500',
      '501',
      '503',
      '504',
      'abitrate',
      'acodec',
      'app_uptime',
      'asampfmt',
      'asampfreq',
      'audio',
      'bb_db',
      'clear',
      'conflict',
      'conn_no_nna',
      'cost',
      'currency',
      'duration',
      'extend',
      'file',
      'fps',
      'g_notify',
      'g_sound',
      'gcm',
      'google_play',
      'hash',
      'height',
      'invalid',
      'jid-malformed',
      'latitude',
      'lc',
      'lg',
      'live',
      'location',
      'log',
      'longitude',
      'max_groups',
      'max_participants',
      'max_subject',
      'mimetype',
      'mode',
      'napi_version',
      'normalize',
      'orighash',
      'origin',
      'passive',
      'password',
      'played',
      'policy-violation',
      'pop_mean_time',
      'pop_plus_minus',
      'price',
      'pricing',
      'redeem',
      'Replaced by new connection',
      'resume',
      'signature',
      'size',
      'sound',
      'source',
      'system-shutdown',
      'username',
      'vbitrate',
      'vcard',
      'vcodec',
      'video',
      'width',
      'xml-not-well-formed',
      'checkmarks',
      'image_max_edge',
      'image_max_kbytes',
      'image_quality',
      'ka',
      'ka_grow',
      'ka_shrink',
      'newmedia',
      'library',
      'caption',
      'forward',
      'c0',
      'c1',
      'c2',
      'c3',
      'clock_skew',
      'cts',
      'k0',
      'k1',
      'login_rtt',
      'm_id',
      'nna_msg_rtt',
      'nna_no_off_count',
      'nna_offline_ratio',
      'nna_push_rtt',
      'no_nna_con_count',
      'off_msg_rtt',
      'on_msg_rtt',
      'stat_name',
      'sts',
      'suspect_conn',
      'lists',
      'self',
      'qr',
      'web',
      'w:b',
      'recipient',
      'w:stats',
      'forbidden',
      'aurora.m4r',
      'bamboo.m4r',
      'chord.m4r',
      'circles.m4r',
      'complete.m4r',
      'hello.m4r',
      'input.m4r',
      'keys.m4r',
      'note.m4r',
      'popcorn.m4r',
      'pulse.m4r',
      'synth.m4r',
      'filehash'
    ]
  ];

  var secondaryStringStart = 236;
  var secondaryStringEnd = secondaryStringStart + secondaryStrings.length;

  var primaryMap = {};
  for (var text, i = 0, l = primaryStrings.length; i < l; i++) {
    text = primaryStrings[i];
    text && (primaryMap[text] = i);
  }

  var secondaryMap = {};
  for (var subList, d = 0, l = secondaryStrings.length; d < l; d++) {
    subList = secondaryStrings[d];
    for (var text, i = 0, ll = subList.length; i < ll; i++) {
      text = subList[i];
      text && (secondaryMap[text] = [d + 236, i]);
    }
  }

  // Return an object {submap, code}. If `submap` is null
  // the token belongs to the primary strings.
  function token2Code(token) {
    var pair, result = { submap: null, code: null };
    if (primaryMap.hasOwnProperty(token)) {
      result.code = primaryMap[token];

    } else if (secondaryMap.hasOwnProperty(token)) {
      pair = secondaryMap[token];
      result.submap = pair[0];
      result.code = pair[1];
    }

    return result;
  }

  // Return an object {token, submap}. Due to the particular form of encoding
  // tokens, you should try to call this function with no submap. Then, if
  // `token` key is null, read the next byte and call code2Token() again passing
  // the read value as token and the value of submap key from the former call as
  // submap.
  function code2Token(code, submap) {
    var array, result = { token: null, submap: null };

    // Called with only code
    if (arguments.length === 1) {
      if (code >= secondaryStringStart && code < secondaryStringEnd) {
        result.submap = code - secondaryStringStart;
      } else {
        array = primaryStrings;
      }

    // Called with code and submap
    } else {
      if (submap > secondaryStrings.length) {
        throw new Error('Invalid subdictionary: ' + submap);
      }
      array = secondaryStrings[submap];
    }

    // If array, get the token
    if (array) {
      if (code < 0 || code >= array.length) {
        throw new Error('Invalid token: ' + code);
      } else if (!array[code]) {
        throw new Error('Invalid token or length');
      }
      result.token = array[code];
    }

    return result;
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
    var dictionaryVersion = 4; // my guess: the dictionary version

    this.resetBuffer(counting, IS_RAW);
    this.writeASCII('WA', counting);
    this.writeByte(STREAM_START, counting);
    this.writeByte(dictionaryVersion, counting);
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
    task._socket = this._socket; // Copy the current socket to the task to
                                 // ensure this task put its data on the current
                                 // socket and not in a future one (i.e a new
                                 // one as a result of a reconnection).
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

    var result = token2Code(string);
    if (result.code !== null) {
      if (result.submap !== null) {
        this.writeToken(result.submap, counting);
      }
      this.writeToken(result.code, counting);
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
   * Writes bytes from a JavaScript (latin1) string, an ArrayBuffer or any
   * type with a buffer property of type ArrayBuffer like ArrayBufferView
   * instances.
   */
  BinaryWriter.prototype.writeBytes = function(data, counting) {
    var bytes;
    if (typeof data === 'string') {
      bytes = CoSeMe.utils.bytesFromLatin1(data);

    } else if (data instanceof ArrayBuffer) {
      bytes = new Uint8Array(data);

    } else if (data && data.buffer instanceof ArrayBuffer) {
      bytes = new Uint8Array(data.buffer);

    } else {
      var fallback = data === null || data === undefined ? '' : data.toString();
      logger.error('Expecting string, ArrayBuffer or ArrayBufferView-like' +
                    'object. A', data.constructor.name, 'received instead.');
      bytes = CoSeMe.utils.bytesFromLatin1(fallback);
    }

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

      var error = null, socketState = this._socket.readyState;
      if (socketState === 'open') {
        // With these offset and length we omit the header and trailing
        // paddings.
        this._socket.send(out.buffer, offset, realOutLength);
      } else {
        logger.warn('Can not write. Socket state:', socketState);
        error = 'socket-non-ready';
      }
      (typeof this._callback === 'function') && this._callback(error);
    } catch (x) {
      var socketState = this._socket.readyState;
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
    var encryptedFlag = this.isEncrypted() ? 0x80 : 0x00;
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
    task.sourceSocket = this.socket;
    this.finishReading();

    return task;
  };

  /**
   * Parses the start of the protocol. If all goes well, call onStreamStart()
   * with null as error. It can return an Error with 'Expecting STREAM_START'
   * if the start of the stream is not correctly parsed.
   */
  BinaryReader.prototype._readStreamStart = function() {
    var listMark = this.message.read();
    var listSize = this.readListSize(listMark);
    var tree, tag = this.message.read();
    var err = null;
    if (tag === STREAM_START) {
      var attributeCount = (listSize - 2 + listSize % 2) / 2;
      tree = new Tree('start', {
        attributes: this.readAttributes(attributeCount)
      });

    // Bad stanza
    } else {
      err = new Error('Expecting STREAM_START');
      logger.error(err);
    }

    this.dispatchResult(err, tree, 'onStreamStart');
  };

  /**
   * Parses a tree and calls onTree(err, tree) with null as error and the
   * parsed tree if all goes well or with err set to a SyntaxError if not.
   */
  BinaryReader.prototype._readNextTree = function() {
    var err = null, tree;
    try {
      tree = this.readTree();
      logger.log(tree ? tree.toString() : tree + '');

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
    var currentSocket = Object.getPrototypeOf(this).socket;
    while (args = this.pendingTrees.shift()) {

      err = args[0];
      tree = args[1];
      callbackName = args[2];

      setTimeout((function _processTree(callbackName, err, tree) {
        if (this.sourceSocket !== currentSocket) { return; }

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
        var b2 = this.readIncoming(); // flags and high order bits of size
        var b1 = this.readIncoming();
        var b0 = this.readIncoming();
        this.stanzaSize = ((b2 & 0x0f) << 16) + (b1 << 8) + b0;
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
    }

    this.message = new ByteArray(messageLength);
    for (var i = 0; i < messageLength; i++) {
      this.message.write(this.readIncoming());
    }

    if (this.isEncrypted) {
      this.mac = new ByteArray(MAC_LENGTH);
      for (var i = 0; i < MAC_LENGTH; i++) {
        this.mac.write(this.readIncoming());
      }
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

    if (stringMark === 0) {
      string = '';

    // The string is efficently encoded as a token.
    } else if (stringMark > 2 && stringMark < 245) {
      var code = stringMark;
      string = this.getToken(code);

    // Still a token but with a surrogate mark.
    } else if (stringMark === SURROGATE_MARK) {
      var code = this.message.read();
      string = this.getToken(code + 245);

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
    var result = code2Token(code);
    if (result.token === null) {
      code = this.readInt8();
      result = code2Token(code, result.submap);
    }
    return result.token;
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
      xhr.onload = function() {
        logger.log(this.response);
        onready && onready.call(this, this.response);
      };
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

  function getToken(phone) {
    var signature = atob(
      'MIIDMjCCAvCgAwIBAgIETCU2pDALBgcqhkjOOAQDBQAwfDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFDASBgNVBAcTC1NhbnRhIENsYXJhMRYwFAYDVQQKEw1XaGF0c0FwcCBJbmMuMRQwEgYDVQQLEwtFbmdpbmVlcmluZzEUMBIGA1UEAxMLQnJpYW4gQWN0b24wHhcNMTAwNjI1MjMwNzE2WhcNNDQwMjE1MjMwNzE2WjB8MQswCQYDVQQGEwJVUzETMBEGA1UECBMKQ2FsaWZvcm5pYTEUMBIGA1UEBxMLU2FudGEgQ2xhcmExFjAUBgNVBAoTDVdoYXRzQXBwIEluYy4xFDASBgNVBAsTC0VuZ2luZWVyaW5nMRQwEgYDVQQDEwtCcmlhbiBBY3RvbjCCAbgwggEsBgcqhkjOOAQBMIIBHwKBgQD9f1OBHXUSKVLfSpwu7OTn9hG3UjzvRADDHj+AtlEmaUVdQCJR+1k9jVj6v8X1ujD2y5tVbNeBO4AdNG/yZmC3a5lQpaSfn+gEexAiwk+7qdf+t8Yb+DtX58aophUPBPuD9tPFHsMCNVQTWhaRMvZ1864rYdcq7/IiAxmd0UgBxwIVAJdgUI8VIwvMspK5gqLrhAvwWBz1AoGBAPfhoIXWmz3ey7yrXDa4V7l5lK+7+jrqgvlXTAs9B4JnUVlXjrrUWU/mcQcQgYC0SRZxI+hMKBYTt88JMozIpuE8FnqLVHyNKOCjrh4rs6Z1kW6jfwv6ITVi8ftiegEkO8yk8b6oUZCJqIPf4VrlnwaSi2ZegHtVJWQBTDv+z0kqA4GFAAKBgQDRGYtLgWh7zyRtQainJfCpiaUbzjJuhMgo4fVWZIvXHaSHBU1t5w//S0lDK2hiqkj8KpMWGywVov9eZxZy37V26dEqr/c2m5qZ0E+ynSu7sqUD7kGx/zeIcGT0H+KAVgkGNQCo5Uc0koLRWYHNtYoIvt5R3X6YZylbPftF/8ayWTALBgcqhkjOOAQDBQADLwAwLAIUAKYCp0d6z4QQdyN74JDfQ2WCyi8CFDUM4CaNB+ceVXdKtOrNTQcc0e+t'
    );
    var classesMd5 = atob('94bjoO7brhy/QJZRceJHYw==');
    var key2 = atob('/UIGKU1FVQa+ATM2A0za7G2KI9S/CwPYjgAbc67v7ep42eO/WeTLx1lb1cHwxpsEgF4+PmYpLd2YpGUdX/A2JQitsHzDwgcdBpUf7psX1BU=');
    var data = CryptoJS.enc.Latin1.parse(signature + classesMd5 + phone);

    var opad = new Uint8Array(64);
    var ipad = new Uint8Array(64);
    for (var i = 0; i < 64; i++) {
      opad[i] = 0x5C ^ key2.charCodeAt(i);
      ipad[i] = 0x36 ^ key2.charCodeAt(i);
    }
    ipad = CryptoJS.enc.UInt8Array.parse(ipad);
    opad = CryptoJS.enc.UInt8Array.parse(opad);

    var output = CryptoJS.SHA1(
      opad.concat(CryptoJS.SHA1(ipad.concat(data)))
    );

    return output.toString(CryptoJS.enc.Base64);
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
      params['to'] = countryCode + phone;
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

    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.setRequestHeader('User-Agent', CoSeMe.config.tokenData.u);

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

  function upload(toJID, blob, uploadUrl,
                  successCb, errorCb, progressCb, sizeToHash) {
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
      reader.addEventListener('loadend', function() {
        var buffer = reader.result;
        sizeToHash = typeof sizeToHash === 'undefined' ?
                     buffer.byteLength :
                     Math.min(sizeToHash, buffer.byteLength);
        var md5 = CoSeMe.crypto.MD5_IP(buffer.slice(0, sizeToHash));
        var crypto = md5 + '.' + filetype.split('/')[1];
        logger.log('MD5+ext:', crypto);
        onCryptoReady(crypto, reader.result);
      })
      reader.readAsArrayBuffer(blob);

      function onCryptoReady(crypto, blobAsArrayBuffer) {
        var boundary = 'zzXXzzYYzzXXzzQQ';
        var contentLength = 0;

        /**
         * Header BAOS
         */
        var hBAOS = '--' + boundary + '\r\n';
        hBAOS += 'Content-Disposition: form-data; name="to"\r\n\r\n';
        hBAOS += toJID + '\r\n';
        hBAOS += '--' + boundary + '\r\n';
        hBAOS += 'Content-Disposition: form-data; name="from"\r\n\r\n';
        hBAOS += CoSeMe.yowsup.connectionmanager.jid.replace('@whatsapp.net', '') + '\r\n';

        hBAOS += '--' + boundary + '\r\n';
        hBAOS += 'Content-Disposition: form-data; name="file"; filename="' + crypto + '"\r\n';
        hBAOS += 'Content-Type: ' + filetype + '\r\n\r\n';

        /**
         * Final BAOS
         */
        var fBAOS = '\r\n--' + boundary + '--\r\n';

        contentLength += hBAOS.length;
        contentLength += fBAOS.length;
        contentLength += blob.size;

        /**
         * Initial data to be sent
         */
        var POST = 'POST ' + uploadUrl + '\r\n';
        POST += 'Content-Type: multipart/form-data; boundary=' + boundary + '\r\n';
        POST += 'Host: ' + host + '\r\n';
        POST += 'User-Agent: ' + CoSeMe.config.tokenData.u + '\r\n';
        POST += 'Content-Length: ' + contentLength + '\r\n\r\n';

        /**
         * Send initial data and header BAOS
         */
        logger.log('Sending headers...');

        logger.log('POST:', POST);
        _socket.send(_str2ab(POST));

        logger.log('hBAOS:', hBAOS);
        _socket.send(_str2ab(hBAOS));

        logger.log('Sending body of ', blob.size, 'bytes...');
        sendBody(function _sendFinale() {
            _socket.send(_str2ab(fBAOS));
            logger.log('All sent. Have fun with _socket.ondata()!');
        });

        function sendBody(callback, offset) {
          offset = offset || 0;
          var chunksize = Math.min(1024, blob.size - offset);
          var waitForDrain = false;

          var MAX_LOOP_TIME = 20; // 20ms (50fps)
          var tooMuchTime = false;
          var startTime = Date.now();

          while(offset < blob.size && !waitForDrain && !tooMuchTime) {
            logger.log('Next', chunksize, 'bytes sent!');
            waitForDrain = !_socket.send(blobAsArrayBuffer, offset, chunksize);
            offset += chunksize;
            tooMuchTime = (Date.now() - startTime) > MAX_LOOP_TIME;
          }

          var completed = 100 * Math.min(1, offset / blob.size);
          progressCb && setTimeout(progressCb.bind(null, completed));
          logger.log(completed.toFixed(2), '% completed!');

          if (offset >= blob.size) {
            logger.log('All data sent!');
            _socket.ondrain = undefined;
            callback && setTimeout(callback);
          } else if (waitForDrain) {
            logger.log('Waiting for drain before continuing...');
            _socket.ondrain = sendBody.bind(null, callback, offset);
          } else {
            logger.log('Too much time on the loop. Releasing CPU...');
            setTimeout(sendBody, 0, callback, offset);
          }
        }
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
          return undefined;
        }
        var a = datalatin1.substring(idx, datalatin1.indexOf('\r\n', idx));
        var b = a.split(':')[1];
        contentLength = parseInt(b, 10);
        logger.log('Content length:', contentLength);
        return contentLength;
      })();

      var body = '';
      if (typeof contentLength === 'number') {
        body = (function() {
          logger.log('Current data:', datalatin1);
          var rv = datalatin1.substring(datalatin1.length - contentLength,
                                        datalatin1.length);
          if (rv.length !== contentLength) {
            rv = undefined;
          }
          return rv;
        })();
      }

      if (datalatin1.length > MAX_UPLOAD_BODY_ANSWER ||
           typeof body === 'string') {
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

    options = options || {};
    var socket = navigator.mozTCPSocket.open(host, port, options);
    socket.onerror = function _connectionError() {
      onError && onError('connection-refused');
    };
    socket.onopen = function _connectionSuccess() {
      _connection.socket = socket;
      setErrorHandlers();
      setBinaryStreams();
      onSuccess && onSuccess.apply(this, arguments);
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
        handler.apply(_connection, arguments);
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
  'use strict'

  var logger = new CoSeMe.common.Logger('auth');
  var ByteArray = CoSeMe.utils.ByteArrayWA;
  var Tree = CoSeMe.protocol.Tree;

  var username, password, callback;
  var connection, outputKey;
  var authenticated = false;

  function authenticate(user, pass, cb) {
    username = user;
    password = pass;
    callback = cb;
    openConnection(function _onConnection(err, validConnection) {
      if (err) {
        return callback(err);
      }

      connection = validConnection;
      tryLogin(function _onLogin(err) {
        // Try to authenticate if we have a one-shot-rejected error, instead of
        // bubbling it up to the app
        if (err === 'one-shot-rejected') {
          authenticate(username, password, callback);
          return;
        }

        if (err) {
          return callback(err);
        }

        // On authenticated, pause the reader, establish the output key and
        // call the callback with the established connection.
        authenticated = true;
        connection.reader.suspend();
        connection.reader.onStreamStart = undefined;
        connection.reader.onTree = undefined;
        connection.writer.outputKey = outputKey;
        connection.jid = username + '@' + CoSeMe.config.domain;
        callback(null, connection);
      });
    });
  }

  function openConnection(callback) {
    var connection = new CoSeMe.connection.Connection();
    var host = CoSeMe.config.auth.host;
    var port = CoSeMe.config.auth.port;
    var connectionOptions = CoSeMe.config.auth.connectionOptions;

    logger.log('Connecting to:', host + ':' + port);
    connection.connect(
      host, port, connectionOptions,
      onConnected, onError
    );

    function onConnected () {
      callback && callback(null, connection);
    }

    function onError () {
      callback && callback('connection-refused');
    }
  }

  function tryLogin(callback) {
    logger.log('Starting login...');

    var domain = CoSeMe.config.domain;
    var resource = CoSeMe.config.tokenData.r;

    logger.log('Sending stream start, features & authentication');
    connection.writer.streamStart(domain, resource);
    connection.writer.write(getFeatures());
    connection.writer.write(getAuth(getNextChallenge()));

    waitForAnswer(function _onAnwser(loggingError) {
      if (loggingError) {
        switch (loggingError) {

          // Retry with no challenge
          case 'one-shot-rejected':
          // Authentication failed
          case 'auth-failed':
          case 'expired':
            return callback(loggingError);
          break;

          // Other stream errors
          default:
            logger.error('<stream:error>', loggingError);
            return callback(loggingError);
        }
      }

      callback(null);
    });
  }

  // Possible errors:
  //   'auth-failed' -> if authentication has failed
  //   'expired' -> if the account has expired
  //   'one-shot-rejected' -> if the one shot auth has failed
  //   <other> -> if <stream:error> received
  function waitForAnswer(callback) {
    logger.log('Waiting for stream start...');

    connection.reader.onStreamStart = _processAnswer;
    connection.reader.onTree = _processAnswer;
    connection.reader.startListening(connection);

    function _processAnswer(err, tree) {
      if (err) {
        return callback(err);
      }

      if (!tree) { return; }

      switch (tree.tag) {
        case 'stream:error':
          var streamError = tree.getChild('text').data;
          logger.error(streamError);
          callback(streamError);
        break;

        case 'start':
          logger.log('Got stream start! Waiting for challenge...');
        break;

        case 'stream:features':
          logger.log('Got the features.');
        break;

        case 'challenge':
          logger.log('Got the challenge! Sending answer...');
          sendResponseFor(tree.data);
        break;

        case 'failure':
          retryOrFail();
        break;

        case 'success':
          readSuccess(tree);
        break;

        default:
          logger.warn('Unexpected auth tree: ', tree.tag);
        break;
      }

      function sendResponseFor(challenge) {
        var authBlob = getAuthBlob(challenge);
        var response = new Tree('response', { attributes: {
          xmlns: 'urn:ietf:params:xml:ns:xmpp-sasl'
        }, data: authBlob });
        connection.writer.write(response);
      }

      function retryOrFail() {
        if (getNextChallenge() !== null) {
          logger.log('Looks like the one-shot challenge failed.' +
                     'Trying with no-challenge.');
          setNextChallenge(null);
          return callback('one-shot-rejected');
        }
        logger.log('Authentication failed!');
        callback('auth-failed');
      }

      function readSuccess(successTree) {
        if (successTree.getAttributeValue('status') === 'expired') {
          logger.warn('The accound has expired.');
          return callback('expired');
        }
        logger.log('Authentication success!');
        setNextChallenge(successTree.data);
        callback(null);
      }
    }
  }

  // challenge in Latin1
  function getAuthBlob(challenge) {
    var keys = CoSeMe.auth.KeyStream.getKeys(password, challenge);

    // Setup KeyStreams
    connection.reader.inputKey =
      new CoSeMe.auth.KeyStream(keys.inputKey, keys.inputHMAC, 'input');
    outputKey =
      new CoSeMe.auth.KeyStream(keys.outputKey, keys.outputHMAC, 'output');

    // Setup response
    var utcNow = CryptoJS.enc.Latin1.parse(CoSeMe.time.utcTimestamp() + '');
    var msg = CryptoJS.enc.Latin1.parse(username);
    msg.concat(CryptoJS.enc.Latin1.parse(challenge));
    msg.concat(utcNow);
    msg.concat(CryptoJS.enc.Latin1.parse(CoSeMe.config.tokenData.u));
    msg.concat(CryptoJS.enc.Latin1.parse(' MccMnc/000000'));

    // Encode response
    var buffer = new ByteArray(msg.sigBytes).writeAll(msg);
    var encoded = outputKey.encodeMessage(buffer);

    // Prepare the complete mac + message buffer: signedBuffer
    var macLength = CoSeMe.config.auth.hmacLength;
    var signedBuffer = new ByteArray(macLength + encoded.text.array.sigBytes);
    for (var i = 0; i < macLength; i++) {
      signedBuffer.write(encoded.hmacSHA1.get(i));
    }
    return CryptoJS.enc.Latin1.stringify(
      signedBuffer.writeAll(encoded.text.array).array
    );
  }

  function getFeatures() {
    var features = [
      new Tree('receipt_acks'),
      new Tree('w:profile:picture', { attributes: {
        type: 'all'
      }}),
      new Tree('w:profile:picture', { attributes: {
        type: 'group'
      }}),
      new Tree('notification', { attributes: {
        type: 'participant'
      }}),
      new Tree('status', { attributes: {
        notification: 'true'
      }})
    ];

    return new Tree('stream:features', { children: features });
  };

  function getAuth(existingChallenge) {
    var data = '';
    if (existingChallenge) {
      logger.log('There is a existing challenge, trying one-shot auth!');
      data = getAuthBlob(existingChallenge);
    }
    return new Tree('auth', { attributes: {
      xmlns: 'urn:ietf:params:xml:ns:xmpp-sasl',
      mechanism: 'WAUTH-2',
      user: username
    }, data: data });
  };

  var nextChallengeSetting = '__cosemeNextChallenge';

  function getNextChallenge() {
    return localStorage.getItem(nextChallengeSetting);
  }

  function setNextChallenge(value) {
    if (value === null) {
      localStorage.removeItem(nextChallengeSetting);
    }
    else {
      localStorage.setItem(nextChallengeSetting, value);
    }
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
   * @param key is a ByteArrayWA
   */
  function KeyStream(key, macKey, name) {
    this.sequence = 0;
    this.name = name;
    this.key = key;
    this.macKey = macKey;
    this.encryptor = CryptoJS.algo.RC4WP.createEncryptor(
      this.key, CoSeMe.config.auth.rc4Options
    );
  };

  /**
   * Multiplex the nonce to be 4 and return the set of incoming / outgoing
   * and incoming hmac / outgoing hmac keys.
   *  - password is provided as base64 data
   *  - nonce is provided as a Latin1 string
   */
  KeyStream.getKeys = function(password, nonce) {
    try {
      logger.log('nonce (latin1):', nonce);
      logger.log('password (base64):', password);

      password = CryptoJS.enc.Base64.parse(password);
      var variations = {
        outputKey:  '\x01',
        outputHMAC: '\x02',
        inputKey:   '\x03',
        inputHMAC:  '\x04'
      };

      var keys = {};
      Object.keys(variations).forEach(function _calcKey(name) {
        var variation = variations[name];
        var salt = CryptoJS.enc.Latin1.parse(nonce + variation);
        var key = CryptoJS.PBKDF2(
          password, salt,
          CoSeMe.config.auth.pbkdf2Options
        );
        keys[name] = key;
      });
      logger.log('Keys:', keys);
      return keys;

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

    var hmacCal = this.computeMac(cipherTxt).toString(CryptoJS.enc.Hex);

    var hmacTxt = CryptoJS.enc.Hex.stringify(aHmacSHA1.array);

    if (hmacTxt !== hmacCal.substring(0, hmacTxt.length)) {
      logger.error('INVALID MAC!');
      throw new Error('Invalid MAC');
    }

    var cipherData = cipherTxt.array;
    var plainTxt = this.encryptor.finalize(cipherData);

    return cipherTxt;
  };

  /**
   * @param aMsg plainText
   * @return {text: RC4WP(msg), hmacSHA1: HmacSHA1(RC4WP(msg)) }
   */
  // aMsg is a ByteArrayWA, since now...
  // Oh, and it modifies it in place! Copies suck!
  KeyStream.prototype.encodeMessage = function(aMsg) {

    // In place encryption! This modifies cipherwords also!
    var cipherwords = aMsg.array;
    this.encryptor.finalize(cipherwords);
    var hash = this.computeMac(aMsg);

    return {
      text: aMsg,
      hmacSHA1: new ByteArrayWA(hash.sigBytes).writeAll(hash)
    };
  };

  KeyStream.prototype.computeMac = function (message) {
    // Progressive HMAC is not supported with HmacSHA1_IP in order to avoid
    // copies so we need to append the sequence number (4-byte number),
    // calculate the hash and then remove the sequence.
    message.write(this.sequence, 4);
    var hash = CryptoJS.HmacSHA1_IP(message.array, this.macKey);
    message.rewind(4);
    this.sequence++;
    return hash;
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
      }
    },

    error: function(iqType, idx, node) {
      if (idx in _requests) {
        _requests[idx](node);
        delete _requests[idx];
      }
    },

    get: function(iqType, idx, node) {
      var childNode = node.getChild(0);
      if (childNode.getAttributeValue('xmlns') === 'urn:xmpp:ping') {
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
        var idx = node.getAttributeValue('id') || '';
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
          var status = stringFromUtf8(node.getAttributeValue('status'));

          if (status == 'dirty') {
            //categories = self.parseCategories(node); #@@TODO, send along with signal
            logger.log('Will send DIRTY');
            _signalInterface.send('status_dirty');
            logger.log('DIRTY sent');
          }
        }

      } else if (ProtocolTreeNode.tagEquals(node, 'message')) {
        parseMessage(node);

      } else if (ProtocolTreeNode.tagEquals(node, 'receipt')) {
        var toAttribute = node.getAttributeValue('to');
        var fromAttribute = node.getAttributeValue('from');
        var msgId = node.getAttributeValue('id');
        var type = node.getAttributeValue('type');
        var participant = node.getAttributeValue('participant');

        if (!fromAttribute || !msgId) {
          logger.error('Malformed receipt, can not determine the origin.');
          return;
        }

        var params = [
          fromAttribute,
          msgId,
          type,
          participant,
          toAttribute
        ];

        if (fromAttribute == "s.us") {
          _signalInterface.send("profile_setStatusSuccess", ["s.us", msgId]);
          return;
        }
        _signalInterface.send("receipt_messageDelivered", params);
        return;

      } else if (ProtocolTreeNode.tagEquals(node, 'chatstate')) {
        var from = node.getAttributeValue('from');
        var signal;
        if (node.getChild('composing')) {
          signal = 'contact_typing';

        } else if (node.getChild('paused')) {
          signal = 'contact_paused';

        }
        _signalInterface.send(signal, [from])

      } else if (ProtocolTreeNode.tagEquals(node, 'ack')) {
        var klass = node.getAttributeValue('class');
        var from = node.getAttributeValue('from');
        var id = node.getAttributeValue('id');
        if (klass === 'message' && from) {
          _signalInterface.send('receipt_messageSent', [from, id]);
        }

      } else if (ProtocolTreeNode.tagEquals(node, 'notification')) {
        var type = node.getAttributeValue('type');
        var from = node.getAttributeValue('from');
        var timestamp = parseInt(node.getAttributeValue("t"), 10);
        var msgId = node.getAttributeValue('id');

        if (type === 'participant') {
          var notification = 'notification_groupParticipant';
          var action = node.getChild(0).tag;
          var jid = node.getChild(0).getAttributeValue('jid');

          if (action === 'add') {
            notification += 'Added';

          } else if (action === 'remove') {
            notification += 'Removed';

          } else {
            console.error('Participant notification not understood');
          }

          _signalInterface
            .send(notification, [from, jid, null, timestamp, msgId, null]);

        } else if (type === 'picture') {
          var prefix = from.indexOf('-') >= 0 ? 'group' : 'contactProfile';
          var notification = 'notification_' + prefix + 'Picture';
          var action = node.getChild(0).tag;
          var pictureId = node.getChild(0).getAttributeValue('id');
          var author = node.getChild(0).getAttributeValue('author');

          if (action === 'set') {
            notification += 'Updated';

          } else if (action === 'delete') {
            notification += 'Removed';

          } else {
            console.error('Picture notification not understood');
          }

          _signalInterface
            .send(notification, [from, timestamp, msgId, pictureId, author]);
        }
        else if (type === 'subject') {
          var displayName = node.getAttributeValue('notify');
          var notification = 'notification_group';
          var bodyNode = node.getChild(0);
          var author = node.getAttributeValue('participant');
          notification += bodyNode.getAttributeValue('event') === 'add' ?
                          'Created' : 'SubjectUpdated';

          var subject = stringFromUtf8(bodyNode.data);

          _signalInterface
            .send(notification, [from, timestamp, msgId, subject, displayName,
                                 author]);
        }
        else if (type === 'status') {
          
          _signalInterface.send('notification_status', [from, msgId]);
          
        }

      }

    } catch (x) {
      logger.error(x);
      // Should probably do something here...
    }
  }

  function parseMessage(messageNode) {
    var bodyNode = messageNode.getChild("body"),
        newSubject = bodyNode ? stringFromUtf8(bodyNode.data) : "",
        msgData = null,
        timestamp = Number(messageNode.getAttributeValue("t")).valueOf(),
        isGroup = false,
        isBroadcast = false,
        fromAttribute = messageNode.getAttributeValue("from"),
        author = messageNode.getAttributeValue("participant"),
        pushName = messageNode.getAttributeValue('notify'),
        msgId = messageNode.getAttributeValue("id"),
        attribute_t = messageNode.getAttributeValue("t"),
        typeAttribute = messageNode.getAttributeValue("type"),
        wantsReceipt = false;

    pushName = pushName && stringFromUtf8(pushName);

    logger.log("Parsing message:",  messageNode);

    function processMedia(childNode) {
      var mediaUrl = childNode.getAttributeValue("url");
      var mediaType = childNode.getAttributeValue("type");
      var mediaSize = childNode.getAttributeValue("size");
      var encoding = childNode.getAttributeValue("encoding");
      var mediaPreview = childNode.data;
      var wantsReceipt = true;

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
      } else if (ProtocolTreeNode.tagEquals(childNode,"media") && msgId) {
        logger.log("Multimedia message!");
        processMedia(childNode);

      } else if (ProtocolTreeNode.tagEquals(childNode, "body") && msgId) {
        msgData = childNode.data;

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

      text: function() {
        wantsReceipt = false;
        var messageChildren = messageNode.children || [];
        messageChildren.forEach(processChildNode);
      },

      media: function() {
        wantsReceipt = true;
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

    try {
      parser[typeAttribute]();
    } catch (x) {
      logger.error(x);
      throw new Error("Unknown type of message:" + typeAttribute + "!");
    }

    if (msgData) {
      // Change the UTF-8 representation to the internal JS representation
      msgData = stringFromUtf8(msgData);
      wantsReceipt = true;
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
      var subject = stringFromUtf8(groupNode.getAttributeValue("subject"));
      var subjectT = groupNode.getAttributeValue("s_t");
      var subjectOwner = groupNode.getAttributeValue("s_o");
      var creation = groupNode.getAttributeValue("creation");

      _signalInterface.send("group_gotInfo",[jid, owner, subject, subjectOwner, subjectT, creation]);
    }
  }

  function parseGetGroups(node) {
    var groups = [];
    var id = node.getAttributeValue('id');
    node.children.forEach(function (groupNode) {
      groups.push({
        gid: groupNode.getAttributeValue('id'),
        subject: stringFromUtf8(groupNode.getAttributeValue('subject'))
      });
    });
    _signalInterface.send('group_gotParticipating', [groups, id]);
  }

  function parseGetPicture(node) {
    var jid = node.getAttributeValue("from");
    var isGroup = jid.contains('-');
    if (node.getAttributeValue('type') === 'error') {
      _signalInterface.send(isGroup ?
                            'group_gotPicture' :
                            'contact_gotProfilePicture', [jid, null, null]);
      return;
    }
    var  pictureNode = node.getChild("picture");
    if (pictureNode) {
      var picture = CoSeMe.utils.latin1ToBlob(pictureNode.data, 'image/jpeg');
      var pictureId = Number(pictureNode.getAttributeValue('id')).valueOf();
      if (isGroup) {
        _signalInterface.send("group_gotPicture", [jid, pictureId, picture]);
      } else {
        _signalInterface.send(
          "contact_gotProfilePicture", [jid, pictureId, picture]);
      }
    }
  }

  function parseGroupCreated(node) {
    var id = node.getAttributeValue('id');
    if (node.getAttributeValue('type') === 'error') {
      var errorCode = node.getChild(0).getAttributeValue('code');
      _signalInterface.send('group_createFail', [errorCode, id]);

    } else {
      var groupNode = node.getChild(0);
      ProtocolTreeNode.require(groupNode, 'group');
      var groupId = groupNode.getAttributeValue('id');
      _signalInterface.send('group_createSuccess', [groupId + '@g.us', id]);
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
    var id = node.getAttributeValue('id');
    var jabberId = node.getAttributeValue("from");
    var prefix = (jabberId.indexOf('-') >= 0) ? 'group' : 'profile';
    var picNode = node.getChild("picture");
    var pictureId;

    if (node.getAttributeValue('type') === 'error') {
      _signalInterface.send(prefix + "_setPictureError", [0, id]);
    } else {
      pictureId = parseInt(picNode.getAttributeValue("id"), 10);
      _signalInterface.send(prefix + "_setPictureSuccess", [pictureId, id]);
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

    if (seconds !== null && jabberId !== null) {
      seconds = parseInt(firstChild.getAttributeValue("seconds"), 10);
      _signalInterface.send("presence_updated", [jabberId, seconds]);
    } else {
      logger.error("Malformed query result!");
    }
  }

  function parseContactsSync(node) {
    var inNode = node.getChild('sync') &&
                 node.getChild('sync').getChild('in');
    var outNode = node.getChild('sync') &&
                  node.getChild('sync').getChild('out');
    var registered = inNode ? inNode.children : [] ;
    var unregistered = outNode ? outNode.children : [];
    registered = registered.map(function (userNode) {
      return { phone: userNode.data, jid: userNode.getAttributeValue('jid') };
    });
    unregistered = unregistered.map(function (userNode) {
      return { phone: userNode.data, jid: userNode.getAttributeValue('jid') };
    });
    _signalInterface.send(
      'contacts_sync',
      [node.getAttributeValue('id'), registered, unregistered]
    );
  }

  function parseContactsStatus(node) {
    var statuses = {};
    var statusNode = node.getChild('status');
    var users = statusNode ? statusNode.children : [];
    users.forEach(function (userNode) {
      statuses[userNode.getAttributeValue('jid')] =
        stringFromUtf8(userNode.data);
    });
    _signalInterface.send(
      'contacts_gotStatus',
      [node.getAttributeValue('id'), statuses]
    );
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
        _connection.reader.resume();
        alive = true;
      } else {
        _connection.reader.onStreamStart = undefined;
        _connection.reader.onTree = undefined;
        _connection.onconnectionclosed = undefined;
        _connection.onconnectionlost = undefined;
        _connection = aSocket;
        alive = false;
      }
    },

    get requests() {
      return _requests;
    },

    parseRequestUpload: parseRequestUpload,

    parsePingResponse: parsePingResponse,

    parseGroupInfo: parseGroupInfo,

    parseGetGroups: parseGetGroups,

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

    parseContactsSync: parseContactsSync,

    parseContactsStatus: parseContactsStatus,

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
      return true;
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
      group_gotParticipating: [],
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
      notification_groupCreated: [],
      notification_groupSubjectUpdated: [],
      notification_groupPictureUpdated: [],
      notification_groupPictureRemoved: [],
      notification_groupParticipantAdded: [],
      notification_groupParticipantRemoved: [],
      notification_status: [],

      contact_gotProfilePictureId: [],
      contact_gotProfilePicture: [],
      contact_typing: [],
      contact_paused: [],
      contacts_sync: [],
      contacts_gotStatus: [],

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

      var messageNode = newProtocolTreeNode('message', {
        to: aJid,
        type: aChild.tag === 'media' ? 'media' : 'text', // TODO: See for vcard
        id: msgId
      }, messageChildren);

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

      var attributes = {
        xmlns: 'urn:xmpp:whatsapp:mms',
        type: mediaType,
        file: name,
        size: size,
        url: url
      };
      var thumbnail = aParams[4];
      if (thumbnail) {
        attributes.encoding = 'raw';
      }
      // TODO: AFAIK, this is not supported yet
      var live = aParams[5];
      if (live) {
        attributes.origin = 'live';
      }
      var seconds = aParams[6];
      if (seconds) {
        attributes.seconds = seconds.toString(10);
      }
      var mmNode = newProtocolTreeNode('media', {
        xmlns: 'urn:xmpp:whatsapp:mms',
        type: mediaType,
        file: name,
        size: size,
        url: url
      }, null, thumbnail);
      return mmNode;
    },

    sendReceipt: function(jid, mid) {
      self._writeNode(newProtocolTreeNode('receipt', {
        to: jid,
        id: mid
      }));
    },

    getReceiptAck: function(to, id, type, participant, from) {
      var attributes = {
        'class': 'receipt',
        type: type,
        id: id
      };
      to && (attributes.to = to);
      from && (attributes.from = from);
      participant && (attributes.participant = participant);

      return newProtocolTreeNode('ack', attributes);
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

    sendPong: function(aIdx) {
      var iqNode =
        newProtocolTreeNode('iq', {type: 'result', to: self.domain, id: aIdx});
      self._writeNode(iqNode);
    }
  };

  function sendChatState(aJid, aState, media) {
    var attributes = media ? { media: media } : undefined;
    var stateNode = newProtocolTreeNode(aState, attributes);
    var chatstateNode =
      newProtocolTreeNode('chatstate', { to: aJid }, [ stateNode ]);
    self._writeNode(chatstateNode);
  }

  function modifyGroupParticipants(aOperation, aCallback, aGjid, aParticipants) {
      var idx = self.makeId(aOperation + '_group_participants_');

      var participantNodes = [];
      aParticipants.forEach(function(aPart) {
        participantNodes.push(newProtocolTreeNode('participant', {
          jid: aPart
        }));
      });

      var operation =
        newProtocolTreeNode(aOperation, undefined, participantNodes);

      var iqNode = newProtocolTreeNode('iq', {
        id: idx,
        type: 'set',
        to: aGjid,
        xmlns: 'w:g'
      }, [operation]);

      self.readerThread.requests[idx] = aCallback;
      self._writeNode(iqNode);
  }


  function sendSetPicture(aJid, preview, aImageData) {
      var children = [];
      var idx = self.makeId('set_picture_');

      var picture = newProtocolTreeNode(
        'picture',
        { xmlns: 'w:profile:picture' },
        null,
        aImageData
      );
      children.push(picture);

      if (preview) {
        var thumb = newProtocolTreeNode(
          'picture',
          { type: 'preview' },
          null,
          preview
        );
        children.push(thumb);
      }

      var iqNode = newProtocolTreeNode(
        'iq',
        {
          id: idx,
          to: aJid,
          type: 'set',
          xmlns: 'w:profile:picture'
        },
        children,
        null
      );

      self.readerThread.requests[idx] = self.readerThread.parseSetPicture;
      self._writeNode(iqNode);
      return idx;
  }

  function sendGetPicture(aJid) {
    var id = self.makeId('get_picture_');
    var pictureNode = newProtocolTreeNode('picture');
    var iqNode = newProtocolTreeNode('iq', {
      id: id,
      type: 'get',
      to: aJid,
      xmlns: 'w:profile:picture'
    }, [pictureNode]);
    self.readerThread.requests[id] = self.readerThread.parseGetPicture;
    self._writeNode(iqNode);
  }

  function sendPostAuthentication() {
    sendClientConfig('android', 'en', 'US');
    sendGetServerProperties();
    sendGetGroups();
    //sendGetPrivacyList();
  }

  function sendClientConfig(platform, language, country) {
    logger.log('Sending client config...');
    var id = self.makeId('config_');
    var configNode = newProtocolTreeNode('config', {
      platform: platform,
      lg: language,
      lc: country,
      clear: '0'
    });
    var iqNode = newProtocolTreeNode('iq', {
      id: id,
      type: 'set',
      to: CoSeMe.config.domain,
      xmlns: 'urn:xmpp:whatsapp:push'
    }, [configNode]);
    self._writeNode(iqNode);
  }

  function sendGetServerProperties() {
    logger.log('Asking for server properties...');
    var id = self.makeId('get_server_properties_');
    var iqNode = newProtocolTreeNode('iq', {
      type: 'get',
      to: CoSeMe.config.domain,
      xmlns: 'w'
    }, [newProtocolTreeNode('props')]);
    self._writeNode(iqNode);
  }

  function sendGetGroups() {
    logger.log('Asking for groups...');
    var id = self.makeId('get_groups_');
    _sendGetGroups(id, 'participating');
    self.readerThread.requests[id] = self.readerThread.parseGetGroups;
    return id;
  }

  function _sendGetGroups(id, type) {
    var commandNode = newProtocolTreeNode('list', { type: type });
    var iqNode = newProtocolTreeNode('iq', {
      id: id,
      type: 'get',
      to: 'g.us',
      xmlns: 'w:g'
    }, [commandNode]);
    self._writeNode(iqNode);
  }

  function sendGetPrivacyList() {
    var id = self.makeId('privacylist_');
    var commandNode = newProtocolTreeNode('list', { name: 'default' });
    var queryNode = newProtocolTreeNode('query', undefined, [commandNode]);
    var iqNode = newProtocolTreeNode('iq', {
      id: id,
      type: 'get',
      xmlns: 'jabber:iq:privacy'
    }, [queryNode]);
    self._writeNode(iqNode);
  }

  var methodList = {

    is_online: function () {
      return self.socket && self.socket.socket &&
             self.socket.socket.readyState === 'open';
    },

    /*
     * Authentication
     */
    auth_login: function(aUsername, aPassword) {
        logger.log('auth_login called for', aUsername);
        CoSeMe.auth.authenticate(aUsername, aPassword, function(err, aConn) {
          try {
            if (!err && aConn) {
              self.socket = aConn;
              self.socket.onconnectionclosed = self._onErrorSendDisconnected;
              self.socket.onconnectionlost = self._onErrorSendDisconnected;
              self.readerThread.socket = self.socket;
              self.readerThread.autoPong = self.autoPong;
              self.readerThread.onPing = self.sendPong;
              self.readerThread.signalInterface = {
                send: fireEvent
              };
              self.jid = self.socket.jid;
              self.out = self.socket.writer;
              self.state = 2;
              self.domain = CoSeMe.config.domain;
              sendPostAuthentication();
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
      sendChatState(aJid, 'composing');
    },

    typing_paused: function(aJid) {
      sendChatState(aJid, 'paused');
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
      self.sendReceipt(aJid, aMsgId);
    },
    notification_ack: function(aJid, aNotificationId) {
      self.sendReceipt(aJid, aNotificationId);
    },
    delivered_ack: function(aTo, aMsgId, type, participant, from) {
      self._writeNode(
        self.getReceiptAck(aTo, aMsgId, 'delivery', participant, from)
      );
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

    pong: self.sendPong,

    //Groups

    group_getInfo: function(aJid) {
      var idx = self.makeId('get_g_info_');
      var queryNode = newProtocolTreeNode('query');
      var iqNode = newProtocolTreeNode('iq', {
        id: idx,
        type: 'get',
        to: aJid,
        xmlns: 'w:g'
      }, [queryNode]);

      self.readerThread.requests[idx] = self.readerThread.parseGroupInfo;
      self._writeNode(iqNode);
    },

    group_getPicture: sendGetPicture,

    group_create: function(aSubject) {
      var idx = self.makeId('create_group_');
      var groupNode = newProtocolTreeNode('group', {
        action: 'create',
        subject: utf8FromString(aSubject)
      });
      var iqNode = newProtocolTreeNode('iq', {
        id: idx,
        type: 'set',
        to: 'g.us',
        xmlns: 'w:g'
      }, [groupNode]);

      self.readerThread.requests[idx] = self.readerThread.parseGroupCreated;
      self._writeNode(iqNode);
      return idx;
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

    group_setPicture: sendSetPicture,

    group_end: function(aGjid) {
      var  idx = self.makeId('leave_group_');

      var groupNodes = [];
      groupNodes.push(newProtocolTreeNode('group', { id: aGjid }));

      var  leaveNode = newProtocolTreeNode('leave', undefined, groupNodes);

      var iqNode = newProtocolTreeNode('iq', {
        id: idx,
        type: 'set',
        to: 'g.us',
        xmlns: 'w:g'
      }, [leaveNode]);

      self.readerThread.requests[idx] = self.readerThread.parseGroupEnded;
      self._writeNode(iqNode);
    },

    group_setSubject: function(aGjid, aSubject) {
      aSubject = utf8FromString(aSubject);
      var idx = self.makeId('set_group_subject_');
      var subjectNode = newProtocolTreeNode('subject', { value: aSubject });
      var iqNode = newProtocolTreeNode('iq', {
        id: idx,
        type: 'set',
        to: aGjid,
        xmlns: 'w:g'
      }, [subjectNode]);

      self.readerThread.requests[idx] = self.readerThread.parseGroupSubject;
      self._writeNode(iqNode);
    },

    group_getParticipants: function(aGjid) {
      var idx = self.makeId('get_participants_');

      var listNode = newProtocolTreeNode('list');
      var iqNode = newProtocolTreeNode('iq', {
        id: idx,
        type: 'get',
        to: aGjid,
        xmlns: 'w:g'
      }, [listNode]);

      self.readerThread.requests[idx] = self.readerThread.parseParticipants;
      self._writeNode(iqNode);
    },

    group_getParticipating: function () {
      return sendGetGroups()
    },

    // Presence

    presence_sendAvailable: function() {
      var presenceNode = newProtocolTreeNode('presence', {type: 'available'});
      self._writeNode(presenceNode);
    },

    presence_request: function(jid) {
      methodList.presence_subscribe(jid);
      var id = self.makeId('last_');
      var iqNode = newProtocolTreeNode('iq', {
        to: jid,
        type: 'get',
        id: id,
        xmlns: 'jabber:iq:last'
      }, [newProtocolTreeNode('query')]);
      self.readerThread.requests[id] = self.readerThread.parseLastOnline;
      self._writeNode(iqNode);
    },

    presence_sendUnavailable: function() {
      var presenceNode = newProtocolTreeNode('presence', {type: 'unavailable'});
      self._writeNode(presenceNode);
    },

    presence_sendAvailableForChat: function(aPushname) {
      aPushname = utf8FromString(aPushname);
      var presenceNode = newProtocolTreeNode('presence', {
        name: aPushname,
        type: 'active'
      });
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

    contacts_sync: function (numbers) {
      var id = self.makeId('sync_');
      var jid = self.jid;
      var syncNode = newProtocolTreeNode('sync', {
        mode: 'full',
        context: 'background',
        sid: CoSeMe.time.utcTimestamp(),
        last: 'true',
        index: '0'
      }, numbers.map(function (userphone) {
        return newProtocolTreeNode('user', undefined, undefined, userphone);
      }));
      var iqNode = newProtocolTreeNode('iq', {
        to: jid,
        type: 'get',
        id: id,
        xmlns: 'urn:xmpp:whatsapp:sync'
      }, [syncNode]);
      self.readerThread.requests[id] = self.readerThread.parseContactsSync;
      self._writeNode(iqNode);
      return id;
    },

    contacts_getStatus: function (jids) {
      var id = self.makeId('getstatus_');
      var iqNode = newProtocolTreeNode('iq', {
        to: CoSeMe.config.domain,
        type: 'get',
        id: id,
        xmlns: 'status'
      }, [newProtocolTreeNode('status', undefined, jids.map(function (jid) {
        return newProtocolTreeNode('user', { jid: jid });
      }))]);
      self.readerThread.requests[id] = self.readerThread.parseContactsStatus;
      self._writeNode(iqNode);
      return id;
    },

    contact_getProfilePicture: sendGetPicture,

    picture_getIds: function(aJids) {
      var idx = self.makeId('get_picture_ids_');
      self.readerThread.requests[idx] = self.readerThread.parseGetPictureIds;

      var innerNodeChildren = [];
      aJids.forEach(function (aJid) {
        innerNodeChildren.push(newProtocolTreeNode('user', {jid: aJid}));
      });

      var queryNode = newProtocolTreeNode('list', {}, innerNodeChildren);
      var iqNode = newProtocolTreeNode('iq', {id: idx, type: 'get',
                                      xmlns: 'w:profile:picture'}, [queryNode]);

      self._writeNode(iqNode);
    },

    // Profile

    profile_getPicture: function() {
      sendGetPicture(self.jid);
    },

    profile_setStatus: function(aStatus) {
      aStatus = utf8FromString(aStatus);
      var id = self.makeId('sendsetstatus_');
      var statusNode =
        newProtocolTreeNode('status', undefined, undefined, aStatus);
      var iqNode = newProtocolTreeNode('iq', {
        to: 's.whatsapp.net',
        type: 'set',
        id: id,
        xmlns: 'status'
      }, [statusNode]);
      self._writeNode(iqNode);

      return id;
    },

    profile_setPicture: function (preview, thumb) {
      return sendSetPicture(self.jid, preview, thumb);
    },

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

      var attribs = {hash: aB64Hash, type: aT, size: aSize};

      if (aB64OrigHash) {
        attribs.orighash = aB64OrigHash;
      }

      var mediaNode = newProtocolTreeNode('media', attribs);
      var iqNode = newProtocolTreeNode('iq', {
        id: idx,
        to: 's.whatsapp.net',
        type: 'set',
        xmlns: 'w:m',
      }, [mediaNode]);
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

     var queryNode = newProtocolTreeNode('list',{type: aGtype});
     var iqNode = newProtocolTreeNode('iq',{id: idx, type: 'get', to: 'g.us', xmlns: 'w:g'},
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
     aStatus = utf8FromString(aStatus);
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
CoSeMe.namespace('contacts', (function(){
  'use strict';

  var logger = new CoSeMe.common.Logger('contacts');

  var _methods = CoSeMe.yowsup.getMethodsInterface();
  var _signals = CoSeMe.yowsup.getSignalsInterface();
  var _callbacks = {};
  var _contacts = [];

  _signals.registerListener('contacts_sync', _onResponse);
  _signals.registerListener('contacts_gotStatus', _onResponse);

  function _onResponse(id) {
    var callback = _callbacks[id];
    delete _callbacks[id];
    callback && callback.apply(this, [].slice.call(arguments,1));
  }

  function _sync(numbers, callback) {
    var id = _methods.call('contacts_sync', [numbers]);
    _callbacks[id] = callback;
  }

  function _getStatus(jids, callback) {
    var id = _methods.call('contacts_getStatus', [jids]);
    _callbacks[id] = callback;
  }

  function _getV2Response(registered, unregistered, statusMap) {
    var result = { c: [] };
    registered.forEach(function (user) {
      result.c.push(_newContactEntry(1, user, statusMap[user.jid]));
    });
    unregistered.forEach(function (user) {
      result.c.push(_newContactEntry(0, user));
    });
    return result;
  }

  function _newContactEntry(isIn, user, status) {
    var entry = {
      w: isIn,
      p: user.phone,
      n: user.jid.split('@')[0],
      get t() {
        console.warn('Deprecated with the new sync method.');
        return undefined;
      }
    };
    isIn && (entry.s = status);
    return entry;
  };

  return {
    setCredentials: function() {
      console.warn('Deprecated and useless. Please, remove.');
    },

    addContacts: function(contacts) {
      if (!Array.isArray(contacts)) {
        contacts = [contacts];
      }
      _contacts = _contacts.concat(contacts);
      logger.log('Contacts:', _contacts);
    },

    clearContacts: function() {
      _contacts = [];
    },

    query: function _query(onready, onerror) {
      if (_contacts.length === 0) { return; }

      // Try to sync in order to discern between registered and unregistered
      _sync(_contacts, function (registered, unregistered) {
        if (registered.length === 0 && unregistered.length === 0) {
          return onerror('invalid-sync-response');
        }

        // Now get statuses for registered ones
        var jids = registered.map(function (user) { return user.jid; });
        _getStatus(jids, function (statusMap) {
          if (registered.length > 0 && Object.keys(statusMap).length === 0) {
            return onerror('invalid-status-response');
          }

          // And translate to the former V2 sync format
          var response = _getV2Response(registered, unregistered, statusMap);
          onready(response);
        });
      });
    }
  };
}()));
