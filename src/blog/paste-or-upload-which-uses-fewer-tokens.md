---
title: Paste or Upload: Which Uses Fewer Tokens?
description: Is it cheaper to paste text or upload a file to an AI? It depends on the file type. What PDFs, text files and long pastes cost, with a worked example.
date: 2026-11-20
image: /assets/blog/paste-or-upload-which-uses-fewer-tokens-hero.jpg
imageAlt: Pasted text compared with an uploaded PDF, with the PDF adding a page image to the token count
tools: pdf-to-text, token-counter, cost-forecaster
related: how-to-save-tokens-in-a-prompt-myths-tested, pdf-to-ai-chatbot-without-wasting-tokens
---
You can give an AI a document by pasting its text or by attaching the file, and people often ask which uses fewer tokens. The honest answer is that it depends on the kind of file and on where you are using it, not on pasting versus uploading as such. For a plain text file the cost is about the same. For a PDF it can be much higher.

[[toc]]

## Read this first

- **What we checked:** the providers' own documentation for how files are read, plus the Anthropic and OpenAI help pages. Where only a third party reports something, we say so.
- **What we did not measure:** we did not run files through the chat apps ourselves, and app behaviour changes often. For an exact number, use the provider's token-counting call on your own file.
- **Why tokens matter here:** in a chat, a document you add stays in the conversation and is carried with every later message. A large file is paid for again and again, so its size matters more than how it arrived.

## The short version

| What you send | What the model receives | Compared with pasting the text |
|---|---|---|
| Plain text, code, Markdown or CSV file | The text | About the same |
| Word, HTML, EPUB and similar documents | Text [[tip:text-extraction::extracted]] from the file | About the same as the extracted text |
| PDF through the API (Claude or OpenAI) | The extracted text plus a [[tip:page-image::page image]] for each page | More: you pay for both |
| PDF in claude.ai | Text, plus images for some PDFs | Usually text only; images for multimodal PDFs |
| Scanned PDF or photo of text | Page images, no text | Much more than pasting typed text |
| Very long paste in a chat app | Often converted into an attachment | Same tokens, handled as a file |

## Text files: no real difference

Anthropic's help centre says that for non-PDF documents, Claude extracts text only. That means a text, Word or Markdown file arrives as text, and the token count is the count of that text. Pasting the same words gives the same cost, with two small exceptions: the file's formatting may add or drop characters, and hidden characters or odd line breaks in either version cost extra. Our [token myths guide](post:how-to-save-tokens-in-a-prompt-myths-tested) shows how much those can add.

## PDFs: the one case where pasting wins

Both Anthropic and OpenAI treat a PDF as more than text through the API.

- **Claude:** each page is converted to an image and the page's text is extracted and supplied alongside it. Anthropic's documentation puts the text side at about 1,500 to 3,000 tokens per page and says the image side is billed like any other image.
- **OpenAI:** the file inputs guide says PDF parsing includes both extracted text and page images in context, which can increase token usage. In the Responses API you can set `detail` to control the image side, and the text is still included.
- **Gemini:** Google's documentation says PDF input files are treated as images, so each page is tokenized in the same way as an image. A flat 258 tokens per page is widely quoted. A Google developer forum thread attributes it to Google's document-processing page, and a reply there calls it an approximate average for text-only pages, not a fixed value. We could not open that page ourselves, so check with Google's count-tokens call on a real file.

If the PDF is plain text with no diagrams, you can usually extract the text yourself and paste it, and you pay only for the text. Our [PDF to Text](tool:pdf-to-text) tool does this in your browser and shows a token estimate. The [PDF to AI chatbot guide](post:pdf-to-ai-chatbot-without-wasting-tokens) covers cleaning headers and page numbers first.

Keep the PDF when pictures, charts or layout carry the meaning, because the text alone loses them.

### A worked example

Take a 20-page text-only PDF sent through the Claude API on a standard-tier model. The image side per page is capped at 1,568 tokens, so the page images add up to about 31,000 tokens at most (20 pages x 1,568). That is on top of the text tokens. If you paste the extracted text, you pay only for the text. For a text-only document, that is the saving, and it recurs every turn the document stays in the chat. Your own figures will vary with page size and content, so check with the count-tokens call.

## Scans and images of text

