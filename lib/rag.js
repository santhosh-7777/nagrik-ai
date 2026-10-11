import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { loadSchemes, schemeToChunkText, schemeToSource } from "./knowledge.js";
import { embedText, cosineSimilarity } from "./embeddings.js";

const INDEX_PATH = join(process.cwd(), "data/knowledge/index.json");
const TOP_K = 3;
const MIN_SIMILARITY = 0.35;
const MIN_KEYWORD_SCORE = 3;
const RRF_K = 60;

const STOPWORDS = new Set([
  "the", "and", "for", "you", "can", "how", "what", "who", "are", "with",
  "from", "that", "this", "have", "need", "get", "does", "any", "my", "your",
  "is", "was", "its", "not", "all", "use", "one", "when", "where", "which",
  "there", "their", "they", "will", "about", "into", "than", "then",
]);

const SYNONYMS = {
  farmer: ["kisan", "agriculture", "crop", "fasal"],
  kisan: ["farmer", "agriculture"],
  pension: ["retirement", "senior", "elderly", "old"],
  senior: ["pension", "elderly", "old"],
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

// undefined = not loaded yet, null = index file missing
let cachedIndex;

function loadIndex() {
  if (cachedIndex !== undefined) return cachedIndex;
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
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function expandQueryTokens(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    if (SYNONYMS[token]) {
      SYNONYMS[token].forEach((v) => expanded.add(v));
    }
  }
  return [...expanded];
}

function keywordScore(query, scheme) {
  const tokens = expandQueryTokens(tokenize(query));
  if (tokens.length === 0) return 0;

  const titleWords = new Set(tokenize(scheme.title));
  const tagWords = new Set(scheme.tags.flatMap((tag) => tokenize(tag)));
  const documentWords = new Set(scheme.documents.flatMap((doc) => tokenize(doc)));
  const bodyWords = new Set(
    tokenize([scheme.category, scheme.content, scheme.eligibility, scheme.how_to_apply].join(" "))
  );

  let score = 0;
  for (const token of tokens) {
    if (titleWords.has(token)) score += 3;
    if (tagWords.has(token)) score += 2;
    if (documentWords.has(token)) score += 2;
    if (bodyWords.has(token)) score += 1;
  }
  return score;
}

function keywordRetrieve(query, topK = TOP_K) {
  return loadSchemes()
    .map((scheme) => ({ scheme, score: keywordScore(query, scheme) }))
    .filter((r) => r.score >= MIN_KEYWORD_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ scheme, score }) => ({
      id: scheme.id,
      title: scheme.title,
      text: schemeToChunkText(scheme),
      source: schemeToSource(scheme),
      score,
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

function reciprocalRankFusion(lists, topK = TOP_K) {
  const scores = new Map();

  for (const list of lists) {
    list.forEach((item, rank) => {
      const entry = scores.get(item.id) ?? { item, score: 0 };
      entry.score += 1 / (RRF_K + rank + 1);
      scores.set(item.id, entry);
    });
  }

  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((entry) => entry.item);
}

export async function retrieveRelevantDocs(query, topK = TOP_K) {
  if (!query?.trim()) {
    return { chunks: [], sources: [], method: "none" };
  }

  const [keywordResults, vectorResults] = await Promise.all([
    Promise.resolve(keywordRetrieve(query, topK)),
    vectorRetrieve(query, topK).catch((err) => {
      console.warn("Vector RAG unavailable:", err.message);
      return null;
    }),
  ]);

  const vector = vectorResults ?? [];
  const hasKeyword = keywordResults.length > 0;
  const hasVector = vector.length > 0;

  let chunks;
  let method;

  if (hasKeyword && hasVector) {
    chunks = reciprocalRankFusion([keywordResults, vector], topK);
    method = "hybrid";
  } else if (hasKeyword) {
    chunks = keywordResults;
    method = "keyword";
  } else if (hasVector) {
    chunks = vector.slice(0, topK);
    method = "vector";
  } else {
    chunks = [];
    method = "none";
  }

  return {
    chunks,
    sources: chunks.map((chunk) => chunk.source),
    method,
  };
}

export function buildRagContext(chunks) {
  if (!chunks.length) return "";
  return chunks
    .map((chunk, i) => `[Source ${i + 1}: ${chunk.title}]\n${chunk.text}`)
    .join("\n\n---\n\n");
}