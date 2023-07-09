import {
  Box,
  Button,
  Container,
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
import { Link } from "react-router-dom";

const Register = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const toast = useToast();
  const onChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  const submitHandle = async () => {
    setLoading(true);
    if(!data.image || !data.name||!data.password || !data.password){
        toast({
          title: "Failed",
          description: "please fill all fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setLoading(false)
        return;
    }
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("password", data.password);
    formData.append("image", data.image);
    formData.append("email", data.email);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/chat/auth/register",
        formData,
        {
          headers: {
            "content-type": "multipart/form-data", // do not forget this
          },
        }
      );

      if (res.status === 201) {
        toast({
          title: "Account created.",
          description: "Go login page and complete to enter to your account",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: `Failed created Account`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast({
        title: `Failed created Account`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
    }
  };
  return (
    <>
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
          <VStack marginTop={5} spacing="5px">
            <Box className="border p-2 rounded text-white">
              <form>
                <FormControl id="name" isRequired>
                  <FormLabel>Please enter your Name</FormLabel>
                  <Input name="name" onChange={onChange} />
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel>Please enter your email</FormLabel>
                  <Input name="email" onChange={onChange} />
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
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={() => setShow(!show)}
                      >
                        {show ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl id="img" marginTop={3} isRequired>
                  <FormLabel>Please enter your Image</FormLabel>
                  <Input
                    name="pic"
                    p={1}
                    type="file"
                    onChange={(e) =>
                      setData({ ...data, image: e.target.files[0] })
                    }
                  />
                </FormControl>
                <WrapItem className="d-flex justify-content-center mt-3">
                  <Button
                    colorScheme="blackAlpha"
                    isLoading={loading}
                    onClick={submitHandle}
                  >
                    Sign Up
                  </Button>
                </WrapItem>
              </form>
            </Box>
            <Box p={2} marginTop={2}>
              <Text
                fontSize=""
                margin={0}
                p={0}
                color="white"
                fontFamily="work sans"
              >
                Do you have an account?
                <Link to="/" className="bg-success p-1 rounded">
                  Login now
                </Link>
              </Text>
            </Box>
          </VStack>
        </Box>
      </Container>
    </>
  );
};

export default Register;
