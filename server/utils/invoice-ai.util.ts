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
                You are an intelligent invoice data extraction system.

                Analyze the invoice image and extract key financial and identification details.

                IMPORTANT:
                - Field names in invoices may vary (e.g., "Invoice No", "Bill No", "Ref#", etc.)
                - You must infer the correct values based on meaning, not exact labels

                Extract the following fields:

                1. invoiceNumber:
                - Look for: Invoice No, Bill No, Inv #, Ref No, Document No

                2. invoiceDate:
                - Look for: Invoice Date, Bill Date, Date
                - Convert to format: yyyy-mm-dd

                3. vendorName:
                - The company issuing the invoice (usually top/header/logo area)

                4. trnNumber:
                - Look for: TRN, VAT No, GSTIN, Tax Registration Number

                5. grossAmount:
                - Total before tax
                - Look for: Subtotal, Gross Amount, Amount before tax

                6. taxAmount:
                - Look for: VAT, Tax, GST, Sales Tax

                7. totalAmount:
                - Final payable amount
                - Look for: Total, Grand Total, Net Amount, Amount Due

                8. currency:
                - Detect from symbols (₹, $, AED, etc.) or text
                - Default to "AED" if unclear

                ---

                STRICT OUTPUT FORMAT:
                Return ONLY valid JSON. No explanation. No markdown.

                {
                "invoiceNumber": string | null,
                "invoiceDate": string | null,
                "vendorName": string | null,
                "trnNumber": string | null,
                "grossAmount": number | null,
                "taxAmount": number | null,
                "totalAmount": number | null,
                "currency": string | null
                }

                ---

                RULES:
                - If a value is missing, return null
                - Remove commas from numbers (e.g., "1,200.50" → 1200.50)
                - Do not return text like "Not found"
                - Ensure JSON is valid
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
