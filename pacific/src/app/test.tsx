"use client";
import { useWallet } from "@txnlab/use-wallet";
import { createNft, waitForConfirmation } from "../../nft/create_certificate";
import algosdk from "algosdk";
import { client as algodClient } from "@/lib/algodClient";
function Test() {
  const { signer, activeAddress, signTransactions, sendTransactions } =
    useWallet();

  async function handleCreate() {

    try {
      console.log("create nft");
      if (!activeAddress) {
        alert("connect wallet");
        throw new Error("Please connect wallet");
      }
      console.log("wallet connected")
      const testob = {
        name: "ttrttrttr",
        asset_url:
          "https://images.pexels.com/photos/5750479/pexels-photo-575.jpeg",
        creator_address: activeAddress,
      };
      const txn = await createNft(testob);
      const encodedTransaction = algosdk.encodeUnsignedTransaction(txn);
      const signedTxn = await signTransactions([encodedTransaction]);
      const waitRoundsToConfirm = 4;
      console.log("We are sending the transaction")
      
      const result = await sendTransactions(signedTxn, waitRoundsToConfirm);
      console.log("resultrrrrrr");
      console.log(result);
    } catch (e: any) {
      throw new Error(e);
    }
  }
  return (
    <div>
      <p><strong>TEST</strong></p>
      <button className="hover:text-slate-700 hover:text-lg" onClick={handleCreate}>create Nft</button>
    </div>
  );
}

export default Test;
