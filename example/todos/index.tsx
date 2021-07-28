import React, { FC } from 'react'
import AddTodo from './AddTodo'
import Footer from './Footer'
import { ObservableProvider } from './observableStore'
import TodoList from './TodoList'
import { VisibilityFilters } from './type'
import Addon from './Addon'

const initValue = { todoList: [{ id: 0, text: '12', completed: false }, { id: 1, text: '1213214', completed: false }, { id: 2, text: '1321421', completed: false }], filter: VisibilityFilters.SHOW_ALL }

const App :FC = () => {
  return (
    <ObservableProvider value={initValue}>
      <AddTodo />
      <TodoList />
      <Footer />
      <Addon />
    </ObservableProvider>
  )
}
export default App
