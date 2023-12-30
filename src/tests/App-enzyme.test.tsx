import { waitFor } from "@testing-library/react";
import axios from "axios";
import { shallow } from "enzyme";
import { describe, vi } from "vitest";
import App from "../App";

describe("App", () => {
  it("handle the flow successfully", async () => {
    const name = "John";
    // Mock axios
    vi.spyOn(axios, "post").mockResolvedValue({
      data: {
        message: `Hello ${name}`,
      },
    });

    const wrapper = shallow(<App />);
    const inputName = wrapper.find("input");
    inputName.simulate("change", { target: { value: name } });

    const form = wrapper.find("form");
    form.simulate("submit", { preventDefault: () => {} });

    await waitFor(() => {
      expect(wrapper.find("p")).toHaveLength(1);
    });
  });
});
