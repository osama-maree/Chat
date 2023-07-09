import { ChatState } from "../Context/ChatProvide.js";
import { Box } from "@chakra-ui/react";
import SideDrawer from "./SideDrawer.jsx";
import MyChats from "./MyChats.jsx";
import ChatBox from "./ChatBox.jsx";
import { useState } from "react";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState();
  const [user, setUser] = useState(localStorage.getItem("token") ? true : false);
  return (
    <div className="w-100">
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        // flexWrap='wrap'
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
