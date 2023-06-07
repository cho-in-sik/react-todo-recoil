import { atom, selector } from 'recoil';
import { localStorageEffect } from './utils/localStorage';

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: 'toDo',
  default: {
    'To Do': [],
    Doing: [],
    Done: [],
  },
  effects: [localStorageEffect('todo_list')],
});
