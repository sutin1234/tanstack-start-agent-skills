import type { Result } from "better-result";
import { safeDelete, safeFetch, safePost, safePut } from "~/lib/api";
import type { FetchError } from "~/lib/errors";
import type { User } from "~/types/users.type";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export async function fetchUsers(): Promise<Result<User[], FetchError>> {
    return safeFetch<User[]>(`${API_BASE_URL}/users`);
}

export async function fetchUserById(
    id: number
): Promise<Result<User, FetchError>> {
    return safeFetch<User>(`${API_BASE_URL}/users/${id}`);
}

export async function fetchUserPosts(
    id: number
): Promise<Result<User[], FetchError>> {
    return safeFetch<User[]>(`${API_BASE_URL}/users/${id}/posts`);
}

export async function createUser(data: User): Promise<Result<User, FetchError>> {
    return safePost<User>(`${API_BASE_URL}/users`, data);
}

export async function updateUser(id: number, data: User): Promise<Result<User, FetchError>> {
    return safePut<User>(`${API_BASE_URL}/users/${id}`, data);
}

export async function deleteUser(id: number): Promise<Result<User, FetchError>> {
    return safeDelete<User>(`${API_BASE_URL}/users/${id}`);
}   