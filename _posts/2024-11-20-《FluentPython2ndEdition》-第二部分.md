---
layout: post
title: 《FluentPython2ndEdition》-第二部分——to do
category: Read Notes
tags: [FluentPython2ndEdition, Pythonic]
comments: true
---

## 第七章 函数是一等对象

在Python中，函数是一等对象。编程语言研究人员把“一等对象”定义为满足以下条件的程序实体：●在运行时创建；●能赋值给变量或数据结构中的元素；●能作为参数传给函数；●能作为函数的返回结果。

### 把函数视为对象

### 高阶函数

接受函数为参数或者把函数作为结果返回的函数是高阶函数（higher-order-function）。map和内置函数sorted也是。

~~~python
    fruits = ['strawberries', 'limes', 'tomatoes']
    sorted(fruits, key=len)
~~~

### 匿名函数

lambda关键字使用Python表达式创建匿名函数。

除了作为参数传给高阶函数，Python很少使用匿名函数。由于句法上的限制，非平凡的lambda表达式要么难以阅读，要么无法写出。

如果使用lambda表达式导致一段代码难以理解，Fredrik Lundh建议像下面这样重构。
    01 编写注释，说明lambda表达式的作用。
    02 研究一会儿注释，找出一个名称来概括注释。
    03 把lambda表达式转换成def语句，使用那个名称来定义函数。
    04 删除注释。

### 9种可调用对象

除了函数，调用运算符(())还可以应用到其他对象上。数据模型文档列出了自Python 3.9起可用的9种可调用对象。
    定义的函数
    函数
    内置方法
    方法
    类
    类的实例
    生成器函数
    原生协程函数
    异步生成器函数

Python中有各种各样的可调用类型，因此判断对象能否调用，最安全的方法是使用内置函数callable()。

### 用户定义的可调用类型

实现__call__方法是创建类似函数的对象的简便方式，此时必须在内部维护一个状态，让它在多次调用之间存续，例如BingoCage中的剩余元素。__call__的另一个用处是实现装饰器。装饰器必须可调用，而且有时要在多次调用之间“记住”某些事[例如备忘(memoization)，即缓存消耗大的计算结果，供后面使用]，或者把复杂的操作分成几个方法实现。

在函数式编程中，创建保有内部状态的函数要使用闭包(closure)。

### 从位置参数到仅限关键参数

仅限关键字参数是Python3新增的功能。定义函数时，如果想只能通过关键字指定他，就要把他们放到前面有*的参数后面。如果不想支持数量不定的位置参数，但是想支持仅限关键字参数，则可以在签名中放一个*。

如果想定义只接受位置参数的函数，则可以在参数列表中使用/。

### 支持函数式编程的包

operator模块
    operator模块为多个运算符提供了对应的函数，无需再动手编写lambda a,b : a*b这样的匿名函数。

使用functools.partial冻结参数
    它可以根据提供的可调用对象产生一个新可调用对象，为原可调用对象的某些参数绑定预定的值。使用这个函数可以把接受一个或多个参数的函数改造成需要更少参数的回调API。

### 7.9 本章小结

本章的目标是探讨Python函数的一等本性。这意味着，可以把函数赋值给变量、传给其他函数、存储在数据结构中，以及访问函数的属性，供框架和一些工具使用。

## 第八章 函数中的类型提示

还应该强调的是，Python 仍是一门动态类型语言，作者并不意图强制使用类型提示，这只是一种约定。——Guido van Rossum、Jukka Lehtosalo和Łukasz Langa     “PEP 484—Type Hints”

### 关于渐进式类型

### 渐进式类型实践

类型检查工具Mypy最初也是一门语言，是Python的一种方言，有自己的解释器，支持渐进式类型。后经Guido van Rossum的劝说，Mypy的创建者Jukka Lehtosalo把它改造成了一个检查Python代码注解的工具。

类型提示在所有层面上均是可选的，一整个包都可以没有类型提示，即便有类型提示，导入模块时也可以让类型检查工具保持静默，另外还可以通过特殊的注释让类型检查工具忽略代码中指定的行。

100%的类型提示覆盖率太过激进，只是一味追求指标，不现实，也有碍团队充分利用Python的强大功能和灵活性。应该坦然接受没有类型提示的代码，防止注解扰乱API，增加实现难度。

