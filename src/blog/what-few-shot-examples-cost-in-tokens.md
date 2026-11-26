---
title: What Few-Shot Examples Cost in Tokens
description: Every example in a prompt is paid for on every request. See how 750 extra tokens add up across models, and how to decide whether examples are worth it.
date: 2026-11-26
image: /assets/blog/what-few-shot-examples-cost-in-tokens-hero.jpg
imageAlt: A stack of example cards with a running token and cost counter
tools: prompt-cost-compare, cost-forecaster, token-counter
related: prompt-caching-and-batch-discounts-explained, cut-your-llm-bill
---
Examples in a prompt, often called few-shot examples, help a model copy a format or a style. They also add input tokens to every request you send. This post shows what that costs, using our 18 November 2026 price list, and how to decide whether they pay for themselves.

[[toc]]

## The cost is per request

Say you add five examples of about 150 tokens each. That is 750 extra input tokens. Every request carries them, so the cost is 750 times your volume times the input price. The reply does not change.

## A worked example

At 100,000 requests a month, the 750 extra tokens cost this much, using the lowest, median and highest input price among the 195 models in our list that can hold a 2,500-token request (specialised models excluded):

| Input price per million tokens | Extra cost per month |
| --- | --- |
| About $0.04 (lowest) | about $2.81 |
| About $1.25 (median) | about $93.75 |
| About $30 (highest) | about $2,250 |

Examples are close to free on a cheap model and expensive on a costly one, so the right number of examples depends on the model you use. Check your own case with the [Prompt Cost Compare](tool:prompt-cost-compare) tool by pasting the prompt with and without the examples.

## Are examples worth it?

Ask these questions:

1. **Does the output improve measurably?** Test with and without them on your own inputs. Count how many answers you would accept.
2. **Could fewer or shorter examples do the same?** Often two good examples work as well as six.
3. **Could instructions do the job?** A clear instruction can replace an example for simple formats.
4. **Is the model good enough to need fewer?** A stronger model may need fewer examples, which can offset its higher price.

## Ways to cut the cost

- **Cache the repeated part.** If the examples are identical across requests, providers that offer prompt caching bill repeated reads at a lower rate. See [prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained).
- **Trim the examples.** Remove filler and shorten them. See [how to cut your LLM bill](post:cut-your-llm-bill).
- **Measure the tokens.** Use the [Token Counter](tool:token-counter) to count the examples. The count is exact for OpenAI and an estimate for other providers.
- **Forecast the whole month.** The [Cost Forecaster](tool:cost-forecaster) turns a per-request cost into a monthly budget.

## Frequently asked questions

### Do few-shot examples increase cost?

Yes. They add input tokens to every request, and you are billed for them each time. The reply cost does not change.

### How many examples should I use?

As few as give the quality you need. Test with different numbers on your own inputs, and keep the smallest set that works.

### Can caching make examples cheaper?

If your provider supports prompt caching and the examples are identical across requests, repeated reads are billed at a lower rate. Check each provider's current terms.

## Sources

- [Anthropic: Multishot prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting) (a few good examples improve accuracy and consistency)
- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- [Anthropic: Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI: Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) (automatic for prompts of 1,024 tokens or more, cached input billed at a reduced rate)
- [LiteLLM: model_prices_and_context_window.json](https://github.com/BerriAI/litellm/blob/main/model_prices_and_context_window.json) (the community price list our catalog comes from)
- Prices and spreads: calculated from our own price list dated 18 November 2026, which comes from the LiteLLM community price list and is not verified against provider billing.
