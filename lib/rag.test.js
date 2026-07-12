import { describe, it, expect } from "vitest";
import { buildRagContext, retrieveRelevantDocs } from "./rag.js";
import { loadSchemes, schemeToChunkText } from "./knowledge.js";

describe("knowledge base", () => {
  it("loads schemes from JSON", () => {
    const schemes = loadSchemes();
    expect(schemes.length).toBeGreaterThan(10);
    expect(schemes[0]).toHaveProperty("title");
    expect(schemes[0]).toHaveProperty("source_url");
  });

  it("builds chunk text with eligibility and documents", () => {
    const scheme = loadSchemes().find((s) => s.id === "pm-kisan");
    const text = schemeToChunkText(scheme);
    expect(text).toContain("PM-KISAN");
    expect(text).toContain("Eligibility");
    expect(text).toContain("Aadhaar");
  });
});

describe("buildRagContext", () => {
  it("formats retrieved chunks for the LLM prompt", () => {
    const context = buildRagContext([
      { title: "PM-KISAN", text: "Income support for farmers." },
    ]);
    expect(context).toContain("[Source 1: PM-KISAN]");
    expect(context).toContain("Income support for farmers");
  });

  it("returns empty string when no chunks", () => {
    expect(buildRagContext([])).toBe("");
  });
});

describe("retrieveRelevantDocs", () => {
  it("finds farmer-related schemes via keyword search", async () => {
    const { chunks, sources, method } = await retrieveRelevantDocs("What schemes for farmers?");
    expect(chunks.length).toBeGreaterThan(0);
    expect(sources[0].source_url).toMatch(/^https?:\/\//);
    expect(method).toBe("keyword");
    expect(chunks.some((c) => c.id === "pm-kisan")).toBe(true);
  });

  it("finds ration card info for document queries", async () => {
    const { chunks } = await retrieveRelevantDocs("documents needed for ration card");
    expect(chunks.some((c) => c.id === "ration-card")).toBe(true);
  });
});
