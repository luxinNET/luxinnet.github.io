---
layout: post
title: 《Effective Python》笔记-第1章 培养Pythonic思维
category: Read Notes
tags: [Effective Python, Pythonic]
comments: true
---

## 第一条：查询自己使用的python版本

~~~terminal
python --version
~~~

## 第二条：遵循PEP8风格指南
* 与空白有关的建议
  * 在python中，空白对于语法相当重要。空格使用不当会影响python代码的清晰度。对于空格，遵循以下建议：
    1. 用空格(space)表示缩进，而不是制表符(tab)。
    2. 和语法相关的每一层缩进都用4个空格表示。
    3. 每行代码不超过79个字符。
    4. 对于占据多行的长表达式来说，除了首行之外的其余各行都应该在通常的缩进级别上再加4个空格。
    5. 在同一个文件中，函数与类之间应用两个空行隔开。
    6. 在同一个文件中，方法与方法之间用一个空行隔开。
    7. 使用字典时，键与冒号之间不加空格，写在同一行的冒号和值之间应该加一个空格。
    8. 给变量赋值时，赋值符号的左边和右边应各加一个空格，并且只加一个空格就好。
    9. 给变量的类型做注解(annotation)时，不要把变量名和冒号隔开，但在类型信息前应有一个空格。
* 与命名有关的建议
  * PEP 8建议采用不同的方式给Python代码中的各个部分命名，这样在阅读代码时，就可以根据这些名称看出它们在Python语言中的角色。遵循以下建议：
    1. 函数、变量及属性用小写字母来拼写，各单词之间用下划线相连，例如：lowercase_underscore。
    2. 受保护的实例属性，用一个下划线开头，例如：_leading_uderscore。
    3. 私有的实例属性，用两个下划线开头，例如：__double_leading_uderscore。
    4. 类(包括异常)命名时，每个单词的首字母均大写，例如：CapitalizedWord。
    5. 模块级别的常量，所有字母都大写，各单词之间用下划线相连，例如：ALL_CAPS。
    6. 类中的实例方法，应该把第一个参数命名为self，用来表示该对象本身。
    7. 类方法的第一个参数，应该命名为cls，用来表示这个类本身。
* 与表达式和语句有关的建议
  * The Zen of Python中提到：“每件事都应该有简单的做法，而且最好只有一种。”PEP 8就试着运用这个理念，来规范表达式和语句的写法，遵循以下建议：
    1. 采用行内否定，即把否定词直接写在要否定的内容前面，而不要放在整个表达式的前面，例如应该写 if a is not b而不是 if not a is b。
    2. 不要通过长度判断容器或序列是不是空的，例如不要通过if len(somelist) == 0判断somelist是否为[]或''等空值，而是应该采用if not somelist这样的写法来判断，因为Python会把空值自动评估为False。
    3. 如果要判断容器或序列里有没有内容(比如要判断somelist是否为[1]或'i'这样非空的值)，也不应该通过长度判断，而是应该采用if somelist语句，因为Python会把非空的值自动判定为True。
    4. 不要把if语句、for循环、while循环及except复合语句挤在一行。应该把这些语句分成多行来写，这样更加清晰。
    5. 如果表达式一行写不下，可以用括号将其括起来，而且要适当的添加换行以及缩进以便于阅读。
    6. 多行的表达式应该用括号括起来，而不要用\符号续行。
* 与引入有关的建议
  * PEP 8对于怎样在代码中引入模块。遵循以下建议：
    1. import语句(含 form x import y)总是应该放在文件开头。
    2. 引入模块时，总是应该使用绝对名称，而不应该根据当前模块路径来使用相对名称。例如要引入bar包中的foo模块，应该完整的写出from bar import foo，即便当前路径为bar包里，也不应简写为import foo。
    3. 如果一定要用相对名称来编写import语句，那就应该明确地写成from . import foo
    4. 文件中的import语句应按顺序划分为三个部分：首先引入标准库里的模块，然后引入第三方模块，最后引入自己的模块。属于同一个部分的import语句按字母顺序排列。

## 第三条：了解bytes与str的区别
* 在python中两种类型可以表示字符序列：一种是bytes，另一种是str。
  * bytes实例包含的是8位的ASCII编码。
  * str实例包含的是Unicode码点（code point，也叫做代码点），这些码点与人类语言中的文本字符相对应。

> 大家一定要记住：str实例不一定非要某用一种固定的方案编码成二进制数据，bytes实例也不一定非要按照某一种固定的方案解码成字符串。要把Unicode数据转换成二进制数据，必须调用str的**encode**方法。要把二进制数据转换成Unicode数据，必须调用bytes的**decode**方法。

