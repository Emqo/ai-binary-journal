---
title: GDB 断点策略：从函数到内存写入点
description: 用分层断点策略减少调试噪音，快速锁定关键代码路径。
pubDate: 2026-01-25
tags: [binary, reverse, gdb, debugging]
series: Binary Fundamentals
difficulty: intermediate
tools: [gdb, pwndbg]
---

复杂样本里盲目打断点效率很低。这里固定一套断点顺序。

## 断点层次

1. 入口断点：`_start` / `main`。
2. 行为断点：`malloc`、`memcpy`、`open`、`connect`。
3. 条件断点：根据寄存器或参数筛选路径。
4. 观察点：监控关键地址的写入。

## 示例

```text
break main
break memcpy if $rdx > 0x100
watch *(int*)0x404040
commands
  bt
  c
end
```

## 结果

固定断点模板后，同类题平均定位时间显著下降。
