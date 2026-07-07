"use client";
import { useState } from "react";

export default function ComplaintPage() {
  const [form, setForm] = useState({ name: "", description: "", location: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
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
      <h1 className="text-2xl font-bold mb-4">Report an Issue</h1>

      {result ? (
        <div className="border rounded-lg p-6 bg-green-50">
          {result.id ? (
            <>
              <p className="font-semibold mb-2">Complaint submitted successfully!</p>
              <p>Tracking ID: <span className="font-mono">{result.id}</span></p>
              <p>Category: <span className="capitalize">{result.category}</span></p>
              <p className="text-sm text-gray-600 mt-2">Save this ID to track your complaint status.</p>
            </>
          ) : (
            <p className="text-red-600">{result.error}</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 font-medium">Your Name (optional)</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="location" className="block mb-1 font-medium">Location</label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. MG Road, Sector 5"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block mb-1 font-medium">Describe the issue *</label>
            <textarea
              id="description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              placeholder="e.g. Streetlight has been broken for 2 weeks on MG Road"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-5 py-2 rounded-lg">
            {loading ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      )}
    </main>
  );
}