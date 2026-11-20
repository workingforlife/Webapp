---
title: How to Save Tokens in a Prompt: Myths Tested
description: Does "&" cost more than "and"? We tested 42 prompt habits on OpenAI's tokenizers: what saves tokens, what makes no difference and what quietly wastes them.
date: 2026-11-20
image: /assets/blog/how-to-save-tokens-in-a-prompt-myths-tested-hero.jpg
imageAlt: Prompt habits compared by token count, with "&" and "and" both costing the same
tools: token-counter, prompt-token-optimizer, text-cleaner
related: paste-or-upload-which-uses-fewer-tokens, cut-your-llm-bill
---
A popular tip says special symbols such as "&" cost more tokens than the word "and". We tested it, and it is not true: both versions of our sentence came to 17 tokens. We went on to test 41 other prompt habits the same way. Some save a lot, some make no difference, and a few do the opposite of what you would expect.

[[toc]]

## Read this first

- **What we tested:** 42 before-and-after pairs, each a short text we wrote, counted with OpenAI's two public [[tip:tokenizer::tokenizers]], [[tip:o200k]] (recent OpenAI models) and [[tip:cl100k]] (older ones). The two agreed on almost every pair, so we quote o200k and mention cl100k where it differs.
- **What we did not test:** Anthropic's and Google's tokenizers cannot run offline, so we did not run them. Their counts can differ. See [why token counts differ between models](post:why-token-counts-differ-between-models).
- **Small pairs are noisy:** most of our pairs are one line. A difference of one or two tokens in a single line is a sign, not a rule. The large differences below are the ones worth acting on.
- **Cutting words is different from swapping them:** some savings come from saying less, not from a tokenizer trick. Those can change the answer, so test quality as well as the count.

## The short version

| What changed | Tokens before and after (o200k) | Verdict |
|---|---|---|
| "&" to "and" | 17 and 17 | No difference |
| "+" to "plus", "@" to "at", "->" to "to" | 9 and 9 each | No difference |
| [[tip:snake-case]] or [[tip:camel-case]] to plain words | 10 and 10 each | No difference |
| [[tip:em-dash::Em dash]], [[tip:curly-quotes::curly quotes]], [[tip:ellipsis]], [[tip:bullet-char::bullet •]] | Same before and after | No difference |
| Three blank lines to one | 9 and 9 | No difference |
| 8-space [[tip:indentation]] to 2 spaces | 11 and 11 | No difference |
| "%" to "percent", "#" to "number" | 11 to 12 and 11 to 13 | The symbol was cheaper |
| [[tip:eg-ie::"e.g."]] to "for example", "w/" to "with" | 16 to 14 and 12 to 10 | The longer form was cheaper |
| ALL CAPS to normal case | 17 to 14 | Saves about 18 percent |
| Emoji to a word | 14 to 8 (17 to 8 on cl100k) | Saves about 43 percent |
| Hidden [[tip:nbsp::non-breaking spaces]] and [[tip:zero-width]] removed | 16 to 10 | Saves about 38 percent |
| [[tip:md-headings]] to plain labels | 20 to 14 | Saves about 30 percent |
| [[tip:divider-lines::Divider lines]] (=====) removed | 16 to 11 | Saves about 31 percent |
| [[tip:xml-tags::XML tags]] to plain labels | 18 to 13 | Saves about 28 percent |
| [[tip:html-tags::HTML tags]] removed | 38 to 9 | Saves about 76 percent |
| Long [[tip:uuid::UUID]] to a short ID | 23 to 7 | Saves about 70 percent |
| URL with [[tip:tracking-params::tracking parameters]] trimmed | 25 to 9 | Saves about 64 percent |
| [[tip:pretty-json::Pretty JSON]] to [[tip:csv::CSV]] | 166 to 47 | Saves about 72 percent |

## Myth: symbols cost more than words

They do not, in our tests. "&", "+", "@" and "->" each took the same number of tokens as the words they stand for, and "%" and "#" were slightly cheaper than "percent" and "number". Common words and common symbols are each usually a single token, so swapping one for the other changes nothing.

The reverse also held for some abbreviations. [[tip:eg-ie::"e.g." and "i.e."]] cost two tokens more than "for example" and "that is", and "w/" cost two more than "with". Shortening words by hand is not a reliable way to save tokens, and it can make a prompt harder to read for the model and for you.

## What does cost more

- **Emoji.** A three-emoji status line took 14 tokens on o200k and 17 on cl100k, against 8 for the same message in words. Emoji split into several pieces.
- **Hidden characters.** [[tip:nbsp::Non-breaking spaces]] and [[tip:zero-width::zero-width characters]] look like nothing but cost tokens. The sample with them used 16 tokens and the clean one 10. They often arrive when you copy text from a web page or a document. The [Text Cleaner](tool:text-cleaner) removes them.
- **ALL CAPS.** Capital letters often split into more pieces than normal text. 17 tokens became 14 when we used normal case.
- **Markup you do not need.** Markdown headings and bold, divider lines, XML tags and especially HTML tags all added tokens. If you paste a web page, strip the tags first. Structure still helps a long prompt, so keep what the model needs and drop what is only decoration.
- **Hard line breaks from a PDF.** The same paragraph with a line break every 40 or so characters cost 41 tokens against 37 as one paragraph, about 10 percent more. Join the lines before you paste.

