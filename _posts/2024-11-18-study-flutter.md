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
   3. 根据官网教程编写的第一个Flutter应用如下:

      ~~~dart
      import 'package:english_words/english_words.dart';
      import 'package:flutter/material.dart';
      import 'package:provider/provider.dart';

      void main() {
      runApp(MyApp());
      }

      class MyApp extends StatelessWidget {
      const MyApp({super.key});

      @override
      Widget build(BuildContext context) {
         return ChangeNotifierProvider(
            create: (context) => MyAppState(),
            child: MaterialApp(
            title: 'Namer App',
            theme: ThemeData(
               useMaterial3: true,
               colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
            ),
            home: MyHomePage(),
            ),
         );
      }
      }

      class MyAppState extends ChangeNotifier {
      var current = WordPair.random();
      void getNext() {
         current = WordPair.random();
         notifyListeners();
      }

      var favorites = <WordPair>[];

      void toggleFavorite() {
         if (favorites.contains(current)) {
            // 取消勾选
            favorites.remove(current);
         } else {
            // 选中
            favorites.add(current);
         }
         notifyListeners();
      }
      }

      // ...

      class MyHomePage extends StatefulWidget {
      @override
      State<MyHomePage> createState() => _MyHomePageState();
      }

      class _MyHomePageState extends State<MyHomePage> {

      var selectedIndex = 0;

      @override
      Widget build(BuildContext context) {

         Widget page;
         
         switch (selectedIndex) {
            case 0:
            page = GeneratorPage();
            break;
            case 1:
            page = FavoritesPage();
            break;
            default:
            throw UnimplementedError('no widget for $selectedIndex');
         }

         return LayoutBuilder(
            builder: (context, constraints) {
            return Scaffold(
               body: Row(
                  children: [
                  SafeArea(
                     child: NavigationRail(
                        extended: constraints.maxWidth >= 600,
                        destinations: [
                        NavigationRailDestination(
                           icon: Icon(Icons.home),
                           label: Text('Home'),
                        ),
                        NavigationRailDestination(
                           icon: Icon(Icons.favorite),
                           label: Text('Favorites'),
                        ),
                        ],
                        selectedIndex: selectedIndex,
                        onDestinationSelected: (value) {
                        setState(() {
                           selectedIndex = value;
                        });
                        print("selectedIndex= ${selectedIndex.toString()}");
                        },
                     ),
                  ),
                  Expanded(
                     child: Container(
                        color: Theme.of(context).colorScheme.primaryContainer,
                        child: page,
                     ),
                  ),
                  ],
               ),
            );
            }
         );
      }
      }

      // ...


      class GeneratorPage extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
         var appState = context.watch<MyAppState>();
         var pair = appState.current;

         IconData icon;
         if (appState.favorites.contains(pair)) {
            icon = Icons.favorite;
         } else {
            icon = Icons.favorite_border;
         }

         return Center(
            child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
               BigCard(pair: pair),
               SizedBox(height: 10),
               Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                  ElevatedButton.icon(
                     onPressed: () {
                        appState.toggleFavorite();
                     },
                     icon: Icon(icon),
                     label: Text('Like'),
                  ),
                  SizedBox(width: 10),
                  ElevatedButton(
                     onPressed: () {
                        appState.getNext();
                     },
                     child: Text('Next'),
                  ),
                  ],
               ),
            ],
            ),
         );
      }
      }


      class FavoritesPage extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
         var appState = context.watch<MyAppState>();

         if (appState.favorites.isEmpty) {
            return Center(
            child: Text('No favorites yet.'),
            );
         }
         
         return ListView(
            children: [
            Padding(
               padding: const EdgeInsets.all(20),
               child: Text('You have '
                  '${appState.favorites.length} favorites:'),
            ),
            for (var pair in appState.favorites)
               ListTile(
                  leading: const Icon(Icons.favorite),
                  title: Text(pair.asLowerCase),
               ),
            ]
         );

      }
      }
      // ...

      class BigCard extends StatelessWidget {
      const BigCard({
         super.key,
         required this.pair,
      });

      final WordPair pair;

      @override
      Widget build(BuildContext context) {
         final theme = Theme.of(context);
         final style = theme.textTheme.displayMedium!.copyWith(
            color: theme.colorScheme.onPrimary,
         );

         return Card(
            color: theme.colorScheme.primary,
            child: Padding(
            padding: const EdgeInsets.all(20),
            child: Text(
               pair.asLowerCase,
               style: style,
               semanticsLabel: "${pair.first} ${pair.second}",
            ),
            ),
         );
      }
      }

      ~~~
   4. 附加任务:实现此应用的高级代码,了解如何添加动画列表,渐变,淡出淡入等.