A scanned page has no [[tip:text-layer]], so an upload goes through the image route. You pay image tokens per page, and the model reads the picture. Running [[tip:ocr::OCR]] first and pasting the result is often cheaper, but OCR errors can change numbers and names, so proof-read anything important.

## What chat apps do with long pastes

Chat apps sometimes decide for you. Third-party write-ups report that ChatGPT turns pastes over roughly 5,000 characters into a file attachment, and that Claude does something similar around 20,000 characters. We could not confirm those thresholds on the vendors' own pages, and they change, so treat them as indications. The practical point is that a large paste may already be handled like a file, so pasting is not always a way around file handling.

## Long files and retrieval

Some products do not put the whole file in context and use [[tip:retrieval]] instead. OpenAI's help page for ChatGPT Enterprise says that PDFs over a 110,000-token limit have their text and images embedded in a search index, and the app retrieves the relevant parts. Anthropic's help page says Claude accepts any number of files as long as the total content fits the context window, and a third-party guide reports that Anthropic's help centre says retrieval switches on when a project approaches that limit. Retrieval can use fewer tokens per question, but the model sees only the retrieved parts, so it can miss things that are spread across the document.

## How to choose

1. **Short text, a few pages:** paste it. You can see and trim it, and count it first.
2. **Text-only PDF:** extract the text with [PDF to Text](tool:pdf-to-text), clean it, then paste.
3. **PDF where visuals matter:** upload the PDF and accept the page-image cost, or crop to the pages you need.
4. **Scan or photo:** use the image route, or OCR and proof-read.
5. **Very long reference material you will query repeatedly:** use a project or file-search feature, and consider caching. See [prompt caching and batch discounts](post:prompt-caching-and-batch-discounts-explained).
6. **Always:** count first with the [Token Counter](tool:token-counter), and send only the pages and sections the task needs.

## Frequently asked questions

### Is pasting text cheaper than uploading a file?

For plain text files, no, about the same. For PDFs through an API, pasting extracted text is cheaper because uploads add a page image to each page.

### Does an uploaded file count against my usage limit?

Yes. The file's content becomes part of the conversation, so it counts and is carried with later messages. This is reported by third-party guides and follows from how context works.

### Why did my paste turn into an attachment?

Some chat apps convert long pastes into a file. It changes how the text is displayed, not what the model reads, as far as we can tell from the reports.

### Is a PDF always more expensive than text?

Through the API, yes: both providers send the text and a page image. In some chat apps the image side may be skipped for text-only PDFs, which is why you should check the app's usage display or count first.

[[terms]]

## Sources

- [Anthropic: PDF support](https://platform.claude.com/docs/en/build-with-claude/pdf-support) (page converted to an image plus extracted text, 1,500 to 3,000 text tokens per page)
- [Anthropic: Vision](https://platform.claude.com/docs/en/build-with-claude/vision) (image token cost, 1,568-token cap on standard-tier models)
- [Anthropic help: Upload files to Claude](https://support.claude.com/en/articles/8241126-upload-files-to-claude) (text extraction for non-PDF documents, content must fit the context window)
- [OpenAI: File inputs](https://developers.openai.com/api/docs/guides/file-inputs) (PDF parsing includes text and page images, `detail` setting)
- [OpenAI help: ChatGPT Enterprise file uploads](https://help.openai.com/en/articles/10029836) (110,000-token limit and retrieval for long PDFs)
- [Google Firebase: Count tokens for Gemini models](https://firebase.google.com/docs/ai-logic/count-tokens) (PDF pages tokenized like images, no per-page figure)
- [Google AI Developers Forum: Gemini API PDF input token limit exceeded](https://discuss.google.dev/t/gemini-api-pdf-input-token-limit-exceeded/335444) (quotes the 258 tokens per page line; a reply calls it an approximate average)
- [MindStudio: ChatGPT 5K character attachment rule](https://www.mindstudio.ai/blog/chatgpt-5k-character-attachment-rule-context-window) (reported paste threshold)
- [Fast.io: Claude character limit](https://fast.io/resources/claude-character-limit/) (reported paste threshold)
- [ClaudeKit: How PDFs, images and files count against Claude usage](https://claudekit.app/blog/claude-file-uploads-usage) (reported: file content carried with later messages)
