---
layout: post
title: 《Effective Python》笔记-第4章 推导与生成
category: Read Notes
tags: [Effective Python, Python comprehension]
comments: true
---

## 第二十七条：用列表推导取代map与filter

Python里面有一种很精简的写法，可以根据某个序列或可迭代对象派生出一份新的列表，叫做列表推导（list comprehension）。

~~~python
# 传统写法
a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
squares = []
for x in a:
    squares.append(x**2)

# 列表推导写法
squares = [x**2 for x in a] # list comprehension
~~~

这种功能也可以用map实现，它能够从多个列表中分别取出当前位置的元素，并当作参数传给映射函数，以求出新列表在这个位置上的元素值。

~~~python
alt = map(lambda x: x ** 2, a)
~~~

列表推导无需使用lambda函数，且能方便地过滤原列表，把某些输入值对应的计算结果从输出结果中排除。
字典与集合也相应的推导机制，分别叫做字典推导（dictionary comprehension）与集合推导（set comprehension）。

~~~python
# 列表推导写法
even_squares = [x**2 for x in a if x % 2 == 0]
even_squares_dict = {x: x**2 for x in a if x % 2 == 0}
even_squares_set = {x**2 for x in a if x % 2 == 0}

# 也可以用内置的filter与map函数事项，相比列表推导更难懂
alt = map(lambda x: x**2, filter(lambda x: x % 2 == 0, a))
alt_dict = dict(map(lambda: x**2,
                filter(lambda: x % 2 == 0, a)))
alt_set = set(map(lambda: x**2,
                filter(lambda: x % 2 == 0, a)))
assert even_squares == list(alt)
~~~

## 第二十八条：控制推导逻辑的子表达式不要超过两个

推到的时候可以使用多层循环，每层循环可以带有多个条件。

在表示推导逻辑时，最多只应给写两个子表达式（例如两个if条件、两个for循环，或者一个if条件与一个for循环）。

## 第二十九条：用赋值表达式消除推导中的重复代码

编写推导式与生成器表达式时，可以在描述条件的那一部分通过赋值表达式定义变量，并在其他部分复用该变量，可使程序简单易读。

~~~python
result = {name: tenth for name, count in stock.items()
            if (tenth := count // 10) > 0}
~~~

对于推导式与生成器表达式来说，虽然赋值表达式也可以出现在描述条件的那一部分之外，但最好别这么写。

## 第三十条：不要让函数直接返回列表，应该让它逐个生成列表里的值

生成器由包含yield表达式的函数创建。调用生成器函数并不会让其中的代码立刻得到执行，它会返回一个迭代器(iterator)。把迭代器传给Python内置的next函数，就可以将生成器函数推进到它的下一条yield表达式。生成器会把yield表达式的值通过迭代器返回给调用者。

生成器函数所返回的迭代器可以产生一系列值，每次产生的那个值都是由函数体的下一条yield表达式所决定的。

~~~python
def index_words_iter(text):
    if text:
        yield 0
    for index, letter in enumerate(text):
        if letter == '':
            yield index + 1

address = "Four score and seven years ago..."
it = index_words_iter(address)
print(next(it))
print(next(it))
~~~

不论输入的数据量有多大，生成器函数每次只需要根据其中一小部分来计算当前这次的输出值。他不用把整个输入值全部读取进来，也不用一次就把所有的输出值全部算好。

定义这种生成器函数的时候，只有一个地方需要注意，就是调用者无法重复使用函数所返回的迭代器，因为这些迭代器是有状态的。

## 第三十一条：谨慎地迭代函数所收到的参数

函数和方法如果要把收到的参数遍历很多遍，那就必须特别小心。因为如果这些参数为迭代器，那么程序可能得不到预期的值，从而出现奇怪的笑国。

Python的迭代器协议确定了容器与迭代器应该怎样跟内置的iter及next函数、for循环及相关的表达式交互。

要让自定义的容器类型可以迭代，只需要把__iter__方法实现为生成器即可。

可以把值传给iter函数，检测它返回的是不是那个值本身。如果是，就是普通的迭代器，而不是一个可以迭代的容器。另外也可以用内置的isinstance函数判断该值是不是collections.abc.Iterator类的实例。

## 第三十二条：考虑用生成器表达式改写数据量较大的列表推导

通过列表推导来处理大量的输入数据，可能会占用许多内存。

改用生成器表达式来做，可以避免内存使用量过大的问题，因为这种表达式所形成的迭代器每次只会计算一项结果。

生成器表达式所形成的迭代器可以当成for语句的子表达式出现在另一个生成器表达式里。

把生成器表达式组合起来使用，能够写出速度快且占用内存少的代码

## 第三十三条：通过yield from把多个生成器连起来用

如果要连续使用多个生成器，那么可以通过yield from表达式来分别使用这些生成器，这样做能够免去重复的for结构。

yield from的性能要胜过那种在for循环里手工编写yield表达式的方案。

## 第三十四条：不要用send给生成器注入数据

yield表达式让我们能够轻松写出生成器函数，使得调用者可以每次只获取输出序列中的一项结果。但问题是，这种通道是单向的，也就是说，无法让生成器在一端接受数据流，同时在另一端给出计算结果。

Python的生成器支持send方法，可以让生成器变为双向通道。send方法可以把参数发给生成器，让它成为上一条yield表达式的求值结果，生成器可以把这个结果赋给变量。

把send方法与yield from表达式搭配起来使用，可能导致奇怪的结果，例如会让程序在本该输出有效值的地方输出None。

通过迭代器向组合起来的生成器输入数据，要比采用send方法的那种方案好，所以尽量避免使用send方法。

## 第三十五条：不要通过thorw变换生成器的状态

throw方法可以把异常发送到生成器刚执行过的那条yield表达式那里，让这个异常在生成器下次推进时重新抛出。

通过throw方法注入异常会让程序便=变得很难懂，因为需要用多层嵌套的模板结构来抛出并捕获这种异常。

如果确实遇到了这样的特殊情况，应该通过类的__iter__方法实现生成器，并且专门提供一个方法，让调用者通过这个方法来出发这种特殊的状态变换逻辑。

## 第三十六条：考虑用itertools拼装迭代器与生成器

内置的itertools模块有一些函数可以把多个迭代器连成一个使用。

**chain**

chain可以把多个迭代器从头到尾连成一个迭代器。

~~~python
import itertools

it = itertools.chain([1, 2, 3], [4, 5, 6])
print(it)

>>>
[1, 2, 3, 4, 5, 6]
~~~

**repeat**

repeat可以制作一个迭代器，他会不停的输出某个值。

**cycle**

cycle可以循环地输出某段内容之中的各项元素。

**tee**

tee可以让一个迭代器分裂成多个平行的迭代器，具体个数由第二个参数指定。

还有很多不一一列举。总的来说，itertools包里有三套函数可以拼装迭代器与生成器，分别能够连接多个迭代器，过滤源迭代器中的元素，以及用源迭代器中的元素合成新元素。
