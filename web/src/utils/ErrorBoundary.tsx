import * as Sentry from "@sentry/browser";
import { Button, Result } from "antd";
import React, { Component } from "react";
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
        <Result
          status="500"
          title="Oops..."
          subTitle="We're sorry, something's gone wrong."
          extra={[
            <p key="0">
              We are experiencing some technical difficulties, please try again
              later.
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
              Report Feedback
            </Button>,
            <Button
              key="2"
              onClick={() => {
                window.location.reload();
              }}
            >
              Reload Page
            </Button>
          ]}
        />
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
