'use client';

import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

// --- Enriched Data with More Codes and Descriptions ---
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

const HttpStatusCodePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedCode, setExpandedCode] = useState<number | null>(null);

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

  const categories = ['All', '1xx', '2xx', '3xx', '4xx', '5xx'];

  const getCategoryInfo = (category: string) => {
      switch(category) {
          case '1xx': return { title: '1xx Informational', color: 'blue', border: 'border-blue-500', text: 'text-blue-500', bg: 'bg-blue-500/10' };
          case '2xx': return { title: '2xx Success', color: 'green', border: 'border-green-500', text: 'text-green-500', bg: 'bg-green-500/10' };
          case '3xx': return { title: '3xx Redirection', color: 'yellow', border: 'border-yellow-500', text: 'text-yellow-500', bg: 'bg-yellow-500/10' };
          case '4xx': return { title: '4xx Client Error', color: 'red', border: 'border-red-500', text: 'text-red-500', bg: 'bg-red-500/10' };
          case '5xx': return { title: '5xx Server Error', color: 'purple', border: 'border-purple-500', text: 'text-purple-500', bg: 'bg-purple-500/10' };
          default: return { title: 'All', color: 'gray', border: 'border-gray-500', text: 'text-gray-500', bg: 'bg-gray-500/10'};
      }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 mt-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">HTTP Status Codes 📜</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Quickly look up the meaning of any HTTP status code.</p>
      </div>

      <div className="sticky top-4 z-10 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-xl mb-6">
        <input
          type="text"
          placeholder="Search by code or name (e.g., 404, Not Found)"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full p-4 text-lg border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {categories.map(cat => {
            const { color } = getCategoryInfo(cat);
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 border-2 ${
                  selectedCategory === cat
                  ? `bg-${color}-500 text-white border-${color}-500`
                  : `bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-transparent hover:border-${color}-500`
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedCodes).map(([category, items]) => {
          const { title, border, text } = getCategoryInfo(category);
          return (
              <section key={category}>
                  <h2 className={`text-2xl font-bold mb-4 pb-2 border-b-2 ${border} ${text}`}>{title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map(item => {
                        const isExpanded = expandedCode === item.code;
                        return (
                          <button 
                            key={item.code} 
                            onClick={() => setExpandedCode(isExpanded ? null : item.code)}
                            className={`p-4 text-left bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
                          >
                              <div className="flex justify-between items-start">
                                  <div>
                                    <p className={`font-mono font-bold text-3xl ${text}`}>{item.code}</p>
                                    <p className="font-semibold text-lg text-gray-900 dark:text-white mt-1">{item.name}</p>
                                  </div>
                                  <ChevronDown className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                              </div>
                              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 mt-2' : 'max-h-0'}`}>
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
            <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No status codes found for your query.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default HttpStatusCodePage;
