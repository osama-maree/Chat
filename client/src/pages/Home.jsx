import React, { useEffect } from "react";
import { Box, Container, Text } from "@chakra-ui/react";
import "../style/blur.css";
import Login from "./Login.jsx";
// import { useNavigate } from "react-router-dom";
const Home = () => {

  return (
    <Container maxW="xs" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        // bg="white"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        className="myStyle"
      >
        <Text
          fontSize="4xl"
          margin={0}
          p={0}
          color="white"
          fontFamily="work sans"
        >
          Osama-Chat
        </Text>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        w="100%"
        // bg="white"
        m="10px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        className="myStyle"
      >
        <Login />
      </Box>
    </Container>
  );
};

export default Home;
