export interface FormattedResponse {
  query: string;
  results: {
    api_reference?: {
      function?: string;
      parameters?: Array<{
        name: string;
        type: string;
        description: string;
      }>;
      return_value?: string;
      description?: string;
    };
    code_example?: {
      code: string;
      explanation: string;
    };
    source_url?: string;
    sdk_version?: string;
  }[];
  metadata: {
    result_type: 'api_reference' | 'code_example' | 'both';
    source: string;
  };
}

export function formatResponse(
  response: string,
  resultType: 'api_reference' | 'code_example' | 'both' = 'both'
): FormattedResponse {
  // For now, we'll return a basic structure and rely on Perplexity's formatting
  // In the future, we can add more sophisticated parsing of the response
  return {
    query: response.split('\n')[0] || 'No query found',
    results: [
      {
        api_reference: resultType !== 'code_example' ? {
          description: response,
        } : undefined,
        code_example: resultType !== 'api_reference' ? {
          code: extractCodeBlocks(response),
          explanation: response,
        } : undefined,
        source_url: extractSourceUrl(response),
      },
    ],
    metadata: {
      result_type: resultType,
      source: 'Nordic Semiconductor Documentation',
    },
  };
}

function extractCodeBlocks(text: string): string {
  const codeBlockRegex = /```(?:c|cpp)?\n([\s\S]*?)```/g;
  const matches = [...text.matchAll(codeBlockRegex)];
  
  if (matches.length === 0) {
    return text; // Return the whole text if no code blocks found
  }

  return matches.map(match => match[1].trim()).join('\n\n');
}

function extractSourceUrl(text: string): string | undefined {
  const urlRegex = /https?:\/\/docs\.nordicsemi\.com[^\s)]+/;
  const match = text.match(urlRegex);
  return match ? match[0] : undefined;
}
