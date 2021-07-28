import React, { FC, useRef } from 'react'
import { bufferCount, map, Observable } from 'rxjs'
import { useObservableOperator } from './observableStore'
import { Root } from './type'

const operator = (observable$:Observable<Root>) => observable$.pipe(
  map(item => item.filter),
  bufferCount(2)
)

const Addon:FC = () => {
  const histories = useObservableOperator(operator, [])
  return <div>
    last 2 histories buffer (rendered after 2 filter histories collected)
    <div>
      {histories.map(item => (<div>{item}</div>))}
    </div>
  </div>
}
export default Addon
