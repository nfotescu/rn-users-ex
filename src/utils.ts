import { User } from "./types/user";

export function getUserFullName (user: User): string {
    return `${user.firstName} ${user.lastName}`;
};