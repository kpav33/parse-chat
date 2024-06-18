import "../styles/globals.css";
import { initializeParse } from "@parse/react-ssr";

// console.log(
//   process.env.NEXT_PUBLIC_PARSE_CUSTOM_URL,
//   process.env.NEXT_PUBLIC_PARSE_APP_ID,
//   process.env.NEXT_PUBLIC_PARSE_JS_KEY
// );

// Initialize parse with app id and js key, use custom url instead of general https://parseapi.back4app.com/, because we are using live queries. You can find the live query url in b4a dashboard under App Settings -> Server Settings -> Server URL and Live Query. This URL enables us to use it for real-time database.
// If we use general url instead of custom url the app no longer works correctly with real time updates, so the main thing that matters for real time updates is to setup the correct url, we don't need to use the react ssr package or anything, we could achieve the same thing by using the Parse SDK
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
