import React, { FC } from 'react'
import AddTodo from './AddTodo'
import Footer from './Footer'
import { ObservableProvider } from './observableStore'
import TodoList from './TodoList'

const App :FC = () => {
  return (
    <ObservableProvider>
      <AddTodo />
      <TodoList />
      <Footer />
    </ObservableProvider>
  )
}
export default App
