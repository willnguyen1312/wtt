import axios from "axios";
import { useState } from "react";

export default function App() {
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get("name");

    const result = await axios.post("/api/message", { name });
    setMessage(result.data.message);
  };

  return (
    <main>
      <h1>Submission form</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input required id="name" name="name" type="text" />
        <button type="button">Submit</button>
      </form>

      {message && <p role="alert">{message}</p>}
    </main>
  );
}
