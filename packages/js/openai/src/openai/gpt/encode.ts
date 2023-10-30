// Notes from API docs:
// https://platform.openai.com/docs/guides/gpt/chat-completions-api

// Including conversation history is important when user instructions refer to prior messages.
// In the example above, the user’s final question of "Where was it played?" only makes sense in
// the context of the prior messages about the World Series of 2020. Because the models have no
// memory of past requests, all relevant information must be supplied as part of the conversation
// history in each request. If a conversation cannot fit within the model’s token limit, it will
// need to be shortened in some way.

