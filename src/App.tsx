import {
  Button,
  ChakraProvider,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { getMessageFromServer } from "./callApi";

export default function App() {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");

    const result = await getMessageFromServer(name as string);
    setMessage(result.message);
  };

  return (
    <ChakraProvider>
      <main>
        <h1>Submission form</h1>

        <form onSubmit={handleSubmit}>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input required name="name" type="text" />
          </FormControl>
          <Button type="submit">Submit</Button>
        </form>

        {message && <p role="alert">{message}</p>}
      </main>
    </ChakraProvider>
  );
}
