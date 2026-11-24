---
title: When Not to Auto-Repair LLM JSON
description: Auto-repair can hide real problems. Learn which JSON fixes are safe, which are guesses, and when to validate and retry instead of repairing.
date: 2026-11-24
image: /assets/blog/when-not-to-auto-repair-llm-json-hero.jpg
imageAlt: A repair wrench next to a warning sign over a JSON object
tools: json-repair, json-validator
related: reliable-json-from-llm, fix-broken-json-from-chatgpt-and-claude
---
It is tempting to wrap every model reply in a "fix the JSON" step and move on. For quick jobs, that is fine. For production data, repair can turn a visible failure into a silent mistake. This post separates the safe fixes from the risky ones and says when to retry instead.

[[toc]]

## Safe fixes

These change how the data is written, not what it says:

- Removing Markdown code fences
- Removing text before or after the JSON, when it is clearly a sentence
- Removing comments
- Removing trailing commas
- Changing single or curly quotes to double quotes
- Quoting unquoted keys
- Changing `True`, `False` and `None` to `true`, `false` and `null`

## Fixes that guess

These change meaning or amount, so the [JSON Repair](tool:json-repair) tool marks them "Check these":

- **Closing cut-off output.** The brackets close, but the data after the cut is missing, and the last item may be half-written.
- **Dropping an unfinished item.** You lose a record you may have wanted.
- **Replacing NaN, Infinity or undefined with null.** `null` says "no value", which is not the same as "not a number".
- **Ignoring extra content after the JSON.** If the extra text was more data, it is gone.

The tool does not guess at unescaped double quotes inside a string. A quote can end the string or be part of the text, and a wrong guess silently corrupts the value. It stops with an error instead.

## Why silent repair is risky

A parse error is a signal. If you repair every error automatically, a model that is truncating or drifting from your format looks fine to your code, while the data degrades. Dropped records and `null` values spread downstream, and nobody sees the cause.

## A better pattern for apps

1. **Validate first.** Parse the reply and, if you can, check it against a schema.
2. **Repair only the safe fixes automatically,** and log that you did.
3. **Retry for anything else.** Send the error back to the model and ask for corrected output.
4. **Alert on patterns.** If many replies need repair, change the prompt, the output limit or the model.

See [how to get reliable JSON from an LLM](post:reliable-json-from-llm) for the validate-and-retry routine, and use the [JSON Validator](tool:json-validator) to check a reply against a simple schema.

## When repair is the right choice

Repair fits one-off work: cleaning up a reply you pasted from a chat, preparing a sample, or recovering the complete part of a long answer. In those cases you read the result anyway, and the change list tells you what to look at.

## Frequently asked questions

### Is it safe to auto-fix JSON from an LLM?

Formatting fixes such as removing fences and trailing commas are low risk. Fixes that guess, such as closing cut-off output, can change the data, so review them or retry the request.

### What should I do instead of repairing JSON?

Validate the reply, and when it fails, send the error back and ask the model to correct its output. Use provider structured-output options where available.

### Can a JSON repair tool corrupt my data?

A tool that guesses can. That is why [JSON Repair](tool:json-repair) separates safe fixes from guesses and refuses to guess at ambiguous cases such as quotes inside strings.

## Sources

- [RFC 8259: The JSON data interchange format](https://www.rfc-editor.org/rfc/rfc8259) (the JSON standard)
- [OpenAI: Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs) (JSON mode gives valid JSON, only Structured Outputs enforces a schema)
- [Anthropic: Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- What our JSON Repair tool changes and refuses to change: described from the tool's own behaviour.
