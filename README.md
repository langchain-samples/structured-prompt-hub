# LangSmith Structured Prompt Test Suite

This project demonstrates how to create and push structured prompts to LangSmith Hub for evaluator use cases. Examples are provided in both **TypeScript** and **Python**.

## Project Structure

```
.
├── typescript/          # TypeScript examples
│   ├── sentiment-evaluator.ts
│   └── sentiment-evaluator-with-model.ts
├── python/              # Python examples
│   ├── sentiment_evaluator.py
│   ├── sentiment_evaluator_with_model.py
│   └── pyproject.toml
├── env.example          # Environment variable template
└── README.md            # This file
```

## Setup

### Environment Variables

1. Create a `.env` file in the project root (copy from `env.example`):
```bash
cp env.example .env
```

2. Edit `.env` and add your API keys:
```env
LANGSMITH_API_KEY=your-langsmith-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
```

**Note**: The `.env` file is gitignored and will not be committed to the repository.

## TypeScript Implementation

### Setup

1. Navigate to the `typescript` directory:
```bash
cd typescript
```

2. Install dependencies:
```bash
npm install
```

### Scripts

#### Push StructuredPrompt only (no model)
```bash
cd typescript
npm run sentiment
```

This pushes a `StructuredPrompt` to the hub as `sentiment-evaluator`. The prompt includes:
- System and human messages for conversation sentiment evaluation
- JSON schema with `positive_sentiment` boolean field
- `strict: true` for schema validation

#### Push StructuredPrompt with OpenAI model
```bash
cd typescript
npm run sentiment:model
```

This pushes a `StructuredPrompt` chained with a ChatOpenAI model to the hub as `sentiment-evaluator-with-model`. The chain includes:
- The same StructuredPrompt as above
- ChatOpenAI model (`gpt-4o-mini`) with structured output
- Ready to use without additional model configuration

### Files

- `typescript/sentiment-evaluator.ts` - Pushes only the StructuredPrompt (no model)
- `typescript/sentiment-evaluator-with-model.ts` - Pushes StructuredPrompt with OpenAI model

## Python Implementation

### Setup

1. Install [uv](https://github.com/astral-sh/uv) if you haven't already:
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

2. Navigate to the `python` directory:
```bash
cd python
```

3. Install dependencies using `uv`:
```bash
uv sync
```

Or install dependencies directly:
```bash
uv add langsmith langchain-core langchain-openai pydantic
```

### Scripts

#### Push StructuredPrompt only (no model)
```bash
uv run python sentiment_evaluator.py
```

Or if dependencies are installed globally:
```bash
python sentiment_evaluator.py
```

This pushes a `StructuredPrompt` to the hub as `sentiment-evaluator`. The prompt includes:
- System and human messages for conversation sentiment evaluation
- Pydantic schema with `positive_sentiment` boolean field
- Structured output validation

#### Push StructuredPrompt with OpenAI model
```bash
uv run python sentiment_evaluator_with_model.py
```

Or if dependencies are installed globally:
```bash
python sentiment_evaluator_with_model.py
```

This pushes a `StructuredPrompt` chained with a ChatOpenAI model to the hub as `sentiment-evaluator-with-model`. The chain includes:
- The same StructuredPrompt as above
- ChatOpenAI model (`gpt-4o-mini`) - StructuredPrompt automatically configures structured output
- Pydantic model for schema validation
- Ready to use without additional model configuration

### Files

- `python/sentiment_evaluator.py` - Pushes only the StructuredPrompt (no model)
- `python/sentiment_evaluator_with_model.py` - Pushes StructuredPrompt with OpenAI model (structured output configured automatically)

## What This Does

Both implementations create a StructuredPrompt for evaluating conversation sentiment:

1. **System Message**: Instructions for evaluating user sentiment (positive/negative/neutral)
2. **Human Message**: Template with `{all_messages}` variable for the conversation
3. **Schema**: 
   - TypeScript: JSON schema with `positive_sentiment` boolean field (required, strict mode)
   - Python: Pydantic model with `positive_sentiment` boolean field

The prompts are pushed to LangSmith Hub and can be used in evaluators or other LangChain applications.

## Environment Variables

- `LANGSMITH_API_KEY` (required) - Your LangSmith API key
- `OPENAI_API_KEY` (required for scripts with model) - Your OpenAI API key

## References

For more information on managing prompts programmatically with LangSmith, see the [official documentation](https://docs.langchain.com/langsmith/manage-prompts-programmatically).
