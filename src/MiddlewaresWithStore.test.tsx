import { render, screen } from "@testing-library/react";
import { describe, it } from "vitest";

import MiddlewaresWithStore from "./MiddlewaresWithStore";
import { userEvent } from "@testing-library/user-event";

describe("<MiddlewaresWithStore />", () => {
  it("handle the synchronous flow successfully", async () => {
    render(<MiddlewaresWithStore />);
    const user = userEvent.setup();

    const addOneButton = screen.getByRole("button", { name: "Add one" });

    await user.click(addOneButton);

    expect(screen.getByText("Value: 1")).toBeInTheDocument();
  });

  it("handle the asynchronous flow successfully", async () => {
    render(<MiddlewaresWithStore />);
    const user = userEvent.setup();

    const addOneAsyncButton = screen.getByRole("button", {
      name: "Add one async",
    });

    await user.click(addOneAsyncButton);

    expect(await screen.findByText("Value: 1")).toBeInTheDocument();
  });

  it("handle the async action successfully", async () => {
    render(<MiddlewaresWithStore />);
    const user = userEvent.setup();

    const fetchDataButton = screen.getByRole("button", { name: "Fetch data" });

    await user.click(fetchDataButton);

    expect(
      await screen.findByText("Data from async action")
    ).toBeInTheDocument();
  });
});
