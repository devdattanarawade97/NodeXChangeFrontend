
import './App.css';
import React, {  useEffect, useState } from "react";

 import "./App.css";

import LeftPanel from './components/LeftPanel';
import ChatInterface from './components/ChatInterface';


export default function App() {
   
  //threads state variable 
  const [threads, setThreads] = useState([]);
  //current msg state variable
  const [currentMessage, setCurrentMessage] = useState("");
  //current thread state variable
  const [currentThread, setCurrentThread] = useState(0);

  //set thread completion timestamp state variable
  const [threadCompletionTimestamp, setThreadCompletionTimestamp] = useState(null);
  //thread messages state variable
  const [threadMessages, setThreadMessages] = useState([]);
    //msg sent state variable
  const [messagesSent, setMessagesSent] = useState(false);
  //first message of thread state variable
  const [firstMessagesOfThread, setFirstMessagesOfThread] = useState([]);

  //async fetch thread run data
  async function fetchThreadRunData() {

    //log fetch run data called
    console.log("fetch thread run data called");

    console.log("current thread in use effect : ", threads[currentThread]);
      try {
        if (threads.length > 0) {

           setCurrentMessage("");
          const fetchThreadRunResponse = await fetch("http://localhost:8000/api/process/retrive-thread-messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              threadId: threads[currentThread],
              //  threadId: "thread_6853bIbP8RExBrKN0yXojaES",
            }),
          })
          const data = await fetchThreadRunResponse.json();
          console.log('retrive thread messages response : ', data);
          const threadMessagesResponse = data.message;
          const newMessages = threadMessagesResponse.map((message) =>  message[0]?.text.value).reverse();

          setThreadMessages(newMessages);
          // Append new messages to the existing threadMessages state
          // setThreadMessages((prevMessages) => [...prevMessages, ...newMessages]);
          console.log("run thread messages : ", threadMessages);
        }
   
      } catch (error) {
        console.log(error);
      }
  }
  
  useEffect(() => {
    //log thread completion timestamp
    console.log("thread completion timestamp in use effect: ", threadCompletionTimestamp);
    setTimeout(() => {
      fetchThreadRunData()
    }, threadCompletionTimestamp);
    
      setMessagesSent(false);
   


  }, [ messagesSent , currentThread]);
  const handleNewThread = async () => {
   
      const threadIdResponse = await fetch("http://localhost:8000/api/process/create-thread", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         
          userId: 1,
        }),
      });
    //set thread id
    const data = await threadIdResponse.json();
    const threadId = data.message;
    console.log("created thread id response : ", threadId);
    setThreads([...threads, threadId]);
    //set current thread as last thread on creation of new thread
    console.log("current thread : ", currentThread);
    console.log("threads length : ", threads.length);
    setCurrentThread(threads.length);
    setThreadMessages([]);
  };

  // Handle Thread Selection
  const handleSelectThread = (index) => {
    //set current thread index
    setCurrentThread(index);
   
  };

  const handleSendMessage = async (newMessage , isGPTResponse) => {
      
    try {
      if(threadMessages.length==0){
        setFirstMessagesOfThread([...firstMessagesOfThread, newMessage]);
      }
        const addMessageToThread = await fetch("http://localhost:8000/api/process/run-thread", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: 1,
            threadId: threads[currentThread],
            isGPTResponse: isGPTResponse,
            message: newMessage,
          }),
        });
        //log add message to thread response
        const data = await addMessageToThread.json();
        console.log('add message to thread response : ', data);
        console.log("thread completion timestamp in frontend : ", data.completedAt);
        
        setMessagesSent(true);
        //set thread completion timestamp

        setThreadCompletionTimestamp(data.threadCompletionTimestamp==null||undefined?5000:Date.now()-data.completedAt);
      } catch (error) {
        
        console.log(`error while adding message to thread ${error}`);
      }
    
  };


  return (
    <div className="app-container">
 
      <LeftPanel
        onNewThread={handleNewThread}
        onSelectThread={handleSelectThread}
        threads={threads}
        currentThread={currentThread}
        firstMessages={firstMessagesOfThread}
   
      />
      <ChatInterface
        onSendMessage={handleSendMessage}
        threadMessages={threadMessages}
        onNewMessage={setCurrentMessage}
        currentMessage={currentMessage}
        messagesSent={messagesSent}
      />
    </div>
  );
}
