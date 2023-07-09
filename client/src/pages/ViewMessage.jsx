import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../services/services.js";
import { Avatar } from "@chakra-ui/react";
const ViewMessage = ({ messages, user }) => {
  // const[user,setUse]
  console.log(messages);

  return (
    <ScrollableFeed>
      {messages
        ? messages.map((message, i) => (
            <div className="d-flex" key={i}>
              {(isSameSender(messages, message, i, user.id) ||
                isLastMessage(messages, i, user.id)) && (
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={message.sender.name}
                  src={message.sender.pic}
                />
              )}
              <span
                style={{
                  backgroundColor: `${
                    message.sender._id === user.id ? "#BEE3F8" : "#B9F5D0"
                  }`,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                  marginLeft: isSameSenderMargin(messages, message, i, user.id),
                  marginTop: isSameUser(messages, message, i, user.id) ? 3 : 10,
                }}
              >
                {message.content}
              </span>
            </div>
          ))
        : "loading..."}
    </ScrollableFeed>
  );
};

export default ViewMessage;