编写python程序的时候，一定要把解码和编码操作放在界面最外层来做，让程序的核心可以使用Unicode数据来运作，这种方法通常叫做“Unicode三明治（Unicode sandwich）”。程序的核心部分，应该用str类型来表示Unicode数据，并且不要锁定到某种字符编码上面。这样可以让程序接受许多种文本编码（例如Latin-1、ShiftJIS及Big5），并把它们都转成Unicode，也能保证输出的文本信息都使用统一标准（最好是UTF-8）编码的。

我们通常需要编写两个**辅助函数（helper function）**以便应对这种字符类型对应的使用情况，确保输入值类型符合开发者预期。
  * 第一个辅助函数接收bytes或str实例，返回str:

~~~python
def to_str(bytes_or_str):
    if isinstance(bytes_or_str,bytes):
        value = bytes_or_str.decode('utf-8')
    else:
        value = bytes_or_str
    return value # Instance of str
~~~

  * 第二个辅助函数接受bytes或str实例，返回bytes:

~~~python
def to_bytes(bytes_or_str):
    if isinstance(bytes_or_str, str):
        value = bytes_or_str.encode('utf-8')
    else:
        value = bytes_or_str
    return value # Instance of bytes
~~~

* 在Python中，bytes和str这两种类型实例不能再某些操作符（例如>、==、+、%操作符）上面混用。
* 从文件中读取二进制数据时，应该用mode参数应该使用'rb'（写入时使用'wb'）模式。打开文件
* 如果要从文件中读取（或者写入）文件的是Unicode数据，那么必须注意系统默认的文本编码。若无发肯定，可通过encoding参数明确。

## 第四条：用支持插值的f-string取代C风格的格式化字符串与str.format方法

用Python对字符串做格式化处理有四种办法可以考虑:
> 但其中三种有严重的缺陷。
> 
### 最常用的字符串格式化是采用%格式化操作。

~~~python
a = 0b10111011
b = 0xc5f
print('Binary is %d, hex is %d' % (a,b))
~~~

* 格式字符串中出现了%d这样的格式说明符，这些说明符的意思是，%右边的对应数值会议这样的格式来替换一部分内容。常见的格式说明符包括%s、%x、%f等，此外还可以控制小数点的位值，并填充与对齐方式。
  * 这种C风格的格式字符串在Python中有四个缺点：
    1. 如果%右侧那个元组里面的值在类型或者顺序上有变化，那么程序可能会因为转换类型发生不兼容问题而出现错误。
    2. 在填充模板之前，经常要先对准备填写进去的这个值稍微做一些处理，这样一来，整个表达式就会很长，比较混乱。
    3. 如果想用同一个值来填充格式字符串里的多个位置，必须在%操作符右侧的元组中相应的多次重复该值。如果想把该值修改一下，可能需要同时修改多处才行，容易出错。
  * Python的%操作符允许我们用dict取代tuple，这样就可以让字符串里面的说明与dict里面的键以相应的名称对应起来，可以解决上面提到的部分缺点。但是会让第二个缺点变得严重，代码更加冗长了。
    4. 把dict写到表达式里会让代码变多。每个键至少都要写两次：一次是在格式说明符中，还有一次是在字典中作为键。

### 内置的format函数与str类的format方法。

Python3添加了**高级字符串格式化(advanced string formatting)机制**,表达能力比老式C风格的格式化字符串要强，不再使用%操作符。

我们针对需要调整格式的这个Python值，调用内置的format函数，并把这个值所应具备的格式也传给该函数，即可实现格式化。
也可以把待调整的字符串用{}替代，按照从左到右的顺序，传给format函数。

~~~python
a = 1234.5678
formatted = format(a, ',.2f') # 逗号表示千位分隔符
print(formatted)

b = 'my string'
formatted = format(b, '^20s') # ^表示居中对齐
print('*', formatted, '*')

key = 'my_var'
value = 1.234
formatted = '{} = {}'.format(key,value)
print(formatted)
~~~

### 插值字符串（推荐使用）

Python 3.6添加了一种新的特性，叫做**插值字符串（interpolated format string,简称f-string）**，新语法特性要求在字符串的前面加f作为前缀，这个字母b与字母r的用法类似，也就是分别表示字节形式的字符串与原始的（或者未经转义的）字符串的前缀。

完美地解决了字段名冗长的问题。

~~~python
key = 'my_var'
value = 1.234
formatted = f'{key} = {value}'
print(formatted)

f_string = f'{key:<10} = {value:.2f}'
~~~

在f-string方法中，各种Python表达式都可以出现在{}里，于是这就解决了前面提到的第二个缺点。

在以上四种字符串格式化办法里，f-string可以简洁而清晰地表达出许多逻辑，成为了程序员地最佳选择。

## 第五条：用辅助函数取代复杂的表达式

语法简洁地Python虽然可以写出许多浓缩的句式，但应该避免让这样的写法把表达式弄得太复杂。**要遵循DRY原则，也就是不要重复自己写过的代码（Don't Repeat Yourself）。**

