import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Contact from "../../components/shared/footer/Contact";

describe("MainNavigation", () => {
  describe("links", () => {
    jest.mock(
      "next/link",
      () =>
        ({ children }: any) =>
          children
    );

    it('should redirect to `gmail` when clicking on "Say Hello!!" text', () => {
      render(<Contact />);

      const emailString = screen.getByText("Say Hello!!");
      fireEvent.click(emailString);
      expect(emailString.closest("link"));
    });
  });
});
