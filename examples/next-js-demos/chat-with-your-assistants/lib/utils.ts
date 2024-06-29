import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  const now = new Date();

  const timeDifference = now.getTime() - date.getTime();
  const day = 24 * 60 * 60 * 1000;
  const week = 7 * day;

  if (timeDifference < day && date.getDate() === now.getDate()) {
    // Today: show only the hour
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } else if (timeDifference < week && date.getDate() === now.getDate() - 1) {
    // Yesterday
    return "Yesterday";
  } else if (timeDifference < week && now.getDate() - date.getDate() < 7) {
    // Past week: show only the day
    return date.toLocaleDateString([], { weekday: "long" });
  } else {
    // Another date: show the date dd/mm/yy
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
}
