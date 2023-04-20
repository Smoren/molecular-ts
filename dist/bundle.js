/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/crypto-js/core.js":
/*!****************************************!*\
  !*** ./node_modules/crypto-js/core.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory();
	}
	else {}
}(this, function () {

	/*globals window, global, require*/

	/**
	 * CryptoJS core components.
	 */
	var CryptoJS = CryptoJS || (function (Math, undefined) {

	    var crypto;

	    // Native crypto from window (Browser)
	    if (typeof window !== 'undefined' && window.crypto) {
	        crypto = window.crypto;
	    }

	    // Native crypto in web worker (Browser)
	    if (typeof self !== 'undefined' && self.crypto) {
	        crypto = self.crypto;
	    }

	    // Native crypto from worker
	    if (typeof globalThis !== 'undefined' && globalThis.crypto) {
	        crypto = globalThis.crypto;
	    }

	    // Native (experimental IE 11) crypto from window (Browser)
	    if (!crypto && typeof window !== 'undefined' && window.msCrypto) {
	        crypto = window.msCrypto;
	    }

	    // Native crypto from global (NodeJS)
	    if (!crypto && typeof __webpack_require__.g !== 'undefined' && __webpack_require__.g.crypto) {
	        crypto = __webpack_require__.g.crypto;
	    }

	    // Native crypto import via require (NodeJS)
	    if (!crypto && "function" === 'function') {
	        try {
	            crypto = __webpack_require__(/*! crypto */ "?9157");
	        } catch (err) {}
	    }

	    /*
	     * Cryptographically secure pseudorandom number generator
	     *
	     * As Math.random() is cryptographically not safe to use
	     */
	    var cryptoSecureRandomInt = function () {
	        if (crypto) {
	            // Use getRandomValues method (Browser)
	            if (typeof crypto.getRandomValues === 'function') {
	                try {
	                    return crypto.getRandomValues(new Uint32Array(1))[0];
	                } catch (err) {}
	            }

	            // Use randomBytes method (NodeJS)
	            if (typeof crypto.randomBytes === 'function') {
	                try {
	                    return crypto.randomBytes(4).readInt32LE();
	                } catch (err) {}
	            }
	        }

	        throw new Error('Native crypto module could not be used to get secure random number.');
	    };

	    /*
	     * Local polyfill of Object.create

	     */
	    var create = Object.create || (function () {
	        function F() {}

	        return function (obj) {
	            var subtype;

	            F.prototype = obj;

	            subtype = new F();

	            F.prototype = null;

	            return subtype;
	        };
	    }());

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
	                var subtype = create(this);

	                // Augment
	                if (overrides) {
	                    subtype.mixIn(overrides);
	                }

	                // Create default initializer
	                if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
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
	            } else {
	                // Copy one word at a time
	                for (var j = 0; j < thatSigBytes; j += 4) {
	                    thisWords[(thisSigBytes + j) >>> 2] = thatWords[j >>> 2];
	                }
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
	                words.push(cryptoSecureRandomInt());
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
	            var processedWords;

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
	                processedWords = dataWords.splice(0, nWordsReady);
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


	return CryptoJS;

}));

/***/ }),

/***/ "./node_modules/crypto-js/md5.js":
/*!***************************************!*\
  !*** ./node_modules/crypto-js/md5.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

;(function (root, factory) {
	if (true) {
		// CommonJS
		module.exports = exports = factory(__webpack_require__(/*! ./core */ "./node_modules/crypto-js/core.js"));
	}
	else {}
}(this, function (CryptoJS) {

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


	return CryptoJS.MD5;

}));

/***/ }),

/***/ "./src/canvas/drawer.ts":
/*!******************************!*\
  !*** ./src/canvas/drawer.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_image_cache_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers/image-cache-helper */ "./src/canvas/helpers/image-cache-helper.ts");
/* harmony import */ var _structs_vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./structs/vector */ "./src/canvas/structs/vector/index.ts");
/* harmony import */ var _structs_filters_grid_filter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./structs/filters/grid-filter */ "./src/canvas/structs/filters/grid-filter.ts");
/* harmony import */ var _structs_drawable_positional_context__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./structs/drawable/positional-context */ "./src/canvas/structs/drawable/positional-context.ts");




/**
 * Canvas drawer
 * @public
 */
var Drawer = /** @class */ (function () {
    /**
     * Drawer constructor
     * @param domElement - canvas DOM element
     * @param viewConfig - view config
     * @param storage - drawable objects storage
     */
    function Drawer(_a) {
        var domElement = _a.domElement, viewConfig = _a.viewConfig, storage = _a.storage;
        /**
         * Name of class to use as subscriber name in observable logic
         */
        this._subscriberName = 'Drawer';
        this._domElement = domElement;
        this._viewConfig = viewConfig;
        this._storage = storage;
        this._context = domElement.getContext('2d');
        this._initResizeObserver();
        this._initViewConfigObserver();
        this._initStorageObserver();
        this._initImageCacheObserver();
        this._initMouseEvents();
        this.refresh();
    }
    /**
     * {@inheritDoc DrawerInterface.draw}
     */
    Drawer.prototype.draw = function () {
        var _a, _b;
        var _this = this;
        this._context.save();
        (_a = this._context).translate.apply(_a, this._viewConfig.offset);
        (_b = this._context).scale.apply(_b, this._viewConfig.scale);
        this._storage.list.forEach(function (item) {
            if (item.config.visible) {
                item.draw(_this);
            }
        });
        this._context.restore();
    };
    /**
     * {@inheritDoc DrawerInterface.refresh}
     */
    Drawer.prototype.refresh = function () {
        if (this._domElement.width !== this.width) {
            this._domElement.width = this.width;
        }
        if (this._domElement.height !== this.height) {
            this._domElement.height = this.height;
        }
        console.log('refreshed');
        this.clear();
        this.draw();
    };
    /**
     * {@inheritDoc DrawerInterface.clear}
     */
    Drawer.prototype.clear = function () {
        this._context.clearRect(0, 0, this.width, this.height);
    };
    /**
     * Returns bounds of canvas frame
     */
    Drawer.prototype.getBounds = function () {
        return [
            this._viewConfig.transposeForward([0, 0]),
            this._viewConfig.transposeForward([this.width, this.height]),
        ];
    };
    Object.defineProperty(Drawer.prototype, "viewConfig", {
        /**
         * View config getter
         */
        get: function () {
            return this._viewConfig;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawer.prototype, "context", {
        /**
         * Canvas context getter
         */
        get: function () {
            return this._context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawer.prototype, "width", {
        /**
         * Canvas width getter
         */
        get: function () {
            return this._domElement.clientWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawer.prototype, "height", {
        /**
         * Canvas height getter
         */
        get: function () {
            return this._domElement.clientHeight;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initiates canvas resize observer
     */
    Drawer.prototype._initResizeObserver = function () {
        var _this = this;
        this._resizeObserver = new ResizeObserver(function () { return _this.refresh(); });
        this._resizeObserver.observe(this._domElement);
    };
    /**
     * Initiates view config observer
     */
    Drawer.prototype._initViewConfigObserver = function () {
        var _this = this;
        this._viewConfig.onViewChange(this._subscriberName, function () { return _this.refresh(); });
    };
    /**
     * Initiates storage observer
     */
    Drawer.prototype._initStorageObserver = function () {
        var _this = this;
        this._storage.onViewChange(this._subscriberName, function () { return _this.refresh(); });
    };
    /**
     * Initiates image cache observer
     */
    Drawer.prototype._initImageCacheObserver = function () {
        var _this = this;
        _helpers_image_cache_helper__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe(this._subscriberName, function () {
            _this.refresh();
        });
    };
    /**
     * Initiates mouse events observer
     */
    Drawer.prototype._initMouseEvents = function () {
        // TODO перенести куда-нибудь
        var _this = this;
        var coordsFilter = new _structs_filters_grid_filter__WEBPACK_IMPORTED_MODULE_2__["default"]();
        var filterCoords = function (coords) {
            return coordsFilter.process(coords, _this._viewConfig.getConfig());
        };
        var currentElementContext = new _structs_drawable_positional_context__WEBPACK_IMPORTED_MODULE_3__["default"](null, null);
        var DEVIATION = 8;
        var getNearBoundElement = function (coords) {
            var transposedCoords = _this._viewConfig.transposeForward(coords);
            return _this._storage.findByNearEdgePosition(transposedCoords, DEVIATION / _this._viewConfig.scale[0]);
        };
        this._domElement.addEventListener('wheel', function (event) {
            if (event.ctrlKey) {
                var scale = _this._viewConfig.scale[0];
                scale += event.deltaY * -0.002;
                scale = Math.min(Math.max(0.001, scale), 100);
                _this._viewConfig.updateScaleInCursorContext([scale, scale], [event.offsetX, event.offsetY]);
            }
            else if (event.shiftKey) {
                _this._viewConfig.offset[0] -= event.deltaY;
            }
            else {
                _this._viewConfig.offset[1] -= event.deltaY;
            }
            event.preventDefault();
        });
        this._domElement.addEventListener('click', function (event) {
            event.preventDefault();
        });
        var mouseDownCoords = null;
        this._domElement.addEventListener('mousedown', function (event) {
            if (currentElementContext.isEmpty()) {
                var transposedCoords = _this._viewConfig.transposeForward([event.offsetX, event.offsetY]);
                currentElementContext = _this._storage.findByPosition(transposedCoords);
            }
            mouseDownCoords = [event.offsetX, event.offsetY];
            _this._domElement.style.cursor = 'grabbing';
        });
        this._domElement.addEventListener('mousemove', function (event) {
            var mouseMoveCoords = [event.offsetX, event.offsetY];
            var transposedCoords = _this._viewConfig.transposeForward(mouseMoveCoords);
            if (mouseDownCoords === null) {
                if (!getNearBoundElement(mouseMoveCoords).isEmpty()) {
                    _this._domElement.style.cursor = 'crosshair';
                }
                else if (!_this._storage.findByPosition(transposedCoords).isEmpty()) {
                    _this._domElement.style.cursor = 'pointer';
                }
                else {
                    _this._domElement.style.cursor = 'default';
                }
                return;
            }
            if (!currentElementContext.isEmpty()) {
                var newPosition = (0,_structs_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(transposedCoords)
                    .sub((0,_structs_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(currentElementContext.position))
                    .toArray();
                var newPositionFiltered = filterCoords(newPosition);
                if (!(0,_structs_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(newPositionFiltered).isEqual((0,_structs_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(currentElementContext.element.config.position))) {
                    currentElementContext.element.config.position = newPositionFiltered;
                }
            }
            else {
                var difference = [
                    mouseDownCoords[0] - mouseMoveCoords[0],
                    mouseDownCoords[1] - mouseMoveCoords[1],
                ];
                _this._viewConfig.offset = (0,_structs_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(_this._viewConfig.offset)
                    .sub((0,_structs_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(difference))
                    .toArray();
            }
            mouseDownCoords = mouseMoveCoords;
        });
        this._domElement.addEventListener('mouseup', function () {
            if (!currentElementContext.isEmpty()) {
                console.log(currentElementContext.element);
            }
            currentElementContext = new _structs_drawable_positional_context__WEBPACK_IMPORTED_MODULE_3__["default"](null, null);
            mouseDownCoords = null;
            _this._domElement.style.cursor = 'default';
        });
    };
    return Drawer;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Drawer);


/***/ }),

/***/ "./src/canvas/figures/grid.ts":
/*!************************************!*\
  !*** ./src/canvas/figures/grid.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _structs_drawable_drawable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structs/drawable/drawable */ "./src/canvas/structs/drawable/drawable.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

/**
 * Grid figure
 * @public
 */
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    /**
     * Grid constructor
     * @param id - object ID
     * @param config - view config
     * @param data - linked extra data
     */
    function Grid(id, config, data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, id, config, data) || this;
        /**
         * Object type
         */
        _this._type = 'Grid';
        return _this;
    }
    /**
     * {@inheritDoc DrawableInterface.draw}
     */
    Grid.prototype.draw = function (drawer) {
        drawer.context.save();
        drawer.context.beginPath();
        var _a = drawer.getBounds(), fromBound = _a[0], toBound = _a[1];
        var scale = drawer.viewConfig.scale[0];
        drawer.context.lineWidth = this._config.lineWidth / scale;
        var step = drawer.viewConfig.gridStep;
        if (scale < 1) {
            step *= Math.pow(2, Math.round(Math.log2(1 / scale)));
        }
        else {
            step /= Math.pow(2, Math.round(Math.log2(scale)));
        }
        var mainLineDistance = step * this._config.linesInBlock;
        var xGap = (fromBound[0] % mainLineDistance);
        if (xGap < 0) {
            xGap += mainLineDistance;
        }
        var yGap = (fromBound[1] % mainLineDistance);
        if (yGap < 0) {
            yGap += mainLineDistance;
        }
        {
            var j = 0;
            for (var i = fromBound[1] - yGap; i <= toBound[1]; i += step) {
                var color = (j++ % this._config.linesInBlock === 0)
                    ? this._config.mainLineColor
                    : this._config.subLineColor;
                this._drawHorizontalLine(i, drawer, color, [fromBound, toBound]);
            }
        }
        {
            var j = 0;
            for (var i = fromBound[0] - xGap; i <= toBound[0]; i += step) {
                var color = (j++ % this._config.linesInBlock === 0)
                    ? this._config.mainLineColor
                    : this._config.subLineColor;
                this._drawVerticalLine(i, drawer, color, [fromBound, toBound]);
            }
        }
        drawer.context.closePath();
        drawer.context.restore();
    };
    /**
     * Draw horizontal line
     * @param yOffset - vertical offset
     * @param drawer - drawer object
     * @param color - color
     * @param fromBound - left-top bound
     * @param toBound - right-bottom bound
     */
    Grid.prototype._drawHorizontalLine = function (yOffset, drawer, color, _a) {
        var fromBound = _a[0], toBound = _a[1];
        var lineFrom = [fromBound[0], yOffset];
        var lineTo = [toBound[0], yOffset];
        drawer.context.beginPath();
        drawer.context.strokeStyle = color;
        drawer.context.moveTo(lineFrom[0], lineFrom[1]);
        drawer.context.lineTo(lineTo[0], lineTo[1]);
        drawer.context.stroke();
        drawer.context.closePath();
        return this;
    };
    /**
     * Draw vertical line
     * @param drawer - drawer object
     * @param xOffset - horizontal offset
     * @param color - color
     * @param fromBound - left-top bound
     * @param toBound - right-bottom bound
     */
    Grid.prototype._drawVerticalLine = function (xOffset, drawer, color, _a) {
        var fromBound = _a[0], toBound = _a[1];
        var lineFrom = [xOffset, fromBound[1]];
        var lineTo = [xOffset, toBound[1]];
        drawer.context.beginPath();
        drawer.context.strokeStyle = color;
        drawer.context.moveTo(lineFrom[0], lineFrom[1]);
        drawer.context.lineTo(lineTo[0], lineTo[1]);
        drawer.context.stroke();
        drawer.context.closePath();
        return this;
    };
    return Grid;
}(_structs_drawable_drawable__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Grid);


/***/ }),

/***/ "./src/canvas/figures/rect.ts":
/*!************************************!*\
  !*** ./src/canvas/figures/rect.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _structs_drawable_positional_drawable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structs/drawable/positional-drawable */ "./src/canvas/structs/drawable/positional-drawable.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};

/**
 * Rect figure
 * @public
 */
var Rect = /** @class */ (function (_super) {
    __extends(Rect, _super);
    /**
     * Rect constructor
     * @param id - object ID
     * @param config - view config
     * @param data - linked extra data
     */
    function Rect(id, config, data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, id, config, data) || this;
        /**
         * Object type
         */
        _this._type = 'Rect';
        return _this;
    }
    /**
     * {@inheritDoc DrawableInterface.draw}
     */
    Rect.prototype.draw = function (drawer) {
        var _a, _b;
        drawer.context.beginPath();
        drawer.context.strokeStyle = this._config.strokeStyle;
        drawer.context.fillStyle = this._config.fillStyle;
        drawer.context.lineWidth = this._config.lineWidth;
        (_a = drawer.context).fillRect.apply(_a, __spreadArray(__spreadArray([], this._config.position, false), this._config.size, false));
        if (this._config.lineWidth !== 0) {
            (_b = drawer.context).strokeRect.apply(_b, __spreadArray(__spreadArray([], this._config.position, false), this._config.size, false));
        }
        drawer.context.closePath();
    };
    return Rect;
}(_structs_drawable_positional_drawable__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Rect);


/***/ }),

/***/ "./src/canvas/figures/svg.ts":
/*!***********************************!*\
  !*** ./src/canvas/figures/svg.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _structs_drawable_positional_drawable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structs/drawable/positional-drawable */ "./src/canvas/structs/drawable/positional-drawable.ts");
/* harmony import */ var _helpers_image_cache_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/image-cache-helper */ "./src/canvas/helpers/image-cache-helper.ts");
/* harmony import */ var _structs_bounds_polygonal_bound__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../structs/bounds/polygonal-bound */ "./src/canvas/structs/bounds/polygonal-bound.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};



/**
 * Svg figure
 * @public
 */
var Svg = /** @class */ (function (_super) {
    __extends(Svg, _super);
    /**
     * Svg constructor
     * @param id - object ID
     * @param config - view config
     * @param data - linked extra data
     */
    function Svg(id, config, data) {
        if (data === void 0) { data = {}; }
        var _this = _super.call(this, id, config, data) || this;
        /**
         * Object type
         */
        _this._type = 'Svg';
        /**
         * Image DOM element
         */
        _this._img = null;
        return _this;
    }
    /**
     * {@inheritDoc DrawableInterface.draw}
     */
    Svg.prototype.draw = function (drawer) {
        var _this = this;
        if (!this._tryDraw(drawer)) {
            this._img = _helpers_image_cache_helper__WEBPACK_IMPORTED_MODULE_1__["default"].cache(this._config.data, 'image/svg+xml', function (img) {
                _this._img = img;
            });
            this._tryDraw(drawer);
        }
    };
    Object.defineProperty(Svg.prototype, "sourceWidth", {
        /**
         * sourceWidth getter
         */
        get: function () {
            return this._img.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Svg.prototype, "sourceHeight", {
        /**
         * sourceHeight getter
         */
        get: function () {
            return this._img.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Svg.prototype, "scale", {
        /**
         * scale getter
         */
        get: function () {
            return [
                this._config.size[0] / this.sourceWidth,
                this._config.size[1] / this.sourceHeight,
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Svg.prototype, "bound", {
        /**
         * TODO временно для проверки
         * bound getter
         */
        get: function () {
            return new _structs_bounds_polygonal_bound__WEBPACK_IMPORTED_MODULE_2__["default"]({
                points: [
                    [28, 0], [134, 0], [161, 40], [134, 81], [28, 81], [0, 40],
                ],
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Tries to draw the figure if the image is ready
     * @param drawer - drawer object
     */
    Svg.prototype._tryDraw = function (drawer) {
        var _a, _b;
        if (this._img !== null) {
            var scale = this.scale;
            var position = this._config.position;
            var scaledPosition = [position[0] / scale[0], position[1] / scale[1]];
            drawer.context.save();
            drawer.context.beginPath();
            (_a = drawer.context).scale.apply(_a, scale);
            (_b = drawer.context).drawImage.apply(_b, __spreadArray([this._img], scaledPosition, false));
            drawer.context.closePath();
            drawer.context.restore();
            return true;
        }
        return false;
    };
    return Svg;
}(_structs_drawable_positional_drawable__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Svg);


/***/ }),

/***/ "./src/canvas/helpers/base.ts":
/*!************************************!*\
  !*** ./src/canvas/helpers/base.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "areArraysEqual": () => (/* binding */ areArraysEqual),
/* harmony export */   "createBlob": () => (/* binding */ createBlob),
/* harmony export */   "createElementFromHTML": () => (/* binding */ createElementFromHTML),
/* harmony export */   "createUrlFromBlob": () => (/* binding */ createUrlFromBlob),
/* harmony export */   "getMaxPosition": () => (/* binding */ getMaxPosition),
/* harmony export */   "getMinPosition": () => (/* binding */ getMinPosition),
/* harmony export */   "hashString": () => (/* binding */ hashString)
/* harmony export */ });
/* harmony import */ var crypto_js_md5__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! crypto-js/md5 */ "./node_modules/crypto-js/md5.js");
/* harmony import */ var crypto_js_md5__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(crypto_js_md5__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Returns true if arrays are equal and false else
 * @public
 * @param lhs - first array to compare
 * @param rhs - second array to compare
 */
function areArraysEqual(lhs, rhs) {
    return lhs.length === rhs.length && lhs.every(function (v, i) { return v === rhs[i]; });
}
/**
 * Creates DOM element from HTML string
 * @public
 * @param htmlString - HTML string
 */
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
/**
 * Creates blob from text
 * @public
 * @param data - text
 * @param type - type
 */
function createBlob(data, type) {
    return new Blob([data], { type: type });
}
/**
 * Creates URL from blob
 * @public
 * @param blob - blob
 */
function createUrlFromBlob(blob) {
    var URL = (window.URL || window.webkitURL || window);
    return URL.createObjectURL(blob);
}
/**
 * Finds and returns minimal (left-top) position
 * @public
 * @param positions - input positions
 */
function getMinPosition(positions) {
    var minX = Infinity;
    var minY = Infinity;
    positions.forEach(function (position) {
        if (position[0] < minX) {
            minX = position[0];
        }
        if (position[1] < minY) {
            minY = position[1];
        }
    });
    return [minX, minY];
}
/**
 * Finds and returns maximal (right-bottom) position
 * @public
 * @param positions - input positions
 */
function getMaxPosition(positions) {
    var maxX = -Infinity;
    var maxY = -Infinity;
    positions.forEach(function (position) {
        if (position[0] > maxX) {
            maxX = position[0];
        }
        if (position[1] > maxY) {
            maxY = position[1];
        }
    });
    return [maxX, maxY];
}
/**
 * Creates an MD5 hash from string
 * @public
 * @param input - input string
 */
function hashString(input) {
    return crypto_js_md5__WEBPACK_IMPORTED_MODULE_0___default()(input).toString();
}


/***/ }),

/***/ "./src/canvas/helpers/image-cache-helper.ts":
/*!**************************************************!*\
  !*** ./src/canvas/helpers/image-cache-helper.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _structs_image_cache__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structs/image-cache */ "./src/canvas/structs/image-cache.ts");

/**
 * Image cache helper
 * @public
 */
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new _structs_image_cache__WEBPACK_IMPORTED_MODULE_0__["default"]());


/***/ }),

/***/ "./src/canvas/helpers/observe-helper.ts":
/*!**********************************************!*\
  !*** ./src/canvas/helpers/observe-helper.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Helper for observable logic
 * @public
 */
var ObserveHelper = /** @class */ (function () {
    function ObserveHelper() {
        /**
         * Handlers mapped by subscribers
         */
        this._handlerMap = {};
        /**
         * Flag for muting handlers
         */
        this._muteHandlers = false;
    }
    /**
     * {@inheritDoc ObserveHelperInterface.onChange}
     */
    ObserveHelper.prototype.onChange = function (subscriberName, handler) {
        this._handlerMap[subscriberName] = handler;
    };
    /**
     * {@inheritDoc ObserveHelperInterface.offChange}
     */
    ObserveHelper.prototype.offChange = function (subscriberName) {
        delete this._handlerMap[subscriberName];
    };
    /**
     * {@inheritDoc ObserveHelperInterface.processWithMuteHandlers}
     */
    ObserveHelper.prototype.processWithMuteHandlers = function (extra) {
        var _this = this;
        if (extra === void 0) { extra = null; }
        return this.withMuteHandlers(function (mutedBefore) { return _this.processHandlers(mutedBefore, extra); });
    };
    /**
     * {@inheritDoc ObserveHelperInterface.withMuteHandlers}
     */
    ObserveHelper.prototype.withMuteHandlers = function (action) {
        if (this._muteHandlers) {
            action(true, this);
        }
        else {
            this._muteHandlers = true;
            action(false, this);
            this._muteHandlers = false;
        }
        return true;
    };
    /**
     * {@inheritDoc ObserveHelperInterface.processHandlers}
     */
    ObserveHelper.prototype.processHandlers = function (isMuted, extra) {
        var _this = this;
        if (extra === void 0) { extra = null; }
        if (!isMuted) {
            Object.values(this._handlerMap)
                .forEach(function (handler) { return handler(_this, extra); });
        }
        return true;
    };
    return ObserveHelper;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ObserveHelper);


/***/ }),

/***/ "./src/canvas/helpers/type-helpers.ts":
/*!********************************************!*\
  !*** ./src/canvas/helpers/type-helpers.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isLayer": () => (/* binding */ isLayer),
/* harmony export */   "isPositional": () => (/* binding */ isPositional)
/* harmony export */ });
/**
 * Checks if item is instance of PositionalDrawableInterface
 * @see PositionalDrawableInterface
 * @param item - item to check
 */
function isPositional(item) {
    return 'isPositional' in item;
}
/**
 * Checks if item is instance of PositionalDrawableInterface
 * @see DrawableLayerInterface
 * @param item - item to check
 */
function isLayer(item) {
    return 'isLayer' in item;
}


/***/ }),

/***/ "./src/canvas/structs/bounds/polygonal-bound.ts":
/*!******************************************************!*\
  !*** ./src/canvas/structs/bounds/polygonal-bound.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector */ "./src/canvas/structs/vector/index.ts");

/**
 * PolygonalBound class
 */
var PolygonalBound = /** @class */ (function () {
    /**
     * RectangularBound constructor
     * @param config - bound config
     */
    function PolygonalBound(config) {
        this._config = config;
    }
    /**
     * {@inheritDoc BoundInterface.includes}
     */
    PolygonalBound.prototype.includes = function (coords) {
        var precision = 0;
        var x = coords[0];
        var y = coords[1];
        var isInside = false;
        var polygonVectors = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.createPolygonVectors)(this._config.points);
        for (var _i = 0, polygonVectors_1 = polygonVectors; _i < polygonVectors_1.length; _i++) {
            var vector = polygonVectors_1[_i];
            if (vector.includes(coords, precision)) {
                return true;
            }
            var _a = vector.position.toArray(), xj = _a[0], yj = _a[1];
            var _b = vector.target.toArray(), xi = _b[0], yi = _b[1];
            var isIntersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (isIntersect) {
                isInside = !isInside;
            }
        }
        return isInside;
    };
    /**
     * {@inheritDoc BoundInterface.isNearEdge}
     */
    PolygonalBound.prototype.isNearEdge = function (coords, deviation) {
        var vectors = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.createPolygonVectors)(this._config.points);
        for (var _i = 0, vectors_1 = vectors; _i < vectors_1.length; _i++) {
            var vector = vectors_1[_i];
            if (vector.getDistanceVector(coords).length <= deviation) {
                return true;
            }
        }
        return false;
    };
    return PolygonalBound;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PolygonalBound);


/***/ }),

/***/ "./src/canvas/structs/bounds/rectangular-bound.ts":
/*!********************************************************!*\
  !*** ./src/canvas/structs/bounds/rectangular-bound.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector */ "./src/canvas/structs/vector/index.ts");

/**
 * RectangularBound class
 */
var RectangularBound = /** @class */ (function () {
    /**
     * RectangularBound constructor
     * @param config - bound config
     */
    function RectangularBound(config) {
        this._config = config;
    }
    /**
     * {@inheritDoc BoundInterface.includes}
     */
    RectangularBound.prototype.includes = function (coords) {
        return coords[0] >= this._config.position[0]
            && coords[0] <= this._config.position[0] + this._config.size[0]
            && coords[1] >= this._config.position[1]
            && coords[1] <= this._config.position[1] + this._config.size[1];
    };
    /**
     * {@inheritDoc BoundInterface.isNearEdge}
     */
    RectangularBound.prototype.isNearEdge = function (coords, deviation) {
        var vectors = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.createPolygonVectors)([
            [this._config.position[0], this._config.position[1]],
            [this._config.position[0] + this._config.size[0], this._config.position[1]],
            [this._config.position[0] + this._config.size[0], this._config.position[1] + this._config.size[1]],
            [this._config.position[0], this._config.position[1] + this._config.size[1]],
        ]);
        for (var _i = 0, vectors_1 = vectors; _i < vectors_1.length; _i++) {
            var vector = vectors_1[_i];
            if (vector.getDistanceVector(coords).length <= deviation) {
                return true;
            }
        }
        return false;
    };
    return RectangularBound;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (RectangularBound);


/***/ }),

/***/ "./src/canvas/structs/drawable/drawable-group.ts":
/*!*******************************************************!*\
  !*** ./src/canvas/structs/drawable/drawable-group.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _drawable_drawable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../drawable/drawable */ "./src/canvas/structs/drawable/drawable.ts");
/* harmony import */ var _drawable_drawable_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../drawable/drawable-storage */ "./src/canvas/structs/drawable/drawable-storage.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * Drawable group class
 */
var DrawableGroup = /** @class */ (function (_super) {
    __extends(DrawableGroup, _super);
    /**
     * DrawableGroup constructor
     * @param id - group ID
     * @param config - config
     * @param data - extra data
     * @param children - children of grouped objects
     */
    function DrawableGroup(id, config, data, children) {
        if (data === void 0) { data = {}; }
        if (children === void 0) { children = []; }
        var _this = _super.call(this, id, config, data) || this;
        /**
         * Name of class to use as subscriber name in observable logic
         */
        _this._subscriberName = 'DrawableGroup';
        _this._storage = new _drawable_drawable_storage__WEBPACK_IMPORTED_MODULE_1__["default"](_this._processChildrenToGroup(children));
        _this._storage.onViewChange(_this._subscriberName, function (target, extra) {
            _this._observeHelper.processWithMuteHandlers(extra);
        });
        return _this;
    }
    /**
     * {@inheritDoc DrawableInterface.draw}
     */
    DrawableGroup.prototype.draw = function (drawer) {
        this._storage.list.forEach(function (item) {
            if (item.config.visible) {
                item.draw(drawer);
            }
        });
    };
    /**
     * {@inheritDoc DrawableInterface.destruct}
     */
    DrawableGroup.prototype.destruct = function () {
        var _this = this;
        this._storage.list.forEach(function (item) {
            item.offViewChange(_this._subscriberName);
        });
        return this._processChildrenToUngroup(this.children);
    };
    Object.defineProperty(DrawableGroup.prototype, "children", {
        /**
         * List getter
         */
        get: function () {
            return this._storage.list;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Some actions with children before grouping
     */
    DrawableGroup.prototype._processChildrenToGroup = function (children) {
        return children;
    };
    /**
     * Some actions with children before ungrouping
     */
    DrawableGroup.prototype._processChildrenToUngroup = function (children) {
        return children;
    };
    return DrawableGroup;
}(_drawable_drawable__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawableGroup);


/***/ }),

/***/ "./src/canvas/structs/drawable/drawable-layer.ts":
/*!*******************************************************!*\
  !*** ./src/canvas/structs/drawable/drawable-layer.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _drawable_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./drawable-group */ "./src/canvas/structs/drawable/drawable-group.ts");
/* harmony import */ var _drawable_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./drawable-storage */ "./src/canvas/structs/drawable/drawable-storage.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();


/**
 * DrawableLayer class
 */
var DrawableLayer = /** @class */ (function (_super) {
    __extends(DrawableLayer, _super);
    /**
     * DrawableLayer constructor
     * @param id - group ID
     * @param config - config
     * @param data - extra data
     * @param children - children of grouped objects
     */
    function DrawableLayer(id, config, data, children) {
        if (data === void 0) { data = {}; }
        if (children === void 0) { children = []; }
        var _this = _super.call(this, id, config, data) || this;
        /**
         * {@inheritDoc DrawableLayerInterface.isLayer}
         */
        _this.isLayer = true;
        _this._storage = new _drawable_storage__WEBPACK_IMPORTED_MODULE_1__["default"](_this._processChildrenToGroup(children));
        _this._storage.onViewChange(_this._subscriberName, function (target, extra) {
            _this._observeHelper.processWithMuteHandlers(extra);
        });
        return _this;
    }
    Object.defineProperty(DrawableLayer.prototype, "config", {
        /**
         * config getter
         */
        get: function () {
            return this._config;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DrawableLayer.prototype, "storage", {
        /**
         * {@inheritDoc DrawableLayerInterface.storage}
         */
        get: function () {
            return this._storage;
        },
        enumerable: false,
        configurable: true
    });
    return DrawableLayer;
}(_drawable_group__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawableLayer);


/***/ }),

/***/ "./src/canvas/structs/drawable/drawable-storage.ts":
/*!*********************************************************!*\
  !*** ./src/canvas/structs/drawable/drawable-storage.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_observe_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/observe-helper */ "./src/canvas/helpers/observe-helper.ts");
/* harmony import */ var _helpers_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/base */ "./src/canvas/helpers/base.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../vector */ "./src/canvas/structs/vector/index.ts");
/* harmony import */ var _drawable_positional_drawable_group__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../drawable/positional-drawable-group */ "./src/canvas/structs/drawable/positional-drawable-group.ts");
/* harmony import */ var _helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/type-helpers */ "./src/canvas/helpers/type-helpers.ts");
/* harmony import */ var _positional_context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./positional-context */ "./src/canvas/structs/drawable/positional-context.ts");
/* harmony import */ var _drawable_layer__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./drawable-layer */ "./src/canvas/structs/drawable/drawable-layer.ts");







/**
 * Storage for drawable objects
 * @public
 */
var DrawableStorage = /** @class */ (function () {
    /**
     * Drawable constructor
     * @param items - batch children to cache
     */
    function DrawableStorage(items) {
        var _this = this;
        /**
         * Name of class to use as subscriber name in observable logic
         */
        this._subscriberName = 'DrawableStorage';
        /**
         * List of stored drawable objects
         */
        this._list = [];
        this._observeHelper = new _helpers_observe_helper__WEBPACK_IMPORTED_MODULE_0__["default"]();
        this.addBatch(items);
        this._sort();
        this.onViewChange(this._subscriberName, function (target, extra) {
            if (extra !== null && extra.hasOwnProperty('zIndexChanged') && extra.zIndexChanged) {
                _this._sort();
            }
        });
    }
    Object.defineProperty(DrawableStorage.prototype, "list", {
        /**
         * Stored drawable objects children getter
         */
        get: function () {
            return this._list;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * {@inheritDoc DrawableStorageInterface.cache}
     */
    DrawableStorage.prototype.add = function (item) {
        var _this = this;
        item.onViewChange(this._subscriberName, function (target, extra) { return _this._observeHelper.processWithMuteHandlers(extra); });
        this._list.push(item);
        this._sort();
        this._observeHelper.processWithMuteHandlers();
    };
    /**
     * {@inheritDoc DrawableStorageInterface.cache}
     */
    DrawableStorage.prototype.addBatch = function (items) {
        var _this = this;
        items.forEach(function (item) {
            item.onViewChange(_this._subscriberName, function (target, extra) { return _this._observeHelper.processWithMuteHandlers(extra); });
            _this._list.push(item);
        });
        this._sort();
        this._observeHelper.processWithMuteHandlers();
    };
    /**
     * Deletes objects found by config from storage
     * @param config - filter config
     */
    DrawableStorage.prototype.delete = function (config) {
        var _this = this;
        var result = [];
        this._observeHelper.withMuteHandlers(function () {
            _this.find(config).forEach(function (item) {
                result.push(_this.deleteById(item.id));
            });
        });
        this._observeHelper.processWithMuteHandlers();
        return result;
    };
    /**
     * Deletes object by ID from storage
     * @param id - object ID
     */
    DrawableStorage.prototype.deleteById = function (id) {
        var index = this._list.findIndex(function (item) { return item.id === id; });
        if (index !== -1) {
            var deletedItem = this._list.splice(index, 1)[0];
            deletedItem.offViewChange(this._subscriberName);
            this._observeHelper.processWithMuteHandlers();
            return deletedItem;
        }
        // TODO customize exception
        throw new Error("cannot find object with id '".concat(id, "'"));
    };
    /**
     * {@inheritDoc DrawableStorageInterface.clear}
     */
    DrawableStorage.prototype.clear = function () {
        this._list.length = 0;
        this._observeHelper.processWithMuteHandlers();
    };
    /**
     * {@inheritDoc DrawableStorageInterface.find}
     */
    DrawableStorage.prototype.find = function (config) {
        return this._find(function (item) {
            if (config.idsOnly && config.idsOnly.indexOf(item.id) === -1) {
                return false;
            }
            if (config.idsExclude && config.idsExclude.indexOf(item.id) !== -1) {
                return false;
            }
            if (config.typesOnly && config.typesOnly.indexOf(item.type) === -1) {
                return false;
            }
            if (config.typesExclude && config.typesExclude.indexOf(item.type) !== -1) {
                return false;
            }
            return !(config.extraFilter && !config.extraFilter(item));
        });
    };
    /**
     * {@inheritDoc DrawableStorageInterface.findById}
     */
    DrawableStorage.prototype.findById = function (id) {
        var foundItems = this._find(function (candidate) { return candidate.id === id; });
        if (foundItems.length) {
            return foundItems[0];
        }
        // TODO customize exception
        throw new Error("cannot find object with id '".concat(id, "'"));
    };
    /**
     * {@inheritDoc DrawableStorageInterface.findByPosition}
     */
    DrawableStorage.prototype.findByPosition = function (coords) {
        for (var i = this._list.length - 1; i >= 0; --i) {
            var item = this._list[i];
            // TODO maybe only visible?
            if ((0,_helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__.isLayer)(item)) {
                var context = item.storage.findByPosition(coords);
                if (!context.isEmpty()) {
                    return context;
                }
            }
            else if ((0,_helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__.isPositional)(item) && item.boundIncludes(coords)) {
                var element = item;
                var position = element.getRelativePosition(coords);
                return new _positional_context__WEBPACK_IMPORTED_MODULE_5__["default"](element, position);
            }
        }
        return new _positional_context__WEBPACK_IMPORTED_MODULE_5__["default"](null, null);
    };
    /**
     * {@inheritDoc DrawableStorageInterface.findByNearEdgePosition}
     */
    DrawableStorage.prototype.findByNearEdgePosition = function (coords, deviation) {
        var positionContext = this.findByPosition(coords);
        for (var i = this._list.length - 1; i >= 0; --i) {
            var item = this._list[i];
            // TODO maybe only visible?
            if ((0,_helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__.isLayer)(item)) {
                var context = item.storage.findByNearEdgePosition(coords, deviation);
                if (!context.isEmpty()) {
                    return context;
                }
            }
            else if ((0,_helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__.isPositional)(item)
                && item.isNearBoundEdge(coords, deviation)
                && (positionContext.isEmpty() || positionContext.element === item)) {
                var element = item;
                var position = element.getRelativePosition(coords);
                return new _positional_context__WEBPACK_IMPORTED_MODULE_5__["default"](element, position);
            }
        }
        return new _positional_context__WEBPACK_IMPORTED_MODULE_5__["default"](null, null);
    };
    /**
     * {@inheritDoc DrawableStorageInterface.group}
     */
    DrawableStorage.prototype.group = function (ids) {
        var groupItems = this.delete({ idsOnly: ids });
        var minPosition = (0,_helpers_base__WEBPACK_IMPORTED_MODULE_1__.getMinPosition)(groupItems.map(function (item) { return item.config.position; }));
        var maxPosition = (0,_helpers_base__WEBPACK_IMPORTED_MODULE_1__.getMaxPosition)(groupItems.map(function (item) {
            return (0,_vector__WEBPACK_IMPORTED_MODULE_2__.createVector)(item.config.position)
                .add((0,_vector__WEBPACK_IMPORTED_MODULE_2__.createVector)(item.config.size))
                .toArray();
        }));
        var groupSize = (0,_vector__WEBPACK_IMPORTED_MODULE_2__.createVector)(maxPosition).sub((0,_vector__WEBPACK_IMPORTED_MODULE_2__.createVector)(minPosition)).toArray();
        var groupZIndex = Math.max.apply(Math, groupItems.map(function (item) { return item.config.zIndex; })) + 1;
        var config = {
            position: minPosition,
            size: groupSize,
            zIndex: groupZIndex,
            visible: true,
        };
        var groupId = 'group-' + (new Date()).getTime() + '-' + Math.floor(Math.random() * 100000);
        var group = new _drawable_positional_drawable_group__WEBPACK_IMPORTED_MODULE_3__["default"](groupId, config, {}, groupItems);
        this.add(group);
        return group;
    };
    /**
     * {@inheritDoc DrawableStorageInterface.ungroup}
     */
    DrawableStorage.prototype.ungroup = function (groupId) {
        var group = this.deleteById(groupId);
        this.addBatch(group.destruct());
    };
    /**
     * {@inheritDoc DrawableStorageInterface.addLayer}
     */
    DrawableStorage.prototype.addLayer = function (id, name, children) {
        if (children === void 0) { children = []; }
        var layer = new _drawable_layer__WEBPACK_IMPORTED_MODULE_6__["default"](id, {
            visible: true,
            zIndex: this._getMaxZIndex() + 1,
            name: name,
        }, {}, children);
        this.add(layer);
        return layer;
    };
    /**
     * {@inheritDoc DrawableStorageInterface.getLayer}
     */
    DrawableStorage.prototype.getLayer = function (id) {
        try {
            var candidate = this.findById(id);
            if (!(0,_helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__.isLayer)(candidate)) {
                // TODO customize exception
                throw new Error();
            }
            return this.findById(id);
        }
        catch (e) {
            throw new Error("cannot find layer with id '".concat(id, "'"));
        }
    };
    /**
     * {@inheritDoc DrawableStorageInterface.getLayers}
     */
    DrawableStorage.prototype.getLayers = function () {
        return this._find(function (item) { return (0,_helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__.isLayer)(item); });
    };
    /**
     * {@inheritDoc DrawableStorageInterface.onViewChange}
     */
    DrawableStorage.prototype.onViewChange = function (subscriberName, handler) {
        this._observeHelper.onChange(subscriberName, handler);
    };
    /**
     * {@inheritDoc DrawableStorageInterface.offViewChange}
     */
    DrawableStorage.prototype.offViewChange = function (subscriberName) {
        this._observeHelper.offChange(subscriberName);
    };
    /**
     * Returns the max zIndex of the first depth level items
     */
    DrawableStorage.prototype._getMaxZIndex = function () {
        if (this._list.length === 0) {
            return 0;
        }
        return this._list[this._list.length - 1].config.zIndex;
    };
    /**
     * Find objects in storage by filter callback function
     * @param filter - filter callback function
     */
    DrawableStorage.prototype._find = function (filter) {
        var result = [];
        this._list.forEach(function (item) {
            if (filter(item)) {
                result.push(item);
            }
        });
        return result;
    };
    /**
     * Sorts the stored objects by z-index
     */
    DrawableStorage.prototype._sort = function () {
        // TODO следить
        // console.log('sort');
        this._list.sort(function (lhs, rhs) { return lhs.config.zIndex - rhs.config.zIndex; });
    };
    return DrawableStorage;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DrawableStorage);


/***/ }),

/***/ "./src/canvas/structs/drawable/drawable.ts":
/*!*************************************************!*\
  !*** ./src/canvas/structs/drawable/drawable.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_observe_helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/observe-helper */ "./src/canvas/helpers/observe-helper.ts");
/* harmony import */ var _helpers_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/base */ "./src/canvas/helpers/base.ts");


/**
 * Abstract class for drawable objects
 * @public
 */
var Drawable = /** @class */ (function () {
    /**
     * Drawable constructor
     * @param id - object ID
     * @param config - view config
     * @param data - linked extra data
     */
    function Drawable(id, config, data) {
        if (data === void 0) { data = {}; }
        var _this = this;
        this._id = id;
        this._observeHelper = new _helpers_observe_helper__WEBPACK_IMPORTED_MODULE_0__["default"]();
        this._config = new Proxy(config, {
            set: function (target, index, value) {
                var isChanged = target[index] !== value;
                target[index] = value;
                return isChanged ? _this._observeHelper.processWithMuteHandlers({
                    zIndexChanged: index === 'zIndex',
                }) : true;
            },
        });
        this._data = new Proxy(data, {
            set: function (target, index, value) {
                var isChanged = target[index] !== value;
                target[index] = value;
                return isChanged ? _this._observeHelper.processWithMuteHandlers() : true;
            },
        });
    }
    Object.defineProperty(Drawable.prototype, "id", {
        /**
         * ID getter
         */
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "type", {
        /**
         * Type getter
         */
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "config", {
        /**
         * View config getter
         */
        get: function () {
            return this._config;
        },
        /**
         * View config setter
         * @param config - view config
         */
        set: function (config) {
            var _this = this;
            var isChanged = !(0,_helpers_base__WEBPACK_IMPORTED_MODULE_1__.areArraysEqual)(Object.entries(config), Object.entries(this._config));
            this._observeHelper.withMuteHandlers((function (mutedBefore, manager) {
                var isZIndexChanged = config.zIndex !== _this._config.zIndex;
                Object.entries(config).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    _this._config[key] = value;
                });
                manager.processHandlers(!isChanged || mutedBefore, {
                    zIndexChanged: isZIndexChanged,
                });
            }));
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Drawable.prototype, "data", {
        /**
         * Linked data getter
         */
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * {@inheritDoc DrawableInterface.onViewChange}
     */
    Drawable.prototype.onViewChange = function (subscriberName, handler) {
        this._observeHelper.onChange(subscriberName, handler);
    };
    /**
     * {@inheritDoc DrawableInterface.offViewChange}
     */
    Drawable.prototype.offViewChange = function (subscriberName) {
        this._observeHelper.offChange(subscriberName);
    };
    return Drawable;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Drawable);


/***/ }),

/***/ "./src/canvas/structs/drawable/positional-context.ts":
/*!***********************************************************!*\
  !*** ./src/canvas/structs/drawable/positional-context.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * PositionalContext class
 */
var PositionalContext = /** @class */ (function () {
    /**
     * PositionalContext constructor
     * @param element - element in context
     * @param position - relative context position
     */
    function PositionalContext(element, position) {
        /**
         * Element in context
         */
        this.element = null;
        /**
         * Relative event position's coords
         */
        this.position = null;
        this.element = element;
        this.position = position;
    }
    /**
     * Returns true if context is empty
     */
    PositionalContext.prototype.isEmpty = function () {
        return this.element === null;
    };
    return PositionalContext;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PositionalContext);


/***/ }),

/***/ "./src/canvas/structs/drawable/positional-drawable-group.ts":
/*!******************************************************************!*\
  !*** ./src/canvas/structs/drawable/positional-drawable-group.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _drawable_drawable_group__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../drawable/drawable-group */ "./src/canvas/structs/drawable/drawable-group.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vector */ "./src/canvas/structs/vector/index.ts");
/* harmony import */ var _bounds_rectangular_bound__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../bounds/rectangular-bound */ "./src/canvas/structs/bounds/rectangular-bound.ts");
/* harmony import */ var _vector_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../vector/helpers */ "./src/canvas/structs/vector/helpers.ts");
/* harmony import */ var _helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../helpers/type-helpers */ "./src/canvas/helpers/type-helpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();





/**
 * Positional drawable group class
 */
var PositionalDrawableGroup = /** @class */ (function (_super) {
    __extends(PositionalDrawableGroup, _super);
    /**
     * DrawableGroup constructor
     * @param id - group ID
     * @param config - config
     * @param data - extra data
     * @param children - children of grouped objects
     */
    function PositionalDrawableGroup(id, config, data, children) {
        if (data === void 0) { data = {}; }
        if (children === void 0) { children = []; }
        var _this = _super.call(this, id, config, data, children) || this;
        /**
         * Interface belonging flag
         */
        _this.isPositional = true;
        /**
         * Name of class to use as subscriber name in observable logic
         */
        _this._subscriberName = 'PositionalDrawableGroup';
        return _this;
    }
    /**
     * {@inheritDoc DrawableInterface.draw}
     */
    PositionalDrawableGroup.prototype.draw = function (drawer) {
        var _a;
        drawer.context.save();
        (_a = drawer.context).translate.apply(_a, this.config.position);
        _super.prototype.draw.call(this, drawer);
        drawer.context.restore();
    };
    /**
     * {@inheritDoc DrawableInterface.setPosition}
     */
    PositionalDrawableGroup.prototype.setPosition = function (coords) {
        this._config.position = coords;
    };
    /**
     * {@inheritDoc DrawableInterface.movePosition}
     */
    PositionalDrawableGroup.prototype.movePosition = function (offset) {
        this.setPosition((0,_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(this._config.position)
            .add((0,_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(offset))
            .toArray());
    };
    /**
     * {@inheritDoc DrawableInterface.getRelativePosition}
     */
    PositionalDrawableGroup.prototype.getRelativePosition = function (point) {
        return (0,_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(point)
            .sub((0,_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(this.config.position))
            .toArray();
    };
    /**
     * {@inheritDoc DrawableInterface.boundIncludes}
     */
    PositionalDrawableGroup.prototype.boundIncludes = function (coords) {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            if ((0,_helpers_type_helpers__WEBPACK_IMPORTED_MODULE_4__.isPositional)(child)
                && child.boundIncludes((0,_vector_helpers__WEBPACK_IMPORTED_MODULE_3__.transposeCoordsForward)(coords, this._config.position))) {
                return true;
            }
        }
        return false;
    };
    /**
     * {@inheritDoc DrawableInterface.isNearBoundEdge}
     */
    PositionalDrawableGroup.prototype.isNearBoundEdge = function (coords, deviation) {
        return this.bound.isNearEdge((0,_vector_helpers__WEBPACK_IMPORTED_MODULE_3__.transposeCoordsForward)(coords, this._config.position), deviation);
    };
    Object.defineProperty(PositionalDrawableGroup.prototype, "children", {
        /**
         * List getter
         */
        get: function () {
            return this._storage.list;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PositionalDrawableGroup.prototype, "config", {
        /**
         * View config getter
         */
        get: function () {
            return this._config;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PositionalDrawableGroup.prototype, "bound", {
        /**
         * bound getter
         */
        get: function () {
            return new _bounds_rectangular_bound__WEBPACK_IMPORTED_MODULE_2__["default"]({
                position: [0, 0],
                size: this._config.size,
            });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Some actions with children before grouping
     */
    PositionalDrawableGroup.prototype._processChildrenToGroup = function (children) {
        var _this = this;
        children.forEach(function (item) {
            item.movePosition((0,_vector__WEBPACK_IMPORTED_MODULE_1__.createVector)(_this._config.position).inverse().toArray());
        });
        return children;
    };
    /**
     * Some actions with children before ungrouping
     */
    PositionalDrawableGroup.prototype._processChildrenToUngroup = function (children) {
        var _this = this;
        children.forEach(function (item) {
            item.movePosition(_this._config.position);
        });
        return children;
    };
    return PositionalDrawableGroup;
}(_drawable_drawable_group__WEBPACK_IMPORTED_MODULE_0__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PositionalDrawableGroup);


/***/ }),

/***/ "./src/canvas/structs/drawable/positional-drawable.ts":
/*!************************************************************!*\
  !*** ./src/canvas/structs/drawable/positional-drawable.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../vector */ "./src/canvas/structs/vector/index.ts");
/* harmony import */ var _drawable_drawable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../drawable/drawable */ "./src/canvas/structs/drawable/drawable.ts");
/* harmony import */ var _bounds_rectangular_bound__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../bounds/rectangular-bound */ "./src/canvas/structs/bounds/rectangular-bound.ts");
/* harmony import */ var _vector_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../vector/helpers */ "./src/canvas/structs/vector/helpers.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();




/**
 * Abstract class for drawable positional objects
 * @public
 */
var PositionalDrawable = /** @class */ (function (_super) {
    __extends(PositionalDrawable, _super);
    function PositionalDrawable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Interface belonging flag
         */
        _this.isPositional = true;
        return _this;
    }
    /**
     * {@inheritDoc DrawableInterface.setPosition}
     */
    PositionalDrawable.prototype.setPosition = function (coords) {
        this._config.position = coords;
    };
    /**
     * {@inheritDoc DrawableInterface.movePosition}
     */
    PositionalDrawable.prototype.movePosition = function (offset) {
        this.setPosition((0,_vector__WEBPACK_IMPORTED_MODULE_0__.createVector)(this._config.position)
            .add((0,_vector__WEBPACK_IMPORTED_MODULE_0__.createVector)(offset))
            .toArray());
    };
    /**
     * {@inheritDoc DrawableInterface.getRelativePosition}
     */
    PositionalDrawable.prototype.getRelativePosition = function (point) {
        return (0,_vector__WEBPACK_IMPORTED_MODULE_0__.createVector)(point)
            .sub((0,_vector__WEBPACK_IMPORTED_MODULE_0__.createVector)(this.config.position))
            .toArray();
    };
    /**
     * {@inheritDoc DrawableInterface.boundIncludes}
     */
    PositionalDrawable.prototype.boundIncludes = function (coords) {
        return this.bound.includes((0,_vector_helpers__WEBPACK_IMPORTED_MODULE_3__.transposeCoordsForward)(coords, this._config.position));
    };
    /**
     * {@inheritDoc DrawableInterface.isNearBoundEdge}
     */
    PositionalDrawable.prototype.isNearBoundEdge = function (coords, deviation) {
        return this.bound.isNearEdge((0,_vector_helpers__WEBPACK_IMPORTED_MODULE_3__.transposeCoordsForward)(coords, this._config.position), deviation);
    };
    Object.defineProperty(PositionalDrawable.prototype, "config", {
        /**
         * View config getter
         */
        get: function () {
            return this._config;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PositionalDrawable.prototype, "bound", {
        /**
         * bound getter
         */
        get: function () {
            return new _bounds_rectangular_bound__WEBPACK_IMPORTED_MODULE_2__["default"]({
                position: [0, 0],
                size: this._config.size,
            });
        },
        enumerable: false,
        configurable: true
    });
    return PositionalDrawable;
}(_drawable_drawable__WEBPACK_IMPORTED_MODULE_1__["default"]));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PositionalDrawable);


/***/ }),

/***/ "./src/canvas/structs/filters/grid-filter.ts":
/*!***************************************************!*\
  !*** ./src/canvas/structs/filters/grid-filter.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Filter coords using grid
 */
var GridFilter = /** @class */ (function () {
    function GridFilter() {
    }
    /**
     * {@inheritDoc CoordsFilterInterface.process}
     */
    GridFilter.prototype.process = function (data, config) {
        var x = data[0], y = data[1];
        var scale = config.scale[0];
        var step = config.gridStep;
        if (scale < 1) {
            step *= Math.pow(2, Math.round(Math.log2(1 / scale)));
        }
        else {
            step /= Math.pow(2, Math.round(Math.log2(scale)));
        }
        return [x - x % step, y - y % step];
    };
    return GridFilter;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GridFilter);


/***/ }),

/***/ "./src/canvas/structs/image-cache.ts":
/*!*******************************************!*\
  !*** ./src/canvas/structs/image-cache.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/base */ "./src/canvas/helpers/base.ts");

/**
 * Cache helper for images
 * @public
 */
var ImageCache = /** @class */ (function () {
    function ImageCache() {
        /**
         * Map of the preloaded images
         */
        this._imageMap = {};
        /**
         * Map of the running processes
         */
        this._processMap = {};
        /**
         * Map of the buffered handlers
         */
        this._handlers = {};
        /**
         * Map of the handlers for subscribed objects
         */
        this._totalHandlers = {};
    }
    /**
     * {@inheritDoc ImageCacheInterface.subscribe}
     */
    ImageCache.prototype.subscribe = function (subscriberName, handler) {
        this._totalHandlers[subscriberName] = handler;
    };
    /**
     * {@inheritDoc ImageCacheInterface.unsubscribe}
     */
    ImageCache.prototype.unsubscribe = function (subscriberName) {
        delete this._totalHandlers[subscriberName];
    };
    /**
     * {@inheritDoc ImageCacheInterface.cache}
     */
    ImageCache.prototype.cache = function (source, type, callback) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        var key = this._getKey(source, type);
        if (this._imageMap[key] !== undefined) {
            if (callback !== null) {
                callback(this._imageMap[key]);
            }
            return this._imageMap[key];
        }
        if (this._processMap[key] !== undefined) {
            if (callback !== null) {
                if (this._handlers[key] === undefined) {
                    this._handlers[key] = [];
                }
                this._handlers[key].push(callback);
            }
            return null;
        }
        this._processMap[key] = true;
        var blob = (0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.createBlob)(source, type);
        var url = (0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.createUrlFromBlob)(blob);
        var img = new Image();
        img.src = url;
        img.addEventListener('load', function () {
            _this._imageMap[key] = img;
            delete _this._processMap[key];
            if (_this._handlers[key] !== undefined) {
                var handlers = _this._handlers[key];
                while (handlers.length) {
                    (handlers.pop())(img);
                }
                delete _this._handlers[key];
            }
            if (!Object.keys(_this._processMap).length) {
                Object.values(_this._totalHandlers).forEach(function (handler) { return handler(); });
            }
        });
        return null;
    };
    /**
     * Creates a hash for image data and type and returns it as string
     * @param source - source data of image
     * @param type - mime type
     */
    ImageCache.prototype._getKey = function (source, type) {
        return (0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.hashString)("".concat(source, "_").concat(type));
    };
    return ImageCache;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ImageCache);


/***/ }),

/***/ "./src/canvas/structs/vector/helpers.ts":
/*!**********************************************!*\
  !*** ./src/canvas/structs/vector/helpers.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isInInterval": () => (/* binding */ isInInterval),
/* harmony export */   "isInSegment": () => (/* binding */ isInSegment),
/* harmony export */   "round": () => (/* binding */ round),
/* harmony export */   "transposeCoordsBackward": () => (/* binding */ transposeCoordsBackward),
/* harmony export */   "transposeCoordsForward": () => (/* binding */ transposeCoordsForward)
/* harmony export */ });
/**
 * Returns true if a number is inside interval
 * @param what - number
 * @param interval - interval
 */
function isInInterval(what, interval) {
    return what > interval[0] && what < interval[1];
}
/**
 * Returns true if a number is inside segment
 * @param what - number
 * @param segment - segment
 */
function isInSegment(what, segment) {
    return what >= segment[0] && what <= segment[1];
}
/**
 * Rounds a number with a precision
 * @param num - number
 * @param precision - precision
 */
function round(num, precision) {
    if (precision === void 0) { precision = 0; }
    var mult = Math.pow(10, precision);
    return Math.round(num * mult) / mult;
}
/**
 * Transpose coords with forward applying offset and scale
 * @param coords - coords to transpose
 * @param offset - offset vector
 * @param scale - scale vector
 */
function transposeCoordsForward(coords, offset, scale) {
    if (scale === void 0) { scale = [1, 1]; }
    var x = coords[0], y = coords[1];
    return [(x - offset[0]) / scale[0], (y - offset[1]) / scale[1]];
}
/**
 * Transpose coords with backward applying offset and scale
 * @param coords - coords to transpose
 * @param offset - offset vector
 * @param scale - scale vector
 */
function transposeCoordsBackward(coords, offset, scale) {
    if (scale === void 0) { scale = [1, 1]; }
    var x = coords[0], y = coords[1];
    return [x * scale[0] + offset[0], y * scale[1] + offset[1]];
}


/***/ }),

/***/ "./src/canvas/structs/vector/index.ts":
/*!********************************************!*\
  !*** ./src/canvas/structs/vector/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PositionalVector": () => (/* reexport safe */ _positional_vector__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   "Vector": () => (/* reexport safe */ _vector__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   "createPolygonVectors": () => (/* reexport safe */ _positional_vector__WEBPACK_IMPORTED_MODULE_0__.createPolygonVectors),
/* harmony export */   "createVector": () => (/* reexport safe */ _vector__WEBPACK_IMPORTED_MODULE_2__.createVector),
/* harmony export */   "isInInterval": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_1__.isInInterval),
/* harmony export */   "isInSegment": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_1__.isInSegment),
/* harmony export */   "round": () => (/* reexport safe */ _helpers__WEBPACK_IMPORTED_MODULE_1__.round),
/* harmony export */   "toVector": () => (/* reexport safe */ _vector__WEBPACK_IMPORTED_MODULE_2__.toVector)
/* harmony export */ });
/* harmony import */ var _positional_vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./positional-vector */ "./src/canvas/structs/vector/positional-vector.ts");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/canvas/structs/vector/helpers.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vector */ "./src/canvas/structs/vector/vector.ts");






/***/ }),

/***/ "./src/canvas/structs/vector/positional-vector.ts":
/*!********************************************************!*\
  !*** ./src/canvas/structs/vector/positional-vector.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createPolygonVectors": () => (/* binding */ createPolygonVectors),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vector */ "./src/canvas/structs/vector/vector.ts");

/**
 * Positional vector class
 */
var PositionalVector = /** @class */ (function () {
    /**
     * PositionalVector constructor
     * @param position - position
     * @param size - size
     */
    function PositionalVector(position, size) {
        this.position = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(position);
        this.size = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(size);
    }
    Object.defineProperty(PositionalVector.prototype, "target", {
        /**
         * {@inheritDoc PositionalVectorInterface.target}
         */
        get: function () {
            return this.position.clone().add(this.size);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PositionalVector.prototype, "length", {
        /**
         * Returns the length of vector
         */
        get: function () {
            return this.size.length;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * {@inheritDoc PositionalVectorInterface.includes}
     */
    PositionalVector.prototype.includes = function (point, precision) {
        if (precision === void 0) { precision = 4; }
        var pointVector = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(point);
        if (this.position.isEqual(pointVector, precision) || this.target.isEqual(pointVector, precision)) {
            return true;
        }
        var _a = this.position.toArray(precision), x1 = _a[0], y1 = _a[1];
        var _b = this.target.toArray(precision), x2 = _b[0], y2 = _b[1];
        var _c = pointVector.toArray(precision), x = _c[0], y = _c[1];
        return (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) === 0
            && (x1 < x && x < x2) && (y1 < y && y < y2);
    };
    /**
     * {@inheritDoc PositionalVectorInterface.getDistanceVector}
     */
    PositionalVector.prototype.getDistanceVector = function (point) {
        var vectorPoint = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(point);
        var destPoint = this._getNearestLinePoint(point);
        if (destPoint.x < Math.min(this.position.x, this.target.x) ||
            destPoint.x > Math.max(this.position.x, this.target.x) ||
            destPoint.y < Math.min(this.position.y, this.target.y) ||
            destPoint.y > Math.max(this.position.y, this.target.y)) {
            var l1 = new PositionalVector(vectorPoint, (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(this.position).sub(vectorPoint));
            var l2 = new PositionalVector(vectorPoint, (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(this.target).sub(vectorPoint));
            if (l1.length < l2.length) {
                return l1;
            }
            else {
                return l2;
            }
        }
        return new PositionalVector(vectorPoint, destPoint.sub(vectorPoint));
    };
    /**
     * Returns the coords of the nearest point on vector to another point
     * @param point - another point
     */
    PositionalVector.prototype._getNearestLinePoint = function (point) {
        var pointVector = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(point);
        var k = ((this.target.y - this.position.y) * (pointVector.x - this.position.x)
            - (this.target.x - this.position.x) * (pointVector.y - this.position.y)) / (Math.pow((this.target.y - this.position.y), 2) + Math.pow((this.target.x - this.position.x), 2));
        return new _vector__WEBPACK_IMPORTED_MODULE_0__["default"]([
            pointVector.x - k * (this.target.y - this.position.y),
            pointVector.y + k * (this.target.x - this.position.x),
        ]);
    };
    return PositionalVector;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PositionalVector);
/**
 * Creates a list of vectors of the polygon from a list of points
 * @param points - list of points
 */
function createPolygonVectors(points) {
    var result = [];
    for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
        var lhsPoint = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(points[j]);
        var rhsPoint = (0,_vector__WEBPACK_IMPORTED_MODULE_0__.toVector)(points[i]);
        result.push(new PositionalVector(lhsPoint, rhsPoint.sub(lhsPoint)));
    }
    return result;
}


/***/ }),

/***/ "./src/canvas/structs/vector/vector.ts":
/*!*********************************************!*\
  !*** ./src/canvas/structs/vector/vector.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createVector": () => (/* binding */ createVector),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "toVector": () => (/* binding */ toVector)
/* harmony export */ });
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./src/canvas/structs/vector/helpers.ts");

/**
 * Vector class
 * @public
 */
var Vector = /** @class */ (function () {
    /**
     * Vector constructor
     * @param x - coordinate X
     * @param y - coordinate Y
     * @param defaultPrecision - default precision
     */
    function Vector(_a, defaultPrecision) {
        var x = _a[0], y = _a[1];
        /**
         * Default precision
         */
        this._defaultPrecision = 4;
        this.x = x;
        this.y = y;
        if (this._defaultPrecision !== undefined) {
            this._defaultPrecision = defaultPrecision;
        }
    }
    /**
     * Add another vector to this vector
     * @param v - vector to cache
     */
    Vector.prototype.add = function (v) {
        v = toVector(v);
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    /**
     * Subtracts vector with another vector
     * @param v - vector to subtract
     */
    Vector.prototype.sub = function (v) {
        v = toVector(v);
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    /**
     * Multiples vector by number
     * @param mul - multiplier
     */
    Vector.prototype.mul = function (mul) {
        this.x *= mul;
        this.y *= mul;
        return this;
    };
    /**
     * Divides vector by number
     * @param div - divider
     */
    Vector.prototype.div = function (div) {
        this.x /= div;
        this.y /= div;
        return this;
    };
    /**
     * Inverses vector
     */
    Vector.prototype.inverse = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    /**
     * Reverses vector
     */
    Vector.prototype.reverse = function () {
        this.x = 1 / this.x;
        this.y = 1 / this.y;
        return this;
    };
    Object.defineProperty(Vector.prototype, "length", {
        /**
         * Returns the length of vector
         */
        get: function () {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Returns true if this vector is equal to another vector
     * @param v - another vector
     * @param precision - round precision for comparison
     */
    Vector.prototype.isEqual = function (v, precision) {
        if (precision === void 0) { precision = this._defaultPrecision; }
        v = toVector(v);
        return (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(v.x, precision) === (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(this.x, precision)
            && (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(v.y, precision) === (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(this.y, precision);
    };
    /**
     * Returns true if angle between vectors equals 90 degrees
     * @param v - another vector
     */
    Vector.prototype.isOrthogonal = function (v) {
        return this.getCos(v) === 0;
    };
    /**
     * Returns true if this vector is collinear with argument vector
     * @param v - another vector
     */
    Vector.prototype.isCollinear = function (v) {
        return this.mulVector(v) === 0;
    };
    /**
     * Returns distance vector of this and another vector
     * @param v - another vector
     */
    Vector.prototype.distance = function (v) {
        return this.clone().sub(v);
    };
    /**
     * Returns scalar product with another vector
     * @param v - another vector
     */
    Vector.prototype.mulScalar = function (v) {
        v = toVector(v);
        return this.x * v.x + this.y * v.y;
    };
    /**
     * Returns length of vector product with another vector
     * @param v - another vector
     */
    Vector.prototype.mulVector = function (v) {
        v = toVector(v);
        return this.x * v.y - this.y * v.x;
    };
    /**
     * Normalizes this vector
     */
    Vector.prototype.normalize = function () {
        var len = this.length;
        this.x /= len;
        this.y /= len;
        return this;
    };
    /**
     * Transposes vector forward with offset and scale
     * @param offset - offset
     * @param scale - scale
     */
    Vector.prototype.transposeForward = function (offset, scale) {
        var offsetVector = toVector(offset);
        var scaleVector = toVector(scale);
        this.x = (this.x - offsetVector.x) / scaleVector.x;
        this.y = (this.y - offsetVector.y) / scaleVector.y;
        return this;
    };
    /**
     * Transposes vector backward with offset and scale
     * @param offset - offset
     * @param scale - scale
     */
    Vector.prototype.transposeBackward = function (offset, scale) {
        var offsetVector = toVector(offset);
        var scaleVector = toVector(scale);
        this.x = offsetVector.x + this.x * scaleVector.x;
        this.y = offsetVector.y + this.y * scaleVector.y;
        return this;
    };
    /**
     * Returns new vector by rotating this
     * @param angle - angle to rotate to
     * @param precision - round precision
     */
    Vector.prototype.rotate = function (angle, precision) {
        if (precision === void 0) { precision = this._defaultPrecision; }
        var cs = Math.cos(angle);
        var sn = Math.sin(angle);
        this.x = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(this.x * cs - this.y * sn, precision);
        this.y = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(this.x * sn + this.y * cs, precision);
        return this;
    };
    /**
     * Get cos with another vector
     * @param v - another vector
     */
    Vector.prototype.getCos = function (v) {
        if (v === void 0) { v = null; }
        if (v === null) {
            v = createVector([1, 0]);
        }
        else {
            v = toVector(v);
        }
        return this.mulScalar(v) / (this.length * v.length);
    };
    /**
     * Clones vector
     */
    Vector.prototype.clone = function () {
        return createVector(this.toArray());
    };
    /**
     * Converts vector to array
     * @param precision - precision
     */
    Vector.prototype.toArray = function (precision) {
        if (precision === undefined) {
            return [this.x, this.y];
        }
        return [(0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(this.x, precision), (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.round)(this.y, precision)];
    };
    return Vector;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Vector);
/**
 * Creates new vector
 * @public
 * @param coords - coordinates of new vector
 */
function createVector(coords) {
    return new Vector(coords);
}
/**
 * Converts instance to vector if it's an array
 * @param coords - coords as vector or an array
 */
function toVector(coords) {
    return (coords instanceof Array) ? createVector(coords) : coords;
}


/***/ }),

/***/ "./src/canvas/structs/view-config.ts":
/*!*******************************************!*\
  !*** ./src/canvas/structs/view-config.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/base */ "./src/canvas/helpers/base.ts");
/* harmony import */ var _helpers_observe_helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/observe-helper */ "./src/canvas/helpers/observe-helper.ts");
/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./vector */ "./src/canvas/structs/vector/index.ts");
/* harmony import */ var _vector_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./vector/helpers */ "./src/canvas/structs/vector/helpers.ts");




/**
 * Config for objects drawable on canvas
 * @public
 */
var ViewConfig = /** @class */ (function () {
    /**
     * ViewConfig constructor
     * @param scale - scale
     * @param offset - offset
     * @param gridStep - grid step
     */
    function ViewConfig(_a) {
        var scale = _a.scale, offset = _a.offset, gridStep = _a.gridStep;
        var _this = this;
        this._observeHelper = new _helpers_observe_helper__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this._scale = new Proxy(scale, {
            set: function (target, index, value) {
                var isChanged = target[index] !== value;
                target[index] = value;
                return isChanged ? _this._observeHelper.processWithMuteHandlers() : true;
            },
        });
        this._offset = new Proxy(offset, {
            set: function (target, index, value) {
                var isChanged = target[index] !== value;
                target[index] = value;
                return isChanged ? _this._observeHelper.processWithMuteHandlers() : true;
            },
        });
        this._gridStep = gridStep;
    }
    /**
     * {@inheritDoc ViewConfigObservableInterface.onViewChange}
     */
    ViewConfig.prototype.onViewChange = function (subscriberName, handler) {
        this._observeHelper.onChange(subscriberName, handler);
    };
    /**
     * {@inheritDoc DrawableStorageInterface.offViewChange}
     */
    ViewConfig.prototype.offViewChange = function (subscriberName) {
        this._observeHelper.offChange(subscriberName);
    };
    /**
     * {@inheritDoc ViewConfigObservableInterface.transposeForward}
     */
    ViewConfig.prototype.transposeForward = function (coords) {
        return (0,_vector_helpers__WEBPACK_IMPORTED_MODULE_3__.transposeCoordsForward)(coords, this._offset, this._scale);
    };
    /**
     * {@inheritDoc ViewConfigObservableInterface.transposeBackward}
     */
    ViewConfig.prototype.transposeBackward = function (coords) {
        return (0,_vector_helpers__WEBPACK_IMPORTED_MODULE_3__.transposeCoordsBackward)(coords, this._offset, this._scale);
    };
    /**
     * {@inheritDoc ViewConfigObservableInterface.updateScaleInCursorContext}
     */
    ViewConfig.prototype.updateScaleInCursorContext = function (newScale, cursorCoords) {
        var _this = this;
        var isChanged = !(0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.areArraysEqual)(newScale, this._scale);
        if (!isChanged) {
            return;
        }
        this._observeHelper.withMuteHandlers(function (mutedBefore, manager) {
            var oldScalePosition = (0,_vector__WEBPACK_IMPORTED_MODULE_2__.createVector)(_this.transposeForward(cursorCoords));
            _this.scale = newScale;
            var newScalePosition = (0,_vector__WEBPACK_IMPORTED_MODULE_2__.createVector)(_this.transposeForward(cursorCoords));
            var difference = newScalePosition.clone().sub(oldScalePosition);
            _this.offset = _this.transposeBackward(difference.toArray());
            manager.processHandlers(!isChanged || mutedBefore);
        });
    };
    /**
     * Updates all the data in config
     * @param scale - scale
     * @param offset - offset
     * @param gridStep - grid step
     */
    ViewConfig.prototype.update = function (_a) {
        var _this = this;
        var scale = _a.scale, offset = _a.offset, gridStep = _a.gridStep;
        var isChanged = !(0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.areArraysEqual)(scale, this._scale) || !(0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.areArraysEqual)(offset, this._offset);
        this._observeHelper.withMuteHandlers(function (mutedBefore, manager) {
            _this.scale = scale;
            _this.offset = offset;
            _this.gridStep = gridStep;
            manager.processHandlers(!isChanged || mutedBefore);
        });
    };
    /**
     * Returns the config data
     */
    ViewConfig.prototype.getConfig = function () {
        return {
            scale: this._scale,
            offset: this._offset,
            gridStep: this._gridStep,
        };
    };
    Object.defineProperty(ViewConfig.prototype, "scale", {
        /**
         * Scale getter
         */
        get: function () {
            return this._scale;
        },
        /**
         * Scale setter
         * @param scale - scale
         */
        set: function (scale) {
            var _this = this;
            var isChanged = !(0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.areArraysEqual)(scale, this._scale);
            this._observeHelper.withMuteHandlers(function (mutedBefore, manager) {
                _this._scale[0] = scale[0];
                _this._scale[1] = scale[1];
                manager.processHandlers(!isChanged || mutedBefore);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewConfig.prototype, "offset", {
        /**
         * Offset getter
         */
        get: function () {
            return this._offset;
        },
        /**
         * Offset setter
         * @param offset - offset
         */
        set: function (offset) {
            var _this = this;
            var isChanged = !(0,_helpers_base__WEBPACK_IMPORTED_MODULE_0__.areArraysEqual)(offset, this._offset);
            this._observeHelper.withMuteHandlers(function (mutedBefore, manager) {
                _this._offset[0] = offset[0];
                _this._offset[1] = offset[1];
                manager.processHandlers(!isChanged || mutedBefore);
            });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ViewConfig.prototype, "gridStep", {
        /**
         * Grid step getter
         */
        get: function () {
            return this._gridStep;
        },
        /**
         * Grid step setter
         * @param gridStep - grid step
         */
        set: function (gridStep) {
            var _this = this;
            var isChanged = gridStep !== this._gridStep;
            this._observeHelper.withMuteHandlers(function (mutedBefore, manager) {
                _this._gridStep = gridStep;
                manager.processHandlers(!isChanged || mutedBefore);
            });
        },
        enumerable: false,
        configurable: true
    });
    return ViewConfig;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ViewConfig);


/***/ }),

/***/ "?9157":
/*!************************!*\
  !*** crypto (ignored) ***!
  \************************/
/***/ (() => {

/* (ignored) */

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _canvas_drawer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas/drawer */ "./src/canvas/drawer.ts");
/* harmony import */ var _canvas_structs_drawable_drawable_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas/structs/drawable/drawable-storage */ "./src/canvas/structs/drawable/drawable-storage.ts");
/* harmony import */ var _canvas_structs_view_config__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./canvas/structs/view-config */ "./src/canvas/structs/view-config.ts");
/* harmony import */ var _canvas_figures_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./canvas/figures/svg */ "./src/canvas/figures/svg.ts");
/* harmony import */ var _canvas_figures_grid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./canvas/figures/grid */ "./src/canvas/figures/grid.ts");
/* harmony import */ var _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./canvas/figures/rect */ "./src/canvas/figures/rect.ts");






var storage = new _canvas_structs_drawable_drawable_storage__WEBPACK_IMPORTED_MODULE_1__["default"]([]);
console.log(storage);
var viewConfig = new _canvas_structs_view_config__WEBPACK_IMPORTED_MODULE_2__["default"]({
    scale: [1, 1],
    offset: [0, 0],
    gridStep: 15,
});
console.log(viewConfig);
var drawer = new _canvas_drawer__WEBPACK_IMPORTED_MODULE_0__["default"]({
    domElement: document.getElementById('canvas'),
    viewConfig: viewConfig,
    storage: storage,
});
drawer.draw();
storage.addLayer('grid', 'Grid layer', [
    new _canvas_figures_grid__WEBPACK_IMPORTED_MODULE_4__["default"](1, {
        zIndex: -Infinity,
        visible: true,
        mainLineColor: '#bbb',
        subLineColor: '#dedede',
        lineWidth: 1,
        linesInBlock: 5,
    }),
]);
var elementsLayer = storage.addLayer('elements', 'Elements layer', [
    new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](2, {
        position: [10, 20],
        size: [100, 30],
        zIndex: 1,
        visible: true,
        fillStyle: 'green',
        strokeStyle: 'black',
        lineWidth: 1,
    }),
    new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](3, {
        position: [10, 25],
        size: [50, 50],
        zIndex: 1,
        visible: true,
        fillStyle: 'blue',
        strokeStyle: 'black',
        lineWidth: 1,
    }),
    new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](4, {
        position: [15 * 30, 15 * 10],
        size: [15 * 10, 15 * 5],
        zIndex: 10,
        visible: true,
        fillStyle: 'transparent',
        strokeStyle: 'red',
        lineWidth: 1,
    }),
    new _canvas_figures_svg__WEBPACK_IMPORTED_MODULE_3__["default"](5, {
        position: [300, 550],
        size: [162, 82],
        zIndex: 1,
        visible: true,
        data: "<svg width='162' height='82' viewBox='0 0 162 82' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M28.6923 1L1 40.1241L28.6923 81H134.675L161 40.1241L134.675 1H28.6923Z' fill='#FFBCF2' stroke='black' stroke-linejoin='round' /></svg>", // eslint-disable-line
    }),
    new _canvas_figures_svg__WEBPACK_IMPORTED_MODULE_3__["default"](5, {
        position: [100, 550],
        size: [162, 82],
        zIndex: 1,
        visible: true,
        data: "<svg width='162' height='82' viewBox='0 0 162 82' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M28.6923 1L1 40.1241L28.6923 81H134.675L161 40.1241L134.675 1H28.6923Z' fill='#FFBCF2' stroke='black' stroke-linejoin='round' /></svg>", // eslint-disable-line
    }),
    new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](6, {
        position: [350, 350],
        size: [30, 30],
        zIndex: 1,
        visible: true,
        fillStyle: 'transparent',
        strokeStyle: 'blue',
        lineWidth: 1,
    }),
    new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](7, {
        position: [350, 300],
        size: [30, 30],
        zIndex: 1,
        visible: true,
        fillStyle: 'transparent',
        strokeStyle: 'blue',
        lineWidth: 1,
    }),
    new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](8, {
        position: [300, 350],
        size: [30, 30],
        zIndex: 1,
        visible: true,
        fillStyle: 'transparent',
        strokeStyle: 'blue',
        lineWidth: 1,
    }),
    new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](9, {
        position: [200, 200],
        size: [160, 160],
        zIndex: 0,
        visible: true,
        fillStyle: 'green',
        strokeStyle: 'blue',
        lineWidth: 1,
    }),
]);
var group = elementsLayer.storage.group([6, 7, 8, 9]);
console.log(group);
// elementsLayer.storage.ungroup(group.id);
var anotherLayer = storage.addLayer('another', 'Another Layer', []);
anotherLayer.storage.add(new _canvas_figures_rect__WEBPACK_IMPORTED_MODULE_5__["default"](9, {
    position: [800, 500],
    size: [100, 100],
    zIndex: -100,
    visible: true,
    fillStyle: 'lightblue',
    strokeStyle: 'blue',
    lineWidth: 1,
}));
console.log('layers', storage.getLayers());

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFDYixTQUFTLEVBQUUsV0FBVztJQUN0QixXQUFXLEVBQUUsTUFBTTtJQUNuQixTQUFTLEVBQUUsQ0FBQztDQUNiLENBQUMsQ0FBQyxDQUFDO0FBRUosT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9ub2RlX21vZHVsZXMvY3J5cHRvLWpzL2NvcmUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vbm9kZV9tb2R1bGVzL2NyeXB0by1qcy9tZDUuanMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9kcmF3ZXIudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9maWd1cmVzL2dyaWQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9maWd1cmVzL3JlY3QudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9maWd1cmVzL3N2Zy50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL2hlbHBlcnMvYmFzZS50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL2hlbHBlcnMvaW1hZ2UtY2FjaGUtaGVscGVyLnRzIiwid2VicGFjazovL2NhbnZhcy10cy8uL3NyYy9jYW52YXMvaGVscGVycy9vYnNlcnZlLWhlbHBlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL2hlbHBlcnMvdHlwZS1oZWxwZXJzLnRzIiwid2VicGFjazovL2NhbnZhcy10cy8uL3NyYy9jYW52YXMvc3RydWN0cy9ib3VuZHMvcG9seWdvbmFsLWJvdW5kLnRzIiwid2VicGFjazovL2NhbnZhcy10cy8uL3NyYy9jYW52YXMvc3RydWN0cy9ib3VuZHMvcmVjdGFuZ3VsYXItYm91bmQudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9zdHJ1Y3RzL2RyYXdhYmxlL2RyYXdhYmxlLWdyb3VwLnRzIiwid2VicGFjazovL2NhbnZhcy10cy8uL3NyYy9jYW52YXMvc3RydWN0cy9kcmF3YWJsZS9kcmF3YWJsZS1sYXllci50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvZHJhd2FibGUvZHJhd2FibGUtc3RvcmFnZS50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvZHJhd2FibGUvZHJhd2FibGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9zdHJ1Y3RzL2RyYXdhYmxlL3Bvc2l0aW9uYWwtY29udGV4dC50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvZHJhd2FibGUvcG9zaXRpb25hbC1kcmF3YWJsZS1ncm91cC50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvZHJhd2FibGUvcG9zaXRpb25hbC1kcmF3YWJsZS50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvZmlsdGVycy9ncmlkLWZpbHRlci50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvaW1hZ2UtY2FjaGUudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9zdHJ1Y3RzL3ZlY3Rvci9oZWxwZXJzLnRzIiwid2VicGFjazovL2NhbnZhcy10cy8uL3NyYy9jYW52YXMvc3RydWN0cy92ZWN0b3IvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2NhbnZhcy9zdHJ1Y3RzL3ZlY3Rvci9wb3NpdGlvbmFsLXZlY3Rvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvdmVjdG9yL3ZlY3Rvci50cyIsIndlYnBhY2s6Ly9jYW52YXMtdHMvLi9zcmMvY2FudmFzL3N0cnVjdHMvdmlldy1jb25maWcudHMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzL2lnbm9yZWR8L2hvbWUvc21vcmVuL3Byb2plY3RzL2NhbnZhcy9ub2RlX21vZHVsZXMvY3J5cHRvLWpzfGNyeXB0byIsIndlYnBhY2s6Ly9jYW52YXMtdHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NhbnZhcy10cy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2FudmFzLXRzLy4vc3JjL2FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeSgpO1xuXHR9XG5cdGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG5cdFx0Ly8gQU1EXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0fVxuXHRlbHNlIHtcblx0XHQvLyBHbG9iYWwgKGJyb3dzZXIpXG5cdFx0cm9vdC5DcnlwdG9KUyA9IGZhY3RvcnkoKTtcblx0fVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG5cblx0LypnbG9iYWxzIHdpbmRvdywgZ2xvYmFsLCByZXF1aXJlKi9cblxuXHQvKipcblx0ICogQ3J5cHRvSlMgY29yZSBjb21wb25lbnRzLlxuXHQgKi9cblx0dmFyIENyeXB0b0pTID0gQ3J5cHRvSlMgfHwgKGZ1bmN0aW9uIChNYXRoLCB1bmRlZmluZWQpIHtcblxuXHQgICAgdmFyIGNyeXB0bztcblxuXHQgICAgLy8gTmF0aXZlIGNyeXB0byBmcm9tIHdpbmRvdyAoQnJvd3Nlcilcblx0ICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuY3J5cHRvKSB7XG5cdCAgICAgICAgY3J5cHRvID0gd2luZG93LmNyeXB0bztcblx0ICAgIH1cblxuXHQgICAgLy8gTmF0aXZlIGNyeXB0byBpbiB3ZWIgd29ya2VyIChCcm93c2VyKVxuXHQgICAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmLmNyeXB0bykge1xuXHQgICAgICAgIGNyeXB0byA9IHNlbGYuY3J5cHRvO1xuXHQgICAgfVxuXG5cdCAgICAvLyBOYXRpdmUgY3J5cHRvIGZyb20gd29ya2VyXG5cdCAgICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXMuY3J5cHRvKSB7XG5cdCAgICAgICAgY3J5cHRvID0gZ2xvYmFsVGhpcy5jcnlwdG87XG5cdCAgICB9XG5cblx0ICAgIC8vIE5hdGl2ZSAoZXhwZXJpbWVudGFsIElFIDExKSBjcnlwdG8gZnJvbSB3aW5kb3cgKEJyb3dzZXIpXG5cdCAgICBpZiAoIWNyeXB0byAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubXNDcnlwdG8pIHtcblx0ICAgICAgICBjcnlwdG8gPSB3aW5kb3cubXNDcnlwdG87XG5cdCAgICB9XG5cblx0ICAgIC8vIE5hdGl2ZSBjcnlwdG8gZnJvbSBnbG9iYWwgKE5vZGVKUylcblx0ICAgIGlmICghY3J5cHRvICYmIHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbC5jcnlwdG8pIHtcblx0ICAgICAgICBjcnlwdG8gPSBnbG9iYWwuY3J5cHRvO1xuXHQgICAgfVxuXG5cdCAgICAvLyBOYXRpdmUgY3J5cHRvIGltcG9ydCB2aWEgcmVxdWlyZSAoTm9kZUpTKVxuXHQgICAgaWYgKCFjcnlwdG8gJiYgdHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICB0cnkge1xuXHQgICAgICAgICAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcblx0ICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG5cdCAgICB9XG5cblx0ICAgIC8qXG5cdCAgICAgKiBDcnlwdG9ncmFwaGljYWxseSBzZWN1cmUgcHNldWRvcmFuZG9tIG51bWJlciBnZW5lcmF0b3Jcblx0ICAgICAqXG5cdCAgICAgKiBBcyBNYXRoLnJhbmRvbSgpIGlzIGNyeXB0b2dyYXBoaWNhbGx5IG5vdCBzYWZlIHRvIHVzZVxuXHQgICAgICovXG5cdCAgICB2YXIgY3J5cHRvU2VjdXJlUmFuZG9tSW50ID0gZnVuY3Rpb24gKCkge1xuXHQgICAgICAgIGlmIChjcnlwdG8pIHtcblx0ICAgICAgICAgICAgLy8gVXNlIGdldFJhbmRvbVZhbHVlcyBtZXRob2QgKEJyb3dzZXIpXG5cdCAgICAgICAgICAgIGlmICh0eXBlb2YgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDMyQXJyYXkoMSkpWzBdO1xuXHQgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7fVxuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gVXNlIHJhbmRvbUJ5dGVzIG1ldGhvZCAoTm9kZUpTKVxuXHQgICAgICAgICAgICBpZiAodHlwZW9mIGNyeXB0by5yYW5kb21CeXRlcyA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3J5cHRvLnJhbmRvbUJ5dGVzKDQpLnJlYWRJbnQzMkxFKCk7XG5cdCAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHt9XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05hdGl2ZSBjcnlwdG8gbW9kdWxlIGNvdWxkIG5vdCBiZSB1c2VkIHRvIGdldCBzZWN1cmUgcmFuZG9tIG51bWJlci4nKTtcblx0ICAgIH07XG5cblx0ICAgIC8qXG5cdCAgICAgKiBMb2NhbCBwb2x5ZmlsbCBvZiBPYmplY3QuY3JlYXRlXG5cblx0ICAgICAqL1xuXHQgICAgdmFyIGNyZWF0ZSA9IE9iamVjdC5jcmVhdGUgfHwgKGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICBmdW5jdGlvbiBGKCkge31cblxuXHQgICAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKSB7XG5cdCAgICAgICAgICAgIHZhciBzdWJ0eXBlO1xuXG5cdCAgICAgICAgICAgIEYucHJvdG90eXBlID0gb2JqO1xuXG5cdCAgICAgICAgICAgIHN1YnR5cGUgPSBuZXcgRigpO1xuXG5cdCAgICAgICAgICAgIEYucHJvdG90eXBlID0gbnVsbDtcblxuXHQgICAgICAgICAgICByZXR1cm4gc3VidHlwZTtcblx0ICAgICAgICB9O1xuXHQgICAgfSgpKTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBDcnlwdG9KUyBuYW1lc3BhY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBDID0ge307XG5cblx0ICAgIC8qKlxuXHQgICAgICogTGlicmFyeSBuYW1lc3BhY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBDX2xpYiA9IEMubGliID0ge307XG5cblx0ICAgIC8qKlxuXHQgICAgICogQmFzZSBvYmplY3QgZm9yIHByb3RvdHlwYWwgaW5oZXJpdGFuY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBCYXNlID0gQ19saWIuQmFzZSA9IChmdW5jdGlvbiAoKSB7XG5cblxuXHQgICAgICAgIHJldHVybiB7XG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBDcmVhdGVzIGEgbmV3IG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhpcyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvdmVycmlkZXMgUHJvcGVydGllcyB0byBjb3B5IGludG8gdGhlIG5ldyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIG5ldyBvYmplY3QuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogICAgIHZhciBNeVR5cGUgPSBDcnlwdG9KUy5saWIuQmFzZS5leHRlbmQoe1xuXHQgICAgICAgICAgICAgKiAgICAgICAgIGZpZWxkOiAndmFsdWUnLFxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgICAgIG1ldGhvZDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgKiAgICAgICAgIH1cblx0ICAgICAgICAgICAgICogICAgIH0pO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgZXh0ZW5kOiBmdW5jdGlvbiAob3ZlcnJpZGVzKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBTcGF3blxuXHQgICAgICAgICAgICAgICAgdmFyIHN1YnR5cGUgPSBjcmVhdGUodGhpcyk7XG5cblx0ICAgICAgICAgICAgICAgIC8vIEF1Z21lbnRcblx0ICAgICAgICAgICAgICAgIGlmIChvdmVycmlkZXMpIHtcblx0ICAgICAgICAgICAgICAgICAgICBzdWJ0eXBlLm1peEluKG92ZXJyaWRlcyk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIENyZWF0ZSBkZWZhdWx0IGluaXRpYWxpemVyXG5cdCAgICAgICAgICAgICAgICBpZiAoIXN1YnR5cGUuaGFzT3duUHJvcGVydHkoJ2luaXQnKSB8fCB0aGlzLmluaXQgPT09IHN1YnR5cGUuaW5pdCkge1xuXHQgICAgICAgICAgICAgICAgICAgIHN1YnR5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgICAgICAgICAgc3VidHlwZS4kc3VwZXIuaW5pdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgICAgICAgICAgICAgICAgIH07XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIEluaXRpYWxpemVyJ3MgcHJvdG90eXBlIGlzIHRoZSBzdWJ0eXBlIG9iamVjdFxuXHQgICAgICAgICAgICAgICAgc3VidHlwZS5pbml0LnByb3RvdHlwZSA9IHN1YnR5cGU7XG5cblx0ICAgICAgICAgICAgICAgIC8vIFJlZmVyZW5jZSBzdXBlcnR5cGVcblx0ICAgICAgICAgICAgICAgIHN1YnR5cGUuJHN1cGVyID0gdGhpcztcblxuXHQgICAgICAgICAgICAgICAgcmV0dXJuIHN1YnR5cGU7XG5cdCAgICAgICAgICAgIH0sXG5cblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIEV4dGVuZHMgdGhpcyBvYmplY3QgYW5kIHJ1bnMgdGhlIGluaXQgbWV0aG9kLlxuXHQgICAgICAgICAgICAgKiBBcmd1bWVudHMgdG8gY3JlYXRlKCkgd2lsbCBiZSBwYXNzZWQgdG8gaW5pdCgpLlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgb2JqZWN0LlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgaW5zdGFuY2UgPSBNeVR5cGUuY3JlYXRlKCk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZXh0ZW5kKCk7XG5cdCAgICAgICAgICAgICAgICBpbnN0YW5jZS5pbml0LmFwcGx5KGluc3RhbmNlLCBhcmd1bWVudHMpO1xuXG5cdCAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XG5cdCAgICAgICAgICAgIH0sXG5cblx0ICAgICAgICAgICAgLyoqXG5cdCAgICAgICAgICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCBvYmplY3QuXG5cdCAgICAgICAgICAgICAqIE92ZXJyaWRlIHRoaXMgbWV0aG9kIHRvIGFkZCBzb21lIGxvZ2ljIHdoZW4geW91ciBvYmplY3RzIGFyZSBjcmVhdGVkLlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgdmFyIE15VHlwZSA9IENyeXB0b0pTLmxpYi5CYXNlLmV4dGVuZCh7XG5cdCAgICAgICAgICAgICAqICAgICAgICAgaW5pdDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAgKiAgICAgICAgICAgICAvLyAuLi5cblx0ICAgICAgICAgICAgICogICAgICAgICB9XG5cdCAgICAgICAgICAgICAqICAgICB9KTtcblx0ICAgICAgICAgICAgICovXG5cdCAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgfSxcblxuXHQgICAgICAgICAgICAvKipcblx0ICAgICAgICAgICAgICogQ29waWVzIHByb3BlcnRpZXMgaW50byB0aGlzIG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHByb3BlcnRpZXMgVGhlIHByb3BlcnRpZXMgdG8gbWl4IGluLlxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAgICAgKlxuXHQgICAgICAgICAgICAgKiAgICAgTXlUeXBlLm1peEluKHtcblx0ICAgICAgICAgICAgICogICAgICAgICBmaWVsZDogJ3ZhbHVlJ1xuXHQgICAgICAgICAgICAgKiAgICAgfSk7XG5cdCAgICAgICAgICAgICAqL1xuXHQgICAgICAgICAgICBtaXhJbjogZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiBwcm9wZXJ0aWVzKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xuXHQgICAgICAgICAgICAgICAgICAgICAgICB0aGlzW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0aWVzW3Byb3BlcnR5TmFtZV07XG5cdCAgICAgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgICAgICAvLyBJRSB3b24ndCBjb3B5IHRvU3RyaW5nIHVzaW5nIHRoZSBsb29wIGFib3ZlXG5cdCAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllcy5oYXNPd25Qcm9wZXJ0eSgndG9TdHJpbmcnKSkge1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXMudG9TdHJpbmcgPSBwcm9wZXJ0aWVzLnRvU3RyaW5nO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9LFxuXG5cdCAgICAgICAgICAgIC8qKlxuXHQgICAgICAgICAgICAgKiBDcmVhdGVzIGEgY29weSBvZiB0aGlzIG9iamVjdC5cblx0ICAgICAgICAgICAgICpcblx0ICAgICAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY2xvbmUuXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICAgICAqXG5cdCAgICAgICAgICAgICAqICAgICB2YXIgY2xvbmUgPSBpbnN0YW5jZS5jbG9uZSgpO1xuXHQgICAgICAgICAgICAgKi9cblx0ICAgICAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmluaXQucHJvdG90eXBlLmV4dGVuZCh0aGlzKTtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH07XG5cdCAgICB9KCkpO1xuXG5cdCAgICAvKipcblx0ICAgICAqIEFuIGFycmF5IG9mIDMyLWJpdCB3b3Jkcy5cblx0ICAgICAqXG5cdCAgICAgKiBAcHJvcGVydHkge0FycmF5fSB3b3JkcyBUaGUgYXJyYXkgb2YgMzItYml0IHdvcmRzLlxuXHQgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNpZ0J5dGVzIFRoZSBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgYnl0ZXMgaW4gdGhpcyB3b3JkIGFycmF5LlxuXHQgICAgICovXG5cdCAgICB2YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5ID0gQmFzZS5leHRlbmQoe1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtBcnJheX0gd29yZHMgKE9wdGlvbmFsKSBBbiBhcnJheSBvZiAzMi1iaXQgd29yZHMuXG5cdCAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHNpZ0J5dGVzIChPcHRpb25hbCkgVGhlIG51bWJlciBvZiBzaWduaWZpY2FudCBieXRlcyBpbiB0aGUgd29yZHMuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5saWIuV29yZEFycmF5LmNyZWF0ZSgpO1xuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5jcmVhdGUoWzB4MDAwMTAyMDMsIDB4MDQwNTA2MDddKTtcblx0ICAgICAgICAgKiAgICAgdmFyIHdvcmRBcnJheSA9IENyeXB0b0pTLmxpYi5Xb3JkQXJyYXkuY3JlYXRlKFsweDAwMDEwMjAzLCAweDA0MDUwNjA3XSwgNik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgaW5pdDogZnVuY3Rpb24gKHdvcmRzLCBzaWdCeXRlcykge1xuXHQgICAgICAgICAgICB3b3JkcyA9IHRoaXMud29yZHMgPSB3b3JkcyB8fCBbXTtcblxuXHQgICAgICAgICAgICBpZiAoc2lnQnl0ZXMgIT0gdW5kZWZpbmVkKSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnNpZ0J5dGVzID0gc2lnQnl0ZXM7XG5cdCAgICAgICAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgICAgICAgICB0aGlzLnNpZ0J5dGVzID0gd29yZHMubGVuZ3RoICogNDtcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyB0aGlzIHdvcmQgYXJyYXkgdG8gYSBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0VuY29kZXJ9IGVuY29kZXIgKE9wdGlvbmFsKSBUaGUgZW5jb2Rpbmcgc3RyYXRlZ3kgdG8gdXNlLiBEZWZhdWx0OiBDcnlwdG9KUy5lbmMuSGV4XG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBzdHJpbmdpZmllZCB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgc3RyaW5nID0gd29yZEFycmF5ICsgJyc7XG5cdCAgICAgICAgICogICAgIHZhciBzdHJpbmcgPSB3b3JkQXJyYXkudG9TdHJpbmcoKTtcblx0ICAgICAgICAgKiAgICAgdmFyIHN0cmluZyA9IHdvcmRBcnJheS50b1N0cmluZyhDcnlwdG9KUy5lbmMuVXRmOCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uIChlbmNvZGVyKSB7XG5cdCAgICAgICAgICAgIHJldHVybiAoZW5jb2RlciB8fCBIZXgpLnN0cmluZ2lmeSh0aGlzKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29uY2F0ZW5hdGVzIGEgd29yZCBhcnJheSB0byB0aGlzIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5IHRvIGFwcGVuZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhpcyB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB3b3JkQXJyYXkxLmNvbmNhdCh3b3JkQXJyYXkyKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBjb25jYXQ6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciB0aGlzV29yZHMgPSB0aGlzLndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgdGhhdFdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgdGhpc1NpZ0J5dGVzID0gdGhpcy5zaWdCeXRlcztcblx0ICAgICAgICAgICAgdmFyIHRoYXRTaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDbGFtcCBleGNlc3MgYml0c1xuXHQgICAgICAgICAgICB0aGlzLmNsYW1wKCk7XG5cblx0ICAgICAgICAgICAgLy8gQ29uY2F0XG5cdCAgICAgICAgICAgIGlmICh0aGlzU2lnQnl0ZXMgJSA0KSB7XG5cdCAgICAgICAgICAgICAgICAvLyBDb3B5IG9uZSBieXRlIGF0IGEgdGltZVxuXHQgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGF0U2lnQnl0ZXM7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgICAgIHZhciB0aGF0Qnl0ZSA9ICh0aGF0V29yZHNbaSA+Pj4gMl0gPj4+ICgyNCAtIChpICUgNCkgKiA4KSkgJiAweGZmO1xuXHQgICAgICAgICAgICAgICAgICAgIHRoaXNXb3Jkc1sodGhpc1NpZ0J5dGVzICsgaSkgPj4+IDJdIHw9IHRoYXRCeXRlIDw8ICgyNCAtICgodGhpc1NpZ0J5dGVzICsgaSkgJSA0KSAqIDgpO1xuXHQgICAgICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgICAgICAgLy8gQ29weSBvbmUgd29yZCBhdCBhIHRpbWVcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgdGhhdFNpZ0J5dGVzOyBqICs9IDQpIHtcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzV29yZHNbKHRoaXNTaWdCeXRlcyArIGopID4+PiAyXSA9IHRoYXRXb3Jkc1tqID4+PiAyXTtcblx0ICAgICAgICAgICAgICAgIH1cblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgICB0aGlzLnNpZ0J5dGVzICs9IHRoYXRTaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDaGFpbmFibGVcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFJlbW92ZXMgaW5zaWduaWZpY2FudCBiaXRzLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB3b3JkQXJyYXkuY2xhbXAoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBjbGFtcDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHdvcmRzID0gdGhpcy53b3Jkcztcblx0ICAgICAgICAgICAgdmFyIHNpZ0J5dGVzID0gdGhpcy5zaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDbGFtcFxuXHQgICAgICAgICAgICB3b3Jkc1tzaWdCeXRlcyA+Pj4gMl0gJj0gMHhmZmZmZmZmZiA8PCAoMzIgLSAoc2lnQnl0ZXMgJSA0KSAqIDgpO1xuXHQgICAgICAgICAgICB3b3Jkcy5sZW5ndGggPSBNYXRoLmNlaWwoc2lnQnl0ZXMgLyA0KTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIGNvcHkgb2YgdGhpcyB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgY2xvbmUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBjbG9uZSA9IHdvcmRBcnJheS5jbG9uZSgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgIHZhciBjbG9uZSA9IEJhc2UuY2xvbmUuY2FsbCh0aGlzKTtcblx0ICAgICAgICAgICAgY2xvbmUud29yZHMgPSB0aGlzLndvcmRzLnNsaWNlKDApO1xuXG5cdCAgICAgICAgICAgIHJldHVybiBjbG9uZTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIHdvcmQgYXJyYXkgZmlsbGVkIHdpdGggcmFuZG9tIGJ5dGVzLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IG5CeXRlcyBUaGUgbnVtYmVyIG9mIHJhbmRvbSBieXRlcyB0byBnZW5lcmF0ZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHJhbmRvbSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMubGliLldvcmRBcnJheS5yYW5kb20oMTYpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHJhbmRvbTogZnVuY3Rpb24gKG5CeXRlcykge1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSBbXTtcblxuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5CeXRlczsgaSArPSA0KSB7XG5cdCAgICAgICAgICAgICAgICB3b3Jkcy5wdXNoKGNyeXB0b1NlY3VyZVJhbmRvbUludCgpKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBuZXcgV29yZEFycmF5LmluaXQod29yZHMsIG5CeXRlcyk7XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogRW5jb2RlciBuYW1lc3BhY2UuXG5cdCAgICAgKi9cblx0ICAgIHZhciBDX2VuYyA9IEMuZW5jID0ge307XG5cblx0ICAgIC8qKlxuXHQgICAgICogSGV4IGVuY29kaW5nIHN0cmF0ZWd5LlxuXHQgICAgICovXG5cdCAgICB2YXIgSGV4ID0gQ19lbmMuSGV4ID0ge1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENvbnZlcnRzIGEgd29yZCBhcnJheSB0byBhIGhleCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheX0gd29yZEFycmF5IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgaGV4IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGhleFN0cmluZyA9IENyeXB0b0pTLmVuYy5IZXguc3RyaW5naWZ5KHdvcmRBcnJheSk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgc3RyaW5naWZ5OiBmdW5jdGlvbiAod29yZEFycmF5KSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSB3b3JkQXJyYXkud29yZHM7XG5cdCAgICAgICAgICAgIHZhciBzaWdCeXRlcyA9IHdvcmRBcnJheS5zaWdCeXRlcztcblxuXHQgICAgICAgICAgICAvLyBDb252ZXJ0XG5cdCAgICAgICAgICAgIHZhciBoZXhDaGFycyA9IFtdO1xuXHQgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpZ0J5dGVzOyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIHZhciBiaXRlID0gKHdvcmRzW2kgPj4+IDJdID4+PiAoMjQgLSAoaSAlIDQpICogOCkpICYgMHhmZjtcblx0ICAgICAgICAgICAgICAgIGhleENoYXJzLnB1c2goKGJpdGUgPj4+IDQpLnRvU3RyaW5nKDE2KSk7XG5cdCAgICAgICAgICAgICAgICBoZXhDaGFycy5wdXNoKChiaXRlICYgMHgwZikudG9TdHJpbmcoMTYpKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIHJldHVybiBoZXhDaGFycy5qb2luKCcnKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSBoZXggc3RyaW5nIHRvIGEgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoZXhTdHIgVGhlIGhleCBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHN0YXRpY1xuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICB2YXIgd29yZEFycmF5ID0gQ3J5cHRvSlMuZW5jLkhleC5wYXJzZShoZXhTdHJpbmcpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHBhcnNlOiBmdW5jdGlvbiAoaGV4U3RyKSB7XG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0XG5cdCAgICAgICAgICAgIHZhciBoZXhTdHJMZW5ndGggPSBoZXhTdHIubGVuZ3RoO1xuXG5cdCAgICAgICAgICAgIC8vIENvbnZlcnRcblx0ICAgICAgICAgICAgdmFyIHdvcmRzID0gW107XG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaGV4U3RyTGVuZ3RoOyBpICs9IDIpIHtcblx0ICAgICAgICAgICAgICAgIHdvcmRzW2kgPj4+IDNdIHw9IHBhcnNlSW50KGhleFN0ci5zdWJzdHIoaSwgMiksIDE2KSA8PCAoMjQgLSAoaSAlIDgpICogNCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHdvcmRzLCBoZXhTdHJMZW5ndGggLyAyKTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICAvKipcblx0ICAgICAqIExhdGluMSBlbmNvZGluZyBzdHJhdGVneS5cblx0ICAgICAqL1xuXHQgICAgdmFyIExhdGluMSA9IENfZW5jLkxhdGluMSA9IHtcblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIHdvcmQgYXJyYXkgdG8gYSBMYXRpbjEgc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIExhdGluMSBzdHJpbmcuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBsYXRpbjFTdHJpbmcgPSBDcnlwdG9KUy5lbmMuTGF0aW4xLnN0cmluZ2lmeSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHN0cmluZ2lmeTogZnVuY3Rpb24gKHdvcmRBcnJheSkge1xuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIHdvcmRzID0gd29yZEFycmF5LndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgc2lnQnl0ZXMgPSB3b3JkQXJyYXkuc2lnQnl0ZXM7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydFxuXHQgICAgICAgICAgICB2YXIgbGF0aW4xQ2hhcnMgPSBbXTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWdCeXRlczsgaSsrKSB7XG5cdCAgICAgICAgICAgICAgICB2YXIgYml0ZSA9ICh3b3Jkc1tpID4+PiAyXSA+Pj4gKDI0IC0gKGkgJSA0KSAqIDgpKSAmIDB4ZmY7XG5cdCAgICAgICAgICAgICAgICBsYXRpbjFDaGFycy5wdXNoKFN0cmluZy5mcm9tQ2hhckNvZGUoYml0ZSkpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIGxhdGluMUNoYXJzLmpvaW4oJycpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBDb252ZXJ0cyBhIExhdGluMSBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGxhdGluMVN0ciBUaGUgTGF0aW4xIHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuTGF0aW4xLnBhcnNlKGxhdGluMVN0cmluZyk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcGFyc2U6IGZ1bmN0aW9uIChsYXRpbjFTdHIpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRcblx0ICAgICAgICAgICAgdmFyIGxhdGluMVN0ckxlbmd0aCA9IGxhdGluMVN0ci5sZW5ndGg7XG5cblx0ICAgICAgICAgICAgLy8gQ29udmVydFxuXHQgICAgICAgICAgICB2YXIgd29yZHMgPSBbXTtcblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRpbjFTdHJMZW5ndGg7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgd29yZHNbaSA+Pj4gMl0gfD0gKGxhdGluMVN0ci5jaGFyQ29kZUF0KGkpICYgMHhmZikgPDwgKDI0IC0gKGkgJSA0KSAqIDgpO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgcmV0dXJuIG5ldyBXb3JkQXJyYXkuaW5pdCh3b3JkcywgbGF0aW4xU3RyTGVuZ3RoKTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICAvKipcblx0ICAgICAqIFVURi04IGVuY29kaW5nIHN0cmF0ZWd5LlxuXHQgICAgICovXG5cdCAgICB2YXIgVXRmOCA9IENfZW5jLlV0ZjggPSB7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSB3b3JkIGFycmF5IHRvIGEgVVRGLTggc3RyaW5nLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl9IHdvcmRBcnJheSBUaGUgd29yZCBhcnJheS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIFVURi04IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBzdGF0aWNcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIHV0ZjhTdHJpbmcgPSBDcnlwdG9KUy5lbmMuVXRmOC5zdHJpbmdpZnkod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBzdHJpbmdpZnk6IGZ1bmN0aW9uICh3b3JkQXJyYXkpIHtcblx0ICAgICAgICAgICAgdHJ5IHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZXNjYXBlKExhdGluMS5zdHJpbmdpZnkod29yZEFycmF5KSkpO1xuXHQgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG5cdCAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01hbGZvcm1lZCBVVEYtOCBkYXRhJyk7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29udmVydHMgYSBVVEYtOCBzdHJpbmcgdG8gYSB3b3JkIGFycmF5LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHV0ZjhTdHIgVGhlIFVURi04IHN0cmluZy5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge1dvcmRBcnJheX0gVGhlIHdvcmQgYXJyYXkuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciB3b3JkQXJyYXkgPSBDcnlwdG9KUy5lbmMuVXRmOC5wYXJzZSh1dGY4U3RyaW5nKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBwYXJzZTogZnVuY3Rpb24gKHV0ZjhTdHIpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIExhdGluMS5wYXJzZSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQodXRmOFN0cikpKTtcblx0ICAgICAgICB9XG5cdCAgICB9O1xuXG5cdCAgICAvKipcblx0ICAgICAqIEFic3RyYWN0IGJ1ZmZlcmVkIGJsb2NrIGFsZ29yaXRobSB0ZW1wbGF0ZS5cblx0ICAgICAqXG5cdCAgICAgKiBUaGUgcHJvcGVydHkgYmxvY2tTaXplIG11c3QgYmUgaW1wbGVtZW50ZWQgaW4gYSBjb25jcmV0ZSBzdWJ0eXBlLlxuXHQgICAgICpcblx0ICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBfbWluQnVmZmVyU2l6ZSBUaGUgbnVtYmVyIG9mIGJsb2NrcyB0aGF0IHNob3VsZCBiZSBrZXB0IHVucHJvY2Vzc2VkIGluIHRoZSBidWZmZXIuIERlZmF1bHQ6IDBcblx0ICAgICAqL1xuXHQgICAgdmFyIEJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0gPSBDX2xpYi5CdWZmZXJlZEJsb2NrQWxnb3JpdGhtID0gQmFzZS5leHRlbmQoe1xuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIFJlc2V0cyB0aGlzIGJsb2NrIGFsZ29yaXRobSdzIGRhdGEgYnVmZmVyIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICBidWZmZXJlZEJsb2NrQWxnb3JpdGhtLnJlc2V0KCk7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgLy8gSW5pdGlhbCB2YWx1ZXNcblx0ICAgICAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBXb3JkQXJyYXkuaW5pdCgpO1xuXHQgICAgICAgICAgICB0aGlzLl9uRGF0YUJ5dGVzID0gMDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQWRkcyBuZXcgZGF0YSB0byB0aGlzIGJsb2NrIGFsZ29yaXRobSdzIGJ1ZmZlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7V29yZEFycmF5fHN0cmluZ30gZGF0YSBUaGUgZGF0YSB0byBhcHBlbmQuIFN0cmluZ3MgYXJlIGNvbnZlcnRlZCB0byBhIFdvcmRBcnJheSB1c2luZyBVVEYtOC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fYXBwZW5kKCdkYXRhJyk7XG5cdCAgICAgICAgICogICAgIGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX2FwcGVuZCh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIF9hcHBlbmQ6IGZ1bmN0aW9uIChkYXRhKSB7XG5cdCAgICAgICAgICAgIC8vIENvbnZlcnQgc3RyaW5nIHRvIFdvcmRBcnJheSwgZWxzZSBhc3N1bWUgV29yZEFycmF5IGFscmVhZHlcblx0ICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09ICdzdHJpbmcnKSB7XG5cdCAgICAgICAgICAgICAgICBkYXRhID0gVXRmOC5wYXJzZShkYXRhKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIEFwcGVuZFxuXHQgICAgICAgICAgICB0aGlzLl9kYXRhLmNvbmNhdChkYXRhKTtcblx0ICAgICAgICAgICAgdGhpcy5fbkRhdGFCeXRlcyArPSBkYXRhLnNpZ0J5dGVzO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBQcm9jZXNzZXMgYXZhaWxhYmxlIGRhdGEgYmxvY2tzLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogVGhpcyBtZXRob2QgaW52b2tlcyBfZG9Qcm9jZXNzQmxvY2sob2Zmc2V0KSwgd2hpY2ggbXVzdCBiZSBpbXBsZW1lbnRlZCBieSBhIGNvbmNyZXRlIHN1YnR5cGUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGRvRmx1c2ggV2hldGhlciBhbGwgYmxvY2tzIGFuZCBwYXJ0aWFsIGJsb2NrcyBzaG91bGQgYmUgcHJvY2Vzc2VkLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgcHJvY2Vzc2VkIGRhdGEuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBwcm9jZXNzZWREYXRhID0gYnVmZmVyZWRCbG9ja0FsZ29yaXRobS5fcHJvY2VzcygpO1xuXHQgICAgICAgICAqICAgICB2YXIgcHJvY2Vzc2VkRGF0YSA9IGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uX3Byb2Nlc3MoISEnZmx1c2gnKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBfcHJvY2VzczogZnVuY3Rpb24gKGRvRmx1c2gpIHtcblx0ICAgICAgICAgICAgdmFyIHByb2Nlc3NlZFdvcmRzO1xuXG5cdCAgICAgICAgICAgIC8vIFNob3J0Y3V0c1xuXHQgICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuX2RhdGE7XG5cdCAgICAgICAgICAgIHZhciBkYXRhV29yZHMgPSBkYXRhLndvcmRzO1xuXHQgICAgICAgICAgICB2YXIgZGF0YVNpZ0J5dGVzID0gZGF0YS5zaWdCeXRlcztcblx0ICAgICAgICAgICAgdmFyIGJsb2NrU2l6ZSA9IHRoaXMuYmxvY2tTaXplO1xuXHQgICAgICAgICAgICB2YXIgYmxvY2tTaXplQnl0ZXMgPSBibG9ja1NpemUgKiA0O1xuXG5cdCAgICAgICAgICAgIC8vIENvdW50IGJsb2NrcyByZWFkeVxuXHQgICAgICAgICAgICB2YXIgbkJsb2Nrc1JlYWR5ID0gZGF0YVNpZ0J5dGVzIC8gYmxvY2tTaXplQnl0ZXM7XG5cdCAgICAgICAgICAgIGlmIChkb0ZsdXNoKSB7XG5cdCAgICAgICAgICAgICAgICAvLyBSb3VuZCB1cCB0byBpbmNsdWRlIHBhcnRpYWwgYmxvY2tzXG5cdCAgICAgICAgICAgICAgICBuQmxvY2tzUmVhZHkgPSBNYXRoLmNlaWwobkJsb2Nrc1JlYWR5KTtcblx0ICAgICAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgICAgICAgIC8vIFJvdW5kIGRvd24gdG8gaW5jbHVkZSBvbmx5IGZ1bGwgYmxvY2tzLFxuXHQgICAgICAgICAgICAgICAgLy8gbGVzcyB0aGUgbnVtYmVyIG9mIGJsb2NrcyB0aGF0IG11c3QgcmVtYWluIGluIHRoZSBidWZmZXJcblx0ICAgICAgICAgICAgICAgIG5CbG9ja3NSZWFkeSA9IE1hdGgubWF4KChuQmxvY2tzUmVhZHkgfCAwKSAtIHRoaXMuX21pbkJ1ZmZlclNpemUsIDApO1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gQ291bnQgd29yZHMgcmVhZHlcblx0ICAgICAgICAgICAgdmFyIG5Xb3Jkc1JlYWR5ID0gbkJsb2Nrc1JlYWR5ICogYmxvY2tTaXplO1xuXG5cdCAgICAgICAgICAgIC8vIENvdW50IGJ5dGVzIHJlYWR5XG5cdCAgICAgICAgICAgIHZhciBuQnl0ZXNSZWFkeSA9IE1hdGgubWluKG5Xb3Jkc1JlYWR5ICogNCwgZGF0YVNpZ0J5dGVzKTtcblxuXHQgICAgICAgICAgICAvLyBQcm9jZXNzIGJsb2Nrc1xuXHQgICAgICAgICAgICBpZiAobldvcmRzUmVhZHkpIHtcblx0ICAgICAgICAgICAgICAgIGZvciAodmFyIG9mZnNldCA9IDA7IG9mZnNldCA8IG5Xb3Jkc1JlYWR5OyBvZmZzZXQgKz0gYmxvY2tTaXplKSB7XG5cdCAgICAgICAgICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1hbGdvcml0aG0gbG9naWNcblx0ICAgICAgICAgICAgICAgICAgICB0aGlzLl9kb1Byb2Nlc3NCbG9jayhkYXRhV29yZHMsIG9mZnNldCk7XG5cdCAgICAgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBwcm9jZXNzZWQgd29yZHNcblx0ICAgICAgICAgICAgICAgIHByb2Nlc3NlZFdvcmRzID0gZGF0YVdvcmRzLnNwbGljZSgwLCBuV29yZHNSZWFkeSk7XG5cdCAgICAgICAgICAgICAgICBkYXRhLnNpZ0J5dGVzIC09IG5CeXRlc1JlYWR5O1xuXHQgICAgICAgICAgICB9XG5cblx0ICAgICAgICAgICAgLy8gUmV0dXJuIHByb2Nlc3NlZCB3b3Jkc1xuXHQgICAgICAgICAgICByZXR1cm4gbmV3IFdvcmRBcnJheS5pbml0KHByb2Nlc3NlZFdvcmRzLCBuQnl0ZXNSZWFkeSk7XG5cdCAgICAgICAgfSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYSBjb3B5IG9mIHRoaXMgb2JqZWN0LlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgY2xvbmUuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBjbG9uZSA9IGJ1ZmZlcmVkQmxvY2tBbGdvcml0aG0uY2xvbmUoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBjbG9uZTogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICB2YXIgY2xvbmUgPSBCYXNlLmNsb25lLmNhbGwodGhpcyk7XG5cdCAgICAgICAgICAgIGNsb25lLl9kYXRhID0gdGhpcy5fZGF0YS5jbG9uZSgpO1xuXG5cdCAgICAgICAgICAgIHJldHVybiBjbG9uZTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX21pbkJ1ZmZlclNpemU6IDBcblx0ICAgIH0pO1xuXG5cdCAgICAvKipcblx0ICAgICAqIEFic3RyYWN0IGhhc2hlciB0ZW1wbGF0ZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcHJvcGVydHkge251bWJlcn0gYmxvY2tTaXplIFRoZSBudW1iZXIgb2YgMzItYml0IHdvcmRzIHRoaXMgaGFzaGVyIG9wZXJhdGVzIG9uLiBEZWZhdWx0OiAxNiAoNTEyIGJpdHMpXG5cdCAgICAgKi9cblx0ICAgIHZhciBIYXNoZXIgPSBDX2xpYi5IYXNoZXIgPSBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtLmV4dGVuZCh7XG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ29uZmlndXJhdGlvbiBvcHRpb25zLlxuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGNmZzogQmFzZS5leHRlbmQoKSxcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIEluaXRpYWxpemVzIGEgbmV3bHkgY3JlYXRlZCBoYXNoZXIuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gY2ZnIChPcHRpb25hbCkgVGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucyB0byB1c2UgZm9yIHRoaXMgaGFzaCBjb21wdXRhdGlvbi5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGhhc2hlciA9IENyeXB0b0pTLmFsZ28uU0hBMjU2LmNyZWF0ZSgpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChjZmcpIHtcblx0ICAgICAgICAgICAgLy8gQXBwbHkgY29uZmlnIGRlZmF1bHRzXG5cdCAgICAgICAgICAgIHRoaXMuY2ZnID0gdGhpcy5jZmcuZXh0ZW5kKGNmZyk7XG5cblx0ICAgICAgICAgICAgLy8gU2V0IGluaXRpYWwgdmFsdWVzXG5cdCAgICAgICAgICAgIHRoaXMucmVzZXQoKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogUmVzZXRzIHRoaXMgaGFzaGVyIHRvIGl0cyBpbml0aWFsIHN0YXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQGV4YW1wbGVcblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqICAgICBoYXNoZXIucmVzZXQoKTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICByZXNldDogZnVuY3Rpb24gKCkge1xuXHQgICAgICAgICAgICAvLyBSZXNldCBkYXRhIGJ1ZmZlclxuXHQgICAgICAgICAgICBCdWZmZXJlZEJsb2NrQWxnb3JpdGhtLnJlc2V0LmNhbGwodGhpcyk7XG5cblx0ICAgICAgICAgICAgLy8gUGVyZm9ybSBjb25jcmV0ZS1oYXNoZXIgbG9naWNcblx0ICAgICAgICAgICAgdGhpcy5fZG9SZXNldCgpO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICAvKipcblx0ICAgICAgICAgKiBVcGRhdGVzIHRoaXMgaGFzaGVyIHdpdGggYSBtZXNzYWdlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlVXBkYXRlIFRoZSBtZXNzYWdlIHRvIGFwcGVuZC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge0hhc2hlcn0gVGhpcyBoYXNoZXIuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIGhhc2hlci51cGRhdGUoJ21lc3NhZ2UnKTtcblx0ICAgICAgICAgKiAgICAgaGFzaGVyLnVwZGF0ZSh3b3JkQXJyYXkpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIHVwZGF0ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcblx0ICAgICAgICAgICAgLy8gQXBwZW5kXG5cdCAgICAgICAgICAgIHRoaXMuX2FwcGVuZChtZXNzYWdlVXBkYXRlKTtcblxuXHQgICAgICAgICAgICAvLyBVcGRhdGUgdGhlIGhhc2hcblx0ICAgICAgICAgICAgdGhpcy5fcHJvY2VzcygpO1xuXG5cdCAgICAgICAgICAgIC8vIENoYWluYWJsZVxuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogRmluYWxpemVzIHRoZSBoYXNoIGNvbXB1dGF0aW9uLlxuXHQgICAgICAgICAqIE5vdGUgdGhhdCB0aGUgZmluYWxpemUgb3BlcmF0aW9uIGlzIGVmZmVjdGl2ZWx5IGEgZGVzdHJ1Y3RpdmUsIHJlYWQtb25jZSBvcGVyYXRpb24uXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2VVcGRhdGUgKE9wdGlvbmFsKSBBIGZpbmFsIG1lc3NhZ2UgdXBkYXRlLlxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogQHJldHVybiB7V29yZEFycmF5fSBUaGUgaGFzaC5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBleGFtcGxlXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiAgICAgdmFyIGhhc2ggPSBoYXNoZXIuZmluYWxpemUoKTtcblx0ICAgICAgICAgKiAgICAgdmFyIGhhc2ggPSBoYXNoZXIuZmluYWxpemUoJ21lc3NhZ2UnKTtcblx0ICAgICAgICAgKiAgICAgdmFyIGhhc2ggPSBoYXNoZXIuZmluYWxpemUod29yZEFycmF5KTtcblx0ICAgICAgICAgKi9cblx0ICAgICAgICBmaW5hbGl6ZTogZnVuY3Rpb24gKG1lc3NhZ2VVcGRhdGUpIHtcblx0ICAgICAgICAgICAgLy8gRmluYWwgbWVzc2FnZSB1cGRhdGVcblx0ICAgICAgICAgICAgaWYgKG1lc3NhZ2VVcGRhdGUpIHtcblx0ICAgICAgICAgICAgICAgIHRoaXMuX2FwcGVuZChtZXNzYWdlVXBkYXRlKTtcblx0ICAgICAgICAgICAgfVxuXG5cdCAgICAgICAgICAgIC8vIFBlcmZvcm0gY29uY3JldGUtaGFzaGVyIGxvZ2ljXG5cdCAgICAgICAgICAgIHZhciBoYXNoID0gdGhpcy5fZG9GaW5hbGl6ZSgpO1xuXG5cdCAgICAgICAgICAgIHJldHVybiBoYXNoO1xuXHQgICAgICAgIH0sXG5cblx0ICAgICAgICBibG9ja1NpemU6IDUxMi8zMixcblxuXHQgICAgICAgIC8qKlxuXHQgICAgICAgICAqIENyZWF0ZXMgYSBzaG9ydGN1dCBmdW5jdGlvbiB0byBhIGhhc2hlcidzIG9iamVjdCBpbnRlcmZhY2UuXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAcGFyYW0ge0hhc2hlcn0gaGFzaGVyIFRoZSBoYXNoZXIgdG8gY3JlYXRlIGEgaGVscGVyIGZvci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgc2hvcnRjdXQgZnVuY3Rpb24uXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBTSEEyNTYgPSBDcnlwdG9KUy5saWIuSGFzaGVyLl9jcmVhdGVIZWxwZXIoQ3J5cHRvSlMuYWxnby5TSEEyNTYpO1xuXHQgICAgICAgICAqL1xuXHQgICAgICAgIF9jcmVhdGVIZWxwZXI6IGZ1bmN0aW9uIChoYXNoZXIpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlLCBjZmcpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBuZXcgaGFzaGVyLmluaXQoY2ZnKS5maW5hbGl6ZShtZXNzYWdlKTtcblx0ICAgICAgICAgICAgfTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgLyoqXG5cdCAgICAgICAgICogQ3JlYXRlcyBhIHNob3J0Y3V0IGZ1bmN0aW9uIHRvIHRoZSBITUFDJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEBwYXJhbSB7SGFzaGVyfSBoYXNoZXIgVGhlIGhhc2hlciB0byB1c2UgaW4gdGhpcyBITUFDIGhlbHBlci5cblx0ICAgICAgICAgKlxuXHQgICAgICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgc2hvcnRjdXQgZnVuY3Rpb24uXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAc3RhdGljXG5cdCAgICAgICAgICpcblx0ICAgICAgICAgKiBAZXhhbXBsZVxuXHQgICAgICAgICAqXG5cdCAgICAgICAgICogICAgIHZhciBIbWFjU0hBMjU2ID0gQ3J5cHRvSlMubGliLkhhc2hlci5fY3JlYXRlSG1hY0hlbHBlcihDcnlwdG9KUy5hbGdvLlNIQTI1Nik7XG5cdCAgICAgICAgICovXG5cdCAgICAgICAgX2NyZWF0ZUhtYWNIZWxwZXI6IGZ1bmN0aW9uIChoYXNoZXIpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChtZXNzYWdlLCBrZXkpIHtcblx0ICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ19hbGdvLkhNQUMuaW5pdChoYXNoZXIsIGtleSkuZmluYWxpemUobWVzc2FnZSk7XG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgfVxuXHQgICAgfSk7XG5cblx0ICAgIC8qKlxuXHQgICAgICogQWxnb3JpdGhtIG5hbWVzcGFjZS5cblx0ICAgICAqL1xuXHQgICAgdmFyIENfYWxnbyA9IEMuYWxnbyA9IHt9O1xuXG5cdCAgICByZXR1cm4gQztcblx0fShNYXRoKSk7XG5cblxuXHRyZXR1cm4gQ3J5cHRvSlM7XG5cbn0pKTsiLCI7KGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gXCJvYmplY3RcIikge1xuXHRcdC8vIENvbW1vbkpTXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwiLi9jb3JlXCIpKTtcblx0fVxuXHRlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSBcImZ1bmN0aW9uXCIgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIEFNRFxuXHRcdGRlZmluZShbXCIuL2NvcmVcIl0sIGZhY3RvcnkpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIEdsb2JhbCAoYnJvd3Nlcilcblx0XHRmYWN0b3J5KHJvb3QuQ3J5cHRvSlMpO1xuXHR9XG59KHRoaXMsIGZ1bmN0aW9uIChDcnlwdG9KUykge1xuXG5cdChmdW5jdGlvbiAoTWF0aCkge1xuXHQgICAgLy8gU2hvcnRjdXRzXG5cdCAgICB2YXIgQyA9IENyeXB0b0pTO1xuXHQgICAgdmFyIENfbGliID0gQy5saWI7XG5cdCAgICB2YXIgV29yZEFycmF5ID0gQ19saWIuV29yZEFycmF5O1xuXHQgICAgdmFyIEhhc2hlciA9IENfbGliLkhhc2hlcjtcblx0ICAgIHZhciBDX2FsZ28gPSBDLmFsZ287XG5cblx0ICAgIC8vIENvbnN0YW50cyB0YWJsZVxuXHQgICAgdmFyIFQgPSBbXTtcblxuXHQgICAgLy8gQ29tcHV0ZSBjb25zdGFudHNcblx0ICAgIChmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2NDsgaSsrKSB7XG5cdCAgICAgICAgICAgIFRbaV0gPSAoTWF0aC5hYnMoTWF0aC5zaW4oaSArIDEpKSAqIDB4MTAwMDAwMDAwKSB8IDA7XG5cdCAgICAgICAgfVxuXHQgICAgfSgpKTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBNRDUgaGFzaCBhbGdvcml0aG0uXG5cdCAgICAgKi9cblx0ICAgIHZhciBNRDUgPSBDX2FsZ28uTUQ1ID0gSGFzaGVyLmV4dGVuZCh7XG5cdCAgICAgICAgX2RvUmVzZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdGhpcy5faGFzaCA9IG5ldyBXb3JkQXJyYXkuaW5pdChbXG5cdCAgICAgICAgICAgICAgICAweDY3NDUyMzAxLCAweGVmY2RhYjg5LFxuXHQgICAgICAgICAgICAgICAgMHg5OGJhZGNmZSwgMHgxMDMyNTQ3NlxuXHQgICAgICAgICAgICBdKTtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX2RvUHJvY2Vzc0Jsb2NrOiBmdW5jdGlvbiAoTSwgb2Zmc2V0KSB7XG5cdCAgICAgICAgICAgIC8vIFN3YXAgZW5kaWFuXG5cdCAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTY7IGkrKykge1xuXHQgICAgICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgICAgICB2YXIgb2Zmc2V0X2kgPSBvZmZzZXQgKyBpO1xuXHQgICAgICAgICAgICAgICAgdmFyIE1fb2Zmc2V0X2kgPSBNW29mZnNldF9pXTtcblxuXHQgICAgICAgICAgICAgICAgTVtvZmZzZXRfaV0gPSAoXG5cdCAgICAgICAgICAgICAgICAgICAgKCgoTV9vZmZzZXRfaSA8PCA4KSAgfCAoTV9vZmZzZXRfaSA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcblx0ICAgICAgICAgICAgICAgICAgICAoKChNX29mZnNldF9pIDw8IDI0KSB8IChNX29mZnNldF9pID4+PiA4KSkgICYgMHhmZjAwZmYwMClcblx0ICAgICAgICAgICAgICAgICk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIEggPSB0aGlzLl9oYXNoLndvcmRzO1xuXG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF8wICA9IE1bb2Zmc2V0ICsgMF07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF8xICA9IE1bb2Zmc2V0ICsgMV07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF8yICA9IE1bb2Zmc2V0ICsgMl07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF8zICA9IE1bb2Zmc2V0ICsgM107XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF80ICA9IE1bb2Zmc2V0ICsgNF07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF81ICA9IE1bb2Zmc2V0ICsgNV07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF82ICA9IE1bb2Zmc2V0ICsgNl07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF83ICA9IE1bb2Zmc2V0ICsgN107XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF84ICA9IE1bb2Zmc2V0ICsgOF07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF85ICA9IE1bb2Zmc2V0ICsgOV07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF8xMCA9IE1bb2Zmc2V0ICsgMTBdO1xuXHQgICAgICAgICAgICB2YXIgTV9vZmZzZXRfMTEgPSBNW29mZnNldCArIDExXTtcblx0ICAgICAgICAgICAgdmFyIE1fb2Zmc2V0XzEyID0gTVtvZmZzZXQgKyAxMl07XG5cdCAgICAgICAgICAgIHZhciBNX29mZnNldF8xMyA9IE1bb2Zmc2V0ICsgMTNdO1xuXHQgICAgICAgICAgICB2YXIgTV9vZmZzZXRfMTQgPSBNW29mZnNldCArIDE0XTtcblx0ICAgICAgICAgICAgdmFyIE1fb2Zmc2V0XzE1ID0gTVtvZmZzZXQgKyAxNV07XG5cblx0ICAgICAgICAgICAgLy8gV29ya2luZyB2YXJpYWxiZXNcblx0ICAgICAgICAgICAgdmFyIGEgPSBIWzBdO1xuXHQgICAgICAgICAgICB2YXIgYiA9IEhbMV07XG5cdCAgICAgICAgICAgIHZhciBjID0gSFsyXTtcblx0ICAgICAgICAgICAgdmFyIGQgPSBIWzNdO1xuXG5cdCAgICAgICAgICAgIC8vIENvbXB1dGF0aW9uXG5cdCAgICAgICAgICAgIGEgPSBGRihhLCBiLCBjLCBkLCBNX29mZnNldF8wLCAgNywgIFRbMF0pO1xuXHQgICAgICAgICAgICBkID0gRkYoZCwgYSwgYiwgYywgTV9vZmZzZXRfMSwgIDEyLCBUWzFdKTtcblx0ICAgICAgICAgICAgYyA9IEZGKGMsIGQsIGEsIGIsIE1fb2Zmc2V0XzIsICAxNywgVFsyXSk7XG5cdCAgICAgICAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBNX29mZnNldF8zLCAgMjIsIFRbM10pO1xuXHQgICAgICAgICAgICBhID0gRkYoYSwgYiwgYywgZCwgTV9vZmZzZXRfNCwgIDcsICBUWzRdKTtcblx0ICAgICAgICAgICAgZCA9IEZGKGQsIGEsIGIsIGMsIE1fb2Zmc2V0XzUsICAxMiwgVFs1XSk7XG5cdCAgICAgICAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBNX29mZnNldF82LCAgMTcsIFRbNl0pO1xuXHQgICAgICAgICAgICBiID0gRkYoYiwgYywgZCwgYSwgTV9vZmZzZXRfNywgIDIyLCBUWzddKTtcblx0ICAgICAgICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIE1fb2Zmc2V0XzgsICA3LCAgVFs4XSk7XG5cdCAgICAgICAgICAgIGQgPSBGRihkLCBhLCBiLCBjLCBNX29mZnNldF85LCAgMTIsIFRbOV0pO1xuXHQgICAgICAgICAgICBjID0gRkYoYywgZCwgYSwgYiwgTV9vZmZzZXRfMTAsIDE3LCBUWzEwXSk7XG5cdCAgICAgICAgICAgIGIgPSBGRihiLCBjLCBkLCBhLCBNX29mZnNldF8xMSwgMjIsIFRbMTFdKTtcblx0ICAgICAgICAgICAgYSA9IEZGKGEsIGIsIGMsIGQsIE1fb2Zmc2V0XzEyLCA3LCAgVFsxMl0pO1xuXHQgICAgICAgICAgICBkID0gRkYoZCwgYSwgYiwgYywgTV9vZmZzZXRfMTMsIDEyLCBUWzEzXSk7XG5cdCAgICAgICAgICAgIGMgPSBGRihjLCBkLCBhLCBiLCBNX29mZnNldF8xNCwgMTcsIFRbMTRdKTtcblx0ICAgICAgICAgICAgYiA9IEZGKGIsIGMsIGQsIGEsIE1fb2Zmc2V0XzE1LCAyMiwgVFsxNV0pO1xuXG5cdCAgICAgICAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBNX29mZnNldF8xLCAgNSwgIFRbMTZdKTtcblx0ICAgICAgICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIE1fb2Zmc2V0XzYsICA5LCAgVFsxN10pO1xuXHQgICAgICAgICAgICBjID0gR0coYywgZCwgYSwgYiwgTV9vZmZzZXRfMTEsIDE0LCBUWzE4XSk7XG5cdCAgICAgICAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBNX29mZnNldF8wLCAgMjAsIFRbMTldKTtcblx0ICAgICAgICAgICAgYSA9IEdHKGEsIGIsIGMsIGQsIE1fb2Zmc2V0XzUsICA1LCAgVFsyMF0pO1xuXHQgICAgICAgICAgICBkID0gR0coZCwgYSwgYiwgYywgTV9vZmZzZXRfMTAsIDksICBUWzIxXSk7XG5cdCAgICAgICAgICAgIGMgPSBHRyhjLCBkLCBhLCBiLCBNX29mZnNldF8xNSwgMTQsIFRbMjJdKTtcblx0ICAgICAgICAgICAgYiA9IEdHKGIsIGMsIGQsIGEsIE1fb2Zmc2V0XzQsICAyMCwgVFsyM10pO1xuXHQgICAgICAgICAgICBhID0gR0coYSwgYiwgYywgZCwgTV9vZmZzZXRfOSwgIDUsICBUWzI0XSk7XG5cdCAgICAgICAgICAgIGQgPSBHRyhkLCBhLCBiLCBjLCBNX29mZnNldF8xNCwgOSwgIFRbMjVdKTtcblx0ICAgICAgICAgICAgYyA9IEdHKGMsIGQsIGEsIGIsIE1fb2Zmc2V0XzMsICAxNCwgVFsyNl0pO1xuXHQgICAgICAgICAgICBiID0gR0coYiwgYywgZCwgYSwgTV9vZmZzZXRfOCwgIDIwLCBUWzI3XSk7XG5cdCAgICAgICAgICAgIGEgPSBHRyhhLCBiLCBjLCBkLCBNX29mZnNldF8xMywgNSwgIFRbMjhdKTtcblx0ICAgICAgICAgICAgZCA9IEdHKGQsIGEsIGIsIGMsIE1fb2Zmc2V0XzIsICA5LCAgVFsyOV0pO1xuXHQgICAgICAgICAgICBjID0gR0coYywgZCwgYSwgYiwgTV9vZmZzZXRfNywgIDE0LCBUWzMwXSk7XG5cdCAgICAgICAgICAgIGIgPSBHRyhiLCBjLCBkLCBhLCBNX29mZnNldF8xMiwgMjAsIFRbMzFdKTtcblxuXHQgICAgICAgICAgICBhID0gSEgoYSwgYiwgYywgZCwgTV9vZmZzZXRfNSwgIDQsICBUWzMyXSk7XG5cdCAgICAgICAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBNX29mZnNldF84LCAgMTEsIFRbMzNdKTtcblx0ICAgICAgICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIE1fb2Zmc2V0XzExLCAxNiwgVFszNF0pO1xuXHQgICAgICAgICAgICBiID0gSEgoYiwgYywgZCwgYSwgTV9vZmZzZXRfMTQsIDIzLCBUWzM1XSk7XG5cdCAgICAgICAgICAgIGEgPSBISChhLCBiLCBjLCBkLCBNX29mZnNldF8xLCAgNCwgIFRbMzZdKTtcblx0ICAgICAgICAgICAgZCA9IEhIKGQsIGEsIGIsIGMsIE1fb2Zmc2V0XzQsICAxMSwgVFszN10pO1xuXHQgICAgICAgICAgICBjID0gSEgoYywgZCwgYSwgYiwgTV9vZmZzZXRfNywgIDE2LCBUWzM4XSk7XG5cdCAgICAgICAgICAgIGIgPSBISChiLCBjLCBkLCBhLCBNX29mZnNldF8xMCwgMjMsIFRbMzldKTtcblx0ICAgICAgICAgICAgYSA9IEhIKGEsIGIsIGMsIGQsIE1fb2Zmc2V0XzEzLCA0LCAgVFs0MF0pO1xuXHQgICAgICAgICAgICBkID0gSEgoZCwgYSwgYiwgYywgTV9vZmZzZXRfMCwgIDExLCBUWzQxXSk7XG5cdCAgICAgICAgICAgIGMgPSBISChjLCBkLCBhLCBiLCBNX29mZnNldF8zLCAgMTYsIFRbNDJdKTtcblx0ICAgICAgICAgICAgYiA9IEhIKGIsIGMsIGQsIGEsIE1fb2Zmc2V0XzYsICAyMywgVFs0M10pO1xuXHQgICAgICAgICAgICBhID0gSEgoYSwgYiwgYywgZCwgTV9vZmZzZXRfOSwgIDQsICBUWzQ0XSk7XG5cdCAgICAgICAgICAgIGQgPSBISChkLCBhLCBiLCBjLCBNX29mZnNldF8xMiwgMTEsIFRbNDVdKTtcblx0ICAgICAgICAgICAgYyA9IEhIKGMsIGQsIGEsIGIsIE1fb2Zmc2V0XzE1LCAxNiwgVFs0Nl0pO1xuXHQgICAgICAgICAgICBiID0gSEgoYiwgYywgZCwgYSwgTV9vZmZzZXRfMiwgIDIzLCBUWzQ3XSk7XG5cblx0ICAgICAgICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIE1fb2Zmc2V0XzAsICA2LCAgVFs0OF0pO1xuXHQgICAgICAgICAgICBkID0gSUkoZCwgYSwgYiwgYywgTV9vZmZzZXRfNywgIDEwLCBUWzQ5XSk7XG5cdCAgICAgICAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBNX29mZnNldF8xNCwgMTUsIFRbNTBdKTtcblx0ICAgICAgICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIE1fb2Zmc2V0XzUsICAyMSwgVFs1MV0pO1xuXHQgICAgICAgICAgICBhID0gSUkoYSwgYiwgYywgZCwgTV9vZmZzZXRfMTIsIDYsICBUWzUyXSk7XG5cdCAgICAgICAgICAgIGQgPSBJSShkLCBhLCBiLCBjLCBNX29mZnNldF8zLCAgMTAsIFRbNTNdKTtcblx0ICAgICAgICAgICAgYyA9IElJKGMsIGQsIGEsIGIsIE1fb2Zmc2V0XzEwLCAxNSwgVFs1NF0pO1xuXHQgICAgICAgICAgICBiID0gSUkoYiwgYywgZCwgYSwgTV9vZmZzZXRfMSwgIDIxLCBUWzU1XSk7XG5cdCAgICAgICAgICAgIGEgPSBJSShhLCBiLCBjLCBkLCBNX29mZnNldF84LCAgNiwgIFRbNTZdKTtcblx0ICAgICAgICAgICAgZCA9IElJKGQsIGEsIGIsIGMsIE1fb2Zmc2V0XzE1LCAxMCwgVFs1N10pO1xuXHQgICAgICAgICAgICBjID0gSUkoYywgZCwgYSwgYiwgTV9vZmZzZXRfNiwgIDE1LCBUWzU4XSk7XG5cdCAgICAgICAgICAgIGIgPSBJSShiLCBjLCBkLCBhLCBNX29mZnNldF8xMywgMjEsIFRbNTldKTtcblx0ICAgICAgICAgICAgYSA9IElJKGEsIGIsIGMsIGQsIE1fb2Zmc2V0XzQsICA2LCAgVFs2MF0pO1xuXHQgICAgICAgICAgICBkID0gSUkoZCwgYSwgYiwgYywgTV9vZmZzZXRfMTEsIDEwLCBUWzYxXSk7XG5cdCAgICAgICAgICAgIGMgPSBJSShjLCBkLCBhLCBiLCBNX29mZnNldF8yLCAgMTUsIFRbNjJdKTtcblx0ICAgICAgICAgICAgYiA9IElJKGIsIGMsIGQsIGEsIE1fb2Zmc2V0XzksICAyMSwgVFs2M10pO1xuXG5cdCAgICAgICAgICAgIC8vIEludGVybWVkaWF0ZSBoYXNoIHZhbHVlXG5cdCAgICAgICAgICAgIEhbMF0gPSAoSFswXSArIGEpIHwgMDtcblx0ICAgICAgICAgICAgSFsxXSA9IChIWzFdICsgYikgfCAwO1xuXHQgICAgICAgICAgICBIWzJdID0gKEhbMl0gKyBjKSB8IDA7XG5cdCAgICAgICAgICAgIEhbM10gPSAoSFszXSArIGQpIHwgMDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgX2RvRmluYWxpemU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgLy8gU2hvcnRjdXRzXG5cdCAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5fZGF0YTtcblx0ICAgICAgICAgICAgdmFyIGRhdGFXb3JkcyA9IGRhdGEud29yZHM7XG5cblx0ICAgICAgICAgICAgdmFyIG5CaXRzVG90YWwgPSB0aGlzLl9uRGF0YUJ5dGVzICogODtcblx0ICAgICAgICAgICAgdmFyIG5CaXRzTGVmdCA9IGRhdGEuc2lnQnl0ZXMgKiA4O1xuXG5cdCAgICAgICAgICAgIC8vIEFkZCBwYWRkaW5nXG5cdCAgICAgICAgICAgIGRhdGFXb3Jkc1tuQml0c0xlZnQgPj4+IDVdIHw9IDB4ODAgPDwgKDI0IC0gbkJpdHNMZWZ0ICUgMzIpO1xuXG5cdCAgICAgICAgICAgIHZhciBuQml0c1RvdGFsSCA9IE1hdGguZmxvb3IobkJpdHNUb3RhbCAvIDB4MTAwMDAwMDAwKTtcblx0ICAgICAgICAgICAgdmFyIG5CaXRzVG90YWxMID0gbkJpdHNUb3RhbDtcblx0ICAgICAgICAgICAgZGF0YVdvcmRzWygoKG5CaXRzTGVmdCArIDY0KSA+Pj4gOSkgPDwgNCkgKyAxNV0gPSAoXG5cdCAgICAgICAgICAgICAgICAoKChuQml0c1RvdGFsSCA8PCA4KSAgfCAobkJpdHNUb3RhbEggPj4+IDI0KSkgJiAweDAwZmYwMGZmKSB8XG5cdCAgICAgICAgICAgICAgICAoKChuQml0c1RvdGFsSCA8PCAyNCkgfCAobkJpdHNUb3RhbEggPj4+IDgpKSAgJiAweGZmMDBmZjAwKVxuXHQgICAgICAgICAgICApO1xuXHQgICAgICAgICAgICBkYXRhV29yZHNbKCgobkJpdHNMZWZ0ICsgNjQpID4+PiA5KSA8PCA0KSArIDE0XSA9IChcblx0ICAgICAgICAgICAgICAgICgoKG5CaXRzVG90YWxMIDw8IDgpICB8IChuQml0c1RvdGFsTCA+Pj4gMjQpKSAmIDB4MDBmZjAwZmYpIHxcblx0ICAgICAgICAgICAgICAgICgoKG5CaXRzVG90YWxMIDw8IDI0KSB8IChuQml0c1RvdGFsTCA+Pj4gOCkpICAmIDB4ZmYwMGZmMDApXG5cdCAgICAgICAgICAgICk7XG5cblx0ICAgICAgICAgICAgZGF0YS5zaWdCeXRlcyA9IChkYXRhV29yZHMubGVuZ3RoICsgMSkgKiA0O1xuXG5cdCAgICAgICAgICAgIC8vIEhhc2ggZmluYWwgYmxvY2tzXG5cdCAgICAgICAgICAgIHRoaXMuX3Byb2Nlc3MoKTtcblxuXHQgICAgICAgICAgICAvLyBTaG9ydGN1dHNcblx0ICAgICAgICAgICAgdmFyIGhhc2ggPSB0aGlzLl9oYXNoO1xuXHQgICAgICAgICAgICB2YXIgSCA9IGhhc2gud29yZHM7XG5cblx0ICAgICAgICAgICAgLy8gU3dhcCBlbmRpYW5cblx0ICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcblx0ICAgICAgICAgICAgICAgIC8vIFNob3J0Y3V0XG5cdCAgICAgICAgICAgICAgICB2YXIgSF9pID0gSFtpXTtcblxuXHQgICAgICAgICAgICAgICAgSFtpXSA9ICgoKEhfaSA8PCA4KSAgfCAoSF9pID4+PiAyNCkpICYgMHgwMGZmMDBmZikgfFxuXHQgICAgICAgICAgICAgICAgICAgICAgICgoKEhfaSA8PCAyNCkgfCAoSF9pID4+PiA4KSkgICYgMHhmZjAwZmYwMCk7XG5cdCAgICAgICAgICAgIH1cblxuXHQgICAgICAgICAgICAvLyBSZXR1cm4gZmluYWwgY29tcHV0ZWQgaGFzaFxuXHQgICAgICAgICAgICByZXR1cm4gaGFzaDtcblx0ICAgICAgICB9LFxuXG5cdCAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgdmFyIGNsb25lID0gSGFzaGVyLmNsb25lLmNhbGwodGhpcyk7XG5cdCAgICAgICAgICAgIGNsb25lLl9oYXNoID0gdGhpcy5faGFzaC5jbG9uZSgpO1xuXG5cdCAgICAgICAgICAgIHJldHVybiBjbG9uZTtcblx0ICAgICAgICB9XG5cdCAgICB9KTtcblxuXHQgICAgZnVuY3Rpb24gRkYoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuXHQgICAgICAgIHZhciBuID0gYSArICgoYiAmIGMpIHwgKH5iICYgZCkpICsgeCArIHQ7XG5cdCAgICAgICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gR0coYSwgYiwgYywgZCwgeCwgcywgdCkge1xuXHQgICAgICAgIHZhciBuID0gYSArICgoYiAmIGQpIHwgKGMgJiB+ZCkpICsgeCArIHQ7XG5cdCAgICAgICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gSEgoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuXHQgICAgICAgIHZhciBuID0gYSArIChiIF4gYyBeIGQpICsgeCArIHQ7XG5cdCAgICAgICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcblx0ICAgIH1cblxuXHQgICAgZnVuY3Rpb24gSUkoYSwgYiwgYywgZCwgeCwgcywgdCkge1xuXHQgICAgICAgIHZhciBuID0gYSArIChjIF4gKGIgfCB+ZCkpICsgeCArIHQ7XG5cdCAgICAgICAgcmV0dXJuICgobiA8PCBzKSB8IChuID4+PiAoMzIgLSBzKSkpICsgYjtcblx0ICAgIH1cblxuXHQgICAgLyoqXG5cdCAgICAgKiBTaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgaGFzaGVyJ3Mgb2JqZWN0IGludGVyZmFjZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IG1lc3NhZ2UgVGhlIG1lc3NhZ2UgdG8gaGFzaC5cblx0ICAgICAqXG5cdCAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBoYXNoLlxuXHQgICAgICpcblx0ICAgICAqIEBzdGF0aWNcblx0ICAgICAqXG5cdCAgICAgKiBAZXhhbXBsZVxuXHQgICAgICpcblx0ICAgICAqICAgICB2YXIgaGFzaCA9IENyeXB0b0pTLk1ENSgnbWVzc2FnZScpO1xuXHQgICAgICogICAgIHZhciBoYXNoID0gQ3J5cHRvSlMuTUQ1KHdvcmRBcnJheSk7XG5cdCAgICAgKi9cblx0ICAgIEMuTUQ1ID0gSGFzaGVyLl9jcmVhdGVIZWxwZXIoTUQ1KTtcblxuXHQgICAgLyoqXG5cdCAgICAgKiBTaG9ydGN1dCBmdW5jdGlvbiB0byB0aGUgSE1BQydzIG9iamVjdCBpbnRlcmZhY2UuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtIHtXb3JkQXJyYXl8c3RyaW5nfSBtZXNzYWdlIFRoZSBtZXNzYWdlIHRvIGhhc2guXG5cdCAgICAgKiBAcGFyYW0ge1dvcmRBcnJheXxzdHJpbmd9IGtleSBUaGUgc2VjcmV0IGtleS5cblx0ICAgICAqXG5cdCAgICAgKiBAcmV0dXJuIHtXb3JkQXJyYXl9IFRoZSBITUFDLlxuXHQgICAgICpcblx0ICAgICAqIEBzdGF0aWNcblx0ICAgICAqXG5cdCAgICAgKiBAZXhhbXBsZVxuXHQgICAgICpcblx0ICAgICAqICAgICB2YXIgaG1hYyA9IENyeXB0b0pTLkhtYWNNRDUobWVzc2FnZSwga2V5KTtcblx0ICAgICAqL1xuXHQgICAgQy5IbWFjTUQ1ID0gSGFzaGVyLl9jcmVhdGVIbWFjSGVscGVyKE1ENSk7XG5cdH0oTWF0aCkpO1xuXG5cblx0cmV0dXJuIENyeXB0b0pTLk1ENTtcblxufSkpOyIsImltcG9ydCB7XG4gIERyYXdlckludGVyZmFjZSxcbiAgRHJhd2VyQ29uZmlnSW50ZXJmYWNlLFxuICBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2UsXG4gIFZlY3RvckFycmF5VHlwZSxcbiAgVmlld0NvbmZpZ09ic2VydmFibGVJbnRlcmZhY2UsXG59IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IGltYWdlQ2FjaGVIZWxwZXIgZnJvbSAnLi9oZWxwZXJzL2ltYWdlLWNhY2hlLWhlbHBlcic7XG5pbXBvcnQgeyBjcmVhdGVWZWN0b3IgfSBmcm9tICcuL3N0cnVjdHMvdmVjdG9yJztcbmltcG9ydCBHcmlkRmlsdGVyIGZyb20gJy4vc3RydWN0cy9maWx0ZXJzL2dyaWQtZmlsdGVyJztcbmltcG9ydCBQb3NpdGlvbmFsQ29udGV4dCBmcm9tICcuL3N0cnVjdHMvZHJhd2FibGUvcG9zaXRpb25hbC1jb250ZXh0JztcbmltcG9ydCB7IENvb3Jkc0ZpbHRlckNvbmZpZ0ludGVyZmFjZSB9IGZyb20gJy4vc3RydWN0cy9maWx0ZXJzL3R5cGVzJztcblxuLyoqXG4gKiBDYW52YXMgZHJhd2VyXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdlciBpbXBsZW1lbnRzIERyYXdlckludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIGNsYXNzIHRvIHVzZSBhcyBzdWJzY3JpYmVyIG5hbWUgaW4gb2JzZXJ2YWJsZSBsb2dpY1xuICAgKi9cbiAgcHJvdGVjdGVkIF9zdWJzY3JpYmVyTmFtZTogc3RyaW5nID0gJ0RyYXdlcic7XG4gIC8qKlxuICAgKiBDYW52YXMgRE9NIGVsZW1lbnRcbiAgICovXG4gIHByb3RlY3RlZCBfZG9tRWxlbWVudDogSFRNTENhbnZhc0VsZW1lbnQ7XG4gIC8qKlxuICAgKiBWaWV3IGNvbmZpZ1xuICAgKi9cbiAgcHJvdGVjdGVkIF92aWV3Q29uZmlnOiBWaWV3Q29uZmlnT2JzZXJ2YWJsZUludGVyZmFjZTtcbiAgLyoqXG4gICAqIERyYXdhYmxlIG9iamVjdHMgc3RvcmFnZVxuICAgKi9cbiAgcHJvdGVjdGVkIF9zdG9yYWdlOiBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2U7XG4gIC8qKlxuICAgKiBDYW52YXMgZHJhd2luZyBjb250ZXh0XG4gICAqL1xuICBwcm90ZWN0ZWQgX2NvbnRleHQ6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgLyoqXG4gICAqIFJlc2l6ZSBvYnNlcnZlciBvYmplY3RcbiAgICovXG4gIHByb3RlY3RlZCBfcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyO1xuXG4gIC8qKlxuICAgKiBEcmF3ZXIgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIGRvbUVsZW1lbnQgLSBjYW52YXMgRE9NIGVsZW1lbnRcbiAgICogQHBhcmFtIHZpZXdDb25maWcgLSB2aWV3IGNvbmZpZ1xuICAgKiBAcGFyYW0gc3RvcmFnZSAtIGRyYXdhYmxlIG9iamVjdHMgc3RvcmFnZVxuICAgKi9cbiAgY29uc3RydWN0b3Ioe1xuICAgIGRvbUVsZW1lbnQsXG4gICAgdmlld0NvbmZpZyxcbiAgICBzdG9yYWdlLFxuICB9OiBEcmF3ZXJDb25maWdJbnRlcmZhY2UpIHtcbiAgICB0aGlzLl9kb21FbGVtZW50ID0gZG9tRWxlbWVudDtcbiAgICB0aGlzLl92aWV3Q29uZmlnID0gdmlld0NvbmZpZztcbiAgICB0aGlzLl9zdG9yYWdlID0gc3RvcmFnZTtcbiAgICB0aGlzLl9jb250ZXh0ID0gZG9tRWxlbWVudC5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgdGhpcy5faW5pdFJlc2l6ZU9ic2VydmVyKCk7XG4gICAgdGhpcy5faW5pdFZpZXdDb25maWdPYnNlcnZlcigpO1xuICAgIHRoaXMuX2luaXRTdG9yYWdlT2JzZXJ2ZXIoKTtcbiAgICB0aGlzLl9pbml0SW1hZ2VDYWNoZU9ic2VydmVyKCk7XG4gICAgdGhpcy5faW5pdE1vdXNlRXZlbnRzKCk7XG5cbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2VySW50ZXJmYWNlLmRyYXd9XG4gICAqL1xuICBwdWJsaWMgZHJhdygpOiB2b2lkIHtcbiAgICB0aGlzLl9jb250ZXh0LnNhdmUoKTtcbiAgICB0aGlzLl9jb250ZXh0LnRyYW5zbGF0ZSguLi50aGlzLl92aWV3Q29uZmlnLm9mZnNldCk7XG4gICAgdGhpcy5fY29udGV4dC5zY2FsZSguLi50aGlzLl92aWV3Q29uZmlnLnNjYWxlKTtcbiAgICB0aGlzLl9zdG9yYWdlLmxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0uY29uZmlnLnZpc2libGUpIHtcbiAgICAgICAgaXRlbS5kcmF3KHRoaXMpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHRoaXMuX2NvbnRleHQucmVzdG9yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3ZXJJbnRlcmZhY2UucmVmcmVzaH1cbiAgICovXG4gIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9kb21FbGVtZW50LndpZHRoICE9PSB0aGlzLndpZHRoKSB7XG4gICAgICB0aGlzLl9kb21FbGVtZW50LndpZHRoID0gdGhpcy53aWR0aDtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZG9tRWxlbWVudC5oZWlnaHQgIT09IHRoaXMuaGVpZ2h0KSB7XG4gICAgICB0aGlzLl9kb21FbGVtZW50LmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdyZWZyZXNoZWQnKTtcblxuICAgIHRoaXMuY2xlYXIoKTtcbiAgICB0aGlzLmRyYXcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2VySW50ZXJmYWNlLmNsZWFyfVxuICAgKi9cbiAgcHVibGljIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuX2NvbnRleHQuY2xlYXJSZWN0KDAsIDAsIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGJvdW5kcyBvZiBjYW52YXMgZnJhbWVcbiAgICovXG4gIHB1YmxpYyBnZXRCb3VuZHMoKTogW1ZlY3RvckFycmF5VHlwZSwgVmVjdG9yQXJyYXlUeXBlXSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHRoaXMuX3ZpZXdDb25maWcudHJhbnNwb3NlRm9yd2FyZChbMCwgMF0pLFxuICAgICAgdGhpcy5fdmlld0NvbmZpZy50cmFuc3Bvc2VGb3J3YXJkKFt0aGlzLndpZHRoLCB0aGlzLmhlaWdodF0pLFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogVmlldyBjb25maWcgZ2V0dGVyXG4gICAqL1xuICBnZXQgdmlld0NvbmZpZygpOiBWaWV3Q29uZmlnT2JzZXJ2YWJsZUludGVyZmFjZSB7XG4gICAgcmV0dXJuIHRoaXMuX3ZpZXdDb25maWc7XG4gIH1cblxuICAvKipcbiAgICogQ2FudmFzIGNvbnRleHQgZ2V0dGVyXG4gICAqL1xuICBnZXQgY29udGV4dCgpOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQge1xuICAgIHJldHVybiB0aGlzLl9jb250ZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbnZhcyB3aWR0aCBnZXR0ZXJcbiAgICovXG4gIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9kb21FbGVtZW50LmNsaWVudFdpZHRoO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbnZhcyBoZWlnaHQgZ2V0dGVyXG4gICAqL1xuICBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2RvbUVsZW1lbnQuY2xpZW50SGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBjYW52YXMgcmVzaXplIG9ic2VydmVyXG4gICAqL1xuICBwcm90ZWN0ZWQgX2luaXRSZXNpemVPYnNlcnZlcigpOiB2b2lkIHtcbiAgICB0aGlzLl9yZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB0aGlzLnJlZnJlc2goKSk7XG4gICAgdGhpcy5fcmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLl9kb21FbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZXMgdmlldyBjb25maWcgb2JzZXJ2ZXJcbiAgICovXG4gIHByb3RlY3RlZCBfaW5pdFZpZXdDb25maWdPYnNlcnZlcigpOiB2b2lkIHtcbiAgICB0aGlzLl92aWV3Q29uZmlnLm9uVmlld0NoYW5nZSh0aGlzLl9zdWJzY3JpYmVyTmFtZSwgKCkgPT4gdGhpcy5yZWZyZXNoKCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYXRlcyBzdG9yYWdlIG9ic2VydmVyXG4gICAqL1xuICBwcm90ZWN0ZWQgX2luaXRTdG9yYWdlT2JzZXJ2ZXIoKTogdm9pZCB7XG4gICAgdGhpcy5fc3RvcmFnZS5vblZpZXdDaGFuZ2UodGhpcy5fc3Vic2NyaWJlck5hbWUsICgpID0+IHRoaXMucmVmcmVzaCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZXMgaW1hZ2UgY2FjaGUgb2JzZXJ2ZXJcbiAgICovXG4gIHByb3RlY3RlZCBfaW5pdEltYWdlQ2FjaGVPYnNlcnZlcigpOiB2b2lkIHtcbiAgICBpbWFnZUNhY2hlSGVscGVyLnN1YnNjcmliZSh0aGlzLl9zdWJzY3JpYmVyTmFtZSwgKCkgPT4ge1xuICAgICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhdGVzIG1vdXNlIGV2ZW50cyBvYnNlcnZlclxuICAgKi9cbiAgcHJvdGVjdGVkIF9pbml0TW91c2VFdmVudHMoKTogdm9pZCB7XG4gICAgLy8gVE9ETyDQv9C10YDQtdC90LXRgdGC0Lgg0LrRg9C00LAt0L3QuNCx0YPQtNGMXG5cbiAgICBjb25zdCBjb29yZHNGaWx0ZXIgPSBuZXcgR3JpZEZpbHRlcigpO1xuICAgIGNvbnN0IGZpbHRlckNvb3JkcyA9IChjb29yZHM6IFZlY3RvckFycmF5VHlwZSkgPT4ge1xuICAgICAgcmV0dXJuIGNvb3Jkc0ZpbHRlci5wcm9jZXNzKGNvb3JkcywgdGhpcy5fdmlld0NvbmZpZy5nZXRDb25maWcoKSBhcyBDb29yZHNGaWx0ZXJDb25maWdJbnRlcmZhY2UpO1xuICAgIH07XG5cbiAgICBsZXQgY3VycmVudEVsZW1lbnRDb250ZXh0OiBQb3NpdGlvbmFsQ29udGV4dCA9IG5ldyBQb3NpdGlvbmFsQ29udGV4dChudWxsLCBudWxsKTtcblxuICAgIGNvbnN0IERFVklBVElPTiA9IDg7XG4gICAgY29uc3QgZ2V0TmVhckJvdW5kRWxlbWVudCA9IChjb29yZHM6IFZlY3RvckFycmF5VHlwZSk6IFBvc2l0aW9uYWxDb250ZXh0ID0+IHtcbiAgICAgIGNvbnN0IHRyYW5zcG9zZWRDb29yZHM6IFZlY3RvckFycmF5VHlwZSA9IHRoaXMuX3ZpZXdDb25maWcudHJhbnNwb3NlRm9yd2FyZChjb29yZHMpO1xuICAgICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2UuZmluZEJ5TmVhckVkZ2VQb3NpdGlvbih0cmFuc3Bvc2VkQ29vcmRzLCBERVZJQVRJT04gLyB0aGlzLl92aWV3Q29uZmlnLnNjYWxlWzBdKTtcbiAgICB9O1xuXG4gICAgdGhpcy5fZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldmVudDogV2hlZWxFdmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LmN0cmxLZXkpIHtcbiAgICAgICAgbGV0IHNjYWxlID0gdGhpcy5fdmlld0NvbmZpZy5zY2FsZVswXTtcbiAgICAgICAgc2NhbGUgKz0gZXZlbnQuZGVsdGFZICogLTAuMDAyO1xuICAgICAgICBzY2FsZSA9IE1hdGgubWluKE1hdGgubWF4KDAuMDAxLCBzY2FsZSksIDEwMCk7XG4gICAgICAgIHRoaXMuX3ZpZXdDb25maWcudXBkYXRlU2NhbGVJbkN1cnNvckNvbnRleHQoW3NjYWxlLCBzY2FsZV0sIFtldmVudC5vZmZzZXRYLCBldmVudC5vZmZzZXRZXSk7XG4gICAgICB9IGVsc2UgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgIHRoaXMuX3ZpZXdDb25maWcub2Zmc2V0WzBdIC09IGV2ZW50LmRlbHRhWTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX3ZpZXdDb25maWcub2Zmc2V0WzFdIC09IGV2ZW50LmRlbHRhWTtcbiAgICAgIH1cblxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2RvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQ6IFBvaW50ZXJFdmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIGxldCBtb3VzZURvd25Db29yZHM6IFZlY3RvckFycmF5VHlwZSB8IG51bGwgPSBudWxsO1xuXG4gICAgdGhpcy5fZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGlmIChjdXJyZW50RWxlbWVudENvbnRleHQuaXNFbXB0eSgpKSB7XG4gICAgICAgIGNvbnN0IHRyYW5zcG9zZWRDb29yZHMgPSB0aGlzLl92aWV3Q29uZmlnLnRyYW5zcG9zZUZvcndhcmQoW2V2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFldKTtcbiAgICAgICAgY3VycmVudEVsZW1lbnRDb250ZXh0ID0gdGhpcy5fc3RvcmFnZS5maW5kQnlQb3NpdGlvbih0cmFuc3Bvc2VkQ29vcmRzKTtcbiAgICAgIH1cblxuICAgICAgbW91c2VEb3duQ29vcmRzID0gW2V2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFldO1xuICAgICAgdGhpcy5fZG9tRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnZ3JhYmJpbmcnO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IG1vdXNlTW92ZUNvb3JkczogVmVjdG9yQXJyYXlUeXBlID0gW2V2ZW50Lm9mZnNldFgsIGV2ZW50Lm9mZnNldFldO1xuICAgICAgY29uc3QgdHJhbnNwb3NlZENvb3JkcyA9IHRoaXMuX3ZpZXdDb25maWcudHJhbnNwb3NlRm9yd2FyZChtb3VzZU1vdmVDb29yZHMpO1xuXG4gICAgICBpZiAobW91c2VEb3duQ29vcmRzID09PSBudWxsKSB7XG4gICAgICAgIGlmICghZ2V0TmVhckJvdW5kRWxlbWVudChtb3VzZU1vdmVDb29yZHMpLmlzRW1wdHkoKSkge1xuICAgICAgICAgIHRoaXMuX2RvbUVsZW1lbnQuc3R5bGUuY3Vyc29yID0gJ2Nyb3NzaGFpcic7XG4gICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3N0b3JhZ2UuZmluZEJ5UG9zaXRpb24odHJhbnNwb3NlZENvb3JkcykuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgdGhpcy5fZG9tRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fZG9tRWxlbWVudC5zdHlsZS5jdXJzb3IgPSAnZGVmYXVsdCc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghY3VycmVudEVsZW1lbnRDb250ZXh0LmlzRW1wdHkoKSkge1xuICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IGNyZWF0ZVZlY3Rvcih0cmFuc3Bvc2VkQ29vcmRzKVxuICAgICAgICAgIC5zdWIoY3JlYXRlVmVjdG9yKGN1cnJlbnRFbGVtZW50Q29udGV4dC5wb3NpdGlvbikpXG4gICAgICAgICAgLnRvQXJyYXkoKTtcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb25GaWx0ZXJlZCA9IGZpbHRlckNvb3JkcyhuZXdQb3NpdGlvbik7XG5cbiAgICAgICAgaWYgKCFjcmVhdGVWZWN0b3IobmV3UG9zaXRpb25GaWx0ZXJlZCkuaXNFcXVhbChjcmVhdGVWZWN0b3IoY3VycmVudEVsZW1lbnRDb250ZXh0LmVsZW1lbnQuY29uZmlnLnBvc2l0aW9uKSkpIHtcbiAgICAgICAgICBjdXJyZW50RWxlbWVudENvbnRleHQuZWxlbWVudC5jb25maWcucG9zaXRpb24gPSBuZXdQb3NpdGlvbkZpbHRlcmVkO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBkaWZmZXJlbmNlOiBWZWN0b3JBcnJheVR5cGUgPSBbXG4gICAgICAgICAgbW91c2VEb3duQ29vcmRzWzBdLW1vdXNlTW92ZUNvb3Jkc1swXSxcbiAgICAgICAgICBtb3VzZURvd25Db29yZHNbMV0tbW91c2VNb3ZlQ29vcmRzWzFdLFxuICAgICAgICBdO1xuXG4gICAgICAgIHRoaXMuX3ZpZXdDb25maWcub2Zmc2V0ID0gY3JlYXRlVmVjdG9yKHRoaXMuX3ZpZXdDb25maWcub2Zmc2V0KVxuICAgICAgICAgIC5zdWIoY3JlYXRlVmVjdG9yKGRpZmZlcmVuY2UpKVxuICAgICAgICAgIC50b0FycmF5KCk7XG4gICAgICB9XG5cbiAgICAgIG1vdXNlRG93bkNvb3JkcyA9IG1vdXNlTW92ZUNvb3JkcztcbiAgICB9KTtcblxuICAgIHRoaXMuX2RvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgIGlmICghY3VycmVudEVsZW1lbnRDb250ZXh0LmlzRW1wdHkoKSkge1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJyZW50RWxlbWVudENvbnRleHQuZWxlbWVudCk7XG4gICAgICB9XG5cbiAgICAgIGN1cnJlbnRFbGVtZW50Q29udGV4dCA9IG5ldyBQb3NpdGlvbmFsQ29udGV4dChudWxsLCBudWxsKTtcbiAgICAgIG1vdXNlRG93bkNvb3JkcyA9IG51bGw7XG4gICAgICB0aGlzLl9kb21FbGVtZW50LnN0eWxlLmN1cnNvciA9ICdkZWZhdWx0JztcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRHJhd2FibGVJbnRlcmZhY2UsXG4gIERyYXdhYmxlQ29uZmlnSW50ZXJmYWNlLFxuICBEcmF3YWJsZUlkVHlwZSxcbiAgRHJhd2VySW50ZXJmYWNlLFxuICBMaW5rZWREYXRhVHlwZSxcbiAgVmVjdG9yQXJyYXlUeXBlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgRHJhd2FibGUgZnJvbSAnLi4vc3RydWN0cy9kcmF3YWJsZS9kcmF3YWJsZSc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWcgb2YgZ3JpZFxuICogQHB1YmxpY1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEdyaWRDb25maWdJbnRlcmZhY2UgZXh0ZW5kcyBEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZSB7XG4gIG1haW5MaW5lQ29sb3I6IHN0cmluZztcbiAgc3ViTGluZUNvbG9yOiBzdHJpbmc7XG4gIGxpbmVXaWR0aDogbnVtYmVyO1xuICBsaW5lc0luQmxvY2s6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBHcmlkIGZpZ3VyZVxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkIGV4dGVuZHMgRHJhd2FibGUgaW1wbGVtZW50cyBEcmF3YWJsZUludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBPYmplY3QgdHlwZVxuICAgKi9cbiAgcHJvdGVjdGVkIF90eXBlOiBzdHJpbmcgPSAnR3JpZCc7XG4gIC8qKlxuICAgKiBWaWV3IGNvbmZpZ1xuICAgKi9cbiAgcHJvdGVjdGVkIF9jb25maWc6IEdyaWRDb25maWdJbnRlcmZhY2U7XG5cbiAgLyoqXG4gICAqIEdyaWQgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIGlkIC0gb2JqZWN0IElEXG4gICAqIEBwYXJhbSBjb25maWcgLSB2aWV3IGNvbmZpZ1xuICAgKiBAcGFyYW0gZGF0YSAtIGxpbmtlZCBleHRyYSBkYXRhXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZDogRHJhd2FibGVJZFR5cGUsIGNvbmZpZzogR3JpZENvbmZpZ0ludGVyZmFjZSwgZGF0YTogTGlua2VkRGF0YVR5cGUgPSB7fSkge1xuICAgIHN1cGVyKGlkLCBjb25maWcsIGRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZUludGVyZmFjZS5kcmF3fVxuICAgKi9cbiAgZHJhdyhkcmF3ZXI6IERyYXdlckludGVyZmFjZSk6IHZvaWQge1xuICAgIGRyYXdlci5jb250ZXh0LnNhdmUoKTtcbiAgICBkcmF3ZXIuY29udGV4dC5iZWdpblBhdGgoKTtcblxuICAgIGNvbnN0IFtmcm9tQm91bmQsIHRvQm91bmRdID0gZHJhd2VyLmdldEJvdW5kcygpO1xuICAgIGNvbnN0IHNjYWxlID0gZHJhd2VyLnZpZXdDb25maWcuc2NhbGVbMF07XG5cbiAgICBkcmF3ZXIuY29udGV4dC5saW5lV2lkdGggPSB0aGlzLl9jb25maWcubGluZVdpZHRoIC8gc2NhbGU7XG5cbiAgICBsZXQgc3RlcCA9IGRyYXdlci52aWV3Q29uZmlnLmdyaWRTdGVwO1xuXG4gICAgaWYgKHNjYWxlIDwgMSkge1xuICAgICAgc3RlcCAqPSAyICoqIE1hdGgucm91bmQoTWF0aC5sb2cyKDEgLyBzY2FsZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGVwIC89IDIgKiogTWF0aC5yb3VuZChNYXRoLmxvZzIoc2NhbGUpKTtcbiAgICB9XG5cbiAgICBjb25zdCBtYWluTGluZURpc3RhbmNlID0gc3RlcCAqIHRoaXMuX2NvbmZpZy5saW5lc0luQmxvY2s7XG4gICAgbGV0IHhHYXAgPSAoZnJvbUJvdW5kWzBdICUgbWFpbkxpbmVEaXN0YW5jZSk7XG4gICAgaWYgKHhHYXAgPCAwKSB7XG4gICAgICB4R2FwICs9IG1haW5MaW5lRGlzdGFuY2U7XG4gICAgfVxuICAgIGxldCB5R2FwID0gKGZyb21Cb3VuZFsxXSAlIG1haW5MaW5lRGlzdGFuY2UpO1xuICAgIGlmICh5R2FwIDwgMCkge1xuICAgICAgeUdhcCArPSBtYWluTGluZURpc3RhbmNlO1xuICAgIH1cblxuICAgIHtcbiAgICAgIGxldCBqID0gMDtcbiAgICAgIGZvciAobGV0IGk9ZnJvbUJvdW5kWzFdLXlHYXA7IGk8PXRvQm91bmRbMV07IGkrPXN0ZXApIHtcbiAgICAgICAgY29uc3QgY29sb3IgPSAoaisrICUgdGhpcy5fY29uZmlnLmxpbmVzSW5CbG9jayA9PT0gMClcbiAgICAgICAgICA/IHRoaXMuX2NvbmZpZy5tYWluTGluZUNvbG9yXG4gICAgICAgICAgOiB0aGlzLl9jb25maWcuc3ViTGluZUNvbG9yO1xuICAgICAgICB0aGlzLl9kcmF3SG9yaXpvbnRhbExpbmUoaSwgZHJhd2VyLCBjb2xvciwgW2Zyb21Cb3VuZCwgdG9Cb3VuZF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHtcbiAgICAgIGxldCBqID0gMDtcbiAgICAgIGZvciAobGV0IGk9ZnJvbUJvdW5kWzBdLXhHYXA7IGk8PXRvQm91bmRbMF07IGkrPXN0ZXApIHtcbiAgICAgICAgY29uc3QgY29sb3IgPSAoaisrICUgdGhpcy5fY29uZmlnLmxpbmVzSW5CbG9jayA9PT0gMClcbiAgICAgICAgICA/IHRoaXMuX2NvbmZpZy5tYWluTGluZUNvbG9yXG4gICAgICAgICAgOiB0aGlzLl9jb25maWcuc3ViTGluZUNvbG9yO1xuICAgICAgICB0aGlzLl9kcmF3VmVydGljYWxMaW5lKGksIGRyYXdlciwgY29sb3IsIFtmcm9tQm91bmQsIHRvQm91bmRdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkcmF3ZXIuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICBkcmF3ZXIuY29udGV4dC5yZXN0b3JlKCk7XG4gIH1cblxuICAvKipcbiAgICogRHJhdyBob3Jpem9udGFsIGxpbmVcbiAgICogQHBhcmFtIHlPZmZzZXQgLSB2ZXJ0aWNhbCBvZmZzZXRcbiAgICogQHBhcmFtIGRyYXdlciAtIGRyYXdlciBvYmplY3RcbiAgICogQHBhcmFtIGNvbG9yIC0gY29sb3JcbiAgICogQHBhcmFtIGZyb21Cb3VuZCAtIGxlZnQtdG9wIGJvdW5kXG4gICAqIEBwYXJhbSB0b0JvdW5kIC0gcmlnaHQtYm90dG9tIGJvdW5kXG4gICAqL1xuICBwcm90ZWN0ZWQgX2RyYXdIb3Jpem9udGFsTGluZShcbiAgICB5T2Zmc2V0OiBudW1iZXIsXG4gICAgZHJhd2VyOiBEcmF3ZXJJbnRlcmZhY2UsXG4gICAgY29sb3I6IHN0cmluZyxcbiAgICBbZnJvbUJvdW5kLCB0b0JvdW5kXTogW1ZlY3RvckFycmF5VHlwZSwgVmVjdG9yQXJyYXlUeXBlXSxcbiAgKSB7XG4gICAgY29uc3QgbGluZUZyb20gPSBbZnJvbUJvdW5kWzBdLCB5T2Zmc2V0XTtcbiAgICBjb25zdCBsaW5lVG8gPSBbdG9Cb3VuZFswXSwgeU9mZnNldF07XG5cbiAgICBkcmF3ZXIuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBkcmF3ZXIuY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGRyYXdlci5jb250ZXh0Lm1vdmVUbyhsaW5lRnJvbVswXSwgbGluZUZyb21bMV0pO1xuICAgIGRyYXdlci5jb250ZXh0LmxpbmVUbyhsaW5lVG9bMF0sIGxpbmVUb1sxXSk7XG4gICAgZHJhd2VyLmNvbnRleHQuc3Ryb2tlKCk7XG4gICAgZHJhd2VyLmNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3IHZlcnRpY2FsIGxpbmVcbiAgICogQHBhcmFtIGRyYXdlciAtIGRyYXdlciBvYmplY3RcbiAgICogQHBhcmFtIHhPZmZzZXQgLSBob3Jpem9udGFsIG9mZnNldFxuICAgKiBAcGFyYW0gY29sb3IgLSBjb2xvclxuICAgKiBAcGFyYW0gZnJvbUJvdW5kIC0gbGVmdC10b3AgYm91bmRcbiAgICogQHBhcmFtIHRvQm91bmQgLSByaWdodC1ib3R0b20gYm91bmRcbiAgICovXG4gIHByb3RlY3RlZCBfZHJhd1ZlcnRpY2FsTGluZShcbiAgICB4T2Zmc2V0OiBudW1iZXIsXG4gICAgZHJhd2VyOiBEcmF3ZXJJbnRlcmZhY2UsXG4gICAgY29sb3I6IHN0cmluZyxcbiAgICBbZnJvbUJvdW5kLCB0b0JvdW5kXTogW1ZlY3RvckFycmF5VHlwZSwgVmVjdG9yQXJyYXlUeXBlXSxcbiAgKSB7XG4gICAgY29uc3QgbGluZUZyb20gPSBbeE9mZnNldCwgZnJvbUJvdW5kWzFdXTtcbiAgICBjb25zdCBsaW5lVG8gPSBbeE9mZnNldCwgdG9Cb3VuZFsxXV07XG5cbiAgICBkcmF3ZXIuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBkcmF3ZXIuY29udGV4dC5zdHJva2VTdHlsZSA9IGNvbG9yO1xuICAgIGRyYXdlci5jb250ZXh0Lm1vdmVUbyhsaW5lRnJvbVswXSwgbGluZUZyb21bMV0pO1xuICAgIGRyYXdlci5jb250ZXh0LmxpbmVUbyhsaW5lVG9bMF0sIGxpbmVUb1sxXSk7XG4gICAgZHJhd2VyLmNvbnRleHQuc3Ryb2tlKCk7XG4gICAgZHJhd2VyLmNvbnRleHQuY2xvc2VQYXRoKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlLFxuICBQb3NpdGlvbmFsRHJhd2FibGVDb25maWdJbnRlcmZhY2UsXG4gIFN0eWxpemVkRHJhd2FibGVDb25maWdJbnRlcmZhY2UsXG4gIERyYXdhYmxlSWRUeXBlLFxuICBEcmF3ZXJJbnRlcmZhY2UsXG4gIExpbmtlZERhdGFUeXBlLFxufSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgUG9zaXRpb25hbERyYXdhYmxlIGZyb20gJy4uL3N0cnVjdHMvZHJhd2FibGUvcG9zaXRpb25hbC1kcmF3YWJsZSc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWcgb2YgcmVjdCBmaWd1cmVcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWN0Q29uZmlnSW50ZXJmYWNlIGV4dGVuZHMgUG9zaXRpb25hbERyYXdhYmxlQ29uZmlnSW50ZXJmYWNlLCBTdHlsaXplZERyYXdhYmxlQ29uZmlnSW50ZXJmYWNlIHtcblxufVxuXG4vKipcbiAqIFJlY3QgZmlndXJlXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3QgZXh0ZW5kcyBQb3NpdGlvbmFsRHJhd2FibGUgaW1wbGVtZW50cyBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2Uge1xuICAvKipcbiAgICogT2JqZWN0IHR5cGVcbiAgICovXG4gIHByb3RlY3RlZCBfdHlwZTogc3RyaW5nID0gJ1JlY3QnO1xuICAvKipcbiAgICogVmlldyBjb25maWdcbiAgICovXG4gIHByb3RlY3RlZCBfY29uZmlnOiBSZWN0Q29uZmlnSW50ZXJmYWNlO1xuXG4gIC8qKlxuICAgKiBSZWN0IGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBpZCAtIG9iamVjdCBJRFxuICAgKiBAcGFyYW0gY29uZmlnIC0gdmlldyBjb25maWdcbiAgICogQHBhcmFtIGRhdGEgLSBsaW5rZWQgZXh0cmEgZGF0YVxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQ6IERyYXdhYmxlSWRUeXBlLCBjb25maWc6IFJlY3RDb25maWdJbnRlcmZhY2UsIGRhdGE6IExpbmtlZERhdGFUeXBlID0ge30pIHtcbiAgICBzdXBlcihpZCwgY29uZmlnLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVJbnRlcmZhY2UuZHJhd31cbiAgICovXG4gIGRyYXcoZHJhd2VyOiBEcmF3ZXJJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBkcmF3ZXIuY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICBkcmF3ZXIuY29udGV4dC5zdHJva2VTdHlsZSA9IHRoaXMuX2NvbmZpZy5zdHJva2VTdHlsZTtcbiAgICBkcmF3ZXIuY29udGV4dC5maWxsU3R5bGUgPSB0aGlzLl9jb25maWcuZmlsbFN0eWxlO1xuICAgIGRyYXdlci5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMuX2NvbmZpZy5saW5lV2lkdGg7XG4gICAgZHJhd2VyLmNvbnRleHQuZmlsbFJlY3QoLi4udGhpcy5fY29uZmlnLnBvc2l0aW9uLCAuLi50aGlzLl9jb25maWcuc2l6ZSk7XG5cbiAgICBpZiAodGhpcy5fY29uZmlnLmxpbmVXaWR0aCAhPT0gMCkge1xuICAgICAgZHJhd2VyLmNvbnRleHQuc3Ryb2tlUmVjdCguLi50aGlzLl9jb25maWcucG9zaXRpb24sIC4uLnRoaXMuX2NvbmZpZy5zaXplKTtcbiAgICB9XG5cbiAgICBkcmF3ZXIuY29udGV4dC5jbG9zZVBhdGgoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlLFxuICBQb3NpdGlvbmFsRHJhd2FibGVDb25maWdJbnRlcmZhY2UsXG4gIERyYXdhYmxlSWRUeXBlLFxuICBEcmF3ZXJJbnRlcmZhY2UsXG4gIExpbmtlZERhdGFUeXBlLCBWZWN0b3JBcnJheVR5cGUsXG59IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBQb3NpdGlvbmFsRHJhd2FibGUgZnJvbSAnLi4vc3RydWN0cy9kcmF3YWJsZS9wb3NpdGlvbmFsLWRyYXdhYmxlJztcbmltcG9ydCBpbWFnZUNhY2hlSGVscGVyIGZyb20gJy4uL2hlbHBlcnMvaW1hZ2UtY2FjaGUtaGVscGVyJztcbmltcG9ydCB7IEJvdW5kSW50ZXJmYWNlIH0gZnJvbSAnLi4vdHlwZXMvYm91bmQnO1xuaW1wb3J0IFBvbHlnb25hbEJvdW5kIGZyb20gJy4uL3N0cnVjdHMvYm91bmRzL3BvbHlnb25hbC1ib3VuZCc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjb25maWcgb2YgcmVjdCBmaWd1cmVcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdmdDb25maWdJbnRlcmZhY2UgZXh0ZW5kcyBQb3NpdGlvbmFsRHJhd2FibGVDb25maWdJbnRlcmZhY2Uge1xuICAvKipcbiAgICogU1ZHIGRhdGFcbiAgICovXG4gIGRhdGE6IHN0cmluZztcbn1cblxuLyoqXG4gKiBTdmcgZmlndXJlXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN2ZyBleHRlbmRzIFBvc2l0aW9uYWxEcmF3YWJsZSBpbXBsZW1lbnRzIFBvc2l0aW9uYWxEcmF3YWJsZUludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBPYmplY3QgdHlwZVxuICAgKi9cbiAgcHJvdGVjdGVkIF90eXBlOiBzdHJpbmcgPSAnU3ZnJztcbiAgLyoqXG4gICAqIFZpZXcgY29uZmlnXG4gICAqL1xuICBwcm90ZWN0ZWQgX2NvbmZpZzogU3ZnQ29uZmlnSW50ZXJmYWNlO1xuICAvKipcbiAgICogSW1hZ2UgRE9NIGVsZW1lbnRcbiAgICovXG4gIHByb3RlY3RlZCBfaW1nOiBIVE1MSW1hZ2VFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFN2ZyBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gaWQgLSBvYmplY3QgSURcbiAgICogQHBhcmFtIGNvbmZpZyAtIHZpZXcgY29uZmlnXG4gICAqIEBwYXJhbSBkYXRhIC0gbGlua2VkIGV4dHJhIGRhdGFcbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkOiBEcmF3YWJsZUlkVHlwZSwgY29uZmlnOiBTdmdDb25maWdJbnRlcmZhY2UsIGRhdGE6IExpbmtlZERhdGFUeXBlID0ge30pIHtcbiAgICBzdXBlcihpZCwgY29uZmlnLCBkYXRhKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVJbnRlcmZhY2UuZHJhd31cbiAgICovXG4gIHB1YmxpYyBkcmF3KGRyYXdlcjogRHJhd2VySW50ZXJmYWNlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLl90cnlEcmF3KGRyYXdlcikpIHtcbiAgICAgIHRoaXMuX2ltZyA9IGltYWdlQ2FjaGVIZWxwZXIuY2FjaGUodGhpcy5fY29uZmlnLmRhdGEsICdpbWFnZS9zdmcreG1sJywgKGltZykgPT4ge1xuICAgICAgICB0aGlzLl9pbWcgPSBpbWc7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX3RyeURyYXcoZHJhd2VyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogc291cmNlV2lkdGggZ2V0dGVyXG4gICAqL1xuICBwdWJsaWMgZ2V0IHNvdXJjZVdpZHRoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX2ltZy53aWR0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBzb3VyY2VIZWlnaHQgZ2V0dGVyXG4gICAqL1xuICBwdWJsaWMgZ2V0IHNvdXJjZUhlaWdodCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9pbWcuaGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIHNjYWxlIGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBzY2FsZSgpOiBWZWN0b3JBcnJheVR5cGUge1xuICAgIHJldHVybiBbXG4gICAgICB0aGlzLl9jb25maWcuc2l6ZVswXSAvIHRoaXMuc291cmNlV2lkdGgsXG4gICAgICB0aGlzLl9jb25maWcuc2l6ZVsxXSAvIHRoaXMuc291cmNlSGVpZ2h0LFxuICAgIF07XG4gIH1cblxuICAvKipcbiAgICogVE9ETyDQstGA0LXQvNC10L3QvdC+INC00LvRjyDQv9GA0L7QstC10YDQutC4XG4gICAqIGJvdW5kIGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBib3VuZCgpOiBCb3VuZEludGVyZmFjZSB7XG4gICAgcmV0dXJuIG5ldyBQb2x5Z29uYWxCb3VuZCh7XG4gICAgICBwb2ludHM6IFtcbiAgICAgICAgWzI4LCAwXSwgWzEzNCwgMF0sIFsxNjEsIDQwXSwgWzEzNCwgODFdLCBbMjgsIDgxXSwgWzAsIDQwXSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogVHJpZXMgdG8gZHJhdyB0aGUgZmlndXJlIGlmIHRoZSBpbWFnZSBpcyByZWFkeVxuICAgKiBAcGFyYW0gZHJhd2VyIC0gZHJhd2VyIG9iamVjdFxuICAgKi9cbiAgcHJvdGVjdGVkIF90cnlEcmF3KGRyYXdlcjogRHJhd2VySW50ZXJmYWNlKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2ltZyAhPT0gbnVsbCkge1xuICAgICAgY29uc3Qgc2NhbGUgPSB0aGlzLnNjYWxlO1xuICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLl9jb25maWcucG9zaXRpb247XG4gICAgICBjb25zdCBzY2FsZWRQb3NpdGlvbjogVmVjdG9yQXJyYXlUeXBlID0gW3Bvc2l0aW9uWzBdL3NjYWxlWzBdLCBwb3NpdGlvblsxXS9zY2FsZVsxXV07XG5cbiAgICAgIGRyYXdlci5jb250ZXh0LnNhdmUoKTtcbiAgICAgIGRyYXdlci5jb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgZHJhd2VyLmNvbnRleHQuc2NhbGUoLi4uc2NhbGUpO1xuICAgICAgZHJhd2VyLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuX2ltZywgLi4uc2NhbGVkUG9zaXRpb24pO1xuICAgICAgZHJhd2VyLmNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICBkcmF3ZXIuY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgZGVmYXVsdCBhcyBtZDUgfSBmcm9tICdjcnlwdG8tanMvbWQ1JztcbmltcG9ydCB7IFZlY3RvckFycmF5VHlwZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYXJyYXlzIGFyZSBlcXVhbCBhbmQgZmFsc2UgZWxzZVxuICogQHB1YmxpY1xuICogQHBhcmFtIGxocyAtIGZpcnN0IGFycmF5IHRvIGNvbXBhcmVcbiAqIEBwYXJhbSByaHMgLSBzZWNvbmQgYXJyYXkgdG8gY29tcGFyZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJlQXJyYXlzRXF1YWwobGhzOiBBcnJheTx1bmtub3duPiwgcmhzOiBBcnJheTx1bmtub3duPik6IGJvb2xlYW4ge1xuICByZXR1cm4gbGhzLmxlbmd0aCA9PT0gcmhzLmxlbmd0aCAmJiBsaHMuZXZlcnkoKHYsIGkpID0+IHYgPT09IHJoc1tpXSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBET00gZWxlbWVudCBmcm9tIEhUTUwgc3RyaW5nXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gaHRtbFN0cmluZyAtIEhUTUwgc3RyaW5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVFbGVtZW50RnJvbUhUTUwoaHRtbFN0cmluZzogc3RyaW5nKTogdW5rbm93biB7XG4gIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBkaXYuaW5uZXJIVE1MID0gaHRtbFN0cmluZy50cmltKCk7XG5cbiAgcmV0dXJuIGRpdi5maXJzdENoaWxkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYmxvYiBmcm9tIHRleHRcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSBkYXRhIC0gdGV4dFxuICogQHBhcmFtIHR5cGUgLSB0eXBlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCbG9iKGRhdGE6IHN0cmluZywgdHlwZTogc3RyaW5nKTogQmxvYiB7XG4gIHJldHVybiBuZXcgQmxvYihbZGF0YV0sIHsgdHlwZSB9KTtcbn1cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHVuZGVyc3RhbmRpbmcgbWV0aG9kIGNyZWF0ZU9iamVjdFVSTCgpXG4gKi9cbmludGVyZmFjZSBVcmxJbnRlcmZhY2Uge1xuICBjcmVhdGVPYmplY3RVUkwoYmxvYjogQmxvYik6IHN0cmluZztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIFVSTCBmcm9tIGJsb2JcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSBibG9iIC0gYmxvYlxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVXJsRnJvbUJsb2IoYmxvYjogQmxvYik6IHN0cmluZyB7XG4gIGNvbnN0IFVSTDogVXJsSW50ZXJmYWNlID0gKHdpbmRvdy5VUkwgfHwgd2luZG93LndlYmtpdFVSTCB8fCB3aW5kb3cpIGFzIFVybEludGVyZmFjZTtcbiAgcmV0dXJuIFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG59XG5cbi8qKlxuICogRmluZHMgYW5kIHJldHVybnMgbWluaW1hbCAobGVmdC10b3ApIHBvc2l0aW9uXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gcG9zaXRpb25zIC0gaW5wdXQgcG9zaXRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRNaW5Qb3NpdGlvbihwb3NpdGlvbnM6IFZlY3RvckFycmF5VHlwZVtdKTogVmVjdG9yQXJyYXlUeXBlIHtcbiAgbGV0IG1pblg6IG51bWJlciA9IEluZmluaXR5O1xuICBsZXQgbWluWTogbnVtYmVyID0gSW5maW5pdHk7XG5cbiAgcG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgaWYgKHBvc2l0aW9uWzBdIDwgbWluWCkge1xuICAgICAgbWluWCA9IHBvc2l0aW9uWzBdO1xuICAgIH1cbiAgICBpZiAocG9zaXRpb25bMV0gPCBtaW5ZKSB7XG4gICAgICBtaW5ZID0gcG9zaXRpb25bMV07XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gW21pblgsIG1pblldO1xufVxuXG4vKipcbiAqIEZpbmRzIGFuZCByZXR1cm5zIG1heGltYWwgKHJpZ2h0LWJvdHRvbSkgcG9zaXRpb25cbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSBwb3NpdGlvbnMgLSBpbnB1dCBwb3NpdGlvbnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE1heFBvc2l0aW9uKHBvc2l0aW9uczogVmVjdG9yQXJyYXlUeXBlW10pOiBWZWN0b3JBcnJheVR5cGUge1xuICBsZXQgbWF4WDogbnVtYmVyID0gLUluZmluaXR5O1xuICBsZXQgbWF4WTogbnVtYmVyID0gLUluZmluaXR5O1xuXG4gIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgIGlmIChwb3NpdGlvblswXSA+IG1heFgpIHtcbiAgICAgIG1heFggPSBwb3NpdGlvblswXTtcbiAgICB9XG4gICAgaWYgKHBvc2l0aW9uWzFdID4gbWF4WSkge1xuICAgICAgbWF4WSA9IHBvc2l0aW9uWzFdO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIFttYXhYLCBtYXhZXTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIE1ENSBoYXNoIGZyb20gc3RyaW5nXG4gKiBAcHVibGljXG4gKiBAcGFyYW0gaW5wdXQgLSBpbnB1dCBzdHJpbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhc2hTdHJpbmcoaW5wdXQ6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBtZDUoaW5wdXQpLnRvU3RyaW5nKCk7XG59XG4iLCJpbXBvcnQgSW1hZ2VDYWNoZSBmcm9tICcuLi9zdHJ1Y3RzL2ltYWdlLWNhY2hlJztcblxuLyoqXG4gKiBJbWFnZSBjYWNoZSBoZWxwZXJcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgbmV3IEltYWdlQ2FjaGUoKTtcbiIsImltcG9ydCB7IE9ic2VydmVIZWxwZXJJbnRlcmZhY2UsIFZpZXdPYnNlcnZhYmxlSGFuZGxlclR5cGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogSGVscGVyIGZvciBvYnNlcnZhYmxlIGxvZ2ljXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE9ic2VydmVIZWxwZXIgaW1wbGVtZW50cyBPYnNlcnZlSGVscGVySW50ZXJmYWNlIHtcbiAgLyoqXG4gICAqIEhhbmRsZXJzIG1hcHBlZCBieSBzdWJzY3JpYmVyc1xuICAgKi9cbiAgcHJvdGVjdGVkIF9oYW5kbGVyTWFwOiBSZWNvcmQ8c3RyaW5nLCBWaWV3T2JzZXJ2YWJsZUhhbmRsZXJUeXBlPiA9IHt9O1xuICAvKipcbiAgICogRmxhZyBmb3IgbXV0aW5nIGhhbmRsZXJzXG4gICAqL1xuICBwcm90ZWN0ZWQgX211dGVIYW5kbGVyczogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgT2JzZXJ2ZUhlbHBlckludGVyZmFjZS5vbkNoYW5nZX1cbiAgICovXG4gIHB1YmxpYyBvbkNoYW5nZShcbiAgICBzdWJzY3JpYmVyTmFtZTogc3RyaW5nLFxuICAgIGhhbmRsZXI6IFZpZXdPYnNlcnZhYmxlSGFuZGxlclR5cGUsXG4gICk6IHZvaWQge1xuICAgIHRoaXMuX2hhbmRsZXJNYXBbc3Vic2NyaWJlck5hbWVdID0gaGFuZGxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgT2JzZXJ2ZUhlbHBlckludGVyZmFjZS5vZmZDaGFuZ2V9XG4gICAqL1xuICBwdWJsaWMgb2ZmQ2hhbmdlKHN1YnNjcmliZXJOYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBkZWxldGUgdGhpcy5faGFuZGxlck1hcFtzdWJzY3JpYmVyTmFtZV07XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIE9ic2VydmVIZWxwZXJJbnRlcmZhY2UucHJvY2Vzc1dpdGhNdXRlSGFuZGxlcnN9XG4gICAqL1xuICBwdWJsaWMgcHJvY2Vzc1dpdGhNdXRlSGFuZGxlcnMoXG4gICAgZXh0cmE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCA9IG51bGwsXG4gICk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLndpdGhNdXRlSGFuZGxlcnMoKG11dGVkQmVmb3JlOiBib29sZWFuKSA9PiB0aGlzLnByb2Nlc3NIYW5kbGVycyhtdXRlZEJlZm9yZSwgZXh0cmEpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgT2JzZXJ2ZUhlbHBlckludGVyZmFjZS53aXRoTXV0ZUhhbmRsZXJzfVxuICAgKi9cbiAgcHVibGljIHdpdGhNdXRlSGFuZGxlcnMoXG4gICAgYWN0aW9uOiAobXV0ZWRCZWZvcmU6IGJvb2xlYW4sIG1hbmFnZXI6IE9ic2VydmVIZWxwZXJJbnRlcmZhY2UpID0+IHZvaWQsXG4gICk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9tdXRlSGFuZGxlcnMpIHtcbiAgICAgIGFjdGlvbih0cnVlLCB0aGlzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbXV0ZUhhbmRsZXJzID0gdHJ1ZTtcbiAgICAgIGFjdGlvbihmYWxzZSwgdGhpcyk7XG4gICAgICB0aGlzLl9tdXRlSGFuZGxlcnMgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgT2JzZXJ2ZUhlbHBlckludGVyZmFjZS5wcm9jZXNzSGFuZGxlcnN9XG4gICAqL1xuICBwdWJsaWMgcHJvY2Vzc0hhbmRsZXJzKFxuICAgIGlzTXV0ZWQ6IGJvb2xlYW4sXG4gICAgZXh0cmE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCA9IG51bGwsXG4gICk6IGJvb2xlYW4ge1xuICAgIGlmICghaXNNdXRlZCkge1xuICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLl9oYW5kbGVyTWFwKVxuICAgICAgICAuZm9yRWFjaCgoaGFuZGxlcikgPT4gaGFuZGxlcih0aGlzLCBleHRyYSkpO1xuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBEcmF3YWJsZUludGVyZmFjZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBDaGVja3MgaWYgaXRlbSBpcyBpbnN0YW5jZSBvZiBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2VcbiAqIEBzZWUgUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlXG4gKiBAcGFyYW0gaXRlbSAtIGl0ZW0gdG8gY2hlY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzUG9zaXRpb25hbChpdGVtOiBEcmF3YWJsZUludGVyZmFjZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gJ2lzUG9zaXRpb25hbCcgaW4gaXRlbTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgaXRlbSBpcyBpbnN0YW5jZSBvZiBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2VcbiAqIEBzZWUgRHJhd2FibGVMYXllckludGVyZmFjZVxuICogQHBhcmFtIGl0ZW0gLSBpdGVtIHRvIGNoZWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0xheWVyKGl0ZW06IERyYXdhYmxlSW50ZXJmYWNlKTogYm9vbGVhbiB7XG4gIHJldHVybiAnaXNMYXllcicgaW4gaXRlbTtcbn1cbiIsImltcG9ydCB7IFZlY3RvckFycmF5VHlwZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IEJvdW5kSW50ZXJmYWNlLCBQb2x5Z29uYWxCb3VuZENvbmZpZyB9IGZyb20gJy4uLy4uL3R5cGVzL2JvdW5kJztcbmltcG9ydCB7IGNyZWF0ZVBvbHlnb25WZWN0b3JzIH0gZnJvbSAnLi4vdmVjdG9yJztcblxuLyoqXG4gKiBQb2x5Z29uYWxCb3VuZCBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb2x5Z29uYWxCb3VuZCBpbXBsZW1lbnRzIEJvdW5kSW50ZXJmYWNlIHtcbiAgLyoqXG4gICAqIEJvdW5kIGNvbmZpZ1xuICAgKi9cbiAgcHJvdGVjdGVkIF9jb25maWc6IFBvbHlnb25hbEJvdW5kQ29uZmlnO1xuXG4gIC8qKlxuICAgKiBSZWN0YW5ndWxhckJvdW5kIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBjb25maWcgLSBib3VuZCBjb25maWdcbiAgICovXG4gIGNvbnN0cnVjdG9yKGNvbmZpZzogUG9seWdvbmFsQm91bmRDb25maWcpIHtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIEJvdW5kSW50ZXJmYWNlLmluY2x1ZGVzfVxuICAgKi9cbiAgaW5jbHVkZXMoY29vcmRzOiBWZWN0b3JBcnJheVR5cGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBwcmVjaXNpb24gPSAwO1xuICAgIGNvbnN0IHggPSBjb29yZHNbMF07XG4gICAgY29uc3QgeSA9IGNvb3Jkc1sxXTtcbiAgICBsZXQgaXNJbnNpZGUgPSBmYWxzZTtcblxuICAgIGNvbnN0IHBvbHlnb25WZWN0b3JzID0gY3JlYXRlUG9seWdvblZlY3RvcnModGhpcy5fY29uZmlnLnBvaW50cyk7XG5cbiAgICBmb3IgKGNvbnN0IHZlY3RvciBvZiBwb2x5Z29uVmVjdG9ycykge1xuICAgICAgaWYgKHZlY3Rvci5pbmNsdWRlcyhjb29yZHMsIHByZWNpc2lvbikpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IFt4aiwgeWpdID0gdmVjdG9yLnBvc2l0aW9uLnRvQXJyYXkoKTtcbiAgICAgIGNvbnN0IFt4aSwgeWldID0gdmVjdG9yLnRhcmdldC50b0FycmF5KCk7XG5cbiAgICAgIGNvbnN0IGlzSW50ZXJzZWN0ID0gKCh5aSA+IHkpICE9PSAoeWogPiB5KSkgJiZcbiAgICAgICAgKHggPCAoeGogLSB4aSkgKiAoeSAtIHlpKSAvICh5aiAtIHlpKSArIHhpKTtcblxuICAgICAgaWYgKGlzSW50ZXJzZWN0KSB7XG4gICAgICAgIGlzSW5zaWRlID0gIWlzSW5zaWRlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpc0luc2lkZTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgQm91bmRJbnRlcmZhY2UuaXNOZWFyRWRnZX1cbiAgICovXG4gIGlzTmVhckVkZ2UoY29vcmRzOiBWZWN0b3JBcnJheVR5cGUsIGRldmlhdGlvbjogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgY29uc3QgdmVjdG9ycyA9IGNyZWF0ZVBvbHlnb25WZWN0b3JzKHRoaXMuX2NvbmZpZy5wb2ludHMpO1xuXG4gICAgZm9yIChjb25zdCB2ZWN0b3Igb2YgdmVjdG9ycykge1xuICAgICAgaWYgKHZlY3Rvci5nZXREaXN0YW5jZVZlY3Rvcihjb29yZHMpLmxlbmd0aCA8PSBkZXZpYXRpb24pIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVmVjdG9yQXJyYXlUeXBlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgQm91bmRJbnRlcmZhY2UsIFJlY3Rhbmd1bGFyQm91bmRDb25maWcgfSBmcm9tICcuLi8uLi90eXBlcy9ib3VuZCc7XG5pbXBvcnQgeyBjcmVhdGVQb2x5Z29uVmVjdG9ycyB9IGZyb20gJy4uL3ZlY3Rvcic7XG5cbi8qKlxuICogUmVjdGFuZ3VsYXJCb3VuZCBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5ndWxhckJvdW5kIGltcGxlbWVudHMgQm91bmRJbnRlcmZhY2Uge1xuICAvKipcbiAgICogQm91bmQgY29uZmlnXG4gICAqL1xuICBwcm90ZWN0ZWQgX2NvbmZpZzogUmVjdGFuZ3VsYXJCb3VuZENvbmZpZztcblxuICAvKipcbiAgICogUmVjdGFuZ3VsYXJCb3VuZCBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gY29uZmlnIC0gYm91bmQgY29uZmlnXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihjb25maWc6IFJlY3Rhbmd1bGFyQm91bmRDb25maWcpIHtcbiAgICB0aGlzLl9jb25maWcgPSBjb25maWc7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIEJvdW5kSW50ZXJmYWNlLmluY2x1ZGVzfVxuICAgKi9cbiAgaW5jbHVkZXMoY29vcmRzOiBWZWN0b3JBcnJheVR5cGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gY29vcmRzWzBdID49IHRoaXMuX2NvbmZpZy5wb3NpdGlvblswXVxuICAgICAgJiYgY29vcmRzWzBdIDw9IHRoaXMuX2NvbmZpZy5wb3NpdGlvblswXSArIHRoaXMuX2NvbmZpZy5zaXplWzBdXG4gICAgICAmJiBjb29yZHNbMV0gPj0gdGhpcy5fY29uZmlnLnBvc2l0aW9uWzFdXG4gICAgICAmJiBjb29yZHNbMV0gPD0gdGhpcy5fY29uZmlnLnBvc2l0aW9uWzFdICsgdGhpcy5fY29uZmlnLnNpemVbMV07XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIEJvdW5kSW50ZXJmYWNlLmlzTmVhckVkZ2V9XG4gICAqL1xuICBpc05lYXJFZGdlKGNvb3JkczogVmVjdG9yQXJyYXlUeXBlLCBkZXZpYXRpb246IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IHZlY3RvcnMgPSBjcmVhdGVQb2x5Z29uVmVjdG9ycyhbXG4gICAgICBbdGhpcy5fY29uZmlnLnBvc2l0aW9uWzBdLCB0aGlzLl9jb25maWcucG9zaXRpb25bMV1dLFxuICAgICAgW3RoaXMuX2NvbmZpZy5wb3NpdGlvblswXSArIHRoaXMuX2NvbmZpZy5zaXplWzBdLCB0aGlzLl9jb25maWcucG9zaXRpb25bMV1dLFxuICAgICAgW3RoaXMuX2NvbmZpZy5wb3NpdGlvblswXSArIHRoaXMuX2NvbmZpZy5zaXplWzBdLCB0aGlzLl9jb25maWcucG9zaXRpb25bMV0gKyB0aGlzLl9jb25maWcuc2l6ZVsxXV0sXG4gICAgICBbdGhpcy5fY29uZmlnLnBvc2l0aW9uWzBdLCB0aGlzLl9jb25maWcucG9zaXRpb25bMV0gKyB0aGlzLl9jb25maWcuc2l6ZVsxXV0sXG4gICAgXSk7XG5cbiAgICBmb3IgKGNvbnN0IHZlY3RvciBvZiB2ZWN0b3JzKSB7XG4gICAgICBpZiAodmVjdG9yLmdldERpc3RhbmNlVmVjdG9yKGNvb3JkcykubGVuZ3RoIDw9IGRldmlhdGlvbikge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBEcmF3YWJsZUdyb3VwSW50ZXJmYWNlLFxuICBEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZSxcbiAgRHJhd2FibGVJbnRlcmZhY2UsXG4gIERyYXdhYmxlSWRUeXBlLFxuICBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2UsXG4gIERyYXdlckludGVyZmFjZSxcbiAgTGlua2VkRGF0YVR5cGUsXG59IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBEcmF3YWJsZSBmcm9tICcuLi9kcmF3YWJsZS9kcmF3YWJsZSc7XG5pbXBvcnQgRHJhd2FibGVTdG9yYWdlIGZyb20gJy4uL2RyYXdhYmxlL2RyYXdhYmxlLXN0b3JhZ2UnO1xuXG4vKipcbiAqIERyYXdhYmxlIGdyb3VwIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdhYmxlR3JvdXAgZXh0ZW5kcyBEcmF3YWJsZSBpbXBsZW1lbnRzIERyYXdhYmxlR3JvdXBJbnRlcmZhY2Uge1xuICAvKipcbiAgICogTmFtZSBvZiBjbGFzcyB0byB1c2UgYXMgc3Vic2NyaWJlciBuYW1lIGluIG9ic2VydmFibGUgbG9naWNcbiAgICovXG4gIHByb3RlY3RlZCBfc3Vic2NyaWJlck5hbWU6IHN0cmluZyA9ICdEcmF3YWJsZUdyb3VwJztcbiAgLyoqXG4gICAqIFN0b3JhZ2Ugb2YgdGhlIGNoaWxkcmVuIG9iamVjdHNcbiAgICovXG4gIHByb3RlY3RlZCBfc3RvcmFnZTogRHJhd2FibGVTdG9yYWdlSW50ZXJmYWNlO1xuXG4gIC8qKlxuICAgKiBEcmF3YWJsZUdyb3VwIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBpZCAtIGdyb3VwIElEXG4gICAqIEBwYXJhbSBjb25maWcgLSBjb25maWdcbiAgICogQHBhcmFtIGRhdGEgLSBleHRyYSBkYXRhXG4gICAqIEBwYXJhbSBjaGlsZHJlbiAtIGNoaWxkcmVuIG9mIGdyb3VwZWQgb2JqZWN0c1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgaWQ6IERyYXdhYmxlSWRUeXBlLFxuICAgIGNvbmZpZzogRHJhd2FibGVDb25maWdJbnRlcmZhY2UsXG4gICAgZGF0YTogTGlua2VkRGF0YVR5cGUgPSB7fSxcbiAgICBjaGlsZHJlbjogRHJhd2FibGVJbnRlcmZhY2VbXSA9IFtdLFxuICApIHtcbiAgICBzdXBlcihpZCwgY29uZmlnLCBkYXRhKTtcblxuICAgIHRoaXMuX3N0b3JhZ2UgPSBuZXcgRHJhd2FibGVTdG9yYWdlKHRoaXMuX3Byb2Nlc3NDaGlsZHJlblRvR3JvdXAoY2hpbGRyZW4pKTtcbiAgICB0aGlzLl9zdG9yYWdlLm9uVmlld0NoYW5nZSh0aGlzLl9zdWJzY3JpYmVyTmFtZSwgKHRhcmdldCwgZXh0cmEpID0+IHtcbiAgICAgIHRoaXMuX29ic2VydmVIZWxwZXIucHJvY2Vzc1dpdGhNdXRlSGFuZGxlcnMoZXh0cmEpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZUludGVyZmFjZS5kcmF3fVxuICAgKi9cbiAgcHVibGljIGRyYXcoZHJhd2VyOiBEcmF3ZXJJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICB0aGlzLl9zdG9yYWdlLmxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGl0ZW0uY29uZmlnLnZpc2libGUpIHtcbiAgICAgICAgaXRlbS5kcmF3KGRyYXdlcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlSW50ZXJmYWNlLmRlc3RydWN0fVxuICAgKi9cbiAgcHVibGljIGRlc3RydWN0KCk6IERyYXdhYmxlSW50ZXJmYWNlW10ge1xuICAgIHRoaXMuX3N0b3JhZ2UubGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLm9mZlZpZXdDaGFuZ2UodGhpcy5fc3Vic2NyaWJlck5hbWUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXMuX3Byb2Nlc3NDaGlsZHJlblRvVW5ncm91cCh0aGlzLmNoaWxkcmVuKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0IGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBjaGlsZHJlbigpOiBEcmF3YWJsZUludGVyZmFjZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5saXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIFNvbWUgYWN0aW9ucyB3aXRoIGNoaWxkcmVuIGJlZm9yZSBncm91cGluZ1xuICAgKi9cbiAgcHJvdGVjdGVkIF9wcm9jZXNzQ2hpbGRyZW5Ub0dyb3VwKGNoaWxkcmVuOiBEcmF3YWJsZUludGVyZmFjZVtdKTogRHJhd2FibGVJbnRlcmZhY2VbXSB7XG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG5cbiAgLyoqXG4gICAqIFNvbWUgYWN0aW9ucyB3aXRoIGNoaWxkcmVuIGJlZm9yZSB1bmdyb3VwaW5nXG4gICAqL1xuICBwcm90ZWN0ZWQgX3Byb2Nlc3NDaGlsZHJlblRvVW5ncm91cChjaGlsZHJlbjogRHJhd2FibGVJbnRlcmZhY2VbXSk6IERyYXdhYmxlSW50ZXJmYWNlW10ge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRHJhd2FibGVJZFR5cGUsXG4gIERyYXdhYmxlSW50ZXJmYWNlLFxuICBEcmF3YWJsZUxheWVyQ29uZmlnSW50ZXJmYWNlLFxuICBEcmF3YWJsZUxheWVySW50ZXJmYWNlLFxuICBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2UsXG4gIExpbmtlZERhdGFUeXBlLFxufSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgRHJhd2FibGVHcm91cCBmcm9tICcuL2RyYXdhYmxlLWdyb3VwJztcbmltcG9ydCBEcmF3YWJsZVN0b3JhZ2UgZnJvbSAnLi9kcmF3YWJsZS1zdG9yYWdlJztcblxuLyoqXG4gKiBEcmF3YWJsZUxheWVyIGNsYXNzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYXdhYmxlTGF5ZXIgZXh0ZW5kcyBEcmF3YWJsZUdyb3VwIGltcGxlbWVudHMgRHJhd2FibGVMYXllckludGVyZmFjZSB7XG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVMYXllckludGVyZmFjZS5pc0xheWVyfVxuICAgKi9cbiAgcHVibGljIGlzTGF5ZXI6IHRydWUgPSB0cnVlO1xuICAvKipcbiAgICogVmlldyBjb25maWdcbiAgICovXG4gIHByb3RlY3RlZCBfY29uZmlnOiBEcmF3YWJsZUxheWVyQ29uZmlnSW50ZXJmYWNlO1xuXG4gIC8qKlxuICAgKiBEcmF3YWJsZUxheWVyIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBpZCAtIGdyb3VwIElEXG4gICAqIEBwYXJhbSBjb25maWcgLSBjb25maWdcbiAgICogQHBhcmFtIGRhdGEgLSBleHRyYSBkYXRhXG4gICAqIEBwYXJhbSBjaGlsZHJlbiAtIGNoaWxkcmVuIG9mIGdyb3VwZWQgb2JqZWN0c1xuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgaWQ6IERyYXdhYmxlSWRUeXBlLFxuICAgIGNvbmZpZzogRHJhd2FibGVMYXllckNvbmZpZ0ludGVyZmFjZSxcbiAgICBkYXRhOiBMaW5rZWREYXRhVHlwZSA9IHt9LFxuICAgIGNoaWxkcmVuOiBEcmF3YWJsZUludGVyZmFjZVtdID0gW10sXG4gICkge1xuICAgIHN1cGVyKGlkLCBjb25maWcsIGRhdGEpO1xuXG4gICAgdGhpcy5fc3RvcmFnZSA9IG5ldyBEcmF3YWJsZVN0b3JhZ2UodGhpcy5fcHJvY2Vzc0NoaWxkcmVuVG9Hcm91cChjaGlsZHJlbikpO1xuICAgIHRoaXMuX3N0b3JhZ2Uub25WaWV3Q2hhbmdlKHRoaXMuX3N1YnNjcmliZXJOYW1lLCAodGFyZ2V0LCBleHRyYSkgPT4ge1xuICAgICAgdGhpcy5fb2JzZXJ2ZUhlbHBlci5wcm9jZXNzV2l0aE11dGVIYW5kbGVycyhleHRyYSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogY29uZmlnIGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBjb25maWcoKTogRHJhd2FibGVMYXllckNvbmZpZ0ludGVyZmFjZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVMYXllckludGVyZmFjZS5zdG9yYWdlfVxuICAgKi9cbiAgcHVibGljIGdldCBzdG9yYWdlKCk6IERyYXdhYmxlU3RvcmFnZUludGVyZmFjZSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2U7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZSxcbiAgRHJhd2FibGVJbnRlcmZhY2UsXG4gIERyYXdhYmxlSWRUeXBlLFxuICBEcmF3YWJsZVN0b3JhZ2VGaWx0ZXJDYWxsYmFja1R5cGUsXG4gIERyYXdhYmxlU3RvcmFnZUZpbHRlckNvbmZpZ0ludGVyZmFjZSxcbiAgUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlLFxuICBQb3NpdGlvbmFsRHJhd2FibGVDb25maWdJbnRlcmZhY2UsXG4gIE9ic2VydmVIZWxwZXJJbnRlcmZhY2UsXG4gIFZpZXdPYnNlcnZhYmxlSGFuZGxlclR5cGUsXG4gIFZlY3RvckFycmF5VHlwZSxcbiAgUG9zaXRpb25hbENvbnRleHRJbnRlcmZhY2UsIERyYXdhYmxlTGF5ZXJJbnRlcmZhY2UsXG59IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBPYnNlcnZlSGVscGVyIGZyb20gJy4uLy4uL2hlbHBlcnMvb2JzZXJ2ZS1oZWxwZXInO1xuaW1wb3J0IERyYXdhYmxlR3JvdXAgZnJvbSAnLi4vZHJhd2FibGUvZHJhd2FibGUtZ3JvdXAnO1xuaW1wb3J0IHsgZ2V0TWF4UG9zaXRpb24sIGdldE1pblBvc2l0aW9uIH0gZnJvbSAnLi4vLi4vaGVscGVycy9iYXNlJztcbmltcG9ydCB7IGNyZWF0ZVZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvcic7XG5pbXBvcnQgUG9zaXRpb25hbERyYXdhYmxlR3JvdXAgZnJvbSAnLi4vZHJhd2FibGUvcG9zaXRpb25hbC1kcmF3YWJsZS1ncm91cCc7XG5pbXBvcnQgeyBpc0xheWVyLCBpc1Bvc2l0aW9uYWwgfSBmcm9tICcuLi8uLi9oZWxwZXJzL3R5cGUtaGVscGVycyc7XG5pbXBvcnQgUG9zaXRpb25hbENvbnRleHQgZnJvbSAnLi9wb3NpdGlvbmFsLWNvbnRleHQnO1xuaW1wb3J0IERyYXdhYmxlTGF5ZXIgZnJvbSAnLi9kcmF3YWJsZS1sYXllcic7XG5cbi8qKlxuICogU3RvcmFnZSBmb3IgZHJhd2FibGUgb2JqZWN0c1xuICogQHB1YmxpY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEcmF3YWJsZVN0b3JhZ2UgaW1wbGVtZW50cyBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2Uge1xuICAvKipcbiAgICogTmFtZSBvZiBjbGFzcyB0byB1c2UgYXMgc3Vic2NyaWJlciBuYW1lIGluIG9ic2VydmFibGUgbG9naWNcbiAgICovXG4gIHByb3RlY3RlZCBfc3Vic2NyaWJlck5hbWU6IHN0cmluZyA9ICdEcmF3YWJsZVN0b3JhZ2UnO1xuICAvKipcbiAgICogTGlzdCBvZiBzdG9yZWQgZHJhd2FibGUgb2JqZWN0c1xuICAgKi9cbiAgcHJvdGVjdGVkIF9saXN0OiBEcmF3YWJsZUludGVyZmFjZVtdID0gW107XG4gIC8qKlxuICAgKiBIZWxwZXIgZm9yIG9ic2VydmFibGUgbG9naWNcbiAgICovXG4gIHByb3RlY3RlZCBfb2JzZXJ2ZUhlbHBlcjogT2JzZXJ2ZUhlbHBlckludGVyZmFjZTtcblxuICAvKipcbiAgICogRHJhd2FibGUgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIGl0ZW1zIC0gYmF0Y2ggY2hpbGRyZW4gdG8gY2FjaGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKGl0ZW1zOiBEcmF3YWJsZUludGVyZmFjZVtdKSB7XG4gICAgdGhpcy5fb2JzZXJ2ZUhlbHBlciA9IG5ldyBPYnNlcnZlSGVscGVyKCk7XG4gICAgdGhpcy5hZGRCYXRjaChpdGVtcyk7XG4gICAgdGhpcy5fc29ydCgpO1xuXG4gICAgdGhpcy5vblZpZXdDaGFuZ2UodGhpcy5fc3Vic2NyaWJlck5hbWUsICh0YXJnZXQsIGV4dHJhKSA9PiB7XG4gICAgICBpZiAoZXh0cmEgIT09IG51bGwgJiYgZXh0cmEuaGFzT3duUHJvcGVydHkoJ3pJbmRleENoYW5nZWQnKSAmJiBleHRyYS56SW5kZXhDaGFuZ2VkKSB7XG4gICAgICAgIHRoaXMuX3NvcnQoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZWQgZHJhd2FibGUgb2JqZWN0cyBjaGlsZHJlbiBnZXR0ZXJcbiAgICovXG4gIGdldCBsaXN0KCk6IERyYXdhYmxlSW50ZXJmYWNlW10ge1xuICAgIHJldHVybiB0aGlzLl9saXN0O1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2UuY2FjaGV9XG4gICAqL1xuICBwdWJsaWMgYWRkKGl0ZW06IERyYXdhYmxlSW50ZXJmYWNlKTogdm9pZCB7XG4gICAgaXRlbS5vblZpZXdDaGFuZ2UoXG4gICAgICB0aGlzLl9zdWJzY3JpYmVyTmFtZSxcbiAgICAgICh0YXJnZXQsIGV4dHJhKSA9PiB0aGlzLl9vYnNlcnZlSGVscGVyLnByb2Nlc3NXaXRoTXV0ZUhhbmRsZXJzKGV4dHJhKSxcbiAgICApO1xuICAgIHRoaXMuX2xpc3QucHVzaChpdGVtKTtcbiAgICB0aGlzLl9zb3J0KCk7XG4gICAgdGhpcy5fb2JzZXJ2ZUhlbHBlci5wcm9jZXNzV2l0aE11dGVIYW5kbGVycygpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2UuY2FjaGV9XG4gICAqL1xuICBwdWJsaWMgYWRkQmF0Y2goaXRlbXM6IERyYXdhYmxlSW50ZXJmYWNlW10pOiB2b2lkIHtcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLm9uVmlld0NoYW5nZShcbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlck5hbWUsXG4gICAgICAgICh0YXJnZXQsIGV4dHJhKSA9PiB0aGlzLl9vYnNlcnZlSGVscGVyLnByb2Nlc3NXaXRoTXV0ZUhhbmRsZXJzKGV4dHJhKSxcbiAgICAgICk7XG4gICAgICB0aGlzLl9saXN0LnB1c2goaXRlbSk7XG4gICAgfSk7XG4gICAgdGhpcy5fc29ydCgpO1xuICAgIHRoaXMuX29ic2VydmVIZWxwZXIucHJvY2Vzc1dpdGhNdXRlSGFuZGxlcnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIG9iamVjdHMgZm91bmQgYnkgY29uZmlnIGZyb20gc3RvcmFnZVxuICAgKiBAcGFyYW0gY29uZmlnIC0gZmlsdGVyIGNvbmZpZ1xuICAgKi9cbiAgcHVibGljIGRlbGV0ZShjb25maWc6IERyYXdhYmxlU3RvcmFnZUZpbHRlckNvbmZpZ0ludGVyZmFjZSk6IERyYXdhYmxlSW50ZXJmYWNlW10ge1xuICAgIGNvbnN0IHJlc3VsdDogRHJhd2FibGVJbnRlcmZhY2VbXSA9IFtdO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZUhlbHBlci53aXRoTXV0ZUhhbmRsZXJzKCgpID0+IHtcbiAgICAgIHRoaXMuZmluZChjb25maWcpLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgcmVzdWx0LnB1c2godGhpcy5kZWxldGVCeUlkKGl0ZW0uaWQpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZUhlbHBlci5wcm9jZXNzV2l0aE11dGVIYW5kbGVycygpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBvYmplY3QgYnkgSUQgZnJvbSBzdG9yYWdlXG4gICAqIEBwYXJhbSBpZCAtIG9iamVjdCBJRFxuICAgKi9cbiAgcHVibGljIGRlbGV0ZUJ5SWQoaWQ6IERyYXdhYmxlSWRUeXBlKTogRHJhd2FibGVJbnRlcmZhY2Uge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fbGlzdC5maW5kSW5kZXgoKGl0ZW0pID0+IGl0ZW0uaWQgPT09IGlkKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGNvbnN0IGRlbGV0ZWRJdGVtID0gdGhpcy5fbGlzdC5zcGxpY2UoaW5kZXgsIDEpWzBdO1xuICAgICAgZGVsZXRlZEl0ZW0ub2ZmVmlld0NoYW5nZSh0aGlzLl9zdWJzY3JpYmVyTmFtZSk7XG4gICAgICB0aGlzLl9vYnNlcnZlSGVscGVyLnByb2Nlc3NXaXRoTXV0ZUhhbmRsZXJzKCk7XG4gICAgICByZXR1cm4gZGVsZXRlZEl0ZW07XG4gICAgfVxuXG4gICAgLy8gVE9ETyBjdXN0b21pemUgZXhjZXB0aW9uXG4gICAgdGhyb3cgbmV3IEVycm9yKGBjYW5ub3QgZmluZCBvYmplY3Qgd2l0aCBpZCAnJHtpZH0nYCk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5jbGVhcn1cbiAgICovXG4gIGNsZWFyKCk6IHZvaWQge1xuICAgIHRoaXMuX2xpc3QubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9vYnNlcnZlSGVscGVyLnByb2Nlc3NXaXRoTXV0ZUhhbmRsZXJzKCk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5maW5kfVxuICAgKi9cbiAgcHVibGljIGZpbmQoY29uZmlnOiBEcmF3YWJsZVN0b3JhZ2VGaWx0ZXJDb25maWdJbnRlcmZhY2UpOiBEcmF3YWJsZUludGVyZmFjZVtdIHtcbiAgICByZXR1cm4gdGhpcy5fZmluZCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGNvbmZpZy5pZHNPbmx5ICYmIGNvbmZpZy5pZHNPbmx5LmluZGV4T2YoaXRlbS5pZCkgPT09IC0xKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChjb25maWcuaWRzRXhjbHVkZSAmJiBjb25maWcuaWRzRXhjbHVkZS5pbmRleE9mKGl0ZW0uaWQpICE9PSAtMSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChjb25maWcudHlwZXNPbmx5ICYmIGNvbmZpZy50eXBlc09ubHkuaW5kZXhPZihpdGVtLnR5cGUpID09PSAtMSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoY29uZmlnLnR5cGVzRXhjbHVkZSAmJiBjb25maWcudHlwZXNFeGNsdWRlLmluZGV4T2YoaXRlbS50eXBlKSAhPT0gLTEpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gIShjb25maWcuZXh0cmFGaWx0ZXIgJiYgIWNvbmZpZy5leHRyYUZpbHRlcihpdGVtKSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5maW5kQnlJZH1cbiAgICovXG4gIHB1YmxpYyBmaW5kQnlJZChpZDogRHJhd2FibGVJZFR5cGUpOiBEcmF3YWJsZUludGVyZmFjZSB7XG4gICAgY29uc3QgZm91bmRJdGVtcyA9IHRoaXMuX2ZpbmQoKGNhbmRpZGF0ZSkgPT4gY2FuZGlkYXRlLmlkID09PSBpZCk7XG4gICAgaWYgKGZvdW5kSXRlbXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZm91bmRJdGVtc1swXTtcbiAgICB9XG4gICAgLy8gVE9ETyBjdXN0b21pemUgZXhjZXB0aW9uXG4gICAgdGhyb3cgbmV3IEVycm9yKGBjYW5ub3QgZmluZCBvYmplY3Qgd2l0aCBpZCAnJHtpZH0nYCk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5maW5kQnlQb3NpdGlvbn1cbiAgICovXG4gIHB1YmxpYyBmaW5kQnlQb3NpdGlvbihjb29yZHM6IFZlY3RvckFycmF5VHlwZSk6IFBvc2l0aW9uYWxDb250ZXh0SW50ZXJmYWNlIHtcbiAgICBmb3IgKGxldCBpPXRoaXMuX2xpc3QubGVuZ3RoLTE7IGk+PTA7IC0taSkge1xuICAgICAgY29uc3QgaXRlbTogRHJhd2FibGVJbnRlcmZhY2UgPSB0aGlzLl9saXN0W2ldO1xuXG4gICAgICAvLyBUT0RPIG1heWJlIG9ubHkgdmlzaWJsZT9cbiAgICAgIGlmIChpc0xheWVyKGl0ZW0pKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSAoaXRlbSBhcyBEcmF3YWJsZUxheWVyKS5zdG9yYWdlLmZpbmRCeVBvc2l0aW9uKGNvb3Jkcyk7XG4gICAgICAgIGlmICghY29udGV4dC5pc0VtcHR5KCkpIHtcbiAgICAgICAgICByZXR1cm4gY29udGV4dDtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChpc1Bvc2l0aW9uYWwoaXRlbSkgJiYgKGl0ZW0gYXMgUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlKS5ib3VuZEluY2x1ZGVzKGNvb3JkcykpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IChpdGVtIGFzIFBvc2l0aW9uYWxEcmF3YWJsZUludGVyZmFjZSk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZWxlbWVudC5nZXRSZWxhdGl2ZVBvc2l0aW9uKGNvb3Jkcyk7XG4gICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25hbENvbnRleHQoZWxlbWVudCwgcG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUG9zaXRpb25hbENvbnRleHQobnVsbCwgbnVsbCk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5maW5kQnlOZWFyRWRnZVBvc2l0aW9ufVxuICAgKi9cbiAgZmluZEJ5TmVhckVkZ2VQb3NpdGlvbihjb29yZHM6IFZlY3RvckFycmF5VHlwZSwgZGV2aWF0aW9uOiBudW1iZXIpOiBQb3NpdGlvbmFsQ29udGV4dEludGVyZmFjZSB7XG4gICAgY29uc3QgcG9zaXRpb25Db250ZXh0ID0gdGhpcy5maW5kQnlQb3NpdGlvbihjb29yZHMpO1xuXG4gICAgZm9yIChsZXQgaT10aGlzLl9saXN0Lmxlbmd0aC0xOyBpPj0wOyAtLWkpIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9saXN0W2ldO1xuXG4gICAgICAvLyBUT0RPIG1heWJlIG9ubHkgdmlzaWJsZT9cbiAgICAgIGlmIChpc0xheWVyKGl0ZW0pKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSAoaXRlbSBhcyBEcmF3YWJsZUxheWVyKS5zdG9yYWdlLmZpbmRCeU5lYXJFZGdlUG9zaXRpb24oY29vcmRzLCBkZXZpYXRpb24pO1xuICAgICAgICBpZiAoIWNvbnRleHQuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgIGlzUG9zaXRpb25hbChpdGVtKVxuICAgICAgICAmJiAoaXRlbSBhcyBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2UpLmlzTmVhckJvdW5kRWRnZShjb29yZHMsIGRldmlhdGlvbilcbiAgICAgICAgJiYgKHBvc2l0aW9uQ29udGV4dC5pc0VtcHR5KCkgfHwgcG9zaXRpb25Db250ZXh0LmVsZW1lbnQgPT09IGl0ZW0pXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IChpdGVtIGFzIFBvc2l0aW9uYWxEcmF3YWJsZUludGVyZmFjZSk7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZWxlbWVudC5nZXRSZWxhdGl2ZVBvc2l0aW9uKGNvb3Jkcyk7XG4gICAgICAgIHJldHVybiBuZXcgUG9zaXRpb25hbENvbnRleHQoZWxlbWVudCwgcG9zaXRpb24pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXcgUG9zaXRpb25hbENvbnRleHQobnVsbCwgbnVsbCk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5ncm91cH1cbiAgICovXG4gIHB1YmxpYyBncm91cChpZHM6IERyYXdhYmxlSWRUeXBlW10pOiBEcmF3YWJsZUdyb3VwIHtcbiAgICBjb25zdCBncm91cEl0ZW1zID0gdGhpcy5kZWxldGUoeyBpZHNPbmx5OiBpZHMgfSkgYXMgUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlW107XG4gICAgY29uc3QgbWluUG9zaXRpb24gPSBnZXRNaW5Qb3NpdGlvbihncm91cEl0ZW1zLm1hcCgoaXRlbSkgPT4gaXRlbS5jb25maWcucG9zaXRpb24pKTtcbiAgICBjb25zdCBtYXhQb3NpdGlvbiA9IGdldE1heFBvc2l0aW9uKGdyb3VwSXRlbXMubWFwKChpdGVtKSA9PiB7XG4gICAgICByZXR1cm4gY3JlYXRlVmVjdG9yKGl0ZW0uY29uZmlnLnBvc2l0aW9uKVxuICAgICAgICAuYWRkKGNyZWF0ZVZlY3RvcihpdGVtLmNvbmZpZy5zaXplKSlcbiAgICAgICAgLnRvQXJyYXkoKTtcbiAgICB9KSk7XG4gICAgY29uc3QgZ3JvdXBTaXplID0gY3JlYXRlVmVjdG9yKG1heFBvc2l0aW9uKS5zdWIoY3JlYXRlVmVjdG9yKG1pblBvc2l0aW9uKSkudG9BcnJheSgpO1xuICAgIGNvbnN0IGdyb3VwWkluZGV4ID0gTWF0aC5tYXgoLi4uZ3JvdXBJdGVtcy5tYXAoKGl0ZW0pID0+IGl0ZW0uY29uZmlnLnpJbmRleCkpKzE7XG5cbiAgICBjb25zdCBjb25maWc6IFBvc2l0aW9uYWxEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZSA9IHtcbiAgICAgIHBvc2l0aW9uOiBtaW5Qb3NpdGlvbixcbiAgICAgIHNpemU6IGdyb3VwU2l6ZSxcbiAgICAgIHpJbmRleDogZ3JvdXBaSW5kZXgsXG4gICAgICB2aXNpYmxlOiB0cnVlLFxuICAgIH07XG5cbiAgICBjb25zdCBncm91cElkID0gJ2dyb3VwLScrKG5ldyBEYXRlKCkpLmdldFRpbWUoKSsnLScrTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMDAwMCk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgUG9zaXRpb25hbERyYXdhYmxlR3JvdXAoZ3JvdXBJZCwgY29uZmlnLCB7fSwgZ3JvdXBJdGVtcyk7XG4gICAgdGhpcy5hZGQoZ3JvdXApO1xuXG4gICAgcmV0dXJuIGdyb3VwO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2UudW5ncm91cH1cbiAgICovXG4gIHB1YmxpYyB1bmdyb3VwKGdyb3VwSWQ6IERyYXdhYmxlSWRUeXBlKTogdm9pZCB7XG4gICAgY29uc3QgZ3JvdXA6IERyYXdhYmxlR3JvdXAgPSB0aGlzLmRlbGV0ZUJ5SWQoZ3JvdXBJZCkgYXMgRHJhd2FibGVHcm91cDtcbiAgICB0aGlzLmFkZEJhdGNoKGdyb3VwLmRlc3RydWN0KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZVN0b3JhZ2VJbnRlcmZhY2UuYWRkTGF5ZXJ9XG4gICAqL1xuICBwdWJsaWMgYWRkTGF5ZXIoaWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBjaGlsZHJlbjogRHJhd2FibGVJbnRlcmZhY2VbXSA9IFtdKTogRHJhd2FibGVMYXllckludGVyZmFjZSB7XG4gICAgY29uc3QgbGF5ZXIgPSBuZXcgRHJhd2FibGVMYXllcihpZCwge1xuICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgIHpJbmRleDogdGhpcy5fZ2V0TWF4WkluZGV4KCkrMSxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgfSwge30sIGNoaWxkcmVuKTtcblxuICAgIHRoaXMuYWRkKGxheWVyKTtcblxuICAgIHJldHVybiBsYXllcjtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVTdG9yYWdlSW50ZXJmYWNlLmdldExheWVyfVxuICAgKi9cbiAgcHVibGljIGdldExheWVyKGlkOiBzdHJpbmcpOiBEcmF3YWJsZUxheWVySW50ZXJmYWNlIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY2FuZGlkYXRlID0gdGhpcy5maW5kQnlJZChpZCk7XG5cbiAgICAgIGlmICghaXNMYXllcihjYW5kaWRhdGUpKSB7XG4gICAgICAgIC8vIFRPRE8gY3VzdG9taXplIGV4Y2VwdGlvblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICh0aGlzLmZpbmRCeUlkKGlkKSBhcyBEcmF3YWJsZUxheWVySW50ZXJmYWNlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYGNhbm5vdCBmaW5kIGxheWVyIHdpdGggaWQgJyR7aWR9J2ApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVTdG9yYWdlSW50ZXJmYWNlLmdldExheWVyc31cbiAgICovXG4gIHB1YmxpYyBnZXRMYXllcnMoKTogRHJhd2FibGVMYXllckludGVyZmFjZVtdIHtcbiAgICByZXR1cm4gKHRoaXMuX2ZpbmQoKGl0ZW0pID0+IGlzTGF5ZXIoaXRlbSkpIGFzIERyYXdhYmxlTGF5ZXJJbnRlcmZhY2VbXSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5vblZpZXdDaGFuZ2V9XG4gICAqL1xuICBwdWJsaWMgb25WaWV3Q2hhbmdlKHN1YnNjcmliZXJOYW1lOiBzdHJpbmcsIGhhbmRsZXI6IFZpZXdPYnNlcnZhYmxlSGFuZGxlclR5cGUpOiB2b2lkIHtcbiAgICB0aGlzLl9vYnNlcnZlSGVscGVyLm9uQ2hhbmdlKHN1YnNjcmliZXJOYW1lLCBoYW5kbGVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVTdG9yYWdlSW50ZXJmYWNlLm9mZlZpZXdDaGFuZ2V9XG4gICAqL1xuICBwdWJsaWMgb2ZmVmlld0NoYW5nZShzdWJzY3JpYmVyTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5fb2JzZXJ2ZUhlbHBlci5vZmZDaGFuZ2Uoc3Vic2NyaWJlck5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG1heCB6SW5kZXggb2YgdGhlIGZpcnN0IGRlcHRoIGxldmVsIGl0ZW1zXG4gICAqL1xuICBwcm90ZWN0ZWQgX2dldE1heFpJbmRleCgpOiBudW1iZXIge1xuICAgIGlmICh0aGlzLl9saXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2xpc3RbdGhpcy5fbGlzdC5sZW5ndGggLSAxXS5jb25maWcuekluZGV4O1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgb2JqZWN0cyBpbiBzdG9yYWdlIGJ5IGZpbHRlciBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcGFyYW0gZmlsdGVyIC0gZmlsdGVyIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAqL1xuICBwcm90ZWN0ZWQgX2ZpbmQoZmlsdGVyOiBEcmF3YWJsZVN0b3JhZ2VGaWx0ZXJDYWxsYmFja1R5cGUpOiBEcmF3YWJsZUludGVyZmFjZVtdIHtcbiAgICBjb25zdCByZXN1bHQ6IERyYXdhYmxlSW50ZXJmYWNlW10gPSBbXTtcblxuICAgIHRoaXMuX2xpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKGZpbHRlcihpdGVtKSkge1xuICAgICAgICByZXN1bHQucHVzaChpdGVtKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICAvKipcbiAgICogU29ydHMgdGhlIHN0b3JlZCBvYmplY3RzIGJ5IHotaW5kZXhcbiAgICovXG4gIHByb3RlY3RlZCBfc29ydCgpOiB2b2lkIHtcbiAgICAvLyBUT0RPINGB0LvQtdC00LjRgtGMXG4gICAgLy8gY29uc29sZS5sb2coJ3NvcnQnKTtcbiAgICB0aGlzLl9saXN0LnNvcnQoKGxocywgcmhzKSA9PiBsaHMuY29uZmlnLnpJbmRleCAtIHJocy5jb25maWcuekluZGV4KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgRHJhd2FibGVJbnRlcmZhY2UsXG4gIERyYXdhYmxlQ29uZmlnSW50ZXJmYWNlLFxuICBEcmF3YWJsZUlkVHlwZSxcbiAgRHJhd2VySW50ZXJmYWNlLFxuICBMaW5rZWREYXRhVHlwZSxcbiAgT2JzZXJ2ZUhlbHBlckludGVyZmFjZSxcbiAgVmlld09ic2VydmFibGVIYW5kbGVyVHlwZSxcbn0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IE9ic2VydmVIZWxwZXIgZnJvbSAnLi4vLi4vaGVscGVycy9vYnNlcnZlLWhlbHBlcic7XG5pbXBvcnQgeyBhcmVBcnJheXNFcXVhbCB9IGZyb20gJy4uLy4uL2hlbHBlcnMvYmFzZSc7XG5cbi8qKlxuICogQWJzdHJhY3QgY2xhc3MgZm9yIGRyYXdhYmxlIG9iamVjdHNcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgRHJhd2FibGUgaW1wbGVtZW50cyBEcmF3YWJsZUludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBPYmplY3QgSURcbiAgICovXG4gIHByb3RlY3RlZCBfaWQ6IERyYXdhYmxlSWRUeXBlO1xuICAvKipcbiAgICogT2JqZWN0IHR5cGVcbiAgICovXG4gIHByb3RlY3RlZCBfdHlwZTogc3RyaW5nO1xuICAvKipcbiAgICogVmlldyBjb25maWdcbiAgICovXG4gIHByb3RlY3RlZCBfY29uZmlnOiBEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZTtcbiAgLyoqXG4gICAqIEV4dHJhIGxpbmtlZCBkYXRhXG4gICAqL1xuICBwcm90ZWN0ZWQgX2RhdGE6IExpbmtlZERhdGFUeXBlO1xuICAvKipcbiAgICogT2JzZXJ2ZSBoZWxwZXJcbiAgICovXG4gIHByb3RlY3RlZCBfb2JzZXJ2ZUhlbHBlcjogT2JzZXJ2ZUhlbHBlckludGVyZmFjZTtcblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlSW50ZXJmYWNlLmRyYXd9XG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgZHJhdyhkcmF3ZXI6IERyYXdlckludGVyZmFjZSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIElEIGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBpZCgpOiBEcmF3YWJsZUlkVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuX2lkO1xuICB9XG5cbiAgLyoqXG4gICAqIFR5cGUgZ2V0dGVyXG4gICAqL1xuICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWaWV3IGNvbmZpZyBnZXR0ZXJcbiAgICovXG4gIHB1YmxpYyBnZXQgY29uZmlnKCk6IERyYXdhYmxlQ29uZmlnSW50ZXJmYWNlIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpZXcgY29uZmlnIHNldHRlclxuICAgKiBAcGFyYW0gY29uZmlnIC0gdmlldyBjb25maWdcbiAgICovXG4gIHB1YmxpYyBzZXQgY29uZmlnKGNvbmZpZzogRHJhd2FibGVDb25maWdJbnRlcmZhY2UpIHtcbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhYXJlQXJyYXlzRXF1YWwoT2JqZWN0LmVudHJpZXMoY29uZmlnKSwgT2JqZWN0LmVudHJpZXModGhpcy5fY29uZmlnKSk7XG5cbiAgICB0aGlzLl9vYnNlcnZlSGVscGVyLndpdGhNdXRlSGFuZGxlcnMoKChtdXRlZEJlZm9yZTogYm9vbGVhbiwgbWFuYWdlcjogT2JzZXJ2ZUhlbHBlckludGVyZmFjZSkgPT4ge1xuICAgICAgY29uc3QgaXNaSW5kZXhDaGFuZ2VkID0gY29uZmlnLnpJbmRleCAhPT0gdGhpcy5fY29uZmlnLnpJbmRleDtcblxuICAgICAgT2JqZWN0LmVudHJpZXMoY29uZmlnKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgKHRoaXMuX2NvbmZpZ1trZXkgYXMga2V5b2YgRHJhd2FibGVDb25maWdJbnRlcmZhY2VdIGFzIHVua25vd24pID0gdmFsdWUgYXMgdW5rbm93bjtcbiAgICAgIH0pO1xuXG4gICAgICBtYW5hZ2VyLnByb2Nlc3NIYW5kbGVycyghaXNDaGFuZ2VkIHx8IG11dGVkQmVmb3JlLCB7XG4gICAgICAgIHpJbmRleENoYW5nZWQ6IGlzWkluZGV4Q2hhbmdlZCxcbiAgICAgIH0pO1xuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaW5rZWQgZGF0YSBnZXR0ZXJcbiAgICovXG4gIHB1YmxpYyBnZXQgZGF0YSgpOiBMaW5rZWREYXRhVHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGE7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlSW50ZXJmYWNlLm9uVmlld0NoYW5nZX1cbiAgICovXG4gIHB1YmxpYyBvblZpZXdDaGFuZ2Uoc3Vic2NyaWJlck5hbWU6IHN0cmluZywgaGFuZGxlcjogVmlld09ic2VydmFibGVIYW5kbGVyVHlwZSk6IHZvaWQge1xuICAgIHRoaXMuX29ic2VydmVIZWxwZXIub25DaGFuZ2Uoc3Vic2NyaWJlck5hbWUsIGhhbmRsZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZUludGVyZmFjZS5vZmZWaWV3Q2hhbmdlfVxuICAgKi9cbiAgcHVibGljIG9mZlZpZXdDaGFuZ2Uoc3Vic2NyaWJlck5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX29ic2VydmVIZWxwZXIub2ZmQ2hhbmdlKHN1YnNjcmliZXJOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmF3YWJsZSBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gaWQgLSBvYmplY3QgSURcbiAgICogQHBhcmFtIGNvbmZpZyAtIHZpZXcgY29uZmlnXG4gICAqIEBwYXJhbSBkYXRhIC0gbGlua2VkIGV4dHJhIGRhdGFcbiAgICovXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihpZDogRHJhd2FibGVJZFR5cGUsIGNvbmZpZzogRHJhd2FibGVDb25maWdJbnRlcmZhY2UsIGRhdGE6IExpbmtlZERhdGFUeXBlID0ge30pIHtcbiAgICB0aGlzLl9pZCA9IGlkO1xuICAgIHRoaXMuX29ic2VydmVIZWxwZXIgPSBuZXcgT2JzZXJ2ZUhlbHBlcigpO1xuICAgIHRoaXMuX2NvbmZpZyA9IG5ldyBQcm94eShjb25maWcsIHtcbiAgICAgIHNldDogKHRhcmdldDogRHJhd2FibGVDb25maWdJbnRlcmZhY2UsIGluZGV4LCB2YWx1ZSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBjb25zdCBpc0NoYW5nZWQgPSB0YXJnZXRbaW5kZXggYXMga2V5b2YgRHJhd2FibGVDb25maWdJbnRlcmZhY2VdICE9PSB2YWx1ZTtcbiAgICAgICAgKHRhcmdldFtpbmRleCBhcyBrZXlvZiBEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZV0gYXMgdW5rbm93bikgPSB2YWx1ZSBhcyB1bmtub3duO1xuICAgICAgICByZXR1cm4gaXNDaGFuZ2VkID8gdGhpcy5fb2JzZXJ2ZUhlbHBlci5wcm9jZXNzV2l0aE11dGVIYW5kbGVycyh7XG4gICAgICAgICAgekluZGV4Q2hhbmdlZDogaW5kZXggPT09ICd6SW5kZXgnLFxuICAgICAgICB9KSA6IHRydWU7XG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuX2RhdGEgPSBuZXcgUHJveHkoZGF0YSwge1xuICAgICAgc2V0OiAodGFyZ2V0OiBMaW5rZWREYXRhVHlwZSwgaW5kZXgsIHZhbHVlKTogYm9vbGVhbiA9PiB7XG4gICAgICAgIGNvbnN0IGlzQ2hhbmdlZCA9IHRhcmdldFtpbmRleCBhcyBrZXlvZiBMaW5rZWREYXRhVHlwZV0gIT09IHZhbHVlO1xuICAgICAgICB0YXJnZXRbaW5kZXggYXMga2V5b2YgTGlua2VkRGF0YVR5cGVdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBpc0NoYW5nZWQgPyB0aGlzLl9vYnNlcnZlSGVscGVyLnByb2Nlc3NXaXRoTXV0ZUhhbmRsZXJzKCkgOiB0cnVlO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgUG9zaXRpb25hbENvbnRleHRJbnRlcmZhY2UsXG4gIFBvc2l0aW9uYWxEcmF3YWJsZUludGVyZmFjZSxcbiAgVmVjdG9yQXJyYXlUeXBlLFxufSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbi8qKlxuICogUG9zaXRpb25hbENvbnRleHQgY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9zaXRpb25hbENvbnRleHQgaW1wbGVtZW50cyBQb3NpdGlvbmFsQ29udGV4dEludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBFbGVtZW50IGluIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyBlbGVtZW50OiBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2UgfCBudWxsID0gbnVsbDtcbiAgLyoqXG4gICAqIFJlbGF0aXZlIGV2ZW50IHBvc2l0aW9uJ3MgY29vcmRzXG4gICAqL1xuICBwdWJsaWMgcG9zaXRpb246IFZlY3RvckFycmF5VHlwZSB8IG51bGwgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbmFsQ29udGV4dCBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0gZWxlbWVudCAtIGVsZW1lbnQgaW4gY29udGV4dFxuICAgKiBAcGFyYW0gcG9zaXRpb24gLSByZWxhdGl2ZSBjb250ZXh0IHBvc2l0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihlbGVtZW50OiBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2UgfCBudWxsLCBwb3NpdGlvbjogVmVjdG9yQXJyYXlUeXBlIHwgbnVsbCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiBjb250ZXh0IGlzIGVtcHR5XG4gICAqL1xuICBwdWJsaWMgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50ID09PSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2UsXG4gIFBvc2l0aW9uYWxEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZSxcbiAgRHJhd2FibGVJZFR5cGUsXG4gIERyYXdlckludGVyZmFjZSxcbiAgTGlua2VkRGF0YVR5cGUsXG4gIFZlY3RvckFycmF5VHlwZSxcbiAgUG9zaXRpb25hbERyYXdhYmxlR3JvdXBJbnRlcmZhY2UsXG59IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBEcmF3YWJsZUdyb3VwIGZyb20gJy4uL2RyYXdhYmxlL2RyYXdhYmxlLWdyb3VwJztcbmltcG9ydCB7IGNyZWF0ZVZlY3RvciB9IGZyb20gJy4uL3ZlY3Rvcic7XG5pbXBvcnQgeyBCb3VuZEludGVyZmFjZSB9IGZyb20gJy4uLy4uL3R5cGVzL2JvdW5kJztcbmltcG9ydCBSZWN0YW5ndWxhckJvdW5kIGZyb20gJy4uL2JvdW5kcy9yZWN0YW5ndWxhci1ib3VuZCc7XG5pbXBvcnQgeyB0cmFuc3Bvc2VDb29yZHNGb3J3YXJkIH0gZnJvbSAnLi4vdmVjdG9yL2hlbHBlcnMnO1xuaW1wb3J0IHsgaXNQb3NpdGlvbmFsIH0gZnJvbSAnLi4vLi4vaGVscGVycy90eXBlLWhlbHBlcnMnO1xuaW1wb3J0IFBvc2l0aW9uYWxEcmF3YWJsZSBmcm9tICcuL3Bvc2l0aW9uYWwtZHJhd2FibGUnO1xuXG4vKipcbiAqIFBvc2l0aW9uYWwgZHJhd2FibGUgZ3JvdXAgY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9zaXRpb25hbERyYXdhYmxlR3JvdXAgZXh0ZW5kcyBEcmF3YWJsZUdyb3VwIGltcGxlbWVudHMgUG9zaXRpb25hbERyYXdhYmxlR3JvdXBJbnRlcmZhY2Uge1xuICAvKipcbiAgICogSW50ZXJmYWNlIGJlbG9uZ2luZyBmbGFnXG4gICAqL1xuICBwdWJsaWMgaXNQb3NpdGlvbmFsOiB0cnVlID0gdHJ1ZTtcbiAgLyoqXG4gICAqIE5hbWUgb2YgY2xhc3MgdG8gdXNlIGFzIHN1YnNjcmliZXIgbmFtZSBpbiBvYnNlcnZhYmxlIGxvZ2ljXG4gICAqL1xuICBwcm90ZWN0ZWQgX3N1YnNjcmliZXJOYW1lOiBzdHJpbmcgPSAnUG9zaXRpb25hbERyYXdhYmxlR3JvdXAnO1xuICAvKipcbiAgICogVmlldyBjb25maWdcbiAgICovXG4gIHByb3RlY3RlZCBfY29uZmlnOiBQb3NpdGlvbmFsRHJhd2FibGVDb25maWdJbnRlcmZhY2U7XG5cbiAgLyoqXG4gICAqIERyYXdhYmxlR3JvdXAgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIGlkIC0gZ3JvdXAgSURcbiAgICogQHBhcmFtIGNvbmZpZyAtIGNvbmZpZ1xuICAgKiBAcGFyYW0gZGF0YSAtIGV4dHJhIGRhdGFcbiAgICogQHBhcmFtIGNoaWxkcmVuIC0gY2hpbGRyZW4gb2YgZ3JvdXBlZCBvYmplY3RzXG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBpZDogRHJhd2FibGVJZFR5cGUsXG4gICAgY29uZmlnOiBQb3NpdGlvbmFsRHJhd2FibGVDb25maWdJbnRlcmZhY2UsXG4gICAgZGF0YTogTGlua2VkRGF0YVR5cGUgPSB7fSxcbiAgICBjaGlsZHJlbjogUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlW10gPSBbXSxcbiAgKSB7XG4gICAgc3VwZXIoaWQsIGNvbmZpZywgZGF0YSwgY2hpbGRyZW4pO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZUludGVyZmFjZS5kcmF3fVxuICAgKi9cbiAgcHVibGljIGRyYXcoZHJhd2VyOiBEcmF3ZXJJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBkcmF3ZXIuY29udGV4dC5zYXZlKCk7XG4gICAgZHJhd2VyLmNvbnRleHQudHJhbnNsYXRlKC4uLnRoaXMuY29uZmlnLnBvc2l0aW9uKTtcbiAgICBzdXBlci5kcmF3KGRyYXdlcik7XG4gICAgZHJhd2VyLmNvbnRleHQucmVzdG9yZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZUludGVyZmFjZS5zZXRQb3NpdGlvbn1cbiAgICovXG4gIHB1YmxpYyBzZXRQb3NpdGlvbihjb29yZHM6IFZlY3RvckFycmF5VHlwZSk6IHZvaWQge1xuICAgIHRoaXMuX2NvbmZpZy5wb3NpdGlvbiA9IGNvb3JkcztcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVJbnRlcmZhY2UubW92ZVBvc2l0aW9ufVxuICAgKi9cbiAgcHVibGljIG1vdmVQb3NpdGlvbihvZmZzZXQ6IFZlY3RvckFycmF5VHlwZSk6IHZvaWQge1xuICAgIHRoaXMuc2V0UG9zaXRpb24oXG4gICAgICBjcmVhdGVWZWN0b3IodGhpcy5fY29uZmlnLnBvc2l0aW9uKVxuICAgICAgICAuYWRkKGNyZWF0ZVZlY3RvcihvZmZzZXQpKVxuICAgICAgICAudG9BcnJheSgpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlSW50ZXJmYWNlLmdldFJlbGF0aXZlUG9zaXRpb259XG4gICAqL1xuICBwdWJsaWMgZ2V0UmVsYXRpdmVQb3NpdGlvbihwb2ludDogVmVjdG9yQXJyYXlUeXBlKTogVmVjdG9yQXJyYXlUeXBlIHtcbiAgICByZXR1cm4gY3JlYXRlVmVjdG9yKHBvaW50KVxuICAgICAgLnN1YihjcmVhdGVWZWN0b3IodGhpcy5jb25maWcucG9zaXRpb24pKVxuICAgICAgLnRvQXJyYXkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVJbnRlcmZhY2UuYm91bmRJbmNsdWRlc31cbiAgICovXG4gIHB1YmxpYyBib3VuZEluY2x1ZGVzKGNvb3JkczogVmVjdG9yQXJyYXlUeXBlKTogYm9vbGVhbiB7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiB0aGlzLmNoaWxkcmVuKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGlzUG9zaXRpb25hbChjaGlsZClcbiAgICAgICAgJiYgKGNoaWxkIGFzIFBvc2l0aW9uYWxEcmF3YWJsZSkuYm91bmRJbmNsdWRlcyh0cmFuc3Bvc2VDb29yZHNGb3J3YXJkKGNvb3JkcywgdGhpcy5fY29uZmlnLnBvc2l0aW9uKSlcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlSW50ZXJmYWNlLmlzTmVhckJvdW5kRWRnZX1cbiAgICovXG4gIGlzTmVhckJvdW5kRWRnZShjb29yZHM6IFZlY3RvckFycmF5VHlwZSwgZGV2aWF0aW9uOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5ib3VuZC5pc05lYXJFZGdlKFxuICAgICAgdHJhbnNwb3NlQ29vcmRzRm9yd2FyZChjb29yZHMsIHRoaXMuX2NvbmZpZy5wb3NpdGlvbiksXG4gICAgICBkZXZpYXRpb24sXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0IGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBjaGlsZHJlbigpOiBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2VbXSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2UubGlzdCBhcyBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2VbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBWaWV3IGNvbmZpZyBnZXR0ZXJcbiAgICovXG4gIHB1YmxpYyBnZXQgY29uZmlnKCk6IFBvc2l0aW9uYWxEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcbiAgfVxuXG4gIC8qKlxuICAgKiBib3VuZCBnZXR0ZXJcbiAgICovXG4gIHB1YmxpYyBnZXQgYm91bmQoKTogQm91bmRJbnRlcmZhY2Uge1xuICAgIHJldHVybiBuZXcgUmVjdGFuZ3VsYXJCb3VuZCh7XG4gICAgICBwb3NpdGlvbjogWzAsIDBdLFxuICAgICAgc2l6ZTogdGhpcy5fY29uZmlnLnNpemUsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU29tZSBhY3Rpb25zIHdpdGggY2hpbGRyZW4gYmVmb3JlIGdyb3VwaW5nXG4gICAqL1xuICBwcm90ZWN0ZWQgX3Byb2Nlc3NDaGlsZHJlblRvR3JvdXAoY2hpbGRyZW46IFBvc2l0aW9uYWxEcmF3YWJsZUludGVyZmFjZVtdKTogUG9zaXRpb25hbERyYXdhYmxlSW50ZXJmYWNlW10ge1xuICAgIGNoaWxkcmVuLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGl0ZW0ubW92ZVBvc2l0aW9uKFxuICAgICAgICBjcmVhdGVWZWN0b3IodGhpcy5fY29uZmlnLnBvc2l0aW9uKS5pbnZlcnNlKCkudG9BcnJheSgpLFxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cblxuICAvKipcbiAgICogU29tZSBhY3Rpb25zIHdpdGggY2hpbGRyZW4gYmVmb3JlIHVuZ3JvdXBpbmdcbiAgICovXG4gIHByb3RlY3RlZCBfcHJvY2Vzc0NoaWxkcmVuVG9Vbmdyb3VwKGNoaWxkcmVuOiBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2VbXSk6IFBvc2l0aW9uYWxEcmF3YWJsZUludGVyZmFjZVtdIHtcbiAgICBjaGlsZHJlbi5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpdGVtLm1vdmVQb3NpdGlvbih0aGlzLl9jb25maWcucG9zaXRpb24pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNoaWxkcmVuO1xuICB9XG59XG4iLCJpbXBvcnQge1xuICBQb3NpdGlvbmFsRHJhd2FibGVJbnRlcmZhY2UsXG4gIFBvc2l0aW9uYWxEcmF3YWJsZUNvbmZpZ0ludGVyZmFjZSxcbiAgVmVjdG9yQXJyYXlUeXBlLFxufSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBjcmVhdGVWZWN0b3IgfSBmcm9tICcuLi92ZWN0b3InO1xuaW1wb3J0IERyYXdhYmxlIGZyb20gJy4uL2RyYXdhYmxlL2RyYXdhYmxlJztcbmltcG9ydCB7IEJvdW5kSW50ZXJmYWNlIH0gZnJvbSAnLi4vLi4vdHlwZXMvYm91bmQnO1xuaW1wb3J0IFJlY3Rhbmd1bGFyQm91bmQgZnJvbSAnLi4vYm91bmRzL3JlY3Rhbmd1bGFyLWJvdW5kJztcbmltcG9ydCB7IHRyYW5zcG9zZUNvb3Jkc0ZvcndhcmQgfSBmcm9tICcuLi92ZWN0b3IvaGVscGVycyc7XG5cbi8qKlxuICogQWJzdHJhY3QgY2xhc3MgZm9yIGRyYXdhYmxlIHBvc2l0aW9uYWwgb2JqZWN0c1xuICogQHB1YmxpY1xuICovXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBQb3NpdGlvbmFsRHJhd2FibGUgZXh0ZW5kcyBEcmF3YWJsZSBpbXBsZW1lbnRzIFBvc2l0aW9uYWxEcmF3YWJsZUludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgYmVsb25naW5nIGZsYWdcbiAgICovXG4gIHB1YmxpYyBpc1Bvc2l0aW9uYWw6IHRydWUgPSB0cnVlO1xuICAvKipcbiAgICogVmlldyBjb25maWdcbiAgICovXG4gIHByb3RlY3RlZCBfY29uZmlnOiBQb3NpdGlvbmFsRHJhd2FibGVDb25maWdJbnRlcmZhY2U7XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZUludGVyZmFjZS5zZXRQb3NpdGlvbn1cbiAgICovXG4gIHB1YmxpYyBzZXRQb3NpdGlvbihjb29yZHM6IFZlY3RvckFycmF5VHlwZSk6IHZvaWQge1xuICAgIHRoaXMuX2NvbmZpZy5wb3NpdGlvbiA9IGNvb3JkcztcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVJbnRlcmZhY2UubW92ZVBvc2l0aW9ufVxuICAgKi9cbiAgcHVibGljIG1vdmVQb3NpdGlvbihvZmZzZXQ6IFZlY3RvckFycmF5VHlwZSk6IHZvaWQge1xuICAgIHRoaXMuc2V0UG9zaXRpb24oXG4gICAgICBjcmVhdGVWZWN0b3IodGhpcy5fY29uZmlnLnBvc2l0aW9uKVxuICAgICAgICAuYWRkKGNyZWF0ZVZlY3RvcihvZmZzZXQpKVxuICAgICAgICAudG9BcnJheSgpLFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlSW50ZXJmYWNlLmdldFJlbGF0aXZlUG9zaXRpb259XG4gICAqL1xuICBwdWJsaWMgZ2V0UmVsYXRpdmVQb3NpdGlvbihwb2ludDogVmVjdG9yQXJyYXlUeXBlKTogVmVjdG9yQXJyYXlUeXBlIHtcbiAgICByZXR1cm4gY3JlYXRlVmVjdG9yKHBvaW50KVxuICAgICAgLnN1YihjcmVhdGVWZWN0b3IodGhpcy5jb25maWcucG9zaXRpb24pKVxuICAgICAgLnRvQXJyYXkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgRHJhd2FibGVJbnRlcmZhY2UuYm91bmRJbmNsdWRlc31cbiAgICovXG4gIHB1YmxpYyBib3VuZEluY2x1ZGVzKGNvb3JkczogVmVjdG9yQXJyYXlUeXBlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYm91bmQuaW5jbHVkZXMoXG4gICAgICB0cmFuc3Bvc2VDb29yZHNGb3J3YXJkKGNvb3JkcywgdGhpcy5fY29uZmlnLnBvc2l0aW9uKSxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBEcmF3YWJsZUludGVyZmFjZS5pc05lYXJCb3VuZEVkZ2V9XG4gICAqL1xuICBwdWJsaWMgaXNOZWFyQm91bmRFZGdlKGNvb3JkczogVmVjdG9yQXJyYXlUeXBlLCBkZXZpYXRpb246IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmJvdW5kLmlzTmVhckVkZ2UoXG4gICAgICB0cmFuc3Bvc2VDb29yZHNGb3J3YXJkKGNvb3JkcywgdGhpcy5fY29uZmlnLnBvc2l0aW9uKSxcbiAgICAgIGRldmlhdGlvbixcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFZpZXcgY29uZmlnIGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBjb25maWcoKTogUG9zaXRpb25hbERyYXdhYmxlQ29uZmlnSW50ZXJmYWNlIHtcbiAgICByZXR1cm4gdGhpcy5fY29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIGJvdW5kIGdldHRlclxuICAgKi9cbiAgcHVibGljIGdldCBib3VuZCgpOiBCb3VuZEludGVyZmFjZSB7XG4gICAgcmV0dXJuIG5ldyBSZWN0YW5ndWxhckJvdW5kKHtcbiAgICAgIHBvc2l0aW9uOiBbMCwgMF0sXG4gICAgICBzaXplOiB0aGlzLl9jb25maWcuc2l6ZSxcbiAgICB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29vcmRzRmlsdGVyQ29uZmlnSW50ZXJmYWNlLCBDb29yZHNGaWx0ZXJJbnRlcmZhY2UgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IFZlY3RvckFycmF5VHlwZSB9IGZyb20gJy4uL3ZlY3Rvci90eXBlcyc7XG5cbi8qKlxuICogRmlsdGVyIGNvb3JkcyB1c2luZyBncmlkXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyaWRGaWx0ZXIgaW1wbGVtZW50cyBDb29yZHNGaWx0ZXJJbnRlcmZhY2Uge1xuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIENvb3Jkc0ZpbHRlckludGVyZmFjZS5wcm9jZXNzfVxuICAgKi9cbiAgcHVibGljIHByb2Nlc3MoZGF0YTogVmVjdG9yQXJyYXlUeXBlLCBjb25maWc6IENvb3Jkc0ZpbHRlckNvbmZpZ0ludGVyZmFjZSk6IFZlY3RvckFycmF5VHlwZSB7XG4gICAgY29uc3QgW3gsIHldID0gZGF0YTtcbiAgICBjb25zdCBzY2FsZSA9IGNvbmZpZy5zY2FsZVswXTtcblxuICAgIGxldCBzdGVwID0gY29uZmlnLmdyaWRTdGVwO1xuXG4gICAgaWYgKHNjYWxlIDwgMSkge1xuICAgICAgc3RlcCAqPSAyICoqIE1hdGgucm91bmQoTWF0aC5sb2cyKDEgLyBzY2FsZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGVwIC89IDIgKiogTWF0aC5yb3VuZChNYXRoLmxvZzIoc2NhbGUpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gW3gteCVzdGVwLCB5LXklc3RlcF07XG4gIH1cbn1cbiIsImltcG9ydCB7IGNyZWF0ZUJsb2IsIGNyZWF0ZVVybEZyb21CbG9iLCBoYXNoU3RyaW5nIH0gZnJvbSAnLi4vaGVscGVycy9iYXNlJztcbmltcG9ydCB7XG4gIEhhc2hLZXlUeXBlLFxuICBJbWFnZUNhY2hlSW50ZXJmYWNlLFxuICBPbkxvYWRIYW5kbGVyVHlwZSxcbiAgT25Ub3RhbExvYWRIYW5kbGVyVHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIENhY2hlIGhlbHBlciBmb3IgaW1hZ2VzXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEltYWdlQ2FjaGUgaW1wbGVtZW50cyBJbWFnZUNhY2hlSW50ZXJmYWNlIHtcbiAgLyoqXG4gICAqIE1hcCBvZiB0aGUgcHJlbG9hZGVkIGltYWdlc1xuICAgKi9cbiAgcHJvdGVjdGVkIF9pbWFnZU1hcDogUmVjb3JkPEhhc2hLZXlUeXBlLCBIVE1MSW1hZ2VFbGVtZW50PiA9IHt9O1xuICAvKipcbiAgICogTWFwIG9mIHRoZSBydW5uaW5nIHByb2Nlc3Nlc1xuICAgKi9cbiAgcHJvdGVjdGVkIF9wcm9jZXNzTWFwOiBSZWNvcmQ8SGFzaEtleVR5cGUsIGJvb2xlYW4+ID0ge307XG4gIC8qKlxuICAgKiBNYXAgb2YgdGhlIGJ1ZmZlcmVkIGhhbmRsZXJzXG4gICAqL1xuICBwcm90ZWN0ZWQgX2hhbmRsZXJzOiBSZWNvcmQ8SGFzaEtleVR5cGUsIEFycmF5PE9uTG9hZEhhbmRsZXJUeXBlPj4gPSB7fTtcbiAgLyoqXG4gICAqIE1hcCBvZiB0aGUgaGFuZGxlcnMgZm9yIHN1YnNjcmliZWQgb2JqZWN0c1xuICAgKi9cbiAgcHJvdGVjdGVkIF90b3RhbEhhbmRsZXJzOiBSZWNvcmQ8SGFzaEtleVR5cGUsIE9uVG90YWxMb2FkSGFuZGxlclR5cGU+ID0ge307XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBJbWFnZUNhY2hlSW50ZXJmYWNlLnN1YnNjcmliZX1cbiAgICovXG4gIHB1YmxpYyBzdWJzY3JpYmUoc3Vic2NyaWJlck5hbWU6IHN0cmluZywgaGFuZGxlcjogT25Ub3RhbExvYWRIYW5kbGVyVHlwZSk6IHZvaWQge1xuICAgIHRoaXMuX3RvdGFsSGFuZGxlcnNbc3Vic2NyaWJlck5hbWVdID0gaGFuZGxlcjtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgSW1hZ2VDYWNoZUludGVyZmFjZS51bnN1YnNjcmliZX1cbiAgICovXG4gIHB1YmxpYyB1bnN1YnNjcmliZShzdWJzY3JpYmVyTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgZGVsZXRlIHRoaXMuX3RvdGFsSGFuZGxlcnNbc3Vic2NyaWJlck5hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBJbWFnZUNhY2hlSW50ZXJmYWNlLmNhY2hlfVxuICAgKi9cbiAgcHVibGljIGNhY2hlKFxuICAgIHNvdXJjZTogc3RyaW5nLFxuICAgIHR5cGU6IHN0cmluZyxcbiAgICBjYWxsYmFjazogT25Mb2FkSGFuZGxlclR5cGUgfCBudWxsID0gbnVsbCxcbiAgKTogSFRNTEltYWdlRWxlbWVudCB8IG51bGwge1xuICAgIGNvbnN0IGtleSA9IHRoaXMuX2dldEtleShzb3VyY2UsIHR5cGUpO1xuXG4gICAgaWYgKHRoaXMuX2ltYWdlTWFwW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGNhbGxiYWNrICE9PSBudWxsKSB7XG4gICAgICAgIGNhbGxiYWNrKHRoaXMuX2ltYWdlTWFwW2tleV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuX2ltYWdlTWFwW2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX3Byb2Nlc3NNYXBba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBpZiAoY2FsbGJhY2sgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKHRoaXMuX2hhbmRsZXJzW2tleV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZXJzW2tleV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9oYW5kbGVyc1trZXldLnB1c2goY2FsbGJhY2spO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fcHJvY2Vzc01hcFtrZXldID0gdHJ1ZTtcblxuICAgIGNvbnN0IGJsb2I6IEJsb2IgPSBjcmVhdGVCbG9iKHNvdXJjZSwgdHlwZSk7XG4gICAgY29uc3QgdXJsOiBzdHJpbmcgPSBjcmVhdGVVcmxGcm9tQmxvYihibG9iKTtcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICBpbWcuc3JjID0gdXJsO1xuXG4gICAgaW1nLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoKSA9PiB7XG4gICAgICB0aGlzLl9pbWFnZU1hcFtrZXldID0gaW1nO1xuICAgICAgZGVsZXRlIHRoaXMuX3Byb2Nlc3NNYXBba2V5XTtcblxuICAgICAgaWYgKHRoaXMuX2hhbmRsZXJzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjb25zdCBoYW5kbGVycyA9IHRoaXMuX2hhbmRsZXJzW2tleV07XG4gICAgICAgIHdoaWxlIChoYW5kbGVycy5sZW5ndGgpIHtcbiAgICAgICAgICAoaGFuZGxlcnMucG9wKCkpKGltZyk7XG4gICAgICAgIH1cbiAgICAgICAgZGVsZXRlIHRoaXMuX2hhbmRsZXJzW2tleV07XG4gICAgICB9XG5cbiAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5fcHJvY2Vzc01hcCkubGVuZ3RoKSB7XG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5fdG90YWxIYW5kbGVycykuZm9yRWFjaCgoaGFuZGxlcikgPT4gaGFuZGxlcigpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBoYXNoIGZvciBpbWFnZSBkYXRhIGFuZCB0eXBlIGFuZCByZXR1cm5zIGl0IGFzIHN0cmluZ1xuICAgKiBAcGFyYW0gc291cmNlIC0gc291cmNlIGRhdGEgb2YgaW1hZ2VcbiAgICogQHBhcmFtIHR5cGUgLSBtaW1lIHR5cGVcbiAgICovXG4gIHByb3RlY3RlZCBfZ2V0S2V5KHNvdXJjZTogc3RyaW5nLCB0eXBlOiBzdHJpbmcpOiBIYXNoS2V5VHlwZSB7XG4gICAgcmV0dXJuIGhhc2hTdHJpbmcoYCR7c291cmNlfV8ke3R5cGV9YCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFZlY3RvckFycmF5VHlwZSB9IGZyb20gJy4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiBhIG51bWJlciBpcyBpbnNpZGUgaW50ZXJ2YWxcbiAqIEBwYXJhbSB3aGF0IC0gbnVtYmVyXG4gKiBAcGFyYW0gaW50ZXJ2YWwgLSBpbnRlcnZhbFxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJbkludGVydmFsKHdoYXQ6IG51bWJlciwgaW50ZXJ2YWw6IFZlY3RvckFycmF5VHlwZSk6IGJvb2xlYW4ge1xuICByZXR1cm4gd2hhdCA+IGludGVydmFsWzBdICYmIHdoYXQgPCBpbnRlcnZhbFsxXTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgYSBudW1iZXIgaXMgaW5zaWRlIHNlZ21lbnRcbiAqIEBwYXJhbSB3aGF0IC0gbnVtYmVyXG4gKiBAcGFyYW0gc2VnbWVudCAtIHNlZ21lbnRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW5TZWdtZW50KHdoYXQ6IG51bWJlciwgc2VnbWVudDogVmVjdG9yQXJyYXlUeXBlKTogYm9vbGVhbiB7XG4gIHJldHVybiB3aGF0ID49IHNlZ21lbnRbMF0gJiYgd2hhdCA8PSBzZWdtZW50WzFdO1xufVxuXG4vKipcbiAqIFJvdW5kcyBhIG51bWJlciB3aXRoIGEgcHJlY2lzaW9uXG4gKiBAcGFyYW0gbnVtIC0gbnVtYmVyXG4gKiBAcGFyYW0gcHJlY2lzaW9uIC0gcHJlY2lzaW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByb3VuZChudW06IG51bWJlciwgcHJlY2lzaW9uOiBudW1iZXIgPSAwKTogbnVtYmVyIHtcbiAgY29uc3QgbXVsdCA9IDEwKipwcmVjaXNpb247XG4gIHJldHVybiBNYXRoLnJvdW5kKG51bSAqIG11bHQpIC8gbXVsdDtcbn1cblxuLyoqXG4gKiBUcmFuc3Bvc2UgY29vcmRzIHdpdGggZm9yd2FyZCBhcHBseWluZyBvZmZzZXQgYW5kIHNjYWxlXG4gKiBAcGFyYW0gY29vcmRzIC0gY29vcmRzIHRvIHRyYW5zcG9zZVxuICogQHBhcmFtIG9mZnNldCAtIG9mZnNldCB2ZWN0b3JcbiAqIEBwYXJhbSBzY2FsZSAtIHNjYWxlIHZlY3RvclxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwb3NlQ29vcmRzRm9yd2FyZChcbiAgY29vcmRzOiBWZWN0b3JBcnJheVR5cGUsIG9mZnNldDogVmVjdG9yQXJyYXlUeXBlLCBzY2FsZTogVmVjdG9yQXJyYXlUeXBlID0gWzEsIDFdLFxuKTogVmVjdG9yQXJyYXlUeXBlIHtcbiAgY29uc3QgW3gsIHldID0gY29vcmRzO1xuICByZXR1cm4gWyh4IC0gb2Zmc2V0WzBdKS9zY2FsZVswXSwgKHkgLSBvZmZzZXRbMV0pL3NjYWxlWzFdXTtcbn1cblxuLyoqXG4gKiBUcmFuc3Bvc2UgY29vcmRzIHdpdGggYmFja3dhcmQgYXBwbHlpbmcgb2Zmc2V0IGFuZCBzY2FsZVxuICogQHBhcmFtIGNvb3JkcyAtIGNvb3JkcyB0byB0cmFuc3Bvc2VcbiAqIEBwYXJhbSBvZmZzZXQgLSBvZmZzZXQgdmVjdG9yXG4gKiBAcGFyYW0gc2NhbGUgLSBzY2FsZSB2ZWN0b3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRyYW5zcG9zZUNvb3Jkc0JhY2t3YXJkKFxuICBjb29yZHM6IFZlY3RvckFycmF5VHlwZSwgb2Zmc2V0OiBWZWN0b3JBcnJheVR5cGUsIHNjYWxlOiBWZWN0b3JBcnJheVR5cGUgPSBbMSwgMV0sXG4pOiBWZWN0b3JBcnJheVR5cGUge1xuICBjb25zdCBbeCwgeV0gPSBjb29yZHM7XG4gIHJldHVybiBbeCpzY2FsZVswXSArIG9mZnNldFswXSwgeSpzY2FsZVsxXSArIG9mZnNldFsxXV07XG59XG4iLCJpbXBvcnQgUG9zaXRpb25hbFZlY3RvciwgeyBjcmVhdGVQb2x5Z29uVmVjdG9ycyB9IGZyb20gJy4vcG9zaXRpb25hbC12ZWN0b3InO1xuaW1wb3J0IHsgaXNJbkludGVydmFsLCBpc0luU2VnbWVudCwgcm91bmQgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IFZlY3RvciwgeyBjcmVhdGVWZWN0b3IsIHRvVmVjdG9yIH0gZnJvbSAnLi92ZWN0b3InO1xuXG5leHBvcnQge1xuICBWZWN0b3IsXG4gIGNyZWF0ZVZlY3RvcixcbiAgdG9WZWN0b3IsXG4gIFBvc2l0aW9uYWxWZWN0b3IsXG4gIGlzSW5JbnRlcnZhbCxcbiAgaXNJblNlZ21lbnQsXG4gIHJvdW5kLFxuICBjcmVhdGVQb2x5Z29uVmVjdG9ycyxcbn07XG4iLCJpbXBvcnQgeyBQb3NpdGlvbmFsVmVjdG9ySW50ZXJmYWNlLCBWZWN0b3JBcnJheVR5cGUsIFZlY3RvckludGVyZmFjZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IFZlY3RvciwgeyB0b1ZlY3RvciB9IGZyb20gJy4vdmVjdG9yJztcblxuLyoqXG4gKiBQb3NpdGlvbmFsIHZlY3RvciBjbGFzc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3NpdGlvbmFsVmVjdG9yIGltcGxlbWVudHMgUG9zaXRpb25hbFZlY3RvckludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBQb3NpdGlvblxuICAgKi9cbiAgcHVibGljIHBvc2l0aW9uOiBWZWN0b3JJbnRlcmZhY2U7XG4gIC8qKlxuICAgKiBTaXplXG4gICAqL1xuICBwdWJsaWMgc2l6ZTogVmVjdG9ySW50ZXJmYWNlO1xuXG4gIC8qKlxuICAgKiBQb3NpdGlvbmFsVmVjdG9yIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBwb3NpdGlvbiAtIHBvc2l0aW9uXG4gICAqIEBwYXJhbSBzaXplIC0gc2l6ZVxuICAgKi9cbiAgY29uc3RydWN0b3IocG9zaXRpb246IFZlY3RvckFycmF5VHlwZSB8IFZlY3RvckludGVyZmFjZSwgc2l6ZTogVmVjdG9yQXJyYXlUeXBlIHwgVmVjdG9ySW50ZXJmYWNlKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IHRvVmVjdG9yKHBvc2l0aW9uKTtcbiAgICB0aGlzLnNpemUgPSB0b1ZlY3RvcihzaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgUG9zaXRpb25hbFZlY3RvckludGVyZmFjZS50YXJnZXR9XG4gICAqL1xuICBwdWJsaWMgZ2V0IHRhcmdldCgpOiBWZWN0b3JJbnRlcmZhY2Uge1xuICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmNsb25lKCkuYWRkKHRoaXMuc2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbGVuZ3RoIG9mIHZlY3RvclxuICAgKi9cbiAgcHVibGljIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5zaXplLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgUG9zaXRpb25hbFZlY3RvckludGVyZmFjZS5pbmNsdWRlc31cbiAgICovXG4gIHB1YmxpYyBpbmNsdWRlcyhwb2ludDogVmVjdG9yQXJyYXlUeXBlIHwgVmVjdG9ySW50ZXJmYWNlLCBwcmVjaXNpb246IG51bWJlciA9IDQpOiBib29sZWFuIHtcbiAgICBjb25zdCBwb2ludFZlY3RvciA9IHRvVmVjdG9yKHBvaW50KTtcblxuICAgIGlmICh0aGlzLnBvc2l0aW9uLmlzRXF1YWwocG9pbnRWZWN0b3IsIHByZWNpc2lvbikgfHwgdGhpcy50YXJnZXQuaXNFcXVhbChwb2ludFZlY3RvciwgcHJlY2lzaW9uKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgW3gxLCB5MV0gPSB0aGlzLnBvc2l0aW9uLnRvQXJyYXkocHJlY2lzaW9uKTtcbiAgICBjb25zdCBbeDIsIHkyXSA9IHRoaXMudGFyZ2V0LnRvQXJyYXkocHJlY2lzaW9uKTtcbiAgICBjb25zdCBbeCwgeV0gPSBwb2ludFZlY3Rvci50b0FycmF5KHByZWNpc2lvbik7XG5cbiAgICByZXR1cm4gKHgteDEpICogKHkyLXkxKSAtICh5LXkxKSAqICh4Mi14MSkgPT09IDBcbiAgICAgICYmICh4MSA8IHggJiYgeCA8IHgyKSAmJiAoeTEgPCB5ICYmIHkgPCB5Mik7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIFBvc2l0aW9uYWxWZWN0b3JJbnRlcmZhY2UuZ2V0RGlzdGFuY2VWZWN0b3J9XG4gICAqL1xuICBwdWJsaWMgZ2V0RGlzdGFuY2VWZWN0b3IocG9pbnQ6IFZlY3RvckFycmF5VHlwZSB8IFZlY3RvckludGVyZmFjZSk6IFBvc2l0aW9uYWxWZWN0b3JJbnRlcmZhY2Uge1xuICAgIGNvbnN0IHZlY3RvclBvaW50ID0gdG9WZWN0b3IocG9pbnQpO1xuICAgIGNvbnN0IGRlc3RQb2ludCA9IHRoaXMuX2dldE5lYXJlc3RMaW5lUG9pbnQocG9pbnQpO1xuXG4gICAgaWYgKFxuICAgICAgZGVzdFBvaW50LnggPCBNYXRoLm1pbih0aGlzLnBvc2l0aW9uLngsIHRoaXMudGFyZ2V0LngpIHx8XG4gICAgICBkZXN0UG9pbnQueCA+IE1hdGgubWF4KHRoaXMucG9zaXRpb24ueCwgdGhpcy50YXJnZXQueCkgfHxcbiAgICAgIGRlc3RQb2ludC55IDwgTWF0aC5taW4odGhpcy5wb3NpdGlvbi55LCB0aGlzLnRhcmdldC55KSB8fFxuICAgICAgZGVzdFBvaW50LnkgPiBNYXRoLm1heCh0aGlzLnBvc2l0aW9uLnksIHRoaXMudGFyZ2V0LnkpXG4gICAgKSB7XG4gICAgICBjb25zdCBsMSA9IG5ldyBQb3NpdGlvbmFsVmVjdG9yKHZlY3RvclBvaW50LCB0b1ZlY3Rvcih0aGlzLnBvc2l0aW9uKS5zdWIodmVjdG9yUG9pbnQpKTtcbiAgICAgIGNvbnN0IGwyID0gbmV3IFBvc2l0aW9uYWxWZWN0b3IodmVjdG9yUG9pbnQsIHRvVmVjdG9yKHRoaXMudGFyZ2V0KS5zdWIodmVjdG9yUG9pbnQpKTtcblxuICAgICAgaWYgKGwxLmxlbmd0aCA8IGwyLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbDI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbmFsVmVjdG9yKHZlY3RvclBvaW50LCBkZXN0UG9pbnQuc3ViKHZlY3RvclBvaW50KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY29vcmRzIG9mIHRoZSBuZWFyZXN0IHBvaW50IG9uIHZlY3RvciB0byBhbm90aGVyIHBvaW50XG4gICAqIEBwYXJhbSBwb2ludCAtIGFub3RoZXIgcG9pbnRcbiAgICovXG4gIHByb3RlY3RlZCBfZ2V0TmVhcmVzdExpbmVQb2ludChwb2ludDogVmVjdG9yQXJyYXlUeXBlIHwgVmVjdG9ySW50ZXJmYWNlKSB7XG4gICAgY29uc3QgcG9pbnRWZWN0b3IgPSB0b1ZlY3Rvcihwb2ludCk7XG5cbiAgICBjb25zdCBrID0gKFxuICAgICAgKHRoaXMudGFyZ2V0LnktdGhpcy5wb3NpdGlvbi55KSAqIChwb2ludFZlY3Rvci54LXRoaXMucG9zaXRpb24ueClcbiAgICAgIC0gKHRoaXMudGFyZ2V0LngtdGhpcy5wb3NpdGlvbi54KSAqIChwb2ludFZlY3Rvci55LXRoaXMucG9zaXRpb24ueSlcbiAgICApIC8gKCh0aGlzLnRhcmdldC55LXRoaXMucG9zaXRpb24ueSkqKjIgKyAodGhpcy50YXJnZXQueC10aGlzLnBvc2l0aW9uLngpKioyKTtcblxuICAgIHJldHVybiBuZXcgVmVjdG9yKFtcbiAgICAgIHBvaW50VmVjdG9yLnggLSBrICogKHRoaXMudGFyZ2V0LnktdGhpcy5wb3NpdGlvbi55KSxcbiAgICAgIHBvaW50VmVjdG9yLnkgKyBrICogKHRoaXMudGFyZ2V0LngtdGhpcy5wb3NpdGlvbi54KSxcbiAgICBdKTtcbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBsaXN0IG9mIHZlY3RvcnMgb2YgdGhlIHBvbHlnb24gZnJvbSBhIGxpc3Qgb2YgcG9pbnRzXG4gKiBAcGFyYW0gcG9pbnRzIC0gbGlzdCBvZiBwb2ludHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBvbHlnb25WZWN0b3JzKHBvaW50czogVmVjdG9yQXJyYXlUeXBlW10gfCBWZWN0b3JJbnRlcmZhY2VbXSk6IFBvc2l0aW9uYWxWZWN0b3JJbnRlcmZhY2VbXSB7XG4gIGNvbnN0IHJlc3VsdDogUG9zaXRpb25hbFZlY3RvckludGVyZmFjZVtdID0gW107XG5cbiAgZm9yIChsZXQgaT0wLCBqPXBvaW50cy5sZW5ndGgtMTsgaTxwb2ludHMubGVuZ3RoOyBqPWkrKykge1xuICAgIGNvbnN0IGxoc1BvaW50ID0gdG9WZWN0b3IocG9pbnRzW2pdKTtcbiAgICBjb25zdCByaHNQb2ludCA9IHRvVmVjdG9yKHBvaW50c1tpXSk7XG5cbiAgICByZXN1bHQucHVzaChuZXcgUG9zaXRpb25hbFZlY3RvcihsaHNQb2ludCwgcmhzUG9pbnQuc3ViKGxoc1BvaW50KSkpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCB7IFZlY3RvckFycmF5VHlwZSwgVmVjdG9ySW50ZXJmYWNlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyByb3VuZCB9IGZyb20gJy4vaGVscGVycyc7XG5cbi8qKlxuICogVmVjdG9yIGNsYXNzXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlY3RvciBpbXBsZW1lbnRzIFZlY3RvckludGVyZmFjZSB7XG4gIC8qKlxuICAgKiBDb29yZGluYXRlIFhcbiAgICovXG4gIHB1YmxpYyB4OiBudW1iZXI7XG4gIC8qKlxuICAgKiBDb29yZGluYXRlIFlcbiAgICovXG4gIHB1YmxpYyB5OiBudW1iZXI7XG4gIC8qKlxuICAgKiBEZWZhdWx0IHByZWNpc2lvblxuICAgKi9cbiAgcHJvdGVjdGVkIF9kZWZhdWx0UHJlY2lzaW9uOiBudW1iZXIgPSA0O1xuXG4gIC8qKlxuICAgKiBWZWN0b3IgY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHggLSBjb29yZGluYXRlIFhcbiAgICogQHBhcmFtIHkgLSBjb29yZGluYXRlIFlcbiAgICogQHBhcmFtIGRlZmF1bHRQcmVjaXNpb24gLSBkZWZhdWx0IHByZWNpc2lvblxuICAgKi9cbiAgY29uc3RydWN0b3IoW3gsIHldOiBWZWN0b3JBcnJheVR5cGUsIGRlZmF1bHRQcmVjaXNpb24/OiBudW1iZXIpIHtcbiAgICB0aGlzLnggPSB4O1xuICAgIHRoaXMueSA9IHk7XG5cbiAgICBpZiAodGhpcy5fZGVmYXVsdFByZWNpc2lvbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9kZWZhdWx0UHJlY2lzaW9uID0gZGVmYXVsdFByZWNpc2lvbjtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFub3RoZXIgdmVjdG9yIHRvIHRoaXMgdmVjdG9yXG4gICAqIEBwYXJhbSB2IC0gdmVjdG9yIHRvIGNhY2hlXG4gICAqL1xuICBwdWJsaWMgYWRkKHY6IFZlY3RvckludGVyZmFjZSB8IFZlY3RvckFycmF5VHlwZSk6IFZlY3RvckludGVyZmFjZSB7XG4gICAgdiA9IHRvVmVjdG9yKHYpO1xuXG4gICAgdGhpcy54ICs9IHYueDtcbiAgICB0aGlzLnkgKz0gdi55O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogU3VidHJhY3RzIHZlY3RvciB3aXRoIGFub3RoZXIgdmVjdG9yXG4gICAqIEBwYXJhbSB2IC0gdmVjdG9yIHRvIHN1YnRyYWN0XG4gICAqL1xuICBwdWJsaWMgc3ViKHY6IFZlY3RvckludGVyZmFjZSB8IFZlY3RvckFycmF5VHlwZSk6IFZlY3RvckludGVyZmFjZSB7XG4gICAgdiA9IHRvVmVjdG9yKHYpO1xuXG4gICAgdGhpcy54IC09IHYueDtcbiAgICB0aGlzLnkgLT0gdi55O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogTXVsdGlwbGVzIHZlY3RvciBieSBudW1iZXJcbiAgICogQHBhcmFtIG11bCAtIG11bHRpcGxpZXJcbiAgICovXG4gIHB1YmxpYyBtdWwobXVsOiBudW1iZXIpOiBWZWN0b3JJbnRlcmZhY2Uge1xuICAgIHRoaXMueCAqPSBtdWw7XG4gICAgdGhpcy55ICo9IG11bDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIERpdmlkZXMgdmVjdG9yIGJ5IG51bWJlclxuICAgKiBAcGFyYW0gZGl2IC0gZGl2aWRlclxuICAgKi9cbiAgcHVibGljIGRpdihkaXY6IG51bWJlcik6IFZlY3RvckludGVyZmFjZSB7XG4gICAgdGhpcy54IC89IGRpdjtcbiAgICB0aGlzLnkgLz0gZGl2O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogSW52ZXJzZXMgdmVjdG9yXG4gICAqL1xuICBwdWJsaWMgaW52ZXJzZSgpOiBWZWN0b3JJbnRlcmZhY2Uge1xuICAgIHRoaXMueCA9IC10aGlzLng7XG4gICAgdGhpcy55ID0gLXRoaXMueTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldmVyc2VzIHZlY3RvclxuICAgKi9cbiAgcHVibGljIHJldmVyc2UoKTogVmVjdG9ySW50ZXJmYWNlIHtcbiAgICB0aGlzLnggPSAxL3RoaXMueDtcbiAgICB0aGlzLnkgPSAxL3RoaXMueTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxlbmd0aCBvZiB2ZWN0b3JcbiAgICovXG4gIHB1YmxpYyBnZXQgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLngqdGhpcy54ICsgdGhpcy55KnRoaXMueSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoaXMgdmVjdG9yIGlzIGVxdWFsIHRvIGFub3RoZXIgdmVjdG9yXG4gICAqIEBwYXJhbSB2IC0gYW5vdGhlciB2ZWN0b3JcbiAgICogQHBhcmFtIHByZWNpc2lvbiAtIHJvdW5kIHByZWNpc2lvbiBmb3IgY29tcGFyaXNvblxuICAgKi9cbiAgcHVibGljIGlzRXF1YWwodjogVmVjdG9ySW50ZXJmYWNlIHwgVmVjdG9yQXJyYXlUeXBlLCBwcmVjaXNpb246IG51bWJlciA9IHRoaXMuX2RlZmF1bHRQcmVjaXNpb24pOiBib29sZWFuIHtcbiAgICB2ID0gdG9WZWN0b3Iodik7XG4gICAgcmV0dXJuIHJvdW5kKHYueCwgcHJlY2lzaW9uKSA9PT0gcm91bmQodGhpcy54LCBwcmVjaXNpb24pXG4gICAgICAmJiByb3VuZCh2LnksIHByZWNpc2lvbikgPT09IHJvdW5kKHRoaXMueSwgcHJlY2lzaW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgaWYgYW5nbGUgYmV0d2VlbiB2ZWN0b3JzIGVxdWFscyA5MCBkZWdyZWVzXG4gICAqIEBwYXJhbSB2IC0gYW5vdGhlciB2ZWN0b3JcbiAgICovXG4gIHB1YmxpYyBpc09ydGhvZ29uYWwodjogVmVjdG9ySW50ZXJmYWNlIHwgVmVjdG9yQXJyYXlUeXBlKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29zKHYpID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIHZlY3RvciBpcyBjb2xsaW5lYXIgd2l0aCBhcmd1bWVudCB2ZWN0b3JcbiAgICogQHBhcmFtIHYgLSBhbm90aGVyIHZlY3RvclxuICAgKi9cbiAgcHVibGljIGlzQ29sbGluZWFyKHY6IFZlY3RvckludGVyZmFjZSB8IFZlY3RvckFycmF5VHlwZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm11bFZlY3Rvcih2KSA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGRpc3RhbmNlIHZlY3RvciBvZiB0aGlzIGFuZCBhbm90aGVyIHZlY3RvclxuICAgKiBAcGFyYW0gdiAtIGFub3RoZXIgdmVjdG9yXG4gICAqL1xuICBwdWJsaWMgZGlzdGFuY2UodjogVmVjdG9ySW50ZXJmYWNlIHwgVmVjdG9yQXJyYXlUeXBlKTogVmVjdG9ySW50ZXJmYWNlIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLnN1Yih2KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHNjYWxhciBwcm9kdWN0IHdpdGggYW5vdGhlciB2ZWN0b3JcbiAgICogQHBhcmFtIHYgLSBhbm90aGVyIHZlY3RvclxuICAgKi9cbiAgcHVibGljIG11bFNjYWxhcih2OiBWZWN0b3JJbnRlcmZhY2UgfCBWZWN0b3JBcnJheVR5cGUpOiBudW1iZXIge1xuICAgIHYgPSB0b1ZlY3Rvcih2KTtcbiAgICByZXR1cm4gdGhpcy54KnYueCArIHRoaXMueSp2Lnk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBsZW5ndGggb2YgdmVjdG9yIHByb2R1Y3Qgd2l0aCBhbm90aGVyIHZlY3RvclxuICAgKiBAcGFyYW0gdiAtIGFub3RoZXIgdmVjdG9yXG4gICAqL1xuICBwdWJsaWMgbXVsVmVjdG9yKHY6IFZlY3RvckludGVyZmFjZSB8IFZlY3RvckFycmF5VHlwZSk6IG51bWJlciB7XG4gICAgdiA9IHRvVmVjdG9yKHYpO1xuICAgIHJldHVybiB0aGlzLngqdi55IC0gdGhpcy55KnYueDtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3JtYWxpemVzIHRoaXMgdmVjdG9yXG4gICAqL1xuICBwdWJsaWMgbm9ybWFsaXplKCk6IFZlY3RvckludGVyZmFjZSB7XG4gICAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGg7XG5cbiAgICB0aGlzLnggLz0gbGVuO1xuICAgIHRoaXMueSAvPSBsZW47XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc3Bvc2VzIHZlY3RvciBmb3J3YXJkIHdpdGggb2Zmc2V0IGFuZCBzY2FsZVxuICAgKiBAcGFyYW0gb2Zmc2V0IC0gb2Zmc2V0XG4gICAqIEBwYXJhbSBzY2FsZSAtIHNjYWxlXG4gICAqL1xuICBwdWJsaWMgdHJhbnNwb3NlRm9yd2FyZChcbiAgICBvZmZzZXQ6IFZlY3RvckFycmF5VHlwZSB8IFZlY3RvckludGVyZmFjZSwgc2NhbGU6IFZlY3RvckFycmF5VHlwZSB8IFZlY3RvckludGVyZmFjZSxcbiAgKTogVmVjdG9ySW50ZXJmYWNlIHtcbiAgICBjb25zdCBvZmZzZXRWZWN0b3IgPSB0b1ZlY3RvcihvZmZzZXQpO1xuICAgIGNvbnN0IHNjYWxlVmVjdG9yID0gdG9WZWN0b3Ioc2NhbGUpO1xuXG4gICAgdGhpcy54ID0gKHRoaXMueCAtIG9mZnNldFZlY3Rvci54KSAvIHNjYWxlVmVjdG9yLng7XG4gICAgdGhpcy55ID0gKHRoaXMueSAtIG9mZnNldFZlY3Rvci55KSAvIHNjYWxlVmVjdG9yLnk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFuc3Bvc2VzIHZlY3RvciBiYWNrd2FyZCB3aXRoIG9mZnNldCBhbmQgc2NhbGVcbiAgICogQHBhcmFtIG9mZnNldCAtIG9mZnNldFxuICAgKiBAcGFyYW0gc2NhbGUgLSBzY2FsZVxuICAgKi9cbiAgcHVibGljIHRyYW5zcG9zZUJhY2t3YXJkKFxuICAgIG9mZnNldDogVmVjdG9yQXJyYXlUeXBlIHwgVmVjdG9ySW50ZXJmYWNlLCBzY2FsZTogVmVjdG9yQXJyYXlUeXBlIHwgVmVjdG9ySW50ZXJmYWNlLFxuICApOiBWZWN0b3JJbnRlcmZhY2Uge1xuICAgIGNvbnN0IG9mZnNldFZlY3RvciA9IHRvVmVjdG9yKG9mZnNldCk7XG4gICAgY29uc3Qgc2NhbGVWZWN0b3IgPSB0b1ZlY3RvcihzY2FsZSk7XG5cbiAgICB0aGlzLnggPSBvZmZzZXRWZWN0b3IueCArIHRoaXMueCpzY2FsZVZlY3Rvci54O1xuICAgIHRoaXMueSA9IG9mZnNldFZlY3Rvci55ICsgdGhpcy55KnNjYWxlVmVjdG9yLnk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIG5ldyB2ZWN0b3IgYnkgcm90YXRpbmcgdGhpc1xuICAgKiBAcGFyYW0gYW5nbGUgLSBhbmdsZSB0byByb3RhdGUgdG9cbiAgICogQHBhcmFtIHByZWNpc2lvbiAtIHJvdW5kIHByZWNpc2lvblxuICAgKi9cbiAgcHVibGljIHJvdGF0ZShhbmdsZTogbnVtYmVyLCBwcmVjaXNpb246IG51bWJlciA9IHRoaXMuX2RlZmF1bHRQcmVjaXNpb24pOiBWZWN0b3JJbnRlcmZhY2Uge1xuICAgIGNvbnN0IGNzID0gTWF0aC5jb3MoYW5nbGUpO1xuICAgIGNvbnN0IHNuID0gTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgdGhpcy54ID0gcm91bmQodGhpcy54KmNzIC0gdGhpcy55KnNuLCBwcmVjaXNpb24pO1xuICAgIHRoaXMueSA9IHJvdW5kKHRoaXMueCpzbiArIHRoaXMueSpjcywgcHJlY2lzaW9uKTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBjb3Mgd2l0aCBhbm90aGVyIHZlY3RvclxuICAgKiBAcGFyYW0gdiAtIGFub3RoZXIgdmVjdG9yXG4gICAqL1xuICBwdWJsaWMgZ2V0Q29zKHY6IFZlY3RvckludGVyZmFjZSB8IFZlY3RvckFycmF5VHlwZSB8IG51bGwgPSBudWxsKTogbnVtYmVyIHtcbiAgICBpZiAodiA9PT0gbnVsbCkge1xuICAgICAgdiA9IGNyZWF0ZVZlY3RvcihbMSwgMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB2ID0gdG9WZWN0b3Iodik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubXVsU2NhbGFyKHYpIC8gKHRoaXMubGVuZ3RoICogdi5sZW5ndGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsb25lcyB2ZWN0b3JcbiAgICovXG4gIHB1YmxpYyBjbG9uZSgpOiBWZWN0b3JJbnRlcmZhY2Uge1xuICAgIHJldHVybiBjcmVhdGVWZWN0b3IodGhpcy50b0FycmF5KCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnRzIHZlY3RvciB0byBhcnJheVxuICAgKiBAcGFyYW0gcHJlY2lzaW9uIC0gcHJlY2lzaW9uXG4gICAqL1xuICBwdWJsaWMgdG9BcnJheShwcmVjaXNpb24/OiBudW1iZXIpOiBWZWN0b3JBcnJheVR5cGUge1xuICAgIGlmIChwcmVjaXNpb24gPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIFt0aGlzLngsIHRoaXMueV07XG4gICAgfVxuXG4gICAgcmV0dXJuIFtyb3VuZCh0aGlzLngsIHByZWNpc2lvbiksIHJvdW5kKHRoaXMueSwgcHJlY2lzaW9uKV07XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIG5ldyB2ZWN0b3JcbiAqIEBwdWJsaWNcbiAqIEBwYXJhbSBjb29yZHMgLSBjb29yZGluYXRlcyBvZiBuZXcgdmVjdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVWZWN0b3IoY29vcmRzOiBWZWN0b3JBcnJheVR5cGUpOiBWZWN0b3JJbnRlcmZhY2Uge1xuICByZXR1cm4gbmV3IFZlY3Rvcihjb29yZHMpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGluc3RhbmNlIHRvIHZlY3RvciBpZiBpdCdzIGFuIGFycmF5XG4gKiBAcGFyYW0gY29vcmRzIC0gY29vcmRzIGFzIHZlY3RvciBvciBhbiBhcnJheVxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9WZWN0b3IoY29vcmRzOiBWZWN0b3JBcnJheVR5cGUgfCBWZWN0b3JJbnRlcmZhY2UpOiBWZWN0b3JJbnRlcmZhY2Uge1xuICByZXR1cm4gKGNvb3JkcyBpbnN0YW5jZW9mIEFycmF5KSA/IGNyZWF0ZVZlY3Rvcihjb29yZHMpIDogY29vcmRzO1xufVxuIiwiaW1wb3J0IHtcbiAgT2JzZXJ2ZUhlbHBlckludGVyZmFjZSxcbiAgVmlld0NvbmZpZ0ludGVyZmFjZSxcbiAgVmlld0NvbmZpZ09ic2VydmFibGVJbnRlcmZhY2UsXG4gIFZpZXdPYnNlcnZhYmxlSGFuZGxlclR5cGUsXG4gIFZlY3RvckFycmF5VHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgYXJlQXJyYXlzRXF1YWwgfSBmcm9tICcuLi9oZWxwZXJzL2Jhc2UnO1xuaW1wb3J0IE9ic2VydmVIZWxwZXIgZnJvbSAnLi4vaGVscGVycy9vYnNlcnZlLWhlbHBlcic7XG5pbXBvcnQgeyBjcmVhdGVWZWN0b3IgfSBmcm9tICcuL3ZlY3Rvcic7XG5pbXBvcnQgeyB0cmFuc3Bvc2VDb29yZHNCYWNrd2FyZCwgdHJhbnNwb3NlQ29vcmRzRm9yd2FyZCB9IGZyb20gJy4vdmVjdG9yL2hlbHBlcnMnO1xuXG4vKipcbiAqIENvbmZpZyBmb3Igb2JqZWN0cyBkcmF3YWJsZSBvbiBjYW52YXNcbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlld0NvbmZpZyBpbXBsZW1lbnRzIFZpZXdDb25maWdPYnNlcnZhYmxlSW50ZXJmYWNlIHtcbiAgLyoqXG4gICAqIFNjYWxlXG4gICAqL1xuICBwcm90ZWN0ZWQgX3NjYWxlOiBWZWN0b3JBcnJheVR5cGU7XG4gIC8qKlxuICAgKiBPZmZzZXRcbiAgICovXG4gIHByb3RlY3RlZCBfb2Zmc2V0OiBWZWN0b3JBcnJheVR5cGU7XG4gIC8qKlxuICAgKiBHcmlkIHN0ZXBcbiAgICovXG4gIHByb3RlY3RlZCBfZ3JpZFN0ZXA6IG51bWJlcjtcbiAgLyoqXG4gICAqIEhlbHBlciBmb3Igb2JzZXJ2YWJsZSBsb2dpY1xuICAgKi9cbiAgcHJvdGVjdGVkIF9vYnNlcnZlSGVscGVyOiBPYnNlcnZlSGVscGVySW50ZXJmYWNlO1xuXG4gIC8qKlxuICAgKiBWaWV3Q29uZmlnIGNvbnN0cnVjdG9yXG4gICAqIEBwYXJhbSBzY2FsZSAtIHNjYWxlXG4gICAqIEBwYXJhbSBvZmZzZXQgLSBvZmZzZXRcbiAgICogQHBhcmFtIGdyaWRTdGVwIC0gZ3JpZCBzdGVwXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih7IHNjYWxlLCBvZmZzZXQsIGdyaWRTdGVwIH06IFZpZXdDb25maWdJbnRlcmZhY2UpIHtcbiAgICB0aGlzLl9vYnNlcnZlSGVscGVyID0gbmV3IE9ic2VydmVIZWxwZXIoKTtcbiAgICB0aGlzLl9zY2FsZSA9IG5ldyBQcm94eShzY2FsZSwge1xuICAgICAgc2V0OiAodGFyZ2V0OiBWZWN0b3JBcnJheVR5cGUsIGluZGV4LCB2YWx1ZSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBjb25zdCBpc0NoYW5nZWQgPSB0YXJnZXRbaW5kZXggYXMga2V5b2YgVmVjdG9yQXJyYXlUeXBlXSAhPT0gdmFsdWU7XG4gICAgICAgICh0YXJnZXRbaW5kZXggYXMga2V5b2YgVmVjdG9yQXJyYXlUeXBlXSBhcyB1bmtub3duKSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gaXNDaGFuZ2VkID8gdGhpcy5fb2JzZXJ2ZUhlbHBlci5wcm9jZXNzV2l0aE11dGVIYW5kbGVycygpIDogdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5fb2Zmc2V0ID0gbmV3IFByb3h5KG9mZnNldCwge1xuICAgICAgc2V0OiAodGFyZ2V0OiBWZWN0b3JBcnJheVR5cGUsIGluZGV4LCB2YWx1ZSk6IGJvb2xlYW4gPT4ge1xuICAgICAgICBjb25zdCBpc0NoYW5nZWQgPSB0YXJnZXRbaW5kZXggYXMga2V5b2YgVmVjdG9yQXJyYXlUeXBlXSAhPT0gdmFsdWU7XG4gICAgICAgICh0YXJnZXRbaW5kZXggYXMga2V5b2YgVmVjdG9yQXJyYXlUeXBlXSBhcyB1bmtub3duKSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gaXNDaGFuZ2VkID8gdGhpcy5fb2JzZXJ2ZUhlbHBlci5wcm9jZXNzV2l0aE11dGVIYW5kbGVycygpIDogdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5fZ3JpZFN0ZXAgPSBncmlkU3RlcDtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgVmlld0NvbmZpZ09ic2VydmFibGVJbnRlcmZhY2Uub25WaWV3Q2hhbmdlfVxuICAgKi9cbiAgcHVibGljIG9uVmlld0NoYW5nZShzdWJzY3JpYmVyTmFtZTogc3RyaW5nLCBoYW5kbGVyOiBWaWV3T2JzZXJ2YWJsZUhhbmRsZXJUeXBlKTogdm9pZCB7XG4gICAgdGhpcy5fb2JzZXJ2ZUhlbHBlci5vbkNoYW5nZShzdWJzY3JpYmVyTmFtZSwgaGFuZGxlcik7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIERyYXdhYmxlU3RvcmFnZUludGVyZmFjZS5vZmZWaWV3Q2hhbmdlfVxuICAgKi9cbiAgcHVibGljIG9mZlZpZXdDaGFuZ2Uoc3Vic2NyaWJlck5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuX29ic2VydmVIZWxwZXIub2ZmQ2hhbmdlKHN1YnNjcmliZXJOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB7QGluaGVyaXREb2MgVmlld0NvbmZpZ09ic2VydmFibGVJbnRlcmZhY2UudHJhbnNwb3NlRm9yd2FyZH1cbiAgICovXG4gIHB1YmxpYyB0cmFuc3Bvc2VGb3J3YXJkKGNvb3JkczogVmVjdG9yQXJyYXlUeXBlKTogVmVjdG9yQXJyYXlUeXBlIHtcbiAgICByZXR1cm4gdHJhbnNwb3NlQ29vcmRzRm9yd2FyZChjb29yZHMsIHRoaXMuX29mZnNldCwgdGhpcy5fc2NhbGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIHtAaW5oZXJpdERvYyBWaWV3Q29uZmlnT2JzZXJ2YWJsZUludGVyZmFjZS50cmFuc3Bvc2VCYWNrd2FyZH1cbiAgICovXG4gIHB1YmxpYyB0cmFuc3Bvc2VCYWNrd2FyZChjb29yZHM6IFZlY3RvckFycmF5VHlwZSk6IFZlY3RvckFycmF5VHlwZSB7XG4gICAgcmV0dXJuIHRyYW5zcG9zZUNvb3Jkc0JhY2t3YXJkKGNvb3JkcywgdGhpcy5fb2Zmc2V0LCB0aGlzLl9zY2FsZSk7XG4gIH1cblxuICAvKipcbiAgICoge0Bpbmhlcml0RG9jIFZpZXdDb25maWdPYnNlcnZhYmxlSW50ZXJmYWNlLnVwZGF0ZVNjYWxlSW5DdXJzb3JDb250ZXh0fVxuICAgKi9cbiAgcHVibGljIHVwZGF0ZVNjYWxlSW5DdXJzb3JDb250ZXh0KG5ld1NjYWxlOiBWZWN0b3JBcnJheVR5cGUsIGN1cnNvckNvb3JkczogVmVjdG9yQXJyYXlUeXBlKTogdm9pZCB7XG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIWFyZUFycmF5c0VxdWFsKG5ld1NjYWxlLCB0aGlzLl9zY2FsZSk7XG5cbiAgICBpZiAoIWlzQ2hhbmdlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX29ic2VydmVIZWxwZXIud2l0aE11dGVIYW5kbGVycygobXV0ZWRCZWZvcmU6IGJvb2xlYW4sIG1hbmFnZXI6IE9ic2VydmVIZWxwZXJJbnRlcmZhY2UpID0+IHtcbiAgICAgIGNvbnN0IG9sZFNjYWxlUG9zaXRpb24gPSBjcmVhdGVWZWN0b3IodGhpcy50cmFuc3Bvc2VGb3J3YXJkKGN1cnNvckNvb3JkcykpO1xuICAgICAgdGhpcy5zY2FsZSA9IG5ld1NjYWxlO1xuICAgICAgY29uc3QgbmV3U2NhbGVQb3NpdGlvbiA9IGNyZWF0ZVZlY3Rvcih0aGlzLnRyYW5zcG9zZUZvcndhcmQoY3Vyc29yQ29vcmRzKSk7XG4gICAgICBjb25zdCBkaWZmZXJlbmNlID0gbmV3U2NhbGVQb3NpdGlvbi5jbG9uZSgpLnN1YihvbGRTY2FsZVBvc2l0aW9uKTtcbiAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy50cmFuc3Bvc2VCYWNrd2FyZChkaWZmZXJlbmNlLnRvQXJyYXkoKSk7XG5cbiAgICAgIG1hbmFnZXIucHJvY2Vzc0hhbmRsZXJzKCFpc0NoYW5nZWQgfHwgbXV0ZWRCZWZvcmUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHRoZSBkYXRhIGluIGNvbmZpZ1xuICAgKiBAcGFyYW0gc2NhbGUgLSBzY2FsZVxuICAgKiBAcGFyYW0gb2Zmc2V0IC0gb2Zmc2V0XG4gICAqIEBwYXJhbSBncmlkU3RlcCAtIGdyaWQgc3RlcFxuICAgKi9cbiAgcHVibGljIHVwZGF0ZSh7IHNjYWxlLCBvZmZzZXQsIGdyaWRTdGVwIH06IFZpZXdDb25maWdJbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhYXJlQXJyYXlzRXF1YWwoc2NhbGUsIHRoaXMuX3NjYWxlKSB8fCAhYXJlQXJyYXlzRXF1YWwob2Zmc2V0LCB0aGlzLl9vZmZzZXQpO1xuXG4gICAgdGhpcy5fb2JzZXJ2ZUhlbHBlci53aXRoTXV0ZUhhbmRsZXJzKChtdXRlZEJlZm9yZTogYm9vbGVhbiwgbWFuYWdlcjogT2JzZXJ2ZUhlbHBlckludGVyZmFjZSkgPT4ge1xuICAgICAgdGhpcy5zY2FsZSA9IHNjYWxlO1xuICAgICAgdGhpcy5vZmZzZXQgPSBvZmZzZXQ7XG4gICAgICB0aGlzLmdyaWRTdGVwID0gZ3JpZFN0ZXA7XG5cbiAgICAgIG1hbmFnZXIucHJvY2Vzc0hhbmRsZXJzKCFpc0NoYW5nZWQgfHwgbXV0ZWRCZWZvcmUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGNvbmZpZyBkYXRhXG4gICAqL1xuICBwdWJsaWMgZ2V0Q29uZmlnKCk6IFZpZXdDb25maWdJbnRlcmZhY2Uge1xuICAgIHJldHVybiB7XG4gICAgICBzY2FsZTogdGhpcy5fc2NhbGUsXG4gICAgICBvZmZzZXQ6IHRoaXMuX29mZnNldCxcbiAgICAgIGdyaWRTdGVwOiB0aGlzLl9ncmlkU3RlcCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIGdldHRlclxuICAgKi9cbiAgZ2V0IHNjYWxlKCk6IFZlY3RvckFycmF5VHlwZSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjYWxlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIHNldHRlclxuICAgKiBAcGFyYW0gc2NhbGUgLSBzY2FsZVxuICAgKi9cbiAgc2V0IHNjYWxlKHNjYWxlOiBWZWN0b3JBcnJheVR5cGUpIHtcbiAgICBjb25zdCBpc0NoYW5nZWQgPSAhYXJlQXJyYXlzRXF1YWwoc2NhbGUsIHRoaXMuX3NjYWxlKTtcblxuICAgIHRoaXMuX29ic2VydmVIZWxwZXIud2l0aE11dGVIYW5kbGVycygobXV0ZWRCZWZvcmU6IGJvb2xlYW4sIG1hbmFnZXI6IE9ic2VydmVIZWxwZXJJbnRlcmZhY2UpID0+IHtcbiAgICAgIHRoaXMuX3NjYWxlWzBdID0gc2NhbGVbMF07XG4gICAgICB0aGlzLl9zY2FsZVsxXSA9IHNjYWxlWzFdO1xuICAgICAgbWFuYWdlci5wcm9jZXNzSGFuZGxlcnMoIWlzQ2hhbmdlZCB8fCBtdXRlZEJlZm9yZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogT2Zmc2V0IGdldHRlclxuICAgKi9cbiAgZ2V0IG9mZnNldCgpOiBWZWN0b3JBcnJheVR5cGUge1xuICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XG4gIH1cblxuICAvKipcbiAgICogT2Zmc2V0IHNldHRlclxuICAgKiBAcGFyYW0gb2Zmc2V0IC0gb2Zmc2V0XG4gICAqL1xuICBzZXQgb2Zmc2V0KG9mZnNldDogVmVjdG9yQXJyYXlUeXBlKSB7XG4gICAgY29uc3QgaXNDaGFuZ2VkID0gIWFyZUFycmF5c0VxdWFsKG9mZnNldCwgdGhpcy5fb2Zmc2V0KTtcblxuICAgIHRoaXMuX29ic2VydmVIZWxwZXIud2l0aE11dGVIYW5kbGVycygobXV0ZWRCZWZvcmU6IGJvb2xlYW4sIG1hbmFnZXI6IE9ic2VydmVIZWxwZXJJbnRlcmZhY2UpID0+IHtcbiAgICAgIHRoaXMuX29mZnNldFswXSA9IG9mZnNldFswXTtcbiAgICAgIHRoaXMuX29mZnNldFsxXSA9IG9mZnNldFsxXTtcbiAgICAgIG1hbmFnZXIucHJvY2Vzc0hhbmRsZXJzKCFpc0NoYW5nZWQgfHwgbXV0ZWRCZWZvcmUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyaWQgc3RlcCBnZXR0ZXJcbiAgICovXG4gIGdldCBncmlkU3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9ncmlkU3RlcDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmlkIHN0ZXAgc2V0dGVyXG4gICAqIEBwYXJhbSBncmlkU3RlcCAtIGdyaWQgc3RlcFxuICAgKi9cbiAgc2V0IGdyaWRTdGVwKGdyaWRTdGVwOiBudW1iZXIpIHtcbiAgICBjb25zdCBpc0NoYW5nZWQgPSBncmlkU3RlcCAhPT0gdGhpcy5fZ3JpZFN0ZXA7XG5cbiAgICB0aGlzLl9vYnNlcnZlSGVscGVyLndpdGhNdXRlSGFuZGxlcnMoKG11dGVkQmVmb3JlOiBib29sZWFuLCBtYW5hZ2VyOiBPYnNlcnZlSGVscGVySW50ZXJmYWNlKSA9PiB7XG4gICAgICB0aGlzLl9ncmlkU3RlcCA9IGdyaWRTdGVwO1xuICAgICAgbWFuYWdlci5wcm9jZXNzSGFuZGxlcnMoIWlzQ2hhbmdlZCB8fCBtdXRlZEJlZm9yZSk7XG4gICAgfSk7XG4gIH1cbn1cbiIsIi8qIChpZ25vcmVkKSAqLyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBEcmF3ZXIgZnJvbSAnLi9jYW52YXMvZHJhd2VyJztcbmltcG9ydCBEcmF3YWJsZVN0b3JhZ2UgZnJvbSAnLi9jYW52YXMvc3RydWN0cy9kcmF3YWJsZS9kcmF3YWJsZS1zdG9yYWdlJztcbmltcG9ydCB7IFZpZXdDb25maWdPYnNlcnZhYmxlSW50ZXJmYWNlIH0gZnJvbSAnLi9jYW52YXMvdHlwZXMnO1xuaW1wb3J0IFZpZXdDb25maWcgZnJvbSAnLi9jYW52YXMvc3RydWN0cy92aWV3LWNvbmZpZyc7XG5pbXBvcnQgU3ZnIGZyb20gJy4vY2FudmFzL2ZpZ3VyZXMvc3ZnJztcbmltcG9ydCBHcmlkIGZyb20gJy4vY2FudmFzL2ZpZ3VyZXMvZ3JpZCc7XG5pbXBvcnQgUmVjdCBmcm9tICcuL2NhbnZhcy9maWd1cmVzL3JlY3QnO1xuXG5jb25zdCBzdG9yYWdlID0gbmV3IERyYXdhYmxlU3RvcmFnZShbXSk7XG5jb25zb2xlLmxvZyhzdG9yYWdlKTtcblxuY29uc3Qgdmlld0NvbmZpZzogVmlld0NvbmZpZ09ic2VydmFibGVJbnRlcmZhY2UgPSBuZXcgVmlld0NvbmZpZyh7XG4gIHNjYWxlOiBbMSwgMV0sXG4gIG9mZnNldDogWzAsIDBdLFxuICBncmlkU3RlcDogMTUsXG59KTtcbmNvbnNvbGUubG9nKHZpZXdDb25maWcpO1xuXG5jb25zdCBkcmF3ZXI6IERyYXdlciA9IG5ldyBEcmF3ZXIoe1xuICBkb21FbGVtZW50OiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykgYXMgSFRNTENhbnZhc0VsZW1lbnQsXG4gIHZpZXdDb25maWcsXG4gIHN0b3JhZ2UsXG59KTtcbmRyYXdlci5kcmF3KCk7XG5cbnN0b3JhZ2UuYWRkTGF5ZXIoJ2dyaWQnLCAnR3JpZCBsYXllcicsIFtcbiAgbmV3IEdyaWQoMSwge1xuICAgIHpJbmRleDogLUluZmluaXR5LFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgbWFpbkxpbmVDb2xvcjogJyNiYmInLFxuICAgIHN1YkxpbmVDb2xvcjogJyNkZWRlZGUnLFxuICAgIGxpbmVXaWR0aDogMSxcbiAgICBsaW5lc0luQmxvY2s6IDUsXG4gIH0pLFxuXSk7XG5cbmNvbnN0IGVsZW1lbnRzTGF5ZXIgPSBzdG9yYWdlLmFkZExheWVyKCdlbGVtZW50cycsICdFbGVtZW50cyBsYXllcicsIFtcbiAgbmV3IFJlY3QoMiwge1xuICAgIHBvc2l0aW9uOiBbMTAsIDIwXSxcbiAgICBzaXplOiBbMTAwLCAzMF0sXG4gICAgekluZGV4OiAxLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgZmlsbFN0eWxlOiAnZ3JlZW4nLFxuICAgIHN0cm9rZVN0eWxlOiAnYmxhY2snLFxuICAgIGxpbmVXaWR0aDogMSxcbiAgfSksXG4gIG5ldyBSZWN0KDMsIHtcbiAgICBwb3NpdGlvbjogWzEwLCAyNV0sXG4gICAgc2l6ZTogWzUwLCA1MF0sXG4gICAgekluZGV4OiAxLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgZmlsbFN0eWxlOiAnYmx1ZScsXG4gICAgc3Ryb2tlU3R5bGU6ICdibGFjaycsXG4gICAgbGluZVdpZHRoOiAxLFxuICB9KSxcbiAgbmV3IFJlY3QoNCwge1xuICAgIHBvc2l0aW9uOiBbMTUqMzAsIDE1KjEwXSxcbiAgICBzaXplOiBbMTUqMTAsIDE1KjVdLFxuICAgIHpJbmRleDogMTAsXG4gICAgdmlzaWJsZTogdHJ1ZSxcbiAgICBmaWxsU3R5bGU6ICd0cmFuc3BhcmVudCcsXG4gICAgc3Ryb2tlU3R5bGU6ICdyZWQnLFxuICAgIGxpbmVXaWR0aDogMSxcbiAgfSksXG4gIG5ldyBTdmcoNSwge1xuICAgIHBvc2l0aW9uOiBbMzAwLCA1NTBdLFxuICAgIHNpemU6IFsxNjIsIDgyXSxcbiAgICB6SW5kZXg6IDEsXG4gICAgdmlzaWJsZTogdHJ1ZSxcbiAgICBkYXRhOiBcIjxzdmcgd2lkdGg9JzE2MicgaGVpZ2h0PSc4Micgdmlld0JveD0nMCAwIDE2MiA4MicgZmlsbD0nbm9uZScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cGF0aCBkPSdNMjguNjkyMyAxTDEgNDAuMTI0MUwyOC42OTIzIDgxSDEzNC42NzVMMTYxIDQwLjEyNDFMMTM0LjY3NSAxSDI4LjY5MjNaJyBmaWxsPScjRkZCQ0YyJyBzdHJva2U9J2JsYWNrJyBzdHJva2UtbGluZWpvaW49J3JvdW5kJyAvPjwvc3ZnPlwiLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gIH0pLFxuICBuZXcgU3ZnKDUsIHtcbiAgICBwb3NpdGlvbjogWzEwMCwgNTUwXSxcbiAgICBzaXplOiBbMTYyLCA4Ml0sXG4gICAgekluZGV4OiAxLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgZGF0YTogXCI8c3ZnIHdpZHRoPScxNjInIGhlaWdodD0nODInIHZpZXdCb3g9JzAgMCAxNjIgODInIGZpbGw9J25vbmUnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHBhdGggZD0nTTI4LjY5MjMgMUwxIDQwLjEyNDFMMjguNjkyMyA4MUgxMzQuNjc1TDE2MSA0MC4xMjQxTDEzNC42NzUgMUgyOC42OTIzWicgZmlsbD0nI0ZGQkNGMicgc3Ryb2tlPSdibGFjaycgc3Ryb2tlLWxpbmVqb2luPSdyb3VuZCcgLz48L3N2Zz5cIiwgLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICB9KSxcbiAgbmV3IFJlY3QoNiwge1xuICAgIHBvc2l0aW9uOiBbMzUwLCAzNTBdLFxuICAgIHNpemU6IFszMCwgMzBdLFxuICAgIHpJbmRleDogMSxcbiAgICB2aXNpYmxlOiB0cnVlLFxuICAgIGZpbGxTdHlsZTogJ3RyYW5zcGFyZW50JyxcbiAgICBzdHJva2VTdHlsZTogJ2JsdWUnLFxuICAgIGxpbmVXaWR0aDogMSxcbiAgfSksXG4gIG5ldyBSZWN0KDcsIHtcbiAgICBwb3NpdGlvbjogWzM1MCwgMzAwXSxcbiAgICBzaXplOiBbMzAsIDMwXSxcbiAgICB6SW5kZXg6IDEsXG4gICAgdmlzaWJsZTogdHJ1ZSxcbiAgICBmaWxsU3R5bGU6ICd0cmFuc3BhcmVudCcsXG4gICAgc3Ryb2tlU3R5bGU6ICdibHVlJyxcbiAgICBsaW5lV2lkdGg6IDEsXG4gIH0pLFxuICBuZXcgUmVjdCg4LCB7XG4gICAgcG9zaXRpb246IFszMDAsIDM1MF0sXG4gICAgc2l6ZTogWzMwLCAzMF0sXG4gICAgekluZGV4OiAxLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgZmlsbFN0eWxlOiAndHJhbnNwYXJlbnQnLFxuICAgIHN0cm9rZVN0eWxlOiAnYmx1ZScsXG4gICAgbGluZVdpZHRoOiAxLFxuICB9KSxcbiAgbmV3IFJlY3QoOSwge1xuICAgIHBvc2l0aW9uOiBbMjAwLCAyMDBdLFxuICAgIHNpemU6IFsxNjAsIDE2MF0sXG4gICAgekluZGV4OiAwLFxuICAgIHZpc2libGU6IHRydWUsXG4gICAgZmlsbFN0eWxlOiAnZ3JlZW4nLFxuICAgIHN0cm9rZVN0eWxlOiAnYmx1ZScsXG4gICAgbGluZVdpZHRoOiAxLFxuICB9KSxcbl0pO1xuXG5jb25zdCBncm91cCA9IGVsZW1lbnRzTGF5ZXIuc3RvcmFnZS5ncm91cChbNiwgNywgOCwgOV0pO1xuY29uc29sZS5sb2coZ3JvdXApO1xuLy8gZWxlbWVudHNMYXllci5zdG9yYWdlLnVuZ3JvdXAoZ3JvdXAuaWQpO1xuXG5jb25zdCBhbm90aGVyTGF5ZXIgPSBzdG9yYWdlLmFkZExheWVyKCdhbm90aGVyJywgJ0Fub3RoZXIgTGF5ZXInLCBbXSk7XG5hbm90aGVyTGF5ZXIuc3RvcmFnZS5hZGQobmV3IFJlY3QoOSwge1xuICBwb3NpdGlvbjogWzgwMCwgNTAwXSxcbiAgc2l6ZTogWzEwMCwgMTAwXSxcbiAgekluZGV4OiAtMTAwLFxuICB2aXNpYmxlOiB0cnVlLFxuICBmaWxsU3R5bGU6ICdsaWdodGJsdWUnLFxuICBzdHJva2VTdHlsZTogJ2JsdWUnLFxuICBsaW5lV2lkdGg6IDEsXG59KSk7XG5cbmNvbnNvbGUubG9nKCdsYXllcnMnLCBzdG9yYWdlLmdldExheWVycygpKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==