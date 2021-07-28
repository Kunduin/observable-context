import { createContext, useContext } from 'react'
import { BehaviorSubject } from 'rxjs'
import { createObservableNext } from './createObservableNext'
import { createObservableOperator } from './createObservableOperator'
import { createObservableProvider } from './createObservableProvider'
import { createObservableSelector } from './createObservableSelector'
import { BehaviorLikeSubject, ObservableContext } from './type'

/**
 * observable context factory. create context with customized subject.
 * this project uses {@link BehaviorLikeSubject} as core rxjs subject.
 *
 * @param subject$ a subject with getValue method to get current value
 * @returns all utilities initialized with subject$
 */
export function createObservableContextBySubject<
  InputType = any,
> (
  subject$: BehaviorLikeSubject<InputType>
) {
  const Context = createContext(subject$)

  const { useObservableSelector } = createObservableSelector<InputType>(Context)
  const { useObservableNext } = createObservableNext<InputType>(Context)
  const { useObservableOperator } = createObservableOperator<InputType>(Context)
  const { ObservableProvider } = createObservableProvider(Context, subject$)
  return {
    ObservableProvider,
    ObservableContext: Context,
    subject$,
    useObservable: () => useObservable(Context),
    useObservableSelector,
    useObservableNext,
    useObservableOperator
  }
}

/**
 * observable context factory. create context with initial value
 * @param initialValue store initial value
 * @returns all utilities.
 */
export function createObservableContext<InputType = any> (initialValue: InputType) {
  return createObservableContextBySubject<InputType>(new BehaviorSubject<InputType>(initialValue))
}

/**
 * use observable
 * @returns behavior like subject (react context does not support sub type, use assert for customized subject)
 */
export function useObservable<InputType = any> (Context: ObservableContext<InputType>) {
  return useContext(Context)
}
