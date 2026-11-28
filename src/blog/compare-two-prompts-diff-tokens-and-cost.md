---
title: Compare Two Prompts: Diff, Tokens & Cost
description: How to compare two versions of a prompt: see every change, the token difference per edit, and what the new version costs per request and per month.
date: 2026-11-28
updated: 2026-11-28
image: /assets/blog/compare-two-prompts-diff-tokens-and-cost-hero.jpg
imageAlt: Two prompt versions side by side, with removed text in red, added text in green and the token count falling from 94 to 83
tools: prompt-diff, token-counter, cost-forecaster
related: how-to-test-a-prompt-change-before-shipping, how-to-save-tokens-in-a-prompt-myths-tested
---
You changed a prompt. Is it shorter, is it cheaper, and does it still say the same thing? A prompt diff answers the first two in seconds and points you at the edits that need checking for the third. This guide shows how to compare two versions, how to read the token and cost change, and what a diff cannot tell you.

[[toc]]

## What a prompt diff shows

A diff lines up an old and a new version and marks what was removed and what was added. Two settings matter:

- **Words** shows exactly what changed inside a sentence. It is the best view for a prompt you have edited by hand.
- **Lines** is easier to read for lists and templates where whole lines were rewritten.

Whitespace counts too. A space, a tab or a line break can cost tokens, so a good diff shows a change that only touches whitespace instead of hiding it.

## Step by step with Prompt Diff

1. **Paste both versions** into the [Prompt Diff](tool:prompt-diff) boxes, original on the left and revised on the right. Everything stays in your browser.
2. **Choose a tokenizer.** Pick an exact OpenAI tokenizer if you use OpenAI models. Otherwise use the estimate, which works for any model but is not exact. Other providers can count the same text differently, see [why token counts differ between models](post:why-token-counts-differ-between-models).
3. **Read the total change first.** It is the revised count minus the original count, and it is the number to trust.
4. **Go through the edits, biggest change first.** The edit list shows the tokens removed and added by each change. Selecting a row jumps to it in the text.
5. **Add a model and your monthly volume** to turn the token change into a cost per request and per month.

## A worked example

This is the example the tool loads. The original has 94 tokens in estimate mode:

```
You are a helpful assistant for our customer support team.
Please read the customer's message very carefully and then write a reply.
It is important that you always stay polite and professional.
In order to help the customer, first of all find out what the problem is.
Keep the reply short. Do not make up any information that you are not sure about.
If you do not know the answer, please say so.
```

The revised version has 83:

```
You are a support assistant for our customer team.
Read the customer's message carefully, then write a reply.
Always stay polite and professional.
To help the customer, first find the problem.
Keep the reply short. Do not invent information you are not sure about.
If you do not know the answer, say so.
Reply in the customer's language.
```

The change is about 11 tokens fewer, or 11.7 percent, from 13 edits. These figures are the tool's estimate, not an exact count. The biggest edits, in estimate mode:

| Edit | Tokens |
|---|---|
| "It is important that you always" becomes "Always" | −6 |
| New last line: "Reply in the customer's language." | +9 |
| "In order to" becomes "To" | −2 |
| "of all" removed | −2 |
| "out what" removed | −2 |
| "make up any" becomes "invent" | −2 |
| Seven smaller edits | −6 |
| **Total** | **−11** |

Two things are worth noticing. The edits that shorten the prompt save about 20 tokens between them, and the one new line gives back 9. And that new line is the edit that changes what the prompt asks the model to do, which is the one to test first.

## Turn the token change into money

The formula is tokens saved, times the price per million input tokens, divided by one million, times the number of requests.

Our example prompt is tiny, so the saving is tiny. As an illustration only, take a 2,000-token system prompt and the same 11.7 percent cut. That is about 234 tokens saved on every request. At an illustrative $2 per million input tokens, which is not a real price, and one million requests a month, the saving is 234 × 1,000,000 × $2 ÷ 1,000,000 = $468 a month. For the real figure, use the price of your own model.

Three limits to keep in mind:

- **Input only.** Cutting the prompt does not change the output tokens, and output usually costs more per token. See [why output costs more](post:input-vs-output-tokens-why-output-costs-more).
- **Only prompts you send every time.** The saving applies to text that goes out with each request, such as a system prompt.
- **Caching changes the maths.** If part of your prompt is cached, those tokens are billed at a different rate. See [prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained), and model it in the [Cost Forecaster](tool:cost-forecaster). If your prompt is long because of examples, see [what few-shot examples cost in tokens](post:what-few-shot-examples-cost-in-tokens), and for trimming the wording first, see [shorten a prompt without losing quality](post:shorten-a-prompt-without-losing-quality).

## Why the edit figures do not add up exactly

Each edit is counted on its own text, but a tokenizer's result depends on the text around it. Words at the edge of an edit can join their neighbours into different tokens. So the edits in the list can differ a little from the total change. In our example they happened to match, and on other prompts they may not.

## Changes a diff makes easy to miss

Some savings are not words. Hidden characters, emoji, markup and tracking codes on links all add tokens without adding meaning, and a quick read will not show them. We measured several of them in [how to save tokens in a prompt: myths tested](post:how-to-save-tokens-in-a-prompt-myths-tested). The [Prompt Token Optimizer](tool:prompt-token-optimizer) finds many of them and lets you review each change before you keep it.

## What a diff cannot tell you

A diff tells you what changed and what it costs. It does not tell you whether the new prompt works as well. A shorter prompt can lose an instruction, and a longer one can add a useful rule. Before you ship, run both versions on the same inputs and compare the answers. See [how to test a prompt change before shipping](post:how-to-test-a-prompt-change-before-shipping).

## Frequently asked questions

### How do I compare two prompts?

Paste the old and the new version into a diff tool, such as Prompt Diff. It marks what was removed and added, counts the tokens in both versions and shows the change for each edit.

### Does a shorter prompt always cost less?

For the prompt itself, yes, because you pay for fewer input tokens. But a change in wording can also change how long the answer is, and output tokens usually cost more than input tokens. Check the output length as well.

### Are the token counts exact?

Only if you choose an exact tokenizer, and then only for that tokenizer, which means OpenAI models in Prompt Diff. The estimate is a guide. The Token Counter shows a likely range for it.

### Is the cost figure exact?

No. It is the prompt's input tokens times the model's list price from our daily price list. It leaves out output, caching, discounts and any contract pricing.

### Is my prompt uploaded?

No. The comparison runs in your browser, and there is no share link, because it would put your prompts in the address.

## Sources

- Token counts, edits and the worked example: computed by our Prompt Diff tool in estimate mode on the example prompts it loads. The $2 price is an illustration, not a real model price.
