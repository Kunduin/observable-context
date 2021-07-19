import React, { FC } from 'react'
import { useObservableSelector } from './observableStore'
import { Todo, VisibilityFilters } from './type'
import { useUpdate } from './useUpdate'

const getVisibleTodos = (todos: Todo[], filter: VisibilityFilters) => {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(t => t.completed)
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(t => !t.completed)
    default:
      throw new Error('Unknown filter: ' + filter)
  }
}

const TodoList: FC = () => {
  const todoList = useObservableSelector((root) => root.todoList)
  const filter = useObservableSelector(root => root.filter)
  const todos = getVisibleTodos(todoList, filter)
  const { toggleTodo } = useUpdate()

  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          onClick={() => toggleTodo(todo.id)}
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}
        >
          {todo.text}
        </li>
      ))}
    </ul>
  )
}

export default TodoList
