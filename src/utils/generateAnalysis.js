import OpenAI from "openai";

const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL, // usa OpenRouter en vez de OpenAI
  dangerouslyAllowBrowser: true,
});

export async function generateAnalysis(datos) {
  if (!datos) return "No hay datos disponibles para analizar.";

  const resumen = JSON.stringify(datos, null, 2);
  const prompt = `
  Eres un analista de control de procesos.
  Analiza los siguientes resultados:
  ${resumen}
  Da un resumen breve y profesional en español.
  `;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error al generar el análisis con IA:", error);
    return "Error al generar el análisis (revisa tu conexión o API key).";
  }
}
