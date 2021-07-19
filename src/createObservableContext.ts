import { createContext, useContext } from 'react'
import { BehaviorSubject } from 'rxjs'
import { createObservableNext } from './createObservableNext'
import { createObservableProvider } from './createObservableProvider'
import { createObservableSelector } from './createObservableSelector'

export function createSubject<InputType = unknown> (
  defaultValue: InputType
) {
  return new BehaviorSubject(defaultValue)
}

/**
 * 创建 ObservableContext 的工厂
 */
export function createObservableContext<InputType = unknown> (
  defaultValue: InputType
) {
  const subject$ = createSubject(defaultValue)
  const Context = createContext(subject$)

  const { useObservableSelector } = createObservableSelector(Context)
  const { useObservableNext } = createObservableNext(Context)
  const { ObservableProvider } = createObservableProvider(Context, subject$)
  return {
    ObservableProvider,
    observable$: subject$,
    useObservable: () => useContext(Context),
    useObservableSelector,
    useObservableNext
  }
}
export const createRxContext = createObservableContext
