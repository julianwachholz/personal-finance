import { format } from "date-fns";
import React from "react";

interface DateTimeProps {
  value: Date;
  formatString?: string;
  locale?: any;
}

const DateTime = ({ value, formatString = "PP", locale }: DateTimeProps) => {
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
