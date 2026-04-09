import { useEffect, useRef, useMemo } from "react";
import { useChat } from "../context/ChatContext";
import { Pin, Sparkles } from "lucide-react";
import Message from "./Message";
import InputBox from "./InputBox";

export default function ChatLayout() {
  const { messages } = useChat();
  const bottomRef = useRef(null);

  const pinnedMessages = useMemo(() => 
    messages.filter(m => m.pinned && !m.deleted), 
  [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col w-full max-w-5xl h-full sm:h-[85vh] bg-white sm:rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] ring-1 ring-gray-100 overflow-hidden relative">
      
      {/* Header */}
      <div className="px-8 py-5 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-30 flex items-center justify-between sticky top-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50 shadow-sm">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">Adverayze Chat</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></span>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pinned Messages Banner */}
      {pinnedMessages.length > 0 && (
        <div className="bg-indigo-50/50 border-b border-indigo-100 px-8 py-3 flex flex-col gap-2 z-20">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 uppercase tracking-widest">
            <Pin className="w-3.5 h-3.5" />
            <span>Pinned</span>
          </div>
          <div className="flex overflow-x-auto pb-2 gap-3 custom-scrollbar hide-scroll-arrows">
            {pinnedMessages.map(msg => (
              <div key={`pin-${msg._id}`} className="flex-none max-w-[280px] bg-white border border-indigo-100 shadow-sm px-4 py-2.5 rounded-xl">
                <p className="text-sm text-gray-700 font-medium truncate">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fcfcfd] custom-scrollbar">
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
        <div ref={bottomRef} className="h-4"></div>
      </div>

      {/* Input Area */}
      <InputBox />
    </div>
  );
}