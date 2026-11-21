---
title: What LLM Workloads Cost: Four Examples
description: What a chatbot, document Q&A, summarising and classification job cost each month across 190+ models, and why the spread is so wide.
date: 2026-11-19
updated: 2026-11-21
image: /assets/blog/llm-cost-by-workload-chatbot-rag-classification-hero.jpg
imageAlt: Four workload types shown with a wide range of monthly costs
tools: model-picker, cost-forecaster, model-prices
related: choose-an-llm-for-your-budget, estimate-monthly-cost-of-an-llm-chatbot
---
The same model price can mean very different bills depending on the job. A short classifier that runs 100,000 times a month and a document summariser that runs 5,000 times use tokens in different ways. This guide takes four example workloads, shows what they cost across the models in our price list, and explains what drives the spread.

[[toc]]

## How to read these numbers

The sizes below are **examples to start from, not benchmarks**. We chose plausible-looking token counts and volumes so you can see how the arithmetic behaves. Your real workload will differ, so use your own numbers in the [Model Picker](tool:model-picker).

The figures come from our price list dated 18 November 2026, and exclude audio, search, research and other specialised models. They use plain input and output prices, with no caching or batch discount. Prices change daily, so open the links to see current numbers.

## The four examples

| Workload | Input tokens | Output tokens | Requests a month | Models that fit | Cheapest | Median | Highest |
|---|---|---|---|---|---|---|---|
| [Support chatbot](/model-picker#pick~eyJpIjo4MDAsIm8iOjIwMCwiciI6MzAwMDAsImMiOjAsImIiOjAsIm0iOjAsInUiOjAsImN1ciI6IiIsIngiOmZhbHNlLCJzbyI6ImNvc3QifQ) | 800 | 200 | 30,000 | 195 | $1.80 | $45.00 | $1,800 |
| [Document Q&A (RAG)](/model-picker#pick~eyJpIjo0MDAwLCJvIjo0MDAsInIiOjIwMDAwLCJjIjowLCJiIjowLCJtIjowLCJ1IjowLCJjdXIiOiIiLCJ4IjpmYWxzZSwic28iOiJjb3N0In0) | 4,000 | 400 | 20,000 | 191 | $4.20 | $120.00 | $3,840 |
| [Summarising documents](/model-picker#pick~eyJpIjo2MDAwLCJvIjo2MDAsInIiOjUwMDAsImMiOjAsImIiOjAsIm0iOjAsInUiOjAsImN1ciI6IiIsIngiOmZhbHNlLCJzbyI6ImNvc3QifQ) | 6,000 | 600 | 5,000 | 191 | $1.57 | $45.00 | $1,440 |
| [Classifying short texts](/model-picker#pick~eyJpIjo1MDAsIm8iOjIwLCJyIjoxMDAwMDAsImMiOjAsImIiOjAsIm0iOjAsInUiOjAsImN1ciI6IiIsIngiOmZhbHNlLCJzbyI6ImNvc3QifQ) | 500 | 20 | 100,000 | 195 | $2.17 | $67.50 | $1,860 |

All figures are monthly costs in US dollars. For each workload, the highest-priced model costs roughly 850 to 1,000 times the cheapest.

## What the table shows

- **The spread dwarfs the workload.** Moving between these four workloads changes the cheapest cost by under three times, from $1.57 to $4.20. Moving from the cheapest model to the dearest changes it by hundreds of times. Choosing a model matters more than shaving tokens, though both count.
- **Context size changes who is in the running.** The RAG and summarising jobs send thousands of input tokens, which rules out a few models with small context windows, so fewer models fit.
- **Output-light jobs favour cheap input.** The classifier writes only 20 tokens, so input price decides its cost. Output prices are usually several times input prices, which is why long answers weigh more. See [why output tokens cost more than input](post:input-vs-output-tokens-why-output-costs-more).
- **Volume turns small differences into real money.** A fraction of a cent per request is invisible at 1,000 requests and obvious at 100,000.

## Before you act on the cheapest model

The cheapest model on a list is a starting point, not a verdict. A small, cheap model may be fine for tagging short texts and poor at summarising long documents, and we do not score quality. Shortlist a few models and run your own examples through them. See [how to choose an LLM for your budget](post:choose-an-llm-for-your-budget) and [how to test before you switch](post:cheapest-llm-vs-best-value-test-before-you-switch).

## What these examples leave out

- **Conversation history.** A chatbot re-sends earlier turns, so its input grows with each turn. Model it in the [Cost Forecaster](tool:cost-forecaster) or read [how to estimate the monthly cost of a chatbot](post:estimate-monthly-cost-of-an-llm-chatbot).
- **Agents.** Each step re-sends the context. See [what an agent costs compared with a chatbot](post:ai-agent-vs-chatbot-vs-batch-cost).
- **Caching and batch discounts.** They can cut the bill if your provider offers them. See [prompt caching and batch discounts explained](post:prompt-caching-and-batch-discounts-explained).
- **Retries and review.** Failed or rejected answers cost money too.

## Frequently asked questions

### How much does a chatbot cost to run per month?

It depends on the model, the message sizes, the history and the volume. In our 30,000-request example, the monthly cost ranged from $1.80 to $1,800 across models, before history is counted. Use the Model Picker with your own numbers.

### Why is the gap between cheapest and dearest so large?

Prices per million tokens vary by hundreds of times across models, from small, fast models to large, premium ones. At the same token counts, the bill follows the price.

### Are these prices current?

They are from 18 November 2026. Prices change, so open the links to see today's numbers.

### Do these figures include caching or batch discounts?

No. They use plain input and output prices. You can add a cache share and a batch discount in the Model Picker.

## Sources

- [LiteLLM: model_prices_and_context_window.json](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) (the community price list our catalog comes from)
- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- Prices and spreads: calculated from our own price list dated 18 November 2026, which comes from the LiteLLM community price list and is not verified against provider billing.
