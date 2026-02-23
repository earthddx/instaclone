import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Colors from "../constants/colors";

/**
 * General-purpose error boundary.
 *
 * Props:
 *   children  – content to protect
 *   fallback  – optional JSX or render function ({ reset }) => JSX
 *               If omitted, the full-screen DefaultFallback is shown.
 *   onError   – optional (error, info) => void called when an error is caught
 */
export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.props.onError?.(error, info);
    if (__DEV__) {
      console.error("[ErrorBoundary caught]", error);
      console.error(info.componentStack);
    }
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;

    const { fallback } = this.props;
    if (typeof fallback === "function") return fallback({ reset: this.reset });
    if (fallback != null) return fallback;
    return <DefaultFallback onReset={this.reset} />;
  }
}

// ─── Full-screen fallback (used at root level) ────────────────────────────────

function DefaultFallback({ onReset }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.primary[100],
        justifyContent: "center",
        alignItems: "center",
        padding: 36,
      }}
    >
      <Ionicons name="warning-outline" size={60} color={Colors.muted.DEFAULT} />
      <Text
        style={{
          color: "#fff",
          fontSize: 19,
          fontWeight: "700",
          marginTop: 20,
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        Something went wrong
      </Text>
      <Text
        style={{
          color: Colors.muted.DEFAULT,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 21,
          marginBottom: 32,
        }}
      >
        An unexpected error occurred.{"\n"}Please try again.
      </Text>
      <TouchableOpacity
        onPress={onReset}
        style={{
          backgroundColor: Colors.highlight,
          paddingHorizontal: 30,
          paddingVertical: 13,
          borderRadius: 10,
        }}
        activeOpacity={0.8}
      >
        <Text style={{ color: "#fff", fontSize: 15, fontWeight: "600" }}>
          Try again
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Compact card fallback (used per-post in the feed) ────────────────────────

export function CardErrorFallback() {
  return (
    <View
      style={{
        backgroundColor: Colors.primary[200],
        borderRadius: 16,
        marginTop: 16,
        marginBottom: 8,
        marginHorizontal: 16,
        borderWidth: 1,
        borderColor: Colors.primary[300],
        paddingVertical: 36,
        alignItems: "center",
        gap: 8,
      }}
    >
      <Ionicons name="alert-circle-outline" size={38} color={Colors.muted.DEFAULT} />
      <Text style={{ color: Colors.muted.DEFAULT, fontSize: 13 }}>
        This post couldn't be loaded
      </Text>
    </View>
  );
}
