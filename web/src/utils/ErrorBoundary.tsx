import { Alert } from "antd";
import React from "react";

interface ErrorBoundaryState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary", error, info);
  }

  render() {
    return this.state.error ? (
      <Alert
        type="error"
        message={`Error: ${this.state.error.message}`}
        closeText="Try again"
        onClose={() => this.setState({ error: null })}
        showIcon
      />
    ) : (
      this.props.children
    );
  }
}
