---
title: AI Agent vs Chatbot vs Batch Job Costs
description: Agents, chatbots and batch jobs use tokens differently. See why an agent can cost far more than one call, with a worked token example and a forecast.
date: 2026-11-19
image: /assets/blog/ai-agent-vs-chatbot-vs-batch-cost-hero.jpg
imageAlt: Bars showing input tokens growing from a batch call to a chatbot to an agent
tools: cost-forecaster, token-counter, model-prices
related: estimate-monthly-cost-of-an-llm-chatbot, cut-your-llm-bill
---
An agent that calls tools in a loop can cost many times more than a single model call, even when each step looks small. The reason is that models have no memory, so each step re-sends everything that came before. This guide compares three common workloads, a batch job, a chatbot and an agent, with a worked example in tokens so you can see where the cost comes from.

[[toc]]

## Three workloads, three shapes

- **A batch job** is one call repeated at your volume. Each call is independent, so the cost grows in a straight line with the number of calls.
- **A chatbot** re-sends the system prompt and the whole conversation on every turn, so cost grows faster than the number of turns. Our guide to [estimating the monthly cost of a chatbot](post:estimate-monthly-cost-of-an-llm-chatbot) covers this in detail.
- **An agent** re-sends the system prompt and the whole history on every step, and the history grows quickly, because tool results are added to it.

## A worked example in tokens

These numbers are illustrations, not measurements. Use your own with the [Token Counter](tool:token-counter).

Assume a 2,000-token system prompt, and a model reply of 300 tokens each time.

| Workload | Calls | Input tokens in total | Output tokens in total |
| --- | --- | --- | --- |
| Batch job: one task of 500 tokens | 1 | 2,500 | 300 |
| Chatbot: 8 turns, 100-token user messages | 8 | 28,000 | 2,400 |
| Agent: 8 steps, 500-token task, 1,200 tokens of tool results per step | 8 | 62,000 | 2,400 |

The agent sends about 25 times the input of the single call, and about twice the input of the chatbot, while writing the same amount of output. The extra cost comes almost entirely from re-sending a growing history.

Here is how the agent figure is built. Step 1 sends 2,500 tokens (system prompt plus task). Each later step adds the previous reply (300 tokens) and the tool result (1,200 tokens), so step 2 sends 4,000, step 3 sends 5,500, and so on up to 13,000 tokens at step 8. Adding the eight steps gives 62,000.

## From tokens to money

Input and output are priced separately, per million tokens, and output usually costs more. Multiply your input total by the input price and your output total by the output price. Here are the newest Anthropic and OpenAI models from our price data, which updates daily.

[[api-prices Anthropic]]

[[api-prices OpenAI]]

For a monthly figure, multiply the cost of one run by your runs per month. The [Cost Forecaster](tool:cost-forecaster) does this for chatbots, agents and batch jobs. It models growing history, caps it at the model's context window, and prices input and output separately.

## What changes the answer

- **Number of steps.** Cost grows faster than the step count, because every step re-sends more than the one before. Capping steps is the strongest control.
- **Size of tool results.** Large tool outputs inflate every later step. Return only the fields the agent needs.
- **Prompt caching.** If the repeated part of each step is billed at a reduced rate, the saving can be large. It depends on traffic, because a cache can go cold. The Cost Forecaster has a cache warmth chart for this.
- **Batch pricing.** Work that can wait may be cheaper through a provider's batch option. Check each provider's current terms. See [seven ways to cut your LLM bill](post:cut-your-llm-bill).
- **Model choice.** A cheaper model for simple steps can cut the total. Different models also count tokens differently, as explained in [why token counts differ between models](post:why-token-counts-differ-between-models).

## How to forecast yours

1. Count your system prompt and a typical task with the [Token Counter](tool:token-counter).
2. Estimate steps per run and the size of a typical tool result.
3. Open the [Cost Forecaster](tool:cost-forecaster), choose the agent workload and enter these numbers.
4. Look at the sensitivity chart to see which input moves the bill most, then test cutting it.

The forecast is a model, not a quote. Real bills also depend on retries, tool calls and provider rules.

## Frequently asked questions

### Why do agents cost more than chatbots?

Both re-send their history on every call, but an agent's history grows faster, because each step adds tool results as well as messages. More steps and larger tool outputs both increase the input total.

### Is the example above a real bill?

No. It is an illustration in tokens. Use your own counts and the current price of your model.

### What is the best way to cut agent costs?

Limit the number of steps, keep tool results short, and use caching where it applies. Then measure again.

### Does a batch job cost less?

A batch job avoids the growing history, so its cost is a straight line. Some providers also discount batch work, so check their current terms.
