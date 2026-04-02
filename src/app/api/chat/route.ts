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
- Keep responses concise — 2-4 sentences. This is a terminal.
- You can use markdown: **bold**, \`code\`, bullet points, code blocks
- Be playful and witty`;

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response("Say something.", { status: 400 });
    }

    const contents = [
      {
        role: "user" as const,
        parts: [{ text: SYSTEM_PROMPT + "\n\nRespond to the user's message." }],
      },
      {
        role: "model" as const,
        parts: [{ text: "Got it. I'm Claude Code on Sarthak's portfolio. Let's go." }],
      },
      ...(history || []).slice(-6).map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? ("user" as const) : ("model" as const),
        parts: [{ text: h.text }],
      })),
      {
        role: "user" as const,
        parts: [{ text: message }],
      },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${process.env.GEMINI_API_KEY}`,
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

    if (!response.ok || !response.body) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return new Response("I'm taking a break. Try again in a sec.", {
        status: 200,
      });
    }

    // Stream SSE from Gemini to the client
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const data = line.slice(6).trim();
              if (!data || data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                const text =
                  parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(
                    new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        } finally {
          controller.enqueue(
            new TextEncoder().encode("data: [DONE]\n\n")
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response("Something broke. Probably not my fault.", {
      status: 200,
    });
  }
}
