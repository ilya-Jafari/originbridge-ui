import { NextResponse } from 'next/server';
import OpenAI from 'openai';
// Wichtig: Der Pfad @/data/... funktioniert nur, wenn du den Ordner "data" in "src" erstellt hast
import suppliers from '@/data/supplier_test.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { userQuery } = await req.json();

    // Der Prompt sagt der KI genau, wie sie mit deinen Daten umgehen soll
    const prompt = `
      Du bist der OriginBridge Sourcing-Assistent. 
      Hier ist unsere aktuelle Supplier-Datenbank im JSON-Format:
      ${JSON.stringify(suppliers)}

      Anfrage des Nutzers: "${userQuery}"

      Deine Aufgabe:
      1. Suche die passendsten Supplier aus der Liste heraus, die zur Anfrage passen.
      2. Achte auf technische Details wie Brix-Werte, Reinheit, ISO-Zertifikate, Standorte und Incoterms.
      3. Antworte kurz und professionell. Nenne die IDs der empfohlenen Supplier (z.B. OB-AGRO-001) und begründe kurz, warum diese perfekt für den Nutzer sind.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Du kannst auch "gpt-4o-mini" nutzen, um Kosten zu sparen
      messages: [{ role: "user", content: prompt }],
    });

    return NextResponse.json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Fehler bei der KI-Analyse" }, { status: 500 });
  }
}