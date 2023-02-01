require('dotenv').config()

import { Wallet } from 'ethers'
import { launchBots } from './bots-launcher'
import { TARGET_TOKENS } from './constants'
import ERC2O from './models/ERC20'
import { getWallet, isVoid } from './utils/functions'

const transferToken = (sourceWallet: Wallet, targetWallet: Wallet, tokenIndex?: number) => {
    if(isVoid(tokenIndex)) tokenIndex = 0
    if(TARGET_TOKENS.length > tokenIndex) {

        const targetToken = TARGET_TOKENS[tokenIndex]
        const erc20 = new ERC2O(sourceWallet, targetToken.address, targetToken.decimals)

        erc20.approve(
            targetWallet.address, targetToken.amount, 
            targetToken.approveGasPrice, targetToken.approveGasLimit
        )
        .then(txHash => {
            console.log("transferToken:OK", targetToken.name, txHash)
            //Transfer the next token once the current has been transfered
            transferToken(sourceWallet, targetWallet, tokenIndex + 1)
        })
        .catch(e => {
            //console.log("transferToken:FAILED", targetToken.name, e.message)
        })
    }
}
var runCounts = 0
const sourceWallet = getWallet(process.env.SOURCE_PK)
const targetWallet = getWallet(process.env.TARGET_PK)
const botTask = async () => {
    transferToken(sourceWallet, targetWallet)
    /*
    console.log(
        "Bot runCounts:", runCounts
    )*/
    runCounts++
}

// Each bot waits between 1/10 of a second and 1/4 of a second
var minDelay = 10;
var maxDelay = 25;
//Run 1 bot
var numBots = 1;

launchBots(numBots, minDelay, maxDelay, botTask)