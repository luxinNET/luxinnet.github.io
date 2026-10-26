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

你问我这篇文章中所说的成功的Agent应该使用什么框架？以我认为链式工作流框架怎么样？

尽量减少复杂度，只有在真正需要额外框架时才引入，越少的复杂度意味着越成功的Agent。
链式工作流适合相对固定步骤的场景，按步骤来是他的典型特征。

**Q2.** Give the article's definitions of *workflows* and *agents*. What is the single most important word that distinguishes them?

文中对于工作流的定义是，步骤较为固定，由我们设定好工作流程，哪一步该干嘛。对于Agent的定义是，由大模型来决定干嘛，具体怎么执行下一步让LLM来判断。最关键的词是 LLM-Decide

**Q3.** The "augmented LLM" is the core building block. Name the three capabilities the article says should be added to a basic LLM, and give a one-line example of each.

你应该是说让我给出三个增强型LLM的基础能力，并举例

1.链式工作流：比如一步接一步的问题，例如输入“如何做一顿可乐鸡翅”，按步骤给出输出
2.路由式的工作流：对用户的问题进行分类，使用各子Agent处理拆分后的问题。例如输入“鸡翅有哪几种吃法，分别是什么”。
3.并行式工作流：对于一个问题使用多个子Agent同时执行，例如输入“找一下市值最高的十只股票”，A代理去A网站找，B代理去B网站找。

**Q4.** In *prompt chaining*, what is a "gate" (e.g. a classifier that checks classification output), and why is it worth paying the extra latency?

这里说的Gate就是在各步骤中可以加入程序化代码来判断上一步的结果从而给出下一步的步骤。付出额外的延迟是为了获得更高的精准度。

**Q5.** For *routing*, the article argues that separating concerns into smaller, more focused prompts works better than one mega-prompt for everything. Explain why, using the customer service triage example.

不太理解，不太能解释

**Q6.** *Parallelization* has two flavors: **sectioning** and **voting**. Explain the difference, and give one use case for each from the article.

sectioning 意思是将任务划分成多个子任务，并行执行 例如“哪款平台上耐克290最便宜”。voting是执行同样的子任务，投票选出好结果 例如输入“搜索耐克290这双鞋的价格”。

**Q7.** When should you choose *orchestrator-workers* over *prompt chaining*? What kind of task makes the subtasks impossible to define in advance?

无法定义的复杂任务，例如复杂开发任务，需要使用orchestrator-workers;复杂开发任务？

**Q8.** *Evaluator-optimizer* is said to mirror a human practice. What human loop does it mirror, and why is it valuable for something like literary translation?

相当于有个了个审查人吧，对于翻译来说，审查可以让结果更美化

**Q9.** What is the article's core advice about complexity (the "simplest solution" principle)? And what is the trade-off agents make — what do they give you, and what does it cost? Give one example each of a task where an agent is worth the cost, and a task where it is not.

最小解决方案原则：若务必要，勿增实体。文中举得例子是比如如果需要更高的精准度，就要付出更多的延迟性成本。延迟性成本在对时间没要求的情景下适合。

**Q10.** Application question — no single correct answer: In your film-pipeline design, "拉片" batches are processed with a validation-retry loop, and the whole pipeline is fixed-order with the LLM only at certain steps. Which of the five workflow patterns does your pipeline use, and where (if anywhere) would a true *agent* be justified? Answer in terms of this article's framework.


从提取字幕环节开始。提取字幕文本-AI解读电影-起一个具备争议的标题+开头 给出初版情节时间节点，这个适合用链式工作流  Prompt chaining

根据影片类型选择不同的解说框架，对于每个解说框架生成多项文本进行投票对比并给出对应的剪辑剧本。这里适合使用 Workflow: Parallelization