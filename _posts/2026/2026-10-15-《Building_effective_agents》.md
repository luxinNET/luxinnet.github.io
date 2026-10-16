---
title: "Building_effective_agents"
date: 2026-10-15
categories: ["Article"]
tags: ["Anthropic Blog", "Agent"]
comments: true
---

## Building effective agents

published Dec 19, 2024

We've worked with dozens of teams building LLM angets across industries. Consistently successful implementations use simle, composable patterns rather tan complex frameworks.

Over the past year, we've worked with dozens of teams building large language model (LLM) agents across industries. Consistently, the most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns.

In this post, we share what we’ve learned from working with our customers and building agents ourselves, and give practical advice for developers on building effective agents.

### What are agents?

"Agent" can be defined in several ways. Some customers define agents as fully autonomous systems that operate independently over extended periods, using various tools to accomplish complex tasks. Others use the term to describe more prescriptive implementations that follow predefined workflows. At Anthropic, we categorize all these variations as agentic systems, but draw an important architectural distinction between workflows and agents:

Workflows are systems where LLMs and tools are orchestrated through predefined code paths.
Agents, on the other hand, are systems where LLMs dynamically direct their own processes and tool usage, maintaining control over how they accomplish tasks.
Below, we will explore both types of agentic systems in detail. In Appendix 1 (“Agents in Practice”), we describe two domains where customers have found particular value in using these kinds of systems.

### When (and when not) to use agents

When building applications with LLMs, we recommend finding the simplest solution possible, and only increasing complexity when needed. This might mean not building agentic systems at all. Agentic systems often trade latency and cost for better task performance, and you should consider when this tradeoff makes sense.

When more complexity is warranted, workflows offer predictability and consistency for well-defined tasks, whereas agents are the better option when flexibility and model-driven decision-making are needed at scale. For many applications, however, optimizing single LLM calls with retrieval and in-context examples is usually enough.

### When and how to use frameworks

### Building blocks, workflows, and agents

### Building block: The augmented LLM

---

## Reading Comprehension Questions（10 题）

学完全文后作答。**用英文回答，每题 1-3 句**，答案写在每题下方。不查原文答题最好，答完再回原文核对。

**Q1.** The article observes that the most successful agent implementations weren't using complex frameworks. What were they using instead, and what does this tell you about how to think about frameworks like LangChain?

**Q2.** Give the article's definitions of *workflows* and *agents*. What is the single most important word that distinguishes them?

**Q3.** The "augmented LLM" is the core building block. Name the three capabilities the article says should be added to a basic LLM, and give a one-line example of each.

**Q4.** In *prompt chaining*, what is a "gate" (e.g. a classifier that checks classification output), and why is it worth paying the extra latency?

**Q5.** For *routing*, the article argues that separating concerns into smaller, more focused prompts works better than one mega-prompt for everything. Explain why, using the customer service triage example.

**Q6.** *Parallelization* has two flavors: **sectioning** and **voting**. Explain the difference, and give one use case for each from the article.

**Q7.** When should you choose *orchestrator-workers* over *prompt chaining*? What kind of task makes the subtasks impossible to define in advance?

**Q8.** *Evaluator-optimizer* is said to mirror a human practice. What human loop does it mirror, and why is it valuable for something like literary translation?

**Q9.** What is the article's core advice about complexity (the "simplest solution" principle)? And what is the trade-off agents make — what do they give you, and what does it cost? Give one example each of a task where an agent is worth the cost, and a task where it is not.

**Q10.** Application question — no single correct answer: In your film-pipeline design, "拉片" batches are processed with a validation-retry loop, and the whole pipeline is fixed-order with the LLM only at certain steps. Which of the five workflow patterns does your pipeline use, and where (if anywhere) would a true *agent* be justified? Answer in terms of this article's framework.