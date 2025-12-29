# LangSmith Structured Prompt Test Suite

This project contains scripts to create and push StructuredPrompt prompts to LangSmith Hub for evaluator use cases.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root (copy from `env.example`):
```bash
cp env.example .env
```

3. Edit `.env` and add your API keys:
```env
LANGSMITH_API_KEY=your-langsmith-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

**Note**: The `.env` file is gitignored and will not be committed to the repository.

## Scripts

### Push StructuredPrompt only (no model)
```bash
npm run sentiment
```

This pushes a `StructuredPrompt` to the hub as `sentiment-evaluator`. The prompt includes:
- System and human messages for conversation sentiment evaluation
- JSON schema with `positive_sentiment` boolean field
- `strict: true` for schema validation

### Push StructuredPrompt with OpenAI model
```bash
npm run sentiment:model
```

This pushes a `StructuredPrompt` chained with a ChatOpenAI model to the hub as `sentiment-evaluator-with-model`. The chain includes:
- The same StructuredPrompt as above
- ChatOpenAI model (`gpt-4o-mini`) with structured output
- Ready to use without additional model configuration

## Files

- `src/sentiment-evaluator.ts` - Pushes only the StructuredPrompt (no model)
- `src/sentiment-evaluator-with-model.ts` - Pushes StructuredPrompt with OpenAI model

## Environment Variables

- `LANGSMITH_API_KEY` (required) - Your LangSmith API key
- `OPENAI_API_KEY` (required for `sentiment:model` script) - Your OpenAI API key

## What This Does

Both scripts create a StructuredPrompt for evaluating conversation sentiment:

1. **System Message**: Instructions for evaluating user sentiment (positive/negative/neutral)
2. **Human Message**: Template with `{all_messages}` variable for the conversation
3. **Schema**: JSON schema with `positive_sentiment` boolean field (required, strict mode)

The prompts are pushed to LangSmith Hub and can be used in evaluators or other LangChain applications.

