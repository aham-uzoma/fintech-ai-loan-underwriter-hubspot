const axios = require("axios");
const { headers, baseUrl } = require("../config/hubspotClient");

const getContacts = async () => {
  let allContacts = [];
  let after = undefined;

  do {
    const res = await axios.post(
      `${baseUrl}/contacts/search`,
      {
        filterGroups: [
          { filters: [{ propertyName: "loan_amount_needed", operator: "HAS_PROPERTY" }] },
        ],
        properties: [
          "firstname",
          "lastname",
          "loan_amount_needed",
          "credit_score",
          "annual_income",
          "years_in_business",
          "employment_status",
        ],
        limit: 100,
        after,
      },
      { headers },
    );

    allContacts = allContacts.concat(res.data.results);
    after = res.data.paging?.next?.after;
  } while (after);

  return allContacts;
};

module.exports = { getContacts };
