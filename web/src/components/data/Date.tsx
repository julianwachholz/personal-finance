import { format } from "date-fns";
import React from "react";
import { useAuth } from "../../utils/AuthProvider";

interface DateTimeProps {
  value: Date;
  locale?: any;
}

const DateTime = ({ value, locale }: DateTimeProps) => {
  const { settings } = useAuth();
  let formatString = settings?.date_format;
  if (!formatString) {
    formatString = "PP";
  }

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
