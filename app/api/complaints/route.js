import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const snapshot = await db.collection("complaints").orderBy("createdAt", "desc").get();
    const complaints = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ complaints });
  } catch (err) {
    console.error("Admin fetch error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}