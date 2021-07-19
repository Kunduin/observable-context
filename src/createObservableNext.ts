import { useCallback, useContext } from 'react'
import { ObservableContext } from './type'

type UpdateFunction<InputType> = ((pre: InputType) => InputType)

function isUpdateFunction<InputType> (param: InputType | UpdateFunction<InputType>): param is UpdateFunction<InputType> {
  return typeof param === 'function'
}

export function createObservableNext<InputType> (Context: ObservableContext<InputType>) {
  function useObservableNext () {
    const context = useContext(Context)
    const next = useCallback((param: InputType | UpdateFunction<InputType>) => {
      if (isUpdateFunction(param)) {
        const data = param(context.getValue())
        context.next(data)
      } else {
        context.next(param)
      }
    }, [])

    return next
  }

  return { useObservableNext }
}
