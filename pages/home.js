import { useLayoutEffect, useState, useRef, useEffect } from "react";
import styles from "../styles/Home.module.css";

import { encodeParseQuery, useParseQuery } from "@parse/react-ssr";
import Parse from "parse";
import { useRouter } from "next/router";

export async function getServerSideProps() {
  const parseQuery = new Parse.Query("Message");
  parseQuery.ascending("createdAt");
  // Only show new messages
  // parseQuery.greaterThanOrEqualTo("createdAt", new Date());

  return {
    props: {
      parseQuery: await encodeParseQuery(parseQuery), // Return encoded Parse Query for server side rendering
    },
  };
}

export default function Auth({ parseQuery }) {
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
    const Message = Parse.Object.extend("Message");
    const newMessage = new Message();
    newMessage.save({
      content: inputMessage,
      senderName: Parse.User.current().get("username"),
      senderId: Parse.User.current().id,
    });
    setInputMessage("");
  };

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

  useEffect(() => {
    async function checkUser() {
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
