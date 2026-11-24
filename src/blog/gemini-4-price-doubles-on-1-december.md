---
title: Gemini 4 Prices Double on 1 December
description: Google's introductory price for Gemini 4 Argon and Carbon ends 30 November. See what $4 and $20 does to your bill, with a worked example and checklist.
date: 2026-11-24
image: /assets/blog/gemini-4-price-doubles-on-1-december-hero.jpg
imageAlt: A price tag doubling on a calendar page for 1 December
tools: price-changes, cost-forecaster, model-picker, model-prices
related: why-llm-price-list-changes-and-when-to-trust-them, track-llm-price-changes-protect-your-budget, choose-an-llm-for-your-budget
---
Google launched Gemini 4 Argon and Gemini 4 Carbon at an introductory price. That price ends on 30 November 2026. From 1 December, input and output tokens cost twice as much. If you run either model in production, your bill doubles on that date unless you change something. This post shows the numbers, a worked example and what to check before the date.

[[toc]]

## What changes on 1 December

Google's pricing page lists Gemini 4 Argon like this, per 1 million tokens:

| | Through 30 Nov 2026 | From 1 Dec 2026 |
|---|---|---|
| Input | $2.00 | $4.00 |
| Output (including thinking tokens) | $10.00 | $20.00 |
| Cached input | $0.10 | $0.20 |

Gemini 4 Carbon launched at the same introductory price as Argon. Google's Cloud pricing page lists Carbon at $4.00 input and $20.00 output from 1 December for global requests. Both increases are exactly 2x.

Argon is not available on the free tier, and its billing includes thinking tokens, so the output side counts everything the model generates, not just the visible answer.

## A worked example

Take a workload of 20 million input tokens and 5 million output tokens a month. This is an illustration, not a typical figure. Use your own numbers.

| | Until 30 Nov | From 1 Dec |
|---|---|---|
| Input: 20M tokens | 20 x $2 = $40 | 20 x $4 = $80 |
| Output: 5M tokens | 5 x $10 = $50 | 5 x $20 = $100 |
| Monthly total | $90 | $180 |

The extra cost is $90 a month, or $1,080 over a year. Because both prices double, the total doubles whatever the mix of input and output. If most of your input is cached, the cached part also doubles, from $0.10 to $0.20 per million.

## What it costs against other models

At $4 and $20, Argon costs the same as Claude Opus 5.5 and twice Claude Sonnet 5.5, which are listed at $4 / $20 and $2 / $10 per million tokens. It costs half of Claude Fable 5.2 at $8 / $40. Price is only one measure. Quality, speed, context limits and your own tests decide what is good value, so use the same method as in [Cheapest LLM vs best value](post:cheapest-llm-vs-best-value-test-before-you-switch).

You can compare current prices in the [Model Picker](tool:model-picker) and re-run your monthly estimate in the [Cost Forecaster](tool:cost-forecaster).

## What to do before 1 December

1. **Re-run your forecast** with $4 and $20 in the [Cost Forecaster](tool:cost-forecaster) and compare it with your budget.
2. **Check your cache share.** Cached input is 95 percent cheaper than normal input before and after the change, so a higher cache hit rate softens the rise. See [Prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained).
3. **Shorten what you can.** Output costs five times input here, so cap the reply length first. See [Input vs output tokens](post:input-vs-output-tokens-why-output-costs-more).
4. **Test a cheaper model** on your own prompts before you decide to move.
5. **Watch the list.** The [Price Change Tracker](tool:price-changes) will show the change when it appears in the daily price file. See [How to track LLM price changes](post:track-llm-price-changes-protect-your-budget).

## Frequently asked questions

### When do Gemini 4 prices go up?

Google's pricing page says the introductory price applies through 30 November 2026 and the new price starts on 1 December 2026.

### How much more will Gemini 4 Argon cost?

Input goes from $2 to $4 per million tokens and output from $10 to $20, which is exactly double.

### Does this apply to Gemini 4 Carbon too?

Google launched Carbon at the same introductory price. Its Cloud pricing page lists $4.00 input and $20.00 output from 1 December for global requests. Check the page for your region and platform.

### Do I have to do anything?

No. The new price applies automatically, but your bill will rise unless your usage changes.

### Are other Gemini 4 models affected?

We only checked Argon and Carbon. Check Google's pricing page for any other model you use.

## Sources

- [Google AI for Developers: Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing) (Argon: $2.00 / $10.00 through 30 November 2026 and $4.00 / $20.00 from 1 December; cached input $0.10)
- [Google AI for Developers: What's new in Gemini 4 Argon](https://ai.google.dev/gemini-api/docs/latest-model) (introductory price and the 1 December change)
- [Google: Gemini 4 Carbon is now available](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-4-carbon-now-available/) (same introductory price as Argon)
- [Google Cloud: Agent Platform pricing](https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing) (Carbon from 1 December, global: $4.00 input, $20.00 output)
- [Anthropic: Models overview](https://platform.claude.com/docs/en/models/overview) (Claude Fable 5.2, Opus 5.5 and Sonnet 5.5 prices)
- Worked example: our own calculation from the prices above, with an illustrative workload.
