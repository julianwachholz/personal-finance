import padEnd from "lodash/padEnd";
import React from "react";
import { useAuth } from "../../utils/AuthProvider";
import "./Money.scss";

interface Currency {
  code: string;
  name: string;
  prefix?: string;
  suffix?: string;
}

export const CURRENCY_FORMATS: Record<string, Currency> = {
  AUD: { code: "AUD", name: "Australian Dollar", prefix: "A$" },
  CAD: { code: "CAD", name: "Canadian Dollar", prefix: "C$" },
  CHF: { code: "CHF", name: "Swiss Franc", prefix: "Fr. " },
  CNY: { code: "CNY", name: "Chinese Yuan", prefix: "元" },
  CZK: { code: "CZK", name: "Czech Koruna", suffix: " Kč" },
  DKK: { code: "DKK", name: "Danish Krone", suffix: " Dkr" },
  EUR: { code: "EUR", name: "Euro", suffix: " €" },
  GBP: { code: "GBP", name: "British Pound Sterling", prefix: "£" },
  HKD: { code: "HKD", name: "Hong Kong Dollar", prefix: "HK$" },
  HUF: { code: "HUF", name: "Hungarian Forint", prefix: "Ft" },
  INR: { code: "INR", name: "Indian Rupees", prefix: "₹" },
  JPY: { code: "JPY", name: "Japanese Yen", prefix: "¥" },
  KRW: { code: "KRW", name: "South Korean Won", prefix: "₩" },
  MXN: { code: "MXN", name: "Mexican Peso", prefix: "Mex$" },
  NOK: { code: "NOK", name: "Norwegian Krone", suffix: " Nkr" },
  NZD: { code: "NZD", name: "New Zealand Dollar", prefix: "NS$" },
  PLN: { code: "PLN", name: "Polish Zloty", suffix: " zł" },
  RUB: { code: "RUB", name: "Russian Ruble", suffix: "₽" },
  SEK: { code: "SEK", name: "Swedish Krona", suffix: " Skr" },
  THB: { code: "THB", name: "Thai Baht", prefix: "฿" },
  USD: { code: "USD", name: "U.S. Dollar", prefix: "$" }
};

export interface Money {
  amount: string;
  currency: string;
}

interface MoneyProps {
  value: Money;
  precision?: number;
}

// Parts from:
// https://github.com/ant-design/ant-design/blob/f7d211fcea4655baf5fe1ad9f1efadc2e158fda5/components/statistic/Number.tsx

const Money = ({ value, precision }: MoneyProps) => {
  const { settings } = useAuth();
  let amount: React.ReactNode;
  const cells = value.amount.match(/^(-?)(\d*)(\.(\d+))?$/);

  const groupSeparator = settings?.group_separator ?? "\xa0";
  const decimalSeparator = settings?.decimal_separator ?? ".";

  if (!cells) {
    amount = value.amount;
  } else {
    const negative = cells[1];
    let int = cells[2] || "0";
    let decimal = cells[4] || "";
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

    if (precision) {
      decimal = padEnd(decimal, precision, "0").slice(0, precision);
    }
    if (decimal) {
      decimal = `${decimalSeparator}${decimal}`;
    }
    amount = [
      <span key="int" className={`value-int`}>
        {negative}
        {int}
      </span>,
      decimal && (
        <span key="decimal" className={`value-decimal`}>
          {decimal}
        </span>
      )
    ];
  }

  const format = CURRENCY_FORMATS[value.currency];

  return (
    <span className="money">
      <span className="currency prefix">{format.prefix}</span>
      <span className="amount">{amount}</span>
      <span className="currency suffix">{format.suffix}</span>
    </span>
  );
};

export default Money;
