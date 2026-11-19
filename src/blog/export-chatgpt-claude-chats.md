---
title: Export ChatGPT and Claude Chats to Word, PDF
description: How to export your ChatGPT and Claude chats, then turn them into Markdown, Word or PDF files in your browser. Step by step, with no upload of your chats.
date: 2026-11-19
image: /assets/blog/export-chatgpt-claude-chats-hero.jpg
imageAlt: A chat conversation turning into Markdown, Word and PDF files
tools: chat-export, text-cleaner, pdf-to-text
related: pdf-to-ai-chatbot-without-wasting-tokens, reusable-prompt-templates
---
Chats with ChatGPT and Claude are easy to lose and awkward to share. Copying them by hand often breaks the formatting, and the official export gives you raw data files, not a readable document. This guide shows two routes: a quick one for a single chat, and the official export for everything. Then it shows how to turn the result into a clean Markdown, Word or PDF document without uploading your chats anywhere.

> **Steps checked on 19 November 2026.** The steps below follow the help pages of [OpenAI](https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data) and [Anthropic](https://support.claude.com/en/articles/9450526-how-can-i-export-my-claude-data). Menu names change over time, so check the vendor's page if something looks different.

[[toc]]

## Quick route: one chat

If you only need one conversation, you do not have to wait for an export.

1. Select the conversation in ChatGPT or Claude and copy it.
2. Open the [Chat Export](tool:chat-export) tool and choose **Paste One Chat**.
3. Paste it. The tool understands lines that start with `You:`, `User:`, `ChatGPT:`, `Claude:` or `Assistant:`.
4. Choose **Convert Pasted Chat**, then download Markdown or Word, or print to PDF.

## Full route: export all your chats

### ChatGPT

1. Sign in to ChatGPT and open your profile menu.
2. Select **Settings**, then **Data controls**.
3. Under **Export data**, select **Export**, then **Confirm export**.
4. Wait for the message. ChatGPT sends an email or SMS when the export is ready, and OpenAI says it can take up to 7 days.
5. Open the message and select **Download data export**. The link expires 24 hours after you receive it, and you must be signed in to the same account.

Self-service export is not available in ChatGPT Business, Enterprise or Healthcare workspaces. In those, contact your workspace owner. OpenAI also notes that an export cannot bring back chats you have already deleted, and that the file can hold sensitive information, so keep it secure.

### Claude

1. Open **Settings**, then **Privacy**, on the web app or Claude Desktop. You cannot start an export from the iOS or Android app.
2. Click **Export data**.
3. Download the file from the link you receive. Anthropic says the link expires 24 hours after delivery.

Anthropic says individual Free, Pro and Max users can export their own data. On Team and Enterprise plans, the organization's Primary Owner exports data, and members can export their own chats only if an owner turns that setting on. The export does not include the contents of files you uploaded.

## Turn the export into a document

1. Open [Chat Export](tool:chat-export) and choose **Upload Export File**.
2. Upload the zip, or unzip it and upload `conversations.json`.
3. Search for the conversation you want and select it.
4. Download **Markdown** or **Word**, or choose **Print / Save as PDF**.

The files are read in your browser and never leave your device. A very large export may take a few seconds to open.

## Which format should you pick?

- **Markdown** keeps headings, lists and code blocks. It is the best choice for notes apps and for pasting into other AI tools.
- **Word** opens in Microsoft Word and Google Docs, so it suits sharing and editing.
- **PDF** is best when you want a fixed copy that looks the same everywhere. Use Print and choose Save as PDF.

## Tips for cleaner results

- **Edited replies:** ChatGPT stores edited and regenerated replies as branches. The tool exports the branch you last saw, so the conversation reads in order.
- **Stray symbols:** if you paste an exported chat somewhere that does not handle Markdown, the [AI Text Cleaner](tool:text-cleaner) removes Markdown symbols and invisible characters.
- **Reusing a chat as input:** long chats cost tokens when you feed them to a model again. See [how many tokens your text uses](post:how-many-tokens-is-my-text) before you paste a whole conversation.
- **Sensitive chats:** treat exported files like any private document. Store them somewhere safe and delete copies you no longer need.

## Frequently asked questions

### Are my chats uploaded to your site?

No. The file is read in your browser and never leaves your device.

### How long does the official export take?

OpenAI says a ChatGPT export can take up to 7 days to arrive. Check Anthropic's help page for Claude, as timing can change. For one chat, the paste route is instant.

### Why is my ChatGPT chat missing replies I edited?

ChatGPT keeps edited and regenerated replies as branches. The tool exports the branch you last saw.

### Can I export from the Claude or ChatGPT phone app?

Anthropic says you cannot start a Claude export from the iOS or Android app. OpenAI says some ChatGPT app versions open the web page to finish the export. Using the web version avoids that.

### Can I import the export into another Claude account?

Anthropic says exported data cannot be imported into another personal Claude account.

## Sources

- [OpenAI: Exporting your ChatGPT history and data](https://help.openai.com/en/articles/7260999-how-do-i-export-my-chatgpt-history-and-data)
- [Anthropic: How can I export my Claude data?](https://support.claude.com/en/articles/9450526-how-can-i-export-my-claude-data)
