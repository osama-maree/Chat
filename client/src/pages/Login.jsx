import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const navigate = useNavigate();
  const toast = useToast();
  const onChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/chat/auth/login",
        data,
        {
          headers: {
            "Content-Type": "application/json", // do not forget this
          },
        }
      );

      if (res.status === 200) {
        localStorage.setItem("token", res.data);
        toast({
          title: "Login Success",
          status: "success",
          duration: 1000,
        });
        // function wait(ms) {
        //   return new Promise((resolve) => setTimeout(resolve, ms));
        // }
        // wait(1000) // Wait for 2 seconds
        //   .then(() => {
        return navigate("/chats");
        // });
      } else {
        toast({
          title: `Failed Login`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast({
        title: `Failed Login`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <VStack marginTop={5} spacing="5px">
        <Box className="border p-2 rounded text-white">
          <FormControl id="email" isRequired>
            <FormLabel>Please enter your email</FormLabel>
            <Input name="email" type="email" onChange={onChange} />
          </FormControl>
          <FormControl id="password" marginTop={3} isRequired>
            <FormLabel>Please enter your Password</FormLabel>
            <InputGroup>
              <Input
                name="password"
                type={show ? "text" : "password"}
                onChange={onChange}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                  {show ? "Hide" : "Show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <WrapItem className="d-flex justify-content-center mt-3">
            <Button
              colorScheme="blackAlpha"
              isLoading={loading}
              onClick={handleSubmit}
            >
              Login
            </Button>
          </WrapItem>
        </Box>
        <Box p={2} marginTop={2}>
          <Text
            fontSize=""
            margin={0}
            p={0}
            color="white"
            fontFamily="work sans"
          >
            Don't have an account?{" "}
            <Link to="/register" className="bg-success p-1 rounded">
              Sign up now
            </Link>
          </Text>
        </Box>
      </VStack>
    </>
  );
};

export default Login;
