export const getMessageFromServer = async (name: string) => {
  const response = await fetch(new URL("/api/message", location.href), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const message = (await response.json()) as { message: string };

  return message;
};
