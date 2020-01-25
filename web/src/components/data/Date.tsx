import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/AuthProvider";

interface DateTimeProps {
  value: Date;
}

const locales: Record<string, Locale> = {
  en: enUS,
  de
};

const DateTime = ({ value }: DateTimeProps) => {
  const { i18n } = useTranslation();
  const { settings } = useAuth();
  let formatString = settings?.date_format;
  if (!formatString) {
    formatString = "PP";
  }

  const locale = locales[i18n.language];

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
