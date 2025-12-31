"""
Push a StructuredPrompt to LangSmith Hub (without model).

This script creates and pushes a StructuredPrompt for evaluating conversation sentiment.
The prompt includes a JSON schema with a positive_sentiment boolean field.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from langsmith import Client
from langchain_core.prompts.structured import StructuredPrompt
from pydantic import BaseModel, Field

# Load environment variables from .env file in project root
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

# ============================================================================
# CONFIGURATION
# ============================================================================
LANGSMITH_API_KEY = os.getenv("LANGSMITH_API_KEY")
if not LANGSMITH_API_KEY:
    raise ValueError("LANGSMITH_API_KEY environment variable is required")


# ============================================================================
# SCHEMA (Pydantic Model)
# ============================================================================
class SentimentEvaluation(BaseModel):
    """Extract information from the user's response to determine sentiment."""
    
    positive_sentiment: bool = Field(
        description="Was the user sentiment positive?"
    )


# ============================================================================
# PROMPT TEMPLATE
# ============================================================================
system_message = """You are an expert conversation evaluator. You will be shown a full conversation between a human user and an AI assistant.
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
Since this is a conversational interaction, pay specific attention to the tone of the final human message and weigh it higher than the others"""

human_message = """Please grade the following conversation according to the above instructions:

<conversation>
{all_messages}
</conversation>

Extract information from the user's response."""


# ============================================================================
# CREATE STRUCTURED PROMPT
# ============================================================================
structured_prompt = StructuredPrompt.from_messages_and_schema(
    [
        ("system", system_message),
        ("human", human_message),
    ],
    schema=SentimentEvaluation.model_json_schema(),
)


# ============================================================================
# PUSH TO HUB
# ============================================================================
def push_to_hub():
    """Push the structured prompt to LangSmith Hub."""
    try:
        print("📤 Pushing sentiment evaluator prompt to hub...")
        
        client = Client()
        # Push ONLY the structured prompt, no model/chain
        url = client.push_prompt(
            "sentiment-evaluator",
            object=structured_prompt,
            description="Conversation sentiment evaluator with positive_sentiment boolean output",
        )
        
        print(f"✅ Success! Prompt pushed to: {url}")
    except Exception as error:
        print(f"❌ Failed to push prompt: {error}")
        raise


# ============================================================================
# MAIN EXECUTION
# ============================================================================
if __name__ == "__main__":
    push_to_hub()
