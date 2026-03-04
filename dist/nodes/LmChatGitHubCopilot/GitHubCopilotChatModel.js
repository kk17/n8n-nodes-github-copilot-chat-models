"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubCopilotChatModel = void 0;
exports.getBaseUrl = getBaseUrl;
const chat_models_1 = require("@langchain/core/language_models/chat_models");
const messages_1 = require("@langchain/core/messages");
const VERSION = "0.1.0";
function getBaseUrl(enterpriseUrl) {
    if (!enterpriseUrl || enterpriseUrl.trim() === "") {
        return "https://api.githubcopilot.com";
    }
    const domain = enterpriseUrl
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "");
    return `https://copilot-api.${domain}`;
}
class GitHubCopilotChatModel extends chat_models_1.BaseChatModel {
    constructor(fields) {
        super(fields);
        this.token = fields.token;
        this.baseUrl = fields.baseUrl;
        this.model = fields.model;
        this.temperature = fields.temperature;
        this.maxTokens = fields.maxTokens;
    }
    _llmType() {
        return "github-copilot";
    }
    get supportsToolCalling() {
        return true;
    }
    bindTools(_tools, _kwargs) {
        return this;
    }
    convertMessages(messages) {
        return messages.map((msg) => {
            const content = typeof msg.content === "string"
                ? msg.content
                : msg.content
                    .filter((part) => {
                    return (typeof part === "object" &&
                        part !== null &&
                        "type" in part &&
                        part.type === "text" &&
                        "text" in part);
                })
                    .map((part) => part.text)
                    .join("");
            if (msg instanceof messages_1.SystemMessage) {
                return { role: "system", content };
            }
            else if (msg instanceof messages_1.HumanMessage) {
                return { role: "user", content };
            }
            else if (msg instanceof messages_1.AIMessage) {
                return { role: "assistant", content };
            }
            else {
                // Fallback: treat as user message
                return { role: "user", content };
            }
        });
    }
    async _generate(messages, _options, runManager) {
        const openAiMessages = this.convertMessages(messages);
        const body = {
            model: this.model,
            messages: openAiMessages,
            stream: false,
        };
        if (this.temperature !== undefined) {
            body.temperature = this.temperature;
        }
        if (this.maxTokens !== undefined && this.maxTokens !== -1) {
            body.max_tokens = this.maxTokens;
        }
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
                "Copilot-Integration-Id": "vscode-chat",
                "x-initiator": "user",
                "Openai-Intent": "conversation-edits",
                "User-Agent": `n8n-github-copilot/${VERSION}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`GitHub Copilot API error (${response.status}): ${errorText}`);
        }
        const data = (await response.json());
        if (!data.choices || data.choices.length === 0) {
            throw new Error("GitHub Copilot API returned no choices");
        }
        const responseText = data.choices[0].message.content ?? "";
        if (runManager) {
            await runManager.handleLLMNewToken(responseText);
        }
        return {
            generations: [
                {
                    text: responseText,
                    message: new messages_1.AIMessage(responseText),
                },
            ],
        };
    }
}
exports.GitHubCopilotChatModel = GitHubCopilotChatModel;
//# sourceMappingURL=GitHubCopilotChatModel.js.map