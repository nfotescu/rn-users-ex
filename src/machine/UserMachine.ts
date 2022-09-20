import {assign, createMachine} from 'xstate';
import {User} from '../types/user';
import {fetchUserService} from './services';

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
        src: context => fetchUserService(context?.id!),
        onDone: {
          target: 'success',
          actions: assign({user: (_, event) => event.data}),
        },
        onError: {
          target: 'failure',
          actions: assign({
            errorMessage: (_, event) => event.data || 'Something went wrong',
          }),
        },
      },
    },
    success: {},
    failure: {},
  },
});

export default singleUserFetchMachine;
