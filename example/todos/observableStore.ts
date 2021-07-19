import { createObservableContext } from '../../src'
import { Root, VisibilityFilters } from './type'

export const { ObservableProvider, observable$, useObservableSelector, useObservable, useObservableNext } =
  createObservableContext<Root>({
    todoList: [],
    filter: VisibilityFilters.SHOW_ALL
  })
