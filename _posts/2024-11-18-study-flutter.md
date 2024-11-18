---
layout: post
title: study-flutter
description: flutter学习日记
category: study
tags: [study, flutter]
---

2024年11月18日，突发奇想，学习一下谷歌的flutter框架。

## flutter学习

[中文版官方文档地址](https://docs.flutter.cn/)

官方建议初学者学习flutter的三个步骤:

1. **Dart 语言概览** Flutter 使用的是 Dart 语言。如果你有使用其他面向对象语言的经验，像是 Java、C++ 或 Swift， Dart 应该对你来说不会陌生，你可以轻松学习这门语言。
   1. Dart语言
  
      Dart是类型安全的语言，使用静态类型检查确保变量的值始终与变量的静态类型相匹配。也支持类型推断和动态dynamic类型。

      内置了健全的空置类型。

   2. Dart库
   3. Dart平台

      **原生平台**：针对面向移动和桌面设备的应用程序， Dart 拥有具有实时 (JIT) 编译功能的 Dart VM 和用于生成机器代码的提前 (AOT) 编译器。

      **Web 平台**：Dart 可用于编译开发和生产阶段的面向 Web 的应用，它的 Web 编译器可以将 Dart 转换为 JavaScript 或 WebAssembly。

   4. 学习Dart

2. **[编写你的第一个 Flutter 应用](https://docs.flutter.cn/get-started/codelab)** 该编程练习 (codelab) 将通过创建一个可以在移动端、桌面端以及 Web 端运行的应用来学习 Flutter 的基础知识。
   1. 如果选择用Windows平台开发，那么需要Visual Studio中添加“使用C++的桌面开发”功能。
   2. 如果出现意外，可在Teminal中使用flutter doctor命令来检查你的环境。

3. **学习基础知识** 这是一篇针对新 Flutter 开发者且有明确指导性的文档，会引导你了解构建 Flutter 应用的重要部分，这部分里都是英文文档了。
   1. Intro to Dark
   2. Widget fundamentals
   3. Layout
   4. State management
   5. Handling user input
   6. Network and data
   7. Local data and caching
