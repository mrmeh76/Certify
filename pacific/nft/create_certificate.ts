import { client as algodClient } from "@/lib/algodClient";
import algosdk, { EncodedSignedTransaction } from "algosdk";

export interface EvalDelta {
  action: number;
  bytes: string;
  uint: number;
}
export interface PendingTransactionResponse {
  "pool-error": string;
  /**
   * The raw signed transaction.
   */
  txn: EncodedSignedTransaction;
  /**
   * The application index if the transaction was found and it created an
   * application.
   */
  "application-index"?: number;
  /**
   * The number of the asset's unit that were transferred to the close-to address.
   */
  "asset-closing-amount"?: number;
  /**
   * The asset index if the transaction was found and it created an asset.
   */
  "asset-index"?: number;
  /**
   * Rewards in microalgos applied to the close remainder to account.
   */
  "close-rewards"?: number;
  /**
   * Closing amount for the transaction.
   */
  "closing-amount"?: number;
  /**
   * The round where this transaction was confirmed, if present.
   */
  "confirmed-round"?: number;
  /**
   * (gd) Global state key/value changes for the application being executed by this
   * transaction.
   */
  "global-state-delta"?: Record<string, EvalDelta>[];
  /**
   * Inner transactions produced by application execution.
   */
  "inner-txns"?: PendingTransactionResponse[];
  /**
   * (ld) Local state key/value changes for the application being executed by this
   * transaction.
   */
  "local-state-delta"?: Record<string, EvalDelta>[];
  /**
   * (lg) Logs for the application being executed by this transaction.
   */
  logs?: Uint8Array[];
  /**
   * Rewards in microalgos applied to the receiver account.
   */
  "receiver-rewards"?: number;
  /**
   * Rewards in microalgos applied to the sender account.
   */
  "sender-rewards"?: number;
}
interface CreateNFT {
  creator_address: string;
  name: string;
  asset_url: string;
}
async function createNft(nft_details: CreateNFT): Promise<algosdk.Transaction> {
  try {
    console.log("create nft ran");

    const suggestedParams = await algodClient.getTransactionParams().do();

    console.log("Reached here");
    const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: nft_details.creator_address,
      suggestedParams,
      defaultFrozen: false,
      // unitName: "",
      assetName: nft_details.name,
      manager: nft_details.creator_address,
      reserve: nft_details.creator_address,
      freeze: nft_details.creator_address,
      clawback: nft_details.creator_address,
      assetURL: nft_details.asset_url,
      total: 1,
      decimals: 0,
    });
    return txn;
  } catch (e: any) {
    console.log("Got an error during create certificate", e.message);
    throw new Error("Failed to create NFT", e.message);
  }
}
export const waitForConfirmation = async function (
  client: algosdk.Algodv2,
  txId: string,
  timeout: number
): Promise<PendingTransactionResponse> {
  if (client == null || txId == null || timeout < 0) {
    throw new Error("Bad arguments");
  }

  const status = await client.status().do();
  if (status === undefined) {
    throw new Error("Unable to get node status");
  }

  const startround = status["last-round"] + 1;
  let currentround = startround;

  while (currentround < startround + timeout) {
    const pendingInfo = (await client
      .pendingTransactionInformation(txId)
      .do()) as PendingTransactionResponse;
    if (pendingInfo !== undefined) {
      const confirmedRound = pendingInfo["confirmed-round"];
      if (confirmedRound && confirmedRound > 0) {
        return pendingInfo;
      } else {
        const poolError = pendingInfo["pool-error"];
        if (poolError != null && poolError.length > 0) {
          // If there was a pool error, then the transaction has been rejected!
          throw new Error(
            "Transaction " + txId + " rejected - pool error: " + poolError
          );
        }
      }
    }
    await client.statusAfterBlock(currentround).do();
    currentround++;
  }
  throw new Error(
    "Transaction " + txId + " not confirmed after " + timeout + " rounds!"
  );
};
export { createNft };
