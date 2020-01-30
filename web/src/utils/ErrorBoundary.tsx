import * as Sentry from "@sentry/browser";
import { Button, Result } from "antd";
import React, { Component } from "react";
import { Translation } from "react-i18next";
import { AuthContext } from "./AuthProvider";

interface ErrorBoundaryState {
  hasError?: boolean;
  eventId?: string;
}

class ErrorBoundary extends Component<{}, ErrorBoundaryState> {
  static contextType = AuthContext;

  constructor(props: any) {
    super(props);
    this.state = { eventId: undefined };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState({ eventId });
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Translation>
          {t => (
            <Result
              status="500"
              title={t("error.500.title", "Oops...")}
              subTitle={t(
                "error.500.message",
                "We're sorry, something's gone wrong."
              )}
              extra={[
                <p key="0">
                  {t(
                    "error.500.description",
                    "We are experiencing some technical difficulties, please try again later."
                  )}
                </p>,
                <Button
                  key="1"
                  onClick={() =>
                    Sentry.showReportDialog({
                      eventId: this.state.eventId,
                      user: {
                        email: this.context.user?.email,
                        name: this.context.user?.username
                      }
                    })
                  }
                >
                  {t("error.500.give_feedback", "Give feedback")}
                </Button>,
                <Button
                  key="2"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  {t("error.500.reload_page", "Reload page")}
                </Button>
              ]}
            />
          )}
        </Translation>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
