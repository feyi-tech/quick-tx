
const fs = require("fs")
const path = require("path")
const { cwd } = require("process")


if(!fs.existsSync(path.join(cwd(), "lib", "abi"))) {
    fs.mkdirSync(path.join(cwd(), "lib", "abi"))
}

fs.copyFileSync(path.join(cwd(), "src", "abi", "erc20.json"), path.join(cwd(), "lib", "abi", "erc20.json"))