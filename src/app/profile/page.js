"use client";
import { useState, useEffect, useCallback } from "react";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Profile() {
  const [groqApiKey, setGroqApiKey] = useState("");
  const [phiApiKey, setPhiApiKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch API Keys from Backend
  const fetchAPIKeys = useCallback(async (userId) => {
    if (!userId) return;

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile?user_id=${userId}`);
      
      if (response.status === 200) {
        const { groq_api_key, phi_agno_api_key } = response.data;
        setGroqApiKey(groq_api_key || "");
        setPhiApiKey(phi_agno_api_key || "");

        // ✅ If keys are present, redirect to `/main`
        if (groq_api_key && phi_agno_api_key) {
          router.push("/main");
        }
      }
    } catch (error) {
      console.error("Failed to fetch API keys", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Check if user is logged in
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

  // Save API Keys
  const handleSaveAPIKeys = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!user || !groqApiKey || !phiApiKey) {
      alert("Please enter API keys and log in.");
      setSaving(false);
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/save-api-keys`, {
        user_id: user.uid,
        groq_api_key: groqApiKey,
        phi_agno_api_key: phiApiKey,
      });

      setMessage("API Keys saved successfully!");
      await fetchAPIKeys(user.uid);
      setTimeout(() => router.push("/main"), 2000);
    } catch (error) {
      setMessage("Error saving API keys.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Fetching API keys...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-black mb-4">Profile</h2>
        <form onSubmit={handleSaveAPIKeys}>
          <label className="block text-sm font-medium">Groq API Key</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter Groq API Key"
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
          />

          <label className="block text-sm font-medium mt-4">Phi Agno API Key</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            placeholder="Enter Phi Agno API Key"
            value={phiApiKey}
            onChange={(e) => setPhiApiKey(e.target.value)}
          />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 mt-4 rounded-lg">
            {saving ? "Saving..." : "Save API Keys"}
          </button>
        </form>

        {message && <p className="text-center text-sm mt-4">{message}</p>}
      </div>
    </div>
  );
}
