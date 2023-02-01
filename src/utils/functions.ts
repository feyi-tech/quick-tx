
import { Wallet, providers } from "ethers"

export const isVoid = v => {
    return v === undefined || v === null
}
export const getWallet = (privKeyOrMnemonic: string | undefined | null): Wallet => {

    if(privKeyOrMnemonic) {
        let w: Wallet
        if(privKeyOrMnemonic.includes(" ")) {
            w = Wallet.fromMnemonic(privKeyOrMnemonic, "m/44'/60'/0'/0/0");
            w = new Wallet(w.privateKey, new providers.JsonRpcProvider(process.env.RPC_URL))
    
        } else {
            w = new Wallet(privKeyOrMnemonic, new providers.JsonRpcProvider(process.env.RPC_URL))
        }

        return w
    } else {

        throw new Error("No provate key or Mneminic")
    }
}