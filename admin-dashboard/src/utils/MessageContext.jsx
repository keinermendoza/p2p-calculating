import { createContext, useContext, useState } from 'react';

const MessageContext = createContext({
  getMessage: () => '',
  addMessage: () => null,
  clearMessage: () => null,
});

export default function MessageProvider({children}) {  
  const [message, setMessage] = useState('');

  const addMessage = (newMessage) => {
    setMessage(newMessage);
  }

  const clearMessage = () => {
    setMessage('');
  }

  const getMessage = () => {
    return message;
  }


  return <MessageContext.Provider value={{ addMessage, getMessage, clearMessage }}>{children}</MessageContext.Provider>;
}

export const useMessageProvider = () => useContext(MessageContext);