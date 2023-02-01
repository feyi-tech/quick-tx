import { BigNumber } from "ethers";
import { Token } from "./data.types";

export const BNB = {
    transferGasLimit: BigNumber.from(21000),
    transferGasPrice: BigNumber.from(5).mul(BigNumber.from("1000000000"))
}
export const TARGET_TOKENS: Token[] = [
    {
        name: "MetaWar",
        address: "0x43a172c44dC55c2B45BF9436cF672850FC8bA046",
        decimals: 18,
        amount: 10000,
        approveGasLimit: BigNumber.from(100000),//from 66249
        approveGasPrice: BigNumber.from(6).mul(BigNumber.from("1000000000")),
        transferGasLimit: BigNumber.from(300000),//from 228828
        transferGasPrice: BigNumber.from(6).mul(BigNumber.from("1000000000"))
    },/*
    {
        name: "Terk",
        address: "0x53035E4e14fb3f82C02357B35d5cC0C5b53928B4",
        decimals: 18,
        amount: 2000,
        transferGasLimit: BigNumber.from(228828),
        transferGasPrice: BigNumber.from(5).mul(BigNumber.from("1000000000"))
    }*/
]