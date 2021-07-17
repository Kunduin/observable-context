import { Context, createContext } from 'react'
import { BehaviorSubject } from 'rxjs'

export type ObservableContext<T> = Context<BehaviorSubject<T>>

/**
 * 
 * @param defaultValue 
 * @returns 
 */
export default function createObservableContext<T>(defaultValue: T) {

  const subject$ = new BehaviorSubject(defaultValue)
  
  const Context = createContext(subject$);

  return {
    Context
  }
}


export const createRxContext = createObservableContext