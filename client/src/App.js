import { useEffect, useState } from "react";
import io from "socket.io-client";

 //const socket = io("http://localhost:4000");
const socket = io ("/");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let data = localStorage.getItem("messages");
    if (data) {
      setMessages(JSON.parse(data));
    }
    
  }, []); 

  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]); 

  useEffect(() => {
    const receiveMessage = (message) => {
      setMessages([...messages, message]);
    };

    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Yo",
    };
    setMessages([...messages, newMessage]);
    setMessage("");
    socket.emit("message", newMessage.body);
  };

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat de Dn.Yorch!</h1>
        

        <ul className="h-80 overflow-y-auto">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === "Yo" ? "bg-sky-700 ml-auto" : "bg-black"
              }`}
            >
              <b>{message.from}</b>:{message.body}
            </li>
          ))}
        </ul>

        <input
          name="message"
          type="text"
          placeholder="Write your message..."
          onChange={(e) => setMessage(e.target.value)}
          className="border-2 border-zinc-500 p-2 w-full text-black"
          value={message}
          autoFocus
        />
      </form>
    </div>
  );
}