编写类型提示时建议遵守以下代码风格。
    ●参数名称和:之间不留空格，:后加一个空格。
    ●参数默认值前面的=两侧加空格
    使用flake8和blue检查代码风格
        不要天真，你记不住这些规则。flake8会报告代码风格等问题，blue则会根据代码格式化工具black内置的（大多数）规则重写源码。
        blue的作者之一Barry Warsaw也是PEP 8的共同起草人，自1994年起一直是Python核心开发者，从2019年至今（2021年7月）还是Python指导委员会(Steering Council)的一员。默认使用单引号是有坚强后盾的。

使用None表示默认值

### 类型由受支持的操作定义

在渐进式类型系统中，以下两种对类型的解读相互影响着彼此。

鸭子类型
    该类型是Smalltalk（面向对象语言的先驱）以及Python、JavaScript和Ruby采用的解读视角。对象有类型，但是变量（包括参数）没有类型。在实践中，为对象声明的类型无关紧要，重要的是对象具体支持什么操作。如果能调用birdie.quack()，那么在当前上下文中birdie就是鸭子。根据定义，只有在运行时尝试操作对象时，才会施行鸭子类型相关的检查。这比名义类型(nominal typing)更灵活，但代价是运行时潜在的错误更多。

名义类型
    该类型是C++、Java和C#采用的解读视角，带注解的Python支持这种类型。对象和变量都有类型。但是，对象只存在于运行时，类型检查工具只关心使用类型提示注解变量（包括参数）的源码。如果Duck是Bird的子类，那么就可以把Duck实例赋值给注解为birdie: Bird的参数。可是在函数主体中，类型检查工具认为birdie.quack()调用是非法的，因为birdie名义上是Bird对象，而该类没有提供.quack()方法。在运行时，实参是不是Duck实例并不重要，因为名义类型会在静态检查阶段检查。类型检查工具不运行程序的任何部分，只读取源码。名义类型比鸭子类型更严格，优点是能在构建流水线中，甚至是在IDE中输入代码的过程中更早地捕获一些bug。

### 注解中可用的类型

本节涵盖了可用于注解的所有主要类型：

●typing.Any；
    Any是一种魔法类型，位于类型层次结构的顶部和底部。Any既是最一般的类型（使用n: Any注解的参数可接受任何类型的值），也是最特定的类型（支持所有可能的操作）。至少，在类型检查工具看来是这样。当然，没有任何一种类型可以支持所有可能的操作，因此使用Any不利于类型检查工具完成核心任务，即检测潜在的非法操作，防止运行时异常导致程序崩溃。
    在渐进式类型系统中还有一种关系：相容(consistent-with)。
    满足子类型关系必定是相容的，不过对Any还有特殊的规定。相容规则如下。
        01 对T1及其子类型T2，T2与T1相容（里氏替换）。
        02 任何类型都与Any相容：声明为Any类型的参数接受任何类型的对象。
        03 Any与任何类型都相容：始终可以把Any类型的对象传给预期其他类型的参数。

●简单的类型和类；
    像int、float、str和bytes这样的简单的类型可以直接在类型提示中使用。标准库、外部包中的具体类，以及用户定义的具体类（例如FrenchDeck、Vector2d和Duck），也可以在类型提示中使用。
    PEP 484声称，int与float相容，float与complex相容。从实用角度来看，这是合理的：int实现了float的所有操作，而且int还额外实现了&、|、<<等按位运算操作。因此，int也与complex相容。对于i = 3，i.real是3，i.imag是0。

●typing.Optional和typing.Union；
    Optional[str]结构其实是Union[str, None]的简写形式，表示plural的类型可以是str或None。

●泛化容器，包括元组和映射；
    如果想注解带有多个字段的元组，或者代码中多次用到的特定类型的元组，强烈建议使用typing.NamedTuple。
    如果想注解长度不定、用作不可变列表的元组，则只能指定一个类型，后跟逗号和...
●抽象基类；
    理想情况下，函数的参数应接受那些抽象类型（或Python3.9之前的版本中typing模块中对应的类型）​，而不是具体类型。这样对调用方来说更加灵活。
    因此，一般来说在参数的类型提示中最好使用abc.Mapping或abc.MutableMapping，不要使用dict（也不要在遗留代码中使用typing.Dict）​。
    在typing.List的文档中有这样一段话：泛化版list。可用于注解返回值类型。如果想注解参数，推荐使用抽象容器类型，例如Sequence或Iterable。
