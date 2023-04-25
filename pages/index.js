import { useEffect, useState } from 'react';
import Head from 'next/head'
import styles from "../styles/Home.module.scss";
import io from "socket.io-client";
import axios from 'axios';

const socket = io(process.env.NEXT_PUBLIC_SOCKETIO, { path: "/socket.io" }, {
  reconnection: true
})

const Home = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  // useEffect(() => {
  //   setMessageList(msgs)
  // }, [])

  // const fetchMessage = async () => {
  //   const { data } = await axios.get('http://localhost:4000/api/messages');
  //   setMessageList(data)
  // }
  // socket.on('output-messages', (data) => {
  //   setMessageList(data);
  // })

  useEffect(() => {
    socket.emit('getMessages');
    // socket.on('output', data => {
    //   setMessageList(data);
    // })
    socket.on('getMessages', data => {
      setMessageList(data);
    })
  });

  // useEffect(() => {
  // socket.on('typing', (data) => {
  //   setTypingUser(data);
  // })
  // }, [socket])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "message") {
      setMessage(value);
    } else {
      console.log("couldn't set state for input fields.")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();


    if (!username || !message) {
      return;
    }

    socket.emit('chatMessage', {
      username: username,
      message: message
    })

    socket.on('chatMessage', (message) => {

      setMessageList([...messageList, message])
    })

    setUsername("");
    setMessage("");
  }

  socket.on("msgSent", () => {
    setTypingUser("");
  });

  socket.on('typing', (data) => {
    setTypingUser(data);
  })

  const handleKeyPress = (e) => {
    socket.emit('typing', username);
  }


  return (
    <>
      <Head>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <title>socket.io chat app</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>chat zee</h1>
        </header>
        <div className={styles.messages__container}>
          {(messageList && messageList.length > 0) ? (<div>
            {messageList.map(m => (
              <div>
                <span className={styles.username}>{m.username}</span> <span> : </span>
                <span className={styles.message}>{m.message}</span>
              </div>
            ))}
          </div>) : (
            <div>
              <h3 className={styles.noMessageTitle}>No messages</h3>
            </div>)}
          {(typingUser) && <p className={styles.typingUser}>{typingUser} is typing a message</p>}
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type='text' name="username" onChange={handleChange}
            placeholder='username' value={username} />
          <input type='text' onKeyPress={handleKeyPress} name="message" onChange={handleChange}
            placeholder='message' value={message} />
          <button type="submit">send</button>
        </form>
        <footer className={styles.footer}>
          <p>developed by muhammad abu bakar siddique | <a href="mailto:abdurjoy2001@gmail.com">send email</a> </p>
        </footer>
      </div>
    </>
  )
}

// export async function getServerSideProps() {
//   const { data } = await axios.get('http://localhost:4000/api/messages');

//   return {
//     props: {
//       msgs: data
//     }
//   }
// }

export default Home;