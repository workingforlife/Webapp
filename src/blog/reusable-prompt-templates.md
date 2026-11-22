---
title: Reusable Prompt Templates With Variables
description: Write a prompt once and fill in the blanks each time. Build reusable AI prompt templates with variables, with three examples and sharing tips.
date: 2026-11-19
updated: 2026-11-22
image: /assets/blog/reusable-prompt-templates-hero.jpg
imageAlt: A prompt template with highlighted variable blanks
tools: prompt-builder, prompt-token-optimizer, token-counter
related: cut-your-llm-bill, reliable-json-from-llm
---
If you send the same kind of prompt again and again, you are probably retyping it, and probably forgetting a detail now and then. A prompt template fixes both. You write the fixed wording once, mark the parts that change as variables, and fill in only those parts each time.

[[toc]]

## What a prompt template is

A template is a prompt with blanks. In the [Prompt Builder](tool:prompt-builder) you write a variable in double curly braces, such as `{{audience}}`. The tool turns each variable into a box. You fill in the boxes, and it builds the final prompt, ready to copy.

For example, a support team can save one template for replying to customers, with boxes for tone, policy and the customer message. Each new ticket then takes three boxes, not a whole new prompt.

## Three templates to start with

**Summarize for an audience**

```
Act as a {{role}}.
Summarize the following for {{audience}} in {{length}} words:

{{text}}
```

**Customer reply**

```
Write a reply to the customer message below.
Tone: {{tone}}
Follow this policy: {{policy}}

Customer message:
{{message}}
```

**Structured extraction**

```
From the text below, extract {{fields}}.
Return only a JSON object, with no other text.

Text:
{{text}}
```

The last one pairs well with [getting reliable JSON from an LLM](post:reliable-json-from-llm).

## Rules for good templates

- **Name variables for what they hold.** `{{customer_message}}` is clearer than `{{input1}}`.
- **Keep the fixed part stable.** Put what never changes in the template and what changes in variables, so results stay consistent.
- **Say the output format in the template**, such as the length or "return only JSON", so you do not forget it. Adding "reply in plain text, with no Markdown" avoids stray symbols; for text that already has them, see [how to remove Markdown and hidden characters](post:remove-markdown-and-hidden-characters-from-ai-text).
- **Do not add a variable for everything.** A few well-chosen blanks beat ten.
- **Test with a real example** before you save it, and keep the best version.

## Keep the cost in check

A template that you reuse is sent many times, so its length adds up. Count it with the [Token Counter](tool:token-counter), and trim repeated filler with the [Prompt Token Optimizer](tool:prompt-token-optimizer), which lets you review every change and shows what it saves. For more ways to reduce spend, see [seven ways to cut your LLM bill](post:cut-your-llm-bill).

## Saving and sharing

- **Saved templates** are stored in your browser, on that device only. Use **Export all** to back them up or move them to another device.
- **Share links** encode the template inside the link, so nothing is stored on a server. Anyone with the link can read it, so keep secrets out of templates. Long templates make long links.
- Nothing is uploaded. Everything runs in your browser.

## Frequently asked questions

### Where are my saved templates stored?

In your browser on the device you use. Use Export all to back them up or move them.

### How do share links work?

The template is encoded inside the link itself. Anyone with the link can read it, so do not put private details in a template.

### Is anything uploaded?

No. Everything runs in your browser.

### How many variables should a template have?

As few as you need. Use variables for the details that really change each time, and keep the rest as fixed wording.

## Sources

- [Anthropic: Prompt templates and variables](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompt-templates-and-variables) (fixed content and variable content)
- [Anthropic: Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [OpenAI: Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) (automatic for prompts of 1,024 tokens or more, cached input billed at a reduced rate)
