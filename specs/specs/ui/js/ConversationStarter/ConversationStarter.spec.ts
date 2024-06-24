import { ConversationStarter } from "@nlux-dev/core/src";
import { createConversationStartersDom } from "@nlux-dev/core/src/sections/chat/conversationStarters/utils/createConversationStartersDom";
import { describe, it, expect } from "vitest";

describe("createConversationStartersDom", () => {
  it("should create a container with the correct class", () => {
    const starters: ConversationStarter[] = [];
    const container = createConversationStartersDom(starters);

    expect(container.tagName).toBe("DIV");
    expect(container.classList.contains("nlux-comp-conversationStarters")).toBe(
      true
    );
  });

  it("should create buttons with correct prompts", () => {
    const starters: ConversationStarter[] = [
      { prompt: "Hello", label: "Say Hello" },
      { prompt: "How are you?" },
    ];
    const container = createConversationStartersDom(starters);
    const buttons = container.querySelectorAll("button");

    expect(buttons.length).toBe(2);

    expect(buttons[0].textContent).toContain("Say Hello");
    expect(buttons[1].textContent).toContain("How are you?");
  });

  it("should handle icons as strings (URLs)", () => {
    const starters: ConversationStarter[] = [
      { prompt: "Hello", icon: "http://example.com/icon.png" },
    ];
    const container = createConversationStartersDom(starters);
    const button = container.querySelector("button");
    const img = button?.querySelector("img");

    expect(img).not.toBeNull();
    expect(img?.getAttribute("src")).toBe("http://example.com/icon.png");
    expect(img?.getAttribute("width")).toBe("16px");
  });

  it("should handle icons as HTML elements", () => {
    const iconElement = document.createElement("div");
    iconElement.classList.add("custom-icon");

    const starters: ConversationStarter[] = [
      { prompt: "Hello", icon: iconElement },
    ];
    const container = createConversationStartersDom(starters);
    const button = container.querySelector("button");
    const icon = button?.querySelector(".custom-icon");

    expect(icon).not.toBeNull();
    expect(icon).toBe(iconElement);
  });

  it("should prioritize label over prompt for button text", () => {
    const starters: ConversationStarter[] = [
      { prompt: "Prompt text", label: "Label text" },
    ];
    const container = createConversationStartersDom(starters);
    const button = container.querySelector("button");
    const span = button?.querySelector("span");

    expect(span?.textContent).toBe("Label text");
  });

  it("should use prompt text if label is not provided", () => {
    const starters: ConversationStarter[] = [{ prompt: "Prompt text" }];
    const container = createConversationStartersDom(starters);
    const button = container.querySelector("button");
    const span = button?.querySelector("span");

    expect(span?.textContent).toBe("Prompt text");
  });
});
