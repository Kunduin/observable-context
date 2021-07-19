import { useContext, useRef, useReducer, useEffect } from 'react'
import { ObservableContext } from './type'

type Selector<InputType, OutputType = InputType> = (inputs: InputType) => OutputType;

const defaultSelector = <A, B = A>(a: A): B => a as unknown as B

/**
 * 创建 observable 的工厂
 */
export function createObservableSelector<InputType> (Context: ObservableContext<InputType>) {
  function useObservableSelector<OutputType = InputType> (
    selector: Selector<InputType, OutputType> = defaultSelector
  ) {
    const context = useContext(Context)
    const value = useRef(selector(context.value))
    const [, forceRender] = useReducer(s => s + 1, 0)

    useEffect(() => {
      const subscription = context.subscribe(v => {
        const selectedValue = selector(v)
        if (selectedValue !== value.current) {
          value.current = selectedValue
          forceRender()
        }
      })
      return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return value.current
  }

  return {
    useObservableSelector
  }
}
