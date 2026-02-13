---
title: 把 LLM 接入逆向流程的一次最小实践
description: 用 prompt 模板和结构化输出，让 LLM 成为逆向助手而不是噪音源。
pubDate: 2026-02-01
tags: [ai, reverse, llm, workflow]
series: AI x Binary
difficulty: intermediate
tools: [python, llm, prompt]
---

目标很直接：让 LLM 在逆向链路里输出“可验证结果”。

## 流程拆解

1. 输入：函数反编译片段 + 上下文注释。
2. 约束：要求输出 `行为摘要 + 可疑点 + 待验证假设`。
3. 校验：每条结论必须回链到代码证据。

## Prompt 框架

```text
Role: reverse engineer assistant
Task: summarize this function and list verifiable hypotheses
Output format:
- summary
- indicators
- hypotheses
```

## 复盘

有效的关键不是模型大小，而是输入上下文质量与输出约束。
