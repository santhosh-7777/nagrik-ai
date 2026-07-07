"use client";
import { useState } from "react";

export default function TrackPage() {
  const [complaintId, setComplaintId] = useState("");
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  async function trackComplaint(e) {
    e.preventDefault();
    if (!complaintId.trim()) return;
    setLoading(true);
    setError("");
    setComplaint(null);

    try {
      const res = await fetch(`/api/complaint/${complaintId}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Complaint not found");
      } else {
        setComplaint(data);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/complaint/${complaintId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setComplaint(data);
      } else {
        setError(data.error || "Failed to update status");
      }
    } catch (err) {
      setError("Something went wrong updating status.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Track Your Complaint</h1>

      <form onSubmit={trackComplaint} className="flex gap-2 mb-6">
        <label htmlFor="complaint-id" className="sr-only">Complaint ID</label>
        <input
          id="complaint-id"
          type="text"
          value={complaintId}
          onChange={(e) => setComplaintId(e.target.value)}
          placeholder="Enter your complaint ID"
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2"
        >
          {loading ? "Tracking..." : "Track"}
        </button>
      </form>

      <div aria-live="polite">
        {error && <p className="text-red-600 mb-4">{error}</p>}
      </div>

      {complaint && (
        <div className="border rounded-lg p-6" aria-live="polite">
          <p><span className="font-medium">Status:</span> {complaint.status}</p>
          <p><span className="font-medium">Category:</span> {complaint.category}</p>
          <p><span className="font-medium">Description:</span> {complaint.description}</p>
          <p><span className="font-medium">Location:</span> {complaint.location}</p>
          {complaint.createdAt && (
            <p className="text-gray-600 text-sm mt-2">
              Filed: {new Date(complaint.createdAt._seconds ? complaint.createdAt._seconds * 1000 : complaint.createdAt).toLocaleString()}
            </p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              disabled={updating}
              onClick={() => updateStatus("in_progress")}
              className="text-sm border rounded-full px-3 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Mark In Progress
            </button>
            <button
              type="button"
              disabled={updating}
              onClick={() => updateStatus("resolved")}
              className="text-sm border rounded-full px-3 py-1 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Mark Resolved
            </button>
          </div>
        </div>
      )}
    </main>
  );
}