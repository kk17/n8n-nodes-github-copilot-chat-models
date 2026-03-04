"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitHubCopilotApi = void 0;
class GitHubCopilotApi {
    constructor() {
        this.name = "gitHubCopilotApi";
        this.displayName = "GitHub Copilot API";
        this.documentationUrl = "https://docs.github.com/en/copilot/using-github-copilot/using-github-copilot-in-your-ide";
        this.properties = [
            {
                displayName: "GitHub Token",
                name: "token",
                type: "string",
                typeOptions: { password: true },
                default: "",
                required: true,
                description: "GitHub Personal Access Token (PAT) or OAuth token with GitHub Copilot access",
                placeholder: "ghp_xxxxxxxxxxxx",
            },
            {
                displayName: "Enterprise URL",
                name: "enterpriseUrl",
                type: "string",
                default: "",
                description: "GitHub Enterprise domain (e.g. company.ghe.com). Leave empty for github.com.",
                placeholder: "company.ghe.com",
            },
        ];
        this.test = {
            request: {
                baseURL: '={{$credentials.enterpriseUrl ? "https://copilot-api." + $credentials.enterpriseUrl.replace(/^https?:\\/\\//, "").replace(/\\/$/, "") : "https://api.githubcopilot.com"}}',
                url: "/models",
                method: "GET",
                headers: {
                    Authorization: "=Bearer {{$credentials.token}}",
                    "Copilot-Integration-Id": "vscode-chat",
                    "x-initiator": "user",
                },
            },
        };
    }
}
exports.GitHubCopilotApi = GitHubCopilotApi;
//# sourceMappingURL=GitHubCopilotApi.credentials.js.map