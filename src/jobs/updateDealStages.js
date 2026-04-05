const axios = require("axios");
const { headers, baseUrl } = require("../config/hubspotClient");
const { analyzeLead } = require("../services/openaiService");
const { moveDealStage } = require("../services/stageService");

const runUpdateStagesJob = async () => {
  console.log(" Starting Deal Stage Sync Job...");

  // Fetch all active deals with associated contact data
  const dealRes = await axios.post(
    `${baseUrl}/deals/search`,
    {
      properties: ["dealname", "dealstage", "amount", "associated_contact_id"],
      limit: 50,
    },
    { headers },
  );

  for (const deal of dealRes.data.results) {
    try {
      const contactId = deal.associations?.contacts?.results[0]?.id;
      if (!contactId) continue;

      // Fetch latest contact info
      const contactRes = await axios.get(
        `${baseUrl}/contacts/${contactId}?properties=annual_income,credit_score,loan_amount_needed,years_in_business`,
        { headers },
      );

      // Re-evaluating with AI
      const aiDecision = await analyzeLead(contactRes.data.properties);

      const wasMoved = await moveDealStage(
        deal.id,
        deal.properties.dealstage,
        aiDecision.recommendation,
      );

      if (wasMoved) {
        console.log(`Deal ${deal.id} synchronized with AI recommendation.`);
      }
    } catch (err) {
      console.error(`Error updating deal ${deal.id}:`, err.message);
    }
  }
};

module.exports = runUpdateStagesJob;
