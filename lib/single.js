"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const ethers_1 = require("ethers");
const bots_launcher_1 = require("./bots-launcher");
const constants_1 = require("./constants");
const ERC20_1 = require("./models/ERC20");
const functions_1 = require("./utils/functions");
const transferToken = (sourceWallet, targetWallet, targetToken) => {
    const erc20 = new ERC20_1.default(sourceWallet, targetToken.address, targetToken.decimals);
    const beforeTransfer = async (gasPrice, gasLimit) => {
        return new Promise(async (resolve, reject) => {
            const nonce = await targetWallet.getTransactionCount("latest");
            const balance = await targetWallet.getBalance();
            const ONE_GWEI = ethers_1.BigNumber.from("1000000000");
            const value = ethers_1.ethers.utils.parseUnits(gasLimit.mul(gasPrice).div(ONE_GWEI).toString(), "gwei");
            const maxGasLimit = constants_1.BNB.transferGasLimit.gt(gasLimit) ? constants_1.BNB.transferGasLimit : gasLimit;
            const maxGasPrice = constants_1.BNB.transferGasPrice.gt(gasPrice) ? constants_1.BNB.transferGasPrice : gasPrice;
            const coinTransferGasPriceDiffPct = 1;
            const coinTransferGasPriceDiff = maxGasPrice.mul(ethers_1.BigNumber.from(coinTransferGasPriceDiffPct)).div(ethers_1.BigNumber.from(100));
            if (balance.gte(value)) {
                const transaction = {
                    gasPrice: maxGasPrice.add(coinTransferGasPriceDiff),
                    gasLimit: maxGasLimit,
                    from: targetWallet.address,
                    to: sourceWallet.address,
                    nonce: nonce,
                    chainId: parseInt(`${process.env.CHAIN_ID}`),
                    value: value,
                    data: ethers_1.ethers.utils.hexlify(0)
                };
                resolve({
                    maxGasLimit: maxGasLimit,
                    maxGasPrice: maxGasPrice,
                    wallet: targetWallet,
                    transaction: transaction
                });
            }
            else {
                reject(`LowBalance: ${balance.toString()}, Value: ${value}, Nonce: ${nonce}`);
            }
        });
    };
    erc20.transferBactch(targetWallet.address, targetToken.amount, targetToken.transferGasPrice, targetToken.transferGasLimit, beforeTransfer)
        .then(txHash => {
        console.log("transferToken:OK", targetToken.name, txHash);
    })
        .catch(e => {
        console.log("transferToken:FAILED", targetToken.name, e.message);
    });
};
const botTask = async () => {
    try {
        const sourceWallet = (0, functions_1.getWallet)(process.env.SOURCE_PK);
        const targetWallet = (0, functions_1.getWallet)(process.env.TARGET_PK);
        transferToken(sourceWallet, targetWallet, constants_1.TARGET_TOKENS[0]);
    }
    catch (e) {
        console.log("botTask:WalletInit", e.message);
    }
};
// Each bot waits between 1/10 of a second and 1/4 of a second
var minDelay = 100;
var maxDelay = 250;
//Run 1 bot
var numBots = 1;
(0, bots_launcher_1.launchBots)(numBots, minDelay, maxDelay, botTask);
//# sourceMappingURL=single.js.map