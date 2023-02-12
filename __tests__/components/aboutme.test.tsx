import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutMe from "../../components/intro/AboutMe";

describe("AboutMe", () => {
  it("renders a heading", () => {
    render(<AboutMe />);

    const heading = screen.getByText(/BIKRANT MALLA./i);

    expect(heading).toBeInTheDocument();
  });
});