用if/else结构写成的条件表达式，要比用or与and写成的Boolean表达式更好

## 第六条：把数据结构直接拆分到多个变量里，不要专门通过下标访问

Python有一种写法，叫做拆分(unpacking)。这种写法让我们只用一条语句，就可以将元组里面的元素赋值给多个变量。元组本身不能修改，而将元组拆分后赋值地变量的值是可以修改的。

通过unpacking来赋值比通过下标去访问元组的元素要更加清晰，而且这种写法所需的代码量通常较少。

~~~python
def bubble_sort(a):
    for _ in range(len(a)):
        for i in range(1, len(a)):
            if a[i] < a[i -1]:
                a[i-1], a[i] = a[i], a[i-1]
~~~

这样写比直接赋值（利用临时变量写三行赋值代码）可读性更高，之所以这样写成立，是因为Python处理赋值操作的时候，要求先对=右侧求值，于是它会新建一个临时的元组，把a[i]与a[i-1]两个元素放到这个元组内。做完unpacking后，系统会扔掉这个临时元组。

unpacking还有一个重要的用法是可以在for循环或者类似的结构里，把复杂的数据拆分到相关的变量中。

Python的unpacking机制，可以用在很多方面，例如构建列表、给函数设计参数列表、传递关键字参数、接收多个返回值等。

## 第七条：尽量用enumerate取代range

enumerate能够把任何一种迭代器(itertor)封装成惰性生成器(lazy generator)。这样的话，每次循环的时候，它只需要从iterator里面获取下一个值就行了，同时还会给出本轮循环的序号，即生成器每次产生一对输出值。

enumerate函数可以用简洁的代码迭代iterator，而且可以指出这轮循环的序号。

不要先通过range指定下标的取值范围，然后用下标去访问序列，而是应该直接用enumerate函数迭代。

## 第八条：用zip函数同时遍历两个迭代器

Python内置的zip函数可以把两个或者更多的iterator封装成惰性生成器(lazy generator)。每次循环时，会分别从这些迭代器里获取各自的下一个元素，并把这些值放在一个元组里面。而这个元组可以拆分到for语句中的变量之中。这样写出的代码比通过下标访问多个列表清晰的多。

~~~python
    # enumerate写法
    for i, name in enumerate(names):
        count = counts[i]
        if count > max_count:
            longest_name = name
            max_count = count

    # zip写法
    for name, count in zip(names, counts):
        if count > max_count:
            longest_name = name
            max_count = count
~~~

zip每次只从它封装的那些迭代器里面各自取出一个元素，所以即便源列表很长，程序也不会因为占用内存过多而崩溃。

在zip函数中：只要任何一个迭代器处理完毕，它就不再往下走了。循环的次数实际上等于最短的那份列表的长度。

如果想按最长的那个迭代器来遍历，那就改用内置的intertools模块中的zip_longest函数。

## 第九条：不要在for与while循环后面写else块

Python的循环有一项大多数编程语言都不支持的特性，即可以把else块紧跟在整个循环结构的后面。在执行完循环后继续走else的代码，如果在循环未执行完时退出循环了，那么就不会走else块的代码。

这个逻辑与普通的判断中的else块逻辑并不相同，为什么for循环走完后还要走else块呢？这样不就成了and的关系了？在循环后面写else块会让代码产生歧义，对可读性的影响大于了带来的便利性，不建议使用。

## 第十条：用赋值表达式减少重复代码

赋值表达式是python3.8引入的新语法，它会用到海象操作符(walrus operator).我们在Python中经常要先获取某个值，然后判断它是否非零，如果是就执行某段代码。对于这种用法，赋值表达式就是为了解决这个问题。

~~~python
# 原写法
count = fresh_fruit.get('lemon', 10)
if count:
    make_lemonade(count)
else:
    out_of_stock()

# 使用了海象表达式的写法
if count:= fresh_fruit.get('lemon', 10):
    make_lemonade(count)
else:
    out_of_stock()
~~~

新写法虽然只省了一行，但读起来清晰很多，因为这种写法明确体现了count遍历只与if有关。这个赋值表达式先把:=右边的值赋给左边的count变量，然后对自身求值，也就是把变量的值当成整个表达式的值。

这种先赋值再判断的做法，正是还想表达式想表达的用意。

Python虽然不支持switch/case与do/while结构，但可以利用赋值表达式清晰的模拟这种逻辑。

~~~python
# switch/case
if ( count:= fresh_fruit.get('lemon', 10)) >= 2:
    make_lemonade(count)
elif ( count:= fresh_fruit.get('apple', 10)) >= 4:
    make_cider(count)
elif count:= fresh_fruit.get('banana', 10):
    make_bananas(count)

# do/while
bottles = []
while fresh_fruit := pick_fruit():
    for fruit, count in fresh_fruit.items():
        batch = make_juice(fruit, count)
        bottles.extend(batch)
~~~