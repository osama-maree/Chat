import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvide.js";
import "./../style/blur.css";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import animationData from "./../animation/typing.json";
import Lottie from "react-lottie";
import io from "socket.io-client";
import "./../style/blur.css";
import { AddIcon, ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import ProfileModel from "./ProfileModel.js";
import UpdateGroup from "./UpdateGroup.jsx";
import AddUser from "./AddUser.jsx";
import { api } from "../utiltes/api.js";
import ViewMessage from "./ViewMessage.jsx";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({
  fetchAgain,

  userData,
  setFetchAgain,
}) => {
  const { selectedChat, notification, setNotification, setSelectedChat } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessages] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  // const defaultOptitns={
  //   loop:true,
  //   autoPlay:true,
  //   animationData,
  //   rendererSettings:{
  //     preserveAspectRatio:'xMidYMid slice'
  //   }
  // }
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", { _id: userData.id });
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const getUser = () => {
    const users = selectedChat.users ? selectedChat.users : [];

    const single = userData;
    return users?.find((user1) => user1._id !== single.id);
  };

  //   }, [selectedChat]);
  const toast = useToast();

  const typingHandler = (e) => {
    setNewMessages(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTyping = new Date().getTime();
    var timer = 3000;
    setTimeout(() => {
      var timenow = new Date().getTime();
      var def = timenow - lastTyping;
      if (def >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timer);
  };

  const sendMessage = async () => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const response = await api().post("/chat/sendmessage", {
          content: newMessage,
          chatId: selectedChat._id,
        });
        // console.log(response)
        setNewMessages("");
        socket.emit("new message", response.data);
        setMessages([...messages, response.data]);
        // console.log(response);
      } catch (e) {
        toast({
          title: `Failed`,
          status: "error",
          duration: 1000,
          position: "bottom-center",
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      setLoading(true);
      const response = await api().get(`/chat/getmessages/${selectedChat._id}`);
      // console.log(response)
      // setNewMessages("");
      setMessages(response.data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
      // console.log(response);
    } catch (e) {
      toast({
        title: `Failed`,
        status: "error",
        duration: 1000,
        position: "bottom-center",
      });
      setLoading(false);
    }
  };

  const LeaveGroup = async (u) => {
    try {
      const response = await api().post("/chat/del", {
        chatId: selectedChat._id,
        userId: u.id,
      });

      if (response.status === 200) {
        fetchMessages();
        toast({
          title: `success`,
          status: "success",
          duration: 1000,
          position: "bottom-center",
        });

        setSelectedChat(undefined);
        setFetchAgain(!fetchAgain);
      }
    } catch (e) {
      toast({
        title: `Failed`,
        status: "error",
        duration: 1000,
        position: "bottom-center",
      });
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessage]);
      }
    });
  });
    // console.log(notification);
  return (
    <>
      {userData !== undefined ? (
        <>
          {selectedChat !== undefined ? (
            <>
              <Text
                fontSize={{ base: "28px", md: "30px" }}
                p={1}
                w="100%"
                fontFamily="work sans"
                display="flex"
                borderWidth={1}
                className="rounded"
                justifyContent={{ base: "space-between" }}
                alignItems="center"
              >
                <IconButton
                  display={{ base: "flex", md: "none" }}
                  icon={<ArrowBackIcon />}
                  onClick={() => setSelectedChat(undefined)}
                />

                {!selectedChat.isGroup ? (
                  <>
                    <Button border="2px" borderColor="green.500">
                      {getUser()?.name.toUpperCase()}
                    </Button>
                    <ProfileModel data={getUser()} />
                  </>
                ) : (
                  <>
                    <Button border="2px" borderColor="green.500">
                      {" "}
                      {selectedChat.chatName.toUpperCase()}
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={() => LeaveGroup(userData)}
                    >
                      {" "}
                      Leave Group
                    </Button>
                    <div className="d-flex border rounded p-1">
                      <AddUser>
                        <IconButton
                          display={{ base: "flex" }}
                          icon={<AddIcon />}
                          className="me-2"
                        />
                      </AddUser>
                      <UpdateGroup
                        fetchMessages={fetchMessages}
                        fetchAgain={fetchAgain}
                        setRefetchAgain={setFetchAgain}
                        name={selectedChat.chatName}
                      />
                    </div>
                  </>
                )}
              </Text>
              <Box
                display="flex"
                flexDir="column"
                justifyContent="flex-end"
                p={3}
                //    bg="#E8E8E8"
                // className='myStyle'
                w="100%"
                h="100%"
                borderWidth={1}
                borderRadius="lg"
                overflowY="hidden"
              >
                {loading ? (
                  <Spinner
                    alignSelf="center"
                    h={20}
                    w={20}
                    size="xl"
                    margin="auto"
                  />
                ) : (
                  <div className="message">
                    <ViewMessage messages={messages} user={userData} />
                  </div>
                )}
                <FormControl
                  display="flex"
                  justifyContent="space-between"
                  isRequired
                  mt={3}
                  className="text-white"
                >
                  {isTyping ? (
                    <div className="text-danger">loading...</div>
                  ) : (
                    <></>
                  )}
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="write a message..."
                    onChange={typingHandler}
                    value={newMessage}
                  />
                  <IconButton
                    display={{ base: "flex" }}
                    icon={<ChevronRightIcon />}
                    className="ms-2"
                    onClick={sendMessage}
                  />
                </FormControl>
              </Box>
            </>
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              h="100%"
            >
              <Text fontFamily="work sans" className="text-white" pb={3} fontSize="3xl">
                Click on a user to start conversation...
              </Text>
            </Box>
          )}
        </>
      ) : (
        "loading"
      )}
    </>
  );
};

export default SingleChat;
