import { NextResponse } from "next/server";
import { askNagrikAI } from "@/lib/grok";
import { retrieveRelevantDocs, buildRagContext } from "@/lib/rag";

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const safeHistory = Array.isArray(history) ? history : [];
    const { chunks, sources, method } = await retrieveRelevantDocs(message);
    const ragContext = buildRagContext(chunks);
    const { reply } = await askNagrikAI(message, safeHistory, { ragContext, sources });

    return NextResponse.json({ reply, sources, ragMethod: method });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}