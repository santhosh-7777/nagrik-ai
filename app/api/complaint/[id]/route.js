import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const doc = await db.collection("complaints").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }
    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("Track API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}