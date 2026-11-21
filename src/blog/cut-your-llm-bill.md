---
title: Seven Ways to Cut Your LLM Bill
description: Practical ways to reduce LLM API spend: shorter prompts, caching, cheaper models, history limits and batch pricing, with how to judge each trade-off.
date: 2026-11-10
updated: 2026-11-21
image: /assets/blog/cut-your-llm-bill-hero.jpg
imageAlt: Bars falling to show a lower LLM bill
tools: prompt-token-optimizer, cost-forecaster, model-prices
related: estimate-monthly-cost-of-an-llm-chatbot, compare-llm-api-prices
---
Most LLM bills are driven by a few things: how many tokens you send, how many the model writes, and which model you use. These seven changes tackle each, in roughly the order worth trying.

> **Start here for LLM costs.** This is the main guide in our cost series. First work out your numbers with [how to estimate the monthly cost of an LLM chatbot](post:estimate-monthly-cost-of-an-llm-chatbot), then choose a model with [how to compare LLM API prices fairly](post:compare-llm-api-prices), then use the seven changes below to bring the bill down.

[[toc]]

## 1. Trim your prompts

Prompts collect filler: repeated instructions, polite padding, examples nobody needs. Because the same prompt is sent on every request, a few hundred wasted tokens multiplies fast. The [Prompt Token Optimizer](tool:prompt-token-optimizer) finds filler and repeats and shows every change, so you accept only what is safe.

## 2. Use prompt caching

If a long chunk of your prompt is identical across requests (system prompt, reference documents, tool definitions), many providers bill repeated reads at a steep discount. It helps most when requests come close together, because caches expire. See [prompt caching and batch discounts explained](post:prompt-caching-and-batch-discounts-explained) for the published terms and a worked example.

## 3. Pick the right model for the job

The largest model is rarely needed for every task. Classification, extraction and simple rewriting often work well on a small, cheap model. Reserve the expensive one for hard reasoning. Compare options on [Model Prices](tool:model-prices) and test your own examples before switching.

## 4. Cap the output

Output tokens usually cost several times more than input tokens. Ask for concise answers, set a maximum length and request structured output instead of prose when you only need fields.

## 5. Limit conversation history

In a chat, every turn re-sends everything before it. Keep the last few turns, summarize older ones, and drop tool results you no longer need. This keeps long conversations from growing the input without limit.

## 6. Send less context with retrieval

Instead of pasting a whole document into every request, split it into chunks and send only the few most relevant ones. The [Text Chunker](tool:chunker) helps you choose chunk sizes and test which chunk answers a question.

## 7. Use batch pricing for work that can wait

Several providers discount asynchronous batch jobs by around half in exchange for slower turnaround. Evaluations, bulk classification and overnight document processing fit well. The same guide on [caching and batch discounts](post:prompt-caching-and-batch-discounts-explained) covers what each provider documents.

## Measure before and after

A change is only a saving if you can see it. Enter your workload into the [Cost Forecaster](tool:cost-forecaster) before and after the change, and compare the monthly totals. The forecaster also shows which inputs the bill is most sensitive to, so you know where to look first. For a worked monthly example, see [how to estimate the monthly cost of an LLM chatbot](post:estimate-monthly-cost-of-an-llm-chatbot), and to choose between models, see [how to compare LLM API prices fairly](post:compare-llm-api-prices).

> Quality matters more than the last percent of savings. Test any cheaper model or shorter prompt on real examples before rolling it out.

## Frequently asked questions

### Which change should I try first?

The guide lists the seven changes in roughly the order worth trying: trim your prompts, use prompt caching, then pick the right model for the job. The other four are capping the output, limiting conversation history, sending less context with retrieval, and using batch pricing for work that can wait.

### Why cap the output?

Output tokens usually cost several times more than input tokens, so concise answers, a maximum length and structured output instead of prose can cut the bill.

### Is switching to a cheaper model always a saving?

Not if the answers get worse. Quality matters more than the last percent of savings, so test any cheaper model or shorter prompt on real examples before rolling it out.

### How do I know a change actually saved money?

Enter your workload into the Cost Forecaster before and after the change and compare the monthly totals. It also shows which inputs the bill is most sensitive to.
