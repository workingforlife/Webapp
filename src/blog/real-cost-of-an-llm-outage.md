---
title: The Real Cost of an LLM Outage
description: The token bill is the smallest part of an outage. Here is a checklist of what else it costs and a simple way to decide how much backup is worth it.
date: 2026-11-20
updated: 2026-11-21
image: /assets/blog/real-cost-of-an-llm-outage-hero.jpg
imageAlt: A small token cost beside larger blocks for lost sales, support and engineering time
tools: failover-cost-estimator, cost-forecaster
related: microsoft-outage-llm-app-fallback, what-does-an-llm-failover-cost
---
When teams ask what an outage costs, they often reach for the token bill. That is the part a calculator can estimate, and it is usually small. The rest is harder to measure but easier to feel. This post lists what to count, so you can decide how much backup is worth paying for.

[[toc]]

## What an outage can cost

- **Tokens on the backup.** The only part you can price exactly. Use the [Failover Cost Estimator](tool:failover-cost-estimator).
- **Lost or delayed work.** Requests that fail and are not retried, sales that did not happen, tasks that waited.
- **Support load.** More tickets and more time answering them.
- **Engineering time.** Switching, monitoring and cleaning up afterwards.
- **Trust.** Harder to count, and slower to repair.
- **Retries.** A retry storm against a struggling provider can make things worse. A circuit breaker helps, as described in [how to add a fallback to an LLM app](post:microsoft-outage-llm-app-fallback).

For dated examples and published downtime figures, see the [ChatGPT and Claude outage history and cost](post:llm-outage-history-and-cost), which also shows a worked estimate with every assumption stated.

## A simple way to think about it

1. Estimate the hours of outage you want to survive in a year. Use your provider's own incident history, not a guess.
2. Estimate what one hour of failed requests costs your business, in money or in effort.
3. Compare that with what keeping a backup costs: testing time, a second account and the token bill from the estimator.

If one hour of downtime costs far more than the backup, the backup is cheap insurance. If your app can wait, a simple retry may be enough. This is your call, and your numbers matter more than any rule of thumb here.

## Where the estimator fits

For the token part, enter your usage, your main and backup models and the outage length. For a normal month's bill, use the [Cost Forecaster](tool:cost-forecaster). For a worked example, see [what an LLM failover costs](post:what-does-an-llm-failover-cost).

## Frequently asked questions

### What does an LLM outage actually cost?

The token bill on a backup is usually small. Lost work, support load and engineering time are often larger, and they depend on your product.

### How do I decide whether a backup is worth it?

Compare what an hour of downtime costs you with what a ready backup costs to keep: testing, a second account and the extra token bill.

### Should I retry failed requests?

A few retries with a delay can help, but repeated retries against a failing provider can add load. Use a circuit breaker to switch instead.

## Sources

- [Claude status](https://status.claude.com/) (incident history)
- [OpenAI status](https://status.openai.com/) (incident history)
- [OpenAI status page write-up, 26 December 2024](https://status.openai.com/incidents/6bwlxnvdncnm/write-up)
- Cost components: our own reasoning and the worked example in our outage guides, not a published industry figure.
