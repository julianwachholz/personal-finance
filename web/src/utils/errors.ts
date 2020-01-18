import { notification } from "antd";
import { FormInstance } from "antd/lib/form";
import { ErrorResponse } from "../dao/base";

export const applyFormErrors = (
  form: FormInstance,
  error: Error | ErrorResponse
) => {
  if (error instanceof Error) {
    notification.error({
      message: "Error",
      description: error.message,
      duration: null
    });
    return;
  }

  const fieldData = Object.entries(error).map(([field, errors]) => ({
    name: field,
    errors: errors
  }));
  form.setFields(fieldData);

  if (error.non_field_errors) {
    notification.error({
      message: "Error",
      description: error.non_field_errors,
      duration: null
    });
  }
};
