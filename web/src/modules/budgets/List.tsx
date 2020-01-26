import { DeleteFilled, FormOutlined, ProjectOutlined } from "@ant-design/icons";
import { Button, Col, List, Progress, Row } from "antd";
import { SwipeAction } from "antd-mobile";
import { TFunction } from "i18next";
import React from "react";
import { isMobile, MobileView } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { Link, RouteComponentProps } from "react-router-dom";
import Fab from "../../components/button/Fab";
import DateTime from "../../components/data/Date";
import Money from "../../components/data/Money";
import {
  Budget,
  BudgetPeriod,
  deleteBudget,
  useBudgets
} from "../../dao/budgets";
import { COLOR_DANGER, COLOR_PRIMARY } from "../../utils/constants";
import useTitle from "../../utils/useTitle";
import BaseModule from "../base/BaseModule";
import { confirmDeleteBudget } from "./delete";

const renderItem = (budget: Budget, t: TFunction) => {
  const periodFormat: Record<BudgetPeriod, string> = {
    [BudgetPeriod.WEEKLY]: t("budgets:period_format_weekly", "'Week' w, yyyy"),
    [BudgetPeriod.MONTHLY]: t("budgets:period_format_monthly", "MMMM yyyy"),
    [BudgetPeriod.QUARTERLY]: t("budgets:period_format_quarterly", "QQQ yyyy"),
    [BudgetPeriod.YEARLY]: t("budgets:period_format_yearly", "yyyy")
  };

  return (
    <List.Item
      actions={
        isMobile
          ? undefined
          : [
              <Link key="edit" to={`/budgets/${budget.pk}/edit`}>
                {t("translation:inline.edit", "Edit")}
              </Link>
            ]
      }
    >
      <List.Item.Meta
        title={budget.name}
        description={
          <DateTime value={new Date()} format={periodFormat[budget.period]} />
        }
      />
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
          {t("budgets:progress_target", "Target:")}{" "}
          <Money
            value={{
              amount: budget.target,
              currency: budget.target_currency
            }}
          />
        </Col>
        <Col span={12}>
          {t("budgets:progress_remaining", "Remaining:")}{" "}
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
};

const Budgets = ({ history }: RouteComponentProps) => {
  const [t] = useTranslation("budgets");
  const { data: budgets, isLoading } = useBudgets();
  const [doDelete] = useMutation(deleteBudget, {
    refetchQueries: ["items/budgets"]
  });

  useTitle(t("budgets:budget_plural", "Budgets"));
  return (
    <BaseModule
      title={t("budgets:budget_plural", "Budgets")}
      extra={[
        <Button key="create" type="primary">
          <Link to={`/budgets/create`}>
            {t("budgets:create", "Create Budget")}
          </Link>
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
                        confirmDeleteBudget(budget, doDelete, t);
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
                {renderItem(budget, t)}
              </SwipeAction>
            );
          }
          return renderItem(budget, t);
        }}
      />
    </BaseModule>
  );
};

export default Budgets;
