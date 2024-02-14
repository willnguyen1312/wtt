import { faker } from "@faker-js/faker";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe } from "vitest";
import App from "../App";
import { checkA11y } from "./utils";

describe("<App />", () => {
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
    const list: string[] = ["Milk", "Cheese", "Blue cheese", "Feta"];
    const App = () => (
      <main>
        <h1>Hello App</h1>

        <ul>
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <button>aha</button>

        <div>
          <p>hello</p> <a href="https://namnguyen.design">link</a> <p>nha</p>
        </div>
      </main>
    );

    render(<App />);

    expect(screen.getByRole("link", { name: /link/i })).toBeInTheDocument();

    expect(
      screen.getByText((_, element) => {
        return "hello link nha" === element?.textContent;
      })
    ).toBeInTheDocument();

    screen.getAllByRole("listitem").forEach((element, index) => {
      expect(element.textContent).toBe(list[index]);
    });

    screen.getByRole("button", {
      name: /aha/i,
    });
  });
});
