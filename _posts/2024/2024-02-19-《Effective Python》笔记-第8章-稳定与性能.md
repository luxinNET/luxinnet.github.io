---
layout: post
title: 《Effective Python》笔记-第8章 稳定与性能
category: Read Notes
tags: [Effective Python]
comments: true
---

## 第六十五条：合理利用try/except/else/finally结构中的每个代码块

try/finally形式的复合语句可以确保，无论try块是否抛出异常，finally快都会得到运行。

如果某段代码应该在前一段代码顺利执行之后加以运行，那么可以把它放到else块里面，而不要把这两段代码全都写到try快之中。这样可以让try块更加专注，同时也能够跟except块形成明确对照：except块写的是try块没有顺利执行时所要运行的代码。

如果你在某段代码执顺利执行之后多做一些处理，然后再清理资源，那么通常可以考虑把这三段代码写道try、else与finally块里。

## 第六十六条：考虑用contextlib和with语句来改写可复用的try/finally代码

可以把try/finally逻辑封装到情景管理器里面，这样能通过with结构反复运行这套逻辑，而不需要每次用到的时候，都再写一遍try/finally。

Python内置的contextlib模块提供里contextmanager修饰器，让我们可以很方便的修饰某个函数，从而制作相应的情景管理器，使得这个函数能够运用在with里面。

情景管理器通过yield语句所产生的值，可以由with语句之中位于as右侧的那个变量所接收，这样的话，就可以通过该变量与当前情景交互了。

~~~python
@contextmanager
def log_level(level, name):
    logger = logging.getLogger(name)
    old_level = logger.getEffectiveLevel()
    logger.setLevel(level)
    try:
        yield logger
    finally:
        logger.setLevel(old_level)

with log_level(logging.DEBUG, 'my-log') as logger:
    logger.debug(f'This is a message for {logger.name}')
    logging.debug('This will not print')
~~~

## 第六十七条：用datetime模块处理本地时间，不要用time模块

协调世间时（Coordinated Universal Time, UTC）是标准的时间表示方法，不依赖特定时区。涉及时间的程序里，我们很有可能要再UTC与当地时间之间互相转换，这样才能给出用户容易理解的格式。

不要用time模块在不同时区之间转换。

把Python内置的datetime模块与开发者社区提供的pytz模块结合起来，可以在不同时区之间可靠地转换。

在操作时间数据的过程中，总是应该使用UTC时间，只要到了最后一步，才需要把它转回当地时间以便显示出来。

## 第六十八条：用copyreg实现可靠地pickle操作

Python内置的pickle模块可以把对象序列化成字节流，也可以把字节流反序列化（还原）成对象。

经过pickle处理的字节流只应该在彼此信任的双方之间传输，而不应该随意传给别人，或者随意接受别人发来的这种数据，因为这个模块所使用的这种序列化格式本身就没有考虑过安全问题。

如果对象所在的这个类发生了变化（例如增加或删除了某些错误属性），那么程序在还原旧版数据的时候，可能会出现错误。

把内置的copyreg模块与pickle模块搭配起来使用，可以让新版的程序兼容旧版的序列化数据

## 第六十九条：在需要准确计算的场合，用decimal表示相应的数值

每一种数值几乎都可以用Python内置的某个类型，或者内置模块之中的某个类表示出来。

在精度要求较高且需要控制舍入方式的场合（例如计算费用），可以考虑使用decimal类。

用小鼠构造Decimal的时候，如果想保证取值准确，那么一定要把这个数放在str字符串里面传递，而不要直接传过去，那样可能会有误差。

## 第七十条：先分析性能，然后再优化

Python内置了两种profiler模块，可以找到程序里面总执行时间比例最高的一部分。一种是由profile模块提供的纯Python版本，还有一种是由cProfile模块提供的C扩展版本。c扩展版本比纯Python版本要好，因为对受测程序影响较小，测评结果更加准确。

把需要接受性能测试的主函数传给Profile对象的runcall方法，就可以专门分析出这个体系下面所有函数的调用情况了。

可以通过Stats对象筛选出我们关心的那些分析结果，从而更为专注的思考如何优化程序性能。

~~~python
from cProfile in Profile

profiler = Profile()
profiler.runcall(test)
# 用pstats模块与里面的Stats类来统计结果。
from pstats import Stars

stats = Stats(profiler)
stats.strip_dirs()
stats.sort_stats('cumulative')
stats.print_stats()
~~~

## 第七十一条：优先考虑用deque实现生产者-消费者队列

先进先出队列(first-in, first-out, FIFO)也叫做生产者-消费者队列(producer-consumer queue)或生产-消费队列。

list类型可以用来实现FIFO队列，生产者可以通过append方法向队列添加元素。这种方案有个问题，就是消费者在用pop(0)从队列中获取元素时，所花的时间会随着队列长度，呈平方式增长。

跟list不同，内置collections模块之中的deque类，无论是通过append添加元素，还是通过popleft获取元素，所花的时间都只跟队列长度呈线性关系，而非平方关系，这使得它更适合于FIFT队列。

## 第七十二条：考虑用bisect搜索已排序的序列

Python内置的bisect模块可以更好地搜索有序列表。其中的bisect_left函数，能够迅速地对任何一个有序的序列执行二分搜索。

~~~python
from bisect import bisect_left

index = bisect_left(data, 91234)
assert index == 91234
index = bisect_left(data, 91234.56)
assert index == 91235
~~~

bisect最好的地方，是它不局限于list类型，而是可以用在任何一种行为类似序列的对象上面。

用index方法在已经排顺序的列表之中查找某个值，花费的时间与列表长度成正比，通过for循环单纯的做比较以寻找目标值，所花的时间也是如此。

而bisect模块里面的bisect_left函数，只需要花费对数级别的时间就可以在有序列表中搜寻某个值，比其他方法快好几个数量级。

## 第七十三条：学会使用heapq制作优先级队列

有时候，需要根据元素的重要程度来排序。这种情况下，应该使用优先级队列(priority queue)。Python内置的heapq模块可以高效地实现出优先级队列。

headq规定，添加到优先级队列中的元素必须是可比较的(comparable)，并且需要具备自然顺序，可以通过对类套用@functools.total_ordering修饰器并定义__lt__方法来实现。

如果直接用相关的列表操作来模拟优先级队列，那么程序的性能会随着队列长度增大而大幅下降，因为这样做的复杂程度是平方级别，而不是线性级别。

~~~python
from heapq import heappush

def add_book(queue, book):
    heappush(queue, book)

# 使用@functools.total_ordering修饰Book类，实现__lt__方法。

import functools

@functools.total_ordering
class Book:
    def __init__(self, title, due_date):
        self.title = title
        self.due_date = due_date

    def __lt__(self, other):
        return self.due_date < other.due_date
~~~

## 第七十四条：考虑用memoryview与bytearray来实现无须拷贝的bytes操作

针对I/O密集型的任务，却很容易就能用各种方式写出吞吐量较大(也就是处理能力较强)的平行代码。

Python内置的memoryview类型提供了一套无须执行拷贝的（也就是零拷贝）操作接口，让我们可以对支持缓冲协议的Python对象制作切片，并通过这种切片高速地完成读取与写入。

Python内置的bytearray类型是一种与bytes相似但内容能改变的类型，我们可以通过socket.recv_from这样的函数，以无需拷贝的方式读取数据。

可以用memoryview来封装bytearray，从而用收到的数据覆盖底层缓冲里面的任意区段，同时又无需执行拷贝操作。