---
title: Opus 4.8 Fast Mode Ends 30 November
description: Claude Opus 4.8 fast mode stops working on 30 November 2026. See what it costs to move to Opus 5.5, what can break, and a checklist to do it safely.
date: 2026-11-25
image: /assets/blog/opus-4-8-fast-mode-ends-30-november-hero.jpg
imageAlt: A calendar page for 30 November with a lightning bolt crossed out
tools: deadline-checker, price-changes, model-prices, cost-forecaster, model-picker
related: ai-api-deadlines-30-november-checklist, claude-fable-5-2-price-cut-should-you-upgrade, why-llm-price-list-changes-and-when-to-trust-them
guide: no
---
Anthropic is removing fast mode from Claude Opus 4.8 on 30 November 2026. After that date, any request to `claude-opus-4-8` that asks for fast mode returns an error instead of an answer. If your app sets `speed: "fast"`, that is a failure, not a price change. This post shows what to move to, what it costs and what to test first.

[[toc]]

## What happens on 30 November

Anthropic's fast mode page marks Opus 4.8 as deprecated and gives the removal date as 30 November 2026. It says that after removal, requests to `claude-opus-4-8` with `speed: "fast"` return an error. The page tells you to migrate to Claude Opus 5.5 to keep using fast mode.

Only fast mode is affected. Standard requests to Opus 4.8 are not part of this removal. You can check which of your models have dates attached with the [Deadline Checker](tool:deadline-checker).

## What it costs

These are Anthropic's list prices per million tokens, as shown on its pricing page when we checked on 25 November 2026.

| | Input | Output |
|---|---|---|
| Opus 4.8 fast mode | $10 | $50 |
| Opus 5.5 fast mode | $8 | $40 |
| Opus 4.8 standard | $5 | $25 |
| Opus 5.5 standard | $4 | $20 |

Fast mode costs exactly twice the standard price on both models. That 2x is our own arithmetic from the table, not a number Anthropic states. Moving from Opus 4.8 fast mode to Opus 5.5 fast mode is a 20 percent cut. Moving to Opus 5.5 standard, with no fast mode, cuts the price by 60 percent.

## A worked example

Take a workload of 20 million input tokens and 5 million output tokens a month. This is an illustration, not a typical figure. Use your own numbers.

| | Monthly cost |
|---|---|
| Opus 4.8 fast mode: 20 x $10 + 5 x $50 | $450 |
| Opus 5.5 fast mode: 20 x $8 + 5 x $40 | $360 |
| Opus 5.5 standard: 20 x $4 + 5 x $20 | $180 |

Fast mode gives up to 2.5 times more output tokens per second, according to Anthropic. If your users need that speed, the saving is $90 a month. If they do not, dropping fast mode saves $270 a month. Decide from how fast your product has to feel, not from the price alone. Re-run the sums with your own volumes in the [Cost Forecaster](tool:cost-forecaster).

## What can break when you move to Opus 5.5

Anthropic's migration guide says the Opus 5 changes also apply to Opus 4.8 users. The ones most likely to matter:

- **Thinking cannot be disabled.** A request with `thinking: {"type": "disabled"}` returns a 400 error. On Opus 4.8, thinking is off unless you ask for it. On Opus 5.5, a request with no `thinking` field runs with thinking, so output tokens and cost can rise.
- **Forced tool use is not supported.** A `tool_choice` of `any` or `tool` returns a 400 error.
- **Priority Tier is not supported on Opus 5.5.** Opus 4.8 keeps it. If you rely on Priority Tier for steady latency, check this first.
- **The minimum cacheable prompt is shorter.** It drops from 1,024 tokens on Opus 4.8 to 512 on Opus 5.5, so more of your prompts can use [prompt caching](post:prompt-caching-and-batch-discounts-explained).

Because thinking tokens are billed as output, a model that thinks by default can cost more per request even at a lower list price. See [input vs output tokens](post:input-vs-output-tokens-why-output-costs-more).

## What to do before 30 November

1. **Search your code** for `claude-opus-4-8` and `speed`. Paste it into the [Deadline Checker](tool:deadline-checker) if you want a quick match.
2. **Pick a target:** Opus 5.5 fast mode if speed matters, Opus 5.5 standard if it does not.
3. **Fix the breaking changes** above in a test environment, especially `thinking` and `tool_choice`.
4. **Measure output tokens** on 50 real prompts before and after. Use the [Token Counter](tool:token-counter) on a few outputs to see the difference.
5. **Re-forecast** in the [Cost Forecaster](tool:cost-forecaster) and compare other models in the [Model Picker](tool:model-picker). See [how to choose a backup LLM](post:choose-a-backup-llm-for-outages) if you want a second model ready.
6. **Add an alert** for errors on the old model name so a missed call does not go unseen. See [the real cost of an LLM outage](post:real-cost-of-an-llm-outage).

Other dates fall on the same day. See the [30 November checklist](post:ai-api-deadlines-30-november-checklist), including the [GPT-5.6 Sol promo ending](post:gpt-5-6-sol-promo-price-ends-30-november) and the [Gemini 4 price rise](post:gemini-4-price-doubles-on-1-december).

## Frequently asked questions

### When does Opus 4.8 fast mode stop working?

Anthropic's fast mode page gives the removal date as 30 November 2026.

### What happens if I do nothing?

Requests to `claude-opus-4-8` with `speed: "fast"` return an error. Requests without fast mode are not affected by this removal.

### Is Opus 5.5 cheaper than Opus 4.8?

On list prices, yes. Opus 5.5 is $4 and $20 per million tokens against $5 and $25 for Opus 4.8, and its fast mode is $8 and $40 against $10 and $50. Thinking-by-default can raise your output tokens, so measure your own bill.

### Can I keep using Opus 4.8 without fast mode?

The fast mode page says only fast mode is removed. It does not announce a retirement date for standard Opus 4.8. Check Anthropic's deprecation page for your model.

### Does Opus 5.5 support everything Opus 4.8 does?

No. Priority Tier, forced tool use and disabling thinking differ. See the list above and Anthropic's migration guide.

## Sources

- [Claude Platform Docs: Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) (Opus 4.8 deprecated; removal date 30 November 2026; error after removal; fast mode prices of $10 / $50 and $8 / $40)
- [Claude Platform Docs: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (standard prices for Opus 4.8 and Opus 5.5; fast mode 2.5x output speed)
- [Claude Platform Docs: Opus 5.5 migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide#migrating-from-claude-opus-4-8) (thinking, tool choice, Priority Tier and cache minimum changes)
- Worked example: our own calculation from the prices above, with an illustrative workload.
