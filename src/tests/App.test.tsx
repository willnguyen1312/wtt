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
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await user.click(submitButton);
    const nameInput = screen.getByLabelText(/name/i);

    // Should pass but it doesn't work as it should because of JSDOM
    // await waitFor(() => {
    //   expect(nameInput).toHaveFocus();
    // });

    const name = faker.person.fullName();
    await user.type(nameInput, name);
    await user.click(submitButton);

    // Assert
    expect(await screen.findByRole("alert")).toHaveTextContent(`Hello ${name}`);
  });

  it("work nicely", () => {
    const App = () => (
      <div>
        <p>hello</p> <a href="https://namnguyen.design">link</a> <p>nha</p>
      </div>
    );

    render(<App />);

    screen.logTestingPlaygroundURL();

    screen.getByText(/hello/i);
    screen.getByText(/nha/i);
    screen.getByRole("link", { name: /link/i });
  });
});
