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
        amount={10000}
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
