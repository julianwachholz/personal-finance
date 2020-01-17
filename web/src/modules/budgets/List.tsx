import { Col, List, Progress, Row } from "antd";
import React from "react";
import Money from "../../components/data/Money";
import { useBudgets } from "../../dao/budgets";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";

const Budgets = () => {
  const { data: budgets, isLoading } = useBudgets();

  useTitle(`Budgets`);
  return (
    <BaseModule title="Budgets">
      <List
        loading={isLoading}
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
        dataSource={budgets?.results}
        renderItem={budget => (
          <List.Item>
            <List.Item.Meta title={budget.name} />
            <Progress
              percent={budget.percentage}
              format={() => `${budget.percentage}%`}
              strokeWidth={14}
              // strokeColor={percent > 100 ? "#ff000" : undefined}
              // successPercent={0}
              status={budget.percentage > 100 ? "exception" : undefined}
            />
            <Row>
              <Col span={12}>
                Target:{" "}
                <Money
                  value={{
                    amount: budget.target,
                    currency: budget.target_currency
                  }}
                />
              </Col>
              <Col span={12}>
                Remaining:{" "}
                <Money
                  value={{
                    amount: budget.remaining_amount,
                    currency: budget.target_currency
                  }}
                />
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </BaseModule>
  );
};

export default Budgets;
