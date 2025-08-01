'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, X, Settings } from 'lucide-react';
import { triggerHapticFeedback } from '@/utils/haptics';

// --- Data and Types ---

const STATUS_CODES = [
  // 1xx Informational
  { code: 100, name: 'Continue', category: '1xx', description: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, name: 'Switching Protocols', category: '1xx', description: 'The requester has asked the server to switch protocols and the server has agreed to do so.' },
  // 2xx Success
  { code: 200, name: 'OK', category: '2xx', description: 'The request has succeeded. The meaning of the success depends on the HTTP method.' },
  { code: 201, name: 'Created', category: '2xx', description: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, name: 'Accepted', category: '2xx', description: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 204, name: 'No Content', category: '2xx', description: 'The server successfully processed the request and is not returning any content.' },
  { code: 206, name: 'Partial Content', category: '2xx', description: 'The server is delivering only part of the resource due to a range header sent by the client.' },
  // 3xx Redirection
  { code: 301, name: 'Moved Permanently', category: '3xx', description: 'This and all future requests should be directed to the given URI.' },
  { code: 302, name: 'Found', category: '3xx', description: 'Tells the client to look at another URL, but the original URL can be used in the future.' },
  { code: 304, name: 'Not Modified', category: '3xx', description: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
  { code: 307, name: 'Temporary Redirect', category: '3xx', description: 'The request should be repeated with another URI, but future requests should still use the original URI.' },
  // 4xx Client Error
  { code: 400, name: 'Bad Request', category: '4xx', description: 'The server cannot or will not process the request due to something that is perceived to be a client error.' },
  { code: 401, name: 'Unauthorized', category: '4xx', description: 'Authentication is required and has failed or has not yet been provided.' },
  { code: 403, name: 'Forbidden', category: '4xx', description: 'The request was valid, but the server is refusing action. The user might not have the necessary permissions.' },
  { code: 404, name: 'Not Found', category: '4xx', description: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, name: 'Method Not Allowed', category: '4xx', description: 'A request method is not supported for the requested resource; for example, a GET request on a form that requires data to be presented via POST.' },
  { code: 429, name: 'Too Many Requests', category: '4xx', description: 'The user has sent too many requests in a given amount of time ("rate limiting").' },
  // 5xx Server Error
  { code: 500, name: 'Internal Server Error', category: '5xx', description: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.' },
  { code: 502, name: 'Bad Gateway', category: '5xx', description: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, name: 'Service Unavailable', category: '5xx', description: 'The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.' },
  { code: 504, name: 'Gateway Timeout', category: '5xx', description: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
];

const CATEGORIES = ['All', '1xx', '2xx', '3xx', '4xx', '5xx'];

// --- Helper Functions for Styling ---

const getCategoryInfo = (category: string) => {
  switch (category) {
    case '1xx': return { title: '1xx Informational', border: 'border-blue-500', text: 'text-blue-500' };
    case '2xx': return { title: '2xx Success', border: 'border-green-500', text: 'text-green-500' };
    case '3xx': return { title: '3xx Redirection', border: 'border-yellow-500', text: 'text-yellow-500' };
    case '4xx': return { title: '4xx Client Error', border: 'border-red-500', text: 'text-red-500' };
    case '5xx': return { title: '5xx Server Error', border: 'border-purple-500', text: 'text-purple-500' };
    default: return { title: 'All', border: 'border-gray-500', text: 'text-gray-500' };
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  '1xx': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
  '2xx': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
  '3xx': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
  '4xx': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
  '5xx': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
  'All': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200'
};

// --- Main Page Component ---

export default function HttpStatusCodePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCode, setExpandedCode] = useState<number | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredCodes = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return STATUS_CODES.filter(item => {
      const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
      const searchMatch = !term || item.code.toString().includes(term) || item.name.toLowerCase().includes(term);
      return categoryMatch && searchMatch;
    });
  }, [searchTerm, selectedCategory]);

  const groupedCodes = useMemo(() => {
    return filteredCodes.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {} as Record<string, typeof STATUS_CODES>);
  }, [filteredCodes]);

  const handleCategoryClick = (category: string) => {
    triggerHapticFeedback();
    setSelectedCategory(category);
    setIsFilterModalOpen(false);
  };

  const handleCodeClick = (code: number) => {
    triggerHapticFeedback();
    setExpandedCode(expandedCode === code ? null : code);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">HTTP Status Codes 📜</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Quickly look up the meaning of any HTTP status code.</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="Search by code or name (e.g., 404, Not Found)"
            value={searchTerm}
            onFocus={triggerHapticFeedback}
            onChange={e => { setSearchTerm(e.target.value); triggerHapticFeedback(); }}
            className="w-full p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {/* Pills for Desktop */}
          <div className="hidden sm:flex flex-wrap justify-center gap-3 mt-4">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat;
              const colorClasses = CATEGORY_COLORS[cat] || CATEGORY_COLORS['All'];
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${isSelected ? `${colorClasses} shadow-md` : 'bg-gray-100 text-gray-700 dark:bg-gray-900/60 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80'}`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
          {/* Filter Button for Mobile */}
          <div className="sm:hidden flex justify-center mt-4">
            <button
              onClick={() => { setIsFilterModalOpen(true); triggerHapticFeedback(); }}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 border ${selectedCategory && selectedCategory !== 'All' ? `${CATEGORY_COLORS[selectedCategory]} border-transparent shadow-md` : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700'}`}
            >
              <Settings className="h-4 w-4" />
              <span>Filters {selectedCategory && selectedCategory !== 'All' ? `(${selectedCategory})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Filter Modal for Mobile */}
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFilterModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} >
          <div className={`absolute inset-0 bg-black/20 ${isFilterModalOpen ? 'backdrop-blur-sm' : ''}`} onClick={() => setIsFilterModalOpen(false)}></div>
          <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 w-11/12 max-w-md border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 ease-out ${isFilterModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Select a Category</h3>
              <button onClick={() => { setIsFilterModalOpen(false); triggerHapticFeedback(); }} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map(cat => {
                const isSelected = selectedCategory === cat;
                const colorClasses = CATEGORY_COLORS[cat] || CATEGORY_COLORS['All'];
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 transform hover:scale-105 ${isSelected ? `${colorClasses} shadow-lg` : 'bg-gray-100/80 text-gray-700 dark:bg-gray-900/60 dark:text-gray-300 hover:bg-gray-200/80 dark:hover:bg-gray-700/80'}`}
                  >
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-8 mt-8">
          {Object.entries(groupedCodes).map(([category, items]) => {
            const { title, border, text } = getCategoryInfo(category);
            return (
              <section key={category}>
                <h2 className={`text-2xl font-bold mb-4 pb-2 border-b-2 ${border} ${text}`}>{title}</h2>
                <div className="space-y-2">
                  {items.map(item => {
                    const isExpanded = expandedCode === item.code;
                    return (
                      <button
                        key={item.code}
                        onClick={() => handleCodeClick(item.code)}
                        className="w-full p-4 text-left bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <p className={`font-mono font-bold text-2xl ${text}`}>{item.code}</p>
                            <p className="font-semibold text-lg text-gray-900 dark:text-white">{item.name}</p>
                          </div>
                          <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700' : 'max-h-0'}`}>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {filteredCodes.length === 0 && (
            <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <p className="text-gray-500 text-lg">No status codes found for your query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
