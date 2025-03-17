"use client";

import { useState, useEffect, useCallback } from "react";
import { LinkedInPreview, XPreview } from "@/components/PostPreviews";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { auth } from "@/firebase"; // Firebase auth
import { useRouter } from "next/navigation";
import axios from "axios";

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const [linkedinUsername] = useState("");
  const [xUsername] = useState("");
  const [topic, setTopic] = useState("");
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState("form");
  const [user, setUser] = useState(null);
  const [apiKeys, setApiKeys] = useState({ groq_api_key: "", phi_agno_api_key: "" });

  const router = useRouter();

  // Fetch API Keys from Backend
  const fetchAPIKeys = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile?user_id=${userId}`);
      if (response.status === 200) {
        setApiKeys(response.data);

        // ✅ Redirect to profile if API keys are missing
        if (!response.data.groq_api_key || !response.data.phi_agno_api_key) {
          console.warn("API keys missing. Redirecting to profile...");
          router.push("/profile");
        } else {
          console.log("API keys loaded successfully.");
        }
      }
    } catch (error) {
      console.error("Failed to fetch API keys", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Check if user is logged in and fetch API keys
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchAPIKeys(user.uid);
      } else {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [fetchAPIKeys, router]);

  // Handle Content Generation
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
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/generate`, {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Postmate AI
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate engaging social media content for LinkedIn and X (Twitter) with just a few clicks.
          </p>
        </div>

        {/* Update API Key Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => router.push("/profile")}
            className="px-4 py-2 bg-gray-300 text-black rounded-lg"
          >
            Update API Keys
          </button>
        </div>

        {/* Main Tabs */}
        <div className="mb-6 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("form")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "form"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Input
            </button>
            <button
              onClick={() => setActiveTab("research")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "research"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              disabled={!results}
            >
              Research
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-6 py-3 font-medium text-sm transition-colors ${
                activeTab === "preview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              disabled={!results}
            >
              Preview
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "form" && (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Post Topic
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="Enter a topic (e.g., AI trends in 2025)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg"
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Create Posts"}
                </button>
              </form>
            )}

            {activeTab === "research" && results && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">Research Summary</h2>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{results.research_summary}</ReactMarkdown>
              </div>
            )}

            {activeTab === "preview" && results && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">LinkedIn Preview</h2>
                  <LinkedInPreview post={results.linkedin_post} username={linkedinUsername} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">X Preview</h2>
                  <XPreview post={results.x_post} username={xUsername} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
