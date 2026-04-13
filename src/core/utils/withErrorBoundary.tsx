import React, { ComponentType } from 'react';
import { ErrorBoundary } from '../presentation/components/ErrorBoundary';

/**
 * Higher-order component that wraps a given component inside an ErrorBoundary.
 * This ensures that errors within the wrapped component are caught and handled
 * without crashing the parent component tree.
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: ComponentType<P>,
  featureName?: string
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary featureName={featureName}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  // Set the display name for easier debugging in React DevTools
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;

  return WithErrorBoundary;
}
