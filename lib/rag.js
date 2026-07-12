import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { loadSchemes, schemeToChunkText, schemeToSource } from "./knowledge.js";
import { embedText, cosineSimilarity } from "./embeddings.js";

const INDEX_PATH = join(process.cwd(), "data/knowledge/index.json");
const TOP_K = 3;
const MIN_SIMILARITY = 0.35;

const SYNONYMS = {
  farmer: ["kisan", "agriculture", "crop", "fasal"],
  kisan: ["farmer", "agriculture"],
  pension: ["retirement", "senior", "elderly", "old age"],
  senior: ["pension", "elderly", "old age"],
  student: ["scholarship", "education", "school", "college"],
  scholarship: ["student", "education"],
  health: ["hospital", "medical", "insurance", "ayushman"],
  ration: ["food", "pds", "groceries", "bpl"],
  passport: ["travel", "visa"],
  aadhaar: ["uid", "identity", "biometric"],
  loan: ["credit", "svanidhi", "vendor"],
  gas: ["lpg", "cylinder", "ujjwala", "cooking"],
  house: ["housing", "home", "pmay", "construction"],
};

let cachedIndex = undefined;

function loadIndex() {
  if (cachedIndex !== null) return cachedIndex;
  if (!existsSync(INDEX_PATH)) {
    cachedIndex = null;
    return null;
  }
  cachedIndex = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  return cachedIndex;
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function expandQueryTokens(queryTokens) {
  const expanded = new Set(queryTokens);
  for (const token of queryTokens) {
    for (const [key, values] of Object.entries(SYNONYMS)) {
      if (token.includes(key) || key.includes(token)) {
        values.forEach((v) => expanded.add(v));
      }
    }
  }
  return [...expanded];
}

function keywordScore(query, scheme) {
  const queryTokens = expandQueryTokens(tokenize(query));
  if (queryTokens.length === 0) return 0;

  const searchable = [
    scheme.title,
    scheme.category,
    scheme.content,
    scheme.eligibility,
    scheme.how_to_apply,
    ...scheme.tags,
    ...scheme.documents,
  ]
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    if (searchable.includes(token)) score += 1;
    for (const tag of scheme.tags) {
      if (tag.includes(token) || token.includes(tag)) score += 2;
    }
    if (scheme.title.toLowerCase().includes(token)) score += 3;
    for (const doc of scheme.documents) {
      if (doc.toLowerCase().includes(token)) score += 2;
    }
  }
  return score;
}

function keywordRetrieve(query, topK = TOP_K) {
  const schemes = loadSchemes();
  const ranked = schemes
    .map((scheme) => ({ scheme, score: keywordScore(query, scheme) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return ranked.map(({ scheme }) => ({
    id: scheme.id,
    title: scheme.title,
    text: schemeToChunkText(scheme),
    source: schemeToSource(scheme),
    score: keywordScore(query, scheme),
  }));
}

async function vectorRetrieve(query, topK = TOP_K) {
  const index = loadIndex();
  if (!index?.chunks?.length) return null;

  const queryEmbedding = await embedText(query);
  const ranked = index.chunks
    .map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    .filter((c) => c.score >= MIN_SIMILARITY)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  if (ranked.length === 0) return null;

  return ranked.map(({ id, title, text, source, score }) => ({
    id,
    title,
    text,
    source,
    score,
  }));
}

export async function retrieveRelevantDocs(query, topK = TOP_K) {
  if (!query?.trim()) {
    return { chunks: [], sources: [], method: "none" };
  }

  const keywordResults = keywordRetrieve(query, topK);
  if (keywordResults.length >= topK) {
    return {
      chunks: keywordResults,
      sources: keywordResults.map((c) => c.source),
      method: "keyword",
    };
  }

  try {
    const vectorResults = await vectorRetrieve(query, topK);
    if (vectorResults?.length) {
      const merged = [...keywordResults];
      for (const result of vectorResults) {
        if (!merged.some((m) => m.id === result.id)) merged.push(result);
      }
      const chunks = merged.slice(0, topK);
      return {
        chunks,
        sources: chunks.map((c) => c.source),
        method: "hybrid",
      };
    }
  } catch (err) {
    console.warn("Vector RAG unavailable:", err.message);
  }

  return {
    chunks: keywordResults,
    sources: keywordResults.map((c) => c.source),
    method: keywordResults.length ? "keyword" : "none",
  };
}

export function buildRagContext(chunks) {
  if (!chunks.length) return "";
  return chunks
    .map((chunk, i) => `[Source ${i + 1}: ${chunk.title}]\n${chunk.text}`)
    .join("\n\n---\n\n");
}
