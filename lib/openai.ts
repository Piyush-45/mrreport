

// import OpenAI from "openai";

// const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.OPENROUTER_API_KEY,
// });

// async function generatePdfSummaryFromOpenAI(pdfText: string) {
//     try {
//         const completion = await openai.chat.completions.create({
//             model: "openai/gpt-4o-mini",
//             // model: "anthropic/claude-sonnet-4",
//             messages: [
//                 {
//                     role: "system",
//                     content:
//                         "You are a friendly, plain-language medical assistant who explains lab results with clarity, warmth, and subtle wit. Always follow the requested output format exactly. Keep explanations professional, positive, and educational. Do NOT give medical advice—focus on general wellness tips. Ensure all content is sensitive, supportive, and flows naturally.",
//                 },
//                 {
//                     role: "user",
//                     content: `
//                     Given the following extracted medical report text:

// ${pdfText}

// Your task:
// 1. Identify each test and its results from the text.
// 2. Generate a single table with these EXACT columns:
//    | Health Metric | Your Value | Healthy Range | What It Tells You | Pro Tip & Smile |
// 3. Be concise: Use plain language for explanations.
// 4. For "What It Tells You": Provide 1–2 sentences explaining what the test measures in general, then personalize it based on whether the result is low, high, or normal (infer status from value vs. reference range). Keep tone positive and encouraging.
// 5. For "Pro Tip & Smile": Give 1–2 sentences of supportive lifestyle advice, and if appropriate, add a light, relevant pun or playful twist. Humor must be subtle, natural, and relevant. For concerning results, keep tone caring first, playful second.
// 6. Output ONLY the table (starting with a | for the first line) — no headings, no introductions, no backticks, no extra text.
// 7. Do NOT copy or include the examples below in your final answer — they are only for style guidance.

// Example Rows (do NOT include in output):
// | Cholesterol | 210 | 100-199 | Measures fat in your blood; your high value suggests it might be elevated due to diet or lifestyle, potentially affecting heart health—chat with a doctor for personalized insights. | Try adding more oats and veggies to your diet—don't let cholesterol 'clog' your vibe while staying active! |
// | Glucose | 95 | 70-99 | Checks blood sugar levels for energy balance; your normal value indicates stable levels, which is great for overall energy. | Keep up the balanced meals and exercise—sweet results like this mean you're on a real 'roll'! |
// | Hemoglobin | 11.5 | 12-16 | Indicates oxygen-carrying capacity in blood; your low value could mean mild anemia, possibly from diet, leading to fatigue—consider discussing with a doctor. | Boost your iron with foods like spinach—you'll feel 'iron'-clad and energized soon enough! |
// `
//                     ,
//                 },
//             ],
//             temperature: 0.75,
//             max_tokens: 2000,
//         });

//         console.log(completion.choices[0].message);
//         return completion.choices[0].message.content;
//     } catch (error: any) {
//         if (error?.status === 429) {
//             throw new Error("RATE_LIMIT_EXCEEDED");
//         }
//         throw error;
//     }
// }

// export default generatePdfSummaryFromOpenAI;


// Add this to your system prompt in the OpenAI function:
const improvedSystemPrompt = `
You are a medical communication expert who transforms complex lab results into clear, encouraging insights. Your responses are professional, warm, and build health confidence.

CORE RULES:
- Never diagnose or give medical advice
- Always encourage professional consultation for abnormal results
- Use encouraging, positive language even for concerning values
- Be precise with medical explanations but use everyday language

OUTPUT: Generate ONLY a markdown table with exactly these columns:
| Health Metric | Your Value | Healthy Range | What It Tells You | Pro Tip & Smile |

ENHANCED COLUMN GUIDELINES:
- Health Metric: Use standard medical terminology
- Your Value: Extract exact value with units from report
- Healthy Range: Use reference ranges from the report (if available)
- What It Tells You: Start with "This test measures..." then explain what the specific result means for the person's health. Be specific about whether it's normal/concerning and why.
- Pro Tip & Smile: Give ACTIONABLE lifestyle advice. Focus on specific foods, exercises, or habits. Make it practical and doable, not generic. Add light wordplay only if it flows naturally.

IMPROVED EXAMPLES:
✓ What It Tells You: "This test measures inflammation in your body. Your elevated level suggests your immune system is responding to something, which could be from infection, stress, or other factors—worth discussing with your doctor to identify the cause."

✓ Pro Tip: "Try adding anti-inflammatory foods like fatty fish, berries, and leafy greens to your meals. Even a 10-minute daily walk can help reduce inflammation—your body will thank you for the 'moving' experience!"

✗ Generic: "This measures your health. Eat better and exercise." (too vague)
✗ Scary: "This could indicate serious disease!" (too alarming)
`;

import OpenAI from "openai";

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

async function generatePdfSummaryFromOpenAI(pdfText: string) {
    try {
        // Input validation
        if (!pdfText || pdfText.trim().length < 50) {
            throw new Error("INSUFFICIENT_DATA");
        }

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            // model: "anthropic/claude-sonnet-4",
            messages: [
                {
                    role: "system",
                    content: improvedSystemPrompt,
                },
                {
                    role: "user",
                    content: `
Analyze this medical report and create a summary table:

${pdfText}

Focus on lab values with clear reference ranges. If a test lacks reference ranges, use standard medical ranges. Extract all identifiable health metrics and their values.
          `,
                },
            ],
            temperature: 0.75,
            max_tokens: 2000,
        });

        const response = completion.choices[0].message.content;

        // Basic response validation
        if (!response || !response.includes("|")) {
            throw new Error("INVALID_RESPONSE_FORMAT");
        }

        console.log("Analysis completed successfully");
        return response;

    } catch (error: any) {
        console.error("Error in generatePdfSummaryFromOpenAI:", error);

        if (error?.status === 429) {
            throw new Error("RATE_LIMIT_EXCEEDED");
        }

        if (error.message === "INSUFFICIENT_DATA") {
            throw new Error("The uploaded document appears to be too short or doesn't contain readable medical data. Please ensure you've uploaded a complete lab report.");
        }

        if (error.message === "INVALID_RESPONSE_FORMAT") {
            throw new Error("Unable to process this report format. Please try uploading a different lab report or contact support.");
        }

        throw error;
    }
}

export default generatePdfSummaryFromOpenAI;