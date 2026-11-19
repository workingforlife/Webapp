---
title: Microsoft Outage: What It Means for LLM Apps
description: Microsoft's November 2026 outage spread through a cascading failure. See what Microsoft says happened and how to add a fallback model to your LLM app.
date: 2026-11-13
updated: 2026-11-19
image: /assets/blog/microsoft-outage-llm-app-fallback-hero.jpg
imageAlt: An app routing traffic to a backup provider after the main provider fails
tools: cost-forecaster, token-counter, model-prices
related: estimate-monthly-cost-of-an-llm-chatbot, compare-llm-api-prices
---
On 12 November 2026, a major Microsoft outage disrupted Outlook, Teams, Copilot and other services in many countries. If you build products on large language models (LLMs), the useful question is not who was at fault but how your own app would cope if a provider or platform it depends on failed for several hours. This guide explains how failures spread, where LLM apps are exposed, how to add a fallback, and what a fallback costs.

> **Updated 19 November 2026.** Microsoft has published a preliminary post-incident report, and this article now follows it. The final report is still due, so details may change. We describe only what Microsoft and news outlets have reported.

[[toc]]

## What caused the outage

The outage began at 16:20 UTC on 12 November 2026 and active impact ended at 16:10 UTC on 13 November, according to Microsoft's report as summarised by [IBTimes UK](https://www.ibtimes.co.uk/microsoft-365-outage-dormant-software-defect-1832656). Exchange Online was hit hardest. Microsoft said it was not aware of a cyberattack, and an executive said there was no indication of malicious activity, as reported by [CyberSecurityNews](https://cybersecuritynews.com/microsoft-365-massive-outage-fixes-fail-as-restored-servers-keep-going-unresponsive/). [Al Jazeera](https://www.aljazeera.com/news/2026/11/13/microsoft-hit-by-global-outages-what-happened-and-why) reported that tools relying on Microsoft services, including ones used by OpenAI and Anthropic, were also disrupted.

Microsoft's preliminary post-incident report, dated 15 November, says three things came together. [BleepingComputer](https://www.bleepingcomputer.com/news/microsoft/microsoft-says-months-old-bug-caused-global-microsoft-365-outage/), [365Fanatic](https://www.365fanatic.com/m365-outage-12-november-2026/) and [ITPro](https://www.itpro.com/software/microsoft/microsoft-365-outage-company-exec-lifts-lid-on-the-cascading-failure-that-caused-lengthy-disruption) describe them like this:

1. **A latent defect.** A bug in a fix prepared for Microsoft's networking gateway servers made servers overload and stop responding under certain load. The fix began rolling out in July 2026 and ran for more than three months without issues. Microsoft says its test labs used different traffic and hardware, so testing missed it.
2. **A load surge.** About 15 hours before the outage, Teams automatically failed over from an alternative gateway to the primary gateway, which also serves Exchange Online. That raised the load and changed the traffic patterns on it.
3. **Reduced capacity.** About 14% of the gateway's server capacity was out of service because of an unrelated issue. Microsoft says there was enough spare capacity, so this had no effect on its own.

Together, these triggered the defect during the busiest US traffic period. Requests piled up until servers stopped responding. Traffic management moved users to healthy servers, but the defect hit those too. Within two hours it had spread across the fleet, and at its lowest point more than 80% of servers were unresponsive. Teams, OneDrive and SharePoint could move away from the faulty gateway and recovered earlier, but Exchange Online could not, for scale reasons.

