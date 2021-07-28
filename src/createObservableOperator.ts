import { useContext, useMemo, useReducer, useRef } from 'react'
import { Observable } from 'rxjs'
import shallowEqual from './shadowEqual'
import { EqualityFn, ObservableContext } from './type'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Context value
 * @param Context observable context
 * @returns useObservableOperator without context as param
 */
export function createObservableOperator<
  InputType = unknown,
> (Context: ObservableContext<InputType>) {
  function useCurriedObservableOperator<OutputType = unknown> (
    withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
  ): OutputType | void;
  function useCurriedObservableOperator<OutputType = unknown> (
    withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
    defaultValue: OutputType,
    equalityFn?: EqualityFn
  ): OutputType;
  function useCurriedObservableOperator<OutputType = unknown> (
    withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
    defaultValue?: OutputType,
    equalityFn?: EqualityFn
  ): OutputType | void {
    return useObservableOperator<InputType, OutputType>(Context, withOperator, defaultValue!, equalityFn)
  }

  return { useObservableOperator: useCurriedObservableOperator }
}

/**
 * use observable operator. you can use pipe here !
 * @param Context observable context
 * @param withOperator append pipe or other function on subject
 * @param defaultValue since pipe is not necessarily synchronized,
 *                     you should use default value to make sure return value is not null.
 * @param equalityFn compare the changes before and after reaction. default use shadow equal here.
 * @returns
 */
export function useObservableOperator<
  InputType = unknown,
  OutputType = unknown,
> (
  Context: ObservableContext<InputType>,
  withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
): OutputType | void;
export function useObservableOperator<
  InputType = unknown,
  OutputType = unknown,
> (
  Context: ObservableContext<InputType>,
  withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
  defaultValue: OutputType,
  equalityFn?: EqualityFn
): OutputType;

export function useObservableOperator<
  InputType = unknown,
  OutputType = unknown,
> (
  Context: ObservableContext<InputType>,
  withOperator: (events$: Observable<InputType>) => Observable<OutputType>,
  defaultValue?: OutputType,
  equalityFn: EqualityFn = shallowEqual
): OutputType | void {
  const store = useContext(Context)
  const latestState = useRef(defaultValue)
  const [, forceRender] = useReducer(s => s + 1, 0)

  const memoStoreWithOperator = useMemo(() => withOperator(store), [store, withOperator])

  useIsomorphicLayoutEffect(() => {
    function checkForUpdates (newStoreState: OutputType) {
      if (equalityFn(newStoreState, latestState.current)) {
        return
      }

      latestState.current = newStoreState
      forceRender()
    }
    const subscription = memoStoreWithOperator.subscribe(checkForUpdates)
    return () => { subscription.unsubscribe() }
  }, [equalityFn, memoStoreWithOperator])

  return latestState.current
}