## Numbers, links and IDs

These were some of the biggest per-item savings.

- **Long IDs and URLs.** A UUID cost 23 tokens against 7 for a short ID. A link with tracking parameters cost 25 against 9 when trimmed. If the model does not need the full string, use a short reference and map it back in your code.
- **Number formatting.** "1,000,000" took 11 tokens and "1 million" took 8. "$1,299.00" took 15 and "$1299" took 9. An ISO date such as 2026-11-20 took two more tokens than "20 Nov 2026" in our sample.

## Data formats: the biggest single lever

We put the same five records into five formats. Pretty-printed JSON is the baseline.

| Format | Tokens (o200k) | Against pretty JSON |
|---|---|---|
| [[tip:pretty-json::Pretty-printed JSON]] | 166 | baseline |
| [[tip:minified-json::Minified JSON]] | 86 | 48 percent fewer |
| [[tip:yaml::YAML]] | 111 | 33 percent fewer |
| [[tip:md-table::Markdown table]] | 75 | 55 percent fewer |
| [[tip:csv::CSV]] | 47 | 72 percent fewer |

Shorter key names also helped: the minified JSON with long keys such as `customer_identifier` took 126 tokens against 86 with short ones. Published tests point the same way. One ranked TSV and CSV as cheapest on a GPT-5 tokenizer, then a Markdown table, with minified JSON well above them. Another writer who tried the "YAML saves tokens" hack with real work found the saving was swallowed by output variation and migration effort.

Two cautions. First, a format that is cheaper to read is not always better for the model. Some tests found compact formats less accurate on certain tasks, so check answer quality before you switch. Second, CSV and tables suit uniform records. Nested or irregular data does not flatten well. For uses where JSON must stay, minify it and use short keys. See [reliable JSON from an LLM](post:reliable-json-from-llm).

## Words you can cut, with care

- **Politeness and filler.** "Could you please summarise the text below for me? Thank you so much in advance!" took 18 tokens against 7 for "Summarise the text below:". A longer filler opening took 24 against 9. Some research suggests a "please" has a negligible effect on answer quality, but the evidence is mixed, so test it on your own task.
- **Repetition.** Stating the same instruction twice cost 17 tokens against 12 once. Repeating a sentence ten times cost 211 against 21. That sounds obvious, but pasted templates and long system prompts often repeat themselves.

These savings are real, and they are the ones that can change the result. Make the cut, run your test cases, and keep the version that still answers well.

## Where the bigger savings are

Trimming a prompt saves tokens on every request, but long conversations and large pasted documents usually cost more than any single habit above. Chat history and system prompts are re-sent each turn, so a small waste repeats. For the larger levers, see [how to cut your LLM bill](post:cut-your-llm-bill) and [prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained). If you are deciding how to give the model a document, read [paste or upload: which uses fewer tokens](post:paste-or-upload-which-uses-fewer-tokens).

## Test your own prompt

1. Paste the prompt into the [Token Counter](tool:token-counter) and note the count. Pick an OpenAI tokenizer for an exact count on OpenAI models.
2. Change one thing at a time and count again. Whitespace, symbols and punctuation rarely matter, so spend your time on the big items above.
3. Use the [Prompt Token Optimizer](tool:prompt-token-optimizer) to find filler and repeats, and review each change it suggests.
4. Compare the answers before and after, not only the counts.

## Frequently asked questions

### Does "&" use more tokens than "and"?

Not in our test. Both took 17 tokens in a sentence that used each four times, on both OpenAI tokenizers.

### Do emoji cost more tokens?

Yes. In our sample a short status line with three emoji used 14 tokens on o200k and 17 on cl100k, against 8 for the same message in words.

### Does extra whitespace cost tokens?

Not much in our tests. Extra blank lines and deeper indentation made no difference, but non-breaking spaces and zero-width characters did, and so did hard line breaks copied from a PDF.

### What is the cheapest format for data?

CSV in our test, then a Markdown table, minified JSON and YAML, with pretty-printed JSON the most expensive. Check the answer quality for your task before you switch.

### Will these results hold for Claude or Gemini?

Probably in direction, but we did not test their tokenizers. Count with each provider's own tool when the exact number matters.

[[terms]]

## Sources

- Token counts: measured by us with the o200k and cl100k tokenizers on 42 before-and-after pairs of short texts written for this guide. The sample texts and formats are ours, so figures are illustrations, not guarantees.
- [Towards AI: GPT-5, Llama and Qwen agree YAML is smaller than JSON](https://pub.towardsai.net/gpt-5-llama-and-qwen-agree-yaml-is-smaller-than-json-and-costs-more-tokens-a9496ee62ff9) (ranking of data formats on a GPT-5 tokenizer)
- [HackerNoon: I spent $23 testing the "YAML saves tokens" hack](https://hackernoon.com/i-spent-$23-testing-the-yaml-saves-tokens-hack-it-doesnt-work) (real-world result)
- [SoftServe: Rethinking LLM inputs, JSON against TOON and Markdown-KV](https://medium.com/softserve-technical-communication/rethinking-llm-inputs-json-against-toon-and-markdown-kv-b713bcbe7eb5) (accuracy of compact formats)
- [Decrypt: Saying "please" to AI chatbots](https://decrypt.co/?p=317176) (a study finding a negligible effect of politeness on quality)
