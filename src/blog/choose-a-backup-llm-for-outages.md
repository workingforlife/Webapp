---
title: How to Choose a Backup LLM for Outages
description: Five checks for picking a fallback model: a different provider, enough context, similar output, enough rate limit and a bill you can predict.
date: 2026-11-20
updated: 2026-11-21
image: /assets/blog/choose-a-backup-llm-for-outages-hero.jpg
imageAlt: A checklist beside a main model and a backup model
tools: failover-cost-estimator, model-picker, model-prices
related: microsoft-outage-llm-app-fallback, choose-an-llm-for-your-budget
---
A backup model only helps if it works on the day you need it. Price matters, but it is one of five things to check. This guide goes through them in the order that tends to catch problems earliest.

[[toc]]

## 1. A different provider, or at least a different region

A failover to a model on the same platform can fail for the same reason as the main one. Past incidents show shared causes such as cloud regions and network providers, as in our [outage history](post:llm-outage-history-and-cost). Where you can, pick a backup from another provider. Our [Model Prices](tool:model-prices) page lists models from several, which makes it easy to see your options.

## 2. Enough context for your real requests

A backup with a smaller context window may reject your longest prompts. Compare your biggest request, input plus output, with the window. The [Failover Cost Estimator](tool:failover-cost-estimator) only lists backups that can hold the request you enter, and warns if the one you picked cannot.

## 3. Output you can use

Different models format answers differently. If your app expects JSON or a fixed layout, test it on the backup. See [getting reliable JSON from an LLM](post:reliable-json-from-llm). Keep prompts portable so that moving them needs few changes.

## 4. Rate limits and quotas you have already checked

A new account often starts with low limits. A backup that cannot take your traffic spreads the problem instead of solving it. Check limits and raise them before an outage, and rehearse the switch.

## 5. A bill you can predict

Price the outage window on the backup. The estimator shows the extra cost per outage and per year, and ranks other backups, so you can see what a more expensive backup would add. A cheaper backup lowers the token bill but may lower quality, so test it before you rely on it.

## A short routine

1. Shortlist two or three models from other providers with the [Model Picker](tool:model-picker).
2. Check context and output format on your real examples.
3. Raise rate limits on the backup account.
4. Run the estimator for a 1-hour and a 12-hour outage.
5. Rehearse the failover and write down who flips the switch.

## Frequently asked questions

### What makes a good backup LLM?

A different provider, a context window that fits your requests, output your app can parse, enough rate limit, and a cost you have estimated.

### Should the backup be as good as the main model?

That depends on the product. Some teams accept lower quality for a few hours, others do not. Test on your own examples and decide what is acceptable before an outage, not during one.

### Can I use a cheaper model as the backup?

Yes, if its answers are good enough. It lowers the token bill during the outage, but the quality drop is a cost of its own.

## Sources

- [Anthropic Help: Our approach to rate limits for the Claude API](https://support.claude.com/en/articles/8243635-our-approach-to-rate-limits) (new organizations may start in an Evaluation tier with lower limits)
- [OpenAI: Rate limits](https://developers.openai.com/api/docs/guides/rate-limits) (limits depend on your usage tier and rise as spend grows)
- [Claude status](https://status.claude.com/) (incident history)
- [OpenAI status](https://status.openai.com/) (incident history)
- [OpenAI status page write-up, 26 December 2024](https://status.openai.com/incidents/6bwlxnvdncnm/write-up)
- [Search Engine Journal: OpenAI blames cloud provider for ChatGPT outage](https://searchenginejournal.com/openai-blames-cloud-provider-for-chatgpt-outage/536650)
- [Anthropic: Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) (each turn accumulates in the window, input and output both count toward it)
