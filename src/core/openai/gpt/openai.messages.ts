import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export type OpenAiMessages = (
  | SystemMessage
  | AssistantMessage
  | UserMessage
  | FunctionMessage
)[];

export class SystemMessage {
  role = ChatCompletionRequestMessageRoleEnum.System;
  constructor(readonly content: string) {}
}

export class FunctionMessage {
  role = ChatCompletionRequestMessageRoleEnum.Function;
  constructor(readonly content: string) {}
}

export class AssistantMessage {
  role = ChatCompletionRequestMessageRoleEnum.Assistant;
  constructor(readonly content: string) {}
}

export class UserMessage {
  role = ChatCompletionRequestMessageRoleEnum.User;
  constructor(readonly content: string) {}
}
