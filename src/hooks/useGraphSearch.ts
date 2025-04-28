import { useState, useCallback } from 'react';
import { searchEmails } from '../services/graphApi';

interface SearchResult {
  id: string;
  subject: string;
  from: {
    emailAddress: {
      name: string;
      address: string;
    };
  };
  receivedDateTime: string;
  bodyPreview: string;
  body: {
    content: string;
  };
}

export const useGraphSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const searchResults = await searchEmails(query);
      setResults(searchResults);
    } catch (err: any) {
      setError(err.message || 'Failed to search emails');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    results,
    isLoading,
    error,
    search
  };
};