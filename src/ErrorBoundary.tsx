import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function ErrorBoundarySample() {
  return (
    <ErrorBoundary fallback={<p>⚠️Something went wrong</p>}>
      <AddCommentButton />
    </ErrorBoundary>
  );
}

function AddCommentButton() {
  const [, setState] = useState();

  return (
    <button
      onClick={() => {
        setState(() => {
          throw new Error(
            "Example Error: An error thrown to trigger error boundary"
          );
        });
      }}
    >
      Break it
    </button>
  );
}
