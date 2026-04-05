require("dotenv").config();
const runCreateDealsJob = require("./jobs/createDeals");

(async () => {
  try {
    await runCreateDealsJob();
  } catch (err) {
    console.error("Fatal Error in index.js:", err.message);
    process.exit(1);
  }
})();
