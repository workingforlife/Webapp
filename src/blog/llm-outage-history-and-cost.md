---
title: ChatGPT and Claude Outage History and Cost
description: A dated timeline of ChatGPT, Claude and cloud outages that hit AI apps, how long each lasted, and an estimate of what the downtime cost.
date: 2026-11-20
image: /assets/blog/llm-outage-history-and-cost-hero.jpg
imageAlt: A timeline of dated outage markers from 2023 to 2026 with durations
tools: failover-cost-estimator, cost-forecaster, model-picker
related: what-does-an-llm-failover-cost, real-cost-of-an-llm-outage
---
Large language model (LLM) services go down more often than most teams plan for. Some outages are short bursts of errors, and a few last most of a working day. This post lists notable ones with dates and durations, explains what usually causes them, and estimates what they cost. Where no exact figure exists, we calculate one and show the assumptions, so you can swap in your own numbers.

[[toc]]

## The short answer

Yes, outages and disruptions are routine. In December 2024, TechCrunch noted that such outages "typically" last only an hour or two, and called a roughly six-hour one unusually long. Anthropic's status page listed 13 incidents in September 2026 alone, according to Unite.AI. Most are short. The ones that hurt are the multi-hour events, and the ones that come from a shared dependency such as a cloud region or a network provider.

"Outage" is used loosely. Status pages often record "elevated errors", where some requests fail and others work, and not complete downtime. The durations below are as reported by the provider's status page or the press.

## Timeline of notable incidents

| Date | What happened | Reported duration | Cause, as reported |
| --- | --- | --- | --- |
| 8 Nov 2023 | OpenAI reported a major outage across ChatGPT and its APIs | Not stated here | Cause unclear at the time |
| 23 May 2024 | Bing's search API failed, disrupting Copilot, ChatGPT's internet features, DuckDuckGo and Ecosia | Several hours, about five by one account | Failure in Bing's search API |
| 11 Dec 2024 | ChatGPT, Sora and the OpenAI API disrupted | About three hours to restore all services | A new telemetry service overloaded Kubernetes API servers |
| 26 Dec 2024 | ChatGPT, Sora and many APIs saw error rates above 90% | APIs back by about 3:11 pm PT after a 10:40 am start, ChatGPT by 6:20 pm | Power failure at a cloud provider data center |
| 20 Oct 2025 | AWS us-east-1 disruption that also hit AI services such as Perplexity | Nearly 15 hours | DNS failure |
| 18 Nov 2025 | Cloudflare outage that affected ChatGPT, Sora and Claude, among many sites | About five and a half hours | An internal configuration problem, not an attack |
| 22 May 2026 | Elevated errors across several Claude models | 4.6 hours | Not stated |
| 8 Jul 2026 | Elevated errors on some Claude models | About two hours (10:45 am to 12:40 pm PT) | Not stated |
| 3 Sep 2026 | ChatGPT, Codex, Claude and Grok disrupted around the same time | Grok's status page showed 3 hours 37 minutes | Not confirmed. See below |
| 29 Sep 2026 | Elevated errors across ChatGPT, Codex, the API and the Agents API | About 5.4 hours | Not stated |
| 12 Nov 2026 | Microsoft outage affecting Outlook, Teams and Copilot | See our [Microsoft outage guide](post:microsoft-outage-llm-app-fallback) | Cascading failure, per Microsoft |

On the September 2026 event, Forrester wrote that OpenAI pointed to a routing error and xAI cited an outage at its Memphis compute center, and that "no shared root cause has been confirmed". Some reports suggested a shared Azure dependency, but that is speculation.

## What the pattern shows

- **Many outages start outside the model provider.** A data center power failure, a cloud region, a DNS fault, a content delivery network and a search API all appear above.
- **Deploys and configuration changes are common triggers.** The December 2024 and November 2025 incidents both began with a change inside the provider's own systems.
- **Providers can fail together.** A shared cloud or network layer can take down several at once, so a backup on the same platform may not help.
- **Duration varies a lot.** From minutes to most of a day. Plan for a few hours as a reasonable test case, and a full day as a stress test.

## What outages cost: published figures

There are no published figures for the cost of an LLM outage to customers as a group, and providers do not share their own losses. Two kinds of figures exist, and they are not specific to AI.

- **Downtime surveys.** ITIC's 2024 survey of over 1,000 firms found that an hour of downtime costs more than $300,000 for over 90% of mid-size and large enterprises, and that 41% of enterprises put it at $1 million to over $5 million. These are all-cause IT downtime costs, so treat them as an upper reference, not an AI figure.
- **Estimates for one big cloud outage.** For the AWS outage on 20 October 2025, Parametrix estimated US losses at $500 million to $650 million, and CyberCube estimated $38 million to $581 million in insured losses. Other commentators claimed billions, and one quoted hundreds of billions. The spread shows how soft these numbers are.

## How to estimate your own cost

Use this simple method, and change every number to match your business.

1. **Hourly cost of a full outage.** What a complete stop would cost per hour: lost sales, idle staff, penalties.
2. **LLM-dependent share.** The part of that activity that relies on the model. We assume 10% below.
3. **Unrecovered share.** The part that is lost for good, not just delayed. We assume 50% below.
4. **Cost per hour** = step 1 times step 2 times step 3. Multiply by the hours of the outage.

For a small business, we assume a $10,000 hourly cost for a full stop. For a mid-size or large firm we use the $300,000 ITIC benchmark, and for the large end the $1 million lower bound of its top bracket. These are assumptions for illustration, not measurements.

