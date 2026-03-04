"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LmChatGitHubCopilot = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GitHubCopilotChatModel_1 = require("./GitHubCopilotChatModel");
function getCopilotHeaders(token) {
    return {
        Authorization: `Bearer ${token}`,
        "Copilot-Integration-Id": "vscode-chat",
        "x-initiator": "user",
    };
}
class LmChatGitHubCopilot {
    constructor() {
        this.description = {
            displayName: "GitHub Copilot Chat Model",
            name: "lmChatGitHubCopilot",
            icon: "file:github-copilot.svg",
            group: ["transform"],
            version: 1,
            description: "Use GitHub Copilot models as a chat model in n8n AI agents",
            defaults: {
                name: "GitHub Copilot Chat Model",
            },
            codex: {
                categories: ["AI"],
                subcategories: {
                    AI: ["Language Models", "Agents"],
                },
                resources: {
                    primaryDocumentation: [
                        {
                            url: "https://docs.github.com/en/copilot",
                        },
                    ],
                },
            },
            credentials: [
                {
                    name: "gitHubCopilotApi",
                    required: true,
                },
            ],
            inputs: [],
            outputs: [n8n_workflow_1.NodeConnectionTypes.AiLanguageModel],
            outputNames: ["Model"],
            properties: [
                {
                    displayName: "Model",
                    name: "model",
                    type: "options",
                    description: "The GitHub Copilot model to use. Models are fetched from the Copilot API.",
                    default: "",
                    typeOptions: {
                        loadOptionsMethod: "getModels",
                    },
                },
                {
                    displayName: "Options",
                    name: "options",
                    type: "collection",
                    default: {},
                    placeholder: "Add Option",
                    options: [
                        {
                            displayName: "Temperature",
                            name: "temperature",
                            type: "number",
                            default: 0.7,
                            typeOptions: {
                                maxValue: 2,
                                minValue: 0,
                                numberPrecision: 2,
                            },
                            description: "Controls randomness in the response. Lower values make output more focused and deterministic.",
                        },
                        {
                            displayName: "Maximum Tokens",
                            name: "maxTokens",
                            type: "number",
                            default: -1,
                            description: "Maximum number of tokens to generate. -1 means no limit.",
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getModels() {
                    const credentials = await this.getCredentials("gitHubCopilotApi");
                    const token = credentials.token;
                    const enterpriseUrl = credentials.enterpriseUrl;
                    const baseUrl = (0, GitHubCopilotChatModel_1.getBaseUrl)(enterpriseUrl);
                    try {
                        const response = await this.helpers.httpRequest({
                            method: "GET",
                            url: `${baseUrl}/models`,
                            headers: getCopilotHeaders(token),
                        });
                        const data = response;
                        // API may return { data: [...] } or { models: [...] } or an array directly
                        const models = Array.isArray(response)
                            ? response
                            : (data.data ?? data.models ?? []);
                        return models
                            .filter((m) => {
                            const capType = m.capabilities?.type?.toLowerCase() ?? "";
                            // Include models that are chat-capable or have no type restriction
                            return capType === "chat" || capType === "" || capType === "llm";
                        })
                            .map((m) => ({
                            name: m.name ?? m.id,
                            value: m.id,
                        }))
                            .sort((a, b) => a.name.localeCompare(b.name));
                    }
                    catch (error) {
                        console.warn("Failed to load models from GitHub Copilot API:", error instanceof Error ? error.message : String(error));
                        return [];
                    }
                },
            },
        };
    }
    async supplyData(itemIndex) {
        const credentials = await this.getCredentials("gitHubCopilotApi");
        const token = credentials.token;
        const enterpriseUrl = credentials.enterpriseUrl;
        const baseUrl = (0, GitHubCopilotChatModel_1.getBaseUrl)(enterpriseUrl);
        const model = this.getNodeParameter("model", itemIndex);
        const options = this.getNodeParameter("options", itemIndex, {});
        const chatModel = new GitHubCopilotChatModel_1.GitHubCopilotChatModel({
            token,
            baseUrl,
            model,
            temperature: options.temperature,
            maxTokens: options.maxTokens !== -1 ? options.maxTokens : undefined,
        });
        return {
            response: chatModel,
        };
    }
}
exports.LmChatGitHubCopilot = LmChatGitHubCopilot;
//# sourceMappingURL=LmChatGitHubCopilot.node.js.map