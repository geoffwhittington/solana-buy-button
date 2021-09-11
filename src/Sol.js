import React, { useEffect, useState } from "react";
import "./App.css";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { getOwnedTokenAccounts } from "./utils/tokens";
import ProgressButton from "./progress_button";
import Button from "@material-ui/core/Button";
import { parseTokenAccountData } from "./utils/tokens/data";
import "./Sol.css";

const web3 = require("@solana/web3.js");
var splToken = require("@solana/spl-token");

const getProvider = () => {
  return window.solana;
};

const NETWORK = clusterApiUrl("mainnet-beta");

export default function SolanaBuyButton(props) {
  const [message, setMessage] = useState();
  const [sending, setSending] = useState(false);

  const [provider, setProvider] = useState(getProvider());

  const connection = new Connection(NETWORK);
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
      provider.connect({ onlyIfTrusted: true });
      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);

  useEffect(() => {
    // Will either automatically connect to Phantom, or do nothing.
    if (provider) provider.connect({ onlyIfTrusted: true });
  }, []);

  async function getTokenAccount(publicKey, mint) {
    let tokenAccounts = await getOwnedTokenAccounts(connection, publicKey);

    return tokenAccounts
      .map(({ publicKey, accountInfo }) => {
        let data = parseTokenAccountData(accountInfo.data);
        return { publicKey, parsed: data };
      })
      .filter(({ parsed }) => parsed.mint.equals(mint))[0];
  }
  async function doTransferTokens() {
    if (!provider) return;

    const sourceSplTokenAccount = await getTokenAccount(
      new PublicKey(provider.publicKey.toBase58()),
      new PublicKey(props.tokenMint)
    );

    if (!sourceSplTokenAccount) {
      console.log("Missing destination token address");
      return;
    }

    const destinationSplTokenAccount = await getTokenAccount(
      new PublicKey(props.targetWallet),
      new PublicKey(props.tokenMint)
    );

    if (!destinationSplTokenAccount) {
      console.log("Missing destination token address");
      return;
    }

    var connection = new web3.Connection(web3.clusterApiUrl("mainnet-beta"));
    console.log("Connection: ", connection);

    var transaction = new web3.Transaction().add(
      splToken.Token.createTransferInstruction(
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        sourceSplTokenAccount.publicKey?.toBase58(),
        destinationSplTokenAccount.publicKey?.toBase58(),
        provider.publicKey,
        [],
        props.amount
      )
    );

    // Setting the variables for the transaction
    transaction.feePayer = provider.publicKey;

    let blockhashObj = await connection.getRecentBlockhash();
    transaction.recentBlockhash = await blockhashObj.blockhash;

    // Transaction constructor initialized successfully
    if (transaction) {
      console.log("Txn created successfully");
    }

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
