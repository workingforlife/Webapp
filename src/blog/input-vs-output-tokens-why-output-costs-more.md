---
title: Why Output Tokens Cost More Than Input
description: AI APIs charge more for the tokens a model writes than for those you send. See why, what the price gap looks like across providers, and how to use it.
date: 2026-11-19
updated: 2026-11-28
image: /assets/blog/input-vs-output-tokens-why-output-costs-more-hero.jpg
imageAlt: A short output bar costing as much as a long input bar
tools: model-prices, cost-forecaster, token-counter
related: compare-llm-api-prices, cut-your-llm-bill
---
Every AI API price list has two columns: one price for input tokens (what you send) and a higher one for output tokens (what the model writes back). The gap changes how you should think about cost. This guide explains the difference, why it exists, how big it is in our price data, and what it means for your bill.

[[toc]]

## What counts as input and output

**Input tokens** are everything you send in a request: the system prompt, the conversation so far, any documents and your new question. **Output tokens** are what the model generates in reply.

Reasoning or "thinking" tokens usually count as output too, even when you never see them, so a model that thinks at length can produce a bigger output bill than the visible answer suggests. Check how your provider bills them.

## Why output costs more

Providers publish prices, not their cost breakdowns, so the full reason is not public. The explanation most often given is how the model works:

- **Input is read in parallel.** The model can process all of your prompt tokens at the same time in one pass.
- **Output is written one token at a time.** Each new token depends on the one before it, so the model has to run again for every token it writes, and it must keep looking back at everything that came before.

Explanations also point to memory use as a major factor in the writing stage. Pricing is also a business decision, so treat "it costs more to produce" as the usual reasoning, not a published cost figure.

## How big is the gap

Our price list holds 207 models with both an input and an output price (prices dated 18 November 2026). The output price divided by the input price works out like this:

| | Output price vs input price |
|---|---|
| Median across all models | 4 times |
| Lowest | 1 time (same price) |
| Highest | 20 times |
| Anthropic (18 models) | 5 times for every model |
| OpenAI (49 models) | 4 to 8 times |
| xAI (36 models) | 2 to 3 times |

So "output costs 3 to 5 times more" is a good rule of thumb, but not a law. Some providers and models differ a lot, which is why you should check the model you plan to use.

[[api-prices Anthropic]]

[[api-prices OpenAI]]

## A worked example

Suppose a model costs $2 per million input tokens and $10 per million output tokens (5 times, to keep the numbers round; these are illustrative, not a real price). One request sends 3,000 input tokens and gets 500 output tokens back.

| | Tokens | Cost |
|---|---|---|
| Input | 3,000 | $0.0060 |
| Output | 500 | $0.0050 |
| Total | 3,500 | $0.0110 |

Output is only about 14 percent of the tokens but about 45 percent of the cost. Now compare two savings of 100 tokens each:

- Trim 100 input tokens: saves $0.0002, under 2 percent of the cost.
- Trim 100 output tokens: saves $0.0010, about 9 percent of the cost.

The same 100 tokens are worth five times as much on the output side, because that is the price ratio.

## What this means for your bill

- **Ask for shorter answers when you can.** A length limit, a format such as bullet points or "answer in two sentences", or a JSON field list can cut output sharply. If answers keep stopping mid-sentence, see [why AI answers get cut off](post:why-ai-answers-get-cut-off-max-output-tokens).
- **Do not cut input blindly.** Input is usually much larger than output, especially with long history or documents, so it can still be most of the bill. Compare both.
- **Watch long-running agents and reasoning models.** Output grows with thinking, while input grows with history. See [what an agent costs compared with a chatbot](post:ai-agent-vs-chatbot-vs-batch-cost).
- **Compare models on both prices.** A model with cheap input can lose on a task that produces long output. See [how to compare LLM API prices](post:compare-llm-api-prices).

## Try it with your numbers

Put your own input and output sizes into the [Cost Forecaster](tool:cost-forecaster) to see how each part adds up for a month. Browse current input and output prices side by side on [Model Prices](tool:model-prices), and count a real prompt and reply in the [Token Counter](tool:token-counter).

## Frequently asked questions

### Why do output tokens cost more than input tokens?

The usual explanation is that input is processed in parallel while output is generated one token at a time. Providers do not publish exact cost breakdowns, so pricing also reflects business choices.

### Is it always 3 to 5 times more?

No. In our data the median is 4 times, but it ranges from the same price to 20 times, depending on the model.

### Do reasoning tokens count as output?

Usually yes. Check your provider's documentation for how it bills thinking or reasoning tokens.

### Which is bigger on my bill, input or output?

It depends on your use. Long documents and chat history make input large. Long answers and reasoning make output large. Use the Cost Forecaster to see your split.

## Sources

- [Towards AI: What you are actually paying for in token prices](https://towardsai.com/p/machine-learning/every-token-you-send-is-a-geometry-problem-nobody-told-you-what-youre-actually-paying-for) (prefill and decode explanation)
- [CostHawk: Input vs output tokens](https://costhawk.ai/glossary/input-vs-output-tokens)
- [Fast.io: OpenAI max output tokens](https://fast.io/resources/openai-max-output-tokens/) (reasoning tokens in the output budget)
- Price ratios: calculated from our own price list, which comes from the LiteLLM community price list.
