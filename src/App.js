import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import SolanaBuyButton from "./Sol.js";

function App() {
  return (
    <div className="App">
      <SolanaBuyButton
        title="Buy"
        network="https://api.mainnet-beta.solana.com"
        tokenMint="kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6"
        targetWallet="CDpMVDNK3RFmeAsgeodJbjxt6m39Es2bMMce6BQCKCSs"
        amount={100}
        decimals={5}
        onSuccess={(transaction) => {
          console.log("Success: ", transaction);
        }}
        onError={(e) => {
          console.log("Error: ", e);
        }}
      />
    </div>
  );
}

export default App;
