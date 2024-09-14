import { it, describe } from "vitest";
import App from "./CounterWithSignals";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("CounterWithSignals", () => {
  it("should render", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /Message: 123/i })
    ).toBeInTheDocument();

    const button = screen.getByRole("button", { name: /toggle/i });
    await user.click(button);
  });
});