●泛化可迭代对象；
    typing.List文档推荐使用Sequence和Iterable注解函数的参数。
    与Sequence一样，Iterable最适合注解参数的类型。用来注解返回值类型的话则太过含糊。函数的返回值类型应该具体、明确。
●参数化泛型和TypeVar；
    参数化泛型是一种泛型，写作list[T]​，其中T是类型变量，每次使用时会绑定具体的类型。这样可在结果的类型中使用参数的类型。
    为什么需要TypeVar？
        PEP 484的作者希望借助typing模块引入类型提示，不改动语言的其他部分。通过精巧的元编程技术，让类支持[​]运算符（例如Sequence[T]​）不成问题。但是，方括号内的T变量必须在某处定义，否则要大范围改动Python解释器才能让泛型支持特殊的[​]表示法。鉴于此，我们增加了typing.TypeVar构造函数，把变量名称引入当前命名空间。
    受限的TypeVar
        TypeVar还接受一些位置参数，以对类型参数施加限制。
    有界的TypeVar
        使用TypeVar的另一个可选参数，即关键字参数bound。这个参数会为可接受的类型设定一个上边界。
        受限的类型变量会把类型设为TypeVar声明中列出的某个类型；
        有界的类型变量会把类型设为根据表达式推导出的类型，但前提是推导的类型与TypeVar的bound=关键字参数声明的边界相容。
    预定义的类型变量AnyStr
        typing模块提供了一个预定义的类型变量，名为AnyStr。这个类型变量的定义如下所示。
        AnyStr = TypeVar('AnyStr', str, bytes)
        很多接受bytes或str的函数会使用AnyStr，返回值也是二者之一。
●typing.Protocols——静态鸭子类型的关键；
    在Python中，协议通过typing.Protocol的子类定义。然而，实现协议的类不会与定义协议的类建立任何关系，不继承，也不用注册。类型检查工具负责查找可用的协议类型，施行用法检查。
●typing.Callable；
    collections.abc模块提供的Callable类型（尚未使用Python3.9的用户在typing模块中寻找）用于注解回调参数或高阶函数返回的可调用对象。
●typing.NoReturn。
    这个特殊类型仅用于注解绝不返回的函数的返回值类型。这类函数通常会抛出异常。标准库中有很多这样的函数。

### 注解仅限位置参数和变长参数

### 类型不完美，测试须全面

大型企业基准代码的维护人员反映，静态类型检查工具能发现很多bug，而且这个阶段发现的bug比上线运行之后发现的bug修复成本更低。然而，有必要指出的是，早在引入静态类型之前，自动化测试就已经是行业标准做法，我熟知的公司均已广泛采用。

建议把静态类型检查工具纳入现代CI流水线，与测试运行程序、lint程序等结合在一起使用。CI流水线的目的是减少软件故障，自动化测试可以捕获许多超出类型提示能力范围的bug。Python写出的代码都能使用Python测试，有没有类型提示无关紧要。

### 本章小结

类型提示是一个复杂的话题，还在不断发展中。幸运的是，这是可选功能，因此Python广泛的用户群体不受影响。请不要听信类型布道者的话，认为所有Python代码都需要类型提示。Python类型提示由荣誉的仁慈“独裁者”全力推动，为表感激，本章开头和结尾都引用了他的话。

我不希望在道德上有义务为一个Python版本一直添加类型提示。我坚信，类型提示有存在的必要，然而很多时候得不偿失。用与不用由你自己选择，这多好。[插图]——Guido van Rossum

## 第九章 装饰器和闭包

### 装饰器基础知识

装饰器是一种可调用的对象，其参数是另一个函数（被装饰的函数）。

装饰器可能会对被装饰的函数做一些处理，然后返回函数，或者把函数替换成另一个函数或可调用对象。

严格来说，装饰器只是语法糖，装饰器可以像常规的可调用函数一样调用，传入另一个函数。在做元编程（在运行时改变程序的行为）的时候，这样做尤其方便。

