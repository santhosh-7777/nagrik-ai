"use client";
import { useState, useEffect } from "react";

export default function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  async function fetchComplaints() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/complaints");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load complaints");
      } else {
        setComplaints(data.complaints);
      }
    } catch (err) {
      setError("Something went wrong loading complaints.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchComplaints();
  }, []);

  async function updateStatus(id, newStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/complaint/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: data.status } : c))
        );
      } else {
        setError(data.error || "Failed to update status");
      }
    } catch (err) {
      setError("Something went wrong updating status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const categoryColor = {
    critical: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    not_urgent: "bg-green-100 text-green-700",
  };

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-500 mb-6">
        View and manage all citizen complaints in one place.
      </p>

      {loading && <p className="text-gray-500">Loading complaints...</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!loading && complaints.length === 0 && !error && (
        <p className="text-gray-500">No complaints filed yet.</p>
      )}

      <div className="space-y-4">
        {complaints.map((c) => (
          <div key={c.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  categoryColor[c.category] || "bg-gray-100 text-gray-700"
                }`}
              >
                {c.category}
              </span>
              <span className="text-xs text-gray-400">
                {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
              </span>
            </div>

            <p className="mb-1">
              <span className="font-medium">Description:</span> {c.description}
            </p>
            <p className="mb-1">
              <span className="font-medium">Location:</span> {c.location}
            </p>
            <p className="mb-1">
              <span className="font-medium">Filed by:</span> {c.name}
            </p>
            <p className="mb-3">
              <span className="font-medium">Status:</span> {c.status}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={updatingId === c.id}
                onClick={() => updateStatus(c.id, "in_progress")}
                className="text-sm border rounded-full px-3 py-1 hover:bg-gray-100"
              >
                Mark In Progress
              </button>
              <button
                type="button"
                disabled={updatingId === c.id}
                onClick={() => updateStatus(c.id, "resolved")}
                className="text-sm border rounded-full px-3 py-1 hover:bg-gray-100"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}