"use client";
export function LastMessageSummary({
  lastMessage,
  maxLength = 34,
}: {
  lastMessage: string;
  maxLength?: number;
}) {
  return (
    <p className="text-xs font-normal text-muted-foreground">
      {lastMessage.length > maxLength
        ? lastMessage.slice(0, maxLength - 3) + "..."
        : lastMessage}
    </p>
  );
}
