"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bip32_path_1 = __importDefault(require("bip32-path"));
var create_hash_1 = __importDefault(require("create-hash"));
/**
 * Axia API
 *
 * @example
 * import Axia from "@obsidiansystems/hw-app-axia";
 * const axia = new Axia(transport);
 */
var Axia = /** @class */ (function () {
    function Axia(transport, scrambleKey, logger) {
        if (scrambleKey === void 0) { scrambleKey = "Axia"; }
        if (logger === void 0) { logger = console.error; }
        this.CLA = 0x80;
        this.MAX_APDU_SIZE = 230;
        this.MAX_HRP_LENGTH = 24;
        this.INS_VERSION = 0x00;
        this.INS_GET_WALLET_ID = 0x01;
        this.INS_PROMPT_PUBLIC_KEY = 0x02;
        this.INS_PROMPT_EXT_PUBLIC_KEY = 0x03;
        this.INS_SIGN_HASH = 0x04;
        this.INS_SIGN_TRANSACTION = 0x05;
        this.transport = transport;
        this.logger = logger;
        if (scrambleKey) {
            transport.decorateAppAPIMethods(this, [
                "getAppConfiguration",
                "getWalletAddress",
                "getWalletExtendedPublicKey",
                "getWalletId",
                "signHash",
                "signTransaction",
            ], scrambleKey);
        }
    }
    /**
     * get Axia address for a given BIP-32 path.
     *
     * @param derivation_path a path in BIP 32 format
     * @return a buffer with a public key, and TODO: should be address, not public key
     * @example
     * await axia.getWalletPublicKey("44'/9000'/0'/0/0");
     */
    Axia.prototype.getWalletAddress = function (derivation_path, hrp) {
        if (hrp === void 0) { hrp = ""; }
        return __awaiter(this, void 0, void 0, function () {
            var cla, ins, p1, p2, data, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hrp.length > this.MAX_HRP_LENGTH) {
                            throw "Maximum Bech32 'human readable part' length exceeded";
                        }
                        cla = this.CLA;
                        ins = this.INS_PROMPT_PUBLIC_KEY;
                        p1 = hrp.length;
                        p2 = 0x00;
                        data = Buffer.concat([
                            Buffer.from(hrp, "latin1"),
                            this.encodeBip32Path(bip32_path_1["default"].fromString(derivation_path)),
                        ]);
                        return [4 /*yield*/, this.transport.send(cla, ins, p1, p2, data)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.slice(0, -2)];
                }
            });
        });
    };
    /**
     * get extended public key for a given BIP-32 path.
     *
     * @param derivation_path a path in BIP-32 format
     * @return an object with a buffer for the public key data and a buffer for the chain code
     * @example
     * await axia.getWalletExtendedPublicKey("44'/9000'/0'/0/0");
     */
    Axia.prototype.getWalletExtendedPublicKey = function (derivation_path) {
        return __awaiter(this, void 0, void 0, function () {
            var cla, ins, p1, p2, data, response, publicKeyLength, chainCodeOffset, chainCodeLength;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cla = this.CLA;
                        ins = this.INS_PROMPT_EXT_PUBLIC_KEY;
                        p1 = 0x00;
                        p2 = 0x00;
                        data = this.encodeBip32Path(bip32_path_1["default"].fromString(derivation_path));
                        return [4 /*yield*/, this.transport.send(cla, ins, p1, p2, data)];
                    case 1:
                        response = _a.sent();
                        publicKeyLength = response[0];
                        chainCodeOffset = 2 + publicKeyLength;
                        chainCodeLength = response[1 + publicKeyLength];
                        return [2 /*return*/, {
                                public_key: response.slice(1, 1 + publicKeyLength),
                                chain_code: response.slice(chainCodeOffset, chainCodeOffset + chainCodeLength)
                            }];
                }
            });
        });
    };
    /**
     * Sign a hash with a given set of BIP-32 paths.
     *
     * @param derivationPathPrefix a BIP-32 path that will act as the prefix to all other signing paths.
     * @param derivationPathSuffixes an array of BIP-32 path suffixes that will be
     *                               appended to the prefix to form the final path for signing.
     * @param hash 32-byte buffer containing the hash to sign
     * @return a map of path suffixes (as strings) to signature buffers
     * @example
     * const signatures = await axia.signHash(
     *   BIPPath.fromString("44'/9000'/0'"),
     *   [BIPPath.fromString("0/0")],
     *   Buffer.from("0000000000000000000000000000000000000000000000000000000000000000", "hex"));
     */
    Axia.prototype.signHash = function (derivationPathPrefix, derivationPathSuffixes, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var firstMessage, responseHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (hash.length != 32) {
                            throw "Hash buffer must be 32 bytes";
                        }
                        firstMessage = Buffer.concat([
                            this.uInt8Buffer(derivationPathSuffixes.length),
                            hash,
                            this.encodeBip32Path(derivationPathPrefix)
                        ]);
                        return [4 /*yield*/, this.transport.send(this.CLA, this.INS_SIGN_HASH, 0x00, 0x00, firstMessage)];
                    case 1:
                        responseHash = _a.sent();
                        if (!responseHash.slice(0, 32).equals(hash)) {
                            throw "Ledger reported a hash that does not match the input hash!";
                        }
                        return [2 /*return*/, this._collectSignaturesFromSuffixes(derivationPathSuffixes, this.INS_SIGN_HASH, 0x01, 0x81)];
                }
            });
        });
    };
    /**
     * Sign a transaction with a given set of BIP-32 paths.
     *
     * @param derivationPathPrefix a BIP-32 path that will act as the prefix to all other signing paths.
     * @param derivationPathSuffixes an array of BIP-32 path suffixes that will be
     *                               appended to the prefix to form the final path for signing.
     * @param txn binary of the transaction
     * @return an object with a hash of the transaction and a map of path suffixes (as strings) to signature buffers
     * @example
     * const signatures = await axia.signTransaction(
     *   BIPPath.fromString("44'/9000'/0'"),
     *   [BIPPath.fromString("0/0")],
     *   Buffer.from("...", "hex"),
     *   BIPPath.fromString("44'/9000'/0'/0'/0'"));
     * );
     */
    Axia.prototype.signTransaction = function (derivationPathPrefix, derivationPathSuffixes, txn, changePath) {
        return __awaiter(this, void 0, void 0, function () {
            var SIGN_TRANSACTION_SECTION_PREAMBLE, SIGN_TRANSACTION_SECTION_PAYLOAD_CHUNK, SIGN_TRANSACTION_SECTION_PAYLOAD_CHUNK_LAST, SIGN_TRANSACTION_SECTION_SIGN_WITH_PATH, SIGN_TRANSACTION_SECTION_SIGN_WITH_PATH_LAST, preamble, preamble_, remainingData, response, thisChunk, responseHash, expectedHash;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        SIGN_TRANSACTION_SECTION_PREAMBLE = 0x00;
                        SIGN_TRANSACTION_SECTION_PAYLOAD_CHUNK = 0x01;
                        SIGN_TRANSACTION_SECTION_PAYLOAD_CHUNK_LAST = 0x81;
                        SIGN_TRANSACTION_SECTION_SIGN_WITH_PATH = 0x02;
                        SIGN_TRANSACTION_SECTION_SIGN_WITH_PATH_LAST = 0x82;
                        preamble = Buffer.concat([
                            this.uInt8Buffer(derivationPathSuffixes.length),
                            this.encodeBip32Path(derivationPathPrefix)
                        ]);
                        if (!(changePath != undefined && changePath != null)) return [3 /*break*/, 2];
                        preamble_ = Buffer.concat([
                            preamble,
                            this.encodeBip32Path(changePath)
                        ]);
                        return [4 /*yield*/, this.transport.send(this.CLA, this.INS_SIGN_TRANSACTION, SIGN_TRANSACTION_SECTION_PREAMBLE, 0x01, preamble_)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.transport.send(this.CLA, this.INS_SIGN_TRANSACTION, SIGN_TRANSACTION_SECTION_PREAMBLE, 0x00, preamble)];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        remainingData = txn.slice(0);
                        _b.label = 5;
                    case 5:
                        if (!(remainingData.length > 0)) return [3 /*break*/, 7];
                        thisChunk = remainingData.slice(0, this.MAX_APDU_SIZE);
                        remainingData = remainingData.slice(this.MAX_APDU_SIZE);
                        return [4 /*yield*/, this.transport.send(this.CLA, this.INS_SIGN_TRANSACTION, remainingData.length > 0
                                ? SIGN_TRANSACTION_SECTION_PAYLOAD_CHUNK
                                : SIGN_TRANSACTION_SECTION_PAYLOAD_CHUNK_LAST, 0x00, thisChunk)];
                    case 6:
                        response = _b.sent();
                        return [3 /*break*/, 5];
                    case 7:
                        responseHash = response.slice(0, 32);
                        expectedHash = Buffer.from((0, create_hash_1["default"])('sha256').update(txn).digest());
                        if (!responseHash.equals(expectedHash)) {
                            throw "Ledger reported a hash that does not match the expected transaction hash!";
                        }
                        _a = {
                            hash: responseHash
                        };
                        return [4 /*yield*/, this._collectSignaturesFromSuffixes(derivationPathSuffixes, this.INS_SIGN_TRANSACTION, SIGN_TRANSACTION_SECTION_SIGN_WITH_PATH, SIGN_TRANSACTION_SECTION_SIGN_WITH_PATH_LAST)];
                    case 8: return [2 /*return*/, (_a.signatures = _b.sent(),
                            _a)];
                }
            });
        });
    };
    /**
     * Get the version of the Axia app installed on the hardware device
     *
     * @return an object with a version
     * @example
     * console.log(await axia.getAppConfiguration());
     *
     * {
     *   "version": "1.0.3",
     *   "commit": "abcdcefg"
     *   "name": "Axia"
     * }
     */
    Axia.prototype.getAppConfiguration = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, eatNBytes, eatWhile, _a, versionData, rest1, _b, commitData, rest2, _c, nameData, rest3;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.transport.send(this.CLA, this.INS_VERSION, 0x00, 0x00)];
                    case 1:
                        data = _d.sent();
                        eatNBytes = function (input, n) {
                            var out = input.slice(0, n);
                            return [out, input.slice(n)];
                        };
                        eatWhile = function (input, f) {
                            for (var i = 0; i < input.length; i++) {
                                if (!f(input[i])) {
                                    return [input.slice(0, i), input.slice(i)];
                                }
                            }
                            return [input, ""];
                        };
                        _a = __read(eatNBytes(data, 3), 2), versionData = _a[0], rest1 = _a[1];
                        _b = __read(eatWhile(rest1, function (c) { return c != 0; }), 2), commitData = _b[0], rest2 = _b[1];
                        _c = __read(eatWhile(rest2.slice(1), function (c) { return c != 0; }), 2), nameData = _c[0], rest3 = _c[1];
                        if (rest3.toString("hex") != "009000") {
                            this.logger("WARNING: Response data does not exactly match expected format for VERSION instruction");
                        }
                        return [2 /*return*/, {
                                version: "" + versionData[0] + "." + versionData[1] + "." + versionData[2],
                                commit: commitData.toString("latin1"),
                                name: nameData.toString("latin1")
                            }];
                }
            });
        });
    };
    /**
     * Get the wallet identifier for the Ledger wallet
     *
     * @return a byte string
     * @example
     * console.log((await axia.getWalletId()).toString("hex"));
     *
     * 79c46bc3
     */
    Axia.prototype.getWalletId = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.transport.send(this.CLA, this.INS_GET_WALLET_ID, 0x00, 0x00)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.slice(0, -2)];
                }
            });
        });
    };
    Axia.prototype._collectSignaturesFromSuffixes = function (suffixes, ins, p1NotDone, p1Done) {
        return __awaiter(this, void 0, void 0, function () {
            var resultMap, ix, suffix, message, isLastMessage, signatureData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resultMap = new Map();
                        ix = 0;
                        _a.label = 1;
                    case 1:
                        if (!(ix < suffixes.length)) return [3 /*break*/, 4];
                        suffix = suffixes[ix];
                        this.logger("Signing with " + suffix.toString(true));
                        message = this.encodeBip32Path(suffix);
                        isLastMessage = ix >= suffixes.length - 1;
                        return [4 /*yield*/, this.transport.send(this.CLA, ins, isLastMessage ? p1Done : p1NotDone, 0x00, message)];
                    case 2:
                        signatureData = _a.sent();
                        resultMap.set(suffix.toString(true), signatureData.slice(0, -2));
                        _a.label = 3;
                    case 3:
                        ix++;
                        return [3 /*break*/, 1];
                    case 4:
                        ;
                        return [2 /*return*/, resultMap];
                }
            });
        });
    };
    Axia.prototype.uInt8Buffer = function (uint8) {
        var buff = Buffer.alloc(1);
        buff.writeUInt8(uint8);
        return buff;
    };
    Axia.prototype.uInt32BEBuffer = function (uint32) {
        var buff = Buffer.alloc(4);
        buff.writeUInt32BE(uint32);
        return buff;
    };
    Axia.prototype.encodeBip32Path = function (path) {
        var pathArr = path.toPathArray();
        return Buffer.concat([this.uInt8Buffer(pathArr.length)].concat(pathArr.map(this.uInt32BEBuffer)));
    };
    return Axia;
}());
exports["default"] = Axia;
//# sourceMappingURL=Axia.js.map