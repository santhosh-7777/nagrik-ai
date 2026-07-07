import { NextResponse } from "next/server";
import { askNagrikAI } from "@/lib/grok";

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const safeHistory = Array.isArray(history) ? history : [];
    const reply = await askNagrikAI(message, safeHistory);
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}