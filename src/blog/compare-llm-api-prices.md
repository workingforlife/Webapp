---
title: How to Compare LLM API Prices Fairly
description: Price per million tokens is only the start. Learn what else to compare across LLM providers: input vs output, context size, caching, batch discounts and real workload cost.
date: 2026-11-10
updated: 2026-11-21
image: /assets/blog/compare-llm-api-prices-hero.jpg
imageAlt: Comparing LLM API prices: input, output and context
tools: model-prices, cost-forecaster, token-counter
related: cut-your-llm-bill, estimate-monthly-cost-of-an-llm-chatbot
---
Comparing LLM prices sounds simple: find the cheapest number. In practice, two models with the same headline price can cost very different amounts for your workload. Here is how to compare fairly. It is part of our cost series, and the main guide is [Seven Ways to Cut Your LLM Bill](post:cut-your-llm-bill).

[[toc]]

## Start with price per million tokens

Providers quote dollars per million tokens, with separate rates for input and output. The [Model Prices](tool:model-prices) page lists them side by side, along with the context window of each model. To turn a price list into a shortlist for your own workload, see [how to choose an LLM for your budget](post:choose-an-llm-for-your-budget). To see what has changed recently, use the [Price Change Tracker](tool:price-changes).

## Look at input and output separately

Output is typically several times pricier than input. A model with cheap input but expensive output can be a bad deal for a chatbot that writes long answers, and a good deal for a classifier that reads a lot and answers in one word. Look at the ratio between the two prices as well as each one. For why the gap exists and how big it is, see [why output tokens cost more than input](post:input-vs-output-tokens-why-output-costs-more).

## Use your own token mix

The right comparison uses the number of input and output tokens your application actually sends. Measure a typical request with the [Token Counter](tool:token-counter), then compare models on that mix. Ticking up to four models on Model Prices shows the cost per request and per month for your numbers, and highlights the cheapest.

## Check the context window

A model that cannot fit your documents is not cheaper, it is unusable. Make sure the context window covers your input plus the reply. See [context windows explained](post:context-windows-explained).

## Include the discounts you can actually use

- **Prompt caching** lowers the price of repeated input if your prompts share a long start.
- **Batch pricing** often halves the price for work that can wait.
- **Volume or committed-use deals** may apply at larger scale.

A model that looks more expensive on the list can be cheaper once the discounts you qualify for are applied.

## Do not forget quality

The cheapest model that gives poor answers costs more in retries, fixes and unhappy users. Test two or three candidates on real examples. A small model that handles your task well beats a large one you cannot afford.

## Know where the numbers come from

Price lists change often, and aggregated catalogs can lag or contain mistakes. The prices on this site come from an open-source catalog refreshed daily, and are not verified against provider billing. Before committing to a budget, confirm on the provider's own pricing page.

## From comparison to budget

Once you have shortlisted models, the [Cost Forecaster](tool:cost-forecaster) projects the monthly cost for a chatbot, an agent or a batch job, including growing history and caching, and lets you export the result. To see what each way of cutting the bill saves, read [Seven Ways to Cut Your LLM Bill](post:cut-your-llm-bill).

## Frequently asked questions

### Is the model with the lowest price per million tokens the cheapest?

Not necessarily. Two models with the same headline price can cost very different amounts for your workload, depending on the input and output mix, the context window and the discounts you can use.

### Why compare input and output prices separately?

Output is typically several times pricier than input. A model with cheap input but expensive output can be a bad deal for a chatbot that writes long answers, and a good deal for a classifier that reads a lot and answers in one word.

### Where do the prices on this site come from?

From an open-source catalog that is refreshed daily. They are not verified against provider billing, so confirm on the provider's own pricing page before committing to a budget.

### Should I factor in answer quality?

Yes. The cheapest model that gives poor answers costs more in retries, fixes and unhappy users, so test two or three candidates on real examples.

## Sources

- [Anthropic: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (separate input and output prices, prompt caching multipliers, 50% Batch API discount)
- [Google: Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) (input and output prices, context caching, 50% batch reduction)
- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- [LiteLLM: model_prices_and_context_window.json](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) (the community price list our catalog comes from)
- Prices on this site: from the LiteLLM community price list, not verified against provider billing.
