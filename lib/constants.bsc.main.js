"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TARGET_TOKENS = exports.BNB = void 0;
const ethers_1 = require("ethers");
exports.BNB = {
    transferGasLimit: ethers_1.BigNumber.from(21000),
    transferGasPrice: ethers_1.BigNumber.from(5).mul(ethers_1.BigNumber.from("1000000000"))
};
exports.TARGET_TOKENS = [
    {
        name: "MetaWar",
        address: "0x43a172c44dC55c2B45BF9436cF672850FC8bA046",
        decimals: 18,
        amount: 10000,
        approveGasLimit: ethers_1.BigNumber.from(100000),
        approveGasPrice: ethers_1.BigNumber.from(6).mul(ethers_1.BigNumber.from("1000000000")),
        transferGasLimit: ethers_1.BigNumber.from(300000),
        transferGasPrice: ethers_1.BigNumber.from(6).mul(ethers_1.BigNumber.from("1000000000"))
    }, /*
    {
        name: "Terk",
        address: "0x53035E4e14fb3f82C02357B35d5cC0C5b53928B4",
        decimals: 18,
        amount: 2000,
        transferGasLimit: BigNumber.from(228828),
        transferGasPrice: BigNumber.from(5).mul(BigNumber.from("1000000000"))
    }*/
];
//# sourceMappingURL=constants.bsc.main.js.map