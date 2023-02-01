"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approve = exports.getWallet = void 0;
const ethers_1 = require("ethers");
const erc20Abi = require("./erc20.json");
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
        return null;
    }
};
exports.getWallet = getWallet;
const DATA_CACHE = {};
const getCacheKey = (func, args) => {
    var key = `${func}:`;
    args.forEach(arg => {
        key += `${arg}`;
    });
    return key;
};
const approve = async (ownerWallet, spenderAddress, tokenAmount, tokenAddress, tokenDecimal, gasLimit, gasPrice) => {
    const base = ethers_1.BigNumber.from(10);
    const valueToTransfer = base.pow(tokenDecimal).mul(ethers_1.BigNumber.from(tokenAmount));
    const iface = new ethers_1.utils.Interface(erc20Abi);
    const dataKey = getCacheKey("approve", [spenderAddress, valueToTransfer.toString()]);
    let rawData = DATA_CACHE[dataKey];
    if (!rawData) {
        rawData = iface.encodeFunctionData("approve", [spenderAddress, valueToTransfer.toString()]);
        DATA_CACHE[dataKey] = rawData;
    }
    const nonce = await ownerWallet.getTransactionCount("pending");
    var transaction = {
        gasLimit: gasLimit,
        gasPrice: ethers_1.BigNumber.from(gasPrice).mul(ethers_1.BigNumber.from("1000000000")),
        from: ownerWallet.address,
        to: tokenAddress,
        data: rawData,
        type: 0,
        nonce: nonce,
        chainId: 56
    };
    //transaction = await ownerWallet.populateTransaction(transaction);
    let signedTransaction = await ownerWallet.signTransaction(transaction);
    /*
    console.log("owner", ownerWallet.address)
    console.log("spender", spenderAddress)
    console.log("value", valueToTransfer.toString())
    console.log("rawData", rawData)
    console.log("nonce", nonce)
    console.log("transaction", transaction)
    console.log("signedTransaction", signedTransaction)*/
    const txHash = await ownerWallet.provider.sendTransaction(signedTransaction);
    return txHash;
};
exports.approve = approve;
//# sourceMappingURL=functions.js.map