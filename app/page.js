import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen p-8 max-w-3xl mx-auto">
      <div className="flex justify-end mb-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-700 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-100"
          aria-label="Staff and government admin dashboard"
        >
          🔒 Admin / Staff Login
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Nagrik AI</h1>
      <p className="text-gray-600 mb-8">
        Your AI-powered civic companion — access government services, report issues, and get personalized assistance, in your own language.
      </p>

      <nav aria-label="Main services" className="grid gap-4">
        <Link
          href="/chat"
          className="block p-5 border rounded-lg hover:bg-gray-50"
          aria-label="Ask Nagrik AI about government services and documents"
        >
          <h2 className="text-xl font-semibold">💬 Ask Nagrik AI</h2>
          <p className="text-gray-600">Get answers on government services, schemes, and required documents — in your language.</p>
        </Link>

        <Link
          href="/complaint"
          className="block p-5 border rounded-lg hover:bg-gray-50"
          aria-label="Report a public issue or complaint"
        >
          <h2 className="text-xl font-semibold">📢 Report an Issue</h2>
          <p className="text-gray-600">Submit a civic complaint. It's automatically categorized by urgency and given a tracking ID.</p>
        </Link>

        <Link
          href="/complaint/track"
          className="block p-5 border rounded-lg hover:bg-gray-50"
          aria-label="Track your complaint status"
        >
          <h2 className="text-xl font-semibold">🔍 Track Complaint</h2>
          <p className="text-gray-600">Enter your tracking ID to check the status of a complaint you filed.</p>
        </Link>
      </nav>
    </main>
  );
}