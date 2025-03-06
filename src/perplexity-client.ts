import axios from 'axios';

export interface PerplexityResponse {
  text: string;
  references?: string[];
}

interface PerplexityAPIResponse {
  choices: Array<{
    message: {
      content: string;
      context?: {
        sources?: string[];
      };
    };
  }>;
}

export class PerplexityClient {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.perplexity.ai';

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error('Perplexity API key is required');
    }
    this.apiKey = apiKey;
  }

  async query(prompt: string): Promise<PerplexityResponse> {
    try {
      const requestBody = {
        model: 'sonar',  // Changed to just 'sonar'
        messages: [
          {
            role: 'system',
            content: 'You are a documentation search assistant focused on Nordic Semiconductor documentation. Provide accurate, code-focused responses based on Nordic documentation.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      };

      console.error('[DEBUG] Perplexity Request URL:', `${this.baseUrl}/chat/completions`);
      console.error('[DEBUG] Perplexity Request Body:', JSON.stringify(requestBody, null, 2));
      
      const response = await axios.post<PerplexityAPIResponse>(
        `${this.baseUrl}/chat/completions`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.error('[DEBUG] Perplexity Response Status:', response.status);
      console.error('[DEBUG] Perplexity Response Headers:', JSON.stringify(response.headers, null, 2));
      console.error('[DEBUG] Perplexity Response Data:', JSON.stringify(response.data, null, 2));
      
      const content = response.data.choices[0]?.message.content;
      if (!content) {
        throw new Error('Invalid response from Perplexity API');
      }

      return {
        text: content,
        references: response.data.choices[0].message.context?.sources
      };
    } catch (error) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: any;
            status?: number;
            statusText?: string;
          }; 
          message?: string;
          config?: any;
        };

        console.error('[DEBUG] Perplexity API Error:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          message: axiosError.message,
          requestConfig: {
            url: axiosError.config?.url,
            method: axiosError.config?.method,
            data: axiosError.config?.data
          }
        });

        const errorDetails = JSON.stringify({
          message: axiosError.response?.data?.error || axiosError.message,
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data
        });

        throw new Error(`Perplexity API error: ${errorDetails}`);
      }
      
      console.error('[DEBUG] Unexpected error:', error);
      throw new Error(`Perplexity API error: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    }
  }
}
