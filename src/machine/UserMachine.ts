import {assign, createMachine, Sender} from 'xstate';
import {User} from '../types/user';
import {USERS_API_URL} from './constants';
import { fetchUserService } from './services';

export interface SingleUserFetchMachineContext {
  user?: User;
  id?: number;
  errorMessage?: string;
}

export type SingleUserFetchMachineEvent =
  | {
      type: 'FETCH';
    }
  | {
      type: 'RETRY';
    };

const singleUserFetchMachine = createMachine<
  SingleUserFetchMachineContext,
  SingleUserFetchMachineEvent
>({
  id: 'user',
  initial: 'idle',
  context: {},
  states: {
    idle: {
      on: {
        FETCH: 'loading',
      },
    },
    loading: {
      invoke: {
        id: 'getUser',
        src: (context, event) => fetchUserService(context?.id!),
        onDone: {
          target: 'success',
          actions: assign({user: (context, event) => event.data}),
        },
        onError: {
          target: 'failure',
          actions: assign({errorMessage: (context, event) => event.data || 'Something went wrong'}),
        },
      },
    },
    success: {},
    failure: {},
  },
});

export default singleUserFetchMachine;
