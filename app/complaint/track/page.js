"use client";
import { useState } from "react";

export default function TrackPage() {
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleTrack(e) {
    e.preventDefault();
    if (!id.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/complaint/${id.trim()}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Track Your Complaint</h1>

      <form onSubmit={handleTrack} className="flex gap-2 mb-6">
        <label htmlFor="track-id" className="sr-only">Tracking ID</label>
        <input
          id="track-id"
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Enter your tracking ID"
          className="flex-1 border rounded-lg px-4 py-2"
        />
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-lg">
          {loading ? "Checking..." : "Track"}
        </button>
      </form>

      {result && (
        <div className="border rounded-lg p-6">
          {result.error ? (
            <p className="text-red-600">{result.error}</p>
          ) : (
            <>
              <p><span className="font-medium">Status:</span> <span className="capitalize">{result.status}</span></p>
              <p><span className="font-medium">Category:</span> <span className="capitalize">{result.category}</span></p>
              <p><span className="font-medium">Description:</span> {result.description}</p>
              <p><span className="font-medium">Location:</span> {result.location}</p>
              <p className="text-sm text-gray-500 mt-2">Filed: {new Date(result.createdAt).toLocaleString()}</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}