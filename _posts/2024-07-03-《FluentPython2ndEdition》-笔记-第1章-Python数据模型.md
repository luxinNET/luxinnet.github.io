---
layout: post
title: 《FluentPython2ndEdition》笔记-第1章 Python数据模型
category: Read Notes
tags: [FluentPython2ndEdition, Pythonic]
comments: true
---

通过特殊方法利用Python数据模型，这样做有两个优点
  * 类的用户不需要记住标准操作的方法名称。
  * 可以充分利用Python标准库，例如random.choice函数，无需重复发明轮子。

要明确一点，特殊方法供Python解释器调用，而不是你自己。也就是说，没有 my_object.__len__()这种写法，正确的写法是len(my_object)。

特殊方法的重要用途：

### 模拟数值类型

__abs__获取对象的绝对值

__mul__、__add__返回一个新的Vector实例，没有修改运算对象，只读取self或other。

### 对象的字符串表示形式

__repr__获取对象的字符串表现形式。

### 对象的布尔值

默认情况下，用户定义类的实例都是真值，除非实现了__bool__或__len__方法。

### 实现容器

每一个容器类型均应实现如下事项

* Iterable要支持for、拆包和其他迭代方式
* Sized要支持内置函数len
* Container要支持in运算符
  * Python不强制要求具体类继承这些抽象基类中的任何一个。这要实现了__len__方法，就说明那个类满足Sized接口。

Collection有3个非常重要的专用接口

* Sequence规范和list和str等内置类型的接口
* Mappingi被dict、collections.defaultdict等实现
* Set是set和frozenset两个内置类型的接口

### len为什么不是方法

因为经过了特殊的处理，被当作Python数据模型的一部分，就像abs函数一样。但是借助特殊方法__len__，也可以让len适用于自定义对象。这是一种相对公平的折中方案，既满足了对内置对象速度的要求，又保证了语言的一致性。