import { useState } from "react";
import { useChat } from "../context/ChatContext";
import { Send, Loader2 } from "lucide-react";

export default function InputBox() {
  const [content, setContent] = useState("");
  const { sendMessage, isSending } = useChat();

  const handleSend = () => {
    if (content.trim().length > 200) {
      alert("Message too long (Max 200 characters)");
      return;
    }
    sendMessage(content);
    setContent("");
  };

  return (
    <div className="p-6 bg-white border-t border-gray-100 z-10 rounded-b-[2.5rem]">
      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-1.5 rounded-full transition-all duration-300 focus-within:bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
        <input
          className="flex-1 px-5 py-3 bg-transparent focus:outline-none text-gray-800 placeholder-gray-400 text-[15px] font-medium"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a message..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isSending}
        />
        <button 
          className="px-6 py-3.5 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
          onClick={handleSend}
          disabled={isSending || !content.trim()}
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <span>Send</span>
              <Send className="w-4 h-4 shrink-0" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}