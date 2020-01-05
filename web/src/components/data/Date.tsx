import { format } from "date-fns";
import React from "react";
import { useAuth } from "../../utils/AuthProvider";

interface DateTimeProps {
  value: Date;
  formatString?: string;
  locale?: any;
}

const DateTime = ({ value, formatString, locale }: DateTimeProps) => {
  const { settings } = useAuth();
  formatString = formatString ?? settings?.date_format ?? "PP";

  if (!value) {
    return <time />;
  }
  const str = format(value, "Pp", { locale });
  return (
    <time dateTime={str} title={str}>
      {format(value, formatString, { locale })}
    </time>
  );
};

export default DateTime;
