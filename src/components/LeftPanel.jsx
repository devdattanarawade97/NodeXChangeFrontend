import React from "react";
import "./LeftPanel.css";

export default function LeftPanel({ onNewThread, onSelectThread, threads, currentThread,firstMessages }) {

  console.log("current thread : ", currentThread);
  //log first message of thread
  console.log("first message of thread : ", firstMessages);

  return (
    <div className={`sidebar `}>
      <input
        type="text"
        placeholder="Search Chat..."
        className={`search-bar `}
      />
      <button className={`new-chat-button `} onClick={onNewThread}>
        New Chat
      </button>
      <div className="thread-list">
        {threads.map((thread, index) => (
          <div
            key={index}
            className={`thread-item ${currentThread === index ? 'active-thread' : ''}`}
            onClick={() => onSelectThread(index)}
          >
          {firstMessages[index] ? firstMessages[index] : "New Thread"}  
          </div>
        ))}
      </div>

    </div>
  );
}
