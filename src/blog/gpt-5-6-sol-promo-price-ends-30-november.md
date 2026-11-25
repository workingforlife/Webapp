---
title: GPT-5.6 Sol Promo Price Ends 30 November
description: OpenAI's promotional price for GPT-5.6 Sol ends on 30 November 2026. See what you pay now, what GPT-6.1 Sol costs, and how to plan without a published new rate.
date: 2026-11-25
image: /assets/blog/gpt-5-6-sol-promo-price-ends-30-november-hero.jpg
imageAlt: A promotional price tag with a countdown to 30 November
tools: deadline-checker, price-changes, model-picker, cost-forecaster, model-prices
related: ai-api-deadlines-30-november-checklist, gemini-4-price-doubles-on-1-december, cheapest-llm-vs-best-value-test-before-you-switch
guide: no
---
OpenAI says GPT-5.6 Sol's promotional pricing is available until 30 November 2026. The model page does not say what the price becomes after that. If you build on GPT-5.6 Sol, you are running on a price that may change in five days, with no published new rate to plan against. This post shows what you pay now, what the newer GPT-6.1 Sol costs and a way to plan when the next price is unknown.

[[toc]]

## What OpenAI says

The GPT-5.6 Sol model page lists these prices per million tokens, as we read them on 25 November 2026:

| | Price per 1M tokens |
|---|---|
| Input | $4.00 |
| Cached input | $0.40 |
| Output | $20.00 |

The same page says: "GPT-5.6 Sol's promotional pricing is available until November 30, 2026." It does not state the price from 1 December. Some third-party sites quote a figure, but we could not find it on OpenAI's pages, so we do not use it here.

## What GPT-6.1 Sol costs

The GPT-6.1 Sol model page lists $2.00 for input, $0.10 for cached input and $10.00 for output per million tokens, with no promotional note. That is half of the GPT-5.6 Sol promotional price on every line.

A lower price is not proof of equal quality. GPT-6.1 Sol is a different model, so answers, length and tool behaviour can differ. Test it on your own prompts, as in [Cheapest LLM vs best value](post:cheapest-llm-vs-best-value-test-before-you-switch).

## A worked example

Take a workload of 20 million input tokens and 5 million output tokens a month. This is an illustration, not a typical figure. Use your own numbers.

| | Monthly cost |
|---|---|
| GPT-5.6 Sol, promotional: 20 x $4 + 5 x $20 | $180 |
| GPT-6.1 Sol: 20 x $2 + 5 x $10 | $90 |

Moving saves $90 a month at these volumes, and $1,080 over a year. If the GPT-5.6 Sol price rises after the promotion, the gap widens. You can check the figures against your volumes in the [Cost Forecaster](tool:cost-forecaster).

## How to plan when the new price is unknown

1. **Set a ceiling now.** Decide the highest price per million tokens at which GPT-5.6 Sol is still worth it for you. If the new price passes it, you already have your answer.
2. **Test the alternative this week.** Run 50 real prompts through GPT-6.1 Sol and compare quality and output length. The [Token Counter](tool:token-counter) shows how long each set of outputs is.
3. **Watch the price file.** The [Price Change Tracker](tool:price-changes) records the day our catalog first shows a new price. See [how to track LLM price changes](post:track-llm-price-changes-protect-your-budget).
4. **Cut tokens in any case.** Shorter prompts and capped output save money at any price. See [seven ways to cut your LLM bill](post:cut-your-llm-bill) and the [Prompt Token Optimizer](tool:prompt-token-optimizer).
5. **Use caching.** Cached input is a tenth of the input price on both models. See [prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained).
6. **Keep a backup model.** If a price change makes the model uneconomic, you want to switch calmly, not in an emergency. See [how to choose a backup LLM](post:choose-a-backup-llm-for-outages).

Promotions end often. See [why LLM price lists change](post:why-llm-price-list-changes-and-when-to-trust-them) and [how often prices change](post:how-often-do-llm-api-prices-change). Two other changes land on the same date: the [Opus 4.8 fast mode removal](post:opus-4-8-fast-mode-ends-30-november) and the [Gemini 4 price rise](post:gemini-4-price-doubles-on-1-december). The [30 November checklist](post:ai-api-deadlines-30-november-checklist) covers all three.

## Frequently asked questions

### When does the GPT-5.6 Sol promotional price end?

OpenAI's model page says the promotional pricing is available until 30 November 2026.

### What will GPT-5.6 Sol cost after that?

OpenAI's page does not say. Plan with a ceiling price and a tested alternative, and check the page again on 1 December.

### Is GPT-6.1 Sol a drop-in replacement?

Not necessarily. It is a different model with its own behaviour. The price is lower, but you should compare quality, output length and any tool calls on your own prompts first.

### Will my API calls fail on 1 December?

OpenAI's page describes a pricing change, not a retirement. We found no statement that GPT-5.6 Sol is removed.

### Does the promotion apply to cached input too?

The page lists $0.40 for cached input alongside the other promotional prices. It does not break out the promotion line by line, so check your invoice.

## Sources

- [OpenAI: GPT-5.6 Sol model page](https://developers.openai.com/api/docs/models/gpt-5.6-sol) (input $4.00, cached input $0.40, output $20.00; promotional pricing available until 30 November 2026)
- [OpenAI: GPT-6.1 Sol model page](https://developers.openai.com/api/docs/models/gpt-6.1-sol) (input $2.00, cached input $0.10, output $10.00)
- [OpenAI: API pricing](https://developers.openai.com/api/docs/pricing) (promotional pricing footnote)
- Worked example: our own calculation from the prices above, with an illustrative workload.