| Outage | Hours | Small business | Mid-size or large | Large, top bracket |
| --- | --- | --- | --- | --- |
| OpenAI APIs, 26 Dec 2024 | 4.5 | $2,250 | $67,500 | $225,000 |
| OpenAI, 29 Sep 2026 | 5.4 | $2,700 | $81,000 | $270,000 |
| ChatGPT, 26 Dec 2024 | 7.7 | $3,850 | $115,500 | $385,000 |
| AWS us-east-1, Oct 2025 | 15 | $7,500 | $225,000 | $750,000 |

Rows use the durations in the timeline, rounded. Cost per outage hour in this model is $500, $15,000 and $50,000 for the three columns.

## The token bill is the small part

If you move traffic to a backup model, the extra token cost is usually tiny next to those figures. In the example from [what an LLM failover costs](post:what-does-an-llm-failover-cost), a 12-hour outage added about $5.75 on a roughly $900 month. A 15-hour outage in the same example would add about $7. The money at risk is in the lost work, not the tokens.

## What to do with this

1. Decide how many hours of outage your product can absorb, using your own version of the table above.
2. Pick a backup from a different provider and platform. See [how to choose a backup LLM](post:choose-a-backup-llm-for-outages).
3. Price the outage window with the [Failover Cost Estimator](tool:failover-cost-estimator).
4. Read the wider checklist in [the real cost of an LLM outage](post:real-cost-of-an-llm-outage), and the failover steps in [how to add a fallback to an LLM app](post:microsoft-outage-llm-app-fallback).

## Frequently asked questions

### Has ChatGPT ever had a major outage?

Yes. On 26 December 2024, ChatGPT, Sora and many OpenAI APIs saw error rates above 90%, with APIs recovering after about four and a half hours and ChatGPT after about seven and a half. OpenAI attributed it to a power failure at a cloud provider's data center.

### How often do Claude and ChatGPT go down?

Often, but mostly briefly. Anthropic's status page listed 13 incidents in September 2026. Many are partial and short, so check the provider's status page for the current record.

### How long do LLM outages usually last?

TechCrunch noted in December 2024 that they typically last an hour or two. Longer ones in the table above ran from about four and a half hours to nearly 15 for the AWS region outage.

### How much does an LLM outage cost?

It depends on how much of your business relies on the model. Published figures are for IT downtime in general, such as ITIC's over $300,000 an hour for most mid-size and large firms. The table above shows a transparent way to estimate yours.

### Do multiple AI providers fail at once?

Sometimes. In September 2026, ChatGPT, Claude and Grok were disrupted around the same time. No shared cause was confirmed, so test a backup on a different platform where you can.

## Sources

- [TechCrunch: ChatGPT and Sora went down for the second time this month](https://techcrunch.com/2024/12/26/chatgpt-and-sora-went-down-for-the-second-time-this-month)
- [TechCrunch: OpenAI blames its massive ChatGPT outage on a new telemetry service](https://techcrunch.com/2024/12/13/openai-blames-its-massive-chatgpt-outage-on-a-new-telemetry-service)
- [OpenAI status page write-up, 26 December 2024](https://status.openai.com/incidents/6bwlxnvdncnm/write-up)
- [Search Engine Journal: OpenAI blames cloud provider for ChatGPT outage](https://searchenginejournal.com/openai-blames-cloud-provider-for-chatgpt-outage/536650)
- [The Register: OpenAI tackles major outage hitting ChatGPT APIs](https://www.theregister.com/2023/11/08/outage_chatgpt_openai_claude/)
- [ITPro: Microsoft's precarious AI ecosystem laid bare](https://www.itpro.com/software/microsoft/microsofts-precarious-ai-ecosystem-laid-bare-in-wake-of-major-service-outage)
- [Uptime Institute: AWS outage lessons for enterprises](https://intelligence.uptimeinstitute.com/resource/aws-outage-what-are-lessons-enterprises)
- [SiliconANGLE: Cloudflare outage takes ChatGPT, Claude offline](https://siliconangle.com/2025/11/18/cloudflare-outage-briefly-takes-chatgpt-claude-services-offline/)
- [IsDown: Anthropic elevated errors, May 2026](https://isdown.app/status/anthropic/incidents/593129-elevated-error-rate)
- [Claude status: elevated errors, 8 July 2026](https://status.claude.com/incidents/dcxc66flmxbd)
- [IsDown: OpenAI elevated errors, 29 September 2026](https://isdown.app/status/openai/incidents/662418-elevated-errors-across-chatgpt-codex-and-the-api)
- [Unite.AI: Anthropic reports service disruption, 29 September 2026](https://unite.ai/anthropic-reports-service-disruption-across-claude-ai-code-cowork-and-api)
- [Computing: Azure failure likely brought down ChatGPT, Claude and Grok](https://www.computing.co.uk/news/2026/azure-failure-likely-brought-down-chatgpt-claude-and-grok)
- [Forrester: The triple AI outage is a wake-up call for enterprises](https://www.forrester.com/blogs/the-triple-ai-outage-is-a-wake-up-call-for-enterprises/)
- [ITIC 2024 Hourly Cost of Downtime survey](https://itic-corp.com/?p=3152)
- [Parametrix: AWS us-east-1 outage estimate](https://www.parametrixinsurance.com/reports-white-papers/aws-us-east-1-outage---what-parametrix-monitored-in-real-time)
- [Risk & Insurance: CyberCube AWS loss estimate](https://riskandinsurance.com/aws-outage-loss-estimates-range-from-38m-to-581m-as-cyber-insurers-face-moderate-impact/)
