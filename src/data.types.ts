import { BigNumber, Transaction, Wallet } from "ethers";

export interface Token {
    name: string,
    address: string,
    decimals: number,
    amount: number,
    approveGasLimit?: BigNumber,
    approveGasPrice?: BigNumber
    transferGasLimit?: BigNumber,
    transferGasPrice?: BigNumber
}

export interface BeforeTransferResponse {
    maxGasLimit: BigNumber,
    maxGasPrice: BigNumber,
    wallet: Wallet,
    transaction: Transaction
}