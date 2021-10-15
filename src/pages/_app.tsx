import React, { useEffect } from "react";
import { useRouter } from "next/router";
import theme from "theme";
import Head from "next/head";
import dynamic from "next/dynamic";
import * as ethers from "ethers";
import ReactGA from "react-ga";
import { Global } from "@emotion/react";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3ReactManager } from "components/web3-manager";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { LayerProvider } from "components/layer-manager";

const Web3ReactProviderDefault = dynamic(() => import("components/web3-network"), {
  ssr: false,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 20 * 1000,
    },
  },
});

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

function MetaTags() {
  return (
    <Head>
      <meta name="title" content="Hermes Defi" />
      <meta
        name="description"
        content="Hermes Finance aka Hermes defi is a decentralized hybrid yield optimizer (yield farm and yield aggregator) based in the community feedback. Blessed by the gods!"
      />

      {/* og tags */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://metatags.io/" />
      <meta property="og:title" content="Hermes Defi" />
      <meta
        property="og:description"
        content="Hermes Finance aka Hermes defi is a decentralized hybrid yield optimizer (yield farm and yield aggregator) based in the community feedback. Blessed by the gods!"
      />
      <meta property="og:image" content="https://ibb.co/pW4Xm7F" />

      {/* twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://metatags.io/" />
      <meta property="twitter:title" content="Hermes Defi" />
      <meta
        property="twitter:description"
        content="Hermes Finance aka Hermes defi is a decentralized hybrid yield optimizer (yield farm and yield aggregator) based in the community feedback. Blessed by the gods!"
      />
      <meta property="twitter:image" content="https://ibb.co/pW4Xm7F" />
    </Head>
  );
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.initialize("UA-200856510-2");
    }

    const handleRouteChange = (url: string) => {
      ReactGA.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <LayerProvider defaultValue={Component.layer || "l1"}>
      <GlobalHead />
      <MetaTags />

      <QueryClientProvider client={queryClient}>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactProviderDefault getLibrary={getLibrary}>
            <Web3ReactManager>
              <Component {...pageProps} />
            </Web3ReactManager>
          </Web3ReactProviderDefault>
        </Web3ReactProvider>

        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </LayerProvider>
  );
}

export default MyApp;
