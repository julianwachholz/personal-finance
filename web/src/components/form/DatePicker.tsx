import { Input } from "antd";
import { default as ant_de } from "antd/es/date-picker/locale/de_DE";
import { default as ant_en } from "antd/es/date-picker/locale/en_US";
import generatePicker, {
  PickerProps
} from "antd/lib/date-picker/generatePicker";
import {
  addDays,
  addMonths,
  addYears,
  format,
  getWeek,
  isAfter,
  isValid,
  parse,
  parseISO,
  set,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setSeconds,
  setYear
} from "date-fns";
import { de, enUS } from "date-fns/locale";
import { GenerateConfig } from "rc-picker/lib/generate";
import React from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";

const antLocales: Record<string, any> = {
  en: ant_en,
  de: ant_de
};
const dateFnLocales: Record<string, Locale> = {
  de_DE: de,
  en_US: enUS
};

const generateConfig: GenerateConfig<Date> = {
  getNow: () => new Date(),
  getWeekDay: date => date.getDay(),
  getYear: date => date.getFullYear(),
  getMonth: date => date.getMonth(),
  getDate: date => date.getDate(),
  getHour: date => date.getHours(),
  getMinute: date => date.getMinutes(),
  getSecond: date => date.getSeconds(),

  addYear: (date, diff) => addYears(date, diff),
  addMonth: (date, diff) => addMonths(date, diff),
  addDate: (date, diff) => addDays(date, diff),
  setYear: (date, year) => setYear(date, year),
  setMonth: (date, month) => setMonth(date, month),
  setDate: (date, num) => setDate(date, num),
  setHour: (date, hour) => setHours(date, hour),
  setMinute: (date, minute) => setMinutes(date, minute),
  setSecond: (date, second) => setSeconds(date, second),

  isAfter: (date1, date2) => isAfter(date1, date2),
  isValidate: date => isValid(date),

  locale: {
    getWeekFirstDay: locale => dateFnLocales[locale].options?.weekStartsOn ?? 1,
    getWeek: (locale, date) => getWeek(date, { locale: dateFnLocales[locale] }),
    getShortWeekDays: locale => {
      return Array.from({ length: 7 }).map((_, day) => {
        return dateFnLocales[locale].localize!.day(day, {
          width: "abbreviated"
        });
      });
    },
    getShortMonths: locale => {
      return Array.from({ length: 12 }).map((_, month) =>
        dateFnLocales[locale].localize!.month(month, { width: "abbreviated" })
      );
    },
    format: (locale, date, fmt) => {
      fmt = fmt.replace("YYYY", "yyyy");
      fmt = fmt.replace("DD", "dd");
      return format(date, fmt, { locale: dateFnLocales[locale] });
    },
    parse: (locale, text, formats) => {
      const fmt = formats[0].toLowerCase();
      return parse(text, fmt, new Date(), { locale: dateFnLocales[locale] });
    }
  }
};

const BaseDatePicker = generatePicker<Date>(generateConfig);

const DatePicker = (props: PickerProps<Date>) => {
  const { i18n } = useTranslation();
  const { tableSize } = useSettings();
  const { settings } = useAuth();
  const now = new Date();

  let value = props.value;

  if (isMobile) {
    if (typeof value === "string") {
      value = parseISO(value);
    }
    let valueString: string | undefined;
    try {
      valueString = value ? format(value, "yyyy-MM-dd") : undefined;
    } catch (e) {}

    const inputProps = {
      value: valueString,
      defaultValue: props.defaultValue
        ? format(props.defaultValue, "yyyy-MM-dd")
        : undefined,
      onChange(e: any) {
        const date = set(parseISO(e.target.value), {
          hours: value?.getHours() ?? now.getHours(),
          minutes: value?.getMinutes() ?? now.getMinutes(),
          seconds: value?.getSeconds() ?? now.getSeconds()
        });
        let dateString: string = "";
        try {
          dateString = format(date, settings?.date_format || "yyyy-MM-dd");
        } catch (e) {}
        props.onChange?.(date, dateString);
      }
    };
    return <Input type="date" {...inputProps} />;
  }
  return (
    <BaseDatePicker
      format={settings?.date_format}
      size={tableSize}
      locale={antLocales[i18n.language]}
      {...props}
    />
  );
};

export default DatePicker;
