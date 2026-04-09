import { memo } from "react";
import { useChat } from "../context/ChatContext";
import { Pin, Trash2, Eraser, Ban, PinOff } from "lucide-react";

const Message = memo(function Message({ message }) {
  const { deleteForEveryone, deleteForMe, pinMessage, myId } = useChat();
  
  // This is the magic line that determines Left vs Right
  const isMe = message.senderId === myId;

  let baseStyle = "px-5 py-3.5 w-fit max-w-[80%] relative group transition-all duration-200 ";
  
  if (message.deleted) {
    baseStyle += "bg-transparent border-2 border-dashed border-gray-200 text-gray-400 rounded-2xl ";
  } else if (message.pinned) {
    baseStyle += "bg-indigo-50 text-indigo-900 border border-indigo-100 ring-4 ring-indigo-500/5 rounded-2xl ";
  } else {
    // Blue for ME (Right), Gray for OTHERS (Left)
    baseStyle += isMe 
      ? "bg-indigo-600 text-white border border-indigo-700 shadow-md rounded-2xl " 
      : "bg-[#f1f5f9] text-gray-800 border border-gray-100/50 rounded-2xl ";
  }

  // Flips the little "tail" corner of the chat bubble
  baseStyle += isMe ? "rounded-tr-sm" : "rounded-tl-sm";

  return (
    // items-end pushes it to the right, items-start keeps it on the left
    <div className={`flex flex-col w-full animate-fade-in ${isMe ? "items-end" : "items-start"}`}>
      <div className={baseStyle}>
        
        <div className="text-[15px] leading-relaxed flex items-start gap-2.5">
          {message.pinned && !message.deleted && (
            <Pin className={`w-4 h-4 shrink-0 mt-0.5 ${isMe ? "text-indigo-200 fill-indigo-200" : "text-indigo-500 fill-indigo-100"}`} />
          )}
          
          {message.deleted ? (
            <span className="flex items-center gap-2 text-sm font-medium opacity-70">
              <Ban className="w-4 h-4 text-gray-400 shrink-0" />
              This message was deleted
            </span>
          ) : (
            <span className={`font-medium tracking-tight ${isMe ? "text-white" : "text-gray-800"}`}>
              {message.content}
            </span>
          )}
        </div>

        {/* Action Buttons - Menu shifts left or right based on isMe */}
        {!message.deleted && (
          <div className={`opacity-0 group-hover:opacity-100 absolute -top-12 bg-gray-900 text-white shadow-xl rounded-full p-1 flex items-center gap-0.5 z-10 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 scale-95 group-hover:scale-100 ${isMe ? "right-0 origin-bottom-right" : "left-0 origin-bottom-left"}`}>
            
            <button 
              onClick={() => pinMessage(message._id)} 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${message.pinned ? "text-amber-400 hover:bg-gray-800" : "hover:bg-gray-800"}`}
            >
              {message.pinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
              {message.pinned ? "Unpin" : "Pin"}
            </button>
            
            <button 
              onClick={() => deleteForMe(message._id)} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              <Eraser className="w-3.5 h-3.5 text-gray-300" />
              Delete for me
            </button>
            
            <div className="w-px h-4 bg-gray-700 mx-1"></div>
            
            <button 
              onClick={() => deleteForEveryone(message._id)} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete for everyone
            </button>
          </div>
        )}
      </div>
      
      {/* Timestamp alignment shifts based on isMe */}
      <small className={`text-[11px] text-gray-400 font-semibold mt-2 tracking-wide ${isMe ? "mr-1" : "ml-1"}`}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </small>
    </div>
  );
});

export default Message;