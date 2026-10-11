import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export function getModel(modelName = "gemini-2.0-flash") {
  return genAI.getGenerativeModel({ model: modelName });
}

function cleanJSON(text) {
  const clean = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(clean);
}

export async function generate(prompt) {
  const model = getModel();
  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateJSON(prompt) {
  const model = getModel();
  const result = await model.generateContent(
    prompt +
      "\n\nRespond ONLY with valid JSON. No markdown code blocks, no extra text.",
  );
  return cleanJSON(result.response.text());
}

export async function generateWithFile(prompt, fileBase64, mimeType) {
  const model = getModel();
  const result = await model.generateContent([
    { inlineData: { data: fileBase64, mimeType } },
    prompt,
  ]);
  return result.response.text();
}

export async function generateJSONWithFile(prompt, fileBase64, mimeType) {
  const model = getModel();
  const result = await model.generateContent([
    { inlineData: { data: fileBase64, mimeType } },
    prompt +
      "\n\nRespond ONLY with valid JSON. No markdown code blocks, no extra text.",
  ]);
  return cleanJSON(result.response.text());
}
