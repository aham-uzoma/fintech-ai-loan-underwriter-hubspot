require("dotenv").config();

module.exports = {
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
    "Content-Type": "application/json",
  },
  baseUrl: "https://api.hubapi.com/crm/v3/objects",
  stages: {
    NEW: process.env.HUBSPOT_STAGE_NEW,
    QUALIFIED: process.env.HUBSPOT_STAGE_Q,
    CONTACTED: process.env.HUBSPOT_STAGE_CON,
    PIPELINE: process.env.HUBSPOT_PIPELINE,
  },
};
