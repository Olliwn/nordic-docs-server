export interface CodeExample {
  code: string;
  language?: string;
  description?: string;
}

export interface APIReference {
  name: string;
  signature?: string;
  description?: string;
  parameters?: Array<{
    name: string;
    type?: string;
    description?: string;
  }>;
  returnType?: string;
  returnDescription?: string;
}

export interface ExtractedContent {
  apiReferences: APIReference[];
  codeExamples: CodeExample[];
  description?: string;
}

export function extractContent(text: string): ExtractedContent {
  const result: ExtractedContent = {
    apiReferences: [],
    codeExamples: []
  };

  // Split content by code blocks
  const sections = text.split(/```(?:(\w+)\n)?/);
  let currentDescription = '';

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]?.trim();
    if (!section) continue;

    if (i % 2 === 0) {
      // Text section
      // Look for API reference patterns
      const apiFunctionMatch = section.match(/(?:function|void|uint\d+_t|int\d+_t|\w+)\s+(\w+)\s*\((.*?)\)/);
      if (apiFunctionMatch) {
        const [fullMatch, name, params] = apiFunctionMatch;
        const apiRef: APIReference = {
          name,
          signature: fullMatch,
          parameters: params.split(',').map(param => {
            const [type, name] = param.trim().split(/\s+/);
            return { name, type };
          }).filter(p => p.name && p.type)
        };
        result.apiReferences.push(apiRef);
      } else {
        currentDescription += section + '\n';
      }
    } else {
      // Code section
      const language = sections[i - 1] || 'c';
      result.codeExamples.push({
        code: section,
        language,
        description: currentDescription.trim()
      });
      currentDescription = '';
    }
  }

  if (currentDescription.trim()) {
    result.description = currentDescription.trim();
  }

  return result;
}
