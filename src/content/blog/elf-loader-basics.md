---
title: 从入口点看 ELF 加载过程
description: 用 readelf 与 gdb 快速定位 ELF 入口、段布局和首段执行行为。
pubDate: 2026-01-19
tags: [binary, reverse, elf, linux]
series: Binary Fundamentals
difficulty: intermediate
tools: [readelf, objdump, gdb]
---

这次只做一件事：理解程序从磁盘到内存后，第一段代码如何被执行。

## 最小实验

```bash
gcc -o hello hello.c
readelf -h hello | grep Entry
objdump -d hello | head -n 60
gdb ./hello
```

## 核心观察点

1. `Entry point address` 对应的是 `_start`，不是 `main`。
2. `PT_LOAD` 决定了段如何映射到内存。
3. 跟到 `__libc_start_main` 才会进入 `main`。

## 结论

逆向时先找真实执行入口，再找业务逻辑入口，这能减少误判。
