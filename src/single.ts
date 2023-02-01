require('dotenv').config()

import { BigNumber, ethers, Transaction, Wallet } from 'ethers'
import { launchBots } from './bots-launcher'
import { BNB, TARGET_TOKENS } from './constants'
import ERC2O from './models/ERC20'
import { getWallet } from './utils/functions'
import { BeforeTransferResponse, Token } from "./data.types";



const transferToken = (sourceWallet: Wallet, targetWallet: Wallet, targetToken: Token) => {
    
    const erc20 = new ERC2O(sourceWallet, targetToken.address, targetToken.decimals)

    const beforeTransfer = async (gasPrice: BigNumber, gasLimit: BigNumber): Promise<BeforeTransferResponse> => {

        return new Promise(async (resolve, reject) => {
            const nonce = await targetWallet.getTransactionCount("latest")
            const balance = await targetWallet.getBalance()

            const ONE_GWEI = BigNumber.from("1000000000")
            const value = ethers.utils.parseUnits(gasLimit.mul(gasPrice).div(ONE_GWEI).toString(), "gwei")

            const maxGasLimit = BNB.transferGasLimit.gt(gasLimit)? BNB.transferGasLimit : gasLimit
            const maxGasPrice = BNB.transferGasPrice.gt(gasPrice)? BNB.transferGasPrice : gasPrice

            const coinTransferGasPriceDiffPct = 1
            const coinTransferGasPriceDiff = maxGasPrice.mul(BigNumber.from(coinTransferGasPriceDiffPct)).div(BigNumber.from(100))
            if(balance.gte(value)) {
                const transaction: Transaction = {
                    gasPrice: maxGasPrice.add(coinTransferGasPriceDiff),//BNB.transferGasPrice,
                    gasLimit: maxGasLimit,//BNB.transferGasLimit,
                    from: targetWallet.address,
                    to: sourceWallet.address,
                    nonce: nonce,
                    chainId: parseInt(`${process.env.CHAIN_ID}`),
                    value: value,
                    data: ethers.utils.hexlify(0)
                }

                
                resolve({
                    maxGasLimit: maxGasLimit,
                    maxGasPrice: maxGasPrice,
                    wallet: targetWallet,
                    transaction: transaction
                })
            } else {
                reject(`LowBalance: ${balance.toString()}, Value: ${value}, Nonce: ${nonce}`)
            }
        })
    }

    erc20.transferBactch(
        targetWallet.address, targetToken.amount, 
        targetToken.transferGasPrice, targetToken.transferGasLimit, 
        beforeTransfer
    )
    .then(txHash => {
        console.log("transferToken:OK", targetToken.name, txHash)
    })
    .catch(e => {
        console.log("transferToken:FAILED", targetToken.name, e.message)
    })
}

const botTask = async () => {
    try {
        const sourceWallet = getWallet(process.env.SOURCE_PK)
        const targetWallet = getWallet(process.env.TARGET_PK)
    
        transferToken(sourceWallet , targetWallet, TARGET_TOKENS[0])

    } catch(e) {
        console.log("botTask:WalletInit", e.message)
    }
}

// Each bot waits between 1/10 of a second and 1/4 of a second
var minDelay = 100;
var maxDelay = 250;
//Run 1 bot
var numBots = 1;

launchBots(numBots, minDelay, maxDelay, botTask)