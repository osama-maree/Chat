import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Modal,
  useToast,
  FormControl,
  Input,
  FormLabel,
  Box,
} from "@chakra-ui/react";

import React, { useState } from "react";
import { ChatState } from "../Context/ChatProvide.js";
import { api } from "../utiltes/api.js";
import UserListitem from "./UserListitem.jsx";
import UserBadgeItem from "./UserBadgeItem.jsx";

const AddUser = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState();
  const [Users, setUsers] = useState(null);
  const toast = useToast();
  const { chats, setChats, refetch, setRefetch, selectedChat } = ChatState();
  const handleSearch = async (val) => {
    setSearch(val);
    if (!val) {
      setUsers(null);
      return;
    }
    try {
      const response = await api().get(`/user?search=${search}`);
      setUsers(response.data);
    } catch (e) {
      toast({
        title: `Failed search`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const handleSubmit = async () => {
    if (!selectedUser) {
      toast({
        title: `Failed created group`,
        status: "error",
        duration: 1000,
        position: "bottom-right",
      });
      return;
    }
    try {
      const response = await api().patch(`/chat/addgroup`, {
        chatId: selectedChat._id,
        userId: selectedUser[0]._id,
      });
      if (response.status === 200) {
        setChats([response.data, ...chats]);
        // console.log(chats)
        setRefetch(!refetch);
        onClose();
        toast({
          title: `addedd user`,
          status: "success",
          duration: 1000,
          position: "bottom-right",
        });
      }
      // console.log(response);
    } catch (e) {
      toast({
        title: `Failed created group`,
        status: "error",
        duration: 1000,
        position: "bottom-right",
      });
    }
  };
  const handelDelete = (userId) => {
    setSelectedUser(selectedUser.filter((user) => user._id !== userId));
  };
  const handleGroup = (user) => {
    // console.log(selectedChat.users);
    console.log(selectedUser);
    const sec = selectedUser.find((u) => u.email === user.email);
    if (selectedChat.users.find((u) => u.email === user.email) || sec) {
      toast({
        title: `user already added`,
        status: "warning",
        duration: 1000,
        position: "top",
      });
      return;
    } else {
      setSelectedUser([...selectedUser, user]);
      toast({
        title: `user  added`,
        status: "success",
        duration: 1000,
        position: "top",
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader
            fontFamily="work sans"
            fontSize="35px"
            display="flex"
            justifyContent="center"
          >
            Add new users
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl isRequired>
              <FormLabel>Add users</FormLabel>
              <Input mb={1} onChange={(e) => handleSearch(e.target.value)} />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUser.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handelDelete(user._id)}
                />
              ))}
            </Box>

            {Users ? (
              Users.slice(0, 4).map((user) => (
                <UserListitem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
            ) : (
              <div className="text-dark">loading</div>
            )}
          </ModalBody>

          <ModalFooter display="flex" justifyContent="center">
            <Button colorScheme="whatsapp" mr={3} onClick={handleSubmit}>
              Go
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddUser;
