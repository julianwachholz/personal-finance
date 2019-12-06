import padEnd from "lodash/padEnd";
import React from "react";
import "./Money.scss";

export interface IMoney {
  amount: string;
  currency: string;
}

interface IMoneyProps {
  value: IMoney;
  groupSeparator?: string;
  decimalSeparator?: string;
  precision?: number;
}

// Parts from:
// https://github.com/ant-design/ant-design/blob/f7d211fcea4655baf5fe1ad9f1efadc2e158fda5/components/statistic/Number.tsx

const Money: React.FC<IMoneyProps> = ({
  value,
  groupSeparator = ",",
  decimalSeparator = ".",
  precision
}) => {
  let amount: React.ReactNode;
  const cells = value.amount.match(/^(-?)(\d*)(\.(\d+))?$/);

  if (!cells) {
    amount = value.amount;
  } else {
    const negative = cells[1];
    let int = cells[2] || "0";
    let decimal = cells[4] || "";
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);

    if (typeof precision === "number") {
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

  return (
    <span className="money">
      <span className="amount">{amount}</span>
      <span className="currency">{value.currency}</span>
    </span>
  );
};

export default Money;
