import {
  authFetch,
  makeItemAction,
  makeItemsAction,
  makePostItem,
  makePutItem,
  makeUseItem
} from "./base";

export interface ImportFile {
  readonly pk: number;
  readonly label: string;
  readonly type: string;
  readonly datetime: Date;
  readonly headers?: string[];
  readonly matching_configs?: ImportConfig<string>[];
}

export interface ImportConfig<M = ColumnMapping> {
  readonly pk: number;
  readonly last_use: Date;
  file_type: string;
  mappings: M[];
}

export type ColumnMappingTarget =
  | "datetime"
  | "account"
  | "amount"
  | "category"
  | "text"
  | "payee"
  // | "tags"
  | "reference";

export interface ColumnMapping {
  target: ColumnMappingTarget;
  is_sourced: boolean;
  source?: string;
  options?: ColumnMappingOptions;
}

interface ColumnMappingOptions {
  value?: any;
  decimal_separator?: string;
  dayfirst?: boolean;
  yearfirst?: boolean;
}

export const deleteUploadedFile = async (pk: number) => {
  const response = await authFetch(`/api/import/file/${pk}/`, {
    method: "DELETE"
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
};

export const useImportConfig = makeUseItem<ImportConfig>("import/config");
export const postImportConfig = makePostItem<ImportConfig>("import/config");
export const putImportConfig = makePutItem<ImportConfig>("import/config");

interface GetUnmappedValues {
  pk: number;
  file: number;
}

export type ValueMappingModel = "account" | "payee" | "category"; // TODO tags

type FileUnmappedValues = {
  [M in ValueMappingModel]?: string[];
};

export const fetchUnmappedValues = makeItemAction<
  GetUnmappedValues,
  FileUnmappedValues
>("import/config", "unmapped_values", "GET");

export interface ValueMapping {
  model: ValueMappingModel;
  value: string;
  object_id: number;
}

export const postValueMapping = makeItemsAction<ValueMapping>(
  "import",
  "mapping"
);

export const bulkPostValueMapping = makeItemsAction<ValueMapping[]>(
  "import/mapping",
  "bulk_create"
);
