import { useCallback, useContext } from 'react'
import { ObservableContext } from './type'

type UpdateFunction<InputType> = ((pre: InputType) => InputType)

function isUpdateFunction<InputType> (param: InputType | UpdateFunction<InputType>): param is UpdateFunction<InputType> {
  return typeof param === 'function'
}

/**
 * create {@link useObservableNext} hook with observable context.
 * @param Context observable context
 * @returns use next function for state update. see {@link useObservableNext}
 */
export function createObservableNext<
  InputType = unknown,
> (Context: ObservableContext<InputType>) {
  function useCurriedObservableNext () {
    return useObservableNext<InputType>(Context)
  }

  return { useObservableNext: useCurriedObservableNext }
}

/**
 * use next function for state update。
 * @param Context observable context
 * @returns next function
 */
export function useObservableNext<
  InputType = unknown,
> (Context: ObservableContext<InputType>) {
  const context = useContext(Context)
  const next = useCallback((param: InputType | UpdateFunction<InputType>) => {
    if (isUpdateFunction(param)) {
      const data = param(context.getValue())
      context.next(data)
    } else {
      context.next(param)
    }
  }, [context])

  return next
}
