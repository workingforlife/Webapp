---
title: How Often Do LLM API Prices Change?
description: What three weeks of daily price snapshots show: new models arrive often, list price changes are rare, and some changes reverse within days.
date: 2026-11-20
updated: 2026-11-21
image: /assets/blog/how-often-do-llm-api-prices-change-hero.jpg
imageAlt: A timeline of dated markers showing a few price changes among many new models
tools: price-changes, model-prices, model-picker
related: compare-llm-api-prices, cut-your-llm-bill
---
People often assume AI prices fall every month. We keep a daily snapshot of the price list, so we can look at what actually changed instead of guessing. The numbers below are small and cover only a few weeks, so treat them as a snapshot of one period and not as a rule.

[[toc]]

## What we measured

Since 27 October 2026 we have saved a copy of the open-source price catalog every day and compared each copy with the one before. By 19 November that was 25 snapshots and 22 recorded changes, across a list of more than 200 models. You can browse every one of them in the [Price Change Tracker](tool:price-changes).

## What the log shows

- **New models were the most common change.** Thirteen of the 22 entries were models that appeared in the list, from providers including OpenAI, Anthropic, Google and Mistral.
- **List price changes were rare.** Four entries were price changes, covering four model names out of more than 200. Both Mistral Large 4 names roughly doubled on 29 October and went back to about the old price on 3 November. On 19 November, `mistral-large-latest` rose from $0.50 to $0.70 per million input tokens (output $1.50 to $2.10), and `gpt-6-rosalind`, added on 31 October at $15 input and $75 output, was listed at $10 and $50, a cut of one third.
- **Context window changes happened too.** Three OpenAI names listed a smaller context window on 5 November (400K to 272K tokens), and one Google model went from about 1,049K to 131K on 6 November. Another went the other way: a Mistral model listed 131K on 18 November and 262K on 19 November.
- **Two models left the list.** One xAI model and one Mistral-listed model stopped appearing.

## What this means for your budget

In this window, the price you saw for an existing model mostly stayed put, while the list of models you could choose from kept changing. Two of the four price changes were increases and two were cuts, and one of the cuts came on a model that had been listed for only 19 days. That points to a simple habit: do not rebuild your budget every week, but do check again when you pick a model, when a new one launches, and before you sign anything with a long commitment.

Three weeks is too short to say how prices behave over a year, and four changes are not a pattern. If a model you rely on shows a surprising change, confirm it on the provider's own pricing page before you act. The post on [why catalog prices change and when to trust a change](post:why-llm-price-list-changes-and-when-to-trust-them) explains what to look for.

## A quick routine

1. Pick the models you use or might use.
2. Search for them in the [Price Change Tracker](tool:price-changes) once in a while, and filter by provider.
3. If something changed, rerun your workload in the [Model Picker](tool:model-picker) to see the effect on your monthly cost.

## Frequently asked questions

### How often do LLM API prices change?

In our own log, from 27 October to 19 November 2026, list prices changed four times across four model names, out of more than 200 models: two increases and two cuts, one of which reversed an earlier increase within five days. New models and context window changes were more common. That is a short window, so it should not be read as a long-term rate.

### Do AI model prices go down over time?

Prices are not guaranteed to fall, and our short log does not show a trend. Compare current prices on the [Model Prices](tool:model-prices) page and check how yours would change with the [Model Picker](tool:model-picker).

### Where does the data come from?

From an open-source price catalog that we download daily. It is not verified against provider billing, so confirm on the provider's pricing page.

## Sources

- [LiteLLM: model_prices_and_context_window.json](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) (the community price list our catalog comes from)
- [Anthropic: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (separate input and output prices, prompt caching multipliers, 50% Batch API discount)
- [Google: Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) (input and output prices, context caching, 50% batch reduction)
- All counts and dates: from our own daily snapshots of the price catalog between 27 October and 19 November 2026.
