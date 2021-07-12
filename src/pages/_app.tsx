import theme from "theme";
import Head from "next/head";
import { Global } from "@emotion/react";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Hermes DeFi</title>
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

      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
