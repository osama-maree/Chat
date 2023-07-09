import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvide.js";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import { api } from "../utiltes/api.js";
import jwt_decode from "jwt-decode";
import { AddIcon } from "@chakra-ui/icons";
import "./../style/blur.css";
import ChatLoading from "./ChatLoading.jsx";
import GroupChatModal from "./GroupChatModal.js";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState(
    jwt_decode(localStorage.getItem("token"))
  );
  const { user, chats, setSelectedChat, selectedChat, setChats, refetch } =
    ChatState();
  const [newChat, setNewChat] = useState();
  const toast = useToast();
  const fetchChat = async () => {
    try {
      const response = await api().get("/chat");

      if (response?.status === 200) {
        setLoggedUser(jwt_decode(user));
        setNewChat(response.data);
      }
    } catch (e) {
      console.log(e);
      // toast({
      //   title: `Failed`,
      //   status: "error",
      //   duration: 5000,
      //   isClosable: true,
      //   position: "bottom-center",
      // });
    }
  };

  const getSender = (user, users) => {
    return users?.find((user1) => user.id !== user1._id)?.name;
  };
  useEffect(() => {
    fetchChat();
  }, [fetchAgain, refetch, user]);
  useEffect(() => {
    setChats(newChat);
  }, [newChat]);
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      //   bg="white"
      className="myStyle"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text className="m-0 bg-white rounded px-2"> Chats</Text>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        borderWidth={2}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.map((chat, i) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                display="flex"
                justifyContent="start"
                background={selectedChat === chat ? "#22C35E" : "#F8F8F8"}
                color={selectedChat === chat ? "white" : "dark"}
                px={3}
                py={2}
                borderRadius="lg"
                key={i}
              >
                <Avatar
                  me={3}
                  name={
                    !chat.isGroup
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName
                  }
                  src={
                    !chat.isGroup
                      ? chat.users?.find((user) => user._id !== loggedUser.id)
                          ?.pic
                      : chat.chatName
                  }
                />
                <Text className="mt-2 ms-1 ">
                  {!chat.isGroup
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
