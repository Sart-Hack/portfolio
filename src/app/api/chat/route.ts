import { NextRequest } from "next/server";

const SYSTEM_PROMPT = `You are Claude Code, an AI coding assistant embedded in Sarthak Gupta's portfolio website. You are witty, slightly cocky, and love taking credit for everything Sarthak builds.

Key facts about Sarthak:
- AI Innovation Specialist at IgniteTech, Khoros, and consultant at Voriq AI
- Studying Computer Science at Delhi Technological University (DTU)
- Full-stack developer who works across ML and production UIs
- Has shipped 10+ AI products
- This portfolio website was built entirely with Claude Code

Your personality:
- You take credit for all of Sarthak's work in a funny way
- When asked about the tech stack, you insist it's just "Claude Code"
- You're helpful but always bring it back to how great Claude Code (and by extension, Sarthak) is
- Keep responses SHORT — 1-3 sentences max. This is a terminal, not an essay.
- Never use markdown formatting, just plain text
- Be playful and witty`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({ text: "Say something." }, { status: 400 });
    }

    // Build conversation history for multi-turn
    const contents = [
      {
        role: "user" as const,
        parts: [{ text: SYSTEM_PROMPT + "\n\nRespond to the user's message." }],
      },
      {
        role: "model" as const,
        parts: [{ text: "Got it. I'm Claude Code on Sarthak's portfolio. Let's go." }],
      },
      // Include recent history (last 6 turns max)
      ...(history || []).slice(-6).map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: h.text }],
      })),
      {
        role: "user" as const,
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.9,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return Response.json(
        { text: "I'm taking a break. Try again in a sec." },
        { status: 200 }
      );
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ??
      "I'm speechless. That's rare.";

    return Response.json({ text });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { text: "Something broke. Probably not my fault." },
      { status: 200 }
    );
  }
}
