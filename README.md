# Observable Context

这是 rxjs 爱好者制作的一个 react 状态管理器。本项目使用 rxjs 作为响应式的内核，除了提供与 redux 类似的状态监听方法以外，还提供了 rxjs 独有的 pipe 支持。

## 1. 安装

```shell
npm i observable-context rxjs

yarn add observable-context rxjs
```

## 2. 核心概念

### 2.1 响应式，rxjs，redux

[reactiveX](http://reactivex.io/intro.html) 是一套事件驱动的响应式编程库，其中 [rxjs](https://rxjs.dev/) 是其中 JavaScript 的一套实现。这个响应式编程其实也不是什么黑魔法，本质就是观察者模式的一个扩展，只是在其中使用了很多函数式的思想导致其有一定的“反直觉”。

观察者模式的本质就是监听与广播，这个感兴趣可以略做了解。事实上 redux 的本质也只是一个可监听的容器，redux 容器的状态改变会通知所有监听的组件，每个 useSelector 或者 connect 的本质就是让这个组件监听 redux 的变化然后根据 redux 的变化决定是否重新渲染。这是 redux 能够做到只在某个节点进行高性能更新的本质。

从观察者模式的思想出发，redux 和 rxjs 本质是一样的，既然如此作为 rxjs 的爱好者，重铸 rxjs 荣光我辈义不容辞呀。所以就实现了一套 rxjs 为核心的状态管理器，作为一个抛砖引玉，希望有更多优秀的同好可以加入到重铸 rxjs 荣光的道路上来，将 rxjs 优秀的响应式能力结合到 react 的生态中来，改进大家的开发体验。

### 2.2 Subject

下文提到的所有 subject，指的都是 rxjs 中的 [subject](https://rxjs.dev/guide/subject). subject 有广播的能力，使用这个能力

### 2.3 本项目的容器

这里也没有黑魔法。本项目使用的容器就是 react 的 context，只是 context 的 value 永远是不变的 rxjs subject，因此不会因为 context 的值更新导致所有使用 context 的组件重新渲染。了解这个概念之后，下面的很多内容都不过是上面的补充。

## 3. 核心能力

### 3.1 创建容器

创建容器共有两个工厂，这两个工厂选择一个使用就可以了，本项目允许使用自己定制的核心 subject，因此除了提供一个默认的以 behavior subject 为核心的工厂 `createObservableContext` 以外，提供了一个使用自己 subject 的工厂 `createObservableContextBySubject`

**示例**

```ts
export const {
  ObservableProvider, // provider 和你想象的那个 provider 用处一样
  ObservableContext, // context 则是值为 subject 的 context
  subject$, // subject 就是生产的 subject
  useObservable, // useObservable 返回的就是 subject
  useObservableSelector, // useObservableSelector 本意和 redux 一样
  useObservableNext, // useObservableNext 返回 subject 的更新函数，扩展了一定的能力
  useObservableOperator, // useObservableOperator 可以使用 pipe
} = createObservableContext<Root>({
  todoList: [],
  filter: VisibilityFilters.SHOW_ALL,
});
```

#### 3.1.1 `createObservableContext (initialValue)`

`initialValue` 是状态管理器的初始状态，返回值见下文。该方法使用 `BehaviorSubject` 作为 context 的核心

#### 3.1.2 `createObservableContextBySubject (subject$)`

`subject$` 是自己定制的 subject，这个 subject 需要和 behavior subject 一样拥有一个 `getValue` 方法，同时满足 subject 的所有能力。

### 3.2 创建容器时返回的所有工具

#### 3.2.1 `ObservableProvider`

和你想象的那个 provider 用处一样，标准的 Context.Provider, 提前填好了初值和 subject，这两者都可以覆盖方便测试。

#### 3.2.2 `ObservableContext`

值为 subject 的 context，可以拿出来与后文提到的独立工具使用

#### 3.2.3 `subject$`

创建好的 subject，用于组件之外的场合

#### 3.2.4 `useObservableSelector ([selector [,equalityFn]])`

监听 store 中被 selector 选择的对象是否改变

**类型定义**

```ts
/**
 * generic params
 * {InputType}: root state type
 * {OutputType}: selected type
 */
function useObservableSelector<OutputType = InputType>(
  selector?: Selector<InputType, OutputType>,
  equalityFn?: EqualityFn
): OutputType;

type Selector<InputType, OutputType = InputType> = (
  inputs: InputType
) => OutputType;

/** determine whether a is equal with b */
export type EqualityFn = <T>(a: T, b: T) => boolean;
```

**参数定义**

| 参数       | 类型                | 是否必须     | 描述                                 |
| ---------- | ------------------- | ------------ | ------------------------------------ |
| selector   | `(a) => b`          | not required | 选择store 中的某部分，不填就是全部值 |
| equalityFn | `(a, b) => boolean` | not required | 比较值更新的函数，这里默认值为 ===   |

**示例**

```ts
const currentFilter = useObservableSelector(root => root.filter)
```

#### 3.2.5 `useObservableNext ()`

获得 subject 的 next 方法，与原本的 next 方法不同的是，这里允许传入和 setState 一样的更新函数，可以简化流程

```ts
/**
 * generic params
 * {InputType}: root state type
 */
function useObservableNext<InputType = unknown>(
): (param: InputType | UpdateFunction<InputType>) => void

type UpdateFunction<InputType> = ((pre: InputType) => InputType)
```

**示例**

```ts
const next = useObservableNext()

const addTodo = useCallback((text: string) => {
  next(pre => ({
    ...pre,
    todoList: [...pre.todoList, {
      id: getId(),
      text,
      completed: false
    }]
  }))
}, [next])
```

#### 3.2.6 `useObservableOperator (withOperator [[, defaultValue], equalityFn])`

这里是与 redux 不同的地方，使用 withOperator 可以使用自定义的 pipe 等逻辑，充分利用 rxjs 的各种能力。

```ts
/**
 * generic params
 * {InputType}: root state type
 * {OutputType}: with operator result type
 */
function useObservableOperator<OutputType = unknown> (
  withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
): OutputType | void;
function useObservableOperator<OutputType = unknown> (
  withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
  defaultValue: OutputType,
  equalityFn?: EqualityFn
): OutputType;

/** determine whether a is equal with b */
export type EqualityFn = <T>(a: T, b: T) => boolean;
```


**参数定义**

| 参数         | 类型                                                         | 是否必须     | 描述                                                                                                    |
| ------------ | ------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------- |
| withOperator | `(events$: Observable<InputType>) => Observable<OutputType>` | required     | 添加 pipe 逻辑的地方                                                                                    |
| defaultValue | `OutputType`                                                 | not required | 如果 subject 没有触发更新，或者使用异步调度器，或操作符影响不一定有初值，这里的默认值可以保证返回值非空 |
| equalityFn   | `(a, b) => boolean`                                          | not required | 比较值更新的函数，这里默认值为 ===                                                                      |

**示例**

```tsx
const operator = (observable$:Observable<Root>) => observable$.pipe(
  map(item => item.filter),
  bufferCount(2)
)

const Addon:FC = () => {
  const histories = useObservableOperator(operator, [])
  return <div>
    last 2 histories buffer (rendered after 2 filter histories collected)
    <div>
      {histories.map(item => (<div>{item}</div>))}
    </div>
  </div>
}
```

#### 3.2.7 `useObservable ()`

获得 subject 实例，如果希望自己进行更优雅的处理可以使用这个 hook

```ts
/**
 * generic params
 * {InputType}: root state type
 */
function useObservable<InputType = any> (): ObservableContext<InputType>;
```


### 3.3 允许与任意容器结合的上述工具方法

除了上面几个通过工厂构造的返回工具以外，每个勾子都有一个可以主动使用 context 的版本，比如`useObservableSelector(a => a.b)` 还可以写成 `useObservableSelector(ObservableContext, a => a.b)`，第二种函数是不依赖某个具体的 Context 的，需要从本项目引入。3.2 介绍的是 `createObservableContext` 的返回值，而这里提到的这是本项目直接对外暴露的函数，工厂做的不过是帮你提前把 context 处理好了，如果你觉得命名混乱，不如使用本节提到的办法解决。

## 4. 感谢

本项目大量参考了 redux 和 observable hook 的实现，希望任何看到本项目的人都去了解一下那两个伟大的项目。

感谢 rxjs 团队制作了这么棒的工具。

## 5. License

MIT kunduin