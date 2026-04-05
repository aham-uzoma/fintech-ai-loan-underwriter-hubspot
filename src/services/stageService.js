const axios = require("axios");
const { headers, baseUrl, stages } = require("../config/hubspotClient");

const moveDealStage = async (dealId, currentStage, recommendation) => {
  const stageMap = {
    QUALIFIED: stages.QUALIFIED,
    CONTACTED: stages.CONTACTED,
    NEW_LEAD: stages.NEW,
  };

  const targetStage = stageMap[recommendation];

  // This only triggers an API call if the stage actually needs to change
  if (targetStage && currentStage !== targetStage) {
    console.log(`Moving Deal ${dealId} from ${currentStage} to ${targetStage}`);
    await axios.patch(
      `${baseUrl}/deals/${dealId}`,
      {
        properties: { dealstage: targetStage },
      },
      { headers },
    );
    return true;
  }

  return false;
};

module.exports = { moveDealStage };
