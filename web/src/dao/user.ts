import { prefetchQuery, useQuery } from "react-query";
import { authFetch, clearToken, FetchItem } from "./base";

export interface User {
  pk: number;
  username: string;
  email?: string;
  firstname?: string;
  lastname?: string;

  readonly isActive: boolean;
  readonly lastLogin: Date;
  readonly dateJoined: Date;
}

const fetchUser: FetchItem<User, {}> = async () => {
  const url = `/api/auth/user/`;
  const response = await authFetch(url);
  if (!response.ok) {
    if (response.status === 401) {
      return null;
    }
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
};

export const prefetchUser = () => {
  prefetchQuery("user", fetchUser);
};

export const useUser = () => {
  const query = useQuery("user", fetchUser, {
    retry: false,
    refetchOnWindowFocus: false
  } as any);
  return query;
};

export const postLogin = async (params: Record<string, string>) => {
  const url = `/api/auth/login/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(params)
  });
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
};

export const postLogout = async () => {
  const url = `/api/auth/logout/`;
  const response = await authFetch(url, {
    method: "POST"
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  clearToken();
};
