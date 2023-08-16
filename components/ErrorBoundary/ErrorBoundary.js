import React from "react";
import { useRouter } from "next/router";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
 
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
 
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ color: "white" }}>Oops, there is an error!</h2>
          <button
          style={{ color: "white", outline: "none", background: "#1809ff" }}
            type="button"
            onClick={() => {
              this.setState({ hasError: false })
              useRouter().push("/")
            }}
          > 
            Back to Home
          </button>
        </div>
      );
    }
 
    // Return children components in case of no error
 
    return this.props.children;
  }
}
 
export default ErrorBoundary;