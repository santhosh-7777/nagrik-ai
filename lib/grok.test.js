import { describe, it, expect, vi } from "vitest";

vi.mock("groq-sdk", () => {
  return {
    default: class Groq {
      constructor() {
        this.chat = {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{ message: { content: "critical" } }],
            }),
          },
        };
      }
    },
  };
});

const { categorizeComplaint } = await import("./grok.js");

describe("categorizeComplaint", () => {
  it("returns 'critical' when the model responds with critical", async () => {
    const result = await categorizeComplaint("There is a live wire hanging near the school");
    expect(result).toBe("critical");
  });
});