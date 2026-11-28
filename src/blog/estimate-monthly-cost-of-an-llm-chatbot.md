---
title: How to Estimate the Monthly Cost of an LLM Chatbot
description: A step-by-step method for forecasting what a chatbot will cost each month, including why conversation history makes bills grow faster than expected.
date: 2026-11-10
updated: 2026-11-28
image: /assets/blog/estimate-monthly-cost-of-an-llm-chatbot-hero.jpg
imageAlt: Chat messages growing longer as a conversation continues
tools: cost-forecaster, token-counter, model-prices
related: cut-your-llm-bill, compare-llm-api-prices
---
A chatbot looks cheap per message, then the first invoice arrives and it is several times your estimate. The reason is almost always the same: the model has no memory, so every turn re-sends the whole conversation. Here is a method that accounts for it. It is part of our cost series, and the main guide is [Seven Ways to Cut Your LLM Bill](post:cut-your-llm-bill). Building an agent instead? See [what agents, chatbots and batch jobs cost](post:ai-agent-vs-chatbot-vs-batch-cost).

[[toc]]

## The inputs you need

1. **System prompt size** in tokens. Paste it into the [Token Counter](tool:token-counter) to measure it.
2. **Average user message** in tokens.
3. **Average reply** in tokens.
4. **Turns per conversation.** How many back-and-forths a typical user has.
5. **Conversations per month.**
6. **The model's prices**, for input and for output, per million tokens. Find them on [Model Prices](tool:model-prices).

## Step 1: cost of a single turn

On the first turn, the input is the system prompt plus the user message. The output is the reply.

> Turn 1 input = system prompt + user message. Turn 1 output = reply.

## Step 2: add the history

On turn 2, the model needs the first exchange too. So input is the system prompt, plus turn 1's message and reply, plus the new message. Each later turn adds another exchange to the input.

A worked example with made-up round numbers: a 500-token system prompt, 100-token user messages and 300-token replies.

| Turn | Input tokens | Output tokens |
|---|---|---|
| 1 | 600 | 300 |
| 2 | 1,000 | 300 |
| 3 | 1,400 | 300 |
| 4 | 1,800 | 300 |
| 5 | 2,200 | 300 |

Over five turns the input totals 7,000 tokens, even though the user only typed 500 tokens. Input is 14 times what the user wrote, which is why costs grow faster than the number of messages.

## Step 3: price it

Multiply each total by its price per million tokens. With hypothetical prices of $3 per million input tokens and $15 per million output tokens, those five turns cost about $0.021 for input and $0.0225 for output, around $0.044 per conversation. At 100,000 conversations a month that is roughly $4,350.

Change the model and the same traffic can cost a fraction or a multiple of that.

## Step 4: account for what reduces it

- **Prompt caching.** The repeated start of the prompt can be billed at a large discount when it is reused.
- **History limits.** Capping or summarizing old turns stops input from growing without bound.
- **Context windows.** Once the history exceeds the window, older turns are dropped, which also caps the cost.
- **Shorter replies.** Output is the pricier side, so a tighter reply style saves money.

## Step 5: add a margin

Real traffic includes retries, longer conversations than average and tool calls. Treat your estimate as a range and plan for the upper end.

## Skip the spreadsheet

The [Cost Forecaster](tool:cost-forecaster) does all of this for you. Enter the six inputs, pick a model, and it models growing history, prompt caching and the context window, then shows which inputs move the bill most. You can export the result as Excel, PDF or an image to share with your team. Once you have the number, [seven ways to cut your LLM bill](post:cut-your-llm-bill) shows where to trim it, and [comparing API prices fairly](post:compare-llm-api-prices) helps you choose the model. For a single prompt rather than a whole month, see [how to estimate prompt cost before you send it](post:estimate-prompt-cost-before-you-send-it), and see [what few-shot examples cost in tokens](post:what-few-shot-examples-cost-in-tokens) if your system prompt carries examples.

## Frequently asked questions

### Why is my chatbot bill several times my estimate?

The model has no memory, so every turn re-sends the whole conversation. Input grows with each turn, which is why costs grow faster than the number of messages. In the worked example above, five turns send 7,000 input tokens even though the user typed only 500.

### What numbers do I need for an estimate?

Six inputs: the system prompt size, the average user message, the average reply, the turns per conversation, the conversations per month, and the model's input and output prices per million tokens.

### What should I add on top of the estimate?

A margin. Real traffic includes retries, longer conversations than average and tool calls, so treat the estimate as a range and plan for the upper end.

### What lowers a chatbot's bill?

Prompt caching for the repeated start of the prompt, history limits that cap or summarize old turns, the context window, which drops older turns once it is full, and shorter replies, since output is the pricier side.

## Sources

- [Anthropic: Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) (each turn accumulates in the window, input and output both count toward it)
- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- [Anthropic: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (separate input and output prices, prompt caching multipliers, 50% Batch API discount)
- [Anthropic: Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- Worked example: made-up round numbers and hypothetical prices, shown only to demonstrate the arithmetic.
