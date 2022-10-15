import React from "react";
import './Messages.css'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from './Message/Message'


const Messages = ({messages, name}) => (
  <ScrollToBottom className="messages">
    
    {messages.map((message,i ) => <div key={i}> <Message name={name} message={message}/> </div> )}
    
  </ScrollToBottom>
)

export default Messages;