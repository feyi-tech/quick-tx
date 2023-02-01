"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWallet = exports.isVoid = void 0;
const ethers_1 = require("ethers");
const isVoid = v => {
    return v === undefined || v === null;
};
exports.isVoid = isVoid;
const getWallet = (privKeyOrMnemonic) => {
    if (privKeyOrMnemonic) {
        let w;
        if (privKeyOrMnemonic.includes(" ")) {
            w = ethers_1.Wallet.fromMnemonic(privKeyOrMnemonic, "m/44'/60'/0'/0/0");
            w = new ethers_1.Wallet(w.privateKey, new ethers_1.providers.JsonRpcProvider(process.env.RPC_URL));
        }
        else {
            w = new ethers_1.Wallet(privKeyOrMnemonic, new ethers_1.providers.JsonRpcProvider(process.env.RPC_URL));
        }
        return w;
    }
    else {
        throw new Error("No provate key or Mneminic");
    }
};
exports.getWallet = getWallet;
//# sourceMappingURL=functions.js.map