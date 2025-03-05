import algosdk from "algosdk"

export const config = {

    algodToken: "",

    algodServer: "https://mainnet-api.algonode.cloud",

    algodPort: 443,

    indexerToken: "",

    indexerServer: "https://testnet-idx.algonode.network",

    indexerPort: "",

}
export const client = new algosdk.Algodv2(config.algodToken, config.algodServer, config.algodPort);