import { createContext, useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("token"));
  const [selectedChat, setSelectedChat] = useState(undefined);
  const [chats, setChats] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const [notification, setNotification] = useState([]);
  // setNotification([])
  useEffect(() => {
    setUser(localStorage.getItem("token"));
  }, [localStorage.getItem("token")]);
  return (
    <ChatContext.Provider
      value={{
        setNotification,
        notification,
        user,
        setUser,
        refetch,
        setRefetch,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
