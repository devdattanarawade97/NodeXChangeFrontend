import React, {useState } from "react";
import "./ChatInterface.css";

export default function ChatInterface({ onSendMessage,threadMessages,onNewMessage,currentMessage }) {
   

  //current model state variable
  const [currentModel, setCurrentModel] = useState("GPT");

  // const messages = [];

  const handleModelSwitch = () => {
   
  };

  const handleSendMessage = async () => {
    
    try {
      console.log("current message : ", currentMessage);
      onSendMessage(currentMessage, false);
     

    } catch (error) {
      console.log(`error while adding message to thread ${error}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`chat-interface`}>
      <div className="chat-messages">
        
        {threadMessages.map((message, index) => (
          <div key={index} className="chat-message">
            { index%2===0 ? "You : "+message : "GPT : "+message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <button
          onClick={handleModelSwitch}
          className={`model-switch-button `}
          aria-label="Switch AI model"
        >
          {currentModel.toUpperCase()}
        </button>
        <input
          type="text"
          placeholder="Ask any question using @address or @profile"
          value={currentMessage}
          onChange={(e) => onNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Handle Enter key press
          className="chat-text-input"
        />
        <button onClick={handleSendMessage} className={`send-button`}>
          Send
        </button>
      </div>
    </div>
  );
}
