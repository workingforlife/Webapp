---
title: Get Reliable JSON From an LLM
description: Why LLM output sometimes breaks as JSON, how structured outputs and schemas help, and a simple validate-and-retry routine you can use in your own app.
date: 2026-11-19
image: /assets/blog/reliable-json-from-llm-hero.jpg
imageAlt: A JSON object passing a schema check
tools: json-validator, prompt-builder, token-counter
related: microsoft-outage-llm-app-fallback, reusable-prompt-templates
---
If your app asks a model for JSON, sooner or later it will get something that does not parse. This guide explains why that happens, what providers offer to prevent it, and what to do in your own code when it still goes wrong.

[[toc]]

## How model JSON breaks

When you ask for structured output, the reply can arrive:

- **Wrapped in a code block**, with Markdown fences around it.
- **With extra words**, such as "Here is your JSON:" before it.
- **With a trailing comma** after the last item.
- **With a missing field** or a number written as text.
- **Cut off**, if the reply hit the output limit before it finished.

The first three are syntax problems. The last two are structure problems, and they need a schema to catch.

## Ask clearly

A few habits cut the failures before any tooling:

- Say exactly what you want: "Return only a JSON object, with no other text."
- Show the shape, with the field names and types.
- Keep the structure flat and the field names simple.
- Leave enough room in the output limit so the reply is not cut off.

A reusable template makes this consistent. See [reusable prompt templates](post:reusable-prompt-templates) for how to build one with the [Prompt Builder](tool:prompt-builder).

## JSON mode vs structured outputs

These two features are often confused.

- **JSON mode** promises valid JSON syntax, but not your field names, types or required fields.
- **Structured outputs** constrain the reply to a JSON Schema that you send, so the shape matches the schema.

Anthropic documents structured outputs for the Claude API, where you pass a JSON schema in the request, and says the schema follows JSON Schema with some limitations. OpenAI offers a comparable feature, and other providers do too. Supported schema features differ between providers, so check each provider's documentation before you rely on one. Do not assume a schema that works with one will work unchanged with another.

Even then, a matching shape is not a correct answer. A reply can follow the schema and still contain a wrong value. Validate the structure, and check the meaning where it matters.

## Validate every reply

Treat model output like any untrusted input. Before your code uses it:

1. Parse it. If parsing fails, you have a syntax problem.
2. Check it against your schema: required fields, types and allowed values.
3. Check the values that matter for your use, such as ranges or IDs that must exist.

You can try this by hand with the [JSON & Schema Validator](tool:json-validator). Paste the reply and an optional schema. It shows the exact line and column of a syntax error and lists the structure problems. Its schema checks cover type, required, properties, items, enum, minimum, maximum and minLength. It is a quick check, not a full JSON Schema validator.

## Fix the common problems

The validator's **Fix Common Issues** button removes Markdown code fences, trims text before and after the JSON, and removes trailing commas. It does not guess at anything else, so review the result before you use it. If you build the same step into your app, keep it just as narrow. A repair step that guesses can hide real errors.

## Retry, then fall back

When a reply fails validation, a simple routine works well:

1. Retry once or twice, sending the validation error back to the model so it can correct itself.
2. Use a timeout, and wait a little longer between attempts.
3. If it still fails, fall back to a simpler path, such as a cached answer, a second model or a clear error for the user.

Retries cost tokens, so cap them. Our guide on [adding a fallback model](post:microsoft-outage-llm-app-fallback) covers timeouts, backoff and failover in more detail, and the [Token Counter](tool:token-counter) helps you see what a longer prompt with an error message costs.

## Frequently asked questions

### What is the difference between JSON mode and structured outputs?

JSON mode only promises that the reply is valid JSON. Structured outputs constrain the reply to a schema you provide, so the fields and types match.

### If I use a schema, do I still need to validate?

Yes. A schema keeps the shape right, but not every value. Validate before you use the data, especially when it drives an action.

### Is the JSON Validator a full JSON Schema validator?

No. It covers the most common checks and is meant for quick checks.

### Is my data uploaded?

No. Validation happens in your browser.

## Sources

- [Anthropic: Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Developers Digest: Structured outputs across AI APIs](https://www.developersdigest.tech/blog/structured-outputs-across-ai-apis-2026)
- [Logic: Structured outputs guide](https://logic.inc/resources/structured-outputs-guide)
