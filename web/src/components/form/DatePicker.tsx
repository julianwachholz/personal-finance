import generatePicker from "antd/lib/date-picker/generatePicker";
import {
  addDays,
  addMonths,
  addYears,
  format,
  getWeek,
  isAfter,
  isValid,
  parse,
  setDate,
  setHours,
  setMinutes,
  setMonth,
  setSeconds,
  setYear
} from "date-fns";
import { enUS } from "date-fns/locale";
import { GenerateConfig } from "rc-picker/lib/generate";

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
        console.info("localize day ", day);
        return enUS.localize.day(day, { width: "abbreviated" });
      });
    },
    getShortMonths: locale => {
      return Array.from({ length: 12 }).map((_, month) =>
        enUS.localize.month(month, { width: "abbreviated" })
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

const DatePicker = generatePicker<Date>(generateConfig);
export default DatePicker;
