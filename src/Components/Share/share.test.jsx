import { test, expect, describe } from "vitest";
import { render } from "@testing-library/react";
import Share from "./Share";

describe("Share", () => {
  test("Share renders without crashing", () => {
    expect(() => render(<Share />)).not.toThrow();
  });

  test("Share renders a div element", () => {
    const share = render(<Share />).container;
    expect(share.querySelector(".share")).toBeDefined();
  });

  test("Share render the QR code", () => {
    const share = render(<Share />).container;
    expect(share.querySelector("img")).toBeDefined();
    expect(share.querySelector("img").src).toContain("qr.svg");
  });

  test("Share renders the link with the correct href", () => {
    const share = render(<Share />).container;
    expect(share.querySelector("a").href).toBe("http://localhost:3000/");
  });

  test("Share renders custom link text", () => {
    const linkText = "Know Your Rights";
    const share = render(<Share linkText={linkText} />).container;
    expect(share.querySelectorAll("p")[1].textContent).toContain(linkText);
  });
});