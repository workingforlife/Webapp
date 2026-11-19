---
title: Tokens for Code, JSON and Hindi Text
description: How many tokens do code, JSON and Hindi use compared with English? Our measured samples, published estimates and why the answer is a range, not one number.
date: 2026-11-19
image: /assets/blog/how-many-tokens-do-code-json-and-hindi-use-hero.jpg
imageAlt: Code, JSON and Hindi text shown as different token counts
tools: token-counter, model-prices, cost-forecaster
related: how-many-tokens-is-my-text, why-token-counts-differ-between-models
---
English prose is the easy case for token counting. Code, JSON and Hindi are not, and a rule such as "one token is about four characters" can be well off for all three. This guide gives you what we measured, what others have published, and how to plan for the difference.

[[toc]]

## Read this first: these are estimates

We did not run exact tokenizers on the samples below, so none of the token figures in this guide is an exact count. What you will see is built from three things, and each is labelled:

1. **Measured by us:** characters, words and bytes of the sample texts, which are plain counts.
2. **Computed by our tool's estimate mode:** the Token Counter's estimate, which averages a characters-divided-by-four figure and a words-divided-by-0.75 figure. It does not look at the script or the content type.
3. **Published by others:** measurements and rules of thumb from named sources, each on its own tokenizer and its own text. They are single studies or single examples, so treat them as indications.

Four factors move the real number: the **language or script**, the **type of content**, the **tokenizer of the model you use**, and **formatting** such as whitespace and punctuation. Change any one and the count changes.

## Our sample texts

We wrote six short samples. Here is what we measured, and what the Token Counter's estimate mode gives.

| Sample | Characters | Words | UTF-8 bytes | Estimate mode |
|---|---|---|---|---|
| English sentence | 48 | 8 | 48 | 12 |
| Hindi (Devanagari), same meaning | 45 | 10 | 117 | 13 |
| Hindi written in English letters | 54 | 10 | 54 | 14 |
| Python, 2 lines | 70 | 10 | 70 | 16 |
| JSON, pretty-printed | 184 | 24 | 184 | 39 |
| The same JSON, minified | 85 | 1 | 85 | 12 |

Here are the samples, so you can paste them into the [Token Counter](tool:token-counter) and compare for yourself:

```
Your order has shipped and will arrive tomorrow.

आपका ऑर्डर भेज दिया गया है और कल पहुँच जाएगा।

Aapka order bhej diya gaya hai aur kal pahunch jayega.

def total(items):
    return sum(i["price"] * i["qty"] for i in items)

{"order":{"id":1042,"items":[{"sku":"A1","qty":2},{"sku":"B7","qty":1}],"paid":true}}
```

The pretty-printed JSON is the last line with line breaks and two-space indentation added. The Hindi sentence is our own plain translation, and the English-letter version is our own spelling of it.

Two things stand out already, before any tokenizer is involved:

- **Hindi is bigger in bytes.** The Devanagari sentence has fewer characters than the English one but 117 bytes against 48, because each Devanagari character takes three bytes in UTF-8. Tokenizers that work on bytes start with more to chop up.
- **Our estimate mode is blind to these differences.** It gives the minified JSON 12, against 39 for the pretty version, only because the minified text has no spaces and so counts as one "word". We expect that to understate the real count for minified JSON, because punctuation tends to use tokens. The Hindi and English-letter versions also come out almost the same. Treat estimate mode as a rough guide for English prose only.

## Code

Published sources agree on the direction: code uses more tokens than prose for the same number of characters, because keywords, operators, brackets and indentation are split up.

- One engineering write-up puts code at 1.5 to 2.5 times more token-dense than prose, and says a retrieval system pulling code snippets used about 40 percent more tokens than the same volume of documentation prose.
- Another says indented Python with short variable names can run at 2 to 3 characters per token.
- A test of the four-characters rule on real samples with OpenAI's tokenizer found it wrong by anywhere from minus 67 percent to plus 46 percent, and warned that IDs, log lines, JSON and code make the rule understate the cost.

As a worked example of the arithmetic only: our 70-character Python sample would be about 18 tokens at four characters per token, and about 23 to 35 tokens at 2 to 3 characters per token. The exact figure depends on the tokenizer.

**What to do:** do not send code you do not need. Strip comments the model does not need, send the relevant function rather than the whole file, and count a real sample before you budget.

## JSON

Every bracket, quote, colon and comma is a character that may use tokens, and keys repeat for every record.

- One guide says brackets, colons and quotes add up quickly.
- Another estimates that wrapping data in JSON adds roughly 20 to 40 percent token overhead compared with plain text holding the same information.

Our pretty-printed sample has 184 characters and the minified one 85, so the pretty version is more than twice as long in characters. We have not measured the token difference. Whitespace may be grouped with neighbouring characters by a tokenizer, so the token saving can be smaller than the character saving. Count both versions to find out.

**What to do:**

