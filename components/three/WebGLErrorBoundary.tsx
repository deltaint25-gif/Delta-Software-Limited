"use client";

import { Component, type ReactNode } from "react";

interface WebGLErrorBoundaryProps {
  children: ReactNode;
  /**
   * Rendered if the scene throws. Without one a WebGL failure — a lost
   * context, a driver the device can't honour — left a hole where the hero
   * visual should be; the caller passes the static mark so the composition
   * survives the crash.
   */
  fallback?: ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

export default class WebGLErrorBoundary extends Component<WebGLErrorBoundaryProps, WebGLErrorBoundaryState> {
  state: WebGLErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
