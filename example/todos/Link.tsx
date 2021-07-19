import React, { FC } from 'react'
import { useObservableSelector } from './observableStore'
import { VisibilityFilters } from './type'
import { useUpdate } from './useUpdate'

export interface LinkProps {
  filter: VisibilityFilters
}

const Link: FC<LinkProps> = ({ filter, children }) => {
  const { setVisibilityFilter } = useUpdate()
  const currentFilter = useObservableSelector(root => root.filter)
  const active = currentFilter === filter
  return (
  <button
    onClick={() => setVisibilityFilter(filter)}
    disabled={active}
    style={{
      marginLeft: '4px'
    }}
  >
    {children}
  </button>
  )
}

export default Link
