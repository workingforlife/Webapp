---
title: How to Choose an LLM for Your Budget
description: A five-step way to shortlist AI models by what your workload costs, then test the shortlist on your own examples before you commit to one.
date: 2026-11-19
image: /assets/blog/choose-an-llm-for-your-budget-hero.jpg
imageAlt: A long list of models narrowed to a short list by cost and context
tools: model-picker, model-prices, cost-forecaster, token-counter
related: compare-llm-api-prices, estimate-monthly-cost-of-an-llm-chatbot
---
There are more than two hundred models on our price list, and no honest way to say which one is "best" for everyone. What you can do is cut the list down by facts that are easy to check, such as what your workload would cost and whether the model can hold your text, and then test the few that remain. This guide shows a five-step way to do it.

[[toc]]

## Step 1: Describe one typical request

Write down what a normal request looks like:

- **Input tokens:** the system prompt, any history or documents, and the new question.
- **Output tokens:** the length of the answer you want, plus reasoning tokens if the model thinks before it answers.
- **Requests per month:** your best estimate, and a pessimistic one.

If you are unsure of the token counts, paste a real sample into the [Token Counter](tool:token-counter). Counts differ between models, so treat them as a guide. See [why token counts differ between models](post:why-token-counts-differ-between-models).

## Step 2: Rule out models that cannot hold your text

A model's context window must be able to hold your input and its output together. A model with a smaller window cannot do the job, however cheap it is. The [Model Picker](tool:model-picker) hides these automatically, and you can set a larger minimum if you want headroom for longer inputs.

## Step 3: Rank the rest by cost for your workload

Price per million tokens is only half of the cost. What you pay depends on your input size, your output size and your volume. Enter them into the Model Picker and it works out the monthly cost for every model that fits, so you can see the real spread instead of comparing price lists by eye.

Here is how wide that spread can be. For a request of 2,000 input and 500 output tokens, run 10,000 times a month, our price list from 18 November 2026 gave a cheapest monthly cost of $1.50, a median of $37.50 and a highest of $1,500 across 195 models. That is a thousand-fold gap between the cheapest and the dearest. [Open that example in the Model Picker](/model-picker#pick~eyJpIjoyMDAwLCJvIjo1MDAsInIiOjEwMDAwLCJjIjowLCJiIjowLCJtIjowLCJ1IjowLCJjdXIiOiIiLCJ4IjpmYWxzZSwic28iOiJjb3N0In0) to see today's figures, because prices change daily.

## Step 4: Build a shortlist of three to five

Do not pick the cheapest model and stop. Pick a handful from different parts of the list:

- The cheapest one or two that fit.
- A mid-priced model from a provider you already use.
- A stronger, more expensive model as a reference point for what "good" looks like.

If you already use a model, select it as your current model in the picker. Each alternative then shows how much more or less it would cost per month.

## Step 5: Test the shortlist on your own examples

This is the step no price list can do for you. Collect 20 to 50 real examples of your task, run them through each shortlisted model, and check the answers against what you would accept. Our guide to [testing before you switch](post:cheapest-llm-vs-best-value-test-before-you-switch) shows how to turn that into a cost per good answer.

## Things the picker cannot tell you

- **Quality.** It ranks by price. It has no quality score on purpose, because any score we invented would be a guess.
- **Cache and batch savings you have not entered.** You can add a cache share and a batch discount, but check that your provider offers them. See [prompt caching and batch discounts explained](post:prompt-caching-and-batch-discounts-explained).
- **Rate limits, speed and availability.** These are not in a price list.
- **Hidden costs.** Retries, longer prompts to get the same result and human review all add to the real cost.

## Next, forecast the shortlist

Once you have two or three candidates, take them to the [Cost Forecaster](tool:cost-forecaster). It handles chatbots and agents, where history makes each turn cost more than the last. You can also open the four cheapest in [Model Prices](tool:model-prices) to compare them side by side.

## Frequently asked questions

### How do I pick the best LLM for my project?

Describe a typical request, rule out models that cannot hold it, rank the rest by monthly cost, shortlist three to five and test them on your own examples. Price and context size narrow the list, and only testing tells you which is good enough.

### Is the cheapest model the best choice?

Not automatically. A cheaper model that gets answers wrong more often can cost more once you count retries and review. Test before you decide.

### How many models should I test?

Three to five is usually enough: one or two cheap ones, a mid-priced one and a stronger reference model.

### Does the Model Picker rank by quality?

No. It ranks by cost for your workload and filters by context size. It has no quality scores.
