
export interface Root {
  todoList: Todo[]
  filter: VisibilityFilters
}

export enum VisibilityFilters {
  SHOW_ALL= 'SHOW_ALL',
  SHOW_COMPLETED= 'SHOW_COMPLETED',
  SHOW_ACTIVE= 'SHOW_ACTIVE'
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}
