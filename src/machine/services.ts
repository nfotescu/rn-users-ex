import { Sender } from 'xstate';
import {User} from '../types/user';
import {USERS_API_URL} from './constants';
import { UsersFetchResponse, UsersInfiniteScrollMachineContext, UsersInfiniteScrollMachineEvent } from './types';

export const fetchUserService = async (id: number) => {
  const response = await fetch(`${USERS_API_URL}/${id}`);
  const data = (await response.json()) as User;
  return data;
};

export const fetchingUsersService = (context: UsersInfiniteScrollMachineContext) => async (send: Sender<UsersInfiniteScrollMachineEvent>) => {
    const {skip, limit} = context;
    const response = await fetch(`${USERS_API_URL}?limit=${limit}&skip=${skip}`);
    const data = (await response.json()) as UsersFetchResponse;

    send({type: 'RECEIVED_DATA', data: data.users, total: data.total});
  }
