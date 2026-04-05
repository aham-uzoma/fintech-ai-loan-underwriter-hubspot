const { getContacts } = require("../services/contactService");
const { analyzeLead } = require("../services/openaiService");
const { upsertDeal } = require("../services/dealService");

const runCreateDealsJob = async () => {
  console.log(" Starting AI Underwriting Job...");
  const contacts = await getContacts();

  for (const contact of contacts) {
    try {
      console.log(`Evaluating ${contact.properties.firstname}...`);
      const aiDecision = await analyzeLead(contact.properties);
      await upsertDeal(contact, aiDecision);
    } catch (err) {
      console.error(`Error processing ${contact.id}:`, err.message);
    }
  }
  console.log("Job Finished.");
};

module.exports = runCreateDealsJob;
