import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import NotificationBadge, { Effect } from "react-notification-badge";
import React, { useEffect, useRef, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { BsSearchHeartFill } from "react-icons/bs";
import { ChatState } from "../Context/ChatProvide.js";

import ProfileModel from "./ProfileModel.js";
import { useNavigate } from "react-router-dom";
import { api } from "../utiltes/api.js";
import ChatLoading from "./ChatLoading.jsx";
import UserListitem from "./UserListitem.jsx";
import jwtDecode from "jwt-decode";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [data, setData] = useState({});
  const [userData, setDat] = useState(jwtDecode(localStorage.getItem("token")));
  const [users, setUsers] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const navigate = useNavigate();
  const {
    user,
    chats,
    setUser,
    setSelectedChat,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  useEffect(() => {
    if (user) {
      setData(jwtDecode(user));
    }
  }, [user]);
  const logOut = () => {
    setUser(null);
    localStorage.clear();
    return navigate("/");
  };
  const handleSearch = async () => {
    setLoading(true);
    if (!search) {
      toast({
        title: `Fill box`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
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
    setLoading(false);
  };
  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const response = await api().post("/chat", { userId });

      if (response.status === 200) {
        if (!chats.find((c) => c._id === response.data._id))
          setChats([data, ...chats]);
        setSelectedChat(response.data);
        window.location.reload();
        // console.log(response.data);
        //  setSelectedChat(response.data[0]);
        // console.log(selec)
        onClose();
      } else {
        toast({
          title: `there is something error`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    } catch (e) {
      toast({
        title: `Failed`,
        status: "error",
        description: e.message,
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    setLoadingChat(false);
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tooltip label="Search user..." hasArrow placement="bottom-end">
          <Button variant="ghost">
            <BsSearchHeartFill className="text-success m-0 p-0" />
            <Text
              d={{ base: "none", md: "flex" }}
              px="4"
              m="0"
              onClick={onOpen}
            >
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" m="0" fontFamily="work sans">
          Osama-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon className="text-success" fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new message"}
              {notification.map((n) => (
                <MenuItem
                  key={n._id}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    setNotification(notification.filter((n2) => n !== n2));
                  }}
                >
                  {n.chat.isGroup
                    ? `New Message in ${n.chat.chatName}`
                    : `New Message from ${
                        n.chat.users.find((user) => user._id !== userData.id)
                          .name
                      }`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={data?.name}
                src={data?.img}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel data={data}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuItem onClick={logOut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>
          <hr className="m-0" />
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="search by name or email..."
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                isLoading={loading}
                onClick={handleSearch}
                colorScheme="whatsapp"
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              <>
                <span className="h5 m-0 p-0 text-success">users</span>
                <br />
                <div className="mb-2"></div>
                {users &&
                  users.map((user) => (
                    <UserListitem
                      key={user._id}
                      handleFunction={() => accessChat(user._id)}
                      user={user}
                    />
                  ))}
              </>
            )}

            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
