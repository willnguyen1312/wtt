import axios from "axios";

export const getMessageFromServer = async (name: string) => {
  // const response = await fetch(new URL("/api/message", location.href), {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({ name }),
  // });

  const { data } = await axios.post("/api/message", { name });

  const message = data as { message: string };

  return message;
};
