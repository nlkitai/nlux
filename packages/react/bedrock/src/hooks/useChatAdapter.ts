import { ChatAdapterOptions, StandardChatAdapter } from "@nlux/bedrock";
import { useEffect, useState } from "react";
import { debug } from "@shared/utils/debug";
import { getAdapterBuilder } from "./getAdapterBuilder";

const source = "hooks/useChatAdapter";

export const useChatAdapter = <AiMsg = string>(
  options: ChatAdapterOptions<AiMsg>
): StandardChatAdapter<AiMsg> => {
  if (!options.model) {
    throw new Error(
      "You must provide either a model or an endpoint to use Hugging Face Inference API."
    );
  }

  const [isInitialized, setIsInitialized] = useState(false);
  const [adapter] = useState<StandardChatAdapter<AiMsg>>(
    getAdapterBuilder<AiMsg>(options).create()
  );

  const { dataTransferMode, model, maxNewTokens } = options || {};

  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true);
      return;
    }

    debug({
      source,
      message:
        "A new parameter has changed in useChatAdapter(). Adapter cannot be changed after " +
        "initialization and the new parameter will not be applied. Please re-initialize the adapter " +
        "with the new parameter. or user adapter methods to change the options and behaviour of " +
        "the adapter.",
    });
  }, [dataTransferMode, model, maxNewTokens]);

  return adapter;
};
