import { prefetchQuery, useQuery } from "react-query";
import { getAuthToken } from "../dao/base";
import { authFetch, clearToken, FetchItem } from "./base";
import { Settings } from "./settings";

export interface User {
  pk: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;

  readonly settings: Settings;
  readonly date_joined: Date;
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

const isPossiblyAuthenticated = () => getAuthToken() !== null;

export const prefetchUser = () => {
  isPossiblyAuthenticated() && prefetchQuery("user", fetchUser);
};

export const useUser = () => {
  const query = useQuery(isPossiblyAuthenticated() && "user", fetchUser, {
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
  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error(response.statusText);
  }
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
