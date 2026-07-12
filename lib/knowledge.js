import { readFileSync } from "fs";
import { join } from "path";

const SCHEMES_PATH = join(process.cwd(), "data/knowledge/schemes.json");

let cachedSchemes = null;

export function loadSchemes() {
  if (!cachedSchemes) {
    cachedSchemes = JSON.parse(readFileSync(SCHEMES_PATH, "utf-8"));
  }
  return cachedSchemes;
}

export function schemeToChunkText(scheme) {
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

export function schemeToSource(scheme) {
  return {
    id: scheme.id,
    title: scheme.title,
    source_url: scheme.source_url,
  };
}
