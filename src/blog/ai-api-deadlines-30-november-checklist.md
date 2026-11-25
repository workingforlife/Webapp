---
title: 30 November AI Deadlines: A Cost Checklist
description: Opus 4.8 fast mode, GPT-5.6 Sol's promo price and Gemini 4's introductory price all end around 30 November. One checklist, with what we verified and what we did not.
date: 2026-11-25
image: /assets/blog/ai-api-deadlines-30-november-checklist-hero.jpg
imageAlt: A calendar page for 30 November with several items ticked off
tools: deadline-checker, price-changes, cost-forecaster, model-picker, model-prices
related: opus-4-8-fast-mode-ends-30-november, gpt-5-6-sol-promo-price-ends-30-november, gemini-4-price-doubles-on-1-december
guide: no
---
Three providers have changes that take effect on or around 30 November 2026. One removes a feature, one ends a promotional price and one doubles an introductory price. Two more dates are reported by third parties and we could not confirm them. This page lists all five in one place, says what we checked and what we did not, and gives one checklist so none of them catches you out.

[[toc]]

## The dates at a glance

| Date | What happens | Checked on provider page? |
|---|---|---|
| 30 Nov 2026 | Claude Opus 4.8 fast mode removed. Requests with fast mode return an error. | Yes |
| 30 Nov 2026 | GPT-5.6 Sol promotional price ends. New price not published. | Yes (date), no (new price) |
| 30 Nov 2026 | Gemini 4 Argon and Carbon introductory price ends. Price doubles on 1 December. | Yes |
| 30 Nov 2026 | Claude Sonnet 4.5 reported to retire on Anthropic-run platforms. | No, third party only |
| 1 Jan 2027 | Gemini 3.8 Flash reported to double in price. | No, third party only |

"Checked" means we read the date on the provider's own page on 25 November 2026. Where a date is third-party only, we say so. Confirm it on the provider's page before you act.

## What each one means for you

**Opus 4.8 fast mode** is a failure risk, not a price change. If your code sends `speed: "fast"` to `claude-opus-4-8`, it breaks on 30 November. Opus 5.5 fast mode is $8 and $40 per million tokens against $10 and $50 now. Read [Opus 4.8 fast mode ends 30 November](post:opus-4-8-fast-mode-ends-30-november).

**GPT-5.6 Sol** is a price risk. You pay $4 and $20 per million tokens now, and OpenAI has not published the price after 30 November. GPT-6.1 Sol is $2 and $10. Read [GPT-5.6 Sol promo price ends 30 November](post:gpt-5-6-sol-promo-price-ends-30-november).

**Gemini 4 Argon and Carbon** go from $2 and $10 to $4 and $20 on 1 December. Read [Gemini 4 prices double on 1 December](post:gemini-4-price-doubles-on-1-december).

**Claude Sonnet 4.5** is reported to retire on 30 November on Anthropic-run platforms, with Sonnet 5.5 as the replacement. We could not read Anthropic's deprecation page in this check, so treat the date as unconfirmed. Sonnet 4.5 is $3 and $15 per million tokens and Sonnet 5.5 is $2 and $10 on Anthropic's pricing page, so a move would also cost less. Cloud platforms such as Bedrock and Vertex AI can set their own dates.

**Gemini 3.8 Flash** is reported to move from $0.75 and $3.75 to $1.50 and $7.50 on 1 January 2027. We could not read Google's pricing page in this check, so treat it as unconfirmed.

## One checklist for all of them

1. **List every model name** in your code, config and notebooks. Paste them into the [Deadline Checker](tool:deadline-checker) to see which dates apply, with days left and a monthly cost at your volumes.
2. **Mark each hit** as a failure risk (a removal or retirement) or a price risk (a promotion or rise). Fix failure risks first, because they stop your app.
3. **Re-run your forecast** for each price risk in the [Cost Forecaster](tool:cost-forecaster).
4. **Shortlist replacements** in the [Model Picker](tool:model-picker) and compare exact prices in [Model Prices](tool:model-prices).
5. **Test on your own prompts** before you switch. Cheaper is not the same as better value. See [Cheapest LLM vs best value](post:cheapest-llm-vs-best-value-test-before-you-switch).
6. **Cut tokens** wherever you can: [shorten the prompt](post:shorten-a-prompt-without-losing-quality), cap output, and use [caching and batch discounts](post:prompt-caching-and-batch-discounts-explained).
7. **Keep a backup model** ready, as in [choose a backup LLM](post:choose-a-backup-llm-for-outages).
8. **Check again on 1 December** and on 1 January. The [Price Change Tracker](tool:price-changes) shows the day each change first appears in our daily file.

## Why these keep happening

Promotions and fast tiers are launch tools. Providers use them to win usage and then reset. If you want to understand the pattern, read [why LLM price lists change](post:why-llm-price-list-changes-and-when-to-trust-them) and [how often LLM API prices change](post:how-often-do-llm-api-prices-change). For the habit that protects your budget, see [how to track LLM price changes](post:track-llm-price-changes-protect-your-budget).

## Frequently asked questions

### Which of these will break my app?

The Opus 4.8 fast mode removal, for requests that set fast mode. The Sonnet 4.5 retirement would too if it is confirmed for your platform. The others are price changes only.

### Which dates did you check yourselves?

We read the Opus 4.8 fast mode date on Anthropic's fast mode page, the GPT-5.6 Sol promotion date on OpenAI's model page and the Gemini 4 dates on Google's pages. The Sonnet 4.5 and Gemini 3.8 Flash dates come from third-party sites only.

### Why does the GPT-5.6 Sol entry have no new price?

OpenAI's page gives the end date but not the price afterwards. We do not guess it.

### Where can I check my own models?

Use the [Deadline Checker](tool:deadline-checker). It runs in your browser and does not upload what you paste.

## Sources

- [Claude Platform Docs: Fast mode](https://platform.claude.com/docs/en/build-with-claude/fast-mode) (Opus 4.8 fast mode removal on 30 November 2026)
- [Claude Platform Docs: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (Opus 5.5, Sonnet 4.5 and Sonnet 5.5 prices)
- [OpenAI: GPT-5.6 Sol model page](https://developers.openai.com/api/docs/models/gpt-5.6-sol) and [GPT-6.1 Sol model page](https://developers.openai.com/api/docs/models/gpt-6.1-sol) (prices; promotion until 30 November 2026)
- [Google AI for Developers: Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing) (Gemini 4 Argon introductory price and 1 December change, as cited in our Gemini 4 guide)
- Not checked on a provider page: the Sonnet 4.5 retirement date and the Gemini 3.8 Flash price from 1 January 2027, both reported by third-party sites only.
