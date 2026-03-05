import type { ICredentialType, INodeProperties } from "n8n-workflow";

// OpenCode GitHub Copilot OAuth app client ID (public, used by all Copilot clients)
export const DEFAULT_CLIENT_ID = "Ov23li8tweQw6odWQebz";

export class GitHubCopilotApi implements ICredentialType {
  name = "gitHubCopilotApi";

  displayName = "GitHub Copilot API";

  documentationUrl =
    "https://github.com/kk17/n8n-nodes-github-copilot-chat-models/blob/main/docs/CREDENTIALS.md";

  properties: INodeProperties[] = [
    {
      displayName: "OAuth Token",
      name: "token",
      type: "string",
      typeOptions: { password: true },
      default: "",
      description:
        "GitHub OAuth token (gho_...). " +
        "Leave empty and click 'Save' to start the device authorization flow. " +
        "Personal Access Tokens (PAT) and fine-grained tokens are NOT supported.",
      placeholder: "gho_xxxxxxxxxxxx",
    },
    {
      displayName: "Enterprise Server Domain",
      name: "enterpriseUrl",
      type: "string",
      default: "",
      description:
        "For GitHub Enterprise Server (GHES) with a custom domain only — e.g. company.ghe.com. " +
        "Leave empty for github.com AND GitHub Enterprise Cloud (github.com/enterprises/...). " +
        "Do NOT enter the full URL — just the hostname.",
      placeholder: "company.ghe.com",
    },
    {
      displayName: "OAuth Client ID",
      name: "clientId",
      type: "string",
      default: "",
      description:
        "OAuth client ID used for the device authorization flow. " +
        "Leave empty to use the default VS Code Copilot client ID. " +
        `Default: ${DEFAULT_CLIENT_ID}`,
      placeholder: DEFAULT_CLIENT_ID,
    },
  ];
}
