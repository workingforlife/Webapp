---
title: Claude Fable 5.2 Costs 20% Less: Upgrade?
description: Claude Fable 5.2 is $8 and $40 per million tokens, down from $10 and $50. See the saving on a real monthly bill and what to check before you switch.
date: 2026-11-24
image: /assets/blog/claude-fable-5-2-price-cut-should-you-upgrade-hero.jpg
imageAlt: A price tag with a down arrow beside a model version number
tools: price-changes, model-prices, cost-forecaster, model-picker
related: why-llm-price-list-changes-and-when-to-trust-them, how-often-do-llm-api-prices-change, prompt-caching-and-batch-discounts-explained
---
Anthropic released Claude Fable 5.2 on 9 November 2026 at a lower price than Fable 5.1. Both input and output are 20 percent cheaper. If you run Fable 5.1, moving to 5.2 should lower your bill, but it can also change your code and your output length. This post shows the saving and the checks.

[[toc]]

## What changed in the price

Anthropic's launch post and docs give these prices per million tokens:

| | Fable 5.1 | Fable 5.2 | Change |
|---|---|---|---|
| Input | $10 | $8 | -20% |
| Output | $50 | $40 | -20% |
| Cache read | $0.25 | $0.20 | -20% |

Other prices in the docs for Fable 5.2: a 5-minute cache write is $10 and a 1-hour cache write is $16 per million tokens, the Batch API gives a 50 percent discount on input and output, and the optional fast mode costs $16 input and $80 output. Context is 1 million tokens, with up to 128K output tokens.

Claude Mythos 5.2 is the same model for organizations verified through Anthropic's programs, at the same price.

## A worked example

Take 20 million input tokens and 5 million output tokens a month. This is an illustration, so use your own numbers.

| | Fable 5.1 | Fable 5.2 |
|---|---|---|
| Input: 20M tokens | 20 x $10 = $200 | 20 x $8 = $160 |
| Output: 5M tokens | 5 x $50 = $250 | 5 x $40 = $200 |
| Monthly total | $450 | $360 |

The saving is $90 a month, or $1,080 a year. Because both prices fall by the same share, the saving is always 20 percent of your bill, whatever the input and output mix, as long as your token counts stay the same.

## Why your bill may not fall by exactly 20 percent

- **Output length can change.** The docs say Fable 5.2 has adaptive thinking that is always on, with a default effort of high. Token counts can differ from your 5.1 baseline, so measure a day of real traffic before you forecast.
- **Fast mode costs double.** If you turn it on for speed, you pay $16 and $80.
- **Cache behaviour matters.** The cache read price fell by 20 percent too, but a lower hit rate can cost more than the price cut saves. See [Prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained).

## Check before you switch

1. **Read the migration guide.** Anthropic says four changes can break your code, and failing the prefix check, which catches edits to earlier turns, returns a 400 error.
2. **Run your own tests.** Compare quality, length and cost on your prompts, using the method in [Cheapest LLM vs best value](post:cheapest-llm-vs-best-value-test-before-you-switch).
3. **Re-forecast** in the [Cost Forecaster](tool:cost-forecaster) with $8 and $40.
4. **Compare cheaper tiers.** Anthropic's overview lists Opus 5.5 at $4 / $20 and Sonnet 5.5 at $2 / $10. If they pass your tests, they cost much less. Use the [Model Picker](tool:model-picker).

## Frequently asked questions

### How much cheaper is Claude Fable 5.2?

$8 input and $40 output per million tokens, against $10 and $50 for Fable 5.1. That is 20 percent less on both.

### Is Fable 5.2 faster?

Anthropic says outputs are up to 30 percent faster than Fable 5.1, and fast mode can raise speed up to 2.5 times at a higher price. Those are Anthropic's figures, not ours.

### Do I need to change my code?

Possibly. Anthropic's migration guide lists changes that can break code, so test before you switch.

### Is Fable 5.1 being retired?

We did not check this. See Anthropic's deprecations page for dates.

## Sources

- [Anthropic: Introducing Claude Fable 5.2 and Claude Mythos 5.2](https://www.anthropic.com/claude-fable-and-mythos-5-2) (launch on 9 November 2026, $8 / $40, up to 30% faster, fast mode pricing)
- [Claude Platform Docs: Claude Fable 5.2](https://platform.claude.com/docs/en/models/fable-5-2/overview) (context, output limit, cache write prices, Batch API discount, adaptive thinking)
- [Claude Platform Docs: Fable 5.2 migration guide](https://platform.claude.com/docs/en/models/fable-5-2/migration-guide) (price against 5.1, cache read $0.20 vs $0.25, breaking changes)
- [Claude Platform Docs: Models overview](https://platform.claude.com/docs/en/models/overview) (Opus 5.5 and Sonnet 5.5 prices)
- Worked example: our own calculation from the prices above, with an illustrative workload.
