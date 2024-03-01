---
layout: post
title: 《Effective Python》笔记-第5章 类与接口
category: Read Notes
tags: [Effective Python, Python class, Python interface, Python hook, Python namedtuple, Python callable, Python super]
comments: true
sidebar: []
---

## 第三十七条：用组合起来的类实现多层架构，不要用嵌套的内置类型

不要在字典里嵌套字典、长元组，以及用其他内置类型构造的复杂结构。

namedtuple能够实现出轻量级的容器，以存放不可变的数据，而且将来可以灵活地转化成普通的类。

如果发现用字典维护内部状态的那些代码已经越写越复杂了，那么就应该考虑用多个类来实现。

## 第三十八条：让简单的接口接受函数，而不是类的实例

Python有许多内置的API，都允许我们传入某个函数来制定他的行为。这种函数可以叫做挂钩(hook)，API在执行过程中，会回调(call back)这些挂钩函数。

~~~python
names = ['Socrates', 'Archimedes', 'Plato', 'Hock']
# 把内置的len函数当成挂钩传给key参数，让sort方法根据长度排列这些字符串
names.sort(key=len)
print(names)

>>>
['Hock', 'Plato', 'Socrates', 'Archimedes']
~~~

在其他编程语言中，挂钩可能会用抽象类(abstract class)来定义。但在Python中，许多挂钩都是无状态的函数(stateless fuction)，带有明确的参数与返回值。

与无状态的闭包函数相比，用有状态的闭包作为挂钩写出来的代码会更难懂一些。

某个类如果定义了__call__特殊方法，那么它的实例就可以像普通的Python函数那样调用。

如果想用函数来维护状态，那么可以考虑定义一个带有__call__方法的新类，而不要用有状态的闭包去实现。

## 第三十九条：通过@classmethod多态来构造同一体系中的各类对象

在Python中，类支持多态，多态机制使同一体系中的多个类可以按照各自独有的方式来实现同一个方法，这意味着这些类都可以满足同一套接口，或者都可以当作某个抽象类来使用，同时在这个前提下，实现各自的功能。

~~~python
class InputData:
    def read(self):
        """读取方法，留给子类实现"""
        raise NotImplementedError
    
class PathInputData(InputData):
    
    def __init__(self, path):
        super().__init__()
        self.path = path

    def read(self):
        with open(self.path) as f:
            return f.read()

class Worker:
    def __init__(self, input_data):
        self.input_data = input_data
        self.result = None

    def map(self):
        """留给子类实现"""
        raise NotImplementedError
    
    def reduce(self, other):
        """留给子类实现"""
        raise NotImplementedError

class LineCountWorker(Worker):
    def map(self):
        data = self.input_data.read()
        self.result = data.count('\n')
    
    def reduce(self, other):
        self.result += other.result

# 拼接
        
import os

def generate_inputs(data_dir):
    """给目录下每份文件构造一个PathInputData实例"""
    for name in os.listdir(data_dir):
        yield PathInputData(os.path.join(data_dir, name))

def create_workers(input_list):
    """针对generate_inputs返回每个InputData实例分别创建相应的LineCountWorker对象"""
    workers = []
    for input_data in input_list:
        workers.append(LineCountWorker(input_data))
    return workers

# 然后将Worker实例的映射工作分发到多线程中去执行。反复调用reduce,把这些Worker计算出的结果合并成一个值。

from threading import Thread

def execute(workers):
    threads = [Thread(target=w.map) for w in workers]
    for thread in threads: thread.start()
    for thread in threads: thread.join()

    first, *rest = workers
    for worker in rest:
        first.reduce(worker)
    return first.result

# 将刚才三个环节穿起来

def mapreduce(data_dir):
    inputs = generate_inputs(data_dir)
    workers = create_workers(inputs)
    return execute(workers)
~~~

