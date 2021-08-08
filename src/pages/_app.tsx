import React, { useEffect } from "react";
import theme from "theme";
import Head from "next/head";
import dynamic from "next/dynamic";
import * as ethers from "ethers";
import ReactGA from "react-ga";
import { Global } from "@emotion/react";
import { ChakraProvider } from "@chakra-ui/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ReactManager } from "components/web3-manager";
import { QueryClient, QueryClientProvider } from "react-query";
import { useSetReferralCookie } from "hooks/referral";

const Web3ReactProviderDefault = dynamic(() => import("components/web3-network"), {
  ssr: false,
});

const queryClient = new QueryClient();

function getLibrary(provider: any): ethers.providers.Web3Provider {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

function GlobalHead() {
  return (
    <>
      <Head>
        <title>Hermes DeFi</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>

      {/* online fonts */}
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* google fonts */}
      <Global
        styles={`
          /* latin */
          @font-face {
            font-family: 'Momcake';
            src: url('/fonts/Momcake-Bold.eot');
            src: url('/fonts/Momcake-Bold.eot?#iefix') format('embedded-opentype'),
                url('/fonts/Momcake-Bold.woff2') format('woff2'),
                url('/fonts/Momcake-Bold.woff') format('woff'),
                url('/fonts/Momcake-Bold.ttf') format('truetype');
            font-weight: bold;
            font-style: normal;
            font-display: swap;
          }
        `}
      />
    </>
  );
}

function MyApp({ Component, pageProps }) {
  // check for referral query and store it in cookie
  useSetReferralCookie();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize("UA-200856510-2");
    }
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <GlobalHead />

      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactProviderDefault getLibrary={getLibrary}>
            <Web3ReactManager>
              <Component {...pageProps} />
            </Web3ReactManager>
          </Web3ReactProviderDefault>
        </Web3ReactProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
