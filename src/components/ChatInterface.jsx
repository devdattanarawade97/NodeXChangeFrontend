import React, { useState } from "react";
import "./ChatInterface.css";
import FileUploadIcon from "./FileUploadIcon";
//import arweave dependency
import Arweave from 'arweave';
import Helmet from "react-helmet";


// initialize an arweave instance
const arweave = Arweave.init({});


export default function ChatInterface({ onSendMessage, threadMessages, onNewMessage, currentMessage }) {


  //current model state variable
  const [currentModel, setCurrentModel] = useState("GPT");

  //current tx id state variable
  const [currentTxId, setCurrentTxId] = useState(null);

  const handleModelSwitch = () => {

  };

  const handleSendMessage = async (tx_id) => {

    try {
      console.log("current message : ", currentMessage);

      const response = await fetch(`https://2aszcqykhy7efzxgspd3wt2qeopaqgusjnfk3gg2byyom6irzcrq.arweave.net/Aej1dSUhfovRxql0dd2jdXnatxXciuEpV7bX-Vj3WTo`, {
        method: "GET",

      })
      const responseData = await response.json();
      //log response id 
      console.log("response id : ", responseData);
      //get relevant context text from backend

      const relevantText = await fetch("http://localhost:8000/api/fetch/find-relevant-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeddingsDocs: responseData.data,
          userQuestion: currentMessage,
        }),
      })

      const relevantTextData = await relevantText.json();
      //log relevant text data 

      const completeRelevantText = relevantTextData.message;
      console.log("relevant text data : ", completeRelevantText);
    
      onSendMessage(currentMessage, false , completeRelevantText);


    } catch (error) {
      console.log(`error while adding message to thread ${error}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  }


  const handleUploadedFile = async (params) => {

    try {




    } catch (error) {
      //log error 
      console.log("error while uploading file : ", error);

    }

  }

  return (
    <div className={`chat-interface`}>
      <Helmet>
        <title>NodeXChange</title>
      </Helmet>
      <div className="chat-messages">

        {threadMessages.map((message, index) => (
          <div key={index} className="chat-message">
            {index % 2 === 0 ? "You : " + message : "GPT : " + message}
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
        <FileUploadIcon
          onFileUpload={handleUploadedFile}
          onTxId={setCurrentTxId}
        ></FileUploadIcon>
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
