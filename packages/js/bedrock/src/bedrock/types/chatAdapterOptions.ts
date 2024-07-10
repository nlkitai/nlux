import { DataTransferMode } from "@nlux/core";
import {
  BedrockRuntimeClientConfigType,
  InferenceConfiguration,
} from "@aws-sdk/client-bedrock-runtime";

export type ChatAdapterOptions<AiMsg> = {
  dataTransferMode?: DataTransferMode;
  model: string;

  inferenceConfig?: InferenceConfiguration;
} & BedrockRuntimeClientConfigType;
