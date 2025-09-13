import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { ClobDex } from "../target/types/clob_dex";

// Configure the client to use the local cluster
anchor.setProvider(anchor.AnchorProvider.env());

const program = anchor.workspace.ClobDex as anchor.Program<ClobDex>;


(async () => {
  const connection = program.provider.connection as web3.Connection;
  const wallet = pg.wallet;
  const provider = new anchor.AnchorProvider(connection, wallet, { commitment: "confirmed" });
  anchor.setProvider(provider);

  const program = program as anchor.Program;

  // Адрес рынка
  const MARKET_PUBKEY = new web3.PublicKey("HU94iRCmVLMaJtTZ5uKqbHNriPWs3NFNvDXBL32AYh9C");

  // Создание ордера
  const side = 0; // 0 = Buy, 1 = Sell
  const price = new anchor.BN(1000);
  const quantity = new anchor.BN(500);
  const clientOrderId = new anchor.BN(Date.now()); // уникальный id

  const [orderPda] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("order"),
      MARKET_PUBKEY.toBuffer(),
      wallet.publicKey.toBuffer(),
      Buffer.from(clientOrderId.toArray("le", 8)),
    ],
    program.programId
  );

  console.log("Placing order PDA:", orderPda.toBase58());

  try {
    const sig = await program.methods
      .placeLimitOrder(
        new anchor.BN(side),
        price,
        quantity,
        clientOrderId
      )
      .accounts({
        market: MARKET_PUBKEY,
        order: orderPda,
        owner: wallet.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    console.log("place_limit_order tx:", sig);

    const orderAcc: any = await program.account.order.fetch(orderPda);
    console.log("order before cancel:", {
      market: orderAcc.market.toBase58(),
      owner: orderAcc.owner.toBase58(),
      side: orderAcc.side.buy ? "BUY" : "SELL",
      price: orderAcc.price.toString(),
      quantity: orderAcc.quantity.toString(),
      remaining: orderAcc.remaining.toString(),
      clientOrderId: orderAcc.clientOrderId.toString(),
      isActive: orderAcc.isActive,
      createdAt: orderAcc.createdAt.toString(),
    });

    // 2. Отмена ордера
    const cancelSig = await program.methods
      .cancelOrder()
      .accounts({
        order: orderPda,
        owner: wallet.publicKey,
      })
      .rpc();

    console.log("cancel_order tx:", cancelSig);

    const canceledAcc: any = await program.account.order.fetch(orderPda);
    console.log("order after cancel:", {
      isActive: canceledAcc.isActive,
    });
  } catch (e) {
    console.error("client.ts error:", e);
  }
})();
