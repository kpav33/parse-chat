import { useState } from "react";
import styles from "../styles/Auth.module.css";

// https://blog.back4app.com/real-time-nextjs-applications-with-parse/

// parsechatkpavtest.b4a.io => Server URL and Live Query

// @parse/react-ssr This is alpha version of the package, last publish 2 years ago, do we need to use ssr in the app?
// Live queries are meant to be used in real-time reactive applications, where just using the traditional query paradigm would come with some problems, like increased response time and high network and server usage. Live queries should be used in cases where you need to continuous update a page with fresh data coming from the database, which often happens in, but is not limited to, online games, messaging clients and shared to do lists.
// Probably best to use parse javascript sdk package directly and not the react versions, because react versions all seem to be in alpha and have been last published 2 years ago and are not active
export default function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUserName] = useState(false);
  const [password, setPassword] = useState(false);

  const toggleIsRegistering = () => setIsRegistering(!isRegistering);

  const handleLogin = () => {};
  const handleRegister = () => {};

  const handleAuth = () => (isRegistering ? handleRegister() : handleLogin());
  const [spanText, authText] = isRegistering
    ? ["already have an account ? log in!", "sign up"]
    : ["don't have an account ? register", "sign in"];

  return (
    <div className={styles.container}>
      <h1>Auth</h1>
      <input
        className={styles.input}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="user name"
      />
      <input
        className={styles.input}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
      />
      <span className={styles.toggleRegistering} onClick={toggleIsRegistering}>
        {spanText}
      </span>
      <button onClick={handleAuth}>{authText}</button>
    </div>
  );
}
