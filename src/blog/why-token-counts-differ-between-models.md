---
title: Why Token Counts Differ Between AI Models
description: The same text can use different token counts on different AI models. Learn why, what Anthropic says about its newer tokenizer, and how to count correctly.
date: 2026-11-19
image: /assets/blog/why-token-counts-differ-between-models-hero.jpg
imageAlt: The same text measured as different token counts by three models
tools: token-counter, model-prices, cost-forecaster
related: how-many-tokens-is-my-text, compare-llm-api-prices
---
Two AI models can charge the same price per million tokens and still give you different bills for the same text. The reason is that each model family splits text into tokens in its own way. This guide explains why, what Anthropic has published about its own models, and how to count tokens so your estimates hold up.

[[toc]]

## Every model family has its own tokenizer

A tokenizer is the part that splits text into tokens, the pieces a model reads and that you are billed for. Each company builds its own, with its own list of pieces. So the same sentence can come out as a different number of tokens on a different model, and a different number of tokens means a different cost and a different amount of text that fits in the context window.

If you want the basics first, read [how many tokens your text is](post:how-many-tokens-is-my-text).

## What Anthropic says about its newer models

Anthropic's own documentation is unusually specific about this. Its [token counting page](https://platform.claude.com/docs/en/build-with-claude/token-counting) says that Claude 4.7 and later models use a newer tokenizer, and that the same input text produces approximately 30 percent more tokens than on earlier models. It adds that the exact increase depends on the content and workload shape, and it advises recounting prompts against the model you plan to use, not reusing counts from earlier models.

Anthropic's [guide to optimizing for cost](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence) makes the budget point directly: compare models on cost per solved task, not per token, because the same text costs about 30% more tokens on the newer models.

## What this means for you

- **A price per million tokens is not the whole price.** If two models have the same listed price but one counts more tokens for your text, the second one is cheaper for you. Our guide on [comparing LLM API prices fairly](post:compare-llm-api-prices) covers how to allow for this.
- **Less text fits in the window.** If a model counts more tokens for the same text, a given context window holds less of your text.
- **Output limits may need revisiting.** A `max_tokens` limit tuned on one model may cut replies short on another. Anthropic's migration guide for Claude Haiku 5.5 tells readers to revisit these limits for this reason.
- **Do not reuse old counts.** A count measured on one model is not valid for another, even from the same company.

Content type matters too. One independent comparison, reported by [DEV Community](https://dev.to/markhuang-ai/claude-turns-the-same-typescript-into-73-more-tokens-that-still-isnt-the-bill-odn), found a much larger gap for a TypeScript sample than the 30 percent figure. A single test is an example, not a rule, so measure your own content.

## How to count correctly

1. **OpenAI models:** the tokenizers are public and run in a browser. The [Token Counter](tool:token-counter) gives exact counts with the OpenAI tokenizers.
2. **Anthropic models:** Anthropic does not ship a tokenizer that runs offline. Its documentation says to use token counting with the model you plan to use to get exact counts.
3. **Other providers:** use the provider's own counting tool where one exists.
4. **Everything else:** treat counts from a different tokenizer as estimates, and leave room for the gap, especially for newer Claude models.

When the Token Counter shows a count for a model other than OpenAI's, it applies the tokenizer you picked, so that figure is approximate.

## Plan the budget with the gap in mind

Once you have a count, put it into the [Cost Forecaster](tool:cost-forecaster), which models growing history, caching and the context window. Compare providers in [Model Prices](tool:model-prices), and remember that a lower price per million tokens does not guarantee a lower bill. Content type matters too: see [tokens for code, JSON and Hindi text](post:how-many-tokens-do-code-json-and-hindi-use).

## Frequently asked questions

### Why do different models count the same text differently?

Each company builds its own tokenizer with its own vocabulary. The same text can therefore split into a different number of tokens.

### How many more tokens do newer Claude models use?

Anthropic's documentation says approximately 30 percent more tokens than earlier models for the same text, and that the exact increase depends on the content.

### Are the counts in the Token Counter exact?

For OpenAI models, yes, when the tokenizer loads. For other models they are approximate, because the tool uses the tokenizer you selected.

### Does a higher token count mean a higher bill?

Usually, yes, if the price per token is the same. Compare models on the cost of your actual task, not only on the listed price per million tokens.

## Sources

- [Anthropic: Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)
- [Anthropic: Optimizing for cost and intelligence](https://platform.claude.com/docs/en/about-claude/models/optimizing-for-cost-and-intelligence)
- [Anthropic: Claude Haiku 5.5 migration guide](https://platform.claude.com/docs/en/models/haiku-5-5/migration-guide)
- [DEV Community: Claude turns the same TypeScript into 73% more tokens](https://dev.to/markhuang-ai/claude-turns-the-same-typescript-into-73-more-tokens-that-still-isnt-the-bill-odn)
