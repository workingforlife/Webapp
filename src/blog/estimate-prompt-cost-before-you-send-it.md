---
title: Estimate Prompt Cost Before You Send It
description: A four-step method to price a prompt before you send it: count the tokens, guess the reply, apply the rates and multiply by volume.
date: 2026-11-26
image: /assets/blog/estimate-prompt-cost-before-you-send-it-hero.jpg
imageAlt: Four steps from counting tokens to a monthly cost
tools: prompt-cost-compare, token-counter, cost-forecaster
related: how-many-tokens-is-my-text, estimate-monthly-cost-of-an-llm-chatbot
---
Checking what a prompt will cost before you send it takes a minute and avoids surprises. This guide gives a four-step method, a worked example, and the places where an estimate can go wrong.

[[toc]]

## The four steps

1. **Count the input tokens.** Paste the prompt into the [Token Counter](tool:token-counter). The count is exact for OpenAI tokenizers and an estimate for other providers. Include everything you send: the system prompt, any examples and the user message.
2. **Guess the output tokens.** Think about the length of the reply you expect. Count reasoning tokens as output if your model uses them.
3. **Apply the rates.** Providers price input and output separately, per million tokens. Cost per request = input tokens times the input price, plus output tokens times the output price, divided by a million.
4. **Multiply by volume.** Requests per day or month times the cost per request.

## A worked example

Say a prompt has 1,500 input tokens and you expect a 400-token reply. On a model priced at $2 per million input tokens and $10 per million output tokens, the arithmetic is:

- Input: 1,500 × $2 ÷ 1,000,000 = $0.003
- Output: 400 × $10 ÷ 1,000,000 = $0.004
- Per request: $0.007
- At 50,000 requests a month: $350

The prices here are for illustration, not a real model. The [Prompt Cost Compare](tool:prompt-cost-compare) tool does the same sum for every model on our daily price list.

## Where estimates go wrong

- **Different tokenizers.** The same text can have a different count on each provider. Newer models from the same provider can also count differently. See [why token counts differ](post:why-token-counts-differ-between-models).
- **Text that tokenizes badly.** Minified JSON, code and some non-English text are harder to estimate. See [how many tokens code, JSON and Hindi use](post:how-many-tokens-do-code-json-and-hindi-use).
- **A wrong reply length.** Output costs more per token, so a guess that is off by half moves the total.
- **Chat history.** A chatbot re-sends the conversation each turn, so cost grows faster than the number of messages. Use the [Cost Forecaster](tool:cost-forecaster) for chatbots and agents.
- **Discounts and extras.** Caching and batch discounts lower the bill, and tools or retries raise it. See [prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained).

## Check against a real bill

After a few days of real use, compare your estimate with the usage figures your provider reports. Adjust your token counts and reply length to match.

## Frequently asked questions

### How do I calculate the cost of a prompt?

Multiply input tokens by the input price and output tokens by the output price, each per million tokens, and add them. Then multiply by the number of requests.

### How accurate is a token estimate?

It is exact only when the tool uses the same tokenizer as your model, which is possible for OpenAI. For other providers it is an estimate and can be off. In our test of 32 sample texts the estimate was off by about 8% on average against OpenAI's tokenizers, and the one text outside its range was romanized Hindi. We did not test Claude or Gemini tokenizers.

### Do I pay for the prompt and the reply?

Yes. Input and output tokens are billed separately, usually at different rates.

## Sources

- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- [Anthropic: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (separate input and output prices, prompt caching multipliers, 50% Batch API discount)
- [Google: Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) (input and output prices, context caching, 50% batch reduction)
- [Anthropic: Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)
- [Google: Understand and count tokens](https://ai.google.dev/gemini-api/docs/interactions/tokens)
- Worked example: made-up round numbers, shown only to demonstrate the arithmetic.
