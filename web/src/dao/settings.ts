import { authFetch } from "./base";

export interface Settings {
  default_currency: string;
  default_debit_account?: number;
  default_credit_account?: number;
  date_format: string;
}

export const putSettings = async (data: Settings) => {
  const url = `/api/settings/`;
  const response = await authFetch(url, {
    method: "PUT",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const responseData = await response.json();
  return responseData;
};

export const patchSettings = async (data: Partial<Settings>) => {
  const url = `/api/settings/`;
  const response = await authFetch(url, {
    method: "PATCH",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const responseData = await response.json();
  return responseData;
};