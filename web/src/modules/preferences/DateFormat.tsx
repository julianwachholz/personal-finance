import { Button } from "antd";
import { FormInstance } from "antd/lib/form";
import Input, { InputProps } from "antd/lib/input";
import Radio, { RadioGroupProps } from "antd/lib/radio";
import { format } from "date-fns";
import { de, enUS, pl } from "date-fns/locale";
import React from "react";
import { useTranslation } from "react-i18next";

const dateFormats: string[] = ["yyyy-MM-dd", "MM/dd", "MMM d", "PPP"];

const locales: Record<string, Locale> = {
  en: enUS,
  de,
  pl
};

export const InputFormat = ({ value, ...props }: InputProps) => {
  const [t, i18n] = useTranslation("preferences");
  const now = new Date();
  return (
    <Input
      addonAfter={
        t("preferences:date_format_preview", "Preview:") +
        " " +
        (value
          ? format(now, value as string, {
              locale: locales[i18n.language],
              useAdditionalDayOfYearTokens: true,
              useAdditionalWeekYearTokens: true
            })
          : "")
      }
      value={value}
      {...props}
    />
  );
};

interface DateFormatButtonsProps {
  onChange: ({ date_format }: { date_format: string }) => void;
  form?: FormInstance;
}

export const DateFormatButtons = ({
  onChange,
  form
}: DateFormatButtonsProps) => {
  const { i18n } = useTranslation();
  const now = new Date();
  const locale = locales[i18n.language];

  return (
    <Button.Group>
      {dateFormats.map(date_format => (
        <Button
          key={date_format}
          type="ghost"
          onClick={() => {
            form?.setFieldsValue({ date_format });
            onChange({ date_format });
          }}
        >
          {format(now, date_format, { locale })}
        </Button>
      ))}
    </Button.Group>
  );
};

export const DateFormatRadio = (props: RadioGroupProps) => {
  const { i18n } = useTranslation();
  const now = new Date();
  const locale = locales[i18n.language];

  return (
    <Radio.Group {...props}>
      {dateFormats.map(date_format => (
        <Radio.Button key={date_format} value={date_format}>
          {format(now, date_format, { locale })}
        </Radio.Button>
      ))}
    </Radio.Group>
  );
};
