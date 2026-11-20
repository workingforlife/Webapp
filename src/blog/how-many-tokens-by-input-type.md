---
title: How Many Tokens Do Images, PDFs & Code Use?
description: Tokens per image, per PDF page, per minute of audio, and for code, tables and Hindi. Measured counts plus the official rules from each provider.
date: 2026-11-20
image: /assets/blog/how-many-tokens-by-input-type-hero.jpg
imageAlt: Different input types shown with their token counts: text, code, a table, an image and a PDF page
tools: token-counter, cost-forecaster, pdf-to-text
related: how-many-tokens-do-code-json-and-hindi-use, why-token-counts-differ-between-models
---
Models bill by the token, but a token is not a fixed amount of anything. The same cost question has different answers for English prose, Hindi, a spreadsheet, a screenshot and a PDF. This guide goes through each input type, with counts we measured ourselves and the official rules for images, documents and audio.

[[toc]]

## Read this first

- **Measured by us:** the text and code figures below come from 32 short samples we wrote, run through OpenAI's two public tokenizers, o200k (used by recent OpenAI models) and cl100k (older). They are one sample per type, usually 40 to 190 characters, so read them as a guide to the pattern, not a law.
- **Published by the providers:** the image, PDF, audio and video rules come from the providers' own documentation and are cited at the end. Where a figure is only reported by a third party, we say so.
- **Not measured:** we did not run Anthropic's or Google's tokenizers on the text samples, because they cannot run offline. Their counts can differ. See [why token counts differ between models](post:why-token-counts-differ-between-models).

## The short version

| Input | What drives the token count | Planning rule |
|---|---|---|
| English prose | Words | About 4 to 5 characters per token in our samples |
| Other European languages | Longer words, accents | Slightly more tokens per character than English in our samples |
| Hindi and other Indic scripts | Script and tokenizer | About 3 to 6 times English per character in our samples, and it varies a lot by tokenizer |
| Chinese, Japanese, Korean | Close to one token per character | About 0.7 to 0.9 tokens per character in our samples |
| Code | Symbols, indentation, names | About 3 characters per token in our samples |
| JSON, HTML, tables, URLs | Punctuation and repeated structure | About 2.5 to 3 characters per token for these samples; number-heavy tables can be lower |
| Images | Pixel dimensions, not file size | Hundreds to a few thousand tokens each |
| PDFs | Pages, and on some APIs both text and a page image | Per page, not per word |
| Audio and video | Duration | A fixed rate per second on Google's API |

## Text in different languages

Here is what we measured on one sentence or short passage per language. The last column is the o200k count per 100 characters, so a higher number means more tokens for the same length.

| Sample | Characters | o200k tokens | cl100k tokens | o200k tokens per 100 characters |
|---|---|---|---|---|
| English prose, 8 repeated sentences | 1184 | 233 | 233 | 20 |
| English prose, short | 136 | 29 | 29 | 21 |
| Business email text with a number and date | 152 | 44 | 44 | 29 |
| Spanish | 125 | 32 | 34 | 26 |
| French | 115 | 31 | 35 | 27 |
| German | 124 | 28 | 35 | 23 |
| Russian | 111 | 30 | 45 | 27 |
| Arabic | 86 | 30 | 63 | 35 |
| Hindi (Devanagari) | 100 | 57 | 105 | 57 |
| Hindi in English letters | 112 | 33 | 42 | 29 |
| Tamil | 121 | 73 | 165 | 60 |
| Bengali | 106 | 67 | 134 | 63 |
| Chinese | 42 | 37 | 44 | 88 |
| Japanese | 46 | 36 | 49 | 78 |
| Korean | 58 | 39 | 55 | 67 |

Three things stand out:

- **The two tokenizers can disagree a lot.** Hindi came out at 57 tokens on o200k and 105 on cl100k for the same text. Tamil was 73 against 165. A newer tokenizer can shrink non-English counts, so the model you use matters as much as the language.
- **Chinese, Japanese and Korean have few characters but not few tokens.** The Chinese sample is 42 characters and 37 tokens on o200k, close to one token per character. Comparing character counts across languages tells you very little.
- **Hindi written in English letters was cheaper than Devanagari** in both tokenizers (33 and 42 tokens for 112 characters, against 57 and 105 for 100). For a deeper look at Hindi, code and JSON, see [how many tokens code, JSON and Hindi use](post:how-many-tokens-do-code-json-and-hindi-use).

## Code, tables and structured data

