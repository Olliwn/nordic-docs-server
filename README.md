# Nordic Documentation MCP Server

An MCP (Model Context Protocol) server that provides tools for searching Nordic Semiconductor documentation, including API references and code examples.

## Features

- Search Nordic Semiconductor documentation
- Filter results by SDK version
- Get API references and code examples
- Integration with Perplexity AI for intelligent search

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Perplexity API key (get one from [Perplexity AI](https://www.perplexity.ai))

## Installation

1. Clone this repository:
```bash
git clone https://github.com/Olliwn/nordic-docs-server.git
cd nordic-docs-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Add your Perplexity API key to the `.env` file:
```
PERPLEXITY_API_KEY=your-api-key-here
```

5. Build the project:
```bash
npm run build
```

## Installing in Different AI Apps

### Cline

1. Open Cline's MCP settings file:
   - Location: `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`

2. Add the following configuration:
```json
{
  "mcpServers": {
    "nordic-docs": {
      "command": "node",
      "args": ["/path/to/nordic-docs-server/build/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Claude Desktop App

1. Open Claude Desktop's configuration file:
   - Location: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Add the following configuration:
```json
{
  "mcpServers": {
    "nordic-docs": {
      "command": "node",
      "args": ["/path/to/nordic-docs-server/build/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cursor

1. Open Cursor's settings:
   - Click on the gear icon in the bottom left
   - Select "MCP Settings"

2. Add the following configuration:
```json
{
  "mcpServers": {
    "nordic-docs": {
      "command": "node",
      "args": ["/path/to/nordic-docs-server/build/index.js"],
      "env": {
        "PERPLEXITY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Usage

Once installed, the server provides the following tool:

- `search_nordic_docs`: Search Nordic Semiconductor documentation
  - Parameters:
    - `query` (required): Search query or API function name
    - `sdk_version` (optional): Target SDK version (e.g., "nRF5 SDK v17.1.0")
    - `result_type` (optional): Type of results to return ('api_reference', 'code_example', or 'both')

Example usage in Cline/Claude/Cursor:
```
"Search for information about the nrf_drv_spi_init function"
```

## Development

To run the server in development mode:
```bash
npm run dev
```

To run tests:
```bash
npm test
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
