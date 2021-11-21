import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import SolanaBuyButton from "./Sol.js";

function App() {
  return (
    <div className="App">
      <SolanaBuyButton
        title="Buy"
        tokenMint="kinXdEcpDQeHPEuQnqmUgtYykqKGVFq6CeVX5iAHJq6"
        targetWallet="DqMgcdZ7xrJpzxMRmpdiaPF5o4wmsYE8ZQ3fQBhowpra"
        amount={100}
        decimals={5}
        onSuccess={(transaction, signed_tx) => {
          console.log("Success: {} {}", transaction, signed_tx);
        }}
        onError={(e) => {
          console.log("Error: ", e);
        }}
      />
    </div>
  );
}

export default App;
