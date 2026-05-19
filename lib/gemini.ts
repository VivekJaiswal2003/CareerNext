import { GoogleGenerativeAI } from "@google/generative-ai";

const modelName = "gemini-2.0-flash";
const requestTimeoutMs = 12000;
const maxGeminiAttempts = 2;

function getModel() {
  const key = process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) throw new Error("Missing GOOGLE_GEMINI_API_KEY");
  const genAI = new GoogleGenerativeAI(key);
  return genAI.getGenerativeModel({ model: modelName });
}

function looksLikeJson(text: string) {
  return typeof text === "string" && /[\{\[]/.test(text.trim());
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Gemini timeout")), ms))
  ]);
}

export async function generateGeminiJson<T>(prompt: string, fallback: T): Promise<T> {
  if (!process.env.GOOGLE_GEMINI_API_KEY) {
    console.warn("Gemini fallback used: missing GOOGLE_GEMINI_API_KEY");
    return fallback;
  }

  const instructions = [
    "You are an intelligent assistant that responds with valid JSON only.",
    "Return a JSON object matching the expected structure exactly.",
    "Do not wrap the response in markdown or any extraneous text."
  ].join(" ");

  const payload = `${instructions}\n\n${prompt}`;

  const parseJson = (text: string): T | null => {
    try {
      return JSON.parse(text) as T;
    } catch {
      return null;
    }
  };

  for (let attempt = 1; attempt <= maxGeminiAttempts; attempt += 1) {
    let jsonText = "";
    try {
      const model = getModel();
      const result = await withTimeout(model.generateContent([payload]), requestTimeoutMs);
      jsonText = String((result as any)?.response?.text || "").trim();
    } catch {
      if (attempt === maxGeminiAttempts) {
        console.warn("Gemini fallback used");
        return fallback;
      }
      continue;
    }

    if (!looksLikeJson(jsonText)) {
      if (attempt === maxGeminiAttempts) {
        console.warn("Gemini fallback used");
        return fallback;
      }
      continue;
    }

    const direct = parseJson(jsonText);
    if (direct) return direct;

    const match = jsonText.match(/[\{\[][\s\S]*[\}\]]/);
    if (match) {
      const extracted = parseJson(match[0]);
      if (extracted) return extracted;
    }

    if (attempt === maxGeminiAttempts) {
      console.warn("Gemini fallback used");
      return fallback;
    }
  }

  console.warn("Gemini fallback used");
  return fallback;
}
