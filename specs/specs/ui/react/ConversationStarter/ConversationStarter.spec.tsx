import { ConversationStarters } from "@nlux-dev/react/src/components/ConversationStarters/ConversationStarters";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
describe("ConversationStarters component", () => {
  it("should render the list of conversation starters", () => {
    // Arrange
    const items = [
      {
        icon: "https://avatars.githubusercontent.com/u/1?v=4",
        prompt: "Prompt 1",
      },
      {
        icon: "https://avatars.githubusercontent.com/u/2?v=4",
        prompt: "Prompt 2",
      },
    ];
    const onConversationStarterSelected = jest.fn();

    // Act
    const { getByText, getAllByRole } = render(
      <ConversationStarters
        items={items}
        onConversationStarterSelected={onConversationStarterSelected}
      />
    );

    // Assert
    expect(getByText("Prompt 1")).toBeInTheDocument();
    expect(getByText("Prompt 2")).toBeInTheDocument();

    const imgElements = getAllByRole("img");
    expect(imgElements).toHaveLength(2);
    expect(imgElements[0]).toHaveAttribute(
      "src",
      "https://avatars.githubusercontent.com/u/1?v=4"
    );
    expect(imgElements[1]).toHaveAttribute(
      "src",
      "https://avatars.githubusercontent.com/u/2?v=4"
    );
  });

  it("should call onConversationStarterSelected when a conversation starter is clicked", () => {
    // Arrange
    const items = [
      {
        icon: "https://avatars.githubusercontent.com/u/1?v=4",
        prompt: "Prompt 1",
      },
      {
        icon: "https://avatars.githubusercontent.com/u/2?v=4",
        prompt: "Prompt 2",
      },
    ];
    const onConversationStarterSelected = jest.fn();

    // Act
    const { getByText } = render(
      <ConversationStarters
        items={items}
        onConversationStarterSelected={onConversationStarterSelected}
      />
    );

    // Assert
    const button = getByText("Prompt 1").closest("button");
    fireEvent.click(button);

    expect(onConversationStarterSelected).toHaveBeenCalledWith(items[0]);
  });
});
