import { personas } from "./personas.ts";
import { ChatItem, PersonaOptions } from "@nlux/react";

export const conversation: {
  id: string;
  title: string;
  personas: PersonaOptions;
  chat?: ChatItem[];
} = {
  id: "cnv-2",
  title: "Cooking Recipes",
  personas: personas[2],
  chat: [
    {
      role: "user",
      message: "Can you give me a recipe for spaghetti?",
    },
    {
      role: "assistant",
      message:
        "Sure! Here be a recipe for `spaghetti`:\n\n" +
        "## Spaghetti Recipe\n" +
        "\n" +
        "### Ingredients\n" +
        "- 200g spaghetti\n" +
        "- 2 tbsp olive oil\n" +
        "- 2 garlic cloves, minced\n" +
        "- 1 can (400g) diced tomatoes\n" +
        "- 1 tsp dried oregano\n" +
        "- 1 tsp dried basil\n" +
        "- Salt and pepper to taste\n" +
        "- Grated Parmesan cheese (optional)\n" +
        "- Fresh basil leaves (optional)\n" +
        "\n" +
        "### Instructions\n" +
        "1. **Cook Spaghetti**: Boil salted water, cook spaghetti until al dente, then drain.\n" +
        "2. **Make Sauce**: Heat olive oil, sauté garlic, add tomatoes, oregano, basil, salt, and pepper. Simmer for 10-15 mins.\n" +
        "3. **Combine**: Toss spaghetti with sauce. Top with Parmesan and basil if desired.\n" +
        "\n" +
        "Enjoy your meal!\n",
    },
  ],
};
