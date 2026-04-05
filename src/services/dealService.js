const axios = require("axios");
const { headers, baseUrl, stages } = require("../config/hubspotClient");

const upsertDeal = async (contact, ai) => {
  const p = contact.properties;

  // Map AI recommendation to HubSpot Stage IDs
  const stageMap = {
    QUALIFIED: stages.QUALIFIED,
    CONTACTED: stages.CONTACTED,
    NEW_LEAD: stages.NEW,
  };
  const targetStage = stageMap[ai.recommendation] || stages.NEW;

  // Checking for existing associations
  const assocRes = await axios.get(`${baseUrl}/contacts/${contact.id}/associations/deals`, {
    headers,
  });
  const existingDeals = assocRes.data.results;

  const dealProperties = {
    dealname: `Loan - ${p.firstname} ${p.lastname}`,
    dealstage: targetStage,
    pipeline: stages.PIPELINE,
    amount: p.loan_amount_needed,
    ai_interest_rate: ai.interest_rate,
    description: `AI REPORT: ${ai.reasoning} | Rate: ${ai.interest_rate}%`,
  };

  let dealId;

  if (existingDeals.length > 0) {
    dealId = existingDeals[0].id;
    await axios.patch(`${baseUrl}/deals/${dealId}`, { properties: dealProperties }, { headers });
  } else {
    const newDeal = await axios.post(
      `${baseUrl}/deals`,
      {
        properties: dealProperties,
        associations: [
          {
            to: { id: contact.id },
            types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }],
          },
        ],
      },
      { headers },
    );
    dealId = newDeal.data.id;
  }

  // Intelligent Task Orchestration
  if (ai.confidence_score >= 90 || ai.recommendation === "QUALIFIED") {
    await createPriorityTask(dealId, p.firstname, ai.recommendation);
  }

  return dealId;
};

const createPriorityTask = async (dealId, name, rec) => {
  const taskProps = {
    hs_task_subject: `URGENT: Follow up with ${name}`,
    hs_task_body: `AI assigned ${rec} status. Pre-approved rate applied. Review and send contract.`,
    hs_task_priority: "HIGH",
    hs_task_status: "NOT_STARTED",
    hs_task_type: "CALL",
  };

  await axios.post(
    `${baseUrl}/tasks`,
    {
      properties: taskProps,
      associations: [
        {
          to: { id: dealId },
          types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 216 }],
        },
      ],
    },
    { headers },
  );
  console.log(`Task Created for Deal ${dealId}`);
};

module.exports = { upsertDeal };
