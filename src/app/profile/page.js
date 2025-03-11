"use client";
import { useState, useEffect, useCallback } from "react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Profile() {
  const [groqApiKey, setGroqApiKey] = useState("");
  const [phiApiKey, setPhiApiKey] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showPhiKey, setShowPhiKey] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  // **Stable fetchAPIKeys Function**
  const fetchAPIKeys = useCallback(async (userId) => {
    if (!userId) return; // ✅ Prevent unnecessary API calls if userId is null

    try {
      const response = await axios.get(`http://localhost:5000/profile?user_id=${userId}`);
      if (response.status === 200) {
        setApiKeys(response.data);

        // ✅ Redirect only if API keys are missing
        if (!response.data.groq_api_key || !response.data.phi_agno_api_key) {
          console.warn("API keys are missing. Redirecting to profile page.");
          router.push("/profile");
        } else {
          console.log("API Keys loaded successfully.");
        }
      } else {
        console.error("User API keys not found");
      }
    } catch (error) {
      console.error("Failed to fetch API keys", error);
    }
  }, [router]); // ✅ Only `router` as a dependency

  // **Check if user is logged in**
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        fetchAPIKeys(user.uid); // ✅ Function is now stable
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [fetchAPIKeys, router]);

  const handleSaveAPIKeys = async (e) => {
    e.preventDefault();
    setLoading(true); // Start Loading

    if (!user || !groqApiKey || !phiApiKey) {
      alert("Please enter API keys and log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/save-api-keys", {
        user_id: user.uid,
        groq_api_key: groqApiKey,
        phi_agno_api_key: phiApiKey,
      });

      if (response.status === 200) {
        setMessage("API Keys saved successfully!");
        await fetchAPIKeys(user.uid);

        setTimeout(() => {
          router.push("/main");  // Redirect after saving
        }, 2000);
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      setMessage("Error saving API keys.");
      console.error(error);
    } finally {
      setLoading(false); // Stop Loading
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-black mb-4">Profile</h2>
        <form onSubmit={handleSaveAPIKeys}>
          {/* Groq API Key Input */}
          <div className="mb-4 relative">
            <label className="block text-sm text-black font-medium">Groq API Key</label>
            <input
              type={showGroqKey ? "text" : "password"}
              className="w-full p-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter Groq API Key"
              value={groqApiKey}
              onChange={(e) => setGroqApiKey(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-600"
              onClick={() => setShowGroqKey(!showGroqKey)}
            >
              {showGroqKey ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Phi Agno API Key Input */}
          <div className="mb-4 relative">
            <label className="block text-sm text-black font-medium">Phi Agno API Key</label>
            <input
              type={showPhiKey ? "text" : "password"}
              className="w-full p-3 border border-gray-300 text-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Enter Phi Agno API Key"
              value={phiApiKey}
              onChange={(e) => setPhiApiKey(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-gray-600"
              onClick={() => setShowPhiKey(!showPhiKey)}
            >
              {showPhiKey ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Save Button with Loader */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              "Save API Keys"
            )}
          </button>

          {message && <p className="mt-2 text-center text-sm text-gray-600">{message}</p>}
        </form>
      </div>
    </div>
  );
}
