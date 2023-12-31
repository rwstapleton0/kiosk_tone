import React from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import {
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";

const queryClient = new QueryClient();

// const { networkConfig } = createNetworkConfig({
//   localnet: { url: getFullnodeUrl("localnet") },
//   devnet: { url: getFullnodeUrl("devnet") },
//   testnet: { url: getFullnodeUrl("testnet") },
//   mainnet: { url: getFullnodeUrl("mainnet") },
// });

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

const networks = {
  testnet: client,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);
