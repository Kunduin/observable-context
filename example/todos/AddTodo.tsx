import React, { useRef } from 'react'
import { useUpdate } from './useUpdate'

const AddTodo = () => {
  const { addTodo } = useUpdate()
  const input = useRef<HTMLInputElement | null>(null)

  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault()
        if (!input.current?.value.trim()) {
          return
        }
        addTodo(input.current.value)
        input.current.value = ''
      }}>
        <input ref={input} />
        <button type="submit">
          Add Todo
        </button>
      </form>
    </div>
  )
}

export default AddTodo
