import { Context } from 'react'
import { BehaviorSubject, Subject } from 'rxjs'

/** this project use getValue from behaviorSubject. if u want to use your own subject, remember to override getValue method. */
export type BehaviorLikeSubject<T = unknown> = Pick<BehaviorSubject<T>, 'getValue'> & Subject<T>;

/** context used to pass subject throughout components */
export type ObservableContext<State> = Context<BehaviorLikeSubject<State>>;

/** determine whether a is equal with b */
export type EqualityFn = <T>(a: T, b: T) => boolean;
