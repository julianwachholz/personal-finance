import { Input } from "antd";
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
import { enUS } from "date-fns/locale";
import { GenerateConfig } from "rc-picker/lib/generate";
import React from "react";
import { isMobile } from "react-device-detect";
import { useAuth } from "../../utils/AuthProvider";
import { useSettings } from "../../utils/SettingsProvider";

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
    getWeekFirstDay: locale => 1,
    getWeek: (locale, date) => getWeek(date),
    getShortWeekDays: locale => {
      return Array.from({ length: 7 }).map((_, day) => {
        return enUS.localize!.day(day, { width: "abbreviated" });
      });
    },
    getShortMonths: locale => {
      return Array.from({ length: 12 }).map((_, month) =>
        enUS.localize!.month(month, { width: "abbreviated" })
      );
    },
    format: (locale, date, fmt) => {
      fmt = fmt.replace("YYYY", "yyyy");
      fmt = fmt.replace("DD", "dd");
      return format(date, fmt, { locale: enUS });
    },
    parse: (locale, text, formats) => {
      const fmt = formats[0].toLowerCase();
      return parse(text, fmt, new Date());
    }
  }
};

const BaseDatePicker = generatePicker<Date>(generateConfig);

const DatePicker = (props: PickerProps<Date>) => {
  const { tableSize } = useSettings();
  const { settings } = useAuth();
  const now = new Date();

  if (isMobile) {
    const inputProps = {
      value: props.value ? format(props.value, "yyyy-MM-dd") : undefined,
      defaultValue: props.defaultValue
        ? format(props.defaultValue, "yyyy-MM-dd")
        : undefined,
      onChange(e: any) {
        const date = set(parseISO(e.target.value), {
          hours: props.value?.getHours() ?? now.getHours(),
          minutes: props.value?.getMinutes() ?? now.getMinutes(),
          seconds: props.value?.getSeconds() ?? now.getSeconds()
        });
        props.onChange?.(
          date,
          format(date, settings?.date_format ?? "yyyy-MM-dd")
        );
      }
    };
    return <Input type="date" {...inputProps} />;
  }
  return (
    <BaseDatePicker
      format={settings?.date_format}
      size={tableSize}
      {...props}
    />
  );
};

export default DatePicker;
