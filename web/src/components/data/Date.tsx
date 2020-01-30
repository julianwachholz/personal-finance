import { format } from "date-fns";
import { de, enUS, pl } from "date-fns/locale";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/AuthProvider";

interface DateTimeProps {
  value: Date;
  format?: string;
}

const locales: Record<string, Locale> = {
  en: enUS,
  de,
  pl
};

const DateTime = ({ value, format: fmt }: DateTimeProps) => {
  const { i18n } = useTranslation();
  const { settings } = useAuth();
  if (!fmt) {
    fmt = settings?.date_format;
    if (!fmt) {
      fmt = "PP";
    }
  }

  const locale = locales[i18n.language];

  if (!value) {
    return <time />;
  }
  const str = format(value, "Pp", { locale });
  return (
    <time dateTime={str} title={str}>
      {format(value, fmt, { locale })}
    </time>
  );
};

export default DateTime;