装饰器的三个基本性质
    装饰器是一个函数或其他可调用对象。
    装饰器可以把被装饰的函数替换成别的函数。
    装饰器在加载模块时立即执行。

### Python何时执行装饰器

装饰器的一个关键性质是，它们在被装饰的函数定义之后立即运行。这通常是在**导入时**（例如，Python加载模块时）。

### 注册装饰器

实际情况是，装饰器通常在一个模块中定义，然后再应用到其他模块中的函数上。

大多数装饰器会更改被装饰的函数。通常的做法是，返回在装饰器内部定义的函数，取代被装饰的函数。涉及内部函数的代码基本上离不开闭包。

### 变量作用域规则

为了理解闭包，需要后退一步，先研究Python中的变量作用域规则。

~~~python
b = 6
def f2(a):
    print(a)
    print(b)
    b = 9

f2(3)
~~~

输出：

~~~python
3
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "<stdin>", line 3, in f2
UnboundLocalError: local variable 'b' referenced before assignment
~~~

因为Python在编译函数主体（f2）时，判断b是局部变量，因为在函数内给它赋值了。所以，Python会尝试从局部作用域获取b。后面调用函数时，可以顺利打印a的值，但在尝试获取局部变量b时，发现b没绑定值。

这是一种设计选择：**Python不要求声明变量，但是会假定在函数主体中赋值的变量是局部变量。**

在函数中赋值时，如果想让解释器把b当成全局变量，为它分配一个新值，就要使用global声明。

Python中的两种作用域

**模块全局作用域**
在类或函数块外部分配值的名称。

**f3函数局部作用域**
通过参数或者在函数主体中直接分配值的名称。

### 闭包

其实，闭包就是延伸了作用域的函数，包括函数主体中引用的非全局变量和局部变量。这些变量必须来自包含f的外部函数的局部作用域。

函数是不是匿名的没关系，关键是能访问主体之外定义的非全局变量。

~~~python
# 基于类的实现

class Averager():
    def __init__(self):
        self.series = []

    def __call__(self, new_value):
        self.series.append(new_value)
        total = sum(self.series)
        return total / len(self.series)

# 函数式实现，使用了高阶函数make_averager

def make_averager():
    series = []

    def averager(new_value):
        series.append(new_value)
        total = sum(series)
        return total / len(series)
    
    return averager
~~~

在示例2的averager函数中，series是**自由变量（free variable）**。自由变量是一个术语，指的是未在局部作用域中绑定的变量。

![averager函数的闭包延伸到自身的作用域之外，包含自由变量series的绑定](/assets/img/FluentPython/9.6.1.png)

series的值在返回的avg函数的__closure__属性中。avg.__closure__中的各项对应avg.__code__.co_freevars中的一个名称。这些项时cell对象，有一个名为cell_contents的属性，保存着真正的值。

综上所述，闭包是一个函数，它保留了定义函数时存在的自由变量的绑定。如此一来，调用函数时，虽然定义作用域不可用了，但是仍能使用那些绑定。

注意，只有在嵌套其他函数中的函数才可能需要处理不在全局作用域中的外部变量。这些外部变量位于外层函数的局部作用域内。

### nonlocal声明

上面的示例效率不高，更高效的方法是只存储目前的总值与项数，根据这两个值计算平均值。

~~~python
def make_averager():
    count = 0
    total = 0

    def averager(new_value):
        count += 1
        index += new_value
        return total / index

    return averager
~~~

但这样写会出现如9.5章中的错误：

~~~python
avg = make_averager()
avg(10)

Traceback (most recent call last):
  ...
UnboundLocalError: local variable 'count' referenced before assignment
~~~

问题是，对于数值或任何不可变类型，count += 1 语句的作用其实与count = count + 1一样，因此，实际上我们在函数主体中给count赋值了，这会导致Python把count当作了averger中的局部变量。total变量也受此问题的影响。

上一个例子之所以没有这个问题是因为使用了series.append，并把它传给sum和len。也就是说，利用了“列表是可变对象”这一事实。

但是，数值，字符串元组等不可变类型只能读取，不能更新。为了解决这个问题，Python引入了nonlocal关键字。它的作用是把变量标记为自由变量，即便在函数中为变量赋予了新值。如果为nonlocal声明的变量赋予新值，那么闭包中保存的绑定也会随之更新。改写后的代码如下：

