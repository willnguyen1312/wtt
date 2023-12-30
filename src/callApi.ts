import axios from "axios";

export const getMessageFromServer = async (name: string) => {
  const { data } = await axios.post("/api/message", { name });

  const message = data as { message: string };

  return message;
};
