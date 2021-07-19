import React, { PropsWithChildren } from 'react'
import { BehaviorSubject } from 'rxjs'
import { ObservableContext } from './type'

export interface ObservableProviderProps<InputType> {
  observable$?: BehaviorSubject<InputType>;
}

export function createObservableProvider <InputType> (Context: ObservableContext<InputType>, initObservable$: BehaviorSubject<InputType>) {
  function ObservableProvider ({ observable$, children }: PropsWithChildren<ObservableProviderProps<InputType>>) {
    return (
      <Context.Provider value={observable$ ?? initObservable$}>
        {children}
      </Context.Provider>
    )
  }

  return { ObservableProvider }
}
