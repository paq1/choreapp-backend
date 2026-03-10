export type TodoError =
  | { type: 'VALIDATION_ERROR'; message: string }
  | { type: 'TODO_NOT_FOUND'; id: string }
  | { type: 'TITLE_ALREADY_USED'; title: string };