3. **学习基础知识** 这是一篇针对新 Flutter 开发者且有明确指导性的文档，会引导你了解构建 Flutter 应用的重要部分，这部分里都是英文文档了。
   1. Intro to Dark
   2. Widget fundamentals
      In regard to Flutter, you'll often hear "every thing is widget". Wedgets are the building blocks of a Flutter app's user interface, and each widget is an immutable declaration of part of the user interface. Widgets are used to describe all aspects of a user interface, including physical aspects such as text and buttons to lay out effects like padding and alignment.

      关于 Flutter，你经常会听到 “一切都是一个小部件”。Widget 是 Flutter 应用用户界面的构建块，每个 widget 都是用户界面部分的不可变声明。小部件用于描述用户界面的所有方面，包括文本等物理方面和按钮，以布置填充和对齐等效果。

      示例代码：

      ~~~Dart
      import 'package:english_words/english_words.dart';
      import 'package:flutter/material.dart';
      import 'package:provider/provider.dart';

      void main() {
      runApp(MyApp());
      }

      class MyApp extends StatelessWidget {
      const MyApp({super.key});

      @override
      Widget build(BuildContext context) {
         return ChangeNotifierProvider(
            create: (context) => MyAppState(),
            child: MaterialApp(
            title: 'Namer App',
            theme: ThemeData(
               useMaterial3: true,
               colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
            ),
            home: MyHomePage(),
            ),
         );
      }
      }

      class MyAppState extends ChangeNotifier {
      var current = WordPair.random();
      void getNext() {
         current = WordPair.random();
         notifyListeners();
      }

      var favorites = <WordPair>[];

      void toggleFavorite() {
         if (favorites.contains(current)) {
            // 取消勾选
            favorites.remove(current);
         } else {
            // 选中
            favorites.add(current);
         }
         notifyListeners();
      }
      }

      // ...

      class MyHomePage extends StatefulWidget {
      @override
      State<MyHomePage> createState() => _MyHomePageState();
      }

      class _MyHomePageState extends State<MyHomePage> {

      var selectedIndex = 0;

      @override
      Widget build(BuildContext context) {

         Widget page;
         
         switch (selectedIndex) {
            case 0:
            page = GeneratorPage();
            break;
            case 1:
            page = FavoritesPage();
            break;
            default:
            throw UnimplementedError('no widget for $selectedIndex');
         }

         return LayoutBuilder(
            builder: (context, constraints) {
            return Scaffold(
               body: Row(
                  children: [
                  SafeArea(
                     child: NavigationRail(
                        extended: constraints.maxWidth >= 600,
                        destinations: [
                        NavigationRailDestination(
                           icon: Icon(Icons.home),
                           label: Text('Home'),
                        ),
                        NavigationRailDestination(
                           icon: Icon(Icons.favorite),
                           label: Text('Favorites'),
                        ),
                        ],
                        selectedIndex: selectedIndex,
                        onDestinationSelected: (value) {
                        setState(() {
                           selectedIndex = value;
                        });
                        print("selectedIndex= ${selectedIndex.toString()}");
                        },
                     ),
                  ),
                  Expanded(
                     child: Container(
                        color: Theme.of(context).colorScheme.primaryContainer,
                        child: page,
                     ),
                  ),
                  ],
               ),
            );
            }
         );
      }
      }

      // ...


      class GeneratorPage extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
         var appState = context.watch<MyAppState>();
         var pair = appState.current;

         IconData icon;
         if (appState.favorites.contains(pair)) {
            icon = Icons.favorite;
         } else {
            icon = Icons.favorite_border;
         }

         return Center(
            child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
               BigCard(pair: pair),
               SizedBox(height: 10),
               Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                  ElevatedButton.icon(
                     onPressed: () {
                        appState.toggleFavorite();
                     },
                     icon: Icon(icon),
                     label: Text('Like'),
                  ),
                  SizedBox(width: 10),
                  ElevatedButton(
                     onPressed: () {
                        appState.getNext();
                     },
                     child: Text('Next'),
                  ),
                  ],
               ),
            ],
            ),
         );
      }
      }


      class FavoritesPage extends StatelessWidget {
      @override
      Widget build(BuildContext context) {
         var appState = context.watch<MyAppState>();

         if (appState.favorites.isEmpty) {
            return Center(
            child: Text('No favorites yet.'),
            );
         }
         
         return ListView(
            children: [
            Padding(
               padding: const EdgeInsets.all(20),
               child: Text('You have '
                  '${appState.favorites.length} favorites:'),
            ),
            for (var pair in appState.favorites)
               ListTile(
                  leading: const Icon(Icons.favorite),
                  title: Text(pair.asLowerCase),
               ),
            ]
         );

      }
      }
      // ...

      class BigCard extends StatelessWidget {
      const BigCard({
         super.key,
         required this.pair,
      });

      final WordPair pair;

      @override
      Widget build(BuildContext context) {
         final theme = Theme.of(context);
         final style = theme.textTheme.displayMedium!.copyWith(
            color: theme.colorScheme.onPrimary,
         );

         return Card(
            color: theme.colorScheme.primary,
            child: Padding(
            padding: const EdgeInsets.all(20),
            child: Text(
               pair.asLowerCase,
               style: style,
               semanticsLabel: "${pair.first} ${pair.second}",
            ),
            ),
         );
      }
      }
      ~~~

      In the preceding code, all instantiated classes are widgets: MaterialApp, Scaffold, AppBar, Text, Center, Builder, Column, SizedBox, and ElevatedButton.

      在上面的戴那种哦，所有的实例化的类都是widgets：MaterialApp、Scaffold、AppBar、Text、Center、Builder、Column、SizedBox和ElevatedButton。

      **Widget composition**

      As mentioned, Flutter emphasizes widgets as a unit of composition. Widgets are typically composed of many other small, single-purpose widgets that combine to produce powerful effects.

      如前所述，Flutter 强调 widget 是一个组合单位。Widget 通常由许多其他小型的单一用途 Widget 组成，这些 Widget 组合在一起可产生强大的效果。

      There are layout widgets such as Padding, Alignment, Row, Column, and Grid. These layout widgets do not have a visual representation of their own. Instead, their sole purpose is to control some aspect of another widget's layout. Flutter also includes utility widgets that take advantage of this compositional approach. For example, Container, a commonly used widget, is made up of several widgets responsible for layout, painting, positioning, and sizing. Some widgets have visual representation, such as ElevatedButton and Text in the preceding example, as well as widgets like Icon and Image.

      有布局小部件，例如 Padding、Alignment、Row、Column 和 Grid。这些布局小部件没有自己的视觉表示。相反，它们的唯一目的是控制另一个小部件布局的某些方面。Flutter 还包括利用这种组合方法的实用程序 widget。例如，Container（一种常用的 Widget）由多个 Widget（负责布局、绘制、定位和大小调整）组成。一些小组件具有可视化表示形式，例如前面示例中的 ElevatedButton 和 Text，以及 Icon 和 Image 等小组件。

      If you run the code from the preceding example, Flutter paints a button with the text "Hello, World!" centered on the screen, laid out vertically. To position these elements, there's a Center widget, which positions its children in the center of the available space, and a Column widget, which lays out its children vertically one after another.

      如果你运行前面示例中的代码，Flutter 会在屏幕上绘制一个带有文本 “Hello， World！”的按钮，并垂直布局。为了定位这些元素，有一个 Center widget 和一个 Column widget，前者将其子项放置在可用空间的中心，后者一个接一个地垂直布局其子项。

      **Building widgets**

      To create a user interface in Flutter, you override the build method on widget objects. All widgets must have a build method, and it must return another widget. 

      要在 Flutter 中创建用户界面，你需要覆盖 widget 对象的 build 方法。所有 widget 都必须有一个 build 方法，并且它必须返回另一个 widget。

      ~~~dart
      class PaddedText extends StatelessWidget {
      const PaddedText({super.key});

      @override
      Widget build(BuildContext context) {
         return Padding(
            padding: const EdgeInsets.all(8.0),
            child: const Text('Hello, World!'),
         );
      }
      }
      ~~~

      The framework calls the build method when this widget is created and when the dependencies of this widget change (such as state that is passed into the widget). This method can potentially be called in every frame and should not have any side effects beyond building a widget. To learn more about how Flutter renders widgets, check out the Flutter architectural overview.

      当创建此 Widget 时，当此 Widget 的依赖项发生更改（例如，传递到 Widget 中的状态）时，框架会调用 build 方法。此方法可能在每一帧中都调用，并且除了构建小部件之外，不应有任何副作用。要了解有关 Flutter 如何渲染 widget 的更多信息，请查看 Flutter 架构概述。

      **Widget state**

      The framework introduces two major classes of widget: stateful and stateless widgets.

      该框架引入了两大类 widget：有状态 widget 和无状态 widget。

      Widgets that have no mutable state (they have no class properties that change over time) subclass StatelessWidget. Many built-in widgets are stateless, such as Padding, Text, and Icon. When you create your own widgets, you'll create Stateless widgets most of the time.

      没有可变状态的 widget（它们没有随时间变化的类属性）是 StatelessWidget 的子类。许多内置小部件是无状态的，例如 Padding、Text 和 Icon。当您创建自己的 widget 时，大多数时候您将创建无状态 widget。

      On the other hand, if the unique characteristics of a widget need to change based on user interaction or other factors, that widget is stateful. For example, if a widget has a counter that increments whenever the user taps a button, then the value of the counter is the state for that widget. When that value changes, the widget needs to be rebuilt to update its part of the UI. These widgets subclass StatefulWidget, and (because the widget itself is immutable) they store mutable state in a separate class that subclasses State. StatefulWidgets don't have a build method; instead, their user interface is built through their State object, as shown in the example below.

      另一方面，如果 widget 的独特特征需要根据用户交互或其他因素进行更改，则该 widget 是有状态的。例如，如果 Widget 有一个计数器，每当用户点击按钮时，该计数器就会递增，则 counter 的值就是该 Widget 的状态。当该值发生变化时，需要重新构建小组件以更新其在 UI 中的部分。这些 widget 是 StatefulWidget 的子类，并且（因为 widget 本身是不可变的）它们将可变状态存储在一个单独的类中，该类是 State 的子类。StatefulWidgets 没有 build 方法;相反，它们的用户界面是通过 State 对象构建的，如下面的示例所示。

      ~~~dart
      class CounterWidget extends StatefulWidget {
      @override
      State<CounterWidget> createState() => _CounterWidgetState();
      }

      class _CounterWidgetState extends State<CounterWidget> {
      int _counter = 0;

      void _incrementCounter() {
         setState(() {
            _counter++;
         });
      }
      
      @override
      Widget build(BuildContext context) {
         return Text('$_counter');
      }
      }
      ~~~

      Whenever you mutate a State object (for example, by incrementing the counter), you must call setState to signal the framework to update the user interface by calling the State's build method again.

      每当更改 State 对象时（例如，通过递增计数器），都必须调用 setState，通过再次调用 State 的 build 方法来向框架发出更新用户界面的信号。

      Separating state from widget objects lets other widgets treat both stateless and stateful widgets in exactly the same way, without being concerned about losing state. Instead of needing to hold on to a child to preserve its state, the parent can create a new instance of the child at any time without losing the child's persistent state. The framework does all the work of finding and reusing existing state objects when appropriate.

      将状态与 widget 对象分离可以让其他 widget 以完全相同的方式处理无状态和有状态的 widget，而无需担心丢失状态。父级无需保留子级来保留其状态，而是可以随时创建子级的新实例，而不会丢失子级的持久状态。框架在适当的时候执行查找和重用现有 state 对象的所有工作。

      **Important widgets to know**

      The Flutter SDK includes many built-in widgets, from the smallest pieces of UI, like , to layout widgets, and widgets that style your application. The following widgets are the most important to be aware of as you move onto the next lesson in the learning pathway.Text

      Flutter SDK 包含许多内置的 widget，从最小的 UI 部分（如 ）到布局 widget，以及为应用程序设置样式的 widget。以下小部件是您在进入学习路径中的下一课时需要了解的最重要的小部件。
         Container
         Text
         Scaffold
         AppBar
         Row and Column
         ElevatedButton
         Image
         Icon

   3. Layout
   4. State management
   5. Handling user input
   6. Network and data
   7. Local data and caching
