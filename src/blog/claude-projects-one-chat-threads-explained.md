---
title: Claude Projects Is Now One Chat With Threads
description: Claude Projects is now one long chat that starts parallel threads. What changed, what is confirmed about buttons and reactions, and the usage catch.
date: 2026-11-20
image: /assets/blog/claude-projects-one-chat-threads-explained-hero.jpg
imageAlt: One project chat in the middle starting several parallel threads
tools: cost-forecaster, token-counter
related: ai-agent-vs-chatbot-vs-batch-cost, context-windows-explained
guide: no
---
If your Claude Projects suddenly look different, you are probably seeing Anthropic's redesign. A project used to be a folder of chats with shared files and instructions. In the new version, a project is **one ongoing conversation** that hands work to separate threads. This post explains what changed, what Anthropic has confirmed, what is only reported by others, and the one cost catch to know about.

> **Written on 20 November 2026.** The new Projects experience is in beta and still rolling out, so details may change. Check Anthropic's pages (linked at the end) for the latest.

[[toc]]

## What changed

**Before:** a project was a container. You opened it, started a new chat inside it, and each chat read the same instructions and files.

**Now:** a project is a single long-running conversation. Anthropic's announcement of 17 September 2026 says: "Projects have threads that do the work and a coordinator that directs them." You describe what you need as it comes up, and Claude decides whether to answer in place, start a new thread, or pass the work to a thread already running in that area.

## How the pieces fit

- **The project conversation.** One chat where Claude acts as coordinator. It sees what threads report back, not every step they take. You do not manage the context window: the docs say threads compact automatically and the conversation works from recent messages, recent threads and project memory.
- **Threads.** The workers. Each is usually a separate Claude Code cloud session with its own context, branch and copy of the repository. Threads run in parallel and keep going after you close your laptop. In the project chat, each new thread appears as a card with its title and status.
- **Overview pane.** A side panel listing threads by state, such as working, waiting on you, ready for review and resolved, plus tabs for the Library (files), Pull requests and Scheduled tasks.
- **Project memory and instructions.** Notes Claude keeps, and a brief you write once, are given to every new thread, so a rule you state once reaches all of them.

## Buttons, reactions and emoji

The docs confirm **buttons**. Claude can show a "Suggested threads" list you start with a click, and a thread's card can offer buttons such as Resolve conflicts, Fix CI, Address comments and Merge it, which send that instruction to the thread.

**Reactions and emoji are not mentioned** in Anthropic's announcement, the Projects docs or the release notes we read. One hands-on write-up by an independent author reports that Claude reacted with a 👍 to a casual note instead of replying, and compares the chat to Slack. That is one person's observation, not documentation, so treat it as unconfirmed.

## What was reported on 13 November

Third-party summaries of an update announced on 13 November 2026 report:

- The coordinator became more proactive, answering questions in the chat and posting thread status without being asked, with a way to tell it how often to post.
- Reminders for a thread, and `/btw` (a side thread for a tangent) and `/fork` (a new thread from the current thread's state).
- Read-only sharing of a single thread.

We could not read the primary announcement, and the Projects docs page we read still said projects and threads cannot be shared. Confirm these in the docs before relying on them.

## Who has it

The docs describe a public beta on Pro and Max plans, rolling out gradually, and not yet on Team or Enterprise. Anthropic's help article says some existing projects are being moved in stages, with an email first for people who used a project in the last 30 days, and that instructions, files and chat history carry over. Projects in regular chat and Cowork stay on the current version for now.

Separately, on 16 September 2026 Anthropic merged Cowork and chat into one Claude. Its release notes say chats, Cowork tasks, projects, connectors and skills carry over.

## The usage catch

Each thread is a full session, and several can run at once, so a project can use your plan's limits faster than a single chat. A thread that reaches a limit waits and continues when the limit resets. The docs also set a daily cap on new threads; the figure differs between sources, so check the current docs. For the cost logic behind this, see [why agents cost more than a chatbot](post:ai-agent-vs-chatbot-vs-batch-cost) and [how context windows work](post:context-windows-explained). If you build on the API, use the [Cost Forecaster](tool:cost-forecaster) to model an agent-style workload.

## Tips for the new layout

1. Put standing rules in the project instructions, not in individual messages.
2. Ask Claude to propose threads before starting them until you trust how it splits work.
3. Use Overview to find threads waiting on you.
4. Start a fresh thread for new work instead of reviving a long-idle one.

## Frequently asked questions

### What is the new Claude Projects?

A project is now one ongoing conversation where Claude coordinates parallel threads, which are separate cloud sessions. It replaces the folder-of-chats model.

### Why do my projects look different?

You may have been moved to the new version, which Anthropic is rolling out in stages. Instructions, files and chat history carry over.

### Does Claude react with emoji in projects?

Anthropic's documentation does not describe emoji reactions. One independent write-up reports a 👍 reaction, so it may exist but is unconfirmed.

### Do threads use more of my plan?

Yes, they can. Each thread is a full session, so several running at once use limits faster than one chat.

### Can I share a project?

The docs we read say a project belongs to one user. A 13 November update reportedly added read-only sharing of a single thread; verify in the docs.

Sources:
- [Projects redesigned: from folder to conversation (Anthropic, 17 Sept 2026)](https://claude.com/blog/projects-redesigned)
- [Let Claude coordinate ongoing work with Projects (Claude Code docs)](https://code.claude.com/docs/en/claude-projects)
- [What are projects? (Claude Help Center)](https://support.claude.com/en/articles/9517075-what-are-projects)
- [Claude release notes (Help Center)](https://support.claude.com/en/articles/12138966-release-notes)
- [Claude Code Projects update, 13 Nov 2026 (explainx, third-party)](https://explainx.ai/blog/claude-code-projects-proactive-coordinator-november-2026)
- [Claude Projects decoded (independent author)](https://akshaychugh.xyz/writings/png/claude-projects-hearthbot)
