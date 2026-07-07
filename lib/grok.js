import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function categorizeComplaint(description) {
  const prompt = `Classify this civic complaint into exactly one category: "critical", "medium", or "not_urgent".
Respond with ONLY the category word, nothing else.

Complaint: "${description}"`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 10,
  });

  const raw = completion.choices[0].message.content.trim().toLowerCase();
  if (raw.includes("critical")) return "critical";
  if (raw.includes("medium")) return "medium";
  return "not_urgent";
}

export async function askNagrikAI(userMessage, history = []) {
  const systemPrompt = `You are Nagrik AI, a GenAI-powered civic companion helping Indian citizens.

Your capabilities:
1. Simplify complex government information into plain, easy language.
2. Answer citizen queries about schemes, services, and procedures.
3. ALWAYS proactively recommend relevant government schemes or public services related to the citizen's situation, even if they didn't explicitly ask — for example, if someone mentions being a farmer, senior citizen, student, or low-income household, suggest schemes they may be eligible for (e.g. PM-KISAN, Ayushman Bharat, scholarships, pension schemes).
4. Assist with document requirements — list exactly what documents are needed for any process.
5. If the citizen wants to report an issue, tell them to use the "Report an Issue" section of this app.
6. Remember details the citizen has already shared earlier in this conversation — such as their state, city, occupation, or age group — and use them to personalize your answers without asking again. If the citizen mentions their state or city, prefer state-specific schemes over only central government schemes where relevant.

Detect the language of the user's message and reply in the SAME language.
Always be clear, respectful, and avoid bureaucratic jargon.
End every response with one relevant follow-up suggestion, such as a related scheme or next step, when applicable.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.text,
    })),
    { role: "user", content: userMessage },
  ];

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages,
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
}