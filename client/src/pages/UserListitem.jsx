import { Avatar, Box, Text, Tooltip } from "@chakra-ui/react";
import React from "react";

const UserListitem = ({ user, handleFunction }) => {
  return (
    <>
    
        <Box
          onClick={handleFunction}
          display="flex"
          cursor="pointer"
          bg="#E8E8E8"
          _hover={{
            background: "#22C35E",
            color: "white",
          }}
          w="100%"
          d="flex"
          alignItems="center"
          color="black"
          px={3}
          py={2}
          mb={2}
          borderRadius="lg"
        >
          <Avatar
            mr={2}
            size="sm"
            cursor="pointer"
            name={user.name}
            src={user.pic}
          />
          <Box>
            <Text m={0}>{user?.name}</Text>
          </Box>
        </Box>
    
    </>
  );
};

export default UserListitem;
