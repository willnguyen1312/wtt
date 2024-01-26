import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { describe, it } from "vitest";

import LoseFocusApp from "./LoseFocusApp";

describe("<LoseFocusApp />", () => {
  it("renders input and keep focus on typing", async () => {
    const user = userEvent.setup();
    render(<LoseFocusApp />);

    const nameInput = screen.getByLabelText("Your name");

    await user.clear(nameInput);
    await user.type(nameInput, "Nam");

    expect(nameInput).toHaveValue("Nam");
  });
});
