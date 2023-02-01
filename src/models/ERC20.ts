
import { BigNumber, ethers, Transaction, utils, Wallet } from 'ethers'
import { BeforeTransferResponse } from '../data.types'
const erc20Abi = require("../abi/erc20.json")

export default class ERC2O {

    wallet: Wallet
    tokenAddress: string
    tokenDecimals: number
    oneUnit: BigNumber

    constructor (wallet: Wallet, tokenAddress: string, tokenDecimals: number) {
        this.wallet = wallet
        this.tokenAddress = tokenAddress
        this.tokenDecimals = tokenDecimals
        this.oneUnit = BigNumber.from(10).pow(tokenDecimals)
    }

    sendTx(startNonce: number, tx: Transaction, totalDuplicates: number) {
        const promises = []
        for(var i = 0; i < totalDuplicates; i++) {
            promises.push(this.wallet.sendTransaction({...tx, nonce: startNonce + i}))
        }

        return Promise.all(promises)
    }

    approve(
        destinationAddress: string, transferAmount: number, 
        gasPrice: BigNumber, gasLimit: BigNumber) {
        
        return new Promise(async (resolve, reject) => {
            const erc20Interface = new utils.Interface(erc20Abi)
            const amount = BigNumber.from(transferAmount).mul(this.oneUnit)
            const rawData = erc20Interface.encodeFunctionData("approve", [destinationAddress, amount.toString()])

            this.wallet.getTransactionCount("latest")//pending | latest
            .then(async nonce => {
                const balance = await this.wallet.getBalance()

                //console.log("Balance:", balance.toString(), "GasFee:", gasPrice.mul(gasLimit).toString())
                if(balance.gte(gasPrice.mul(gasLimit))) {
                    //console.log("Nonce", nonce, "gasPrice", gasPrice.toString(), "gasLimit", gasLimit.toString())
                
                    //if(beforeApprove) beforeApprove(gasPrice, gasLimit)

                    const transaction: Transaction = {
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        from: this.wallet.address,
                        to: this.tokenAddress, // token contract address
                        data: rawData,
                        type: 0,
                        nonce: nonce,
                        chainId: parseInt(`${process.env.CHAIN_ID}`),
                        value: ethers.utils.parseUnits("0", "ether")
                    }

                    this.sendTx(nonce, transaction, 1)
                    .then(txHashes => {
                        resolve(txHashes)
                    })
                    .catch(e => {
                        reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`))
                    })

                } else {
                    reject(new Error(`LowBalance!!!`))
                }

            })
            .catch(e => {
                reject(new Error(`Type: RequestNonce, Message: ${e.message}`))
            })
        })
    }

    transferBactch(
        destinationAddress: string, transferAmount: number, 
        gasPrice: BigNumber, gasLimit: BigNumber,
        beforeTransfer?: (gasPrice: BigNumber, gasLimit: BigNumber) => Promise<BeforeTransferResponse>) {
        
        return new Promise(async (resolve, reject) => {
            const erc20Interface = new utils.Interface(erc20Abi)
            const amount = BigNumber.from(transferAmount).mul(this.oneUnit)
            const rawData = erc20Interface.encodeFunctionData("transfer", [destinationAddress, amount.toString()])


            this.wallet.getTransactionCount("latest")//pending | latest
            .then(async nonce => {
                console.log("Nonce", nonce, "gasPrice", gasPrice.toString())

                const transaction: Transaction = {
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    from: this.wallet.address,
                    to: this.tokenAddress, // token contract address
                    data: rawData,
                    type: 0,
                    nonce: nonce,
                    chainId: parseInt(`${process.env.CHAIN_ID}`),
                    value: ethers.utils.parseUnits("0", "ether")
                }
                
                if(beforeTransfer) {
                    beforeTransfer(gasPrice, gasLimit)
                    .then(b4Response => {
                        const promises = []
                        promises.push(b4Response.wallet.sendTransaction(b4Response.transaction))
                        promises.push(
                            this.wallet.sendTransaction({
                                ...transaction, 
                                gasPrice: b4Response.maxGasPrice,
                                gasLimit: b4Response.maxGasLimit
                            })
                        )

                        Promise.all(promises)
                        .then(txHashes => {
                            resolve(txHashes)
                        })
                        .catch(e => {
                            reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`))
                        })
                    })

                } else {
                    this.sendTx(nonce, transaction, 10)
                    .then(txHashes => {
                        resolve(txHashes)
                    })
                    .catch(e => {
                        reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`))
                    })
                }
                

            })
            .catch(e => {
                reject(new Error(`Type: RequestNonce, Message: ${e.message}`))
            })
        })
    }

    transfer(
        destinationAddress: string, transferAmount: number, 
        gasPrice: BigNumber, gasLimit: BigNumber,
        beforeTransfer?: (gasPrice: BigNumber, gasLimit: BigNumber) => void) {
        
        return new Promise(async (resolve, reject) => {
            const erc20Interface = new utils.Interface(erc20Abi)
            const amount = BigNumber.from(transferAmount).mul(this.oneUnit)
            const rawData = erc20Interface.encodeFunctionData("transfer", [destinationAddress, amount.toString()])


            this.wallet.getTransactionCount("latest")//pending | latest
            .then(async nonce => {
                console.log("Nonce", nonce, "gasPrice", gasPrice.toString())
                
                if(beforeTransfer) beforeTransfer(gasPrice, gasLimit)

                const transaction: Transaction = {
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    from: this.wallet.address,
                    to: this.tokenAddress, // token contract address
                    data: rawData,
                    type: 0,
                    nonce: nonce,
                    chainId: parseInt(`${process.env.CHAIN_ID}`),
                    value: ethers.utils.parseUnits("0", "ether")
                }

                this.sendTx(nonce, transaction, 10)
                .then(txHashes => {
                    resolve(txHashes)
                })
                .catch(e => {
                    reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`))
                })

            })
            .catch(e => {
                reject(new Error(`Type: RequestNonce, Message: ${e.message}`))
            })
        })
    }
}