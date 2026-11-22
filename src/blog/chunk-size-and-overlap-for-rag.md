---
title: Chunk Size and Overlap for RAG
description: How to choose chunk size and overlap when splitting documents for AI search (RAG): the trade-offs, common defaults and a way to test your settings.
date: 2026-11-22
image: /assets/blog/chunk-size-and-overlap-for-rag-hero.jpg
imageAlt: A long document split into overlapping chunks
tools: chunker, token-counter, pdf-to-text
related: pdf-to-ai-chatbot-without-wasting-tokens, context-windows-explained
---
Document-search systems for AI, often called RAG (retrieval-augmented generation), work by splitting your documents into chunks, finding the few chunks that match a question, and sending only those to the model. The two settings that matter most are chunk size and overlap. This guide explains the trade-offs and gives you a simple way to test your own settings before you build on them.

[[toc]]

## Why chunking saves money

Models can only read so much at once, and you pay for every token you send. Sending a whole document with every question is wasteful. Take a 100,000-token manual and 20 questions. Sending the whole manual each time costs 2,000,000 input tokens. Sending the three most relevant 500-token chunks for each question costs 30,000. The chunking itself is free, and the saving comes from sending less. For more on why sending less matters, see [seven ways to cut your LLM bill](post:cut-your-llm-bill).

## Chunk size: precise or complete

- **Smaller chunks** match a question more precisely, but each one carries less context, so an answer can be split across several chunks.
- **Larger chunks** keep more context together, but they cost more tokens when sent and can bury the key sentence in a lot of unrelated text.

A common starting point is 300 to 800 tokens per chunk. Treat that as a place to begin, not a rule.

## Overlap: keep ideas whole

An idea often straddles a boundary. With overlap, the end of each chunk is repeated at the start of the next, so a sentence cut at the boundary still appears whole in at least one chunk. A common starting point is 10 to 15 percent of the chunk size. More overlap protects against cut-off answers, but it stores and searches more text and can return near-duplicate chunks.

## What providers use by default

Defaults vary, so do not assume yours will match another system's. OpenAI's file search, for example, [uses a default of 800 tokens per chunk with 400 tokens of overlap](https://developers.openai.com/api/reference/resources/vector_stores). The SDK documentation adds that the chunk size can be set between 100 and 4096 tokens and that the overlap must not exceed half of the chunk size. That is a much larger overlap than the common starting point above, which shows there is no single right answer. It depends on your documents and questions.

## Test your settings before you build

You can check chunking choices without building anything:

1. Paste a real document into the [Text Chunker](tool:chunker).
2. Set a chunk size and overlap, then choose **Split Into Chunks**. Splits happen at paragraph and sentence boundaries.
3. Take 10 to 20 real questions your users would ask. For each one, use **Test a Question** to see which chunks match best.
4. Check two things: does the chunk that matches contain the whole answer, and is the answer split across a boundary?
5. Adjust the size or overlap and repeat.

One limit: the question test uses keyword matching (BM25), not semantic search, so it can miss paraphrases and synonyms. Real systems usually use embeddings, which also match different wording with the same meaning. Treat the test as a quick check that your settings keep the right passage together, not as a measure of final search quality.

## Count tokens properly

The Chunker's token counts are estimates, usually within about 10 percent of an exact OpenAI count. It converts your chunk size to characters using the estimated characters per token of your own text, so English, code and non-English text all land near the target, and most chunks come out slightly under it because they end at paragraph and sentence boundaries. For exact OpenAI counts, use the [Token Counter](tool:token-counter). Other providers count tokens differently, so a chunk can be larger on one model than another. See [why token counts differ between models](post:why-token-counts-differ-between-models).

## Clean the text first

Chunks made from messy text are messy. If your source is a PDF, extract clean text first so that headers, footers and page numbers do not end up inside your chunks. Our guide on [sending a PDF to an AI chatbot without wasting tokens](post:pdf-to-ai-chatbot-without-wasting-tokens) shows how.

## Frequently asked questions

### How big should chunks be?

A common starting point is 300 to 800 tokens with 10 to 15 percent overlap. Smaller chunks give more precise matches, and larger chunks keep more context. Test with real questions.

### Is the overlap a waste of tokens?

It adds some stored text, but it does not add cost when you send chunks, unless overlapping chunks are both retrieved. The benefit is that a sentence cut at a boundary still appears whole in at least one chunk.

### Does this tool use embeddings?

No. It uses keyword matching (BM25) to test your settings. It is a rough check, and real systems usually use embeddings.

### Is my text uploaded?

No. Splitting and matching happen in your browser.

## Sources

- [OpenAI: Vector stores API reference](https://developers.openai.com/api/reference/resources/vector_stores)
- [OpenAI Java SDK: StaticFileChunkingStrategy](https://javadoc.io/static/com.openai/openai-java/0.32.0/com/openai/models/StaticFileChunkingStrategy.html)
