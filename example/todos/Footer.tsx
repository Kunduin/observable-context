import React, { FC } from 'react'
import Link from './Link'
import { VisibilityFilters } from './type'

const Footer: FC = () => (
  <div>
    <span>Show: </span>
    <Link filter={VisibilityFilters.SHOW_ALL}>
      All
    </Link>
    <Link filter={VisibilityFilters.SHOW_ACTIVE}>
      Active
    </Link>
    <Link filter={VisibilityFilters.SHOW_COMPLETED}>
      Completed
    </Link>
  </div>
)

export default Footer
