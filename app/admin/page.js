"use client";
import { useState, useEffect, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const FILTERS = ["all", "critical", "medium", "not_urgent", "received", "in_progress", "resolved"];

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-[var(--border)] px-4 py-3">
      <p className="text-xs font-medium text-[var(--muted-fg)] uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

export default function AdminPage() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState("all");

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
    } catch {
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
    } catch {
      setError("Something went wrong updating status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const stats = useMemo(() => ({
    total: complaints.length,
    critical: complaints.filter((c) => c.category === "critical").length,
    pending: complaints.filter((c) => c.status === "received").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  }), [complaints]);

  const filtered = useMemo(() => {
    if (filter === "all") return complaints;
    return complaints.filter(
      (c) => c.category === filter || c.status === filter
    );
  }, [complaints, filter]);

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <PageHeader
        title="Admin Dashboard"
        description="View and manage all citizen complaints. Update statuses and monitor urgency levels."
        backHref="/"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total" value={stats.total} color="text-[var(--foreground)]" />
        <StatCard label="Critical" value={stats.critical} color="text-red-600" />
        <StatCard label="Pending" value={stats.pending} color="text-amber-600" />
        <StatCard label="Resolved" value={stats.resolved} color="text-emerald-600" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors capitalize ${
              filter === f
                ? "bg-[var(--primary)] text-white"
                : "bg-white border border-[var(--border)] text-[var(--muted-fg)] hover:bg-[var(--muted)]"
            }`}
          >
            {f === "all" ? "All" : f.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[var(--border)] p-6 animate-pulse">
              <div className="h-4 bg-[var(--muted)] rounded w-1/4 mb-3" />
              <div className="h-3 bg-[var(--muted)] rounded w-3/4 mb-2" />
              <div className="h-3 bg-[var(--muted)] rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      {!loading && filtered.length === 0 && !error && (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-[var(--muted-fg)]">
              {filter === "all" ? "No complaints filed yet." : `No ${filter.replace("_", " ")} complaints found.`}
            </p>
          </CardBody>
        </Card>
      )}

      <div className="space-y-4">
        {filtered.map((c) => (
          <Card key={c.id} className="animate-fade-in">
            <CardBody>
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={c.category}>{c.category?.replace("_", " ")}</Badge>
                  <Badge variant={c.status}>{c.status?.replace("_", " ")}</Badge>
                </div>
                <span className="text-xs text-[var(--muted-fg)]">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString("en-IN") : ""}
                </span>
              </div>

              <p className="text-sm text-[var(--foreground)] mb-3 leading-relaxed">{c.description}</p>

              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[var(--muted-fg)] mb-4">
                <span>📍 {c.location || "No location"}</span>
                <span>👤 {c.name || "Anonymous"}</span>
                <span className="font-mono">ID: {c.id}</span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={updatingId === c.id || c.status === "in_progress"}
                  onClick={() => updateStatus(c.id, "in_progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={updatingId === c.id || c.status === "resolved"}
                  onClick={() => updateStatus(c.id, "resolved")}
                >
                  Resolved
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </main>
  );
}
