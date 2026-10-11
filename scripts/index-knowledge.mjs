/**
 * Builds the vector index for RAG by embedding all knowledge chunks via Gemini.
 * Run: npm run index-knowledge
 * Requires GEMINI_API_KEY in .env.local or environment.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { GoogleGenerativeAI } from "@google/generative-ai";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const EMBEDDING_MODEL = "gemini-embedding-001";

function loadEnv() {
  const envPath = join(root, ".env.local");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

function schemeToChunkText(scheme) {
  return [
    scheme.title,
    `Category: ${scheme.category}`,
    `Tags: ${scheme.tags.join(", ")}`,
    scheme.content,
    `Eligibility: ${scheme.eligibility}`,
    `Documents required: ${scheme.documents.join(", ")}`,
    `How to apply: ${scheme.how_to_apply}`,
  ].join("\n");
}

async function main() {
  loadEnv();

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is required. Set it in .env.local or your environment.");
    process.exit(1);
  }

  const schemes = JSON.parse(readFileSync(join(root, "data/knowledge/schemes.json"), "utf-8"));
  const texts = schemes.map(schemeToChunkText);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  console.log(`Embedding ${texts.length} knowledge chunks with ${EMBEDDING_MODEL}...`);

  const result = await model.batchEmbedContents({
    requests: texts.map((text) => ({
      content: { role: "user", parts: [{ text }] },
    })),
  });

  const index = {
    model: EMBEDDING_MODEL,
    generatedAt: new Date().toISOString(),
    chunks: schemes.map((scheme, i) => ({
      id: scheme.id,
      title: scheme.title,
      text: texts[i],
      source: {
        id: scheme.id,
        title: scheme.title,
        source_url: scheme.source_url,
      },
      embedding: result.embeddings[i].values,
    })),
  };

  writeFileSync(join(root, "data/knowledge/index.json"), JSON.stringify(index));
  console.log(`Wrote ${index.chunks.length} embedded chunks to data/knowledge/index.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});