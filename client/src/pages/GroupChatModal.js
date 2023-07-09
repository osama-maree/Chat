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

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = React.useRef(null);
  const [groupChatName, setgroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState();
  const [Users, setUsers] = useState(null);
  const toast = useToast();
  const { chats, setChats } = ChatState();
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
    if (!groupChatName || !selectedUser) {
      toast({
        title: `Failed created group`,
        status: "error",
        duration: 1000,
        position: "bottom-right",
      });
      return;
    }
    try {
      const response = await api().post(`/chat/group`, {
        users: JSON.stringify(selectedUser),
        name: groupChatName,
      });
      if (response.status === 200) {
        setChats([response.data, ...chats]);
        // console.log(chats)
        onClose();
        window.location.reload();
        toast({
          title: `created group`,
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
    if (selectedUser.includes(user)) {
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
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontFamily="work sans"
            fontSize="35px"
            display="flex"
            justifyContent="center"
          >
            Create Group
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl isRequired>
              <FormLabel>Name Group</FormLabel>
              <Input
                mb={3}
                onChange={(e) => setgroupChatName(e.target.value)}
              />
            </FormControl>

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

export default GroupChatModal;
