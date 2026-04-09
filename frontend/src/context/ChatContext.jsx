import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { socket } from "../socket";

const ChatContext = createContext();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  
  // Persistent ID so messages stay on the right side after a page refresh
  const [myId] = useState(() => {
    let storedId = localStorage.getItem("chat_user_id");
    if (!storedId) {
      storedId = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chat_user_id", storedId);
    }
    return storedId;
  });

  // 1. Initial Fetch & Socket Listeners
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch messages:", err));

    const handleReceive = (msg) => setMessages((prev) => [...prev, msg]);
    const handleDelete = (id) => setMessages((prev) => prev.map(m => m._id === id ? { ...m, deleted: true } : m));
    const handlePin = (id) => setMessages((prev) => prev.map(m => m._id === id ? { ...m, pinned: !m.pinned } : m));

    socket.on("receiveMessage", handleReceive);
    socket.on("messageDeleted", handleDelete);
    socket.on("messagePinned", handlePin);

    return () => {
      socket.off("receiveMessage", handleReceive);
      socket.off("messageDeleted", handleDelete);
      socket.off("messagePinned", handlePin);
    };
  }, []);

  // 2. Actions
  const sendMessage = async (content) => {
    if (!content.trim() || isSending) return;
    setIsSending(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/messages`, { 
        content: content.trim(),
        senderId: myId // Attaches your ID to the message in the database
      });
      socket.emit("sendMessage", res.data);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const deleteForEveryone = async (id) => {
    setMessages(prev => prev.map(m => m._id === id ? { ...m, deleted: true } : m));
    try {
      await axios.put(`${API_BASE_URL}/api/messages/delete/${id}`);
      socket.emit("deleteMessage", id);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const deleteForMe = (id) => {
    setMessages(prev => prev.filter(m => m._id !== id));
  };

  const pinMessage = async (id) => {
    const messageToToggle = messages.find(m => m._id === id);
    if (!messageToToggle) return;

    const newPinnedStatus = !messageToToggle.pinned;

    // Optimistic UI Update
    setMessages(prev => prev.map(m => 
      m._id === id ? { ...m, pinned: newPinnedStatus } : m
    ));

    try {
      await axios.put(`${API_BASE_URL}/api/messages/pin/${id}`, {
        pinned: newPinnedStatus 
      });
      socket.emit("pinMessage", id);
    } catch (error) {
      console.error("Toggle pin error:", error);
      setMessages(prev => prev.map(m => 
        m._id === id ? { ...m, pinned: !newPinnedStatus } : m
      ));
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isSending,
      myId,
      sendMessage,
      deleteForEveryone,
      deleteForMe,
      pinMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);