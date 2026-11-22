---
title: Remove Markdown and Hidden Characters
description: Pasting AI text into email or documents can bring stray symbols and invisible characters. See what they are, what they break and how to clean them safely.
date: 2026-11-22
image: /assets/blog/remove-markdown-and-hidden-characters-from-ai-text-hero.jpg
imageAlt: AI text with Markdown symbols turned into clean plain text
tools: text-cleaner, token-counter
related: reusable-prompt-templates, how-many-tokens-is-my-text
---
You copy a reply from an AI chat, paste it into an email or a document, and it arrives with stray `##` and `**` symbols, odd spacing or dashes you did not expect. Sometimes there are also characters you cannot see at all. This guide explains what they are, what problems they cause and how to clean them in one step without changing your wording.

[[toc]]

## Why the symbols appear

AI tools write in Markdown, a plain-text way of marking headings, bold text, lists and links. Chat apps turn that Markdown into formatted text on screen. When you copy the raw text, or paste it somewhere that does not understand Markdown, the symbols show up as they are.

| You see | What it was meant to be |
|---|---|
| `## Heading` | a heading |
| `**word**` | bold |
| `*word*` | italics |
| `- item` | a bullet point |
| a word between backtick marks | code |
| `[text](https://example.com)` | a link |

## Invisible characters

Some text also carries characters that take up no visible space. The common ones are the zero-width space, the soft hyphen, the zero-width joiners and the non-breaking space, which looks like a normal space but behaves differently.

Where they come from varies. People have reported them in AI output, and they also come from web pages, word processors and other tools. We cannot say how often any particular AI tool adds them, and some people who tried to reproduce the reports could not. What matters is that if they are in your text, they can cause trouble:

- A search for a word fails because an invisible character sits inside it.
- A link or a command stops working after you paste it.
- A spreadsheet cell does not match another cell that looks identical.
- A word or character count is slightly off.

## Dashes and quotes

Two more things often need a tidy-up, but only if you want them to:

- **Em dashes** (the long dash) are a matter of house style. Some writers like them and some do not. The [AI Text Cleaner](tool:text-cleaner) can swap them for a comma, a spaced hyphen or a space.
- **Curly quotes** can break code, CSV files and some forms that expect straight quotes. The tool can straighten them.

Both are options you switch on or off, not something the text needs.

## Clean it in one step

1. Open the [AI Text Cleaner](tool:text-cleaner) and paste your text.
2. Leave on the options you want: strip Markdown, remove invisible characters, replace em dashes, straighten quotes, collapse extra spaces.
3. Read the note under the result. It tells you how many characters changed and what kinds of change were made.
4. Copy the result.

Here is a real example. This text has a heading, bold, italics, a link, inline code, an invisible character after "Friday", an em dash and curly quotes:

```
## Launch notes

**Key points:**
- The launch is on *Friday*
- See [the plan](https://example.com/plan)

Use `deploy.sh` — it takes “5 minutes”.
```

With the default options, the tool returns this, and reports that it changed one invisible character, the Markdown formatting, one dash and two smart quotes:

```
Launch notes

Key points:
- The launch is on Friday
- See the plan

Use deploy.sh, it takes "5 minutes".
```

Notice that the link text stays but the web address is dropped. If you need the address, copy it before you clean, or turn off Markdown stripping for that text.

## What the cleaner leaves alone

- Names such as `my_variable_name`. Underscores are only treated as italics when they wrap a whole word or phrase.
- Ranges such as 2010–2020. En dashes are only replaced when there are spaces on both sides.
- Your words. It does not rewrite, paraphrase or reorder anything.

It also does not convert tables, so check any table by eye after cleaning.

## A note on what this is for

Cleaning is about formatting: making text paste cleanly into the place you need it. It does not change who wrote the text, and we do not claim it affects whether any detector or reader will think the text came from an AI. If a rule, such as a school or workplace policy, asks you to disclose AI use, cleaning the formatting does not change that.

## If you want plain text from the start

You can ask the model for plain text when you write the prompt, for example "Reply in plain text, with no Markdown." That is also useful when you send the output to a system that does not render Markdown. A reusable prompt can include this line every time. See [reusable prompt templates](post:reusable-prompt-templates).

## Tokens and cleaning

Markdown symbols and invisible characters can add a few tokens, so cleaning text before you send it back to a model can trim the count slightly. The effect is small, so do it for tidiness, not for savings. You can compare the before and after counts in the [Token Counter](tool:token-counter).

## Frequently asked questions

### Is my text uploaded when I clean it?

No. The cleaning runs in your browser.

### Why does the character count change after cleaning?

Removed symbols, invisible characters and collapsed spaces all reduce the count. The tool shows the before and after counts and what changed.

### Does cleaning hide that text came from an AI?

No, and it is not designed to. It only fixes formatting. We make no claim about detection.

### Can I keep the Markdown?

Yes. Turn off "Strip Markdown" and leave the other options on.

## Sources

- [Originality.ai: Invisible text detector and remover](https://originality.ai/pt/blog/invisible-text-detector-remover) (what invisible and typographic characters are)
- [Reddit r/PromptEngineering: report of invisible characters in ChatGPT output and replies](https://redlib.hbubli.cc/r/PromptEngineering/comments/1k6apxc/chatgpt_is_extremely_detectable/moqesbq) (an unverified user report, with some users unable to reproduce it)