问题在于，mapreduce函数根本不通用。加入要使用其他的InputData或Worker子类，那就必须修改其中各个函数的代码。根本原因在于，**构造对象的方法不够通用**。

现在运用多态实现MapReduce流程所用到的这些类。将generate_inputs方法声明成通用的@classmethod，这样所有的子类都可以通过同一个接口来新建具体的InputData实例。

如果想在超类中用通用的代码构造子类实例，那么可以考虑定义@classmethod方法，并在里面用cls(...)的形式构造具体的子类对象。通用类方法多态机制，我们能够以通用的形式构造并拼接具体的子类对象。

~~~python
class GenericInputData:

    def read(self):
        """读取方法，留给子类实现"""
        raise NotImplementedError
    
    @classmethod
    def generate_inputs(cls, config):
        """读取方法，留给子类实现"""
        raise NotImplementedError

~~~

## 第四十条：通过super初始化超类

菱形继承(diamond inheritance)是指子类通过类体系里两条不同路径的类继承了同一个超类。Python内置了super函数并规定了标准的方法解析顺序(method resolution order, MRO)。super能够确保菱形继承体系中的共同超类只初始化一次。MRO可以确定超类之间的初始化顺序，它遵循C3线性化(C3 linearization)算法。

可以通过Python内置的Super函数正确出发超类的__init__逻辑。一般情况下，不需要给这个函数指定参数。

~~~python
class TimesSevenCorrect(MyBaseClass):
    def __init__(self, value)
        super().__init__(value)
        self.value *= 7

class PlusNineCorrect(MyBaseClass):
    def __init__(self, value)
        super().__init__(value)
        self.value += 9

~~~

## 第四十一条：考虑用mix-in类来表示可组合的功能

Python是面向对象编程语言，提供了相关的机制处理多重继承，尽管如此，但还是应该尽量少用多重继承。如果既要通过多重继承来方便地封装逻辑，又想避开可能出现的问题，那么就应该把待继承的类写成mix-in类。

~~~python
class TodictMixin:
    def to_dict(self):
        return self._traverse_dict(self.__dict__)

    def _traverse_dict(self, instance_dict):
        output = {}
        for key, value in instance_dict.items():
            output[key] = self._traverse(key, value)
        return output
~~~

超类最好能写成不带实例属性与__init__方法的mix-in类，以避免由多重继承所引发的一些问题。

如果子类要定制（或者说修改）mix-in所提供的功能，那么可以在自己的代码里面覆盖相关的实例方法。

根据需求，mix-in可以只提供实例方法，也可以只提供类方法，还可以同时提供这两种方法。

把每个mix-in所提供的简单功能组合起来，可以实现比较复杂的功能。

## 第四十二条：优先考虑用public属性表示应受保护的数据，不要用private表示

Python类的属性只有两种访问级别，也就是public与private。

为了减少在不知情情况下访问内部数据而造成的损伤，Python开发者会按照风格指南里面建议的方式来给字段命名。以单下划线开头的字段叫做受保护的字段，使用这种字段时需要慎重，建议用文档加以解释，而不是通过private属性限制访问。

Python编译器无法绝对禁止外界访问private属性。

从一开始就应该考虑允许其他类继承这个类，并利用其中的内部API与属性去实现更多功能，而不是把它们藏起来。

只有在子类不受控制且名称有可能与超类冲突时，才可以考虑给超类设计private属性。

## 第四十三条：自定义的容器类型应该从collections.abc继承

为了方便开发者定制容器，Python内置的collections.abc模块定义了一系列抽象类(abstract base class)，把每种容器应该提供的所有常用方法都写了出来。如果忘了实现某些必备方法，那么程序会报错，提醒我们这些方法必须实现。

如果要编写的新类比较简单，那么可以直接从Python的容器类型（例如list或dict）里面继承。

Python在比较或排列对象时，还会用到其他一些特殊方法，无论定制的是不是容器类，有时为了支持某些功能，你都必须定义相关的特殊方法。