import { useCallback } from 'react'
import { useObservableNext } from './observableStore'
import { VisibilityFilters } from './type'

let id = 10000
const getId = () => (id++)

export function useUpdate () {
  const next = useObservableNext()

  const addTodo = useCallback((text: string) => {
    next(pre => ({
      ...pre,
      todoList: [...pre.todoList, {
        id: getId(),
        text,
        completed: false
      }]
    }))
  }, [next])

  const toggleTodo = useCallback((id: number) => {
    next(pre => ({
      ...pre,
      todoList: pre.todoList.map(todo =>
        (todo.id === id)
          ? { ...todo, completed: !todo.completed }
          : todo)
    }))
  }, [next])

  const setVisibilityFilter = useCallback((filter: VisibilityFilters) => {
    next(pre => ({
      ...pre,
      filter
    }))
  }, [next])

  return { addTodo, toggleTodo, setVisibilityFilter }
}
