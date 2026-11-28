---
title: Prompt Caching and Batch Discounts Explained
description: Two ways to cut your AI API bill without changing the model: caching repeated prompt text and batching non-urgent work. How each works, with an example.
date: 2026-11-19
updated: 2026-11-28
image: /assets/blog/prompt-caching-and-batch-discounts-explained-hero.jpg
imageAlt: A repeated prompt prefix read from cache at a lower price
tools: cost-forecaster, model-prices, token-counter
related: cut-your-llm-bill, ai-agent-vs-chatbot-vs-batch-cost
---
Two discounts can lower an AI API bill without changing the model or the answer quality: prompt caching, which makes repeated prompt text cheaper to read, and batch processing, which halves the price of work that can wait. This guide explains how each works, what the published terms are, how to estimate the savings and when they do not apply.

[[toc]]

## Prompt caching in plain terms

Many requests start with the same text: a long system prompt, reference documents, tool definitions. With prompt caching, the provider stores that shared start (the prefix) so later requests that begin with the same text can be billed at a lower rate for that part.

Anthropic's documentation gives the multipliers as a share of the normal input price:

- 5-minute cache write: 1.25 times the base input price
- 1-hour cache write: 2 times the base input price
- Cache read: 0.1 times the base input price

So the first request that stores the prefix costs a little more, and later requests that reuse it cost about a tenth. The same documentation says these multipliers stack with the batch discount.

Other providers do this differently. Some charge nothing extra to store the prefix and give a smaller discount on reads, and some apply it automatically. The read price also differs by model. In our price list, 169 of 207 models have a cache read price, and for 103 of them it is one tenth of the input price. The rest range from about 2 percent to 50 percent. Check the model you use on [Model Prices](tool:model-prices) and in the provider's docs.

## A worked example for caching

Suppose a model costs $2 per million input tokens, and every request starts with the same 2,000-token system prompt. You send 10,000 requests in an hour, so the cache stays warm. These numbers are illustrative.

| | Tokens at the prompt prefix | Cost |
|---|---|---|
| No caching: 10,000 requests × 2,000 tokens | 20 million | $40.00 |
| First request writes the cache (1.25 times) | 2,000 | $0.005 |
| Other 9,999 requests read it (0.1 times) | about 20 million | about $4.00 |
| With caching, prefix cost in total | | about $4.00 |

The prefix cost falls by about 90 percent. Your user messages and the model's output are billed as normal, so the saving on the whole bill is smaller than 90 percent. It depends on how much of each request is the repeated part.

## When caching helps, and when it does not

- **It helps** when a long, identical prefix is sent again and again: chatbots with a big system prompt, document question and answer, and agents that re-send tool definitions.
- **It helps less** when each request is mostly new text, because only the shared start is cached.
- **It can cost more** if a prefix is written to the cache and never reused. A 5-minute write at 1.25 times pays back after one read, because one write plus one read costs 1.35 times the normal price against 2 times without caching.
- **It expires.** The cache has a short lifetime, 5 minutes by default on Anthropic, so sparse traffic may find it gone. Each use usually keeps it warm. Longer lifetimes cost more to write.
- **The text must match exactly,** starting from the very first token. Put stable text first and anything that changes, such as the user's question, last.

## Batch processing

Batch APIs let you submit many requests at once and collect the results later, instead of waiting for each answer. In return, you pay less.

- **OpenAI:** its Batch API documentation describes a 50 percent cost discount compared with synchronous APIs, with a clear 24-hour turnaround.
- **Anthropic:** its Message Batches API documentation says all usage is charged at 50 percent of standard API prices, and that most batches finish within an hour. A batch can take up to 24 hours, and expires if it is not finished in that time.

Other providers offer similar options. Check each one's current terms, as limits, supported models and prices change.

## What suits batch work

Good fits are jobs that nobody is waiting for: classifying a backlog of tickets, summarising a library of documents, running evaluations, generating descriptions overnight.

Poor fits are anything a person is waiting on, such as a live chat, or work where a late result is a problem. Batches also tend to be limited in features compared with live calls, so check what your provider supports. Streaming, for example, does not apply when you collect results later.

## Combining the two

Because the discounts stack on Anthropic, a large batch of requests with a shared prefix can use both. Anthropic's docs also suggest the 1-hour cache option for batches, since batches can take longer than the 5-minute default.

For a quick sense of scale, using the example above: halving the cached prefix cost of about $4.00 would give about $2.00, and halving the uncached remainder of your bill would apply on top. Use real numbers for your own case rather than this illustration.

## Check the savings for your case

The [Cost Forecaster](tool:cost-forecaster) lets you switch caching on and enter a batch discount, so you can see the effect on a monthly bill for a chatbot, an agent or a batch job. Count your real system prompt in the [Token Counter](tool:token-counter) first, since the size of the repeated part drives the result. For the wider list of savings, see [seven ways to cut your LLM bill](post:cut-your-llm-bill). To see what repeated examples cost before caching, see [what few-shot examples cost in tokens](post:what-few-shot-examples-cost-in-tokens).

## Frequently asked questions

### How much does prompt caching save?

On Anthropic, a cache read is priced at 0.1 times the base input price for most models, so the repeated part can cost about 90 percent less, after a small extra charge to write it. The saving on your whole bill depends on how much of each request repeats.

### Does caching change the answers?

No. Caching changes how the repeated part of the prompt is billed and processed, not what the model is asked.

### Is the batch discount always 50 percent?

OpenAI and Anthropic both document 50 percent. Other providers and models can differ, so check the current terms before you plan around it.

### Can I use both together?

On Anthropic, yes: its documentation says the caching multipliers stack with the batch discount. Check the terms of any other provider you use.

## Sources

- [Anthropic: Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Anthropic: Batch processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
- [OpenAI: Batch API guide](https://developers.openai.com/api/docs/guides/batch)
- [OpenAI: Batch API FAQ](https://help.openai.com/en/articles/9197833-batch-api-faq)
- Cache read price shares: calculated from our own price list, which comes from the LiteLLM community price list.
