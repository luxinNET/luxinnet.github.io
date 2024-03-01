---
layout: post
title: 《Effective Python》笔记-第3章 函数
category: Read Notes
tags: [Effective Python, Python fuc]
comments: true
---

## 第十九条：不要把函数返回的多个数值拆分到三个以上的变量中

函数可以把多个值合起来通过一个元组返回给调用者，以便利用Python得unpacking机制去拆分。

对于函数返回的多个值，可以把普通变量没有捕获到得那些值全部捕获到一个带星号的变量中。为了避免调用方要接收一大堆返回值，容易出错，以及拆分返回值返回值的那行代码过长，不符合PEP8风格，我们不应该把函数返回的多个值拆分到三个以上的变量里。

把返回的值拆分到四个或四个以上的变量是很容易出错的，所以最好不要那么写，而是通过小类或namedtuple实例完成。

## 第二十条：遇到意外状况时应该抛出异常，不要返回None

用返回值None表示特殊情况是很容易出错的，因为这样的值在条件表达式里面，没办法与0和空白字符串之类的值区分，这些值都相当于False。

用异常表示特殊的情况，而不要返回None。让调用这个函数的程序根据文档里写的异常情况作出处理。

通过类型注解可以明确禁止函数返回None，即便在特殊情况下，它也不能返回这个值。

## 第二一条：了解如何在闭包里面使用外围作用于的变量

闭包函数可以引用定义它们的那个外围作用域之中的变量。

Python在判断两个序列(包括元组)的大小时，有自己的一套规则。它首先比较0号位置的那两个元素，如果相等就比较1号位置的那两个元素；依此类推，直到得出结论为止。

~~~python
def sort_priority(values, group):
    """根据属性排序"""
    def helper(x):
        if x in group:
            return (0, x)
        return (1, x)
    values.sort(key=helper)

numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}
sort_priority(numbers,group)
print(numbers)
~~~

在表达式中引用某个变量时，Python解释器会按以下顺序查找这个变量，以解析这次引用。
1. 当前函数的作用域。
2. 外围作用域。
3. 包含当前代码的那个模块所对应的作用域（也叫全局作用域，global scope）。
4. 内置作用域（built-in scope，也就是包含len于str等函数的那个作用域）。
如果这些作用域都没有找到此变量则抛出NameError异常。

按照默认的写法，在闭包里面给变量赋值并不会改变外围作用域中的同名变量。

先用nonlocal语句说明，然后赋值，可以修改外围作用域中的同名变量。

除特别简单的函数外，尽量少用nonlocal语句。

## 第二二条：用数量可变的位置参数给函数设计清晰的参数列表

用def定义函数时，可以通过*args的写法让函数接收数量可变的位置参数。

调用函数时，可以在序列左边加上*操作符，把其中的元素当成位置参数传给*args所表示的一部分。

~~~python
def log(sequence, message, *values):
    if not values:
        print(f"{sequence} - {message}")
    else:
        value_str = ', '.join(str(x) for x in values)
        print(f"{sequence} - {message}: {value_str}")
~~~

如果*操作符加在生成器前，那么传递参数时，程序有可能耗尽内存而崩溃。

给接受*args的函数添加新位置参数，可能导致难以排查的bug。

## 第二三条：用关键字来表示可选的行为

函数的参数可以按位置指定，也可以用关键字的形式指定。

关键字可以让每个参数的作用更加明了，因为在调用函数时只按位置指定参数，可能会导致这些参数的含义不够明确。

应该通过带默认值的关键字参数来扩展函数的行为，因为这不会影响原有的函数调用代码。

可选的关键字参数总是应该通过参数名来传递，而不应按位置传递。以下是关键字参数灵活用法的三个好处：
1. 用关键字调用函数可以让初次阅读代码的人更容易看懂。
2. 它可以带有默认值，该值是在定义函数时指定的。
3. 我们可以很灵活地扩充函数的参数，而不用担心会影响原有的代码。

## 第二四条：用None和docstring来描述默认值会变得参数

参数的默认值只会计算一次，也就是在系统把定义函数的那个模块加载进来的时候，所以，如果默认值将来可能由调用方修改或者要随着调用时的情况变化(例如datetime.now())，那么程序会出现奇怪的效果，默认值未发生更改。

如果关键字参数的默认值属于这种会发生变化的值，那就应该写成None，并且要在docstring里面描述函数此时的默认行为。

默认值未None的关键参数，也可以添加类型注解。

## 第二五条：用只能以关键字指定和按位置传入的参数来设计清晰的参数列表

Keyword-only argument是一种只能通过关键字制定不能通过位置指定的参数。这迫使调用者必须指明，这个值是传给哪一个参数的。在函数的参数列表中，这种参数位于*符号的右侧。

Positional-only argument是这样一种参数，它不允许调用者通过关键字来指定，二是要求必须按位置传递。这可以降低调用代码与参数名称之间的耦合程度。在函数的参数列表中，这些参数位于/符号的左侧。

在参数列表中位于/与*之间的参数，可以按位置指定，也可以按关键字指定。这也是Python普通参数的默认指定方式。

## 第二六条：用functools.wraps定义函数修饰器

修饰器是Python中的一种写法，能够把一个函数封装在另一个函数里面，这样程序在执行原函数之前与执行完毕之后，就有机会执行其他一些逻辑了。

修饰器可能会让那些利用introspection机制运作的工具（例如调试器）产生奇怪的行为，例如help函数和对象序列化器（object serializer）。

Python内置的functools模块里有个叫作wraps的修饰器，可以帮助我们正确定义自己的修饰器，从而避开相关问题

~~~python
from functools import wraps

def trace(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        print(f'{func.__name__}{args!r},{kwargs!r}'
              f'-> {result!r}')
        return result
    return wrapper

@trace
def fibonacci(n):
    """Return the n-th Fibonacci number"""
    if n in (0, 1):
        return n
    return (fibonacci(n - 2) + fibonacci(n - 1))

fibonacci(4)
~~~