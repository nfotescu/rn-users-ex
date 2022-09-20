import {User} from '../types/user';

export interface UsersInfiniteScrollMachineContext {
  data: User[];
  total: number;
  skip: number;
  limit: number;
  errorMessage?: string;
}

export type UsersFetchResponse = {
  users: User[];
  total: number;
  skip: number;
  limit: number;
};

export type UsersInfiniteScrollMachineEvent =
  | {
      type: 'SCROLL_TO_BOTTOM';
    }
  | {
      type: 'RECEIVED_DATA';
      data: User[];
      total: number;
    };
