export interface QueryContext {
  sdkVersion?: string;
  resultType?: 'api_reference' | 'code_example' | 'both';
}

export function enhanceQuery(query: string, context: QueryContext = {}): string {
  const parts: string[] = [
    `From Nordic Semiconductor documentation (https://docs.nordicsemi.com/), provide information about: ${query}`
  ];

  if (context.sdkVersion) {
    parts.push(`Focus on documentation for ${context.sdkVersion}.`);
  }

  if (context.resultType === 'api_reference') {
    parts.push('Focus on API references, including function signatures, parameters, return values, and brief usage examples.');
  } else if (context.resultType === 'code_example') {
    parts.push('Focus on providing detailed code examples with explanations.');
  } else {
    parts.push('Include both API references and code examples if available.');
  }

  parts.push('Format the response to be easily parsed for code generation.');
  parts.push('Structure the response with clear sections for API details and code examples.');

  return parts.join('\n');
}
