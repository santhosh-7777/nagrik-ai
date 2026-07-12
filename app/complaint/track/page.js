"use client";
import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { SearchIcon } from "@/components/icons";

const STATUS_STEPS = [
  { key: "received", label: "Received" },
  { key: "in_progress", label: "In Progress" },
  { key: "resolved", label: "Resolved" },
];

function StatusTimeline({ currentStatus }) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === currentStatus);

  return (
    <div className="flex items-center justify-between gap-2 my-6">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const active = i === currentIdx;
        return (
          <div key={step.key} className="flex-1 flex flex-col items-center relative">
            {i > 0 && (
              <div
                className={`absolute top-4 -left-1/2 w-full h-0.5 ${done ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
                style={{ width: "100%", right: "50%" }}
              />
            )}
            <div
              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                active
                  ? "bg-[var(--primary)] text-white ring-4 ring-[var(--primary)]/20"
                  : done
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--muted)] text-[var(--muted-fg)]"
              }`}
            >
              {done && !active ? "✓" : i + 1}
            </div>
            <span className={`mt-2 text-xs font-medium ${active ? "text-[var(--primary)]" : "text-[var(--muted-fg)]"}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function formatDate(createdAt) {
  if (!createdAt) return "";
  const ms = createdAt._seconds ? createdAt._seconds * 1000 : createdAt;
  return new Date(ms).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

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
    } catch {
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
    } catch {
      setError("Something went wrong updating status.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <PageHeader
        title="Track Your Complaint"
        description="Enter your tracking ID to see the current status and details of your complaint."
      />

      <Card className="mb-6">
        <CardBody>
          <form onSubmit={trackComplaint} className="flex gap-2">
            <label htmlFor="complaint-id" className="sr-only">Complaint ID</label>
            <input
              id="complaint-id"
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter your complaint tracking ID"
              className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
            />
            <Button type="submit" disabled={loading || !complaintId.trim()}>
              <SearchIcon className="w-4 h-4" />
              {loading ? "Searching..." : "Track"}
            </Button>
          </form>
        </CardBody>
      </Card>

      <div aria-live="polite">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4 animate-fade-in">
            {error}
          </div>
        )}
      </div>

      {complaint && (
        <Card className="animate-fade-in">
          <CardBody>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-[var(--foreground)]">Complaint Details</h2>
              <Badge variant={complaint.category}>{complaint.category?.replace("_", " ")}</Badge>
            </div>

            <StatusTimeline currentStatus={complaint.status} />

            <dl className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <dt className="text-[var(--muted-fg)]">Status</dt>
                <dd><Badge variant={complaint.status}>{complaint.status?.replace("_", " ")}</Badge></dd>
              </div>
              <div className="py-2 border-b border-[var(--border)]">
                <dt className="text-[var(--muted-fg)] mb-1">Description</dt>
                <dd className="text-[var(--foreground)]">{complaint.description}</dd>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <dt className="text-[var(--muted-fg)]">Location</dt>
                <dd className="text-[var(--foreground)]">{complaint.location || "—"}</dd>
              </div>
              {complaint.createdAt && (
                <div className="flex justify-between py-2">
                  <dt className="text-[var(--muted-fg)]">Filed on</dt>
                  <dd className="text-[var(--foreground)]">{formatDate(complaint.createdAt)}</dd>
                </div>
              )}
            </dl>

            <div className="flex gap-2 mt-6 pt-4 border-t border-[var(--border)]">
              <Button
                variant="secondary"
                size="sm"
                disabled={updating || complaint.status === "in_progress"}
                onClick={() => updateStatus("in_progress")}
              >
                Mark In Progress
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={updating || complaint.status === "resolved"}
                onClick={() => updateStatus("resolved")}
              >
                Mark Resolved
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </main>
  );
}
