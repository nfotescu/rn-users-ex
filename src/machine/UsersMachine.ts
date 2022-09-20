import {assign, createMachine} from 'xstate';
import {fetchingUsersService} from './services';
import {
  UsersInfiniteScrollMachineContext,
  UsersInfiniteScrollMachineEvent,
} from './types';

const usersInfiniteScrollMachine = createMachine<
  UsersInfiniteScrollMachineContext,
  UsersInfiniteScrollMachineEvent
>(
  {
    id: 'users',
    initial: 'fetchingUsers',
    context: {
      total: Infinity,
      limit: 20,
      skip: 0,
      data: [],
    },
    states: {
      fetchingUsers: {
        on: {
          RECEIVED_DATA: {
            target: 'checkingIfThereIsMoreData',
            actions: ['assignDataToContext'],
          },
        },
        invoke: {
          src: 'fetchingUsers',
          onError: {
            target: 'idle',
            actions: 'assignErrorMessageToContext',
          },
        },
      },
      idle: {
        exit: ['clearErrorMessage'],
        on: {
          SCROLL_TO_BOTTOM: 'fetchingUsers',
        },
      },
      checkingIfThereIsMoreData: {
        always: [
          {
            cond: 'thereIsMoreData',
            target: 'idle',
          },
          {
            target: 'noMoreDataToFetch',
          },
        ],
      },
      noMoreDataToFetch: {
        type: 'final',
      },
    },
  },
  {
    guards: {
      thereIsMoreData: context => {
        return context.total > context.data.length;
      },
    },
    services: {
      fetchingUsers: fetchingUsersService,
    },
    actions: {
      assignDataToContext: assign((context, event) => {
        if (event.type !== 'RECEIVED_DATA') {
          return {};
        }

        return {
          data: [...context.data, ...event.data],
          total: event.total,
          skip: context.skip + context.limit,
        };
      }),
      clearErrorMessage: assign(context => ({
        errorMessage: undefined,
      })),
      assignErrorMessageToContext: assign((context, event: any) => {
        return {
          errorMessage: event.data?.message || 'Something went wrong',
        };
      }),
    },
  },
);

export default usersInfiniteScrollMachine;
