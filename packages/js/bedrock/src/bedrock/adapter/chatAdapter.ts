import {
  ChatAdapterExtras,
  DataTransferMode,
  StandardAdapterInfo,
  StandardChatAdapter,
  StreamingAdapterObserver,
} from "@nlux/core";
import { NluxError, NluxValidationError } from "@shared/types/error";
import { uid } from "@shared/utils/uid";
import { warn } from "@shared/utils/warn";
import { adapterErrorToExceptionId } from "../../utils/adapterErrorToExceptionId";
import { ChatAdapterOptions } from "../types/chatAdapterOptions";
import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseStreamCommand,
} from "@aws-sdk/client-bedrock-runtime";
export class BedrockChatAdapterImpl<AiMsg>
  implements StandardChatAdapter<AiMsg>
{
  static defaultDataTransferMode: DataTransferMode = "batch";

  private readonly __instanceId: string;

  private client: BedrockRuntimeClient;
  private readonly options: ChatAdapterOptions<AiMsg>;

  constructor(options: ChatAdapterOptions<AiMsg>) {
    if (!options.model || !options.credentials || !options.region) {
      throw new NluxValidationError({
        source: this.constructor.name,
        message:
          "when creating the Bedrock adapter, you must set model, credentials and region",
      });
    }

    this.__instanceId = `${this.info.id}-${uid()}`;

    this.options = { ...options };
    this.client = new BedrockRuntimeClient(options);
  }

  get dataTransferMode(): DataTransferMode {
    return (
      this.options.dataTransferMode ??
      BedrockChatAdapterImpl.defaultDataTransferMode
    );
  }

  get id(): string {
    return this.__instanceId;
  }

  get info(): StandardAdapterInfo {
    return {
      id: "bedrock-adapter",
      capabilities: {
        chat: true,
        fileUpload: false,
        textToSpeech: false,
        speechToText: false,
      },
    };
  }

  async batchText(message: string): Promise<string | object | undefined> {
    const conversation = [
      {
        role: "user" as const,
        content: [{ text: message }],
      },
    ];
    try {
      const response = await this.client.send(
        new ConverseCommand({
          modelId: this.options.model,
          messages: conversation,
          inferenceConfig: this.options.inferenceConfig,
        })
      );
      return response.output?.message?.content?.[0].text;
    } catch (error) {
      const message =
        (error as Error).message ||
        "An error occurred while sending the message to the Bedrock API";

      throw new NluxError({
        source: this.constructor.name,
        message,
        exceptionId: adapterErrorToExceptionId(error) ?? undefined,
      });
    }
  }

  preProcessAiStreamedChunk(
    chunk: string | object | undefined,
    extras: ChatAdapterExtras<AiMsg>
  ): AiMsg | undefined {
    throw new Error("Method not implemented.");
  }

  preProcessAiBatchedMessage(
    message: string | object | undefined,
    extras: ChatAdapterExtras<AiMsg>
  ): AiMsg | undefined {
    throw new Error("Method not implemented.");
  }

  streamText(
    message: string,
    observer: StreamingAdapterObserver<string | object | undefined>
  ) {
    Promise.resolve().then(async () => {
      const conversation = [
        {
          role: "user" as const,
          content: [{ text: message }],
        },
      ];

      const command = new ConverseStreamCommand({
        modelId: this.options.model,
        messages: conversation,
        inferenceConfig: this.options.inferenceConfig,
      });

      try {
        // Send the command to the model and wait for the response
        const response = await this.client.send(command);

        // Extract  the streamed response text in real-time.
        for await (const item of response.stream!) {
          if (item.contentBlockDelta) {
            observer.next(
              item.contentBlockDelta.delta?.text as string // We are forced to cast here!
            );
          }
        }

        observer.complete();
      } catch (error) {
        const errorTyped = error as Error;
        observer.error(errorTyped);
        warn(
          "An error occurred while sending the message to the Bedrock streaming API: \n" +
            errorTyped.message
        );
      }
    });
  }
}
