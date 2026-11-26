---
title: How Much Does a Prompt Cost on Each LLM?
description: One 1,000-token prompt priced across 195 models from our 18 Nov list: the cheapest, the median and the most expensive, and what drives the gap.
date: 2026-11-26
image: /assets/blog/how-much-does-a-prompt-cost-on-every-model-hero.jpg
imageAlt: A single prompt with price tags from low to high across many models
tools: prompt-cost-compare, model-prices, model-picker
related: compare-llm-api-prices, input-vs-output-tokens-why-output-costs-more
---
The same prompt can cost a hundred times more on one model than another. This post prices one example prompt across the models on our list so you can see the spread. The numbers are from our price list dated 18 November 2026, so check current prices before you rely on them.

[[toc]]

## The example

A prompt of 1,000 input tokens that gets a reply of 300 output tokens. That is a typical short question with a short answer. We priced it on every model in our list whose context window can hold it, leaving out audio, search, image and other specialised models. That leaves 195 models. Token counts differ between providers, so costs for non-OpenAI models are approximate. See [why token counts differ](post:why-token-counts-differ-between-models).

## The spread

| | Per request | Per 1,000 requests |
| --- | --- | --- |
| Cheapest model | about $0.00008 | about $0.08 |
| Median model | about $0.002 | about $2.00 |
| Most expensive model | about $0.084 | about $84.00 |

The most expensive model costs about a thousand times the cheapest for the same job, and about 40 times the median. That gap is why the choice of model matters more than small savings on prompt wording.

## The cheapest model from each major provider

| Provider | Cheapest model in the list | Per request |
| --- | --- | --- |
| Cohere | command-r7b-12-2024 | about $0.000083 |
| Mistral | ministral-3-3b-2512 | about $0.00013 |
| OpenAI | gpt-5-nano | about $0.00017 |
| Google | gemini-2.5-flash-lite | about $0.00022 |
| DeepSeek | deepseek-coder | about $0.00022 |
| Anthropic | claude-haiku-5-5 | about $0.00025 |
| xAI | grok-build-0.1 | about $0.0016 |

A low price does not mean good answers. Small models save money and can fail on harder tasks, so test before you choose, as described in [cheapest vs best value](post:cheapest-llm-vs-best-value-test-before-you-switch).

## What drives the gap

- **Model size and tier.** Larger models cost more per token.
- **Output price.** Output tokens cost several times more than input tokens, so a long reply moves the total more than a long prompt. See [why output tokens cost more](post:input-vs-output-tokens-why-output-costs-more).
- **Context window.** A model that cannot fit your prompt is not an option, however cheap.

## Price your own prompt

The [Prompt Cost Compare](tool:prompt-cost-compare) tool does this for your text. Paste your prompt, set the reply length and monthly volume, and see the cost on each model. To rank models by a full workload, use the [Model Picker](tool:model-picker).

## Frequently asked questions

### How much does a prompt cost?

It depends on the model. In our 18 November list, a 1,000-token prompt with a 300-token reply cost from about $0.00008 to about $0.084 per request, with a median around $0.002.

### Which LLM is cheapest per prompt?

On our list, the cheapest models for this example were small models from Cohere, Mistral and OpenAI. The cheapest is not always the best value, so test quality too.

### Does a longer prompt cost more?

Yes, in proportion to its tokens. Input tokens are priced per million, so doubling the prompt doubles the input cost for each request, while the reply cost stays the same.

## Sources

- [LiteLLM: model_prices_and_context_window.json](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) (the community price list our catalog comes from)
- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- [Anthropic: Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)
- [Google: Understand and count tokens](https://ai.google.dev/gemini-api/docs/interactions/tokens)
- Prices and spreads: calculated from our own price list dated 18 November 2026, which comes from the LiteLLM community price list and is not verified against provider billing.
