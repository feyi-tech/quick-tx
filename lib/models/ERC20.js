"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const erc20Abi = require("../abi/erc20.json");
class ERC2O {
    constructor(wallet, tokenAddress, tokenDecimals) {
        this.wallet = wallet;
        this.tokenAddress = tokenAddress;
        this.tokenDecimals = tokenDecimals;
        this.oneUnit = ethers_1.BigNumber.from(10).pow(tokenDecimals);
    }
    sendTx(startNonce, tx, totalDuplicates) {
        const promises = [];
        for (var i = 0; i < totalDuplicates; i++) {
            promises.push(this.wallet.sendTransaction(Object.assign(Object.assign({}, tx), { nonce: startNonce + i })));
        }
        return Promise.all(promises);
    }
    approve(destinationAddress, transferAmount, gasPrice, gasLimit) {
        return new Promise(async (resolve, reject) => {
            const erc20Interface = new ethers_1.utils.Interface(erc20Abi);
            const amount = ethers_1.BigNumber.from(transferAmount).mul(this.oneUnit);
            const rawData = erc20Interface.encodeFunctionData("approve", [destinationAddress, amount.toString()]);
            this.wallet.getTransactionCount("latest") //pending | latest
                .then(async (nonce) => {
                const balance = await this.wallet.getBalance();
                console.log("Balance:", balance.toString(), "GasFee:", gasPrice.mul(gasLimit).toString());
                if (balance.gte(gasPrice.mul(gasLimit))) {
                    console.log("Nonce", nonce, "gasPrice", gasPrice.toString(), "gasLimit", gasLimit.toString());
                    //if(beforeApprove) beforeApprove(gasPrice, gasLimit)
                    const transaction = {
                        gasPrice: gasPrice,
                        gasLimit: gasLimit,
                        from: this.wallet.address,
                        to: this.tokenAddress,
                        data: rawData,
                        type: 0,
                        nonce: nonce,
                        chainId: parseInt(`${process.env.CHAIN_ID}`),
                        value: ethers_1.ethers.utils.parseUnits("0", "ether")
                    };
                    this.sendTx(nonce, transaction, 1)
                        .then(txHashes => {
                        resolve(txHashes);
                    })
                        .catch(e => {
                        reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`));
                    });
                }
                else {
                    reject(new Error(`LowBalance!!!`));
                }
            })
                .catch(e => {
                reject(new Error(`Type: RequestNonce, Message: ${e.message}`));
            });
        });
    }
    transferBactch(destinationAddress, transferAmount, gasPrice, gasLimit, beforeTransfer) {
        return new Promise(async (resolve, reject) => {
            const erc20Interface = new ethers_1.utils.Interface(erc20Abi);
            const amount = ethers_1.BigNumber.from(transferAmount).mul(this.oneUnit);
            const rawData = erc20Interface.encodeFunctionData("transfer", [destinationAddress, amount.toString()]);
            this.wallet.getTransactionCount("latest") //pending | latest
                .then(async (nonce) => {
                console.log("Nonce", nonce, "gasPrice", gasPrice.toString());
                const transaction = {
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    from: this.wallet.address,
                    to: this.tokenAddress,
                    data: rawData,
                    type: 0,
                    nonce: nonce,
                    chainId: parseInt(`${process.env.CHAIN_ID}`),
                    value: ethers_1.ethers.utils.parseUnits("0", "ether")
                };
                if (beforeTransfer) {
                    beforeTransfer(gasPrice, gasLimit)
                        .then(b4Response => {
                        const promises = [];
                        promises.push(b4Response.wallet.sendTransaction(b4Response.transaction));
                        promises.push(this.wallet.sendTransaction(Object.assign(Object.assign({}, transaction), { gasPrice: b4Response.maxGasPrice, gasLimit: b4Response.maxGasLimit })));
                        Promise.all(promises)
                            .then(txHashes => {
                            resolve(txHashes);
                        })
                            .catch(e => {
                            reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`));
                        });
                    });
                }
                else {
                    this.sendTx(nonce, transaction, 10)
                        .then(txHashes => {
                        resolve(txHashes);
                    })
                        .catch(e => {
                        reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`));
                    });
                }
            })
                .catch(e => {
                reject(new Error(`Type: RequestNonce, Message: ${e.message}`));
            });
        });
    }
    transfer(destinationAddress, transferAmount, gasPrice, gasLimit, beforeTransfer) {
        return new Promise(async (resolve, reject) => {
            const erc20Interface = new ethers_1.utils.Interface(erc20Abi);
            const amount = ethers_1.BigNumber.from(transferAmount).mul(this.oneUnit);
            const rawData = erc20Interface.encodeFunctionData("transfer", [destinationAddress, amount.toString()]);
            this.wallet.getTransactionCount("latest") //pending | latest
                .then(async (nonce) => {
                console.log("Nonce", nonce, "gasPrice", gasPrice.toString());
                if (beforeTransfer)
                    beforeTransfer(gasPrice, gasLimit);
                const transaction = {
                    gasPrice: gasPrice,
                    gasLimit: gasLimit,
                    from: this.wallet.address,
                    to: this.tokenAddress,
                    data: rawData,
                    type: 0,
                    nonce: nonce,
                    chainId: parseInt(`${process.env.CHAIN_ID}`),
                    value: ethers_1.ethers.utils.parseUnits("0", "ether")
                };
                this.sendTx(nonce, transaction, 10)
                    .then(txHashes => {
                    resolve(txHashes);
                })
                    .catch(e => {
                    reject(new Error(`Type: SendTx, Nonce: ${nonce}, Message: ${e.message}`));
                });
            })
                .catch(e => {
                reject(new Error(`Type: RequestNonce, Message: ${e.message}`));
            });
        });
    }
}
exports.default = ERC2O;
//# sourceMappingURL=ERC20.js.map