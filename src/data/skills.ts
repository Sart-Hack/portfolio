export interface Skill {
  name: string;
  category: "languages" | "ai" | "frontend" | "backend" | "devops" | "tools";
}

export const skills: Skill[] = [
  // Languages
  { name: "Python", category: "languages" },
  { name: "TypeScript", category: "languages" },
  { name: "JavaScript", category: "languages" },
  { name: "SQL", category: "languages" },
  { name: "HTML/CSS", category: "languages" },
  { name: "Bash", category: "languages" },
  { name: "Go", category: "languages" },

  // AI & ML
  { name: "LLMs", category: "ai" },
  { name: "OpenAI API", category: "ai" },
  { name: "Claude API", category: "ai" },
  { name: "LangChain", category: "ai" },
  { name: "LangGraph", category: "ai" },
  { name: "CrewAI", category: "ai" },
  { name: "AI Agents", category: "ai" },
  { name: "RAG", category: "ai" },
  { name: "Fine-tuning", category: "ai" },
  { name: "Prompt Engineering", category: "ai" },
  { name: "Hugging Face", category: "ai" },
  { name: "Vector DBs", category: "ai" },
  { name: "Embeddings", category: "ai" },
  { name: "Pinecone", category: "ai" },
  { name: "ChromaDB", category: "ai" },
  { name: "Semantic Search", category: "ai" },
  { name: "Text Classification", category: "ai" },
  { name: "Stable Diffusion", category: "ai" },
  { name: "Whisper", category: "ai" },
  { name: "TensorFlow", category: "ai" },
  { name: "PyTorch", category: "ai" },

  // Frontend
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Three.js", category: "frontend" },
  { name: "GSAP", category: "frontend" },
  { name: "Framer Motion", category: "frontend" },
  { name: "Zustand", category: "frontend" },
  { name: "Redux", category: "frontend" },
  { name: "Shadcn/ui", category: "frontend" },
  { name: "Figma", category: "frontend" },

  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Express", category: "backend" },
  { name: "FastAPI", category: "backend" },
  { name: "Flask", category: "backend" },
  { name: "PostgreSQL", category: "backend" },
  { name: "MongoDB", category: "backend" },
  { name: "Redis", category: "backend" },
  { name: "Prisma", category: "backend" },
  { name: "REST APIs", category: "backend" },
  { name: "GraphQL", category: "backend" },
  { name: "WebSockets", category: "backend" },
  { name: "Supabase", category: "backend" },
  { name: "Firebase", category: "backend" },

  // DevOps & Infra
  { name: "Docker", category: "devops" },
  { name: "AWS", category: "devops" },
  { name: "GCP", category: "devops" },
  { name: "Vercel", category: "devops" },
  { name: "CI/CD", category: "devops" },
  { name: "GitHub Actions", category: "devops" },
  { name: "Nginx", category: "devops" },
  { name: "Linux", category: "devops" },

  // Tools & Workflow
  { name: "Git", category: "tools" },
  { name: "VS Code", category: "tools" },
  { name: "Postman", category: "tools" },
  { name: "Jira", category: "tools" },
  { name: "Notion", category: "tools" },
  { name: "Slack", category: "tools" },
  { name: "Cursor", category: "tools" },
  { name: "Claude Code", category: "tools" },
];

export const categoryLabels: Record<Skill["category"], string> = {
  languages: "Languages",
  ai: "AI & Machine Learning",
  frontend: "Frontend",
  backend: "Backend & Databases",
  devops: "DevOps & Cloud",
  tools: "Tools & Workflow",
};
