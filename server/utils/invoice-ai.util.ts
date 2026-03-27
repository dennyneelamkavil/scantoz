import "server-only";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* ================= PROCESS INVOICE IMAGE ================= */
export async function processInvoiceWithAI(imageUrl: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `
Extract invoice details from this image.

Return strictly in JSON format:
{
  "invoiceNumber": string | null,
  "invoiceDate": string (yyyy-mm-dd) | null,
  "vendorName": string | null,
  "trnNumber": string | null,
  "grossAmount": number | null,
  "taxAmount": number | null,
  "totalAmount": number | null,
  "currency": string | null
}

Rules:
- Convert numbers properly
- Date must be yyyy-mm-dd
- Return null if not found
              `,
            },
            {
              type: "image_url",
              image_url: { url: imageUrl },
            },
          ],
        },
      ],
    });

    const content = response.choices[0]?.message?.content || "";

    const cleaned = content.replace(/(^```json\s*|\s*```$)/g, "");

    let parsed: any = {};

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      throw new Error("AI response parsing failed");
    }

    return {
      data: {
        invoiceNumber: parsed.invoiceNumber || null,
        invoiceDate: parsed.invoiceDate || null,
        vendorName: parsed.vendorName || null,
        trnNumber: parsed.trnNumber || null,

        grossAmount: parsed.grossAmount || null,
        taxAmount: parsed.taxAmount || null,
        totalAmount: parsed.totalAmount || null,

        currency: parsed.currency || "AED",
      },
      raw: parsed,
    };
  } catch (error) {
    console.error("AI Processing Error:", error);

    return {
      data: {},
      raw: null,
    };
  }
}
