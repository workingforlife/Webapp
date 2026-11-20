---
title: Cheapest LLM vs Best Value: How to Test
description: The cheapest model is not always the cheapest to run. Learn a simple test using your own examples and a cost-per-good-answer figure to compare models.
date: 2026-11-19
image: /assets/blog/cheapest-llm-vs-best-value-test-before-you-switch-hero.jpg
imageAlt: Two models compared on cost per good answer
tools: model-picker, cost-forecaster, token-counter
related: choose-an-llm-for-your-budget, cut-your-llm-bill
---
A price list tells you what a model costs per token. It cannot tell you how often the answer is good enough. If a cheap model needs a retry or a human fix on a large share of requests, it may cost more per usable answer than a pricier one. This guide shows a small test you can run yourself to find out.

[[toc]]

## Why price per token is not enough

Two things can make a cheap model costly:

- **Retries.** If an answer fails a check and you ask again, you pay for both calls.
- **Review and fixes.** If a person has to correct many answers, their time is part of the cost.

A pricier model that is right more often can come out cheaper per answer you can actually use.

## Build a small test set

1. Collect **20 to 50 real examples** of your task. Real inputs beat invented ones.
2. For each, write down what a good answer looks like, or keep a person's accepted answer as the reference.
3. Include some hard cases, such as long inputs, unusual wording and edge cases.

Keep the set fixed so every model faces the same questions.

## Run the shortlist

Use the [Model Picker](tool:model-picker) to shortlist three to five models: one or two cheap ones, a mid-priced one and a stronger reference. See [how to choose an LLM for your budget](post:choose-an-llm-for-your-budget). Run every example through each one with the same prompt.

Check the output against your standard. A simple pass or fail for each example is enough to start. If you need to check structured output, a validator helps. See [how to get reliable JSON from an LLM](post:reliable-json-from-llm).

## Work out the cost per good answer

For each model, take:

- **Cost per request**, from your token counts and the model's prices. The [Cost Forecaster](tool:cost-forecaster) does this.
- **Acceptance rate**, the share of answers that passed.

Then:

**Cost per good answer = cost per request ÷ acceptance rate**

Here is an illustration with made-up numbers, not real model results:

| | Cost per request | Acceptance rate | Cost per good answer |
|---|---|---|---|
| Model A (cheap) | $0.0020 | 40% | $0.0050 |
| Model B (mid-priced) | $0.0040 | 95% | $0.0042 |

Model A is half the price per request but costs more for each answer you can use, because most of its answers get rejected. If rejected answers also need a person's time, the gap grows. In another case, a cheap model could pass 90 percent of the time and win easily. That is why you test.

This formula counts the cost of the extra calls. It does not count review time unless you add it, so add an estimate if people fix the rejected answers.

## Other things to record

- **Latency**, if users are waiting.
- **Failure types**, such as wrong format, made-up details or refusals, because some are easier to fix with a better prompt than others.
- **Prompt length**, because a model that needs a much longer prompt costs more per request.

## Decide, then keep checking

Pick the model with the lowest cost per good answer that also meets your speed and reliability needs. Keep your test set. When prices or models change, rerun it before you switch.

## Frequently asked questions

### How many examples do I need?

Twenty to fifty real examples is a practical start. A larger set gives steadier results, but even a small one shows large differences.

### Is the cheapest model ever the right choice?

Yes, when it passes your checks at a high enough rate. Many simple tasks, such as short classification, may suit a small model. The test shows which tasks do.

### Should I include human review time?

If people correct rejected answers, yes. Add an estimate of their time per fix to the cost of each failed answer.

### How often should I retest?

When you change the prompt, when a model is updated or replaced, and when prices change enough to matter.
