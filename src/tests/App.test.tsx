import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe } from "vitest";
import App from "../App";
import { checkA11y } from "./utils";

describe("App", () => {
  it("handle the flow successfully", async () => {
    // Arrange
    const user = userEvent.setup();
    const { container } = render(<App />);
    await checkA11y(container);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();

    // Act
    const name = faker.person.fullName();
    await user.type(screen.getByLabelText(/name/i), name);
    await user.click(screen.getByRole("button", { name: /submit/i }));

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(`Hello ${name}`);
  });
});