| Sample | Characters | o200k tokens | cl100k tokens | o200k tokens per 100 characters |
|---|---|---|---|---|
| Markdown with headings and bullets | 131 | 32 | 32 | 24 |
| Python | 110 | 37 | 37 | 34 |
| JavaScript | 120 | 43 | 44 | 36 |
| SQL | 164 | 49 | 49 | 30 |
| HTML | 123 | 49 | 49 | 40 |
| JSON, minified | 97 | 38 | 37 | 39 |
| JSON, pretty-printed | 184 | 68 | 68 | 37 |
| Comma-separated numbers and dates | 83 | 58 | 58 | 70 |
| Markdown table | 104 | 46 | 46 | 44 |
| URLs and an ID | 122 | 40 | 40 | 33 |
| Emoji | 57 | 15 | 20 | 26 |
| Odd spacing and blank lines | 60 | 16 | 16 | 27 |

What this shows:

- **Code and structured text use more tokens per character than prose.** English prose came out around 18 to 21 o200k tokens per 100 characters. Python, JavaScript, SQL and HTML ran about 30 to 40. The JSON samples ran about 37 to 39, and the numbers-and-dates sample reached 70.
- **Pretty-printing JSON did not add many tokens per character.** The pretty sample used 37 tokens per 100 characters and the minified one 39, so the indentation was cheap. The two were different data, so measure your own before choosing.
- **Digits are expensive.** Dates, IDs and numeric tables split into short pieces. A table of numbers can cost several times more than a paragraph of the same length.
- **A markdown table was close to prose** (46 tokens for 104 characters), while the plain comma-separated numbers were not (58 for 83). The content of the cells matters more than the table format.
- **Emoji and odd spacing** are small here, but they add up in long chat logs. Emoji used about 26 tokens per 100 characters in our sample.

## Images

An image is billed as tokens too, and the count depends on the picture's width and height, not its file size or format. A 50 KB JPEG and a 5 MB PNG with the same pixel dimensions cost the same. Each provider converts pixels to tokens differently.

**Anthropic (Claude).** Claude processes images in 28 by 28 pixel patches, and an image costs ⌈width / 28⌉ × ⌈height / 28⌉ tokens. Images larger than the model's limit are scaled down first. Anthropic's documentation lists two tiers: Claude 4.7 and later models allow a long edge of 2,576 pixels and up to 4,784 visual tokens, and other models allow 1,568 pixels and 1,568 tokens. From Anthropic's own table:

| Image size | Standard tier tokens | High-resolution tier tokens |
|---|---|---|
| 200 x 200 px | 64 | 64 |
| 1000 x 1000 px | 1,296 | 1,296 |
| 1920 x 1080 px | 1,560 (resized to 1456 x 819) | 2,691 |
| 3840 x 2160 px | 1,560 (resized to 1456 x 819) | 4,784 (resized to 2576 x 1449) |

Anthropic's older guidance used a rough rule of width × height ÷ 750, which gives about 1,334 tokens for a 1000 x 1000 image. The current documentation uses the patch rule above. If a guide or calculator still quotes the older rule, expect small differences.

**OpenAI.** Recent OpenAI models cover the image in 32 by 32 pixel patches and charge one token per patch, up to a limit that depends on the model and on the `detail` setting. For example, OpenAI's documentation says `gpt-5.5` allows up to 2,500 patches in `high` and up to 10,000 in `original`, and that omitting `detail` can behave like `original` on some models, so large images can cost more than you expect. Some smaller models multiply the patch count. Older models such as GPT-4o are reported to use a different tile rule: 85 base tokens plus 170 per 512 pixel tile in high detail, and a flat 85 in low detail. Check the page for your exact model.

**Google (Gemini).** Google's documentation says images up to 384 pixels in both dimensions count as 258 tokens, and larger images are cut into 768 by 768 pixel tiles, each counted as 258 tokens.

Two lessons hold for all three. Resolution is the lever, so downscale screenshots and photos to the size the model actually needs. And the same image can cost very different amounts on different providers, so compare before you pick a model for an image-heavy job.

## PDFs and other files

A file is not a token count. What the model sees depends on how the file is read.

- **Claude and PDFs.** Anthropic's PDF support converts each page into an image and also supplies the page's extracted text. Its documentation puts the text side at about 1,500 to 3,000 tokens per page depending on density, and says the image side is billed with the same calculation as any other image, so you pay for both. That is why a long PDF can use far more tokens than its words alone would.
- **Gemini and PDFs.** Google's documentation says PDF input files are treated as images, so each page is tokenized the way an image is. A flat 258 tokens per page is widely quoted. A Google developer forum thread attributes it to Google's document-processing page, and a reply there calls it an approximate average for text-only pages, not a fixed value. We could not open that page ourselves, so use Google's count-tokens call on a real file.
- **OpenAI and PDFs.** OpenAI's PDF guide says it puts both the extracted text and an image of each page into the model's context, so, as with Claude, you pay for both.
- **Text extracted first.** If you extract the text yourself, you pay only for the text. A scanned PDF with no text layer has nothing to extract, so it has to go through the image route or through OCR. Our [PDF to Text](tool:pdf-to-text) tool extracts a PDF's text in your browser and shows a token estimate, and [this guide](post:pdf-to-ai-chatbot-without-wasting-tokens) covers the trade-offs.
- **Word, Excel and CSV.** These are converted to text before the model reads them, so count that text. For spreadsheets, remember the digits and punctuation rule above: a large numeric sheet costs more per character than prose.

