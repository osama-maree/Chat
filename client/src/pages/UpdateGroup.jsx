import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import UserListitem from "./UserListitem";
import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvide.js";
import { api } from "../utiltes/api.js";

const UpdateGroup = ({ fetchAgain, fetchMessages, setRefetchAgain, name }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState(name);
 
  const { selectedChat, setSelectedChat } = ChatState();
  const toast = useToast();
  const handleRemove = async (u) => {
    try {
      const response = await api().post("/chat/del", {
        chatId: selectedChat._id,
        userId: u._id,
      });

      if (response.status === 200) {
        fetchMessages()
        toast({
          title: `success rename`,
          status: "success",
          duration: 1000,
          position: "bottom-center",
        });

      setSelectedChat(response.data);
        setRefetchAgain(!fetchAgain);
      }
    } catch (e) {
      console.log(e);
      toast({
        title: `Failed`,
        status: "error",
        duration: 1000,
        position: "bottom-center",
      });
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: `please fill name`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
      });
      return;
    }
    try {
      const response = await api().patch("/chat/rename", {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      if (response.status === 200) {
        toast({
          title: `success rename`,
          status: "success",
          duration: 1000,

          position: "bottom-center",
        });
        setSelectedChat(response.data);
        setRefetchAgain(!fetchAgain);
      }
    } catch (e) {
      toast({
        title: `Failed`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-center",
      });
    }
  };
  //   console.log(selectedChat);
  return (
    <>
      <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader
            className="text-center text-success"
            fontFamily="work sans"
            fontSize="40px"
          >
            {selectedChat.chatName}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            justifyContent="apace-between"
            alignItems="center"
            w="100%"
          >
            <Tooltip label="Click to Remove it..." hasArrow placement="top-end">
              <Box w="100%">
                {selectedChat.users.map((u, i) => (
                  <UserListitem
                    key={i}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Box>
            </Tooltip>

            <FormControl display="flex">
              <Input
                placeholder="chat name..."
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />

              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                onClick={handleRename}
              >
                Edit
              </Button>
            </FormControl>
          </ModalBody>
          <hr className="m-0" />
          <ModalFooter display="flex" justifyContent="center" className="m-0">
            <Button onClick={onClose} mr={3} colorScheme="whatsapp">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroup;
