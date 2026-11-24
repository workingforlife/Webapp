---
title: Fix Broken JSON From ChatGPT and Claude
description: The nine ways AI output breaks as JSON, how to fix each one by hand or with a tool, and which fixes are safe and which are guesses.
date: 2026-11-24
image: /assets/blog/fix-broken-json-from-chatgpt-and-claude-hero.jpg
imageAlt: A broken JSON snippet next to the repaired version with the changes marked
tools: json-repair, json-validator
related: reliable-json-from-llm, recover-truncated-json-from-an-llm
---
You ask a model for JSON and your parser throws an error. In our experience, the output is often just one small mistake away from valid. This guide lists the mistakes we see most often, shows how to fix each, and explains which fixes are safe to automate. The [JSON Repair](tool:json-repair) tool applies them in your browser and lists every change.

[[toc]]

## The nine common breaks

1. **Wrapped in a code fence.** The reply starts with three backticks and the word json, and ends with three more. Remove the fences.
2. **Text around the JSON.** A sentence like "Here is the data" comes before it, or "Let me know" after it. Keep only the JSON.
3. **Trailing commas.** A comma after the last item in an array or object. JSON does not allow it.
4. **Single quotes.** Python-style strings and keys such as `{'name': 'Ada'}`. JSON needs double quotes.
5. **Unquoted keys.** `{name: "Ada"}` is valid JavaScript but not valid JSON.
6. **Python values.** `True`, `False` and `None` instead of `true`, `false` and `null`.
7. **Comments.** `//` or `/* */` notes inside the data.
8. **Line breaks inside strings.** A real new line typed inside quotes must be written as `\n`.
9. **Cut-off output.** The reply ends in the middle of a value because it hit its length limit. This one needs care, so it has its own guide: [recover truncated JSON from an LLM](post:recover-truncated-json-from-an-llm).

## Which fixes are safe

Fixes 1 to 8 have one obvious correct answer in nearly every case. Removing a fence, a comment or a trailing comma, or switching quote style, cannot change what the data means.

Fixes that involve a guess are different. Closing the brackets of cut-off output, replacing `NaN` with `null`, or dropping a half-written last item all change what the data says or how much of it there is. The tool lists these separately under "Check these", and you should read them before using the result. The post on [when not to auto-repair LLM JSON](post:when-not-to-auto-repair-llm-json) explains the risks.

## How to fix JSON by hand

1. Paste it into a validator that reports the line and column of the first error, such as the [JSON Validator](tool:json-validator).
2. Fix that one error and validate again. Errors often hide behind each other.
3. When it parses, check the content, not just the syntax.

## How to fix it with the tool

Paste the text into [JSON Repair](tool:json-repair). It fixes what it safely can, lists each change with the line where it first happened, and shows guesses in a separate section. It stops with a clear message when it cannot tell what you meant. Nothing you paste is uploaded.

## Prevent it in the first place

Repair is a safety net. For an app, use your provider's structured output options where they exist, validate every reply, and retry when it fails. See [how to get reliable JSON from an LLM](post:reliable-json-from-llm).

## Frequently asked questions

### Why does ChatGPT or Claude return invalid JSON?

Models produce text one piece at a time and do not check it with a parser. They may add a fence or an introduction, copy a style from other code they have seen, or run out of output length before they finish.

### What is the most common JSON error in AI output?

Wrapping the JSON in a code fence or a sentence, and trailing commas, are two of the most common in our experience. Single quotes and cut-off output are also frequent.

### Is it safe to automatically fix JSON from an LLM?

Fixes such as removing fences, comments and trailing commas are low risk. Fixes that guess, such as closing cut-off output, can change the data, so review them.

### Can I fix JSON without uploading it?

Yes. [JSON Repair](tool:json-repair) runs in your browser and does not send your text anywhere.

## Sources

- [RFC 8259: The JSON data interchange format](https://www.rfc-editor.org/rfc/rfc8259) (the JSON standard)
- [OpenAI: Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) (JSON mode gives valid JSON, only Structured Outputs enforces a schema)
- [Anthropic: Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- The list of common mistakes: our own experience with model output, not a measured dataset.
