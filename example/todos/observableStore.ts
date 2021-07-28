import { createObservableContext } from '../../src'
import { Root, VisibilityFilters } from './type'

export const { ObservableProvider, useObservableSelector, useObservableOperator, useObservable, useObservableNext } =
  createObservableContext<Root>({
    todoList: [],
    filter: VisibilityFilters.SHOW_ALL
  })
