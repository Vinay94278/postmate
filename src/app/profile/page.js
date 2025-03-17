"use client";
import { useState, useEffect, useCallback } from "react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Profile() {
  const [apiKeys, setApiKeys] = useState({ groq_api_key: "", phi_agno_api_key: "" });
  const [groqApiKey, setGroqApiKey] = useState("");
  const [phiApiKey, setPhiApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showPhiKey, setShowPhiKey] = useState(false);
  const [user, setUser] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const router = useRouter();

  // ✅ Fetch API keys on login
  const fetchAPIKeys = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile?user_id=${userId}`);

      if (response.status === 200) {
        setApiKeys(response.data);

        if (!response.data.exists) {
          setIsFirstLogin(true);  // 🚀 First-time login: Ask for API keys
        } else {
          setGroqApiKey(response.data.groq_api_key);
          setPhiApiKey(response.data.phi_agno_api_key);
        }
      } else {
        console.error("User API keys not found");
      }
    } catch (error) {
      console.error("Failed to fetch API keys", error);
    }
  }, []);

  // ✅ Check if user is logged in
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

  // ✅ Save API Keys
  const handleSaveAPIKeys = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!user || !groqApiKey || !phiApiKey) {
      alert("Please enter API keys.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/save-api-keys`, {
        user_id: user.uid,
        groq_api_key: groqApiKey,
        phi_agno_api_key: phiApiKey,
      });

      if (response.status === 200) {
        setMessage("API Keys saved successfully!");
        setIsFirstLogin(false);  // 🚀 After saving, remove first-login flag
        setTimeout(() => router.push("/main"), 2000);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      setMessage("Error saving API keys.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-black mb-4">Profile</h2>

        {/* ✅ Show API Key Form if First Login */}
        {isFirstLogin ? (
          <form onSubmit={handleSaveAPIKeys}>
            <div className="mb-4 relative">
              <label className="block text-sm text-black font-medium">Groq API Key</label>
              <input
                type={showGroqKey ? "text" : "password"}
                className="w-full p-3 border border-gray-300 text-black rounded-lg"
                placeholder="Enter Groq API Key"
                value={groqApiKey}
                onChange={(e) => setGroqApiKey(e.target.value)}
              />
              <button type="button" className="absolute right-3 top-10" onClick={() => setShowGroqKey(!showGroqKey)}>
                {showGroqKey ? "🙈" : "👁️"}
              </button>
            </div>

            <div className="mb-4 relative">
              <label className="block text-sm text-black font-medium">Phi Agno API Key</label>
              <input
                type={showPhiKey ? "text" : "password"}
                className="w-full p-3 border border-gray-300 text-black rounded-lg"
                placeholder="Enter Phi Agno API Key"
                value={phiApiKey}
                onChange={(e) => setPhiApiKey(e.target.value)}
              />
              <button type="button" className="absolute right-3 top-10" onClick={() => setShowPhiKey(!showPhiKey)}>
                {showPhiKey ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg">
              {loading ? "Saving..." : "Save API Keys"}
            </button>

            {message && <p className="mt-2 text-center text-sm text-gray-600">{message}</p>}
          </form>
        ) : (
          // ✅ Show Update Button if API keys exist
          <div className="text-center">
            <p className="text-gray-700">Your API keys are already saved.</p>
            <button
              onClick={() => setIsFirstLogin(true)}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
            >
              Update API Keys
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
