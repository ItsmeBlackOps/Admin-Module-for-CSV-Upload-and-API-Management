import { Client } from "@microsoft/microsoft-graph-client";
import { Message } from "@microsoft/microsoft-graph-types";

interface GraphSearchResult {
  id: string;
  subject: string;
  bodyPreview: string;
  body: {
    contentType: string;
    content: string;
  };
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  receivedDateTime: string;
}

let retryCount = 0;
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 3000, 5000]; // Delays in milliseconds

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const searchEmails = async (query: string): Promise<GraphSearchResult[]> => {
  const apiKey = localStorage.getItem('graphApiKey');
  
  if (!apiKey) {
    throw new Error('Graph API key not found. Please configure it in API Management.');
  }

  const client = Client.init({
    authProvider: (done) => {
      done(null, apiKey);
    }
  });

  const searchWithRetry = async (): Promise<GraphSearchResult[]> => {
    try {
      const response = await client
        .api('/me/messages')
        .search(`"${query}"`)
        .select(['id', 'subject', 'bodyPreview', 'body', 'from', 'receivedDateTime'])
        .top(2)
        .get();

      return response.value as Message[];
    } catch (error: any) {
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAYS[retryCount];
        retryCount++;
        
        // Check for specific error types
        if (error.statusCode === 429) { // Rate limit
          const retryAfter = error.headers?.['retry-after'] || delay;
          await sleep(parseInt(retryAfter, 10) * 1000);
        } else if (error.statusCode >= 500) { // Server error
          await sleep(delay);
        } else if (error.statusCode === 401 || error.statusCode === 403) {
          throw new Error('Authentication failed. Please check your API key.');
        } else {
          throw error;
        }
        
        return searchWithRetry();
      }
      
      throw error;
    }
  };

  try {
    retryCount = 0;
    return await searchWithRetry();
  } catch (error: any) {
    console.error('Graph API search error:', error);
    throw new Error(error.message || 'Failed to search emails');
  }
};