/// <reference types="node" />
import type Transport from "@ledgerhq/hw-transport";
import BIPPath from "bip32-path";
/**
 * Axia API
 *
 * @example
 * import Axia from "@obsidiansystems/hw-app-axia";
 * const axia = new Axia(transport);
 */
export default class Axia {
    transport: Transport;
    logger: (msg: string) => void;
    CLA: number;
    MAX_APDU_SIZE: number;
    MAX_HRP_LENGTH: number;
    INS_VERSION: number;
    INS_GET_WALLET_ID: number;
    INS_PROMPT_PUBLIC_KEY: number;
    INS_PROMPT_EXT_PUBLIC_KEY: number;
    INS_SIGN_HASH: number;
    INS_SIGN_TRANSACTION: number;
    constructor(transport: Transport, scrambleKey?: string, logger?: (msg: string) => void);
    /**
     * get Axia address for a given BIP-32 path.
     *
     * @param derivation_path a path in BIP 32 format
     * @return a buffer with a public key, and TODO: should be address, not public key
     * @example
     * await axia.getWalletPublicKey("44'/9000'/0'/0/0");
     */
    getWalletAddress(derivation_path: string, hrp?: string): Promise<Buffer>;
    /**
     * get extended public key for a given BIP-32 path.
     *
     * @param derivation_path a path in BIP-32 format
     * @return an object with a buffer for the public key data and a buffer for the chain code
     * @example
     * await axia.getWalletExtendedPublicKey("44'/9000'/0'/0/0");
     */
    getWalletExtendedPublicKey(derivation_path: string): Promise<{
        public_key: Buffer;
        chain_code: Buffer;
    }>;
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
    signHash(derivationPathPrefix: BIPPath, derivationPathSuffixes: Array<BIPPath>, hash: Buffer): Promise<Map<string, Buffer>>;
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
    signTransaction(derivationPathPrefix: BIPPath, derivationPathSuffixes: Array<BIPPath>, txn: Buffer, changePath?: BIPPath): Promise<{
        hash: Buffer;
        signatures: Map<string, Buffer>;
    }>;
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
    getAppConfiguration(): Promise<{
        version: string;
        commit: string;
        name: string;
    }>;
    /**
     * Get the wallet identifier for the Ledger wallet
     *
     * @return a byte string
     * @example
     * console.log((await axia.getWalletId()).toString("hex"));
     *
     * 79c46bc3
     */
    getWalletId(): Promise<Buffer>;
    _collectSignaturesFromSuffixes(suffixes: Array<BIPPath>, ins: number, p1NotDone: number, p1Done: number): Promise<Map<string, Buffer>>;
    uInt8Buffer(uint8: number): Buffer;
    uInt32BEBuffer(uint32: number): Buffer;
    encodeBip32Path(path: BIPPath): Buffer;
}
//# sourceMappingURL=Axia.d.ts.map