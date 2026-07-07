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

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const allowedStatuses = ["received", "in_progress", "resolved"];
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const docRef = db.collection("complaints").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    await docRef.update({ status });
    const updated = await docRef.get();

    return NextResponse.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    console.error("Status update API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}