import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModel = ({ data, children }) => {
// console.log(data)
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
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
            {data?.name}
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            justifyContent="apace-between"
            alignItems="center"
          >
            <Image
              borderRadius="full"
              boxSize="300px"
              src={data?.img || data?.pic}
              alt={data?.name}
            />
            <Text
              className="text-center bg-light h6 p-2 text-success rounded mt-2 "
              fontSize={{ base: "28px", md: "30px" }}
            >
              {data?.email}
            </Text>
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

export default ProfileModel;
