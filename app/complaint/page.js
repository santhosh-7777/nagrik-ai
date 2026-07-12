"use client";
import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Button from "@/components/ui/Button";
import Card, { CardBody } from "@/components/ui/Card";
import Input, { Textarea } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { CheckCircleIcon, CopyIcon, SearchIcon } from "@/components/icons";

export default function ComplaintPage() {
  const [form, setForm] = useState({ name: "", description: "", location: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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
    } catch {
      setResult({ error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  function copyId() {
    if (result?.id) {
      navigator.clipboard.writeText(result.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 sm:px-6 py-8">
      <PageHeader
        title="Report an Issue"
        description="Describe the civic problem in your area. AI will categorize urgency and assign a tracking ID."
      />

      {result ? (
        <Card className="animate-fade-in">
          <CardBody>
            {result.id ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[var(--success-light)] flex items-center justify-center text-[var(--success)] mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Complaint Submitted</h2>
                <p className="text-sm text-[var(--muted-fg)] mt-2">
                  Your complaint has been registered and categorized automatically.
                </p>

                <div className="mt-6 bg-[var(--muted)] rounded-xl p-4 text-left space-y-3">
                  <div>
                    <p className="text-xs font-medium text-[var(--muted-fg)] uppercase tracking-wider">Tracking ID</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-lg font-mono font-semibold text-[var(--foreground)]">{result.id}</code>
                      <button
                        type="button"
                        onClick={copyId}
                        className="p-1.5 rounded-lg hover:bg-white transition-colors text-[var(--muted-fg)]"
                        aria-label="Copy tracking ID"
                      >
                        <CopyIcon />
                      </button>
                      {copied && <span className="text-xs text-[var(--success)]">Copied!</span>}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[var(--muted-fg)] uppercase tracking-wider">Urgency</p>
                    <div className="mt-1">
                      <Badge variant={result.category}>{result.category?.replace("_", " ")}</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/complaint/track`}>
                    <Button variant="primary" className="w-full sm:w-auto">
                      <SearchIcon className="w-4 h-4" />
                      Track This Complaint
                    </Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => { setResult(null); setForm({ name: "", description: "", location: "" }); }}
                  >
                    File Another
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-red-600 font-medium">{result.error}</p>
                <Button variant="secondary" className="mt-4" onClick={() => setResult(null)}>
                  Try Again
                </Button>
              </div>
            )}
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Your Name (optional)"
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
              />

              <Input
                label="Location"
                id="location"
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. MG Road, Sector 5, Hyderabad"
              />

              <Textarea
                label="Describe the issue *"
                id="description"
                required
                rows={5}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Streetlight has been broken for 2 weeks on MG Road near the bus stop"
              />

              <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
                {loading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </form>
          </CardBody>
        </Card>
      )}
    </main>
  );
}
