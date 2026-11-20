---
title: Tokens for Code, JSON and Hindi Text
description: How many tokens do code, JSON and Hindi use vs English? Exact OpenAI counts for six samples, published figures and why the answer is a range.
date: 2026-11-19
updated: 2026-11-20
image: /assets/blog/how-many-tokens-do-code-json-and-hindi-use-hero.jpg
imageAlt: Code, JSON and Hindi text shown as different token counts
tools: token-counter, model-prices, cost-forecaster
related: how-many-tokens-is-my-text, why-token-counts-differ-between-models
---
English prose is the easy case for token counting. Code, JSON and Hindi are not, and a rule such as "one token is about four characters" can be well off for all three. This guide gives you what we measured, what others have published, and how to plan for the difference.

[[toc]]

## Read this first: these are estimates

We ran OpenAI's exact o200k and cl100k tokenizers on the six samples below, so those token counts are exact for those two tokenizers. They are not exact for Claude or Gemini, which we did not run. What you will see is built from three things, and each is labelled:

1. **Measured by us:** characters and bytes of the sample texts, and their exact o200k and cl100k token counts, run in a browser on 20 November 2026.
2. **Computed by our tool's estimate mode:** the Token Counter's estimate, which adds up a rough token count for words, numbers, punctuation, line breaks and each script separately. We tuned it on 32 other short texts against the exact OpenAI tokenizers, but it is still an estimate.
3. **Published by others:** measurements and rules of thumb from named sources, each on its own tokenizer and its own text. They are single studies or single examples, so treat them as indications.

Four factors move the real number: the **language or script**, the **type of content**, the **tokenizer of the model you use**, and **formatting** such as whitespace and punctuation. Change any one and the count changes.

## Our sample texts

We wrote six short samples. Here is what we measured, the exact token counts from the two OpenAI tokenizers, and what the Token Counter's estimate mode gives.

| Sample | Characters | UTF-8 bytes | o200k (exact) | cl100k (exact) | Estimate mode |
|---|---|---|---|---|---|
| English sentence | 48 | 48 | 9 | 9 | 9 |
| Hindi (Devanagari), same meaning | 45 | 117 | 27 | 49 | 35 |
| Hindi written in English letters | 54 | 54 | 16 | 21 | 11 |
| Python, 2 lines | 70 | 70 | 21 | 21 | 23 |
| JSON, pretty-printed | 184 | 184 | 68 | 68 | 63 |
| The same JSON, minified | 85 | 85 | 34 | 33 | 36 |

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

What the exact counts show:

- **Hindi is bigger in bytes, and in tokens.** The Devanagari sentence has fewer characters than the English one but 117 bytes against 48, because each Devanagari character takes three bytes in UTF-8. It took 27 tokens on o200k and 49 on cl100k, against 9 for the English sentence: about 3 times and 5.4 times as many.
- **Hindi in English letters is cheaper than Devanagari here.** The same sentence in Roman letters took 16 tokens on o200k and 21 on cl100k, which is still 1.8 to 2.3 times the English sentence.
- **The newer tokenizer helps Hindi a lot.** The Hindi sentence took 27 tokens on o200k against 49 on cl100k. For the English, Python and JSON samples the two tokenizers were within one token of each other.
- **Pretty JSON costs about double.** The pretty-printed JSON took 68 tokens and the minified version 34, which matches how the characters fall (184 against 85).
- **The estimate mode landed inside its range for five of the six.** For the Devanagari sentence it gave 35 against exact counts of 27 and 49. Romanized Hindi is its weak spot: it gave 11 against 16 and 21, below its own range of 9 to 15, so treat the estimate for text like that as a floor. An earlier version of the tool gave 13, 12 and 12 for the Hindi, English-letter and minified JSON samples, which understated them.

## Code

Published sources agree on the direction: code uses more tokens than prose for the same number of characters, because keywords, operators, brackets and indentation are split up.

- One engineering write-up puts code at 1.5 to 2.5 times more token-dense than prose, and says a retrieval system pulling code snippets used about 40 percent more tokens than the same volume of documentation prose.
- Another says indented Python with short variable names can run at 2 to 3 characters per token.
- A test of the four-characters rule on real samples with OpenAI's tokenizer found it wrong by anywhere from minus 67 percent to plus 46 percent, and warned that IDs, log lines, JSON and code make the rule understate the cost.

As a worked example of the arithmetic: our 70-character Python sample would be about 18 tokens at four characters per token, and about 23 to 35 tokens at 2 to 3 characters per token. It actually took 21 tokens on both OpenAI tokenizers, about 3.3 characters per token, so the four-characters rule understated it a little and the 2-to-3 rule overstated it. One short sample proves nothing general, and other tokenizers will differ.

