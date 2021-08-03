import { createObservableContext } from 'observable-context'
import { Root, VisibilityFilters } from './type'

export const { ObservableProvider, useObservableSelector, useObservableOperator, useObservable, useObservableNext } =
  createObservableContext<Root>({
    todoList: [],
    filter: VisibilityFilters.SHOW_ALL
  })
