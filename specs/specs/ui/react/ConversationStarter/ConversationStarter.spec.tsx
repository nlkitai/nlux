import { ConversationStarters } from "@nlux-dev/react/src/components/ConversationStarters/ConversationStarters";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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
    const onConversationStarterSelected = vi.fn();

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
    const onConversationStarterSelected = vi.fn();

    // Act
    const { getByText } = render(
      <ConversationStarters
        items={items}
        onConversationStarterSelected={onConversationStarterSelected}
      />
    );

    // Assert
    const button = getByText("Prompt 1").closest("button");
    expect(button).not.toBeNull();
    fireEvent.click(button!);

    expect(onConversationStarterSelected).toHaveBeenCalledWith(items[0]);
  });

  it("Should render the label instead of prompt", async () => {
    // Arrange
    const component = (
      <ConversationStarters
        onConversationStarterSelected={vi.fn()}
        items={[
          {
            icon: "https://avatars.githubusercontent.com/u/59267562?v=4",
            prompt: "Write Hello World in Python, C++, and Java.",
            label: "Python, C++ and Java Intro",
          },
        ]}
      />
    );

    // Act
    const { getByText, queryByText } = render(component);

    // Assert
    const labelElement = getByText("Python, C++ and Java Intro");
    expect(labelElement).toBeInTheDocument();

    const promptElement = queryByText(
      "Write Hello World in Python, C++, and Java."
    );
    expect(promptElement).not.toBeInTheDocument();
  });
});
