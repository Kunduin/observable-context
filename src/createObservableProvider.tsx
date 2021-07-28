import React, { PropsWithChildren } from 'react'
import { BehaviorLikeSubject, ObservableContext } from './type'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * provider props, all props are provided to overwrite and test.
 */
export interface ObservableProviderProps<InputType> {
  subject?: BehaviorLikeSubject<InputType>
  value?: InputType
}

/**
 * create observable provider
 * @param Context observable context
 * @param initSubject$ subject
 * @returns observable provider
 */
export function createObservableProvider <InputType> (Context: ObservableContext<InputType>, initSubject$: BehaviorLikeSubject<InputType>) {
  function ObservableProvider ({ subject, children, value }: PropsWithChildren<ObservableProviderProps<InputType>>) {
    const realSubject = subject ?? initSubject$
    useIsomorphicLayoutEffect(() => {
      if (value) {
        realSubject.next(value)
      }
    }, [value])

    return (
      <Context.Provider value={subject ?? initSubject$}>
        {children}
      </Context.Provider>
    )
  }

  return { ObservableProvider }
}