## Audio and video

Google's documentation gives fixed rates for Gemini: 32 tokens per second of audio and 263 tokens per second of video. That makes a 10-minute audio clip about 19,200 tokens and a 10-minute video about 157,800 tokens. Other providers handle audio and video differently, some by transcribing first and some with their own rates, so check the provider's page before budgeting.

## A worked example

A support assistant receives one 1000 x 1000 pixel screenshot and a 600-character English question. Using the figures above:

- The screenshot: 1,296 tokens on a Claude model, from Anthropic's table.
- The question: about 120 to 150 tokens, at the 4 to 5 characters per token we saw for English prose.
- Together: about 1,400 input tokens, so the image is roughly nine-tenths of the input. Sending the screenshot at half the width and height would bring its cost to about 324 tokens (500 x 500 px is 18 x 18 patches).

To cut tokens in a prompt you already have, see [how to save tokens in a prompt](post:how-to-save-tokens-in-a-prompt-myths-tested), and for pasting versus attaching a file, [paste or upload](post:paste-or-upload-which-uses-fewer-tokens).

## How to get a real number

1. Paste your own text into the [Token Counter](tool:token-counter). Choose an OpenAI tokenizer for an exact count on OpenAI models. In estimate mode it adjusts for code, JSON and non-English text and shows a likely range.
2. For images, PDFs and audio, use the provider's own count-tokens call on a real file. Anthropic and Google both offer one.
3. Add a margin and re-measure when you change models.
4. Turn the count into money with the [Cost Forecaster](tool:cost-forecaster).

## Frequently asked questions

### Do images cost more than text?

Usually, per item. A mid-size image is on the order of a thousand tokens, which is about what a long page of English costs. The price per token is the same as for text on the same model.

### Does a bigger file cost more tokens?

For images, no. The count depends on pixel dimensions, not file size. For PDFs, more pages means more tokens, and a PDF with a lot of text per page costs more per page.

### Is Hindi always more expensive than English?

In our samples, yes on both OpenAI tokenizers, but by very different amounts. Devanagari cost about 3 to 5 times as many tokens per character as English prose, depending on the tokenizer.

### Are these counts exact?

The text and code counts are exact for the two OpenAI tokenizers on our samples only. Other models and other texts will differ. The image, PDF and audio rules are the providers' published rules and can change between models.

## Sources

- [Anthropic: Vision](https://platform.claude.com/docs/en/build-with-claude/vision) (28 x 28 patches, resolution tiers, size table)
- [Anthropic: PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support) (page converted to image plus text, 1,500 to 3,000 text tokens per page)
- [OpenAI: Images and vision](https://developers.openai.com/api/docs/guides/images-vision) (32 pixel patches, detail levels, patch limits)
- [Google: Understand and count tokens](https://ai.google.dev/gemini-api/docs/interactions/tokens) (258 tokens per image up to 384 pixels, 768 pixel tiles, 32 tokens per second of audio, 263 per second of video)
- [Roboflow: Vision token counts](https://roboflow.com/blog/image-token-cost-vlm) (comparison of the three providers' image rules)
- [Google Firebase: Count tokens for Gemini models](https://firebase.google.com/docs/ai-logic/count-tokens) (PDF pages tokenized like images, no per-page figure)
- [OpenAI community: PDF content in a prompt](https://community.openai.com/t/how-does-openai-charge-tokens-when-sending-pdf-content-in-a-prompt/1280985) (quotes OpenAI's PDF guide: extracted text plus a page image)
- [Google AI Developers Forum: Gemini API PDF input token limit exceeded](https://discuss.google.dev/t/gemini-api-pdf-input-token-limit-exceeded/335444) (quotes the 258 tokens per page line from Google's document page; a reply calls it an approximate average)
- [Fast.io: Gemini token counter](https://fast.io/resources/gemini-token-counter/) (reported 258 tokens per PDF page on Gemini)
- Text and code token counts: measured by us with the o200k and cl100k tokenizers on short sample texts written for this guide.
