#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';
import { PerplexityClient } from './perplexity-client.js';
import { enhanceQuery, QueryContext } from './utils/query-enhancer.js';
import { formatResponse } from './utils/response-formatter.js';

// Load environment variables
// config(); // Temporarily commented out

const PERPLEXITY_API_KEY = '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'; // Hardcoded for temporary testing
if (!PERPLEXITY_API_KEY) {
  throw new Error('PERPLEXITY_API_KEY environment variable is required');
}

interface SearchNordicDocsArgs {
  query: string;
  sdk_version?: string;
  result_type?: 'api_reference' | 'code_example' | 'both';
}

class NordicDocsServer {
  private server: Server;
  private perplexityClient: PerplexityClient;

  constructor() {
    this.server = new Server(
      {
        name: 'nordic-docs-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.perplexityClient = new PerplexityClient(PERPLEXITY_API_KEY);
    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
      if (error instanceof Error) {
        console.error('[MCP Error Stack]', error.stack);
      }
    };
    
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });

    // Debug logging for all incoming messages
    process.stdin.on('data', (data) => {
      try {
        console.error('[DEBUG] Received stdin data:', data.toString());
        // Try parsing it to see if it's valid JSON
        JSON.parse(data.toString());
      } catch (error) {
        console.error('[DEBUG] Invalid JSON received:', error);
      }
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.error('[DEBUG] Handling ListTools request');
      return {
        tools: [
          {
            name: 'search_nordic_docs',
            description: 'Search Nordic Semiconductor documentation for API references and code examples',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query or API function name',
                },
                sdk_version: {
                  type: 'string',
                  description: 'Optional SDK version to target (e.g., "nRF5 SDK v17.1.0")',
                },
                result_type: {
                  type: 'string',
                  enum: ['api_reference', 'code_example', 'both'],
                  description: 'Type of results to return',
                  default: 'both',
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.error('[DEBUG] Handling CallTool request:', JSON.stringify(request, null, 2));

      if (request.params.name !== 'search_nordic_docs') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      try {
        const args = request.params.arguments as unknown as SearchNordicDocsArgs | undefined;
        console.error('[DEBUG] Parsed arguments:', JSON.stringify(args, null, 2));

        if (!args?.query) {
          throw new McpError(
            ErrorCode.InvalidParams,
            'Query parameter is required'
          );
        }

        const queryContext: QueryContext = {
          sdkVersion: args.sdk_version,
          resultType: args.result_type,
        };

        const enhancedQuery = enhanceQuery(args.query, queryContext);
        console.error('[DEBUG] Enhanced query:', enhancedQuery);

        const response = await this.perplexityClient.query(enhancedQuery);
        console.error('[DEBUG] Perplexity response received');

        const result = formatResponse(response.text, args.result_type || 'both');
        console.error('[DEBUG] Formatted response:', JSON.stringify(result, null, 2));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        console.error('[DEBUG] Error in CallTool handler:', error);
        return {
          content: [
            {
              type: 'text',
              text: `Error searching documentation: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    try {
      const transport = new StdioServerTransport();
      console.error('[DEBUG] Starting server with stdio transport');
      await this.server.connect(transport);
      console.error('Nordic Documentation MCP server running on stdio');
    } catch (error) {
      console.error('[DEBUG] Error starting server:', error);
      process.exit(1);
    }
  }
}

const server = new NordicDocsServer();
server.run().catch(console.error);
