import { ConversationStarterIcon } from "@nlux-dev/react/src/components/ConversationStarters/ConversationStarters";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("When conversationStarters is provided", () => {
  it("Should render the img tag", async () => {
    // Arrange
    const component = (
      <ConversationStarterIcon icon="https://avatars.githubusercontent.com/u/59267562?v=4" />
    );

    // Act
    const { getByRole } = render(component);

    // Assert
    const imgElement = getByRole("img");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(
      "src",
      "https://avatars.githubusercontent.com/u/59267562?v=4"
    );
    expect(imgElement).toHaveAttribute("width", "16");
  });

  it("Should render the custom element", async () => {
    // Arrange
    const component = <ConversationStarterIcon icon={<div>Custom Icon</div>} />;

    // Act
    const { getByText } = render(component);

    // Assert
    const customIconElement = getByText("Custom Icon");
    expect(customIconElement).toBeInTheDocument();
    expect(customIconElement).toHaveTextContent("Custom Icon");
  });
});
