import Head from "next/head";
import {
  createClient,
  configureChains,
  defaultChains,
  WagmiConfig,
  chain,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";

import { infuraProvider } from "wagmi/providers/infura";

import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";

import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";

import { store, persistor } from "../core/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// import { SessionProvider } from 'next-auth/react'
import "../styles/globals.scss";
import "antd/dist/antd.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

const { provider, webSocketProvider, chains } = configureChains(defaultChains, [
  infuraProvider({ apiKey: "6fe73d73563b4e56aef1516412dfe130" }),
]);

// const { provider, webSocketProvider, chains } = configureChains(
//   // [chain.mainnet],
//   [infuraProvider({ apiKey: "6fe73d73563b4e56aef1516412dfe130" })]
// );

const client = createClient({
  provider,
  webSocketProvider,
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
  ],
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Hadaro BETA</title>
        <meta name="description" content="Hadaro NFT Rental" />
        <link rel="icon" href="/hadaro-icon.png" />
      </Head>
      <ErrorBoundary>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <WagmiConfig client={client}>
              <Component {...pageProps} />
            </WagmiConfig>
          </PersistGate>
        </Provider>
      </ErrorBoundary>
    </>
  );
}

export default MyApp;
