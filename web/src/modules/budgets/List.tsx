import { DeleteFilled, FormOutlined, ProjectOutlined } from "@ant-design/icons";
import { Button, Col, List, Progress, Row } from "antd";
import { SwipeAction } from "antd-mobile";
import React from "react";
import { isMobile, MobileView } from "react-device-detect";
import { useMutation } from "react-query";
import { Link, useHistory } from "react-router-dom";
import Fab from "../../components/button/Fab";
import Money from "../../components/data/Money";
import { Budget, deleteBudget, useBudgets } from "../../dao/budgets";
import { COLOR_DANGER, COLOR_PRIMARY } from "../../utils/constants";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeleteBudget } from "./delete";

const renderItem = (budget: Budget) => (
  <List.Item
    actions={
      isMobile
        ? undefined
        : [
            <Link key="edit" to={`/budgets/${budget.pk}/edit`}>
              Edit
            </Link>
          ]
    }
  >
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
);

const Budgets = () => {
  const { data: budgets, isLoading } = useBudgets();
  const history = useHistory();
  const [doDelete] = useMutation(deleteBudget, {
    refetchQueries: ["items/budgets"]
  });

  useTitle(`Budgets`);
  return (
    <BaseModule
      title="Budgets"
      extra={[
        <Button key="create" type="primary">
          <Link to={`/budgets/create`}>Create Budget</Link>
        </Button>
      ]}
    >
      <MobileView>
        <Fab
          icon={<ProjectOutlined rotate={180} />}
          onClick={() => {
            history.push(`/budgets/create`);
          }}
        />
      </MobileView>
      <List
        loading={isLoading}
        grid={isMobile ? undefined : { gutter: 32, column: 2 }}
        dataSource={budgets?.results}
        renderItem={budget => {
          if (isMobile) {
            return (
              <SwipeAction
                left={
                  [
                    {
                      text: <DeleteFilled />,
                      style: {
                        background: COLOR_DANGER,
                        color: "#fff",
                        minWidth: 60
                      },
                      onPress() {
                        confirmDeleteBudget(budget, doDelete);
                      }
                    }
                  ] as any
                }
                right={
                  [
                    {
                      text: <FormOutlined />,
                      style: {
                        background: COLOR_PRIMARY,
                        color: "#fff",
                        minWidth: 60
                      },
                      onPress() {
                        history.push(`/budgets/${budget.pk}/edit`);
                      }
                    }
                  ] as any
                }
              >
                {renderItem(budget)}
              </SwipeAction>
            );
          }
          return renderItem(budget);
        }}
      />
    </BaseModule>
  );
};

export default Budgets;
