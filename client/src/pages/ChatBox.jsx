import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvide.js";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat.jsx";
import jwtDecode from "jwt-decode";
import './../style/blur.css'
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, user } = ChatState();
  const [userData, setUserData] = useState(
    jwtDecode(localStorage.getItem("token"))
  );

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
     // bg="white"
       className="myStyle"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
        userData={userData}
        fetchAgain={fetchAgain}
        setFetchAgain={setFetchAgain}
      />
    </Box>
  );
};

export default ChatBox;
