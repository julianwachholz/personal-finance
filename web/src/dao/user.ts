import { prefetchQuery, useQuery } from "react-query";
import {
  getAuthToken,
  isTokenValid,
  makeItemsAction,
  makePostItem,
  makePutItem
} from "../dao/base";
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

export const isPossiblyAuthenticated = () => {
  return isTokenValid() && getAuthToken() !== null;
};

export const prefetchUser = () => {
  isPossiblyAuthenticated() && prefetchQuery("user", fetchUser);
};

export const useUser = (isAuthenticated?: boolean) => {
  if (!isAuthenticated) {
    isAuthenticated = isPossiblyAuthenticated();
  }
  const query = useQuery(isAuthenticated && "user", fetchUser, {
    retry: false,
    refetchOnWindowFocus: false
  } as any);
  return query;
};

export const postUser = makePostItem<User>("auth/register");
export const putUser = makePutItem<User>("auth/user", { noId: true });

interface VerifyEmail {
  token: string;
}
export const postVerifyEmail = makeItemsAction<VerifyEmail>(
  "auth/user",
  "verify"
);

interface ForgotPassword {
  email: string;
}
export const postForgotPassword = makeItemsAction<ForgotPassword>(
  "auth",
  "forgot-password"
);

export interface ResetPasswordProps {
  token: string;
  new_password: string;
}

export const postResetPassword = makeItemsAction<ResetPasswordProps>(
  "auth",
  "reset-password"
);

export const postLogin = async (params: Record<string, string>) => {
  const url = `/api/auth/login/`;
  const response = await authFetch(url, {
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
