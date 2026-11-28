---
title: Why AI Answers Get Cut Off: Token Limits
description: When an AI reply stops mid-sentence or returns broken JSON, a token limit is usually the cause. Learn the two limits, how to detect them and how to fix it.
date: 2026-11-22
updated: 2026-11-28
image: /assets/blog/why-ai-answers-get-cut-off-max-output-tokens-hero.jpg
imageAlt: An AI reply stopping mid-sentence at a token limit
tools: json-validator, token-counter, cost-forecaster
related: reliable-json-from-llm, context-windows-explained
---
An AI reply that stops in the middle of a sentence, or JSON that ends before the closing bracket, is often not a bug in the model. It is usually a token limit. This guide explains the two limits that cause it, how to spot it in your code, and how to fix it without paying for more than you need.

[[toc]]

## The two limits

1. **The output limit.** When you call an API, you can set the most tokens the model may write in one reply. Anthropic calls it `max_tokens`. OpenAI uses `max_completion_tokens` or `max_output_tokens`, depending on the API. If the reply reaches the limit, generation stops there, even in the middle of a word.
2. **The context window.** This is the total space for your input and the model's output together. If the input leaves too little room, the reply is cut off even when your own output limit is higher. See [context windows explained](post:context-windows-explained).

## How to tell it was cut off

Every response carries a reason for stopping. You have to check it, because a cut-off reply often returns as a normal-looking success.

| Provider | Field | Value that means cut off |
|---|---|---|
| Anthropic | `stop_reason` | `max_tokens`, or `model_context_window_exceeded` when the context window filled |
| OpenAI (Chat Completions) | `finish_reason` | `length` |
| OpenAI (Responses) | `status` | `incomplete`, with the reason `max_output_tokens` |

In Anthropic's documentation, a response that stops at `max_tokens` should be raised or continued, and one that fills the context window should be treated as truncated. A natural finish is `end_turn`.

## Why this breaks structured output

When a reply is cut off in the middle of a JSON object, the result cannot be parsed. Anthropic's documentation also notes that a truncated reply can contain an incomplete tool call, in which case you retry with a higher limit. If you see parse errors that appear only now and then, with long outputs, check the stop reason first.

You can see the problem quickly by pasting the output into the [JSON Validator](tool:json-validator). A truncated object will show an error at the very end. For the wider approach to reliable output, see [how to get reliable JSON from an LLM](post:reliable-json-from-llm). If you already have a cut-off reply, [recover truncated JSON](post:recover-truncated-json-from-an-llm) shows what can be saved, [fix broken JSON from ChatGPT and Claude](post:fix-broken-json-from-chatgpt-and-claude) covers the other common breakages, and [when not to auto-repair LLM JSON](post:when-not-to-auto-repair-llm-json) explains when repair is the wrong choice.

## Reasoning models can use up the budget

Some models spend part of the output budget on reasoning before they write the visible answer. Developers have reported cases on OpenAI reasoning models where the limit was reached during reasoning and the reply came back empty with the reason `length`. If you use a reasoning model, leave room for the thinking as well as the answer, and check how your provider counts it.

## How to fix it

1. **Raise the output limit** if the answer legitimately needs more room. Do not set it to the model's maximum for every call, since a runaway reply then costs more.
2. **Ask for a shorter answer.** State a length or a format in the prompt, for example "answer in under 150 words" or "return only these three fields".
3. **Shorten the input** if the context window is the problem. Trim history or send fewer document chunks. See [chunk size and overlap for RAG](post:chunk-size-and-overlap-for-rag).
4. **Continue the reply.** For plain text you can send a follow-up asking the model to continue from where it stopped, and join the parts. Do not do this for JSON without validating the final result.
5. **Split the job.** Ask for sections or batches of records in separate calls, then combine them.
6. **Handle it in code.** Log the stop reason, and retry or warn the user when it shows a cut-off, instead of showing a half answer.

## Estimate the size first

Before you pick a limit, estimate how long the reply needs to be. Paste a sample of the expected output into the [Token Counter](tool:token-counter) to see its token count, and set the limit above it with some room. Counts differ between models, so treat the number as a guide. See [why token counts differ between models](post:why-token-counts-differ-between-models).

## What it costs

You are billed for the tokens the model generated, including those in a reply that was cut off. A truncated reply that you then have to regenerate is paid for twice. Output also costs more per token than input, which is why a runaway reply is expensive. See [why output costs more](post:input-vs-output-tokens-why-output-costs-more).

## Chat apps

In a chat app rather than an API, a long answer that stops can usually be continued with a message such as "continue". The options and limits vary by app and plan, so check the app you use.

## Frequently asked questions

### Why did my AI answer stop in the middle of a sentence?

Most likely it reached the output limit, or the input left too little room in the context window. In an API response, check the stop reason.

### How do I know a reply was truncated?

Look at the stop reason: `max_tokens` on Anthropic, `finish_reason` of `length` on OpenAI Chat Completions, or an incomplete status on OpenAI Responses.

### Do I pay for a cut-off reply?

Yes. You are billed for the tokens generated, whether or not the reply was complete.

### Should I just set the limit as high as possible?

Not usually. A higher limit allows longer, costlier replies. Set it above the longest reply you expect, and ask for the length you need.

## Sources

- [Anthropic: Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)
- [Tian Pan: The finish reason your code never inspects](https://tianpan.co/blog/2026/06/01/the-finish-reason-your-code-never-inspects)
- [Fast.io: OpenAI max output tokens](https://fast.io/resources/openai-max-output-tokens/)
- [OpenAI Developer Community: O4-mini returns an empty response when reasoning tokens use the whole budget](https://community.openai.com/t/o4-mini-returns-empty-response-because-reasoning-token-used-all-the-completion-token/1359002)
