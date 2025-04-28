import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, RefreshCw, StopCircle } from 'lucide-react';
import { searchEmails } from '../../services/graphApi';

interface CandidateReviewProps {
  data: {
    headers: string[];
    rows: string[][];
  };
  onStop: () => void;
}

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

export const CandidateReview: React.FC<CandidateReviewProps> = ({ data, onStop }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processedIndices, setProcessedIndices] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('processedCandidates');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [extraKeywords, setExtraKeywords] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set());

  const currentCandidate = data.rows[currentIndex];
  const candidateName = currentCandidate[data.headers.indexOf('Candidate Name')];
  const company = currentCandidate[data.headers.indexOf('Company')];

  const performSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await searchEmails(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    performSearch(`${candidateName} ${company}`);
  }, [currentIndex, candidateName, company]);

  useEffect(() => {
    localStorage.setItem('processedCandidates', JSON.stringify([...processedIndices]));
  }, [processedIndices]);

  const handleRetry = () => {
    if (!extraKeywords.trim()) return;
    performSearch(`${candidateName} ${company} ${extraKeywords}`);
    setExtraKeywords('');
  };

  const handleContinue = () => {
    const newProcessed = new Set(processedIndices).add(currentIndex);
    setProcessedIndices(newProcessed);
    
    let nextIndex = currentIndex + 1;
    while (nextIndex < data.rows.length && newProcessed.has(nextIndex)) {
      nextIndex++;
    }
    
    if (nextIndex < data.rows.length) {
      setCurrentIndex(nextIndex);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleResultExpansion = (resultId: string) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(resultId)) {
      newExpanded.delete(resultId);
    } else {
      newExpanded.add(resultId);
    }
    setExpandedResults(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Reviewing Candidate {currentIndex + 1} of {data.rows.length}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              {candidateName} at {company}
              {processedIndices.has(currentIndex) && 
                <span className="ml-2 text-emerald-600">(Previously processed)</span>
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleBack}
              disabled={currentIndex === 0}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back
            </button>
            <button
              onClick={handleContinue}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Continue
              <ChevronRight size={16} className="ml-1" />
            </button>
            <button
              onClick={onStop}
              className="inline-flex items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <StopCircle size={16} className="mr-1" />
              Stop
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={extraKeywords}
              onChange={(e) => setExtraKeywords(e.target.value)}
              placeholder="Enter additional keywords..."
              className="block w-full rounded-md border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onKeyDown={(e) => e.key === 'Enter' && handleRetry()}
            />
          </div>
          <button
            onClick={handleRetry}
            disabled={!extraKeywords.trim() || isSearching}
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSearching ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Search size={16} className="mr-2" />
            )}
            Retry Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-6">
        {searchResults.length === 0 ? (
          <div className="rounded-md bg-slate-50 p-8 text-center text-sm text-slate-700">
            No results found. Try adding some keywords and retry the search.
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
              >
                <div
                  className="flex cursor-pointer items-center justify-between border-b border-slate-200 bg-slate-50 p-4 hover:bg-slate-100"
                  onClick={() => toggleResultExpansion(result.id)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900">{result.subject}</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      From: {result.from.emailAddress.name} ({result.from.emailAddress.address})
                    </p>
                    <p className="text-sm text-slate-500">
                      {formatDate(result.receivedDateTime)}
                    </p>
                  </div>
                  <ChevronRight
                    size={20}
                    className={`text-slate-400 transition-transform ${
                      expandedResults.has(result.id) ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {expandedResults.has(result.id) && (
                  <div className="bg-white p-6">
                    <div
                      className="prose prose-sm max-w-none text-slate-700"
                      dangerouslySetInnerHTML={{ __html: result.body.content }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};