~~~python
def make_averager():
    count = 0
    total = 0

    def averager(new_value):
        nonlocal count,index 
        count += 1
        index += new_value
        return total / index

    return averager
~~~

Python查找变量逻辑：

Python字节码编译器根据以下规则获取函数主体中出现的变量x。
    ●如果是global x声明，则x来自模块全局作用域，并赋予那个作用域中x的值。
    ●如果是nonlocal x声明，则x来自最近一个定义它的外层函数，并赋予那个函数中局部变量x的值。
    ●如果x是参数，或者在函数主体中赋了值，那么x就是局部变量。
    ●如果引用了x，但是没有赋值也不是参数，则遵循以下规则。
    ●在外层函数主体的局部作用域（非局部作用域）内查找x。
    ●如果在外层作用域内未找到，则从模块全局作用域内读取。
    ●如果在模块全局作用域内未找到，则从__builtins__.__dict__中读取。

### 实现一个简单的装饰器

定义了一个简单的装饰器，该装饰器会在每次调用被装饰的函数时倒计时，打印相关内容。

~~~python
# 定义装饰器

import time

def clock(func):
    def clocked(*args):
        t0 = time.perf_counter()
        result = func(*args)
        elapsed = time.perf_counter() - t0
        name = func.__name__
        arg_str = ','.join(repr(arg) for arg in args)
        print(f'[{elapsed:0.8f}s] {name}({arg_str}) -> {result!r}')
        return result
    return clocked

# 使用装饰器
import time
from Y2024M11D25_01 import clock

@clock
def snooze(seconds):
    time.sleep(seconds)

@clock
def factorial(n):
    return 1 if n < 2 else n * factorial(n - 1)

if __name__ == '__main__':
    print('*' * 40, 'Calling snooze(.123)')
    snooze(.123)
    print('*' * 40, 'Calling factorial(6)')
    print('6! =', factorial(6))
~~~

factorial保存的其实是clocked函数的引用。自此之后，每次调用factorial(n)执行的都是clocked(n)。clocked大致做了下面几件事。

01 记录初始时间t0

02 调用原来的factorial函数，保存结果。

03 计算运行时间。

04 格式化收集的数据，然后打印出来。

05 返回第2步保存的结果。

这是装饰器的典型行为：把被装饰的函数替换成新函数，新函数接受的参数与被装饰的函数一样，而且（通常）会返回被装饰的函数本该返回的值，同时还会做一些额外操作。

>>> Gamma等人所著的《设计模式》一书是这样概述装饰器模式的：​“动态地给一个对象添加一些额外的职责。​”函数装饰器符合这种说法。但是，从实现层面上看，Python装饰器与该书中所说的装饰器没有多少相似之处。

上面例子中实现的clock装饰器有几个缺点：不支持关键字参数，而且遮盖了被装饰函数的__name__属性和__doc__属性。以下是重构版本。

~~~python
import time
import functools

def clock(func):
    @functools.wraps(func)
    def clocked(*args, **kwargs):
        t0 = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - t0
        name = func.__name__
        arg_lst = [repr(arg) for arg in args]
        arg_lst.extend(f'{k} = {v!r}' for k, v in kwargs.items())
        arg_str = ','.join(arg_lst)
        print(f'[{elapsed:0.8f}s] {name}({arg_str}) -> {result!r}')
        return result
    return clocked
~~~

functools.wraps只是标准库中开箱即用的装饰器之一。

### 标准库中的装饰器

Python内置了3个用于装饰方法的函数：property、classmethod和staticmethod。

上面的例子中提到了另一个重要的装饰器functools.wraps，它的作用是协助构建行为良好的装饰器。标准库中最吸引人的几个装饰器，即cache、lru_cache和singledispatch，均来自functools模块。

#### 使用functools.cache做备忘

functools.cache装饰器实现了备忘(memoization)。这是一项优化技术，能把耗时的函数得到的结果保存起来，避免传入相同的参数时重复计算。

被装饰的函数所接受的参数必须可哈希，因为底层lru_cache使用dict存储结果，字典的键取自传入的位置参数和关键字参数。除了优化递归算法，@cache在从远程API中获取信息的应用程序中也能发挥巨大作用。

