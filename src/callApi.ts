// import axios from "axios";

// export const getMessageFromServer = async (name: string) => {
//   const response = await axios.post("/api/message", { name });
//   return response.data;
// };

export const getMessageFromServer = async (name: string) => {
  const response = await fetch(new URL("/api/message", location.href), {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  const data = await response.json();

  return data;
};