Microsoft's account changed as the incident went on. At first it said it had not identified any recent change linked to the start of the impact. Later it pointed to a network configuration change and a process that sets up secure connections being overwhelmed, and on 13 November it said the incident was introduced by an issue during an earlier network capacity upgrade ([AzureBlog](https://azureblog.co.uk/posts/microsoft-365-outage-12-november-2026/), [TechRadar's live blog](https://www.techradar.com/news/live/outlook-outage-nov-2026)). The preliminary report replaces that early explanation.

Two limits apply. We have not seen the report itself, because Microsoft shares it in its admin center, so the details here come from the outlets above. And it is preliminary: Microsoft says a final report will follow within five business days of full resolution, and it lists 20 November as the target for a full list of repair actions.

## Why one failure can become many

An outage that starts small can grow through a pattern called a **cascading failure**. It works like this:
1. A few servers in a group fail.
2. Their traffic shifts to the servers that are still working.
3. Those servers now carry more load than they were built for, so some fail too.
4. The load shifts again, and the failure spreads.

Recovery can be hard for the same reason. If you bring a server back while all the waiting traffic hits it at once, it can fail again straight away. Engineers deal with this by limiting traffic, bringing capacity back gradually and rerouting. Microsoft's preliminary report describes this pattern: traffic moved away from failing servers made the same problem more likely on the ones that were left, and servers brought back were quickly overwhelmed again by backed-up traffic. Microsoft's fix was applied to part of the capacity first, and servers were returned to service in batches.

A cascade also needs a trigger. In this case the report points to three things lining up, and it says the spare capacity was enough without the other two. So the lesson is not simply "have bigger backups". It is that a hidden defect, a failover and a capacity dip can combine in ways that no single test shows.

The lesson for your own app is the same one: a failure in one place can become a failure everywhere if nothing limits it.

## Where LLM apps are exposed

An app that calls a model API usually depends on more than the model:
- **One provider.** If your app calls a single provider and that provider is down, your feature is down.
- **Hidden platform dependencies.** A provider may rely on a cloud platform, an identity service or a routing layer you never see. A problem there can reach you even if the model itself is fine.
- **One region.** A single region is a single point of failure.
- **A failover that moves the problem.** In this incident, a normal Teams failover raised the load on a shared gateway about 15 hours before the outage. When you switch traffic to a backup, check that the backup can take it.
- **A dependency with no alternative path.** Exchange Online could not move off the faulty gateway, while other services could. If part of your app has no alternative, plan a degraded mode for it.
- **Retries that make things worse.** If every client retries immediately, a struggling service gets even more traffic.
- **No degraded mode.** Many apps either work fully or show an error.

## How to add a fallback

You do not need a perfect design. These steps cover most of the risk.

1. **Set timeouts.** Decide how long you will wait for a reply, so a slow provider does not hang your whole app.
2. **Retry with backoff and jitter.** Wait longer after each failed attempt and add a small random delay, so your clients do not all retry together.
3. **Use a circuit breaker.** After several failures in a row, stop calling the failing provider for a short time and switch to the fallback, then test the main provider again later.
4. **Choose a second provider or model.** Pick one from a different company, ideally on a different cloud platform, so one outage is less likely to hit both.
5. **Degrade gracefully.** When no model is available, show a cached answer, queue the request for later or switch to a simpler feature, instead of an error page.
6. **Keep prompts portable.** Different models format output differently and count tokens differently. Test your prompts and your JSON output on the fallback before you need it. See [getting reliable JSON from an LLM](post:reliable-json-from-llm).
7. **Rehearse the failover.** Turn off the main provider in a test and confirm that the fallback works, with its own keys, limits and quotas. Check that it can carry your real traffic and not only a test request, since a failover that overloads the backup spreads the problem.

## What a fallback costs

Most pay-as-you-go model APIs charge per token, so a standby model usually costs nothing until traffic actually reaches it. The real costs are the work of testing your prompts on it and any rate limits on a new account, which are often low until you build up usage. When a failover does happen, the price of the backup model decides your bill. Here are the newest Anthropic and OpenAI models from our price data, which updates daily.

[[api-prices Anthropic]]

[[api-prices OpenAI]]

To estimate the bill for a failover period, count your prompt with the [Token Counter](tool:token-counter), then enter the volume in the [Cost Forecaster](tool:cost-forecaster). You can compare more providers on [Model Prices](tool:model-prices). For a fuller method, see [how to estimate the monthly cost of an LLM chatbot](post:estimate-monthly-cost-of-an-llm-chatbot).

## A short checklist

- Do you know which providers and platforms your app depends on?
- Does every model call have a timeout?
- Do your retries use backoff and jitter?
- Is there a second provider with working keys and quotas?
- Have you tested your prompts and output format on the fallback?
- What does your app show when every model is unavailable?

## Frequently asked questions

### What caused the November 2026 Microsoft outage?

According to Microsoft's preliminary post-incident report, three things came together: a latent defect in a fix for its networking gateway servers, a load surge after Teams failed over to the gateway that Exchange Online uses, and reduced server capacity from an unrelated issue. The final report is still due, so details may change.

### Was it a cyberattack?

Microsoft said it was not aware of a cyberattack, and an executive said there was no indication of malicious activity. Its report describes a software defect and a load problem.

### Did the backup servers fail because they were too small?

Not according to Microsoft. It says there was enough spare capacity on its own. The failure came from the defect, the extra load and the capacity dip together, and a separate issue stopped the spread from being contained.

### What is a cascading failure?

It is a failure that spreads. When some servers fail, the ones left carry more load and can fail too, so a small problem grows into a large one.

### Do I need two providers for my LLM app?

Not always. It depends on what an outage would cost you. If your feature is important, a second provider is the most direct protection. If it is not, timeouts, sensible retries and a clear error message may be enough.

### Will a fallback model double my costs?

Usually not. Pay-as-you-go APIs charge for what you use, so the backup model only costs money when requests are sent to it. Testing and setup take time, though, and you should check the backup's rate limits.

## Sources

- [CyberSecurityNews: Microsoft 365 massive outage, fixes fail as restored servers keep going unresponsive](https://cybersecuritynews.com/microsoft-365-massive-outage-fixes-fail-as-restored-servers-keep-going-unresponsive/)
- [Al Jazeera: Microsoft hit by global outages, what happened and why](https://www.aljazeera.com/news/2026/11/13/microsoft-hit-by-global-outages-what-happened-and-why)
- [BleepingComputer: Microsoft says months-old bug caused global Microsoft 365 outage](https://www.bleepingcomputer.com/news/microsoft/microsoft-says-months-old-bug-caused-global-microsoft-365-outage/)
- [365Fanatic: Microsoft 365 outage of 12 and 13 November 2026](https://www.365fanatic.com/m365-outage-12-november-2026/)
- [ITPro: Microsoft 365 outage, exec lifts lid on the cascading failure](https://www.itpro.com/software/microsoft/microsoft-365-outage-company-exec-lifts-lid-on-the-cascading-failure-that-caused-lengthy-disruption)
- [IBTimes UK: Microsoft apologises for massive global outage](https://www.ibtimes.co.uk/microsoft-365-outage-dormant-software-defect-1832656)
- [AzureBlog: Microsoft 365 outage, 12 November 2026](https://azureblog.co.uk/posts/microsoft-365-outage-12-november-2026/)
- [TechRadar: Outlook outage live blog](https://www.techradar.com/news/live/outlook-outage-nov-2026)
- [Forbes: Microsoft outage, what happened and what to do next](https://www.forbes.com/sites/kateoflahertyuk/2026/11/13/microsoft-outage-what-happened-and-what-to-do-next/)
