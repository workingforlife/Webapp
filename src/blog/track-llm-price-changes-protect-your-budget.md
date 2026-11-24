---
title: How to Track LLM Price Changes
description: A simple routine for catching price rises, context cuts and removed models before they hit your AI bill, with what to do when something changes.
date: 2026-11-20
updated: 2026-11-24
image: /assets/blog/track-llm-price-changes-protect-your-budget-hero.jpg
imageAlt: A budget line with markers for price, context and model changes
tools: price-changes, model-picker, cost-forecaster
related: cut-your-llm-bill, estimate-monthly-cost-of-an-llm-chatbot
---
Your AI bill is the product of your usage and a price list that someone else controls. Usually that is fine, but three kinds of change can surprise you: a higher price, a smaller context window, and a model that disappears. This guide shows what to watch and what to do about each.

[[toc]]

## The four changes worth watching

- **Price changes.** An input, output or cache-read price moves. This changes your monthly cost directly.
- **Context window changes.** A model can hold less text than before, which can break prompts that used to fit.
- **New models.** A newer model may do the job for less, or replace the one you use.
- **Removed models.** A model you depend on stops appearing in the price list. It may be retired, renamed or dropped from the catalog, so find out which before you panic.

Some changes are announced before they happen. Two recent examples are [Gemini 4 prices double on 1 December](post:gemini-4-price-doubles-on-1-december) and [Claude Fable 5.2 costs 20% less](post:claude-fable-5-2-price-cut-should-you-upgrade).

## What to do when something changes

1. **Check the source.** The catalog we use is community maintained, so confirm the figure on the provider's own pricing page.
2. **Measure the effect.** Put your typical request into the [Cost Forecaster](tool:cost-forecaster) or the [Model Picker](tool:model-picker) and compare the monthly cost before and after.
3. **Check your prompts.** If the context window shrank, compare it with your longest prompt. The post on [context windows](post:context-windows-explained) explains how to measure it.
4. **Decide, then test.** If you consider switching, test on your own examples first, as described in [cheapest vs best value](post:cheapest-llm-vs-best-value-test-before-you-switch).

## Build in a buffer

Instead of budgeting to the cent, add headroom to your estimate, for example by planning for a higher output price than today's. How much is your call. The point is that a small price change should not be an emergency.

## Keep an eye on it

The [Price Change Tracker](tool:price-changes) lists changes by date, with filters for provider, type of change and model name. Search for the models you use, and use Copy Link to bookmark a filtered view. It does not send alerts, so a short, regular look is the way to use it.

## Frequently asked questions

### How do I know if an AI model's price has changed?

Search for the model in the [Price Change Tracker](tool:price-changes). It shows the old and new price and the date our catalog first showed the change.

### Does the tracker show the date the provider changed the price?

No. It shows the date we first saw the change, which can be later than the provider's announcement.

### What should I do if a model I use disappears from the list?

Check the provider's own pages to see whether it was retired or renamed, then compare alternatives in the [Model Picker](tool:model-picker).

## Sources

- [LiteLLM: model_prices_and_context_window.json](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) (the community price list our catalog comes from)
- [Anthropic: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (separate input and output prices, prompt caching multipliers, 50% Batch API discount)
- [Google: Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) (input and output prices, context caching, 50% batch reduction)
- Change dates: the date we first saw the change in our daily snapshots, which can be later than the provider's announcement.
