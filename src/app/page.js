"use client";

import { useState, useEffect } from "react";
import { LinkedInPreview, XPreview } from '@/components/PostPreviews';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import { auth } from "@/firebase"; // Firebase auth
import { useRouter } from "next/navigation";
import axios from "axios";
import { parseAgentContent } from '@/utils/parseAgentContent';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [linkedinUsername, setLinkedinUsername] = useState('');
  const [xUsername, setXUsername] = useState('');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('form'); // 'form', 'research', or 'preview'
  const [user, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState({ groq_api_key: "", phi_agno_api_key: "" });

  const router = useRouter();
  // **Check if user is logged in**
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchAPIKeys(user.uid);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  // **Fetch API Keys from Backend**
  const fetchAPIKeys = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/profile?user_id=${userId}`);
  
      if (response.status === 200) {
        setApiKeys(response.data);
  
        // ✅ Redirect only if API keys exist
        if (response.data.groq_api_key && response.data.phi_agno_api_key) {
          console.log("API Keys loaded successfully.");
        } else {
          console.warn("API keys are missing. Redirecting to profile page.");
          router.push("/profile");
        }
      } else {
        console.error("User API keys not found");
      }
    } catch (error) {
      console.error("Failed to fetch API keys", error);
    }
  };
  
  // **Handle Content Generation**
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if (!user) {
      alert("You must be logged in to generate content.");
      return;
    }
  
    if (!apiKeys.groq_api_key || !apiKeys.phi_agno_api_key) {
      alert("Please enter API keys in your profile first.");
      router.push("/profile");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5000/generate", {
        user_id: user.uid,
        topic,
      });
  
      if (!response.data) throw new Error("Failed to generate posts");
      setResults(response.data);
      setActiveTab("preview");
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Postmate AI
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate engaging social media content for LinkedIn and X (Twitter) with just a few clicks.
            Powered by AI research and content creation.
          </p>
        </div>

        {/* Main Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'form'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Input
            </button>
            <button
              onClick={() => setActiveTab('research')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'research'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
              disabled={!results}
            >
              Research
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'preview'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
                }`}
              disabled={!results}
            >
              Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'form' && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Username
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                      placeholder="janedoe"
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
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                      placeholder="@janedoe"
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500"
                    placeholder="Enter a topic (e.g., Generative AI advancements in 2025)"
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
            )}

            {activeTab === 'research' && results && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Research Summary</h2>
                <div className="prose max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({ node, ...props }) => (
                        <strong className="font-semibold text-gray-900" {...props} />
                      ),
                      em: ({ node, ...props }) => (
                        <em className="italic text-gray-700" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-600 hover:underline" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-4 leading-relaxed" {...props} />
                      )
                    }}
                  >
                    {results.research_summary}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {activeTab === 'preview' && results && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0077b5" className="w-5 h-5 mr-2">
                      <path d="M4.75 3h14.5c.966 0 1.75.784 1.75 1.75v14.5A1.75 1.75 0 0 1 19.25 21H4.75A1.75 1.75 0 0 1 3 19.25V4.75C3 3.784 3.784 3 4.75 3Z" />
                      <path d="M8.447 9.105c0-1.005-.815-1.82-1.82-1.82s-1.82.815-1.82 1.82c0 1.005.815 1.82 1.82 1.82s1.82-.815 1.82-1.82ZM13.21 10.925h2.415v1.006c0 .14.001.28.003.094.003.035.006.07.013.103a.324.324 0 0 0 .31.183c.114 0 .22-.035.31-.102l.001-.001.002-.002c.08-.073.266-.35.335-.814h1.225c-.07 1.015-.444 1.696-.865 2.097a1.624 1.624 0 0 1-1.103.446c-1.25 0-1.63-1.147-1.63-2.175v-.835h-1.021v5.415h-1.905v-5.415H9.902v-1.521H11.3v-.113c0-1.723.577-2.937 2.468-2.937a4.16 4.16 0 0 1 1.572.272l-.174 1.607a2.337 2.337 0 0 0-1.105-.272c-.906 0-1.242.377-1.242 1.282v.161h1.398v1.521h-.007Z" />
                    </svg>
                    LinkedIn Preview
                  </h2>
                  <LinkedInPreview post={results.linkedin_post} username={linkedinUsername} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                      <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                    </svg>
                    X Preview
                  </h2>
                  <XPreview post={results.x_post} username={xUsername} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}