**What to do:** do not send code you do not need. Strip comments the model does not need, send the relevant function rather than the whole file, and count a real sample before you budget.

## JSON

Every bracket, quote, colon and comma is a character that may use tokens, and keys repeat for every record.

- One guide says brackets, colons and quotes add up quickly.
- Another estimates that wrapping data in JSON adds roughly 20 to 40 percent token overhead compared with plain text holding the same information.

Our pretty-printed sample has 184 characters and the minified one 85, so the pretty version is more than twice as long in characters. The token counts show the same: 68 for the pretty version against 34 for the minified one on o200k (68 against 33 on cl100k). Tokenizers can group whitespace with neighbouring characters, so the saving is not guaranteed to match the character saving on other data. Count both versions of your own JSON.

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

In our own sample, the Hindi sentence took 27 tokens on o200k and 49 on cl100k, against 9 for the English sentence, so about 3 and 5.4 times. These are different texts and different tokenizers, which is why the numbers range from about 1.6 times to several times. A cautious planning approach is to assume Hindi will cost noticeably more than the same message in English, and then measure your own text.

Writing Hindi in English letters lowered the token count in our sample (16 against 27 on o200k, 21 against 49 on cl100k), but we do not know how it affects answer quality for your model, so test that before you rely on it.

## Why not just use one multiplier?

Because the multiplier depends on all four factors at once. A newer tokenizer can shrink Hindi counts, while a model update can raise counts for the same text. Anthropic's own documentation notes that its newer tokenizer produces about 30 percent more tokens for the same text than earlier models. See [why token counts differ between models](post:why-token-counts-differ-between-models).

For which prompt habits really save tokens, see [how to save tokens in a prompt](post:how-to-save-tokens-in-a-prompt-myths-tested). For images, PDFs, audio and more languages, see [how many tokens each input type uses](post:how-many-tokens-by-input-type).

## How to get a real number

1. Open the [Token Counter](tool:token-counter) and paste a realistic sample of your own text, not a toy example.
2. Choose an exact OpenAI tokenizer (o200k or cl100k) if you use OpenAI models. The estimate mode is a guide, and the Token Counter shows a likely range for it.
3. For other models, recount with that provider's own token counting, since the tool's figure is an estimate.
4. Add a safety margin to your budget, and re-measure when you change model.
5. Turn the count into money in the [Cost Forecaster](tool:cost-forecaster), using the live prices on [Model Prices](tool:model-prices).

## A note on our estimate mode

We changed how the estimate mode counts after writing the first version of this guide, because it treated every text like English prose. It now counts words, numbers, punctuation, line breaks and each script separately, and the Token Counter shows a likely range instead of a single number. We checked it on 32 short texts (English, code, JSON, HTML, Hindi and other scripts, European languages and emoji) against OpenAI's o200k and cl100k tokenizers. On those texts it was within roughly 10 percent of the middle of the two exact counts on average, and the exact counts fell inside its range for 31 of 32. On the six samples in this guide, the exact counts fell inside its range for five. It is weakest on romanized Hindi and on French, German and Spanish, where it ran about 10 to 35 percent low, and it runs a little high on SQL and URLs. Anthropic and Google counts can differ from both OpenAI tokenizers, so treat any estimate as a guide. Where exact tokenizers are available in the tool, use those.

## Frequently asked questions

### How many tokens does Hindi use compared with English?

More, usually. The examples we found range from about 1.6 times for one short sentence to several times per word in a research study, depending on the tokenizer and the text. Measure your own text with the tokenizer your model uses.

### Does JSON cost more than plain text?

Usually, yes. Brackets, quotes and repeated keys add tokens. One guide estimates 20 to 40 percent overhead against plain text for the same information. Pretty-printing adds more: our sample took 68 tokens pretty-printed and 34 minified.

### Is minified JSON cheaper?

Yes, in our sample: 34 tokens against 68 for the pretty-printed version on o200k. The saving in tokens can differ from the saving in characters on other data, so count both versions of yours.

### How many tokens is a line of code?

It varies by language, naming and indentation. Published rules of thumb range from about 2 to 3 characters per token for indented Python to 1.5 to 2.5 times the density of prose. Count a real sample.

### Are the numbers in this guide exact?

The token counts for our six samples are exact for OpenAI's o200k and cl100k tokenizers. The estimate column is our tool's estimate, and the other figures are published by others on their own texts. We did not run Claude or Gemini tokenizers, so counts for those models can differ.

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
- Character and byte counts and exact o200k and cl100k token counts: measured by us on the sample texts in this guide, 20 November 2026. Estimate-mode figures: computed by our tool.
