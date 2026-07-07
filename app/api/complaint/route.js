import { NextResponse } from "next/server";
import { categorizeComplaint } from "@/lib/grok";
import { db } from "@/lib/firebase";

export async function POST(req) {
  try {
    const { name, description, location } = await req.json();
    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    const category = await categorizeComplaint(description);

    const docRef = await db.collection("complaints").add({
      name: name || "Anonymous",
      description,
      location: location || "Not specified",
      category,
      status: "received",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, category });
  } catch (err) {
    console.error("Complaint API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}