---
title: Context Windows Explained
description: What a context window is, what counts toward it, why a bigger window costs more to use, and what happens when you go over.
date: 2026-11-10
updated: 2026-11-22
image: /assets/blog/context-windows-explained-hero.jpg
imageAlt: A context window filling with tokens
tools: token-counter, chunker, cost-forecaster
related: how-many-tokens-is-my-text, cut-your-llm-bill
---
A model's **context window** is the maximum number of tokens it can handle in a single request. Think of it as the size of the desk the model works on: everything it needs has to fit on the desk at once.

[[toc]]

## What counts toward the window

The window covers everything in the request and the reply:

- The system prompt and instructions
- The conversation so far
- Any documents, search results or tool outputs you include
- Your new question
- The model's answer

Some models also count hidden reasoning tokens against the limit. Check the provider's documentation for the exact rule.

## Window size is not memory

A large window lets you send more at once, but it does not give the model a memory. Each request starts fresh. In a chat, the application re-sends earlier messages so the model can see them. If you stop sending them, the model forgets them.

## Bigger window, bigger bill

You pay for every token you send, so filling a very large window on every request is expensive. A 200,000-token request costs far more than a 2,000-token one, even if the model could handle both. A big window is a capacity, not a target. Our guide to [cutting your LLM bill](post:cut-your-llm-bill) covers ways to send less.

## What happens when you go over

- The API may reject the request with an error.
- Some applications silently drop the oldest messages to make room.
- Quality can drop when a window is very full, because relevant details are harder to pick out of a huge input.
- The reply can be cut off, because less room is left for the output. See [why AI answers get cut off](post:why-ai-answers-get-cut-off-max-output-tokens).

## How to check whether your text fits

1. Count the tokens in your prompt and documents with the [Token Counter](tool:token-counter).
2. Add the length you expect for the reply.
3. Compare the total with the model's context window. The Token Counter lists how many models can fit your text.

## When your text is too long

- **Split it.** Break the document into overlapping chunks with the [Text Chunker](tool:chunker) and process them separately. For PDFs, [extract clean text first](post:pdf-to-ai-chatbot-without-wasting-tokens).
- **Retrieve.** Send only the passages relevant to each question rather than the whole document. [Choosing chunk size and overlap](post:chunk-size-and-overlap-for-rag) matters here.
- **Summarize.** Replace old history with a short summary.
- **Trim.** Remove boilerplate and repeated content.

## Context and cost over a long conversation

As a chat grows, the input grows with it, until it hits the window and older turns are dropped. The [Cost Forecaster](tool:cost-forecaster) models that curve, so you can see how cost rises with conversation length and where the window caps it. To count the tokens in your own text, see [how many tokens is my text](post:how-many-tokens-is-my-text).

## Frequently asked questions

### What counts toward the context window?

Everything in the request and the reply: the system prompt, the conversation so far, any documents, search results or tool outputs, your new question and the model's answer. Some models also count hidden reasoning tokens, so check the provider's documentation for the exact rule.

### Does a bigger context window mean the model remembers more?

No. Window size is not memory. Each request starts fresh, and in a chat the application re-sends earlier messages so the model can see them. If it stops sending them, the model forgets them.

### What happens if my text is too long for the window?

The API may reject the request with an error, or the application may silently drop the oldest messages. Quality can also drop when a window is very full, and the reply can be cut off because less room is left for the output.

### Should I fill the whole window?

No. You pay for every token you send, so a very large request on every call is expensive. A big window is a capacity, not a target.

## Sources

- [Anthropic: Context windows](https://platform.claude.com/docs/en/build-with-claude/context-windows) (each turn accumulates in the window, input and output both count toward it, and more context is not automatically better)
- [Chroma Research: Context Rot](https://research.trychroma.com/context-rot) (in tests of 18 models, performance became less reliable as input length grew)
- [OpenAI Help: What are tokens and how to count them](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) (rules of thumb for English, input, output and cached tokens, tokens billed per use)
- [Google: Understand and count tokens](https://ai.google.dev/gemini-api/docs/interactions/tokens)
- [Anthropic: Pricing](https://platform.claude.com/docs/en/about-claude/pricing) (separate input and output prices, prompt caching multipliers, 50% Batch API discount)
