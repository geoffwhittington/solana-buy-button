import React, { useEffect, useState } from "react";
import "./App.css";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import ProgressButton from "./progress_button";
import Button from "@material-ui/core/Button";

import "./Sol.css";

const web3 = require("@solana/web3.js");
var splToken = require("@solana/spl-token");

const getProvider = () => {
  return window.solana;
};

export default function SolanaBuyButton(props) {
  const [sending, setSending] = useState(false);

  const [provider, setProvider] = useState(getProvider());

  const connection = new Connection(props.network);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (provider) {
      provider.on("connect", () => {
        setConnected(true);
      });
      provider.on("disconnect", () => {
        setConnected(false);
      });
      // try to eagerly connect
      provider.connect({});
      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);

  useEffect(() => {
    // Will either automatically connect to Phantom, or do nothing.
    if (provider && !provider.connected) provider.connect({});
  }, []);

  async function doTransferTokens() {
    if (!provider) return;

    let myToken = await new splToken.Token(
      connection,
      new web3.PublicKey(props.tokenMint),
      splToken.TOKEN_PROGRAM_ID,
      provider.publicKey.toBase58()
    );

    var fromTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      provider.publicKey
    );

    var toTokenAccount = await myToken.getOrCreateAssociatedAccountInfo(
      new web3.PublicKey(props.targetWallet)
    );

    var transaction = new web3.Transaction().add(
      splToken.Token.createTransferInstruction(
        splToken.TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        provider.publicKey,
        [],
        props.amount * 10 ** props.decimals
      )
    );
    // Setting the variables for the transaction
    transaction.feePayer = provider.publicKey;

    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    try {
      // Request creator to sign the transaction (allow the transaction)
      let signed = await provider.signTransaction(transaction);

      // The signature is generated
      let signature = await connection.sendRawTransaction(signed.serialize());
      // Confirm whether the transaction went through or not
      await connection.confirmTransaction(signature);

      props.onSuccess(signature);
    } catch (e) {
      props.onError(e);
    }
  }

  return (
    <div>
      {!connected && (
        <Button
          variant="contained"
          onClick={() => {
            let p = getProvider();
            setProvider(p);
          }}
        >
          Connect
        </Button>
      )}
      {connected && (
        <ProgressButton
          variant="contained"
          loading={sending}
          onClick={async () => {
            setSending(true);
            await doTransferTokens();
            setSending(false);
          }}
        >
          {props.title}
        </ProgressButton>
      )}
    </div>
  );
}
