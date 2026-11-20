---
title: What Does an LLM Failover Cost?
description: A worked example of the extra token bill when traffic moves to a backup model during an outage, for 1, 12 and 48 hours, with the method to run your own.
date: 2026-11-20
image: /assets/blog/what-does-an-llm-failover-cost-hero.jpg
imageAlt: Traffic switching from a main model to a backup model with a small cost marker
tools: failover-cost-estimator, cost-forecaster, model-prices
related: microsoft-outage-llm-app-fallback, estimate-monthly-cost-of-an-llm-chatbot
---
If your main model goes down and your app switches to a backup, the token bill for those hours is usually the smallest part of the cost. It is still worth knowing, because it tells you whether a backup is cheap to keep ready. This post works through one example and shows how to run your own.

[[toc]]

## The method

1. Take your monthly requests and spread them evenly over 730 hours in a month.
2. Multiply by the hours of the outage and the share of traffic you move to the backup. That is the number of requests that run on the backup.
3. Price one request on each model: input tokens times the input price, plus output tokens times the output price, divided by a million.
4. The extra cost is the number of moved requests times the difference between the two per-request prices.

The [Failover Cost Estimator](tool:failover-cost-estimator) does these steps for you and ranks other backups by the same measure.

## A worked example

The numbers below use prices from our list dated 18 November 2026. Prices change, so rerun it with current ones.

- **Usage:** 100,000 requests a month, each with 2,000 input and 500 output tokens.
- **Main model:** claude-sonnet-5-5, listed at $2 input and $10 output per million tokens, so $0.009 a request and about $900 a month.
- **Backup:** gpt-5.4, listed at $2.50 input and $15 output per million tokens, so $0.0125 a request.

| Outage length | Requests moved | Extra token cost |
| --- | --- | --- |
| 1 hour | about 137 | about $0.48 |
| 12 hours | about 1,644 | about $5.75 |
| 48 hours | about 6,575 | about $23.01 |

These are estimates under a simple assumption: traffic is even, and requests that fail on the main model are not billed. Even the 48-hour case adds about 2.6% to a month's bill in this example.

## What changes the answer

- **The size of the price gap.** A backup that costs twice as much per request doubles the extra cost, but only for the hours it is used.
- **Peak traffic.** If the outage hits your busiest hour, more requests move than the average. Raise the hours or the share to test it.
- **Token counts.** Models count tokens differently, so the same text can cost more or less on the backup. See [why token counts differ between models](post:why-token-counts-differ-between-models).
- **Caching.** If you rely on cached prompts, the backup may start with a cold cache. Read [how caching and batch discounts work](post:prompt-caching-and-batch-discounts-explained).

## A cheaper backup is not automatically better

On the same example, the cheapest small models on our list would lower the token bill during the outage. That says nothing about whether their answers are good enough for your product. Test any backup on your own examples first, as in [cheapest vs best value](post:cheapest-llm-vs-best-value-test-before-you-switch).

To see how long real outages have lasted, which helps you choose the hours to test, read the [ChatGPT and Claude outage history and cost](post:llm-outage-history-and-cost). For the wider plan, including circuit breakers and rehearsals, see [how to add a fallback to an LLM app](post:microsoft-outage-llm-app-fallback).

## Frequently asked questions

### How much does it cost to run on a backup LLM during an outage?

It is the number of requests moved times the price difference per request between the backup and the main model. In the worked example above, a 12-hour outage added about $5.75 on a roughly $900 month. Your figure depends on your prices and traffic.

### Do I pay for a backup model I am not using?

With most pay-as-you-go APIs, you pay only for tokens used, but check your provider for minimum fees or reserved capacity.

### Is the token bill the main cost of an outage?

Usually not. Lost sales, support load and engineering time are often larger. The token bill is the part you can estimate precisely.
