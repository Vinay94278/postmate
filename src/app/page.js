"use client";

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { parseAgentContent } from '@/utils/parseAgentContent';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [xUsername, setXUsername] = useState('');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate posts');
      }
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Post Generator
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Username
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="elonmusk"
                  value={linkedinUsername}
                  onChange={(e) => setLinkedinUsername(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X (Twitter) Handle
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="@elonmusk"
                  value={xUsername}
                  onChange={(e) => setXUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Topic
              </label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a topic (e.g., Generative AI advancements in 2024)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Generating...' : 'Create Posts'}
            </button>
          </form>
        </div>
        
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* LinkedIn Preview */}
          <div className="bg-white rounded-lg shadow-[0_2px_4px_rgba(0,0,0,0.1)] border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#0077b5] rounded-full mr-3 flex items-center justify-center text-white font-bold">
                  {linkedinUsername[0] || 'Y'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{linkedinUsername || 'Your Name'}</h3>
                  <p className="text-gray-600 text-sm">AI Professional • 1st</p>
                </div>
              </div>
            </div>
            <div className="p-4 font-sans text-gray-900">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className="prose prose-li:my-0 prose-ul:my-0 prose-p:my-2 max-w-none linkedin-prose"
                components={{
                  strong: ({ node, ...props }) => <span className="font-semibold" {...props} />,
                  em: ({ node, ...props }) => <span className="italic" {...props} />,
                  a: ({ node, ...props }) => <a className="text-[#0077b5] hover:underline" {...props} />
                }}
              >
                {parseAgentContent(results.linkedin_post).replace(/\*\*/g, '**')}
              </ReactMarkdown>
              <div className="mt-4 flex items-center text-gray-500 text-sm">
                <button className="flex items-center mr-4 hover:text-[#0077b5]">
                  <span className="mr-1">👍</span> 42
                </button>
                <button className="flex items-center mr-4 hover:text-[#0077b5]">
                  <span className="mr-1">💬</span> 18
                </button>
                <button className="flex items-center hover:text-[#0077b5]">
                  <span className="mr-1">🔄</span> 7
                </button>
              </div>
            </div>
          </div>

          {/* X (Twitter) Preview */}
          <div className="bg-black rounded-2xl shadow-xl border border-gray-800">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-full mr-3 flex items-center justify-center text-white">
                  {xUsername[0] || 'X'}
                </div>
                <div>
                  <h3 className="font-bold text-white">{xUsername || 'Your Name'}</h3>
                  <p className="text-gray-400 text-sm">@{xUsername.replace('@', '') || 'username'}</p>
                </div>
              </div>
            </div>
            <div className="p-4 font-sans">
              <div className="prose prose-invert max-w-none twitter-prose text-white"> {/* Changed text-gray-100 to text-white */}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-white" {...props} /> 
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic text-gray-200" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a className="text-blue-400 hover:underline" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-3 leading-snug text-white" {...props} />
                    )
                  }}
                >
                  {parseAgentContent(results.x_post)}
                </ReactMarkdown>
              </div>
              <div className="mt-4 flex justify-between text-gray-400 text-sm"> {/* Made engagement metrics slightly brighter */}
                <span>💬 289</span>
                <span>🔄 1.2K</span>
                <span>❤️ 4.8K</span>
                <span>📈 89.2K</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  </div>
  );
}