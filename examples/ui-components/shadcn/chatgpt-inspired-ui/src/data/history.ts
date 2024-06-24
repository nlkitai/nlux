import {personas} from './personas.ts';
import { ChatItem, PersonaOptions } from "@nlux/react";

export const conversations: {
  id: string;
  title: string;
  personas: PersonaOptions,
  chat?: ChatItem[];
}[] = [
  {
    id: "cnv-1",
    title: "Latest",
    personas: personas[1],
  },
  {
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
          'Sure! Here be a recipe for `spaghetti`:\n\n'
            + '## Spaghetti Recipe\n'
            + '\n'
            + '### Ingredients\n'
            + '- 200g spaghetti\n'
            + '- 2 tbsp olive oil\n'
            + '- 2 garlic cloves, minced\n'
            + '- 1 can (400g) diced tomatoes\n'
            + '- 1 tsp dried oregano\n'
            + '- 1 tsp dried basil\n'
            + '- Salt and pepper to taste\n'
            + '- Grated Parmesan cheese (optional)\n'
            + '- Fresh basil leaves (optional)\n'
            + '\n'
            + '### Instructions\n'
            + '1. **Cook Spaghetti**: Boil salted water, cook spaghetti until al dente, then drain.\n'
            + '2. **Make Sauce**: Heat olive oil, sauté garlic, add tomatoes, oregano, basil, salt, and pepper. Simmer for 10-15 mins.\n'
            + '3. **Combine**: Toss spaghetti with sauce. Top with Parmesan and basil if desired.\n'
            + '\n'
            + 'Enjoy your meal!\n'
      },
    ],
  },
  {
    id: "cnv-3",
    title: "Fastest land animals",
    personas: personas[0],
    chat: [
      {
        role: "user",
        message: "What's the fastest land animal?",
      },
      {
        role: "assistant",
        message:
          "Yarrr! The **fastest** land animal be the mighty `cheetah`! It zooms across the savannah like a cannonball from a pirate ship!",
      },
    ],
  },
  {
    id: "cnv-4",
    title: "Plants",
    personas: personas[1],
    chat: [
      {
        role: "user",
        message: "How do plants make food?",
      },
      {
        role: "assistant",
        message:
          "Plants make food through a process called **photosynthesis**. Here's a brief overview of how it works:\n"
            + "\n"
            + "1. **Chlorophyll**: Plants have a green pigment called chlorophyll in their leaves, which captures light energy from the sun.\n"
            + "2. **Water and Carbon Dioxide**: Plants take in water (H₂O) from the soil through their roots and carbon dioxide (CO₂) from the air through their leaves.\n"
            + "3. **Photosynthesis Process**: Using the light energy, chlorophyll converts water and carbon dioxide into glucose (C₆H₁₂O₆), a type of sugar, and oxygen (O₂).\n"
            + "4. **Oxygen Release**: The oxygen produced during photosynthesis is released into the air through the plant's leaves.\n"
            + "5. **Energy Storage**: The glucose is used by the plant for energy and growth. It can also be stored as starch for later use.\n"
            + "\n"
            + "Plants are essential for life on Earth, as they produce oxygen and provide the foundation for most food chains.\n",
      },
    ],
  },
];
