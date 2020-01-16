import { authFetch, RelatedModel } from "./base";

export interface Settings {
  default_currency: string;
  default_debit_account: RelatedModel | null;
  default_credit_account: RelatedModel | null;
  default_credit_category: RelatedModel | null;
  decimal_separator: string;
  group_separator: string;
  use_colors: boolean;
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
