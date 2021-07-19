import { Context } from 'react'
import { BehaviorSubject } from 'rxjs'

export type ObservableContext<T> = Context<BehaviorSubject<T>>
