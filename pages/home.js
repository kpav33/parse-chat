import { useLayoutEffect, useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";

import { encodeParseQuery, useParseQuery } from "@parse/react-ssr";
import Parse from "parse";
import { useRouter } from "next/router";

// If you export an async function called getServerSideProps from a page, Next.js will pre-render this page on each request using the data returned by getServerSideProps
// Encode the parseQuery and return it so it will be available for use in the component
export async function getServerSideProps() {
  const parseQuery = new Parse.Query("Message");
  parseQuery.ascending("createdAt");
  // Only show new messages sent after the initial page load
  // Commented means that user sees all messages that have ever been sent
  // parseQuery.greaterThanOrEqualTo("createdAt", new Date());

  return {
    props: {
      parseQuery: await encodeParseQuery(parseQuery), // Return encoded Parse Query for server side rendering
    },
  };
}

// Since we are using live queries with Parse the messages are automatically updated, so when using the live chat app, the messages will be updated real-time for all users
export default function Home({ parseQuery }) {
  // Pass encoded parseQuery from SSR to useParseQuery, which is a hook we will use for handling our data and real-time updates
  // Returns an array of parse objects, with our queried data
  const { results: messages } = useParseQuery(parseQuery);
  const router = useRouter();

  // const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const listRef = useRef(null);

  const handleSubmitMessage = (e) => {
    // e.preventDefault();
    // setMessages((prevMessages) => [...prevMessages, inputMessage]);
    // setInputMessage("");

    e.preventDefault();
    // Custom Classes (like Message) require Parse.Object.extend to define the schema and structure before creating instances
    // Custom classes must be extended first, to tell Parse we are working with a custom class, which we defined in Parse server schema. This method returns a constructor for the desired class, which we then use to create an instance of our custom class.
    const Message = Parse.Object.extend("Message");
    const newMessage = new Message();
    newMessage.save({
      content: inputMessage,
      // Get values from authed user
      senderName: Parse.User.current().get("username"),
      senderId: Parse.User.current().id,
    });
    setInputMessage("");
  };

  // Sort message so the most recent ones are at the bottom
  const order = (messages) => {
    return messages.sort((a, b) => {
      return a.get("createdAt") - b.get("createdAt");
    });
  };

  useLayoutEffect(() => {
    if (listRef && listRef.current && listRef.current.children) {
      const lastChild =
        listRef.current.children[listRef.current.children.length - 1];
      if (lastChild) {
        lastChild.scrollIntoView();
      }
    }
  }, [messages]);

  // Check if user is authenticated, if not return them to auth page
  useEffect(() => {
    async function checkUser() {
      // Use currentAsync instead of current, because React useEffect is asynchronous, since its designed to handle side effects
      // This way we also make sure that data is consistent and most current data is fetched from storage, since memory or local storage data could be outdated
      // If we didn't have this concerns we could use the .current() method instead, which retrieves the currently logged user either from memory or localStorage
      const currentUser = await Parse.User.currentAsync();
      if (!currentUser) {
        router.push("/");
      }
    }
    checkUser();
  }, []);

  const handleupdateInput = (e) => {
    setInputMessage(e.currentTarget.value);
  };

  // const messageClassName = (index) =>
  //   index % 2 === 0 ? styles.myMessage : null;
  // Change styling for messages that are not sent by the user, so it is easier to differentiate between user's and other's messages
  const messageClassName = (id) =>
    id === Parse.User.current().id ? styles.myMessage : null;

  // console.log(messages);

  const handleLogout = () => {
    // Parse.User.logIn(username, password).then((user) => {
    //   console.log(`successfully loged ${user.get("username")}`);
    //   router.push("/home");
    // });
    Parse.User.logOut().then((user) => {
      router.push("/");
    });
  };

  // return (
  //   <div className={styles.container}>
  //     <div className={styles.messagesContainer}>
  //       <ul ref={listRef}>
  //         {messages.map((message, index) => (
  //           <div key={index} className={messageClassName(index)}>
  //             <li className={messageClassName(index)}>
  //               <span className={messageClassName(index)}>username</span>
  //               <p>{message}</p>
  //             </li>
  //           </div>
  //         ))}
  //       </ul>
  //     </div>
  //     <form onSubmit={handleSubmitMessage} className={styles.actionsContainer}>
  //       <input value={inputMessage} onChange={handleupdateInput} />
  //       <button>send message</button>
  //     </form>
  //   </div>
  // );

  return (
    <div className={styles.container}>
      <div className={styles.messagesContainer}>
        <ul ref={listRef}>
          {messages &&
            order(messages).map((message, id) => (
              <div
                key={message.id}
                className={messageClassName(message.get("senderId"))}
              >
                <li className={messageClassName(message.get("senderId"))}>
                  <span className={messageClassName(message.get("senderId"))}>
                    {/* This are special Parse objects, use get function on them to get the desired values */}
                    {message.get("senderName")}
                  </span>
                  <p>{message.get("content")}</p>
                </li>
              </div>
            ))}
        </ul>
      </div>
      <form onSubmit={handleSubmitMessage} className={styles.actionsContainer}>
        <input value={inputMessage} onChange={handleupdateInput} />
        <button>send message</button>
      </form>
      <button onClick={handleLogout}>Sign Out</button>
    </div>
  );
}
