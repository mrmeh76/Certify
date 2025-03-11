import algosdk from "algosdk";

export const config = {
  algodToken: "",
  algodServer: "https://testnet-api.algonode.cloud", // Testnet endpoint
  algodPort: 443,
  indexerToken: "",
  indexerServer: "https://testnet-idx.algonode.cloud", // Testnet indexer
  indexerPort: "",
};

export const client = new algosdk.Algodv2(
  config.algodToken,
  config.algodServer,
  config.algodPort
);