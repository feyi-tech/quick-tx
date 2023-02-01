"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TARGET_TOKENS = exports.BNB = void 0;
const ethers_1 = require("ethers");
exports.BNB = {
    transferGasLimit: ethers_1.BigNumber.from(21000),
    transferGasPrice: ethers_1.BigNumber.from(10).mul(ethers_1.BigNumber.from("1000000000"))
};
exports.TARGET_TOKENS = [
    {
        name: "MetaUFO",
        address: "0xA7b7b44194Cb5b339022B7C36AfAcAa323a4d248",
        decimals: 18,
        amount: 10000,
        approveGasLimit: ethers_1.BigNumber.from(100000),
        approveGasPrice: ethers_1.BigNumber.from(10).mul(ethers_1.BigNumber.from("1000000000")),
        transferGasLimit: ethers_1.BigNumber.from(200000),
        transferGasPrice: ethers_1.BigNumber.from(10).mul(ethers_1.BigNumber.from("1000000000"))
    }
];
//# sourceMappingURL=constants.js.map