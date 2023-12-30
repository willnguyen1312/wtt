import { waitFor } from "@testing-library/react";
import { shallow } from "enzyme";
import { describe } from "vitest";
import App from "../App";

describe("App", () => {
  it("handle the flow successfully", async () => {
    const wrapper = shallow(<App />);
    const inputName = wrapper.find("input");

    inputName.simulate("change", { target: { value: "John" } });
    const form = wrapper.find("form");
    form.simulate("submit", { preventDefault: () => {} });

    await waitFor(() => {
      expect(wrapper.find("p")).toHaveLength(1);
    });
  });
});
