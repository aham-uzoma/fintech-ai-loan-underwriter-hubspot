const { OpenAI } = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const analyzeLead = async (p) => {
  const prompt = `
    You are a Senior Fintech Loan Underwriter. Analyze this lead:
    - Loan: $${p.loan_amount_needed} | Credit: ${p.credit_score} | Income: $${p.annual_income}
    - Years in Biz: ${p.years_in_business} | Employment: ${p.employment_status}

    RULES:
    1. Credit > 720 AND Income > 3x Loan: "QUALIFIED"
    2. Credit 620-720 OR Years in Biz > 5: "CONTACTED"
    3. Otherwise: "NEW_LEAD"

    Respond ONLY in JSON:
    {
      "recommendation": "QUALIFIED" | "CONTACTED" | "NEW_LEAD",
      "interest_rate": number,
      "reasoning": "string",
      "confidence_score": number (0-100)
    }`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content);
};

module.exports = { analyzeLead };
