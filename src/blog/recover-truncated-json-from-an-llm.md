---
title: Recover Truncated JSON From an LLM
description: Why AI JSON gets cut off, what you can safely recover, and how to avoid it with a shorter reply, smaller batches and a check on the stop reason.
date: 2026-11-24
image: /assets/blog/recover-truncated-json-from-an-llm-hero.jpg
imageAlt: A JSON array cut off mid-item with a dotted line where the rest should be
tools: json-repair, json-validator, token-counter
related: fix-broken-json-from-chatgpt-and-claude, reliable-json-from-llm
---
A model writes a long JSON array, and the reply stops halfway through an item. Your parser fails because the closing brackets never arrived. You can often recover the part that was written, but not the part that was never produced. This guide explains what is safe to recover and how to stop it happening.

[[toc]]

## Why it gets cut off

A model reply has a maximum length, counted in output tokens. If the answer needs more, the reply stops where the limit falls, often in the middle of a word or a value. JSON is especially exposed because it needs every bracket and quote to be closed, so a cut anywhere makes the whole text invalid. Pretty-printed JSON can also use more tokens than minified JSON, so it may reach the limit sooner. For how tokens add up for JSON, see [how many tokens code, JSON and Hindi use](post:how-many-tokens-do-code-json-and-hindi-use).

## What you can recover

Think of the output as a list of complete items followed by one unfinished item.

- **The complete items are real data.** The model wrote them in full.
- **The unfinished item is not.** A string such as `"paper", "cl` is half a word. Closing it gives you `"cl"`, which looks valid but is wrong.
- **Anything after the cut does not exist.** If you asked for 50 records and got 31 and a half, there are no records 32 to 50.

The [JSON Repair](tool:json-repair) tool closes strings, arrays and objects so the text parses. It lists this under "Check these", because closing brackets is a guess about where the data ended. For a list of records, the careful move is to drop the last, unfinished record and keep the complete ones.

## A safe routine

1. **Detect it.** Check the stop reason your API returns. A value meaning the length limit was reached tells you the reply was cut, even before you try to parse it.
2. **Recover the complete part.** Repair the text, then discard the last item.
3. **Ask for the rest.** Send a follow-up for the items that are missing, for example starting after the last complete one.
4. **Check the count.** If you asked for a fixed number of items, confirm you got that number.

## Prevent it

- **Ask for less per request.** Request 20 records at a time instead of 200.
- **Allow a longer reply.** Raise the maximum output length where your provider permits it.
- **Use compact output.** Minified JSON and short key names use fewer tokens.
- **Estimate the size first.** Paste a sample of the output into the [Token Counter](tool:token-counter) and multiply by the number of items. The count is exact only for OpenAI tokenizers and an estimate for other providers.

## Frequently asked questions

### Why does the JSON from an LLM stop in the middle?

The reply reached its maximum output length, so the model stopped where the limit fell. The text is cut at that point, usually mid-value.

### Can truncated JSON be repaired?

The syntax can be repaired so it parses, but the missing content cannot be recovered. Keep the complete items, drop the unfinished one, and request the rest.

### How do I know if a reply was truncated?

Check the stop reason in the API response. A length-limit reason means the model was cut off. Unclosed brackets or an odd ending are other signs.

### Does minifying JSON help?

It usually helps, because whitespace and indentation can use tokens. The saving depends on the tokenizer, so measure a sample.

## Sources

- [RFC 8259: The JSON data interchange format](https://www.rfc-editor.org/rfc/rfc8259) (the JSON standard)
- [Anthropic: Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)
- [OpenAI Help: Controlling the length of model responses](https://help.openai.com/en/articles/5072518-controlling-the-length-of-openai-model-responses)
- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- Recovery steps: described from how our JSON Repair tool behaves.
