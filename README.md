# AI-Powered Fintech Loan Underwriter

An automated, AI-driven lending pipeline that integrates **HubSpot CRM**, **OpenAI (GPT-4o)**, and **GitHub Actions** to transform raw lead data into structured underwriting decisions in real-time.

---

## Overview

In traditional fintech, manual underwriting is a bottleneck. This project solves that by creating an **autonomous Virtual Underwriter**. The system monitors HubSpot for new loan applications, uses AI to analyze creditworthiness, moves the deal to the appropriate pipeline stage, and triggers high-priority tasks for the sales team—all without human intervention.

## Key Features

- **Automated Lead Scoring:** Evaluates credit score, income-to-loan ratios, and business longevity.
- **Intelligent Stage Movement:** Automatically moves deals between "New," "Contacted," and "Qualified" stages based on AI confidence.
- **Task Orchestration:** Generates urgent HubSpot tasks for high-value/low-risk "Qualified" leads.
- **Serverless Execution:** Runs 24/7 via GitHub Actions (Cron) with no hosting costs.
- **Modular Architecture:** Clean Separation of Concerns (Services, Jobs, Config).

---

## System Architecture

1.  **Trigger:** GitHub Actions wakes up every hour and executes the Node.js environment.
2.  **Fetch:** The `contactService` queries the HubSpot Search API for leads with completed financial data.
3.  **Analyze:** The `openaiService` sends lead data to GPT-4o with a strict fintech-underwriting prompt.
4.  **Execute:** The `dealService` creates/updates deals and assigns an interest rate.
5.  **Notify:** If the AI confidence score is >90%, a high-priority follow-up task is created for the team.

---

## Technical Setup

### Prerequisites

- Node.js (v18+)
- HubSpot Private App Access Token
- OpenAI API Key

### Installation

1.  **Clone the repo:**

    ```bash
    git clone [https://github.com/yourusername/hubspot-fintech-automation.git](https://github.com/yourusername/hubspot-fintech-automation.git)
    cd hubspot-fintech-automation
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and fill in your keys:
    ```text
    HUBSPOT_TOKEN=your_token
    OPENAI_API_KEY=your_key
    HUBSPOT_PIPELINE=your_pipeline_id
    HUBSPOT_STAGE_NEW=your_stage_id
    HUBSPOT_STAGE_Q=your_stage_id
    HUBSPOT_STAGE_CON=your_stage_id
    ```

---

## AI Logic & Prompt Engineering

The system uses a **Chain of Thought** prompt to ensure the LLM acts as a Senior Underwriter. It enforces a strict JSON schema output for seamless integration:

```json
{
  "recommendation": "QUALIFIED",
  "interest_rate": 7.5,
  "reasoning": "High credit score (750) and low debt-to-income ratio...",
  "confidence_score": 98
}

## Deployment (GitHub Actions)

The project is fully automated. To set it up:

Push the code to GitHub.

Go to Settings > Secrets and variables > Actions.

Add all variables from your .env as Repository Secrets.

The pipeline will now run every hour or can be triggered manually via the Actions tab.

## Business Impact

Reduced Response Time: Leads are analyzed and categorized in seconds, not hours or days.

Increased Accuracy: Eliminated human errors and ensured consistent risk assessment.

Scalability: The startup can handle 10x the lead volume without increasing underwriting headcount.
```
