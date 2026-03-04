import { BaseChatModel, type BaseChatModelParams, type BindToolsInput } from "@langchain/core/language_models/chat_models";
import { CallbackManagerForLLMRun } from "@langchain/core/callbacks/manager";
import { BaseMessage } from "@langchain/core/messages";
import { ChatResult } from "@langchain/core/outputs";
import type { Runnable } from "@langchain/core/runnables";
export declare function getBaseUrl(enterpriseUrl?: string): string;
export interface GitHubCopilotChatModelInput extends BaseChatModelParams {
    token: string;
    baseUrl: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
}
export declare class GitHubCopilotChatModel extends BaseChatModel {
    token: string;
    baseUrl: string;
    model: string;
    temperature?: number;
    maxTokens?: number;
    constructor(fields: GitHubCopilotChatModelInput);
    _llmType(): string;
    get supportsToolCalling(): boolean;
    bindTools(_tools: BindToolsInput[], _kwargs?: Partial<this["ParsedCallOptions"]>): Runnable;
    private convertMessages;
    _generate(messages: BaseMessage[], _options: this["ParsedCallOptions"], runManager?: CallbackManagerForLLMRun): Promise<ChatResult>;
}
//# sourceMappingURL=GitHubCopilotChatModel.d.ts.map