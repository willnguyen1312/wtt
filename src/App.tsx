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
    <main>
      <h1>Submission form</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />
        <button type="submit">Submit</button>
      </form>

      {message && <p role="alert">{message}</p>}
    </main>
  );
}
