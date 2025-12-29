import "dotenv/config";
import { push as hubPush } from "langchain/hub";
import { StructuredPrompt } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

// ============================================================================
// CONFIGURATION
// ============================================================================
const LANGSMITH_API_KEY = process.env.LANGSMITH_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!LANGSMITH_API_KEY) {
  throw new Error("LANGSMITH_API_KEY environment variable is required");
}
if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

// ============================================================================
// SCHEMA
// ============================================================================
const jsonSchema = {
  title: "SentimentEvaluation",
  description: "Extract information from the user's response to determine sentiment",
  type: "object",
  properties: {
    positive_sentiment: {
      type: "boolean",
      description: "Was the user sentiment positive?",
    },
  },
  required: ["positive_sentiment"],
  strict: true,
};

// ============================================================================
// PROMPT TEMPLATE
// ============================================================================
const systemMessage = `You are an expert conversation evaluator. You will be shown a full conversation between a human user and an AI assistant.
Your task is to judge overall user sentiment throughout the duration of this conversation:
Positive responses may include:
Gratitude (thank you, appreciate, helpful)
Resolution indicators (it's fixed, works now, that's clear)
No lingering questions or frustration
Negative responses may include:
Explicit dissatisfaction or confusion
Continued problem statement ("still doesn't work," "not fixed")
Implied negativity without explicit words like "bad," "not working," or "frustrating." For example: "Sure, whatever.", "I'll figure it out myself."
Neutral responses should be classified as positive. Neutral responses may include phrases like: "Okay", "Cool", "Got it"
Since this is a conversational interaction, pay specific attention to the tone of the final human message and weigh it higher than the others`;

const humanMessage = `Please grade the following conversation according to the above instructions:

<conversation>
{all_messages}
</conversation>

Extract information from the user's response.`;

// ============================================================================
// CREATE STRUCTURED PROMPT
// ============================================================================
const structuredPrompt = StructuredPrompt.fromMessagesAndSchema(
  [
    ["system", systemMessage],
    ["human", humanMessage],
  ],
  jsonSchema
);

// ============================================================================
// CREATE MODEL AND CHAIN
// ============================================================================
const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: OPENAI_API_KEY,
});

// Pipe the structured prompt to the model
// StructuredPrompt will automatically call withStructuredOutput()
const chain = structuredPrompt.pipe(model);

// ============================================================================
// PUSH TO HUB
// ============================================================================
async function pushToHub() {
  try {
    console.log("📤 Pushing sentiment evaluator prompt with model to hub...");
    
    // Push the chain (prompt + model)
    const url = await hubPush("sentiment-evaluator-with-model", chain, {
      apiKey: LANGSMITH_API_KEY,
      apiUrl: "https://api.smith.langchain.com",
      description: "Conversation sentiment evaluator with positive_sentiment boolean output, includes OpenAI model",
    });
    
    console.log(`✅ Success! Prompt with model pushed to: ${url}`);
  } catch (error) {
    console.error("❌ Failed to push prompt:", error);
    throw error;
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================
pushToHub().catch(console.error);

