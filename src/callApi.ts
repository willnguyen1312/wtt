import axios from "axios";

export const getMessageFromServer = async (name: string) => {
  const response = await axios.post("/api/message", { name });
  return response.data;
};