- Send JSON compact, unless a model needs the indentation.
- Keep only the fields the model needs.
- Use short but clear key names for large arrays, and test that answers do not get worse.
- If the model returns JSON, remember that output costs more than input. See [why output costs more](post:input-vs-output-tokens-why-output-costs-more), and [how to get reliable JSON from an LLM](post:reliable-json-from-llm).

## Hindi and other Indian languages

Most tokenizers were built mainly on English text, so Devanagari tends to be split into more, smaller pieces. Published figures vary a lot:

- In a short example from one write-up using OpenAI's o200k_base tokenizer, the English sentence "Your order has shipped and will arrive tomorrow." took 9 tokens, and a Hindi version of it took 14, even though the Hindi had fewer characters. That is about 1.6 times as many for one short sentence.
- A research paper measured an average of 7.71 tokens per word for Devanagari Hindi against 2.36 for Hindi in English letters, using a fixed tokenizer, on a large corpus. That paper reports that writing Hindi in English letters cut the token count by 2.5 to 4 times.
- Another study compared tokenizers and found that OpenAI's o200k_base improves on the older cl100k_base for these languages, which is a reason to check which model you use.

These are different texts and different tokenizers, which is why the numbers range from about 1.6 times to several times. A cautious planning approach is to assume Hindi will cost noticeably more than the same message in English, and then measure your own text.

Writing Hindi in English letters may lower the token count, but we do not know how it affects answer quality for your model, so test that before you rely on it.

## Why not just use one multiplier?

Because the multiplier depends on all four factors at once. A newer tokenizer can shrink Hindi counts, while a model update can raise counts for the same text. Anthropic's own documentation notes that its newer tokenizer produces about 30 percent more tokens for the same text than earlier models. See [why token counts differ between models](post:why-token-counts-differ-between-models).

## How to get a real number

1. Open the [Token Counter](tool:token-counter) and paste a realistic sample of your own text, not a toy example.
2. Choose an exact OpenAI tokenizer (o200k or cl100k) if you use OpenAI models. The estimate mode is only a rough guide.
3. For other models, recount with that provider's own token counting, since the tool's figure is an estimate.
4. Add a safety margin to your budget, and re-measure when you change model.
5. Turn the count into money in the [Cost Forecaster](tool:cost-forecaster), using the live prices on [Model Prices](tool:model-prices).

## A note on our estimate mode

This guide shows that our own estimate mode is a rough guide that does not understand scripts or minified text. We have not changed how it counts. Where exact tokenizers are available in the tool, use those.

## Frequently asked questions

### How many tokens does Hindi use compared with English?

More, usually. The examples we found range from about 1.6 times for one short sentence to several times per word in a research study, depending on the tokenizer and the text. Measure your own text with the tokenizer your model uses.

### Does JSON cost more than plain text?

Usually, yes. Brackets, quotes and repeated keys add tokens. One guide estimates 20 to 40 percent overhead against plain text for the same information.

### Is minified JSON cheaper?

It has fewer characters, so it is likely cheaper, but the saving in tokens can be smaller than the saving in characters. Count both versions.

### How many tokens is a line of code?

It varies by language, naming and indentation. Published rules of thumb range from about 2 to 3 characters per token for indented Python to 1.5 to 2.5 times the density of prose. Count a real sample.

### Are the numbers in this guide exact?

No. They are our measured character, word and byte counts, our tool's estimates, and figures published by others. None is an exact token count from a tokenizer run on our samples.

## Sources

- [Tian Pan: Tokenizer blindspots that break production LLM systems](https://tianpan.co/blog/2026-04-20-tokenizer-blindspots-production-llm) (code density, RAG with code)
- [Mark Toksum: Five token counting myths](https://mark-toksum.pages.dev/guide/token-counting-myths) (indented Python, characters per token)
- [KodeKloud: Count tokens and estimate LLM API costs](https://kodekloud.com/blog/count-tokens-and-estimate-llm-api-costs/) (the four-characters rule tested)
- [Inventive HQ: LLM tokens explained](https://inventivehq.com/blog/llm-tokens-explained) (JSON and code overhead)
- [Braindrip: Tokenization for prompt engineers](https://braindrip-web.vercel.app/courses/prompt-engineering/foundations/tokenization-for-prompt-engineers) (JSON overhead estimate)
- [GoPenAI: LLM tokens are the unit of everything](https://blog.gopenai.com/llm-tokens-are-the-unit-of-everything-5deb028b2e2a) (English and Hindi example on o200k_base)
- [Canonical event paper on romanizing Hindi](https://events.canonical.com/event/154/contributions/1005/attachments/522/840/MACS5.pdf) (token fertility for Devanagari and Roman Hindi)
- [arXiv: Is Sanskrit the most token-efficient language?](https://arxiv.org/abs/2601.06142v1) (comparison of GPT and Gemini tokenizers)
- [Anthropic: Token counting](https://platform.claude.com/docs/en/build-with-claude/token-counting)
- Character, word and byte counts and estimate-mode figures: measured and computed by us on the sample texts in this guide.