如果缓存较大，则functools.cache有可能耗尽所有可用内存。在我看来，@cache更适合短期运行的命令行脚本使用。对于长期运行的进程，推荐使用functools.lru_cache，并合理设置maxsize参数（详见9.9.2节）​。

#### 使用 functools.lru_cache

@lru_cache的主要优势是可以通过maxsize参数限制内存用量上限。maxsize参数的默认值相当保守，只有128，即缓存最多只能有128条。

LRU是“Least Recently Used”的首字母缩写，表示一段时间不用的缓存条目会被丢弃，为新条目腾出空间。

#### 单分派泛化函数

functools.singledispatch装饰器可以把整体方案拆分成多个模块，甚至可以为第三方包中无法编辑的类型提供专门的函数。使用@singledispatch装饰的普通函数变成了泛化函数（generic function，指根据第一个参数的类型，以不同方式执行相同操作的一组函数）的入口。这才称得上是**单分派**。如果根据多个参数选择专门的函数，那就是**多分派**。

应尽量注册处理抽象基类（例如numbers.Integral和abc.MutableSequence）的专门函数，而不直接处理具体实现（例如int和list）​。这样的话，代码支持的兼容类型更广泛。例如，Python扩展可以子类化numbers.Integral，使用固定的位数实现int类型。

singledispatch机制的一个显著特征是，你可以在系统的任何地方和任何模块中注册专门函数。如果后来在新模块中定义了新类型，则可以轻易添加一个新的自定义函数来处理新类型。此外，还可以为不是自己编写的或者不能修改的类编写自定义函数。

### 参数化装饰器

解析源码中的装饰器时，Python会把被装饰的函数作为第一个参数传给装饰器函数。那么，如何让装饰器接受其他参数呢？答案是创建一个装饰器工厂函数来接收那些参数，然后再返回一个装饰器，应用到被装饰的函数上。

在实际开发中的参数化装饰器更为复杂。

### 9.11本章小结

本章涉及一些难以理解的内容。学习之路崎岖不平，我已经尽可能让路途平坦顺畅。毕竟，我们已经进入元编程领域了。

如果想真正理解装饰器，则不仅需要区分导入时和运行时，还要理解变量作用域、闭包和新增的nonlocal声明。掌握闭包和nonlocal不仅对构建装饰器有帮助，在面向事件的GUI程序编程和基于回调处理异步I/O中也用得到，遇到适合使用函数式编程的情况更能得心应手。

《Effective Python：编写高质量Python代码的90个有效方法（原书第2版）​》一书中的第26条实践原则给出了函数装饰器的最佳实践，建议始终使用functools.wraps

Python函数装饰器符合《设计模式》一书中对装饰器模式的一般描述：​“动态地给一个对象添加一些额外的职责。就扩展功能而言，装饰器模式比子类化更灵活。​”在实现层面，Python装饰器与装饰器设计模式不同，但是有些相似之处。

## 第十章 使用一等函数实现设计模式

虽然设计模式与语言无关,但这并不代表每一个模式都能在每一门语言中使用,在Python中效仿迭代器模式毫无意义,因为该模式深值语言之中,通过生成器可使用.

### 案例分析:重构策略模式

《设计模式》一书对策略模式的概述如下。定义一系列算法，把它们一一封装起来，并且使它们可以相互替换。本模式使得算法可以独立于使用它的客户而变化。

在电商领域应用策略模式的一个典型例子是根据客户的属性或订单中的商品计算折扣。

假如某个网店制定了以下折扣规则。
    ●有1000或以上积分的顾客，每个订单享5%折扣。
    ●同一订单中，单个商品的数量达到20个或以上，享10%折扣。
    ●订单中不同商品的数量达到10个或以上，享7%折扣。

为简单起见，假定一个订单一次只能享用一个折扣。

本章对策略模式的重构和对命令模式的讨论是为了通过示例说明一种更为常见的做法：有时，设计模式或API要求组件实现单方法接口，而该方法有一个很宽泛的名称，例如“execute”​“run”或“do_it”​。在Python中，这些模式或API通常可以使用作为一等对象的函数实现，从而减少样板代码。

### 使用装饰器改进策略模式

### 命令模式

### 10.5本章小结
