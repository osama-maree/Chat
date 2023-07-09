import axios from "axios";

export const api = () =>
  axios.create({
    baseURL: "http://localhost:5000/api/v1/chat", // Set your API base URL
    headers: {
      token: `osama__${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  });
