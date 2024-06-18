import "../styles/globals.css";
import { initializeParse } from "@parse/react-ssr";

// console.log(
//   process.env.NEXT_PUBLIC_PARSE_CUSTOM_URL,
//   process.env.NEXT_PUBLIC_PARSE_APP_ID,
//   process.env.NEXT_PUBLIC_PARSE_JS_KEY
// );
initializeParse(
  process.env.NEXT_PUBLIC_PARSE_CUSTOM_URL, //custom url
  // "https://parseapi.back4app.com/", //custom url
  process.env.NEXT_PUBLIC_PARSE_APP_ID, //app id
  process.env.NEXT_PUBLIC_PARSE_JS_KEY //js
);

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
