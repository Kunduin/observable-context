import { useContext, useRef, useReducer, useEffect } from 'react'
import { EqualityFn, ObservableContext } from './type'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

type Selector<InputType, OutputType = InputType> = (inputs: InputType) => OutputType;

const defaultSelector = <A, B = A>(a: A): B => a as unknown as B

/**
 * core of useObservableSelector. a redux useSelector like hook.
 * @param Context observable context
 * @param selector select the store value
 * @param equalityFn compare the changes before and after reaction. default use ===
 * @returns selected value
 */
export function useObservableSelector<
  InputType = unknown,
  OutputType = InputType,
> (
  Context: ObservableContext<InputType>,
  selector: Selector<InputType, OutputType> = defaultSelector,
  equalityFn: EqualityFn = (a, b) => a === b
): OutputType {
  const store = useContext(Context)
  const storeState = store.getValue()

  const [, forceRender] = useReducer(s => s + 1, 0)

  const latestSubscriptionCallbackError = useRef<Error>()
  const latestSelector = useRef<Selector<InputType, OutputType>>()
  const latestStoreState = useRef<InputType>()
  const latestSelectedState = useRef<OutputType>()

  let selectedState: OutputType

  // selector or equalityFn may throw error here
  try {
    if (
      // initial selected state will be set because initial latestSelector.current is always different with selector
      selector !== latestSelector.current ||
      storeState !== latestStoreState.current ||
      latestSubscriptionCallbackError.current
    ) {
      const newSelectedState = selector(storeState)
      // ensure latest selected state is reused so that a custom equality function can result in identical references
      if (
        latestSelectedState.current === undefined ||
          !equalityFn(newSelectedState, latestSelectedState.current)
      ) {
        selectedState = newSelectedState
      } else {
        selectedState = latestSelectedState.current
      }
    } else if (latestSelectedState.current !== undefined) {
      selectedState = latestSelectedState.current
    }
  } catch (err) {
    if (latestSubscriptionCallbackError.current && err instanceof Error) {
      err.message += `\nThe error may be correlated with this previous error:\n${latestSubscriptionCallbackError.current.stack}\n\n`
    }

    throw err
  }

  useIsomorphicLayoutEffect(() => {
    latestSelector.current = selector
    latestStoreState.current = storeState
    latestSelectedState.current = selectedState
    latestSubscriptionCallbackError.current = undefined
  })

  useEffect(() => {
    function checkForUpdates (newStoreState: InputType) {
      try {
        const newSelectedState = latestSelector.current?.(newStoreState)

        if (equalityFn(newSelectedState, latestSelectedState.current)) {
          return
        }

        latestSelectedState.current = newSelectedState
        latestStoreState.current = newStoreState
      } catch (err) {
        // we ignore all errors here, since when the component
        // is re-rendered, the selectors are called again, and
        // will throw again, if neither props nor store state
        // changed
        if (err instanceof Error) {
          latestSubscriptionCallbackError.current = err
        }
      }

      forceRender()
    }

    const subscription = store.subscribe(checkForUpdates)
    return () => subscription.unsubscribe()
  }, [equalityFn, store])

  return selectedState!
}

/**
 * create {@link useObservableSelector} by context.
 * @param Context observable context
 * @returns useObservableSelector
 */
export function createObservableSelector<
  InputType = unknown,
> (Context: ObservableContext<InputType>) {
  function useCurriedObservableSelector<OutputType = InputType> (
    selector: Selector<InputType, OutputType> = defaultSelector,
    equalityFn?: EqualityFn
  ): OutputType {
    return useObservableSelector(Context, selector, equalityFn)
  }
  return {
    useObservableSelector: useCurriedObservableSelector
  }
}
