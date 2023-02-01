import { BigNumber } from "ethers";
import { Token } from "./data.types";

export const BNB = {
    transferGasLimit: BigNumber.from(21000),
    transferGasPrice: BigNumber.from(10).mul(BigNumber.from("1000000000"))
}
export const TARGET_TOKENS: Token[] = [
    {
        name: "MetaUFO",
        address: "0xA7b7b44194Cb5b339022B7C36AfAcAa323a4d248",
        decimals: 18,
        amount: 10000,
        approveGasLimit: BigNumber.from(100000),//from 66103
        approveGasPrice: BigNumber.from(10).mul(BigNumber.from("1000000000")),
        transferGasLimit: BigNumber.from(200000),//from 189241
        transferGasPrice: BigNumber.from(10).mul(BigNumber.from("1000000000"))
    }
]