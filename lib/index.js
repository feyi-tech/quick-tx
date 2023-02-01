"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const bots_launcher_1 = require("./bots-launcher");
const constants_1 = require("./constants");
const ERC20_1 = require("./models/ERC20");
const functions_1 = require("./utils/functions");
const transferToken = (sourceWallet, targetWallet, tokenIndex) => {
    if ((0, functions_1.isVoid)(tokenIndex))
        tokenIndex = 0;
    if (constants_1.TARGET_TOKENS.length > tokenIndex) {
        const targetToken = constants_1.TARGET_TOKENS[tokenIndex];
        const erc20 = new ERC20_1.default(sourceWallet, targetToken.address, targetToken.decimals);
        erc20.approve(targetWallet.address, targetToken.amount, targetToken.approveGasPrice, targetToken.approveGasLimit)
            .then(txHash => {
            console.log("transferToken:OK", targetToken.name, txHash);
            //Transfer the next token once the current has been transfered
            transferToken(sourceWallet, targetWallet, tokenIndex + 1);
        })
            .catch(e => {
            console.log("transferToken:FAILED", targetToken.name, e.message);
        });
    }
};
var runCounts = 0;
const sourceWallet = (0, functions_1.getWallet)(process.env.SOURCE_PK);
const targetWallet = (0, functions_1.getWallet)(process.env.TARGET_PK);
const botTask = async () => {
    transferToken(sourceWallet, targetWallet);
    console.log("Bot runCounts:", runCounts);
    runCounts++;
};
// Each bot waits between 1/10 of a second and 1/4 of a second
var minDelay = 5;
var maxDelay = 5;
//Run 1 bot
var numBots = 1;
(0, bots_launcher_1.launchBots)(numBots, minDelay, maxDelay, botTask);
//# sourceMappingURL=index.js.map