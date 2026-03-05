# Troubleshooting

## Cannot add the GitHub Copilot Chat Model to the AI Agent node

Check your AI Agent node version in the node settings page.

**AI Agent node version compatibility:**
- v1.7: unsupported (tested)
- v3.1: supported (tested)

If you are using an unsupported AI Agent node version, you can either:
- Delete the existing node and create a new one (n8n will automatically use the latest version)
- Download the workflow as JSON, modify the node version, and re-import to n8n