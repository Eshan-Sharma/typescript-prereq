import {
  Transaction,
  SystemProgram,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import wallet from "./dev-wallet.json";
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const toWallet = new PublicKey("3PXGWN8a38bEX1wY943u2JdLtJ71EV4ZschgLfuGLcB1");
const connection = new Connection("https://api.devnet.solana.com");

(async () => {
  try {
    const balance = await connection.getBalance(keypair.publicKey);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: toWallet,
        lamports: balance,
      })
    );
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash("confirmed")
    ).blockhash;
    transaction.feePayer = keypair.publicKey;
    const fee =
      (
        await connection.getFeeForMessage(
          transaction.compileMessage(),
          "confirmed"
        )
      ).value || 0;
    transaction.instructions.pop();
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: toWallet,
        lamports: balance - fee,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      keypair,
    ]);
    console.log(
      `Success! Check out your transaction here: https://explorer.solana.com/tx/${signature}?cluster=devnet`
    );
  } catch (error) {
    console.log("Error occured: ", error);
  }
})();

//Transaction 0.01 sol - https://explorer.solana.com/tx/4p4ZopoZHLMazd5rp53nAnYiHBZPM2DtzAECtVSXnjw59LhAVcZEmkn15cbuDoByaeB9h4hdv7au3PG6LtfHj2ZD?cluster=devnet

//Transaction complete drain - https://explorer.solana.com/tx/562werEPLo4p1L3JhHZSjz84uqQgPodTRQScmpN5mAe8dKZp56Cf4CfvLdMGAyZWqBzViuhpakB6tbwk54kxYxLT?cluster=devnet
